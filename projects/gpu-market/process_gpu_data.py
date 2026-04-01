#!/usr/bin/env python3
"""
显卡行情数据处理脚本
运行: python3 process_gpu_data.py [Excel文件路径]
输出:
  - data.json       : 通用JSON数据
  - src/data.js     : ES Module格式（Vite项目用）
  - excel_copy      : Excel原始文件副本（供下载）
"""

import zipfile
import xml.etree.ElementTree as ET
import json
import sys
import os
import shutil
import re

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

def parse_xlsx(filepath):
    with zipfile.ZipFile(filepath, 'r') as z:
        ss_xml = z.read('xl/sharedStrings.xml')
        ss_tree = ET.fromstring(ss_xml)
        ns = {'ns': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
        strings = []
        for si in ss_tree.findall('ns:si', ns):
            t = si.find('ns:t', ns)
            if t is not None:
                strings.append(t.text or '')
            else:
                # rich text with multiple runs
                runs = si.findall('ns:r', ns)
                if runs:
                    parts = [r.find('ns:t', ns) for r in runs]
                    strings.append(''.join(p.text for p in parts if p is not None))
                else:
                    # empty si
                    strings.append('')

        wb_xml = z.read('xl/workbook.xml')
        wb_tree = ET.fromstring(wb_xml)
        sheets_el = wb_tree.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}sheet')

        all_data = {}
        for i, sheet_elem in enumerate(sheets_el):
            sheet_name = sheet_elem.get('name', f'sheet{i+1}')
            sheet_xml = z.read(f'xl/worksheets/sheet{i+1}.xml')
            sheet_tree = ET.fromstring(sheet_xml)

            headers = None
            rows = []
            for row in sheet_tree.findall('.//ns:row', ns):
                row_data = []
                for cell in row.findall('ns:c', ns):
                    t = cell.get('t', '')
                    v = cell.find('ns:v', ns)
                    if v is None:
                        row_data.append('')
                    elif t == 's':
                        row_data.append(strings[int(v.text)])
                    else:
                        row_data.append(v.text)
                if headers is None:
                    headers = row_data
                else:
                    if row_data and row_data[0]:
                        rows.append(row_data)
            all_data[sheet_name] = {'headers': headers, 'rows': rows}
        return all_data


def detect_brand(name):
    n = name.lower()
    if 'nvidia' in n or n.startswith('rtx') or n.startswith('gtx'):
        return 'NVIDIA'
    elif 'amd' in n or n.startswith('rx'):
        return 'AMD'
    elif 'intel' in n or n.startswith('arc') or n.startswith('uhd'):
        return 'Intel'
    return 'Other'


def count_stars(s):
    """将 ★☆ 转换为数字 0-5"""
    if not s:
        return 0
    full = s.count('★')
    empty = s.count('☆')
    # 如果有其他字符，尝试正则
    if full == 0 and empty == 0:
        # 可能是纯数字评分
        try:
            return max(0, min(5, int(float(s))))
        except:
            return 0
    return full


def process_data(all_data):
    months = sorted(all_data.keys())
    month_labels = {
        '202512': '2025年12月', '202601': '2026年1月',
        '202602': '2026年2月', '202603': '2026年3月',
    }
    price_col_map = {
        '202512': ('11月价格', '12月价格'),
        '202601': ('12月价格', '1月价格'),
        '202602': ('1月价格', '2月价格'),
        '202603': ('2月价格', '3月价格'),
    }
    gpu_dict = {}
    base_score = 13619  # RTX 5060

    for month_key in months:
        data = all_data[month_key]
        headers = data['headers']

        def ci(name):
            try:
                return headers.index(name)
            except ValueError:
                return -1

        name_i   = ci('显卡型号')
        score_i  = ci('Time spy平均跑分')
        vram_i   = ci('显存容量')
        tdp_i    = ci('TDP功耗')
        prev_col, curr_col = price_col_map.get(month_key, (None, None))
        prev_i = ci(prev_col) if prev_col else -1
        curr_i = ci(curr_col) if curr_col else -1
        change_i = ci('涨跌幅')
        stars_i = ci('翻车概率')  # 星星列

        if name_i < 0 or score_i < 0:
            continue

        for row in data['rows']:
            if len(row) <= max(name_i, score_i, curr_i):
                continue
            name = row[name_i]
            if not name:
                continue

            score  = float(row[score_i]) if row[score_i] else 0
            vram   = row[vram_i] if vram_i < len(row) else ''
            tdp    = int(float(row[tdp_i])) if row[tdp_i] else 0
            curr   = int(float(row[curr_i])) if curr_i >= 0 and curr_i < len(row) and row[curr_i] else 0
            change = int(float(row[change_i])) if change_i >= 0 and change_i < len(row) and row[change_i] else 0
            stars_raw = row[stars_i] if stars_i >= 0 and stars_i < len(row) else ''
            stars = count_stars(stars_raw) if stars_raw else 0

            brand = detect_brand(name)
            month_label = month_labels.get(month_key, month_key)

            if name not in gpu_dict:
                gpu_dict[name] = {
                    'name': name, 'brand': brand, 'vram': vram, 'tdp': tdp,
                    'score': score, 'prices': {}, 'changes': {},
                    'performance_pct': round(score / base_score * 100, 1),
                    'stars': 0
                }
            gpu_dict[name]['prices'][month_label] = curr
            gpu_dict[name]['changes'][month_label] = change
            # 保留最高的星星数（多个月份中取最大）
            if stars > gpu_dict[name]['stars']:
                gpu_dict[name]['stars'] = stars

    for gpu in gpu_dict.values():
        latest = (gpu['prices'].get('2026年3月') or gpu['prices'].get('2026年2月') or
                  gpu['prices'].get('2026年1月') or gpu['prices'].get('2025年12月', 0))
        gpu['cost_perf'] = round(gpu['score'] / latest, 2) if latest > 0 else 0
        gpu['efficiency'] = round(gpu['score'] / gpu['tdp'], 1) if gpu['tdp'] > 0 else 0

    return list(gpu_dict.values()), months, month_labels


def generate_data_js(gpus, months, month_labels):
    """生成 ES Module 格式的 data.js"""
    src_dir = os.path.join(SCRIPT_DIR, 'src')
    os.makedirs(src_dir, exist_ok=True)

    months_out = [month_labels.get(m, m) for m in months]

    js_content = f'''// 由 process_gpu_data.py 自动生成，请勿手动修改
export const gpus = {json.dumps(gpus, ensure_ascii=False, indent=2)};
export const months = {json.dumps(months_out, ensure_ascii=False)};
'''

    path = os.path.join(src_dir, 'data.js')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(js_content)
    print(f'  ✅ src/data.js 已生成')


def main():
    if len(sys.argv) >= 2:
        excel_path = sys.argv[1]
    else:
        downloads = os.path.expanduser('~/.openclaw/qqbot/downloads')
        files = [f for f in os.listdir(downloads) if f.endswith('.xlsx') and '显卡' in f]
        if not files:
            print('❌ 未找到显卡Excel文件，请指定路径: python3 process_gpu_data.py <文件路径>')
            sys.exit(1)
        files.sort(key=lambda f: os.path.getmtime(os.path.join(downloads, f)), reverse=True)
        excel_path = os.path.join(downloads, files[0])

    print(f'📄 使用文件: {excel_path}')
    all_data = parse_xlsx(excel_path)
    gpus, months, month_labels = process_data(all_data)

    # 生成 data.json（通用）
    json_path = os.path.join(SCRIPT_DIR, 'data.json')
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump({'gpus': gpus, 'months': [month_labels.get(m, m) for m in months], 'raw_months': months}, f, ensure_ascii=False, indent=2)
    print(f'  ✅ data.json 已生成 ({len(gpus)} 张显卡, {len(months)} 个月)')

    # 生成 src/data.js（Vite项目用）
    generate_data_js(gpus, months, month_labels)

    # 复制Excel
    excel_dest = os.path.join(SCRIPT_DIR, '二手显卡行情.xlsx')
    shutil.copy2(excel_path, excel_dest)
    print(f'  ✅ 原始Excel已复制到: {excel_dest}')

    print()
    print('🎉 完成！')
    print('   开发调试: npm run dev')
    print('   构建单文件: npm run build（输出 dist/index.html）')


if __name__ == '__main__':
    main()

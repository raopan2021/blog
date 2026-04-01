#!/usr/bin/env python3
"""
显卡行情数据处理脚本
运行: python3 process_gpu_data.py [Excel文件路径]
输出:
  - data.json    : 显卡数据（供网页使用）
  - excel_copy   : Excel原始文件副本（供下载）
  - serve.py      : 一键启动HTTP服务（双击或 python3 serve.py 即可）
"""

import zipfile
import xml.etree.ElementTree as ET
import json
import sys
import os
import shutil

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DEFAULT_EXCEL = os.path.expanduser('~/.openclaw/qqbot/downloads/')

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
                parts = [r.find('ns:t', ns) for r in si.findall('ns:r', ns)]
                strings.append(''.join(p.text for p in parts if p is not None))

        wb_xml = z.read('xl/workbook.xml')
        wb_tree = ET.fromstring(wb_xml)
        sheets = wb_tree.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}sheet')

        all_data = {}
        for i, sheet_elem in enumerate(sheets):
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


def process_data(all_data):
    months = sorted(all_data.keys())
    month_labels = {
        '202512': '2025年12月',
        '202601': '2026年1月',
        '202602': '2026年2月',
        '202603': '2026年3月',
    }

    # 列名映射（处理列名差异）
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
        prev_i   = ci(prev_col) if prev_col else -1
        curr_i   = ci(curr_col) if curr_col else -1
        change_i = ci('涨跌幅')

        if name_i < 0 or score_i < 0:
            continue

        for row in data['rows']:
            if len(row) <= max(name_i, score_i, curr_i):
                continue
            name = row[name_i]
            if not name:
                continue

            score = float(row[score_i]) if row[score_i] else 0
            vram  = row[vram_i] if vram_i < len(row) else ''
            tdp   = int(float(row[tdp_i])) if row[tdp_i] else 0
            curr  = int(float(row[curr_i])) if curr_i >= 0 and curr_i < len(row) and row[curr_i] else 0
            change = int(float(row[change_i])) if change_i >= 0 and change_i < len(row) and row[change_i] else 0

            brand = detect_brand(name)
            month_label = month_labels.get(month_key, month_key)

            if name not in gpu_dict:
                gpu_dict[name] = {
                    'name': name, 'brand': brand, 'vram': vram, 'tdp': tdp,
                    'score': score, 'prices': {}, 'changes': {},
                    'performance_pct': round(score / base_score * 100, 1)
                }
            gpu_dict[name]['prices'][month_label] = curr
            gpu_dict[name]['changes'][month_label] = change

    for gpu in gpu_dict.values():
        latest = (gpu['prices'].get('2026年3月') or gpu['prices'].get('2026年2月') or
                  gpu['prices'].get('2026年1月') or gpu['prices'].get('2025年12月', 0))
        gpu['cost_perf'] = round(gpu['score'] / latest, 2) if latest > 0 else 0
        gpu['efficiency'] = round(gpu['score'] / gpu['tdp'], 1) if gpu['tdp'] > 0 else 0

    return list(gpu_dict.values()), months, month_labels


def generate_serve_script(excel_filename):
    """生成一键启动脚本 serve.py"""
    content = f'''#!/usr/bin/env python3
"""
显卡行情中心 - 一键启动脚本
运行: python3 serve.py
然后浏览器打开: http://localhost:8080
"""
import http.server
import socketserver
import os
import webbrowser
import threading

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache')
        super().end_headers()

def open_browser():
    webbrowser.open(f'http://localhost:{{PORT}}')

if __name__ == '__main__':
    print('=' * 50)
    print('  🎮 显卡行情中心')
    print(f'  📂 目录: {{DIRECTORY}}')
    print(f'  🌐 访问: http://localhost:{{PORT}}')
    print('=' * 50)
    threading.Timer(1, open_browser).start()
    with socketserver.TCPServer(('', PORT), Handler) as httpd:
        print('  按 Ctrl+C 停止服务')
        httpd.serve_forever()
'''
    path = os.path.join(SCRIPT_DIR, 'serve.py')
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    os.chmod(path, 0o755)
    print(f'  ✅ serve.py 已生成（运行 python3 serve.py 启动）')


def main():
    # 找Excel文件
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

    excel_name = os.path.basename(excel_path)
    print(f'📄 使用文件: {excel_path}')

    all_data = parse_xlsx(excel_path)
    gpus, months, month_labels = process_data(all_data)

    json_path = os.path.join(SCRIPT_DIR, 'data.json')
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump({'gpus': gpus, 'months': [month_labels.get(m, m) for m in months], 'raw_months': months}, f, ensure_ascii=False, indent=2)
    print(f'  ✅ data.json 已生成 ({len(gpus)} 张显卡, {len(months)} 个月)')

    # 复制Excel到输出目录
    excel_dest = os.path.join(SCRIPT_DIR, '二手显卡行情.xlsx')
    shutil.copy2(excel_path, excel_dest)
    print(f'  ✅ 原始Excel已复制到: {excel_dest}')

    # 生成serve.py
    generate_serve_script(excel_name)

    print()
    print('🎉 完成！')
    print('   启动服务: python3 serve.py')
    print('   然后访问: http://localhost:8080')
    print()
    print('📌 后期更新: 替换 Excel 文件后，再次运行本脚本即可')


if __name__ == '__main__':
    main()

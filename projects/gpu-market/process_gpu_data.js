#!/usr/bin/env node
/**
 * 显卡行情数据处理脚本
 * 运行: node process_gpu_data.js [Excel文件路径]
 * 输出: data.js (ES Module)
 *
 * 注意：xlsx 解析依赖 Python3（内置 zipfile + xml）
 */

import { spawn } from 'child_process';
import { readFileSync, writeFileSync, copyFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const MONTH_MAP = {
  '202512': '2025年12月', '202601': '2026年1月',
  '202602': '2026年2月', '202603': '2026年3月', '202604': '2026年4月',
};

const PRICE_COLS = {
  '202512': ['11月价格', '12月价格'], '202601': ['12月价格', '1月价格'],
  '202602': ['1月价格', '2月价格'], '202603': ['2月价格', '3月价格'],
  '202604': ['3月价格', '4月价格'],
};

const PYTHON_SCRIPT = `
import zipfile, xml.etree.ElementTree as ET, json, sys

filepath = sys.argv[1]
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
            runs = si.findall('ns:r', ns)
            if runs:
                parts = [r.find('ns:t', ns) for r in runs]
                strings.append(''.join(p.text for p in parts if p is not None))
            else:
                strings.append('')

    wb_xml = z.read('xl/workbook.xml')
    wb_tree = ET.fromstring(wb_xml)
    sheets = wb_tree.findall('.//{http://schemas.openxmlformats.org/spreadsheetml/2006/main}sheet')
    all_data = {}
    for i, sh in enumerate(sheets):
        shname = sh.get('name', 'sheet' + str(i+1))
        sh_xml = z.read('xl/worksheets/sheet' + str(i+1) + '.xml')
        sh_tree = ET.fromstring(sh_xml)
        headers = None
        rows = []
        for row in sh_tree.findall('.//ns:row', ns):
            row_data = []
            for cell in row.findall('ns:c', ns):
                t = cell.get('t', '')
                v = cell.find('ns:v', ns)
                if v is None: row_data.append('')
                elif t == 's': row_data.append(strings[int(v.text)])
                else: row_data.append(v.text)
            if headers is None: headers = row_data
            elif row_data and row_data[0]: rows.append(row_data)
        all_data[shname] = {'headers': headers, 'rows': rows}
    print(json.dumps(all_data))
`;

function detectBrand(name) {
  const n = name.toLowerCase();
  if (n.includes('nvidia') || n.startsWith('rtx') || n.startsWith('gtx')) return 'NVIDIA';
  if (n.includes('amd') || n.startsWith('rx')) return 'AMD';
  if (n.includes('intel') || n.startsWith('arc') || n.startsWith('uhd')) return 'Intel';
  return 'Other';
}

function countStars(s) {
  if (!s) return 0;
  const full = (s.match(/★/g) || []).length;
  if (full > 0) return Math.min(5, full);
  return 0;
}

function parseXlsx(filepath) {
  return new Promise((resolve, reject) => {
    const py = spawn('python3', ['-c', PYTHON_SCRIPT, filepath]);
    let out = '', err = '';
    py.stdout.on('data', d => out += d.toString());
    py.stderr.on('data', d => err += d.toString());
    py.on('close', code => {
      if (code !== 0) return reject(new Error(err || `Python exit ${code}`));
      try { resolve(JSON.parse(out)); } catch(e) { reject(e); }
    });
  });
}

async function main() {
  let xlsxPath = process.argv[2];
  if (!xlsxPath) {
    const downloads = join(process.env.HOME || '/home/rao', '.openclaw/qqbot/downloads');
    const files = readdirSync(downloads).filter(f => f.endsWith('.xlsx') && f.includes('显卡'));
    if (!files.length) { console.error('❌ 未找到显卡Excel文件'); process.exit(1); }
    files.sort((a, b) => statSync(join(downloads, b)).mtime - statSync(join(downloads, a)).mtime);
    xlsxPath = join(downloads, files[0]);
  }
  console.log(`📄 使用文件: ${xlsxPath}`);

  const allData = await parseXlsx(xlsxPath);
  const monthKeys = Object.keys(MONTH_MAP).filter(k => allData[k]);
  const gpuDict = {};
  const baseScore = 13619;

  for (const mk of monthKeys) {
    const { headers, rows } = allData[mk];
    if (!headers) continue;
    const ci = n => headers.indexOf(n);
    const nameI = ci('显卡型号'), scoreI = ci('Time spy平均跑分');
    const vramI = ci('显存容量'), tdpI = ci('TDP功耗');
    const [prevCol, currCol] = PRICE_COLS[mk];
    const prevI = ci(prevCol), currI = ci(currCol);
    const changeI = ci('涨跌幅'), starsI = ci('翻车概率');
    if (nameI < 0 || scoreI < 0) continue;

    for (const row of rows) {
      if (row.length <= Math.max(nameI, scoreI)) continue;
      const name = row[nameI];
      if (!name) continue;
      const score = parseFloat(row[scoreI]) || 0;
      const vram = row[vramI] || '';
      const tdp = parseInt(row[tdpI]) || 0;
      const curr = currI >= 0 && row[currI] ? parseInt(row[currI]) : 0;
      const change = changeI >= 0 && row[changeI] ? parseInt(row[changeI]) : 0;
      const stars = starsI >= 0 ? countStars(row[starsI] || '') : 0;
      const brand = detectBrand(name);
      const monthLabel = MONTH_MAP[mk];

      if (!gpuDict[name]) {
        gpuDict[name] = { name, brand, vram, tdp, score, prices: {}, changes: {},
          performance_pct: Math.round(score / baseScore * 100 * 10) / 10, stars: 0 };
      }
      gpuDict[name].prices[monthLabel] = curr;
      gpuDict[name].changes[monthLabel] = change;
      if (stars > gpuDict[name].stars) gpuDict[name].stars = stars;
    }
  }

  const gpus = Object.values(gpuDict);
  const months = monthKeys.map(k => MONTH_MAP[k]);

  for (const gpu of gpus) {
    const latestPrice = [...months].reverse().find(m => gpu.prices[m]) || 0;
    gpu.cost_perf = latestPrice > 0 ? Math.round(gpu.score / latestPrice * 100) / 100 : 0;
    gpu.efficiency = gpu.tdp > 0 ? Math.round(gpu.score / gpu.tdp * 10) / 10 : 0;
  }

  const dataJs = `// 由 process_gpu_data.js 自动生成，请勿手动修改\nexport const gpus = ${JSON.stringify(gpus, null, 2)};\nexport const months = ${JSON.stringify(months, null, 2)};\n`;

  writeFileSync(join(__dirname, 'data.js'), dataJs, 'utf-8');
  console.log(`  ✅ data.js 已生成 (${gpus.length} 张显卡, ${months.length} 个月)`);

  copyFileSync(xlsxPath, join(__dirname, '二手显卡行情.xlsx'));
  console.log(`  ✅ 原始Excel已复制`);
  console.log('\n🎉 完成！运行 npm run build 重新打包');
}

main().catch(e => { console.error(e); process.exit(1); });

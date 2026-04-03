#!/usr/bin/env node
/**
 * 显卡行情数据处理脚本
 * 运行: node process_gpu_data.js [Excel文件路径]
 * 输出: src/data.js (ES Module)
 *
 * 特性：自动检测 Excel 中的所有月份列，无需手动配置
 * 纯 JS 实现（使用 xlsx 库）
 */

import XLSX from 'xlsx';
import { readFileSync, writeFileSync, copyFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

/**
 * 从 Excel 表名解析年月，如 "202512" -> "2025年12月"
 */
function parseSheetMonth(name) {
  const m = name.trim().match(/^(\d{4})(\d{2})$/);
  if (!m) return null;
  const [, y, mo] = m;
  return `${y}年${parseInt(mo)}月`;
}

/**
 * 根据表名推导该表对应哪两个月的数据
 * 表名 202512 的数据：11月价格(上月) 和 12月价格(本月)
 * 表名 202601 的数据：12月价格(上月) 和 1月价格(本月)
 */
function deriveMonthMapping(sheetName) {
  const month = parseSheetMonth(sheetName);
  if (!month) return null;
  const m = month.match(/^(\d{4})年(\d+)月$/);
  if (!m) return null;
  const year = parseInt(m[1]);
  const monthNum = parseInt(m[2]);

  // 上个月
  let prevYear = year, prevMonth = monthNum - 1;
  if (prevMonth < 1) { prevMonth = 12; prevYear--; }
  // 本月
  let currYear = year, currMonth = monthNum;

  return {
    sheetMonth: month,
    prevMonth: `${prevMonth}月价格`,
    currMonth: `${currMonth}月价格`,
  };
}

/**
 * 检测显卡品牌
 */
function detectBrand(name) {
  const n = name.toLowerCase();
  if (n.includes('nvidia') || n.startsWith('rtx') || n.startsWith('gtx')) return 'NVIDIA';
  if (n.includes('amd') || n.startsWith('rx')) return 'AMD';
  if (n.includes('intel') || n.startsWith('arc') || n.startsWith('uhd')) return 'Intel';
  return 'Other';
}

/**
 * 计算星级（翻车概率）
 */
function countStars(s) {
  if (!s) return 0;
  const full = (s.match(/★/g) || []).length;
  if (full > 0) return Math.min(5, full);
  return 0;
}

/**
 * 解析 Excel 文件（纯 JS 实现）
 * 使用 xlsx 库读取，工作表名作为年月标识（如 "202512"）
 */
function parseXlsx(filepath) {
  const workbook = XLSX.readFile(filepath);

  // 获取所有工作表数据
  const allData = {};
  for (const sheetName of workbook.SheetNames) {
    const worksheet = workbook.Sheets[sheetName];
    // 将工作表转换为 JSON 数组（按行）
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: '' });

    if (jsonData.length === 0) continue;

    // 第一行是表头
    const headers = jsonData[0].map(h => String(h).trim());
    // 后续行是数据
    const rows = jsonData.slice(1).filter(row => row.length > 0 && row[0]);

    allData[sheetName] = { headers, rows };
  }

  return allData;
}

/**
 * 主函数
 */
async function main() {
  // 获取 Excel 文件路径
  let xlsxPath = process.argv[2];
  if (!xlsxPath) {
    // 未指定参数则在项目目录下查找最新的 .xlsx 文件
    const projectDir = __dirname;
    let files;
    try {
      files = readdirSync(projectDir).filter(f => f.endsWith('.xlsx'));
    } catch (e) {
      files = [];
    }

    if (!files.length) {
      console.error('❌ 未找到 Excel 文件');
      console.error('   用法: node process_gpu_data.js <Excel文件路径>');
      console.error('   或将 Excel 文件放到项目目录下');
      process.exit(1);
    }

    // 按修改时间排序，取最新的
    files.sort((a, b) => {
      const statA = statSync(join(projectDir, a));
      const statB = statSync(join(projectDir, b));
      return statB.mtime - statA.mtime;
    });
    xlsxPath = join(projectDir, files[0]);
  }
  console.log(`📄 使用文件: ${xlsxPath}`);

  // 解析 Excel
  const allData = parseXlsx(xlsxPath);

  // 找出所有月份表（表名为纯数字年月 6 位）
  const monthSheets = Object.keys(allData).filter(k => /^\d{6}$/.test(k.trim()));
  monthSheets.sort(); // 按时间顺序排列

  if (!monthSheets.length) {
    console.error('❌ 未找到任何月份数据表（表名需为6位数字如202512）');
    process.exit(1);
  }

  console.log(`📅 检测到 ${monthSheets.length} 个月份: ${monthSheets.join(', ')}`);

  const gpuDict = {};
  const baseScore = 13619; // RTX 5060 跑分基准

  // 遍历每个月份表，提取显卡数据
  for (const mk of monthSheets) {
    const { headers, rows } = allData[mk];
    if (!headers) continue;

    // 根据表名推导月份映射
    const mapping = deriveMonthMapping(mk);
    if (!mapping) continue;

    // 查找各列索引
    const ci = n => headers.indexOf(n);
    const nameI  = ci('显卡型号');
    const scoreI = ci('Time spy平均跑分');
    const vramI  = ci('显存容量');
    const tdpI   = ci('TDP功耗');
    const prevI  = ci(mapping.prevMonth);
    const currI  = ci(mapping.currMonth);
    const changeI = ci('涨跌幅');
    const starsI  = ci('翻车概率');

    // 必需列：型号、跑分、本月价格
    if (nameI < 0 || scoreI < 0 || currI < 0) {
      console.warn(`  ⚠️ 表 ${mk} 缺少必需列，跳过`);
      continue;
    }

    for (const row of rows) {
      if (row.length <= Math.max(nameI, scoreI)) continue;
      const name = row[nameI];
      if (!name) continue;

      const score = parseFloat(row[scoreI]) || 0;
      const vram = row[vramI] || '';
      const tdp = parseInt(row[tdpI]) || 0;
      const curr = row[currI] ? parseInt(row[currI]) : 0;
      const change = changeI >= 0 && row[changeI] ? parseInt(row[changeI]) : 0;
      const stars = starsI >= 0 ? countStars(row[starsI] || '') : 0;
      const brand = detectBrand(name);

      // 首次遇到该显卡，初始化
      if (!gpuDict[name]) {
        gpuDict[name] = {
          name,
          brand,
          vram,
          tdp,
          score,
          prices: {},
          changes: {},
          performance_pct: Math.round(score / baseScore * 100 * 10) / 10,
          stars: 0,
        };
      }

      // 记录该月份的价格和涨跌幅
      gpuDict[name].prices[mapping.sheetMonth] = curr;
      gpuDict[name].changes[mapping.sheetMonth] = change;

      // 更新翻车概率（取最大值）
      if (stars > gpuDict[name].stars) {
        gpuDict[name].stars = stars;
      }
    }
  }

  const gpus = Object.values(gpuDict);

  // 从表名提取所有月份并排序
  const months = monthSheets
    .map(k => parseSheetMonth(k))
    .filter(Boolean);

  // 计算每张卡的性价比和能耗比
  for (const gpu of gpus) {
    // 取最新可用价格
    const latestPrice = [...months].reverse().find(m => gpu.prices[m]) || 0;
    gpu.cost_perf = latestPrice > 0 ? Math.round(gpu.score / latestPrice * 100) / 100 : 0;
    gpu.efficiency = gpu.tdp > 0 ? Math.round(gpu.score / gpu.tdp * 10) / 10 : 0;
  }

  // 生成 data.js 文件
  const dataJs = `// 由 process_gpu_data.js 自动生成，请勿手动修改
// 生成时间: ${new Date().toISOString()}
export const gpus = ${JSON.stringify(gpus, null, 2)};
export const months = ${JSON.stringify(months, null, 2)};
`;

  writeFileSync(join(__dirname, 'src', 'data.js'), dataJs, 'utf-8');
  console.log(`  ✅ data.js 已生成 (${gpus.length} 张显卡, ${months.length} 个月)`);

  console.log('\n🎉 完成！运行 npm run build 重新打包');
}

main().catch(e => {
  console.error(e);
  process.exit(1);
});

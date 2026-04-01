<template>
  <div class="card">
    <div class="card-body" style="padding:32px">
      <h2 style="margin-bottom:16px">📊 关于本页面</h2>
      <p style="color:#94a3b8;line-height:2;margin-bottom:16px">
        数据来源于二手显卡行情 Excel，涵盖 <b style="color:#e2e8f0">{{ gpus.length }}</b> 张显卡近
        <b style="color:#e2e8f0">{{ months.length }}</b> 个月的价格走势，支持 NVIDIA / AMD / Intel 对比。
      </p>
      <div class="info-box">
        <h3>📌 字段说明</h3>
        <ul style="padding-left:20px">
          <li><b style="color:#e2e8f0">Time Spy 跑分</b>：3DMark 显卡分数，衡量综合性能</li>
          <li><b style="color:#e2e8f0">性能百分比</b>：以 RTX 5060（13619分）= 100% 为基准</li>
          <li><b style="color:#e2e8f0">性价比</b>：跑分 ÷ 价格，<span style="color:#22c55e">≥7 绿色</span> / <span style="color:#60a5fa">5~7 蓝色</span> / <span style="color:#fbbf24">3~5 黄色</span> / <span style="color:#ef4444">&lt;3 红色</span></li>
          <li><b style="color:#e2e8f0">能耗比</b>：跑分 ÷ TDP，数值越大越省电</li>
          <li><b style="color:#e2e8f0">翻车风险</b>：★ 越多翻车概率越高，仅供参考</li>
        </ul>
      </div>
      <div class="info-box">
        <h3>🔄 数据更新方法</h3>
        <ol style="padding-left:20px">
          <li>将新 Excel 文件放入项目根目录</li>
          <li>运行 <code>python3 process_gpu_data.py [Excel文件路径]</code></li>
          <li>运行 <code>npm run build</code> 重新打包</li>
        </ol>
      </div>
      <div class="info-box">
        <h3>🚀 构建命令</h3>
        <ol style="padding-left:20px">
          <li><code>npm install</code> 安装依赖</li>
          <li><code>npm run dev</code> 开发调试</li>
          <li><code>npm run build</code> 构建单文件（输出 dist/index.html）</li>
        </ol>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ gpus: Array, months: Array })
</script>

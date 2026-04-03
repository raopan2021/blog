<template>
  <div class="card">
    <div class="card-body">
      <div class="about-grid">
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
            <li>访问 <a href="https://space.bilibili.com/10698051/dynamic" target="_blank" style="color:#60a5fa">B站清诚实验室poi</a> 置顶动态获取最新 Excel 数据</li>
            <li>下载 Excel 文件到本地</li>
            <li>运行 <code>node process_gpu_data.js [Excel文件路径]</code> 更新数据</li>
            <li>运行 <code>npm run build</code> 重新打包</li>
            <li>提交并推送到 main 分支，CI 自动更新</li>
          </ol>
        </div>
      </div>
      <div class="source-credit">
        数据来源：<a href="https://space.bilibili.com/10698051/dynamic" target="_blank">B站UP主 清诚实验室poi</a>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({ gpus: Array, months: Array })
</script>

<style lang="scss" scoped>
.about-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.source-credit {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid #2d3748;
  color: #64748b;
  font-size: 13px;
  text-align: center;

  a {
    color: #60a5fa;
    text-decoration: none;
    &:hover { text-decoration: underline; }
  }
}
</style>

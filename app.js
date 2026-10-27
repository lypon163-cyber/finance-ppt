(function () {
  const slides = Array.from(document.querySelectorAll(".slide"));
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const pageNow = document.getElementById("pageNow");
  const pageTotal = document.getElementById("pageTotal");
  const progressFill = document.getElementById("progressFill");
  
  let current = 0;
  let charts = {};

  // 初始化 ECharts 图表
  function initCharts() {
    // 图表 1：事件研究法 CAR 走势
    const chartCar = document.getElementById('chart-car');
    if (chartCar) {
      charts.car = echarts.init(chartCar);
      charts.car.setOption({
        tooltip: { trigger: 'axis' },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'category', boundaryGap: false, data: ['T-5', 'T-4', 'T-3', 'T-2', 'T-1', 'T(事件日)', 'T+1', 'T+2', 'T+3'] },
        yAxis: { type: 'value', name: '累计异常收益(CAR)', axisLabel: { formatter: '{value}%' } },
        series: [{
          name: '负面信息曝光',
          type: 'line',
          smooth: true,
          itemStyle: { color: '#d7b56d' },
          areaStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: 'rgba(215, 181, 109, 0.5)' }, { offset: 1, color: 'rgba(215, 181, 109, 0)' }]) },
          data: [0.2, -0.1, 0.1, -0.3, -0.2, -3.5, -4.2, -4.0, -3.8]
        }]
      });
    }

    // 图表 2：不同品牌依赖度的影响
    const chartBar = document.getElementById('chart-bar');
    if (chartBar) {
      charts.bar = echarts.init(chartBar);
      charts.bar.setOption({
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'category', data: ['非核心赞助商', '次级赞助商', '核心赞助商'] },
        yAxis: { type: 'value', name: '市值损失(%)' },
        series: [{
          name: '市值损失',
          type: 'bar',
          barWidth: '40%',
          itemStyle: { color: '#62d0c4', borderRadius: [6, 6, 0, 0] },
          data: [0.8, 2.5, 5.5]
        }]
      });
    }

    // 图表 3：ESG 评估与资金流
    const chartPie = document.getElementById('chart-pie');
    if (chartPie) {
      charts.pie = echarts.init(chartPie);
      charts.pie.setOption({
        tooltip: { trigger: 'item' },
        legend: { bottom: '0%', left: 'center', textStyle: { color: '#a9b7cc' } },
        series: [{
          name: '资金流影响',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: { borderRadius: 10, borderColor: '#0b1220', borderWidth: 2 },
          label: { show: false, position: 'center' },
          emphasis: { label: { show: true, fontSize: 20, fontWeight: 'bold', color: '#fff' } },
          labelLine: { show: false },
          data: [
            { value: 45, name: '被动 ETF 减仓', itemStyle: { color: '#d7b56d' } },
            { value: 30, name: '主动基金调仓', itemStyle: { color: '#62d0c4' } },
            { value: 25, name: '未触发风控（无影响）', itemStyle: { color: '#475569' } }
          ]
        }]
      });
    }
  }

  function clamp(n) {
    return Math.max(0, Math.min(slides.length - 1, n));
  }

  function render() {
    slides.forEach((slide, index) => {
      slide.classList.toggle("active", index === current);
    });

    const total = slides.length;
    pageNow.textContent = current + 1;
    pageTotal.textContent = total;
    progressFill.style.width = `${((current + 1) / total) * 100}%`;

    prevBtn.style.opacity = current === 0 ? "0.3" : "1";
    nextBtn.style.opacity = current === total - 1 ? "0.3" : "1";

    // 修复：当切换页面时，确保隐藏图表重新调整大小（否则在隐藏容器中渲染会变成 0 宽高）
    if (slides[current]) {
      setTimeout(() => {
        if (current === 3 && charts.car) charts.car.resize();
        if (current === 4 && charts.bar) charts.bar.resize();
        if (current === 7 && charts.pie) charts.pie.resize();
      }, 100);
    }
  }

  function go(delta) {
    current = clamp(current + delta);
    render();
  }

  prevBtn.addEventListener("click", () => go(-1));
  nextBtn.addEventListener("click", () => go(1));

  document.addEventListener("keydown", (event) => {
    if (["ArrowRight", "PageDown", " "].includes(event.key)) { event.preventDefault(); go(1); }
    if (["ArrowLeft", "PageUp"].includes(event.key)) { event.preventDefault(); go(-1); }
    if (event.key === "Home") { current = 0; render(); }
    if (event.key === "End") { current = slides.length - 1; render(); }
  });

  // 打印模式兼容
  document.getElementById("printBtn").addEventListener("click", () => {
    window.print();
  });

  window.addEventListener('resize', () => {
    Object.values(charts).forEach(chart => chart.resize());
  });

  // 初始化
  window.onload = () => {
    initCharts();
    render();
  };
})();
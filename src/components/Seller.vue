<script setup> 
import * as echarts from 'echarts';
import { getSeller } from '@/api/index';
import { onMounted, ref, onBeforeUnmount, defineOptions } from 'vue';

defineOptions({
  name: 'PageSeller'
})

const sellerRef = ref(null);
const allData = ref([]); // 服务器数据
const chartInstance = ref(null);
const currentPage = ref(1); // 当前页码
const timerId = ref(null); // 定时器ID
const titleFrontSize = ref(0); 
const totalPage = ref(0); // 总页码
// 新增：数据加载状态标记
const isSellerDataLoaded = ref(false);

// 初始化图表
const initChart = () => {
  if (!sellerRef.value || !isSellerDataLoaded.value) return; // 确保DOM和数据就绪
  
  chartInstance.value = echarts.init(sellerRef.value, 'dark');
  titleFrontSize.value = sellerRef.value.offsetWidth / 100 * 4;
  
  const option = {
    title: {
      text: '▎商家销售额分析',
      left: '5%',
      top: '5%',
      textStyle: {
        color: '#fff',
        fontSize: titleFrontSize.value
      }
    },
    xAxis: {
      type: 'value',
      splitLine: { show: false },
      axisLabel: { fontSize: titleFrontSize.value * 0.7 } // 适配坐标轴文字
    },
    yAxis: {
      type: 'category',
      axisLabel: { fontSize: titleFrontSize.value * 0.7 }
    },
    grid: {
      top: '20%',
      right: '5%',
      left: '5%',
      bottom: '5%',
      containLabel: true
    },
    tooltip: {
      backgroundColor: 'rgba(0,40,80,0.9)',
      borderColor: '#00c6ff',
      borderWidth: 1,
      textStyle: { color: '#fff' }
    },
    series: [{
      name: '销售额',
      type: 'bar',
      barWidth: titleFrontSize.value * 1.2,
      itemStyle: {
        borderRadius: [0, titleFrontSize.value * 1.2 / 2, titleFrontSize.value * 1.2 / 2, 0],
        color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
          { offset: 0, color: '#00c6ff' },
          { offset: 1, color: '#0072ff' }
        ])
      }
    }]
  };
  chartInstance.value.setOption(option);
  
  // 鼠标事件
  chartInstance.value.on('mouseover', () => clearInterval(timerId.value));
  chartInstance.value.on('mouseout', startInterval);
};

// 更新图表数据
const updateChart = () => {
  if (!chartInstance.value || !allData.value.length) return;
  
  const start = (currentPage.value - 1) * 5;
  const end = currentPage.value * 5;
  const pageData = allData.value.slice(start, end);
  const sellerNames = pageData.map(item => item.name);
  const salesData = pageData.map(item => item.value);
  
  chartInstance.value.setOption({
    yAxis: { data: sellerNames },
    series: [{ data: salesData }]
  });
};

// 检查并渲染
const checkAndRender = () => {
  if (isSellerDataLoaded.value) {
    initChart();
    updateChart();
    startInterval(); // 数据就绪后启动定时器
  }
};

// 定时器逻辑
const startInterval = () => {
  if (timerId.value) clearInterval(timerId.value);
  
  timerId.value = setInterval(() => {
    currentPage.value = currentPage.value % totalPage.value + 1; // 简化页码计算
    updateChart();
  }, 3000);
};

// 响应式调整
const sellerScreenResize = () => {
  if (!chartInstance.value || !sellerRef.value) return;
  
  titleFrontSize.value = sellerRef.value.offsetWidth / 100 * 4;
  chartInstance.value.setOption({
    title: { textStyle: { fontSize: titleFrontSize.value } },
    xAxis: { axisLabel: { fontSize: titleFrontSize.value * 0.7 } },
    yAxis: { axisLabel: { fontSize: titleFrontSize.value * 0.7 } },
    series: [{
      barWidth: titleFrontSize.value * 1.2,
      itemStyle: {
        borderRadius: [0, titleFrontSize.value * 1.2 / 2, titleFrontSize.value * 1.2 / 2, 0]
      }
    }]
  });
  chartInstance.value.resize();
};

// 获取数据
const getData = async () => {
  try {
    const ret = await getSeller();
    allData.value = ret.data.data.sort((a, b) => a.value - b.value);
    totalPage.value = Math.ceil(allData.value.length / 5); // 简化总页数计算
    isSellerDataLoaded.value = true; // 标记数据加载完成
    checkAndRender(); // 触发渲染
  } catch (error) {
    console.error('商家数据加载失败:', error);
  }
};

onMounted(() => {
  getData(); // 先加载数据
  window.addEventListener('resize', sellerScreenResize);
});

onBeforeUnmount(() => {
  if (chartInstance.value) {
    chartInstance.value.dispose();
    chartInstance.value = null;
  }
  clearInterval(timerId.value);
  window.removeEventListener('resize', sellerScreenResize);
});
</script>

<template>
  <div class="com-container"> 
    <div class="com-chart" ref="sellerRef"></div>
  </div>
</template>

<style lang="less" scoped>
.com-chart {
  width: 100%;
  height: 100%;
}
</style>
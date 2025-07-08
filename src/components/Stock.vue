<script setup> 
defineOptions({
  name: 'PageStock'
})
import * as echarts from 'echarts';
import { onMounted, ref, onBeforeUnmount } from 'vue';
import { getStock } from '@/api/index.js';

const stockRef = ref(null);
const stockChartsInstance = ref(null);
const stockData = ref([]);
const currentIndex = ref(0);
const timerId = ref(null);
const titleFrontSize = ref(null);
// 新增：数据加载状态标记
const isStockDataLoaded = ref(false);

// 初始化图表
const initStockCharts = () => { 
  if (!stockRef.value || !isStockDataLoaded.value) return; // 确保DOM和数据就绪
  
  stockChartsInstance.value = echarts.init(stockRef.value, 'dark');
  titleFrontSize.value = stockRef.value.offsetWidth / 100 * 4;
  const option = { 
    title: { 
      text: '▎库存销售量',
      left: '5%',
      top: '5%',
      textStyle: { fontSize: titleFrontSize.value }
    },
  };
  stockChartsInstance.value.setOption(option);
  
  // 鼠标事件
  stockChartsInstance.value.on('mousemove', () => clearInterval(timerId.value));
  stockChartsInstance.value.on('mouseout', startInterval);
};

// 更新图表数据
const updateStockCharts = () => { 
  if (!stockChartsInstance.value || !stockData.value.length) return;
  
  const start = currentIndex.value * 5;
  const end = start + 5;
  const showData = stockData.value.slice(start, end);
  const centerPointers = [
    ['18%', '40%'], ['50%', '40%'], ['82%', '40%'], ['34%', '75%'], ['66%', '75%']
  ];
  
  const colorArrs = [
    ['#4FF778', '#0BA82C'], ['#FFD700', '#FFA500'], ['#FF0000', '#A50000'],
    ['#FF00FF', '#A500A5'], ['#00FFFF', '#00A5A5']
  ];
  
  const seriesArr = showData.map((item, index) => ({
    type: 'pie',
    radius: [titleFrontSize.value * 3, titleFrontSize.value * 2.6],
    center: centerPointers[index], // 简化中心坐标计算
    label: {
      show: true,
      position: 'center',
      color: colorArrs[index][0],
      formatter: () => `${item.name}\n\n${item.sales}`,
      fontSize: titleFrontSize.value / 2 // 适配文字大小
    },
    emphasis: { scale: false },
    labelLine: { show: false },
    data: [
      {
        value: item.sales,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            { offset: 0, color: colorArrs[index][0] },
            { offset: 1, color: colorArrs[index][1] }
          ])
        }
      },
      { value: item.stock, itemStyle: { color: '#333843' } }
    ]
  }));
  
  stockChartsInstance.value.setOption({ series: seriesArr });
};

// 检查并渲染
const checkAndRender = () => {
  if (isStockDataLoaded.value) {
    initStockCharts();
    updateStockCharts();
    startInterval();
  }
};

// 定时器逻辑
const startInterval = () => {
  if (timerId.value) clearInterval(timerId.value);
  
  timerId.value = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % Math.ceil(stockData.value.length / 5);
    updateStockCharts();
  }, 3000);
};

// 响应式调整
const screenResize = () => { 
  if (!stockChartsInstance.value || !stockRef.value) return;
  
  titleFrontSize.value = stockRef.value.offsetWidth / 100 * 4;
  const innerRadius = titleFrontSize.value * 2.6;
  const outerRadius = titleFrontSize.value * 3;
  
  stockChartsInstance.value.setOption({
    title: { textStyle: { fontSize: titleFrontSize.value } },
    series: stockChartsInstance.value.getOption().series.map(series => ({
      ...series,
      radius: [outerRadius, innerRadius],
      label: { fontSize: titleFrontSize.value / 2 }
    }))
  });
  stockChartsInstance.value.resize();
};

// 获取数据
const getStockData = async () => {
  try {
    const ret = await getStock();
    stockData.value = ret.data.data;
    isStockDataLoaded.value = true; // 标记数据加载完成
    checkAndRender(); // 触发渲染
  } catch (error) {
    console.error('库存数据加载失败:', error);
  }
};

onMounted(() => {
  getStockData();
  window.addEventListener('resize', screenResize);
});

onBeforeUnmount(() => {
  clearInterval(timerId.value);
  if (stockChartsInstance.value) {
    stockChartsInstance.value.dispose();
  }
  window.removeEventListener('resize', screenResize);
});
</script>

<template>
  <div class="com-container"> 
    <div class="com-chart" ref="stockRef"></div>
  </div>
</template>

<style lang="less" scoped>
.com-chart {
  width: 100%;
  height: 100%;
}
</style>
<script setup> 
defineOptions({
  name: 'PageRank'
})
import { getRank } from '@/api/index';
import * as echarts from 'echarts';
import { onMounted, ref, onBeforeUnmount } from 'vue';

const rankRef = ref(null);
const rankChartInstance = ref(null); // 图表实例
const rankTimerId = ref(null); // 定时器ID
const allData = ref([]); // 服务器数据
const startValue = ref(0); // 起始值
const endValue = ref(9); // 结束值
const titleFrontSize = ref(0); 
// 新增：数据加载状态标记
const isRankDataLoaded = ref(false);

// 初始化图表
const initChart = () => {
  if (!rankRef.value || !isRankDataLoaded.value) return; // 确保DOM和数据就绪
  
  rankChartInstance.value = echarts.init(rankRef.value, 'dark');
  titleFrontSize.value = rankRef.value.offsetWidth / 100 * 4;
  
  const option = {
    title: {
      text: '▎地区销售排行',
      left: '3%',
      top: '3%',
      textStyle: { fontSize: titleFrontSize.value / 2 }
    },
    tooltip: {
      backgroundColor: 'rgba(0,40,80,0.9)',
      borderColor: '#00c6ff',
      borderWidth: 1,
      textStyle: { color: '#fff' }
    },
    xAxis: { type: 'category' },
    yAxis: { 
      type: 'value',
      splitLine: { show: false }
    },
    grid: {
      top: '20%',
      right: '5%',
      left: '4%',
      bottom: '3%',
      containLabel: true
    },
    series: [{
      name: '销量',
      type: 'bar'
    }]
  };
  
  rankChartInstance.value.setOption(option);
  
  // 鼠标事件监听
  rankChartInstance.value.on('mouseover', () => {
    clearInterval(rankTimerId.value);
  });
  rankChartInstance.value.on('mouseout', () => {
    startInterval();
  });
};

// 更新图表数据
// 更新图表数据（同步坐标轴文字大小）
const updateChart = () => {
  if (!rankChartInstance.value || !allData.value.length) return;
  
  const colorArr = [
    ['#0BA82C', '#4FF778'],
    ['#2E72BF', '#23E5E5'],
    ['#5052EE', '#AB6EE5']
  ];
  
  const RankNames = allData.value.map(item => item.name);
  const RankValues = allData.value.map(item => item.value);
  
  // 关键：同步设置坐标轴文字大小（与 screenResize 保持一致）
  rankChartInstance.value.setOption({
    xAxis: { 
      data: RankNames,
      axisLabel: { 
        fontSize: titleFrontSize.value * 0.7  // 同步适配大小
      }
    },
    yAxis: { 
      axisLabel: { 
        fontSize: titleFrontSize.value * 0.7  // 同步适配大小
      }
    },
    dataZoom: {
      show: false,
      startValue: startValue.value,
      endValue: endValue.value,
    },
    series: [{
      barWidth: titleFrontSize.value,
      data: RankValues,
      itemStyle: {
        borderRadius: [titleFrontSize.value / 2, titleFrontSize.value / 2, 0, 0],
        color: (params) => {
          let targetColor = colorArr[2];
          if (params.value >= 300) targetColor = colorArr[0];
          else if (params.value >= 200) targetColor = colorArr[1];
          return new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            { offset: 0, color: targetColor[0] },
            { offset: 1, color: targetColor[1] }
          ]);
        }
      }
    }]
  });
};

// 检查并执行渲染（核心逻辑）
const checkAndRender = () => {
  if (isRankDataLoaded.value) {
    initChart();
    updateChart();
    startInterval(); // 数据就绪后启动定时器
  }
};

// 定时器逻辑
const startInterval = () => {
  if (rankTimerId.value) clearInterval(rankTimerId.value);
  
  rankTimerId.value = setInterval(() => {
    startValue.value ++;
    endValue.value++;
    if(endValue.value > allData.value.length-1)
  {
    startValue.value = 0;
    endValue.value = 9;
  }
    updateChart();
  }, 3000);
};

// 屏幕适配
const screenResize = () => {
  if (!rankChartInstance.value || !rankRef.value) return;
  
  titleFrontSize.value = rankRef.value.offsetWidth / 100 * 4;
  rankChartInstance.value.setOption({
    title: { textStyle: { fontSize: titleFrontSize.value / 2 } },
    xAxis: { axisLabel: { fontSize: titleFrontSize.value * 0.7 } },
    yAxis: { axisLabel: { fontSize: titleFrontSize.value * 0.7 } },
    series: [{
      barWidth: titleFrontSize.value,
      itemStyle: {
        borderRadius: [titleFrontSize.value / 2, titleFrontSize.value / 2, 0, 0]
      }
    }]
  });
  rankChartInstance.value.resize();
};

// 获取数据
const getData = async () => {
  try {
    const ret = await getRank();
    allData.value = ret.data.data.sort((a, b) => b.value - a.value);
    isRankDataLoaded.value = true; // 标记数据加载完成
    checkAndRender(); // 触发渲染检查
  } catch (error) {
    console.error('排行数据加载失败:', error);
  }
};

onMounted(() => {
  getData(); // 先加载数据
  window.addEventListener('resize', screenResize);
});

onBeforeUnmount(() => {
  if (rankChartInstance.value) {
    rankChartInstance.value.dispose();
    rankChartInstance.value = null;
  }
  clearInterval(rankTimerId.value);
  window.removeEventListener('resize', screenResize);
});
</script>

<template>
  <div class="com-container"> 
    <div class="com-chart" ref="rankRef"></div>
  </div>
</template>

<style lang="less" scoped>
.com-chart {
  width: 100%;
  height: 100%;
}
</style>
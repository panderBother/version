<script setup> 
import { ref, defineOptions, onMounted, computed, onBeforeUnmount } from 'vue'
import * as echarts from 'echarts'
import { getTrend } from '@/api/index';
import '@/assets/font/iconfont.css'

defineOptions({
  name: 'PageTrend'
})

const trendRef = ref(null)
const trendData = ref(null);
const trendChartInstance = ref(null);
const showTrend = ref(false);
const choiceType = ref('map');
const titleFrontSize = ref(0);
// 新增：数据加载状态标记
const isTrendDataLoaded = ref(false);

// 初始化图表
const initTrendChart = () => {
  if (!trendRef.value || !isTrendDataLoaded.value) return; // 确保DOM和数据就绪
  
  trendChartInstance.value = echarts.init(trendRef.value, 'dark');
  titleFrontSize.value = trendRef.value.offsetWidth / 100 * 4;
  
  const option = {
    xAxis: {
      type: 'category',
      axisLabel: { textStyle: { fontSize: titleFrontSize.value * 0.8 } }
    },
    yAxis: {
      type: 'value',
      splitLine: { show: false },
      name: '单位：万',
      nameTextStyle: {
        color: '#B4B4B4',
        fontSize: titleFrontSize.value * 0.8,
        padding: [0, 0, 5, 0]
      },
      axisLabel: { textStyle: { fontSize: titleFrontSize.value * 0.8 } }
    },
    grid: {
      left: '5%',
      right: '5%',
      bottom: '5%',
      top: '30%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {  
        type: 'cross',
        crossStyle: { color: '#999', width: 1, type: 'dashed' },
        label: {
          show: true,
          backgroundColor: 'rgba(0,40,80,0.9)',
          borderColor: '#00c6ff',
          borderWidth: 1,
          textStyle: { color: '#fff', fontSize: titleFrontSize.value * 0.7 }
        }
      }
    },
    legend: {
      top: '12%',
      icon: 'circle',
      left: '5%',
      itemWidth: titleFrontSize.value,
      itemHeight: titleFrontSize.value,
      itemGap: titleFrontSize.value,
      textStyle: { fontSize: titleFrontSize.value / 2 }
    }
  };
  trendChartInstance.value.setOption(option);
};

// 更新图表数据
const updateTrendChart = () => { 
  if (!trendChartInstance.value || !trendData.value) return;
  
  const { common, [choiceType.value]: currentType } = trendData.value;
  const timeArrs = common.month;
  const valueArrs = currentType.data;
  
  const colorArr1 = [
    'rgba(11, 168, 44, 0.7)', 'rgba(255, 215, 0, 0.7)', 'rgba(255, 0, 0, 0.7)',
    'rgba(0, 0, 255, 0.7)', 'rgba(128, 0, 128, 0.7)'
  ];
  const colorArr2 = colorArr1.map(color => color.replace('0.7', '0'));
  
  const seriesArr = valueArrs.map((item, index) => ({
    type: 'line',
    smooth: true,
    data: item.data,
    name: item.name,
    symbol: 'none',
    color: colorArr1[index],
    areaStyle: { 
      color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
        { offset: 0, color: colorArr1[index] },
        { offset: 1, color: colorArr2[index] }
      ])
    },
    stack: choiceType.value
  }));
  
  trendChartInstance.value.setOption({
    xAxis: { data: timeArrs },
    legend: { data: valueArrs.map(item => item.name) },
    series: seriesArr
  });
};

// 检查并渲染
const checkAndRender = () => {
  if (isTrendDataLoaded.value) {
    initTrendChart();
    updateTrendChart();
  }
};

// 响应式调整
const screenResize = () => { 
  if (!trendChartInstance.value || !trendRef.value) return;
  
  titleFrontSize.value = trendRef.value.offsetWidth / 100 * 4;
  trendChartInstance.value.setOption({
    title: { textStyle: { fontSize: titleFrontSize.value } },
    xAxis: { axisLabel: { fontSize: titleFrontSize.value * 0.8 } },
    yAxis: { 
      axisLabel: { fontSize: titleFrontSize.value * 0.8 },
      nameTextStyle: { fontSize: titleFrontSize.value * 0.8 }
    },
    tooltip: {
      axisPointer: {
        label: { textStyle: { fontSize: titleFrontSize.value * 0.7 } }
      }
    },
    legend: {
      itemWidth: titleFrontSize.value,
      itemHeight: titleFrontSize.value,
      itemGap: titleFrontSize.value,
      textStyle: { fontSize: titleFrontSize.value / 2 }
    }
  });
  trendChartInstance.value.resize();
};

// 获取数据
const getTrendData = async () => { 
  try {
    const ret = await getTrend();
    trendData.value = ret.data.data;
    isTrendDataLoaded.value = true; // 标记数据加载完成
    checkAndRender(); // 触发渲染
  } catch (error) {
    console.error('趋势数据加载失败:', error);
  }
};

// 切换趋势类型
const selectTrend = (item) => { 
  choiceType.value = item.key;
  showTrend.value = false;
  updateTrendChart();
};

// 计算属性
const titles = computed(() => { 
  return trendData.value?.type.filter(item => item.key !== choiceType.value) || [];
});
const showTitle = computed(() => { 
  return trendData.value?.[choiceType.value]?.title || '';
});

onMounted(() => { 
  getTrendData();
  window.addEventListener('resize', screenResize);
})

onBeforeUnmount(() => { 
  if (trendChartInstance.value) {
    trendChartInstance.value.dispose();
    trendChartInstance.value = null;
  }
  window.removeEventListener('resize', screenResize);
})
</script>

<template>
  <div class="com-container"> 
    <div class="title">
      <span class="title-text" :style="{ fontSize: titleFrontSize + 'px' }">▎{{ showTitle }}</span>
      <span class="iconfont title-icon" @click="showTrend = !showTrend">&#xe6eb;</span>
      <div class="select-con" v-show="showTrend">
        <div class="select-item" v-for="(item, index) in titles" :key="index" @click="selectTrend(item)">
          {{ item.text }}
        </div>
      </div>
    </div>
    <div class="com-chart" ref="trendRef"></div>  
  </div>
</template>

<style lang="less" scoped>
.com-container {
  position: relative;
  width: 100%;
  height: 100%;
}
.title {
  position: absolute;
  top: 10px;
  left: 20px;
  z-index: 10;
  .title-text { color: #fff; }
  .title-icon { margin-left: 10px; cursor: pointer; color: #fff; }
  .select-con {
    position: absolute;
    top: 20px;
    left: 0;
    background: rgba(0, 0, 0, 0.7);
    padding: 10px;
    .select-item { color: #fff; padding: 5px 0; cursor: pointer; }
  }
}
.com-chart {
  width: 100%;
  height: 100%;
}
</style>
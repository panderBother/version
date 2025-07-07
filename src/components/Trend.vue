<script setup> 
defineOptions({
  name: 'PageTrend'
})
import * as echarts from 'echarts';
import { onMounted, ref, onBeforeUnmount } from 'vue';
const trendRef = ref(null);
let myChart = null;
function resizeChart() {
  if (myChart) {
    myChart.resize();
  }
}
onMounted(() => {
  console.log(trendRef.value)
  // 初始化图表
  myChart = echarts.init(trendRef.value,'dark');
  // 图表配置项
  const option = {
    title: {
      text: '▎商家销售统计'
    },
    tooltip: {},
    xAxis: {
      data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
    },
    yAxis: {},
    series: [{
      name: '销量',
      type: 'bar',
      data: [5, 20, 36, 10, 10, 20]
    }]
  };
  // 使用刚指定的配置项和数据显示图表
  myChart.setOption(option);
  // 监听窗口大小变化
  window.addEventListener('resize', resizeChart);
});
onBeforeUnmount(() => {
  if (myChart) {
    myChart.dispose();
    myChart = null;
  }
});
</script>
<template>
  <div class="com-container"> 
    <div class="com-chart" ref="trendRef">
      <!-- 图表容器 -->
    </div>
  </div>
</template>

<style lang="less" scoped>

</style>
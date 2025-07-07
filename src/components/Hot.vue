<script setup> 
import * as echarts from 'echarts';
import { onMounted, ref, onBeforeUnmount } from 'vue';
defineOptions({
  name: 'PageHot'
})
const hotRef = ref(null);
let myChart = null;

function resizeChart() {
  if (myChart) {
    myChart.resize();
  }
}

onMounted(() => {
  console.log(hotRef.value.clientWidth, hotRef.value.clientHeight);
  myChart = echarts.init(hotRef.value, 'dark');
  const option = {
    title: {
      text: ' ▎ 热销商品的占比'
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
  myChart.setOption(option);

  window.addEventListener('resize', resizeChart);
});

onBeforeUnmount(() => {
  if (myChart) {
    myChart.dispose();
    myChart = null;
  }
  window.removeEventListener('resize', resizeChart);
});
</script>
<template>
  <div class="com-container"> 
    <div class="com-chart" ref="hotRef"></div>
  </div>
</template>

<style lang="less" scoped>

</style>
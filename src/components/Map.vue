<script setup>
import * as echarts from 'echarts';
import { onMounted, ref,onBeforeUnmount } from 'vue'; 
defineOptions({
  name: 'PageMap'
})

const mapRef = ref(null);
let myChart = null;


// 修改窗口的尺寸
function resizeChart() {
  if (myChart) {
    myChart.resize();
  }
}
onMounted(() => {
  console.log(mapRef.value.clientWidth, mapRef.value.clientHeight);
  // 初始化图表
  myChart = echarts.init(mapRef.value,'dark');
  // 监听窗口大小变化
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
    <div class="com-chart" ref="mapRef"></div>

  </div>
</template>

<style lang="less" scoped>


</style>
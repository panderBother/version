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
const allData = ref([]); // 获取服务器的数据
const startValue = ref(0); // 起始值
const endValue = ref(9); // 结束值
const titleFrontSize = ref(0); 
// 初始化图表
const initChart = () =>{
  rankChartInstance.value = echarts.init(rankRef.value, 'dark');
  //获取titleFrontSize
  titleFrontSize.value = rankRef.value.offsetWidth / 100 * 4;
  const option = {
    title: {
      text: '▎地区销售排行',
      left: '3%',
      top: '3%',
     textStyle: { fontSize: titleFrontSize.value/2 }
    },
    tooltip: {
       backgroundColor: 'rgba(0,40,80,0.9)', // 提示框背景色
       borderColor: '#00c6ff',               // 边框色
       borderWidth: 1,
       textStyle: {
       color: '#fff',                      // 文字颜色
     }
    },
    xAxis: {
      type: 'category',
    },
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
      type: 'bar',
    }]
  };
  rankChartInstance.value.setOption(option);
  rankChartInstance.value.on('mouseover',()=>{
    clearInterval(rankTimerId.value); // 鼠标悬停时清除定时器
  })
  rankChartInstance.value.on('mouseout',()=>{
    startInterval(); // 鼠标移出时重新启动定时器
})
}
// 更新图表数据
 const updateChart = () => {
 const colorArr = [
        ['#0BA82C', '#4FF778'],
        ['#2E72BF', '#23E5E5'],
        ['#5052EE', '#AB6EE5']
      ]
  const RankNames= allData.value.map(item => item.name);
  const RankValues = allData.value.map(item => item.value);
  const option = {
    //不同的柱子配置不同的颜色
    xAxis: {
      data: RankNames
    },
    dataZoom: {
      show: false,
      startValue: startValue.value,
      endValue: endValue.value,
    },
    series: [{
      barWidth: titleFrontSize.value ,
      data: RankValues,
      itemStyle: {
         borderRadius: [titleFrontSize.value / 2, titleFrontSize.value / 2, 0 , 0],
        color: (params) => {
          let targetColor = colorArr[0];
          if (params.value >= 300) {
            targetColor = colorArr[0];
          } else if (params.value >= 200) {
            targetColor = colorArr[1];
          } else {
            targetColor = colorArr[2];
          }
          return new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            { offset: 0, color: targetColor[0] }, // 渐变起始颜色
            { offset: 1, color: targetColor[1] } // 渐变结束颜色
          ]);
        }
      }
    }]
  };
  rankChartInstance.value.setOption(option);
 }
 //获取数据
const getData = async () => {
  const ret= await getRank();
  allData.value=ret.data.data.sort((a,b)=>b.value-a.value);
  updateChart();
  startInterval(); // 启动定时器
  }
//设置定时器
 const startInterval = () => {
  if(rankTimerId.value){
    clearInterval(rankTimerId.value); // 清除之前的定时器
  }
  console.log(startValue.value, endValue.value);
  rankTimerId.value = setInterval(() => {
    startValue.value ++;
    endValue.value ++;
    if (endValue.value > allData.value.length-1) {
      startValue.value = 0;
      endValue.value = 9; // 重置起始和结束值
    }
    updateChart();
  }, 3000);
 }
  //监听窗口大小变化
const screenResize = () => {
   titleFrontSize.value = rankRef.value.offsetWidth / 100 * 4;
  const adapterOption={
    title: { textStyle: { fontSize: titleFrontSize.value/2 } },
    series: [{
      barWidth: titleFrontSize.value ,
      itemStyle: {
        borderRadius: [titleFrontSize.value / 2, titleFrontSize.value / 2, 0 , 0]
      }
    }]
  }
  rankChartInstance.value.setOption(adapterOption);
  rankChartInstance.value.resize();
  
}

onMounted(() => {
  getData();
  initChart();
  window.addEventListener('resize', screenResize);
});
onBeforeUnmount(() => {
  clearInterval(rankTimerId.value); // 清除定时器
  window.removeEventListener('resize', screenResize);
});
</script>

<template>
  <div class="com-container"> 
      <div class="com-chart" ref="rankRef">

    </div>
  
  </div>
</template>

<style lang="less" scoped>

</style>
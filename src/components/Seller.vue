<script setup> 
import * as echarts from 'echarts';
import { getSeller } from '@/api/index';
import { onMounted,ref,watch } from 'vue';
defineOptions({
  name: 'PageSeller'
})
const sellerRef = ref(null);
const allData = ref([]);//获取服务器的数据
const chartInstance = ref(null);
const currentPage=ref(1); //当前页码
const timerId = ref(null); // 定时器ID
const maxValue = ref(null); // 最大值
const titleFrontSize=ref(0); 
const totalPage=ref(0); //总页码
const initChart = () => {
  // 实列对象echarts
  chartInstance.value= echarts.init(sellerRef.value,'dark');
  titleFrontSize.value = sellerRef.value.offsetWidth / 100 * 4;
   const option = {
    title: {
      text: '▎商家销售额分析',
      left: '20',
      top: '5%',
      textStyle: {
        textStyle: {
           color: '#fff',
           fontSize: titleFrontSize.value/1.5
        },
      }
    },
  // 设置x轴和y轴
    xAxis: {
      type: 'value',
      max: maxValue.value, // 设置x轴的最大值
    },
    // 设置y轴为主类目
    yAxis: {
      type: 'category',
    },
    //设置坐标轴的大小  
    grid: {
    top: '20%',
    right: '5%',
    left: '5%',
    bottom: '5%',
    containLabel: true
  },
    //  工具提示和背景
     tooltip:{
      trigger: 'axis',
      axisPointer: {
        type: 'shadow' ,// 鼠标悬停时的指示器类型
        z: 1,
        lineStyle: {
          color: '#2D3443', // 指示器线条的颜色
          // width: 30, // 指示器线条的宽度
        }

      }
     },
    series: [{
      type: 'bar',
      label: {
      show: true, // 显示标签
      position: 'right', // 标签位置在右侧
      color: '#fff', // 标签文字颜色
    },
    barWidth: titleFrontSize.value*1.2, // 设置柱状图的宽度
    itemStyle: {
       borderRadius:[0,titleFrontSize.value*1.2/2,titleFrontSize.value*1.2/2,0], // 柱状图的圆角
      color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
        { offset: 0, color: '#00c6ff' }, // 渐变起始颜色
        { offset: 1, color: '#0072ff' } // 渐变结束颜色
      ])
    }
    },
  ]
  };
  chartInstance.value.setOption(option);
  chartInstance.value.on('mouseover',()=>{
    clearInterval(timerId.value); // 鼠标悬停时清除定时器
  })
  chartInstance.value.on('mouseout',()=>{
    startInterval(); // 鼠标移出时重新启动定时器
})
};
const getData = async () => {
  console.log(titleFrontSize.value);
  const ret=await getSeller();
  allData.value=ret.data.data.sort((a, b) => a.value - b.value); // 按照value升序排序
  console.log(allData.value);
  // 设置最大值为数据中最大的value
  maxValue.value=allData.value[allData.value.length - 1].value+50;
  console.log(maxValue.value);
  //总页数
  totalPage.value = allData.value.length % 5 === 0 ? parseInt(allData.value.length / 5) :parseInt(allData.value.length / 5 )+1;
  updateChart();
  startInterval(); // 启动定时器
}
const startInterval = () => {
  // 每隔3秒更新一次图表
  timerId.value = setInterval(() => {
    currentPage.value++;
    if (currentPage.value > totalPage.value) {
      currentPage.value = 1; // 如果超过总页数，重置为第一页
    }
    updateChart();
  }, 3000);
};

const updateChart =() =>{
  const start = (currentPage.value - 1) * 5; // 每页5条数据
  const end = currentPage.value * 5;
  //  // 获取当前页的数据
  const pageData = allData.value.slice(start, end);
  const sellerNames = pageData.map(item => item.name);
  const salesData = pageData.map(item => item.value);
  // console.log(sellerNames,salesData);
  const option = {
    yAxis: {
      data: sellerNames
    },
    series: [{
      data: salesData,
    }]
  };
  chartInstance.value.setOption(option);
}
const screenResize = () => {
  // titleFrontSize.value = sellerRef.value.offsetWidth / 100 * 4; // 根据容器宽度计算标题字体大小
  const adapterOption={
    title:{textStyle:{fontSize:titleFrontSize.value}}, //标题字体大小
    tooltip:{axisPointer:{lineStyle:{width:titleFrontSize.value}}}, //鼠标悬停时的指示器线条宽度
    series: [{
      barWidth:titleFrontSize.value*1.2, //柱状图的宽度
      itemStyle:{
        borderRadius:[0,titleFrontSize.value*1.2/2,titleFrontSize.value*1.2/2,0], //柱状图的圆角
      }
    }]
};
  chartInstance.value.setOption(adapterOption);
  chartInstance.value.resize(); // 调整图表大小
}
onMounted(()=>{
  getData();
  initChart();
  window.addEventListener('resize',screenResize);
})
// 添加对maxValue的监听
watch(maxValue, (newValue) => {
  if (chartInstance.value && allData.value.length > 0) {
    chartInstance.value.setOption({
      xAxis: {
        max: newValue+25
      }
    });
  }
});
</script>
<template>
  <div class="com-container"> 
    <div class="com-chart" ref="sellerRef">
      <!-- 图表容器 -->

    </div>
    
  </div>
</template>

<style lang="less" scoped>

</style>
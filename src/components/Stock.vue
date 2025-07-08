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
const timerId= ref(null);
const titleFrontSize = ref(null);
const getStockData = async () => {
  const ret = await getStock();
   stockData.value=ret.data.data
  initStockCharts();
  updateStockCharts();
};
const initStockCharts = () => { 
  stockChartsInstance.value = echarts.init(stockRef.value,'dark');
  titleFrontSize.value=stockRef.value.offsetWidth/100*4;
   const centerPointers=[
    ['18%','40%'],
    ['50%','40%'],
    ['82%','40%'],
    ['34%','75%'],
    ['66%','75%']   
  ]
  const option = { 
    title: { 
      text: '▎库存销售量',
      left: '5%',
      top: '5%' ,
      textStyle: { 
        fontSize: titleFrontSize.value,
      }
    },
    series: [
      {
        type: 'pie',
        center: centerPointers[0],
         emphasis: {
             scale: false
                 },
        label: { show: true ,position: 'center'},
        labelLine: { show: false }
      },
      {
        type: 'pie',
        center: centerPointers[1],
         emphasis: {
             scale: false
                 },
        label: { show: true ,position: 'center'},
        labelLine: { show: false }
      },
      {
        type: 'pie',
        center: centerPointers[2],
         emphasis: {
             scale: false
                 },
        label: { show: true ,position: 'center'},
        labelLine: { show: false }
      },
      {
        type: 'pie',
        center: centerPointers[3],
         emphasis: {
             scale: false
                 },
        label: { show: true ,position: 'center'},
        labelLine: { show: false }
      },
      {
        type: 'pie',
        center: centerPointers[4],
        emphasis: {
             scale: false
                 },
        label: { show: true ,position: 'center'},
        labelLine: { show: false }
      },

    ],
  };
  stockChartsInstance.value.setOption(option);
  stockChartsInstance.value.on('mousemove',()=>{ 
    clearInterval(timerId.value);
});
stockChartsInstance.value.on('mouseout',()=>{ 
  startInterval();
})
};
const updateStockCharts = () => { 
  const centerPointers=[
    ['18%','40%'],
    ['50%','40%'],
    ['82%','40%'],
    ['34%','75%'],
    ['66%','75%']   
  ]
  const colorArrs=[
    ['#4FF778', '#0BA82C'],
    ['#FFD700', '#FFA500'],
    ['#FF0000', '#A50000'],
    ['#FF00FF', '#A500A5'],
    ['#00FFFF', '#00A5A5']
  ]
  console.log(titleFrontSize.value,"titleFrontSize")
  const start=currentIndex.value*5;
  const end=currentIndex.value*5+5;
  const showData=stockData.value.slice(start,end);
  console.log(showData,"showData");
  const seriesArr=showData.map((item,index)=>{ 
    console.log(item,index);
    return { 
      type: 'pie',
      radius: [titleFrontSize.value*2.8, titleFrontSize.value*2.3],
      center: centerPointers[index],
      label: {
        show: true,
        position: 'center',
        color: colorArrs[index][0],
         formatter: () => `${item.name}\n\n${item.sales}` // 始终显示
      },
     emphasis: {
             scale: false
                 },
      labelLine: { //鼠标移入时，不显示标签线
        show: false
      },
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
       {
        value: item.stock,
        itemStyle: {
          color: '#333843'
        }
       }
     
      ],
    
    }
  })
  const option={
    series: seriesArr
  }
  stockChartsInstance.value.setOption(option);
};
const startInterval = () => {
    if(timerId.value){
      clearInterval(timerId.value)
    } 
    timerId.value = setInterval(() => {
      currentIndex.value++;
      if(currentIndex.value*5 >= stockData.value.length){
        currentIndex.value = 0;
      }
      updateStockCharts();
    }, 3000);
  }
const screenResize = () => { 
  titleFrontSize.value = stockRef.value.offsetWidth / 100 * 4;
  const innerRadius = titleFrontSize.value * 2;
  const outerRadius = innerRadius * 1.2;
  const adapterOption={
    title: {
      textStyle: { fontSize: titleFrontSize.value }
    },
    series: [{
      radius: [outerRadius, innerRadius],
      label: {
        fontSize: titleFrontSize.value / 2
      }
    },{
      radius: [outerRadius, innerRadius],
      label: {
       fontSize: titleFrontSize.value /2
      }
    },{
      radius: [outerRadius, innerRadius],
      label: {
       fontSize: titleFrontSize.value /2
      }
    },{
      radius: [outerRadius, innerRadius],
      label: {
       fontSize: titleFrontSize.value /2
      }
    },{
      radius: [outerRadius, innerRadius],
      label: {
       fontSize: titleFrontSize.value /2
      }
    },
  ]
  }
  stockChartsInstance.value.setOption(adapterOption);
  stockChartsInstance.value.resize();
};
onMounted(() => {
  getStockData();
  window.addEventListener('resize', () => {
    screenResize();
  });

});
onBeforeUnmount(() => {
  clearInterval(timerId.value);
  window.removeEventListener('resize', screenResize);

});
</script>
<template>
  <div class="com-container"> 
    <div class="com-chart" ref="stockRef">
      <!-- 图表容器 -->

    </div>
   
  </div>
</template>

<style lang="less" scoped>

</style>
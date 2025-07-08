<script setup> 
import * as echarts from 'echarts';
import { getHot } from '@/api/index';
import { onMounted, ref, onBeforeUnmount } from 'vue';

defineOptions({
  name: 'PageHot'
})
const hotRef = ref(null);
const hotChartInstance = ref(null); // 图表实例
const allData = ref([0]); // 获取服务器的数据
const currentIndex = ref(0); // 当前索引
const titleFrontSize= ref();
const getHotData = async () => { 
  const ret= await getHot();
  allData.value = ret.data.data;
  console.log(allData.value)
  initHotChart();
  updateHotChart();
};
const initHotChart = () => { 
  hotChartInstance.value = echarts.init(hotRef.value, 'dark');
  titleFrontSize.value=hotRef.value.offsetWidth/100*4;
  const option = {
    title: {
      text: '▎热销商品销售金额占比统计',
      left: '3%',
      top: '5%',
      textStyle: {
        fontSize: titleFrontSize.value,
        fontWeight: 'normal',
        color: '#fff'
      }
    },
     tooltip: {
      trigger: 'item',
       backgroundColor: 'rgba(0,40,80,0.9)', // 提示框背景色
       borderColor: '#00c6ff',               // 边框色
       borderWidth: 1,
       textStyle: {
       color: '#fff',                      // 文字颜色
     },
     formatter: function (params) { 
      let tipArray=[];
      params.data.children.forEach(element => {
        let child=`${element.name}&nbsp;
        ${parseInt(element.value/params.value*100+'%')}
        `
        tipArray.push(child);
      });
      return tipArray.join('<br/>');
      }
    },
    series: [{
      radius: titleFrontSize.value*4,
      center: ['50%', '60%'],
      name: '销售额',
      type: 'pie',
      label: { //隐藏文字
        show: false
      },
      emphasis: {
        label: { //高亮显示文字
          show: true
        }
      }
    }]
  };
  hotChartInstance.value.setOption(option);
};
const updateHotChart = () => { 
  //饼图数据  
  const seriesData=allData.value[currentIndex.value].children.map(item => ({
    name: item.name,
    value: item.value,
    children: item.children
  }));
  // 图例数据
  const legendData = allData.value[currentIndex.value].children.map(item => item.name);
  const option = {
    legend: {
      data: legendData,
      icon: 'circle',
      top: '20%',
      itemStyle: {
        borderRadius: 5,
      }
    },
    series: [{
      data: seriesData
    }]
  };
  hotChartInstance.value.setOption(option);
};
const hotScreenResize = () => {
  titleFrontSize.value=hotRef.value.offsetWidth/100*4;
  const adapterOption={
    title: { textStyle: { fontSize: titleFrontSize.value } },
    series: [{
    radius: titleFrontSize.value*3,
    center: ['50%', '60%']
  }],
  legend: {
    itemWidth: titleFrontSize.value,
    itemHeight: titleFrontSize.value,
    itemGap: titleFrontSize.value,
    textStyle: {
    fontSize: titleFrontSize.value/2
    }
  }
  }
  hotChartInstance.value.setOption(adapterOption);
  hotChartInstance.value.resize();
};  
onMounted(() => {
  getHotData();
  window.addEventListener('resize', hotScreenResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', hotScreenResize);
  if (hotChartInstance.value) {
    hotChartInstance.value.dispose();
    hotChartInstance.value = null;
  }
});
const toLeft = () => { 
  currentIndex.value--;
  if(currentIndex.value < 0){
    currentIndex.value = allData.value.length - 1;
  }
  updateHotChart();
};
const toRight = () => { 
  currentIndex.value++;
  if(currentIndex.value > allData.value.length - 1){
    currentIndex.value = 0;
  }
  updateHotChart();
};
</script>
<template>
  <div class="com-container"> 
    <div class="com-chart" ref="hotRef"></div>
    <span class="arr_left" @click="toLeft">&lt;</span>
    <span class="arr_right" @click="toRight">&gt;</span>
    <span class="cat_name" :style="{ fontSize: titleFrontSize + 'px' }">{{ allData[currentIndex].name }}</span>
  </div>
</template>

<style lang="less" scoped>
.arr_left {
  position: absolute;
  left: 10%;
  top: 50%;
  transform: translateY(-50%);
  color: #fff;
  cursor: pointer;
}
.arr_right {
  position: absolute;
  top: 50%;
  right: 10%;
  transform: translateY(-50%);
  color: #fff;
  cursor: pointer;
}
.cat_name {
  position: absolute;
  left: 50%;
  bottom: 1%;
  transform: translate(-50%, -50%);
  font-weight: bold;
  color: #fff;
}

</style>
<script setup> 
import * as echarts from 'echarts';
import { getHot } from '@/api/index';
import { onMounted, ref, onBeforeUnmount, defineOptions } from 'vue';

defineOptions({
  name: 'PageHot'
})

const hotRef = ref(null);
const hotChartInstance = ref(null); // 图表实例
const allData = ref([]); // 服务器数据
const currentIndex = ref(0); // 当前索引
const titleFrontSize = ref();
// 新增：数据加载状态标记
const isHotDataLoaded = ref(false);

// 初始化图表
const initHotChart = () => { 
  if (!hotRef.value || !allData.value.length) return; // 确保DOM和数据就绪
  
  hotChartInstance.value = echarts.init(hotRef.value, 'dark');
  titleFrontSize.value = hotRef.value.offsetWidth / 100 * 4;
  
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
      backgroundColor: 'rgba(0,40,80,0.9)',
      borderColor: '#00c6ff',
      borderWidth: 1,
      textStyle: { color: '#fff' },
      formatter: function (params) { 
        let tipArray = [];
        params.data.children.forEach(element => {
          let child = `${element.name}&nbsp;${parseInt(element.value / params.value * 100)}%`;
          tipArray.push(child);
        });
        return tipArray.join('<br/>');
      }
    },
    series: [{
      radius: titleFrontSize.value * 4,
      center: ['50%', '60%'],
      name: '销售额',
      type: 'pie',
      label: { show: false },
      emphasis: { label: { show: true } }
    }]
  };
  
  hotChartInstance.value.setOption(option);
};

// 更新图表数据
const updateHotChart = () => { 
  if (!hotChartInstance.value || !allData.value.length) return; // 数据校验
  
  const seriesData = allData.value[currentIndex.value].children.map(item => ({
    name: item.name,
    value: item.value,
    children: item.children
  }));
  const legendData = allData.value[currentIndex.value].children.map(item => item.name);
  
  hotChartInstance.value.setOption({
    legend: {
      data: legendData,
      icon: 'circle',
      top: '20%',
      itemStyle: { borderRadius: 5 }
    },
    series: [{ data: seriesData }]
  });
};

// 新增：检查并渲染（核心逻辑）
const checkAndRender = () => {
  if (isHotDataLoaded.value) { // 仅当数据加载完成后执行
    initHotChart();
    updateHotChart();
  }
};

// 屏幕适配
const hotScreenResize = () => {
  if (!hotChartInstance.value || !hotRef.value) return;
  
  titleFrontSize.value = hotRef.value.offsetWidth / 100 * 4;
  const adapterOption = {
    title: { textStyle: { fontSize: titleFrontSize.value } },
    series: [{
      radius: titleFrontSize.value * 3,
      center: ['50%', '60%']
    }],
    legend: {
      itemWidth: titleFrontSize.value,
      itemHeight: titleFrontSize.value,
      itemGap: titleFrontSize.value,
      textStyle: { fontSize: titleFrontSize.value / 2 }
    }
  };
  hotChartInstance.value.setOption(adapterOption);
  hotChartInstance.value.resize();
};  

// 获取数据
const getHotData = async () => { 
  try {
    const ret = await getHot();
    allData.value = ret.data.data;
    isHotDataLoaded.value = true; // 标记数据加载完成
    checkAndRender(); // 触发渲染检查
  } catch (error) {
    console.error('热销数据加载失败:', error);
  }
};

onMounted(() => {
  getHotData();
  window.addEventListener('resize', hotScreenResize); // 简化事件绑定
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', hotScreenResize);
  if (hotChartInstance.value) {
    hotChartInstance.value.dispose();
    hotChartInstance.value = null;
  }
});

// 左右切换逻辑
const toLeft = () => { 
  currentIndex.value = (currentIndex.value - 1 + allData.value.length) % allData.value.length;
  updateHotChart();
};
const toRight = () => { 
  currentIndex.value = (currentIndex.value + 1) % allData.value.length;
  updateHotChart();
};
</script>

<template>
  <div class="com-container"> 
    <div class="com-chart" ref="hotRef"></div>
    <span class="arr_left" @click="toLeft">&lt;</span>
    <span class="arr_right" @click="toRight">&gt;</span>
    <span class="cat_name" :style="{ fontSize: titleFrontSize + 'px' }">
      {{ allData[currentIndex]?.name || '' }} <!-- 增加空值保护 -->
    </span>
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
.com-chart {
  width: 100%;
  height: 100%;
}
</style>
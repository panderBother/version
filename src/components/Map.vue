<script setup> 
import { getMap } from '@/api/index'
import axios from 'axios'
import * as echarts from 'echarts'
import { ref, onMounted, onBeforeUnmount } from 'vue'
defineOptions({
  name: 'MapPage'
})

const mapRef = ref(null)
const merchantData = ref([])
const mapChartsInstance = ref(null)
const mapData = ref(null) // 改为 null，初始值应为空
const isMapDataLoaded = ref(false) // 标记地图数据是否加载完成
const isMerchantDataLoaded = ref(false) // 标记商户数据是否加载完成

// 初始化地图
const initMapCharts = () => { 
  if (!mapRef.value || !mapData.value) return // 确保 DOM 和数据都已就绪
  mapChartsInstance.value = echarts.init(mapRef.value, 'dark')
  echarts.registerMap('china', mapData.value)
  
  const options = { 
    title: { 
      text: '▎商户分布',
      top: '5%',
      left: '5%'


     },
    geo: {
      type: 'map',
      map: 'china',
      top: '5%',
      bottom: '5%',
      itemStyle: { 
        normal: { 
          borderColor: 'rgba(255,255,255,0.2)',
          borderWidth: 1,
          areaColor: { 
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: '#1f53c5' },
            ]
          }
        }
      }
    },
    legend: { 
      show: true,
      left: '5%',
      bottom: '10%',
      orient: 'vertical',
    },
  }
  
  mapChartsInstance.value.setOption(options)
  console.log('地图初始化完成')
}

// 更新图表数据
const updateChart = () => { 
  if (!mapChartsInstance.value || !merchantData.value.length) return
  
  const seriesArr = merchantData.value.map(item => ({ 
    type: 'effectScatter',
    rippleEffect: {
      scale: 5,
      brushType: 'stroke',
    },
    data: item.children,
    name: item.name,
    coordinateSystem: 'geo',
  }))
  const legendArr = merchantData.value.map(item => item.name)
  
  mapChartsInstance.value.setOption({ 
    series: seriesArr,
    legend: { legendArr },
  })
  console.log('图表数据更新完成')
}

// 检查并执行初始化和更新
const checkAndRender = () => {
  if (isMapDataLoaded.value && isMerchantDataLoaded.value) {
    initMapCharts()
    updateChart()
  }
}
const screenResize = () => {
  const titleFontSize=mapRef.value.offsetWidth/100*4
  const option={
    title:{textStyle:{fontSize:titleFontSize*0.8}},
    legend:{
      itemWidth:titleFontSize/2,
      itemHeight:titleFontSize/2,
      textStyle:{fontSize:titleFontSize/2}},
  }
  mapChartsInstance.value.setOption(option)
  mapChartsInstance.value.resize()
}

// 获取数据
const getMapDta = async() => {
  try {
    // 并行发起请求，但分别处理完成状态
    const [merchantResponse, mapResponse] = await Promise.all([
      getMap(),
      axios.get('http://localhost:5173/static/map/china.json')
    ])
    
    merchantData.value = merchantResponse.data.data
    mapData.value = mapResponse.data
    
    isMerchantDataLoaded.value = true
    isMapDataLoaded.value = true
    
    checkAndRender() // 数据全部就绪后再渲染
    screenResize()
  } catch (error) {
    console.error('数据加载失败:', error)
  }
}

onMounted(() => { 
  getMapDta()
  window.addEventListener('resize', () => { 
   screenResize();
  })
})

onBeforeUnmount(() => { 
  if (mapChartsInstance.value) { 
    mapChartsInstance.value.dispose()
  }
  window.removeEventListener('resize', () => { 
  screenResize();
  })
})
</script>
<template>
  <div class="com-container"> 
    <div class="com-chart" ref="mapRef"></div>

  </div>
</template>

<style lang="less" scoped>


</style>
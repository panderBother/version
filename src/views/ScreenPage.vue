<script setup>
import Hot from '@/components/Hot.vue';
import Map from '@/components/Map.vue';
import Rank from '@/components/Rank.vue';
import Seller from '@/components/Seller.vue';
import Stock from '@/components/Stock.vue';
import Trend from '@/components/Trend.vue';
// import axios from 'axios';

async function getData () {
//  const ret=await axios.get('http://101.35.16.42:8080/api/shopping/map')
//    console.log(ret.data);
}
getData();
</script>
<template>
  <div class="screen-container">
    <div class="screen-header">
    <span class="title">电商平台实时监控系统</span>
      <div class="header-right">
        <!-- 日期时间等 -->
         <div class="title-right">
          <span class="datetime">2049-01-01 00:00:00</span>
         </div>
      </div>
    </div>
    <div class="screen-body">
      <section class="screen-left">
        <div id="left-top">
            <Trend />
        </div>
        <div id="left-bottom">
          <Seller />
        </div>
      </section>
      <section class="screen-middle">
         <div id="middle-top">
           <Map />
        </div>
        <div id="middle-bottom">
        <Rank />
        </div>
      </section>
      <section class="screen-right">
         <div id="right-top">
              <Hot/>
        </div>
        <div id="right-bottom">
          <Stock />
        </div> 
      </section>
    </div>
  </div>
</template>

<style lang="less">
.screen-container {
  width: 100%;
  height: 100%;
  padding: 0 20px;
  box-sizing: border-box;
  background: #101c2a;
  color: #fff;
}
.screen-header {
  width: 100%; /* 宽度占满父容器 */
  height: 60px; /* 固定高度 60px */
  font-size: 20px; /* 默认字体大小（作用于直接子元素，除非被覆盖） */
  position: relative; /* 开启相对定位，为子元素绝对定位做参考 */
  > div{
    img{
      width: 100%;
    }
  }
  .title{
  position: absolute; /* 绝对定位 */
  left: 50%; top: 50%; /* 相对于父元素（.screen-header）居中 */
  font-size: 20px; /* 标题字体大小 */
  transform: translate(-50%, -50%); /* 微调实现完美居中（基于自身宽高） */
}
 .datetime {
  font-size: 15px; /* 字体小于标题 */
  margin-left: 10px; /* 左侧间距，用于和其他元素拉开距离 */
}
  .title-right {
    display: flex;
    align-items: center;
    position:absolute;
    right: 0px;
    top: 50%;
    transform: translateY(-80%);
  }
}
.screen-body {
  width: 100%;
  height: 100%;
  display: flex;
  margin-top: 10px;
  .screen-left {
    height: 100%;
    width: 25%;
    #left-top {
      height: 53%;
      position: relative;
    }
    #left-bottom {
      height: 31%;
      margin-top: 25px;
      position: relative;
    }
  }
  .screen-middle {
    height: 100%;
    width: 45%;
    margin-left: 1.6%;
    margin-right: 1.6%;
    #middle-top {
      width: 100%;
      height: 56%;
      position: relative;
    }
    #middle-bottom {
      margin-top: 25px;
      width: 100%;
      height: 25%;
      position: relative;
    }
  }
  .screen-right {
    height: 100%;
    width: 30%;
    #right-top {
      height: 46%;
      position: relative;
    }
    #right-bottom {
      height: 38%;
      margin-top: 25px;
      position: relative;
    }
  }
}
.resize {
  position: absolute;
  right: 20px;
  top: 20px;
  cursor: pointer;
}
</style>
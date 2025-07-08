<script setup>
import { onMounted, onBeforeUnmount } from 'vue';

onMounted(() => {
  // 阻止Ctrl + 鼠标滚轮缩放
  window.addEventListener('wheel', disableCtrlScroll, { passive: false });
  // 阻止Ctrl + "+"或"-"的快捷键缩放
  window.addEventListener('keydown', disableCtrlPlusMinus);
});

onBeforeUnmount(() => {
  window.removeEventListener('wheel', disableCtrlScroll);
  window.removeEventListener('keydown', disableCtrlPlusMinus);
});

const disableCtrlScroll = (event) => {
  if (event.ctrlKey === true) {
    event.preventDefault();
  }
};

const disableCtrlPlusMinus = (event) => {
  if ((event.ctrlKey === true && (event.key === '+' || event.key === '-' || event.key === '0'))) {
    event.preventDefault();
  }
};
</script>

<template>
  <router-view />
</template>

<style lang="less">

</style>

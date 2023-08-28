<!-- src/components/OverlayPopup.vue -->
<template>
  <div class="custom-popup">
    <h2 class="title">{{ title }}</h2>
    <!-- <div class="close-btn" @click="closePopup">关闭</div> -->
    <ul class="select-list">
      <li v-for="(text, index) in selectedTexts" :key="index">
        <input v-model="selectedTexts[index]" />
      </li>
    </ul>
    <div class="button-group">
      <div class="action-button" @click="submitForm" style="background-color: #ee827c;">{{submitText}}</div>
      <div class="action-button" @click.stop="selectAll($event)" style="background-color: #83ccd2;">{{selectAllText}}</div>
      <div class="action-button" @click="clearForm" style="background-color: #84a2d4;">{{clearText}}</div>
      <div class="action-button" @click="closePopup" style="background-color: #f7b977;">{{closeText}}</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
let cleanupDraggable;
const selectedTexts = ref(['']);
//在采购网显示乱码
const title = ref("\u9009\u62E9\u7684\u5143\u7D20");
const submitText = "\u63D0\u4EA4";
const selectAllText = "\u5168\u9009";
const clearText = "\u6E05\u7A7A";
const closeText = "\u5173\u95ED";

const closePopup = () => {
  const event = new CustomEvent('closeOverlayPopupEvent');
  document.dispatchEvent(event);
}

const submitForm = () => {
  const jsonData = JSON.stringify({ texts: selectedTexts.value });
  fetch('YOUR_API_ENDPOINT', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: jsonData,
  }).then(response => {
    if (response.ok) {
      console.log('Data submitted successfully');
    } else {
      console.error('Failed to submit data');
    }
  });
}

const clearForm = () => {
  selectedTexts.value = [''];
  document.dispatchEvent(new CustomEvent('clearOverlayPopupEvent'));
}

const selectAll = (clickEvent) => {
  clearForm();
  const currentPageURL = window.location.href;
  selectedTexts.value = [currentPageURL];
  // 将全选状态保存到localStorage
  localStorage.setItem('isSelectAllActive', 'true');
}

const onElementSelected = (e) => {
  if (e.detail && e.detail.text) {
    if (!selectedTexts.value.length || !selectedTexts.value[0]) {
      selectedTexts.value[0] = e.detail.text;
    } else {
      selectedTexts.value.push(e.detail.text);
    }
  }
}

const onElementDeselected = (e) => {
  if (e.detail && e.detail.text) {
    const index = selectedTexts.value.indexOf(e.detail.text);
    if (index > -1) {
      selectedTexts.value.splice(index, 1);
    }
    // 如果数组为空，添加一个空字符串以渲染一个空的input
    if (selectedTexts.value.length === 0) {
      selectedTexts.value.push('');
    }
  }
}
const handleClearAll=()=>{
    // 这里你可以定义当`clearSelectAllContent`事件被触发时，应该执行的操作
    selectedTexts.value = [''];  // 举例：清空输入框
}

const makeDraggable=(dragHandleSelector, draggableElementSelector)=>{
  const dragHandle = document.querySelector(dragHandleSelector);
  const draggableElement = document.querySelector(draggableElementSelector);
  let isDragging = false;
  let offsetX, offsetY;

  const onMouseDown = (e) => {
    isDragging = true;
    offsetX = e.clientX - draggableElement.getBoundingClientRect().left;
    offsetY = e.clientY - draggableElement.getBoundingClientRect().top;
  };

  const onMouseMove = (e) => {
    if (isDragging) {
      const x = e.clientX - offsetX;
      const y = e.clientY - offsetY;
      draggableElement.style.left = x + 'px';
      draggableElement.style.top = y + 'px';
    }
  };

  const onMouseUp = () => {
    isDragging = false;
  };

  dragHandle.addEventListener('mousedown', onMouseDown);
  window.addEventListener('mousemove', onMouseMove);
  window.addEventListener('mouseup', onMouseUp);

  // 返回一个清理函数，用于移除事件监听器
  return () => {
    dragHandle.removeEventListener('mousedown', onMouseDown);
    window.removeEventListener('mousemove', onMouseMove);
    window.removeEventListener('mouseup', onMouseUp);
  };
}


onMounted(() => {
  document.addEventListener('elementSelected', onElementSelected);
  document.addEventListener('elementDeselected', onElementDeselected);
  document.addEventListener('clearSelectAllContent', handleClearAll);
  // 使用拖拽函数
  cleanupDraggable = makeDraggable('.custom-popup', '.custom-popup');
});

onUnmounted(() => {
  document.removeEventListener('elementSelected', onElementSelected);
  document.removeEventListener('elementDeselected', onElementDeselected);
  // 使用清理函数移除事件监听器
  if (cleanupDraggable) {
    cleanupDraggable();
  }
});
</script>

<style scoped>
.custom-popup {
  position: fixed;
  top: 5%;
  right: 5%;
  z-index: 10019999;
  width: 450px;
  background-color: white;
  border: 1px solid black;
  padding: 20px;
  box-shadow: 0px 0px 10px rgba(0,0,0,0.5);
  color:#000;
  border-radius: 15px;
  max-height:85%;
  overflow-y: auto;
}
.custom-popup, .custom-popup * {
  user-select: none !important;
  -webkit-user-select: none !important;/* Chrome 和 Safari */
  -moz-user-select: none !important;    /* Firefox */
  -ms-user-select: none !important;     /* Internet Explorer */
}
/* .close-btn{
  padding: 6px 10px;
  color: #fff;
  background: pink;
  font-size: 14px;
  text-align: center;
  cursor: pointer;
} */
.title{
  font-size: 16px;
  color:#444;
  line-height: 20px;
  text-align: center;
  margin-bottom:10px;
}
ul,li{
  list-style: none;
}
.select-list,.select-list li,.select-list li input{
  width:100%
}
.select-list li input{
  height:25px;
  outline: none;
}
.select-list{
  margin-bottom:10px;
}
.button-group{
  text-align: center;
}
.action-button{
  display: inline-block;
  margin-right:10px;
  padding: 3px 15px;
  text-align: center;
  color: #fff;
  border-radius: 20px;
  outline: none;
  font-size: 14px;
  cursor: pointer;
}
</style>

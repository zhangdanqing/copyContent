import { selectedElements,unhighlightElement } from './ElementSelector.js';

// 当接收到来自popup的消息时，注入和挂载Vue组件
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'activateOverlay') {
    // 检查是否已经存在一个浮层
    const existingOverlay = document.getElementById('overlay-background');
    
    if (existingOverlay) {
      // 如果已经存在，直接返回，不再添加新的浮层
      return;
    }

    window.isPopupVisible = true;
    // 创建一个半透明的浮层覆盖整个页面
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0,0,0,0.2)';
    overlay.style.zIndex = '9998'; // 确保它位于页面的其他元素下方，但在Vue弹窗上方
    overlay.style.pointerEvents = 'none';
    overlay.id='overlay-background';
    document.body.appendChild(overlay);

    // 创建一个div作为Vue组件的挂载点
    const appDiv = document.createElement('div');
    appDiv.id = 'overlay-popup';
    appDiv.style.zIndex = '9999'; // 确保Vue弹窗位于浮层之上
    document.body.appendChild(appDiv);

    // 移除旧的 <script> 元素（如果存在）
    const oldScript = document.querySelector("script[src*='overlayPopup.js']");
    if (oldScript) {
      oldScript.remove();
    }

    // 注入编译后的Vue组件
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('overlayPopup.js');
    document.body.appendChild(script);
  }
});

function closeOverlayPopup() {
  const appDiv = document.getElementById('overlay-popup');
  const overlayDiv = document.getElementById('overlay-background'); // 新增ID用于后续移除

  if (appDiv) {//移除弹窗
    document.body.removeChild(appDiv);
  }
  
  if (overlayDiv) { // 也移除此浮层
    document.body.removeChild(overlayDiv);
  }

  window.isPopupVisible = false;
  // 清除所有已选元素的边框样式
  for (let element of selectedElements) {
    unhighlightElement(element);
  }
  // 清空已选元素数组
  selectedElements.length = 0;
}

document.addEventListener('closeOverlayPopupEvent', closeOverlayPopup);

function clearOverlayPopup() {
  // 清除所有已选元素的边框样式
  for (let element of selectedElements) {
    unhighlightElement(element);
  }
  // 清空已选元素数组
  selectedElements.length = 0;
}

document.addEventListener('clearOverlayPopupEvent', clearOverlayPopup);


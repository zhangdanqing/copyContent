// ElementSelector.js
let selectedElements = [];
// 初始化标志为false
window.isPopupVisible = false;

function highlightElement(element) {
  element.style.outline = '2px solid #f05654'; // 砖红色的边框
  element.style.backgroundColor = 'rgba(156, 30, 30, 0.5)'; // 50%透明度砖红色的背景
}

function hoverElement(element) {
  if (!selectedElements.includes(element)) {
      element.style.outline = '2px solid goldenrod'; // 土黄色的边框
      element.style.backgroundColor = 'rgba(218, 165, 32, 0.5)'; // 50%透明度土黄色的背景
  }
}

function unhighlightElement(element) {
  element.style.outline = ''; 
  element.style.backgroundColor = ''; 
}

// 当鼠标移出元素时，如果该元素未被选中，取消其悬停样式
function handleMouseOut(outEvent) {
  if (!window.isPopupVisible || !selectedElements.includes(outEvent.target)) {
      unhighlightElement(outEvent.target);
  }
}

document.body.addEventListener('mouseover', function(overEvent) {
  if (!window.isPopupVisible || overEvent.target.closest('.custom-popup')) {
    return;
  }
  hoverElement(overEvent.target);
});

document.body.addEventListener('mouseout', function(outEvent) {
  if (!window.isPopupVisible || outEvent.target.closest('.custom-popup')) {
    return;
  }
  handleMouseOut(outEvent);
});

function clearOverlayPopup() {
  // 清除所有已选元素的边框样式
  for (let element of selectedElements) {
    unhighlightElement(element);
  }
  // 清空已选元素数组
  selectedElements.length = 0;
}
document.addEventListener('clearOverlayPopupEvent', clearOverlayPopup);
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

document.body.addEventListener('click', function(clickEvent) { 
  if (!window.isPopupVisible || clickEvent.target.closest('.custom-popup')) {
    return;
  }
  clickEvent.preventDefault();
  
  const isSelectAllActive = localStorage.getItem('isSelectAllActive') === 'true';
  if (isSelectAllActive) {  // 检查全选状态
    localStorage.setItem('isSelectAllActive', 'false');
    clearOverlayPopup();
    selectedElements = [];
    //方便在overlayPopup中调用这个方法
    const clearEvent = new CustomEvent('clearSelectAllContent');
    document.dispatchEvent(clearEvent);
  }

  if (selectedElements.includes(clickEvent.target)) {
      // 如果元素已经被选中，取消选择
      unhighlightElement(clickEvent.target);
      selectedElements = selectedElements.filter(el => el !== clickEvent.target);

      const customEvent = new CustomEvent('elementDeselected', {
        detail: { text: clickEvent.target.innerText }
      });
      document.dispatchEvent(customEvent);
      
  } else {
      // 否则，选择元素
      highlightElement(clickEvent.target);
      selectedElements.push(clickEvent.target);

      const customEvent = new CustomEvent('elementSelected', {
        detail: { text: clickEvent.target.innerText }
      });
      document.dispatchEvent(customEvent);
  }
});



export { selectedElements,unhighlightElement };

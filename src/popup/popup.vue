<template>
  <div class="popup-box">
    <button @click="activateOverlay" class="btn">选择元素</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      texts: []
    };
  },
  created() {
  },
  mounted() {
    
  },
  methods: {
    activateOverlay() {
        const dataToSend = {
            type: 'activateOverlay',
            someData: 'Hello from popup!'
        };

        // 获取当前活动的标签
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            const activeTab = tabs[0];
            // 向当前活动的标签发送消息
            chrome.tabs.sendMessage(activeTab.id, dataToSend);
        });
        window.close();
    }
  }
}
</script>
<style scoped>
.popup-box{
  width:100px;
  padding: 10px;
  text-align: center;
}
.popup-box .btn{
  padding: 6px 10px;
  color: #fff;
  background: goldenrod;
  border-radius: 20px;
  text-align: center;
  border:none;
  outline: none;
  cursor: pointer;
}
</style>

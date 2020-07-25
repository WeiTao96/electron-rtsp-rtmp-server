<template>
  <div class="form">
    <el-tabs type="border-card" editable @edit="handleTabsEdit" style="height:100%">
      <el-tab-pane label="消息中心">
        <el-input v-model="inputPath" placeholder="请输入 RTSP 流"></el-input>
        <el-input v-model="outputPath" placeholder="请输入内容"></el-input>
        <el-button @click="handleSend">转换</el-button>
      </el-tab-pane>
      <el-tab-pane label="角色管理">角色管理</el-tab-pane>
      <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { ipcRenderer } from "electron";

@Component
export default class Home extends Vue {
  private inputPath = ''
  private outputPath = 'rtmp://(服务器所在IP)/live/(直播流名字)'

  private handleSend() {
    ipcRenderer.send('asynchronous-message', [this.inputPath,this.outputPath])

    // receive message from main.js
    ipcRenderer.on('asynchronous-reply', (event, arg) => {
      console.log(arg)

    })
  }

  private handleTabsEdit() {
    console.log(11);
    
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.form {
  height: 95vh;
}
</style>

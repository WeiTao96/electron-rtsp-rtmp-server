<template>
  <div>
    <div v-if="!isOnWork" class="input-form">
      <el-input class="item" v-model="inputPath" placeholder="请输入视频流"></el-input>
      <el-input class="item" v-model="outputPath" placeholder="请输入投屏地址"></el-input>
      <el-button class="item" @click="handleSend">投屏</el-button>
    </div>
    <div class="info-box" v-else>
      <el-button class="item" type="danger" @click="handleClose">关闭</el-button>
    </div>
    <div class="output-box">
      <p v-for="(item,index) in messages" :key="index" :class="item.type">{{item.message}}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { ipcRenderer } from "electron";

interface Message {
  from: string;
  type: string;
  message: string;
}

@Component
export default class HelloWorld extends Vue {
  private inputPath = "https://stream7.iqilu.com/10339/upload_transcode/202002/18/20200218093206z8V1JuPlpe.mp4";
  private outputPath = "http://192.168.1.80";
  private flvOutputPath = "";
  private isOnWork = false;
  private messages: Message[] = [];

  private handleSend() {
    ipcRenderer.send("dlna-message", [this.inputPath, this.outputPath]);

    this.isOnWork = true;


    // receive message from main.js
    ipcRenderer.on('asynchronous-reply', (event, arg: Message) => {
      if (arg.from === this.inputPath) {
        this.messages.push(arg);
      }
      if (arg.from === this.inputPath && arg.type === "error") {
        this.isOnWork = false;
      }
    });
  }
  
  private handleClose() {
    // ipcRenderer.send("rtsp-rtmp-message", [this.inputPath, this.outputPath,'SIGKILL']);
    this.isOnWork = false;
  }
}
</script>
<style scoped>
.input-form .item {
  margin: 5px;
}

.info-box {
  height: 150px;
  margin: 5px 0;
  padding: 5px;
  border: 1px solid #ebeef5;
}

.output-box {
  height: 280px;
  overflow: auto;
  padding: 5px;
  border: 1px solid #ebeef5;
}

.output-box span {
  color: #606266;
}

.output-box p {
  margin: 3px;
  text-align: left;
}
.success {
  color: #303133;
}
.error {
  color: #f56c6c;
}
</style>
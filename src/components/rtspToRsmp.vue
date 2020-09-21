<template>
  <div>
    <div v-if="!isOnWork" class="input-form">
      <el-input class="item" v-model="inputPath" placeholder="请输入 RTSP 流"></el-input>
      <el-input class="item" v-model="outputPath" placeholder="请输入内容"></el-input>
      <el-button class="item" @click="handleSend">转换</el-button>
    </div>
    <div class="info-box" v-else>
      <el-row :gutter="20">
        <el-col :span="10">
          <div>
            <p>rtmp 流地址：{{outputPath}}</p>
          </div>
        </el-col>
        <el-col :span="10">
          <div>
            <p>flv 流地址：{{flvOutputPath}}</p>
          </div>
        </el-col>
      </el-row>
      <el-button class="item" type="danger" @click="handleClose">关闭</el-button>
    </div>
    <div class="output-box">
      <p v-for="(item,index) in messages" :key="index" :class="item.type">{{item.message}}</p>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { ipcRenderer } from "electron";
import dataStore from "../db/dataStore";

interface Message {
  from: string;
  type: string;
  message: string;
}

@Component
export default class HelloWorld extends Vue {
  @Prop({ type: String, default: "" })
  channelId!: string;

  private inputPath = "";
  private outputPath = "rtmp://(服务器所在IP)/live/(直播流名字)";
  private flvOutputPath = "";
  private isOnWork = false;
  private messages: Message[] = [];

  created() {
    if (this.channelId) {
      const channel = dataStore
        .get("channels")
        .find({ id: this.channelId })
        .value();
      this.inputPath = channel.inputPath;
      this.outputPath = channel.outputPath;
      this.handleSend();
    }
  }

  private handleSend() {
    ipcRenderer.send("rtsp-rtmp-message", [this.inputPath, this.outputPath]);

    this.isOnWork = true;

    this.flvOutputPath =
      this.outputPath.replace("rtmp", "http").replace("/live", ":8000/live") +
      ".flv";

    if (this.channelId) {
      dataStore
        .get("channels")
        .updateById(this.channelId, {
          id: this.channelId,
          inputPath: this.inputPath,
          outputPath: this.outputPath,
        })
        .write();
    } else {
      dataStore
        .get("channels")
        .insert({
          inputPath: this.inputPath,
          outputPath: this.outputPath,
        })
        .write();
    }

    console.log(dataStore.get("channels").value());

    // receive message from main.js
    ipcRenderer.on("asynchronous-reply", (event, arg: Message) => {
      if (arg.from === this.inputPath) {
        this.messages.push(arg);
      }
      if (arg.from === this.inputPath && arg.type === "error") {
        this.isOnWork = false;
      }
    });
  }

  private handleClose() {
    ipcRenderer.send("rtsp-rtmp-message", [
      this.inputPath,
      this.outputPath,
      "SIGKILL",
    ]);
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
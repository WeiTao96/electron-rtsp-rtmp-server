<template>
  <div class="form">
    <el-tabs type="border-card" addable v-model="editableTabsValue" @edit="handleTabsEdit" style="height:100%">
      <el-tab-pane :label="item" :name="item" v-for="item in tabs" :key="item">
        <rtsp-to-rsmp ref="item"/>
      </el-tab-pane>
      <!-- <el-tab-pane label="角色管理">角色管理</el-tab-pane>
      <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue  } from "vue-property-decorator";
import rtspToRsmp from "@/components/rtspToRsmp.vue";
@Component({
  components: {
    rtspToRsmp,
  },
})
export default class Home extends Vue {
  private tabs = ["通道1"];
  private editableTabsValue = '通道1'

  private handleTabsEdit(targetName: string, action: string) {
    if (action === "add") {
      console.log(targetName);
      const newTab = "通道" + (this.tabs.length + 1)
      this.tabs.push(newTab);
      this.editableTabsValue = newTab
    }
    if (action === "remove" && targetName) {
      console.log((this.$refs[targetName] as any));
      // const index = this.tabs.findIndex((name)=>{
      //   return name === targetName
      // })
      // this.tabs.splice(index,1)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.form {
  height: 95vh;
}
</style>

<template>
  <div class="form">
    <el-tabs type="border-card" editable @edit="handleTabsEdit" style="height:100%">
      <el-tab-pane label="消息中心">
        <rtsp-to-rsmp />
      </el-tab-pane>
      <el-tab-pane label="角色管理">角色管理</el-tab-pane>
      <el-tab-pane label="定时任务补偿">定时任务补偿</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import rtspToRsmp from "@/components/rtspToRsmp.vue";
@Component({
  components: {
    rtspToRsmp,
  },
})
export default class Home extends Vue {
  

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

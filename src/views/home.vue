<template>
  <div class="form">
    <el-tabs
      type="border-card"
      editable
      v-model="editableTabsValue"
      @edit="handleTabsEdit"
      style="height:100%"
    >
      <el-tab-pane :label="item.name" :name="item.name" v-for="item in tabs" :key="item.name">
        <rtsp-to-rsmp ref="tabs" :channelId="item.id" />
      </el-tab-pane>
      <!-- <el-tab-pane label="角色管理">角色管理</el-tab-pane> -->
      <el-tab-pane label="投屏" name="投屏" :closable="false">
        <cast />
      </el-tab-pane>
      <el-tab-pane label="系统设置" name="系统设置" :closable="false">
        <systemSetting />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import rtspToRsmp from "@/components/rtspToRsmp.vue";
import systemSetting from "@/components/setting.vue";
import cast from "@/components/cast.vue";
import dataStore from "@/db/dataStore";
import { channel } from "@/types/index";
@Component({
  components: {
    rtspToRsmp,
    cast,
    systemSetting,
  },
})
export default class Home extends Vue {
  private tabs = [
    {
      name: "通道1",
      id: "",
    },
  ];
  private editableTabsValue = "通道1";

  created() {
    const list = dataStore.get("channels").value();
    list.forEach((item: channel) => {
      this.tabs.push({
        name: "通道" + (this.tabs.length + 1),
        id: item.id,
      });
    });
  }

  private handleTabsEdit(targetName: string, action: string) {
    if (action === "add") {
      const newTab = "通道" + (this.tabs.length + 1);
      this.tabs.push({
        name: newTab,
        id: "",
      });
      this.editableTabsValue = newTab;
    }
    if (action === "remove" && targetName) {
      const domList = (this.$refs['tabs'] as rtspToRsmp[])

      const index = this.tabs.findIndex((item)=>{
        return item.name === targetName
      })
      domList[index].hanleCloseToParent()
      this.tabs.splice(index,1)
      if(this.tabs.length>0){
        this.editableTabsValue = this.tabs[0].name
      }else{
        this.editableTabsValue = '系统设置'
      }
    
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

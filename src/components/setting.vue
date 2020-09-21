<template>
  <div>
    <el-checkbox v-model="systemSetting.openAtLogin" @change="handleSystemSettingChange">是否开机启动</el-checkbox>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { ipcRenderer } from "electron";
import { systemSetting } from "@/types";
import dataStore from "@/db/dataStore";

@Component
export default class Setting extends Vue {
  private systemSetting: systemSetting | null = null;

  created() {
    this.systemSetting = dataStore.get("systemStting").value();
  }

  private handleSystemSettingChange() {
    ipcRenderer.send("system-setting-message", this.systemSetting);

    dataStore.set("systemStting", this.systemSetting).write();
  }
}
</script>
<style scoped>
</style>
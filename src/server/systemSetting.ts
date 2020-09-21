import { app, protocol, BrowserWindow } from 'electron'
import { ipcMain } from 'electron'
import { systemSetting } from "@/types";
import dataStore from "@/db/dataStore";

export default class SystemSetting {
    start() {
        let systemSetting = dataStore.get("systemStting").value();
        console.log(systemSetting);

        app.setLoginItemSettings(systemSetting)
    }
    change() {
        ipcMain.on('system-setting-message', (event, arg: systemSetting) => {
            console.log(arg);

            app.setLoginItemSettings(arg)
        })
    }
}
import { app, protocol, BrowserWindow } from 'electron'
import { ipcMain } from 'electron'
import { systemSetting } from "@/types";
import dataStore from "@/db/dataStore";
import { ws } from './wsServer'

export default class SystemSetting {
    start() {
        let systemSetting = dataStore.get("systemStting").value();

        app.setLoginItemSettings({
            openAtLogin:systemSetting.openAtLogin
        })

        if(systemSetting.wsSub){
            ws.start()
        }
    }
    change() {
        ipcMain.on('system-setting-message', (event, arg: systemSetting) => {
            console.log(arg);

            app.setLoginItemSettings({
                openAtLogin:arg.openAtLogin
            })

            if(arg.wsSub){
                ws.start()
            }
        })
    }
}
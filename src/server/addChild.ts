import { ipcMain } from 'electron'
import { start } from './pushVideo'
import ffmpeg from 'fluent-ffmpeg';
import myCasts from './mediaRender'
let myCast = new myCasts()

export default class MyChildProcess {
    private childProcessLst: { [index: string]: ffmpeg.FfmpegCommand } = {}
    startChildProcess() {
        ipcMain.on('rtsp-rtmp-message', (event, arg: string[]) => {
            let inputPath = arg[0]
            let outputPath = arg[1]
            let id = arg[2]

            if (this.childProcessLst[outputPath] && arg[3]) {
                this.childProcessLst[outputPath].kill('SIGKILL')
                delete this.childProcessLst[outputPath]
            } else if (this.childProcessLst[outputPath] && !arg[3]) {
                event.sender.send('asynchronous-reply', { from: id, type: 'error', message: '输出路径重复' })
            } else {
                let ffmpeg = start(inputPath, outputPath, id, event)
                
                if (ffmpeg) {
                    this.childProcessLst[outputPath] = ffmpeg
                } else {
                    event.sender.send('asynchronous-reply', { from: id, type: 'error', message: '创建失败' })
                }
            }

        });
        ipcMain.on('dlna-message', (event, arg: string[]) => {
            let videoUrl = arg[0]
            let tvUrl = arg[1]
            let type = 'video/mp4'
            myCast.start(videoUrl,tvUrl,type)
        });

    }

    endChildProcess() {
        for (const key in this.childProcessLst) {
            if (Object.prototype.hasOwnProperty.call(this.childProcessLst, key)) {
                const element = this.childProcessLst[key];
                element.kill('SIGKILL')
            }
        }
    }
}

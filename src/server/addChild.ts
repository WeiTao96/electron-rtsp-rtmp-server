import { ipcMain } from 'electron'
import { start } from './pushVideo'
import ffmpeg from 'fluent-ffmpeg';

export default class MyChildProcess {
    private childProcessLst: { [index: string]: ffmpeg.FfmpegCommand } = {}
    startChildProcess() {
        ipcMain.on('rtsp-rtmp-message', (event, arg: string[]) => {
            let inputPath = arg[0]
            let outputPath = arg[1]

            if (this.childProcessLst[outputPath] && arg[2]) {
                this.childProcessLst[outputPath].kill('SIGKILL')
                delete this.childProcessLst[outputPath]
            } else if (this.childProcessLst[outputPath] && !arg[2]) {
                event.sender.send('asynchronous-reply', { from: inputPath, type: 'error', message: '输出路径重复' })
            } else {
                let ffmeg = start(inputPath, outputPath,event)
                if (ffmeg) {
                    this.childProcessLst[outputPath] = ffmeg
                }else {
                    event.sender.send('asynchronous-reply', { from: inputPath, type: 'error', message: '创建失败' })
                }
            }

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
// export function startChildProcess() {
//     let childProcessLst: { [index: string]: child.ChildProcess }
//     ipcMain.on('rtsp-rtmp-message', (event, arg: string[]) => {
//         let inputPath = arg[0]
//         let outputPath = arg[1]

//         if (childProcessLst[outputPath]&&arg[2]) {
//             childProcessLst[outputPath].kill()
//         } else if(childProcessLst[outputPath]&&!arg[2]){
//             event.sender.send(outputPath, { from: inputPath, type: 'error', message: '输出路径重复' })
//         } else {
//             childProcessLst[outputPath] = child.fork('./childProcess')
//             childProcessLst[outputPath].send([inputPath,outputPath])
//         }


//         // send message to index.html
//     });
// }
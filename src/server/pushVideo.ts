// import ffmpeg from "fluent-ffmpeg"
import { ipcRenderer } from 'electron'
import ffmpeg from 'fluent-ffmpeg';
const path = require('path');
const ffmpegPath = path.join(__dirname, '../public/ffmpeg/bin/ffmpeg.exe').replace(/\\/g, "\/");
const ffprobePath = path.join(__dirname, '../public/ffmpeg/bin/ffprobe.exe').replace(/\\/g, "\/");
const flvtoolPath = path.join(__dirname, '../public/ffmpeg/bin/ffplay.exe').replace(/\\/g, "\/");

// const ffmpegPath = "../static/ffmpeg/bin/ffmpeg.exe";
// const ffprobePath = "../static/ffmpeg/bin/ffprobe.exe";
// const flvtoolPath = "../static/ffmpeg/bin/ffplay.exe";

export interface option {
    inputPath: string;
    outputPath: string;
    id:string;
    args?: string[]
}

export function start(inputPath: string, outputPath: string, id:string ,event: Electron.IpcMainEvent) {
    let option: option = {
        inputPath: inputPath,
        outputPath: outputPath,
        id:id,
        args: [
            '-vcodec copy',
            '-acodec copy',
            '-rtsp_transport tcp',
            '-buffer_size 102400',
            '-c:a aac',
            '-f flv'
        ]
    }

    if (!option.inputPath || !option.outputPath) {
        // event.sender.send('asynchronous-reply', '数据不完整');
        event.sender.send('asynchronous-reply', { from: option.id, type: 'error', message: '数据不完整' });

    } else {
        return startPushVideo(option,event)
    }

    // send message to index.html
}

function startPushVideo(option: option,event: Electron.IpcMainEvent) {

    //设置输入流地址
    let ffCommand = ffmpeg(option.inputPath)
        //设置输出流地址
        .output(option.outputPath)
        //因需要打包客户端软件,故而将ffmpeg打包进软件中
        //需设置各应用程序的对应路径
        //若仅在本机使用,可以跳过该步骤
        //设置环境变量,添加 PATH 即可
        .setFfmpegPath(ffmpegPath)
        .setFfprobePath(ffprobePath)
        .setFlvtoolPath(flvtoolPath)
    //为保证灵活性,非必须参数采用配置文件读取模式
    if (option.args && option.args.length > 0) {
        for (const iterator of option.args) {
            ffCommand.outputOption(iterator);
        }
    }
    ffCommand.on("start", (commandLine) => {
        //commandLine 为实际上调用的命令行命令,拼接逻辑为
        //您的ffmpeg所在路径 -i inputOptions 您的拉流协议和路径 outputOptions 推送流协议和地址
        //ffmpeg -i "rtsp://yourPullUrl" -f flv -r 25 -s 640x480 -an "rtmp://yourPushUrl"
        // { from:option.inputPath,type:success,message:'' }
        event.sender.send('asynchronous-reply', { from: option.id, type: 'success', message: '[' + getDateTime() + '] Vedio is Pushing !' });
        event.sender.send('asynchronous-reply', { from: option.id, type: 'success', message: '[' + getDateTime() + '] Spawned Ffmpeg with command !' });
        event.sender.send('asynchronous-reply', { from: option.id, type: 'success', message: '[' + getDateTime() + '] Command: ' + commandLine });

        // event.sender.send('asynchronous-reply', '[' + getDateTime() + '] Vedio is Pushing !');
        // event.sender.send('asynchronous-reply', '[' + getDateTime() + '] Spawned Ffmpeg with command !');
        // event.sender.send('asynchronous-reply', '[' + getDateTime() + '] Command: ' + commandLine);

    })
        .on('error', function (err, stdout, stderr) {
            event.sender.send('asynchronous-reply', { from: option.id, type: 'error', message: 'error: ' + err.message });
            event.sender.send('asynchronous-reply', { from: option.id, type: 'error', message: 'stdout: ' + stdout });
            event.sender.send('asynchronous-reply', { from: option.id, type: 'error', message: 'stderr: ' + stderr });

            // event.sender.send('asynchronous-reply', 'error: ' + err.message);
            // event.sender.send('asynchronous-reply', 'stdout: ' + stdout);
            // event.sender.send('asynchronous-reply', 'stderr: ' + stderr);
        })
        .on('end', function () {
            event.sender.send('asynchronous-reply', { from: option.id, type: 'error', message: '[' + getDateTime() + '] Vedio Pushing is Finished !' });

            // event.sender.send('asynchronous-reply', '[' + getDateTime() + '] Vedio Pushing is Finished !');
        })
        .run();
    return ffCommand
}

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();

    var min = date.getMinutes();

    var sec = date.getSeconds();

    var year = date.getFullYear();

    var month = date.getMonth() + 1;

    var day = date.getDate();

    return year + "-" + month + "-" + day + ":" + hour + ":" + min + ":" + sec;

}
// export function startPushVideo():void{
//     getCommands().then((commands:ffmpegPaths[])=>{
//         for(let key in commands){
//             let command = commands[key];
//             //设置输入流地址
//             let ffCommand = ffmpeg(command.inputPath)
//             //设置输出流地址
//             .output(command.outputPath)
//             //因需要打包客户端软件,故而将ffmpeg打包进软件中
//             //需设置各应用程序的对应路径
//             //若仅在本机使用,可以跳过该步骤
//             //设置环境变量,添加 PATH 即可
//             .setFfmpegPath(ffmpegPath)
//             .setFfprobePath(ffprobePath)
//             .setFlvtoolPath(flvtoolPath)
//             //为保证灵活性,非必须参数采用配置文件读取模式
//             .size(command.size);
//             for(let key in command.args){
//                 ffCommand.outputOption(command.args[key]);
//             }
//             ffCommand.on("start",(commandLine)=>{
//                 //commandLine 为实际上调用的命令行命令,拼接逻辑为
//                 //您的ffmpeg所在路径 -i inputOptions 您的拉流协议和路径 outputOptions 推送流协议和地址
//                 //ffmpeg -i "rtsp://yourPullUrl" -f flv -r 25 -s 640x480 -an "rtmp://yourPushUrl"
//                 console.log('[' + showTime() + '] Vedio is Pushing !');
//                 console.log('[' + showTime() + '] Spawned Ffmpeg with command !');
//                 console.log('[' + showTime() + '] Command: ' + commandLine);
//             })
//             .on('error', function(err, stdout, stderr) {
//                 console.log('error: ' + err.message);
//                 console.log('stdout: ' + stdout);
//                 console.log('stderr: ' + stderr);
//             })
//             .on('end', function() {
//                 console.log('[' + showTime() + '] Vedio Pushing is Finished !');
//             })
//             .run();
//         }
//     },(error)=>{
//         console.log('error: ' + error);
//     })
// }
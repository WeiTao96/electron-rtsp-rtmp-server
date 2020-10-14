import express from 'express';
import expressWebSocket from 'express-ws';
import ffmpeg from "fluent-ffmpeg";

// var express = require('express');
// var expressWebSocket = require('express-ws')(server);

const webSocketStream = require('websocket-stream/stream')

const path = require('path');

const ffmpegPath = path.join(__dirname, '../public/ffmpeg/bin/ffmpeg.exe').replace(/\\/g, "\/");
const ffprobePath = path.join(__dirname, '../public/ffmpeg/bin/ffprobe.exe').replace(/\\/g, "\/");
const flvtoolPath = path.join(__dirname, '../public/ffmpeg/bin/ffplay.exe').replace(/\\/g, "\/");

// export function videoServer() {
//     let app = express()
//     app.use(express.static(__dirname))
//     expressWebSocket(app, null, {
//         wsOptions: {
//             perMessageDeflate: true
//         }
//     })
//     app.ws('/rtsp/', rtspRequestHandle)
//     app.listen(8888)
//     console.log('express listening');

// }

// function rtspRequestHandle(ws: any, req: any) {
//     console.log('rtsp request handle')
//     const stream = webSocketStream(ws, {
//         binary: true,
//         browserBufferTimeout: 10000
//     },
//         {
//             browserBufferTimeout: 10000
//         })
//     let url = req.query.url + '/starttime=' + req.query.starttime + '&endtime=' + req.query.endtime
//     console.log('rtsp url:', url)
//     console.log('rtsp query:', req.query)
//     //设置输入流地址
//     let ffCommand = ffmpeg(url)
//         //设置输出流地址
//         //因需要打包客户端软件,故而将ffmpeg打包进软件中
//         //需设置各应用程序的对应路径
//         //若仅在本机使用,可以跳过该步骤
//         //设置环境变量,添加 PATH 即可
//         .setFfmpegPath(ffmpegPath)
//         .setFfprobePath(ffprobePath)
//         .setFlvtoolPath(flvtoolPath)
//     try {
//         ffCommand
//             .addInputOption('-rtsp_transport', 'tcp', '-buffer_size', '102400') // 这里可以添加一些 RTSP 优化的参数
//             .on('start', function () {
//                 console.log(url, 'Stream started.')
//             })
//             .on('codecData', function () {
//                 console.log(url, 'Stream codecData.')
//             })
//             .on('error', function (err) {
//                 console.log(url, 'An error occured: ', err.message)
//             })
//             .on('end', function () {
//                 console.log(url, 'Stream end!')
//             })
//             .outputFormat('flv').videoCodec('copy').noAudio().pipe(stream)
//     } catch (error) {
//         console.log(error)
//     }
// }


class wsServer {
    private server: any = null
    start() {
        this.server = express()
        this.server.use(express.static(__dirname))
        expressWebSocket(this.server, undefined, {
            wsOptions: {
                perMessageDeflate: true
            }
        })
        this.server.ws('/rtsp/', this.rtspRequestHandle)
        this.server.listen(8001)
        console.log('wsServer listening on port: 8001');
    }
    private rtspRequestHandle(ws: any, req: any) {
        console.log('rtsp request handle')
        const stream = webSocketStream(ws, {
            binary: true,
            browserBufferTimeout: 10000
        },
            {
                browserBufferTimeout: 10000
            })
        let url = req.query.url
        if(req.query.starttime&&req.query.endtime){
            url = req.query.url +  '?starttime=' + req.query.starttime + '&endtime=' + req.query.endtime
        }
        console.log('rtsp url:', url)
        console.log('rtsp query:', req.query)
        //设置输入流地址
        let ffCommand = ffmpeg(url)
            //设置输出流地址
            //因需要打包客户端软件,故而将ffmpeg打包进软件中
            //需设置各应用程序的对应路径
            //若仅在本机使用,可以跳过该步骤
            //设置环境变量,添加 PATH 即可
            .setFfmpegPath(ffmpegPath)
            .setFfprobePath(ffprobePath)
            .setFlvtoolPath(flvtoolPath)
        try {
            ffCommand
                .addInputOption('-rtsp_transport', 'tcp', '-buffer_size', '102400') // 这里可以添加一些 RTSP 优化的参数
                .on('start', function () {
                    console.log(url, 'Stream started.')
                })
                .on('codecData', function () {
                    console.log(url, 'Stream codecData.')
                })
                .on('error', function (err) {
                    console.log(url, 'An error occured: ', err.message)
                })
                .on('end', function () {
                    console.log(url, 'Stream end!')
                })
                .outputFormat('flv').videoCodec('copy').noAudio().pipe(stream)
        } catch (error) {
            console.log(error)
        }
    }
}

export const ws = new wsServer()
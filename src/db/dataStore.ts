import FileSync from 'lowdb/adapters/FileSync'
import path from 'path'
import fs from 'fs-extra'
import { app, remote } from 'electron'
const LodashId = require('lodash-id');
const Datastore = require('lowdb')

const APP = process.type === 'renderer' ? remote.app : app // 根据process.type来分辨在哪种模式使用哪种模块

const STORE_PATH = APP.getPath('userData')

if (process.type !== 'renderer') {
    if (!fs.pathExistsSync(STORE_PATH)) { // 如果不存在路径
        fs.mkdirpSync(STORE_PATH) // 就创建
    }
}

const adapter = new FileSync(path.join(STORE_PATH, '/data.json'))

const db = Datastore(adapter)
db._.mixin(LodashId)

if (!db.has('channels').value()) {
    db.set('channels', []).write()
}

if (!db.has('systemStting').value()) {
    db.set('systemStting', {
        openAtLogin: true
    }).write()
}

export default db
const express = require('express')
const bodyParser = require('body-parser')
const log = console.log.bind(console)
// 初始化
const app = express()
// 设置 bodyParser
app.use(bodyParser.urlencoded({
    extended: false,
}))
// 设置 bodyParser 解析 json 格式的数据
app.use(bodyParser.json())
// 配置静态文件目录
app.use(express.static('views'))
//注册路由
const index  = require('./route/index')
app.use('/', index)
const movie  = require('./route/movie')
app.use('/api/movie', movie)


const run = (port=3000, host='') => {
    const server = app.listen(port, host, () => {
        const address = server.address()
        host = address.address
        port = address.port
        log(`listening server at http://${host}:${port}`)
    })
}
if (require.main === module) {
    const port = 2018
    const host = '0.0.0.0'
    run(port, host)
}
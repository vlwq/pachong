const express = require('express')
const bodyParser = require('body-parser')
const log = console.log.bind(console)
// 先初始化一个 express 实例
const app = express()
// 设置 bodyParser
// application/x-www-form-urlencoded
//在web中传输的非ASCII字符需要进行编码
app.use(bodyParser.urlencoded({
    extended: false,
}))
// 设置 bodyParser 解析 json 格式的数据
// application/json
app.use(bodyParser.json())
// 配置静态资源文件, 比如 js css 图片
// const asset = __dirname + '/static'
// app.use('/static', express.static(asset))
// 配置静态文件目录
app.use(express.static('static'))

// 使用 app.use(path, route) 的方式注册路由程序
const index  = require('./route/index')
app.use('/', index)
const movie  = require('./route/movie')
app.use('/api/movie', movie)

const run = (port=3000, host='') => {
    const server = app.listen(port, host, () => {
        // 非常熟悉的方法
        const address = server.address()
        host = address.address
        port = address.port
        log(`listening server at http://${host}:${port}`)
    })
}
if (require.main === module) {
    const port = 8000
    // host 参数指定为 '0.0.0.0' 可以让别的机器访问你的代码
    const host = '0.0.0.0'
    run(port, host)
}
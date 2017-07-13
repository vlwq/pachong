//返回协议、端口、路径、host。根据协议返回net.Socket 实例或tls.TLSSocket 实例的工具js
const ut = require('./utils.js')
let allData = ''
let id = 0
const get = (url, query, callback) => {
    const {host , port , path ,protocol} = ut.parsedUrl(url)
    const client = ut.socketByProtocol(protocol)
    //查询条件
    const p = ut.pathWithQuery(path , query)
    //请求
    client.connect(port, host, () => {
        while (query.start <= 225){
            console.log('query.start: ', query.start)
            let request = `GET ${path}?start=${query.start} HTTP/1.1\r\nHost:${host}\r\n\r\n`
            client.write(request)
            query.start = query.start + 25
        }
    })
    //响应
    client.on('data', (d) => {
        const data = d.toString('utf8')
        allData = allData + data
    })
    // 当数据接收完成后, 会触发 end 事件, 所以解析的操作在这里完成
    client.on('end', () => {
        let movies = []
        const  contents = allData.split('<div class="pic">')
        for(let i = 1 ; i<contents.length ; i++) {
            let c = parseHtml(contents[i])
            movies.push(c)
        }
        //callback(movies)
        save(movies, "last.txt")
    })

    // client 关闭的时候触发这个事件
    client.on('close', function() {
        //console.log(movies)
        console.log('connection closed')
    })
}

const parseHtml = (s)=>{
    let data = String(s)
    //每一页的一个电影模块
    let  movie = new Movie()
    id = id + 1
    //
    movie.id = id
    //
    let  temp  = data.split( 'class="title">')[1] || ''
    movie.name = temp.split('</span>') [0] || ''
    //
    temp  = data.split( '<span class="rating_num" property="v:average">')[1] || ''
    movie.mark = temp.split('</span>') [0] || ''
    //
    temp  = data.split( '<span class="inq">')[1] || ''
    movie.quote = temp.split('</span>') [0] || ''
    //
    let people = data.split('人评')[0] || ''
    movie.peopleNum = people.slice(people.lastIndexOf('<span>') + 6)
    //log(movie)
    return movie

}

const fs = require('fs')
const save = (data, path) => {
    // 默认情况下使用 JSON.stringify 返回的是一行数据
    // 开发的时候不利于读, 所以格式化成缩进 2 个空格的形式
    const s = JSON.stringify(data, null, 2)
    fs.writeFileSync(path, s)
}

class Movie {
    constructor() {
        // 分别是电影名/评分/引言/排名/封面图片链接
        this.id = 0
        this.name = ''
        this.mark = 0
        this.quote = ''
        this.peopleNum = 0
    }
}

// 使用
const main = () => {
    const url = 'https://movie.douban.com/top250'
    const query = {
        start: 0
    }
    const callback = (r) => {
        console.log(r)
    }
    get(url, query, callback)
}

main()
//依赖模块
const fs = require('fs');
const request = require("request");
const cheerio = require("cheerio");
const utils = require('./utils')
//
const log = function() {
    console.log.apply(console, arguments);
}

let aa = 0

// "id": 2,
//     "views": 63,
//     "title": "dajkdjasjdlasd",
//     "content": "```\r\n\r\nvar a = 爆栈红模式\r\nreturn function(){\r\n  return 1*1\r\n}\r\n\r\n```",
//     "ct": 1499343059309,
//     "ut": 1499343059309,
//     "user_id": -1,
//     "board_id": 0


const Article = function() {
    aa = aa + 1
    this.id = aa
    this.ct= 1499343059309,
        this.ut= 1499343059309,
        this.user_id= -1,
        this.board_id= parseInt(Math.random()*6)
    this.title = ''
    this.content = ''
}
//
const GetTitles = function(object){
    //
    var a = new Article()
    a.title = object.label +"-"+object.title
    a.content = "![]("+object.thumb+")" + "    链接见："+object.url_show
    return a
}

//
const processData = function(body) {
    const options = {
        decodeEntities: false,
    }
    const e = cheerio.load(body, options)
    var data = JSON.parse(body)
    //处理数据
    var news = []
    if (data.state === 'success') {
        let list = data.result.list
        //log(list.length)
        for(let i = 0; i < list.length; i++) {
            let element = list[i]
            const m = GetTitles(element)
            news.push(m)
        }
        return news
        //const path = 'articles.txt'
        //utils.saveJSON(path, news)
    } else {
        log('请求失败！')
    }
}

//缓存文件
const cachedUrl = function(path) {
    fs.readFile(path, function(err, data){
        if (err != null) {
            return true
        } else {
            log('读取到缓存的页面', path)
            log('数据是：',data.toString())
            return false
        }
    })
}

const catchNews = function(pageno) {
    const baseUrl = 'http://m.cnbeta.com/touch/default/timeline.json?page=';
    const url = baseUrl + pageno;
    const path = `cnbeta-${pageno}.txt`
    //如果不是第一次访问
    if (cachedUrl(path) == false) {
        return fasle
    }
    //第一次访问
    request(url, function(error, response, body){
        if (error === null && response.statusCode == 200) {
            const news = processData(body)
            utils.saveJSON(path, news)
        } else {
            log('*** ERROR 请求失败 ', error)
        }
    })
}

const main =function(){
    var pageno = 2
    //for(var i=1;i<5;i++){
        catchNews(1)
    //}
}

main()

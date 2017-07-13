const net = require('net')
const tls = require('tls')
/*
 资料:
 在 Node 中, buffer 转换为 string 用的是
 buffer.toString()

 其他请参考上课内容, 不懂在群里论坛填表提问, 不要憋着
 """


 //# 1
 //# 补全函数
 */
const  log = function(){
    console.log.apply(console,arguments)
}
/*
 返回一个 object, 内容如下
 {
 protocol: protocol,
 host: host,
 port: port,
 path: path,
 }
 */
const parsedUrl = (url) => {
    const p = protocolOfUrl(url)
    const h = hostOfUrl(url)
    const port = portOfUrl(url)
    const path = pathOfUrl(url)
    const o ={
        protocol:p ,
        host: h,
        port: port,
        path: path,
    }
    return o
}

/**
 * protocol
 */
const protocolOfUrl = (url) => {
    if (url.startsWith('https://')) {
        return 'https'
    } else {
        return 'http'
    }
}
/**
 * host
 */
const hostOfUrl = (url) => {
    let host = ''
    let u = ''
    if (url.startsWith('https://') || url.startsWith('http://')) {
        u = url.split('://')[1]
    } else {
        u = url
    }
    const index = u.indexOf(':')
    if (index > -1) {
        host = u.slice(0, index)
    } else {
        host = u
        host = host.split('/')[0]
    }
    return host
}


/**
 * port
 */
const portOfUrl = (url) => {
    let protocol = 'http'
    let u = ''
    let port = 80
    if (url.startsWith('https://') || url.startsWith('http://')) {
        u = url.split('://')[1]
        protocol = url.split('://')[0]
    } else {
        u = url
    }
    const portMapper = {
        'http': 80,
        'https': 443,
    }
    const index = u.indexOf(':')
    if (index > -1) {
        u = u.slice(index + 1)
        port = u.split('/')[0]
        port = parseInt(port, 10)
    } else {
        port = portMapper[protocol]
    }
    return port
}

/**
 * path
 */
const pathOfUrl = (url) => {
    let u = ''
    if (url.startsWith('https://') || url.startsWith('http://')) {
        u = url.split('://')[1]
    } else {
        u = url
    }

    let path = '/'
    const index = u.indexOf('/')
    if (index > -1) {
        // 这里需要包含 /
        // 所以直接 index 就可以
        path = u.slice(index)
    }
    return path
}
/*
返回https://movie.douban.com/top250的/250
 */
const pathWithQuery = (path, query) => {
    const keys = Object.keys(query)
    const s = keys.map((k) => {
        const v = query[k]
        return `${k}=${v}`
    }).join('&')
    const result = path + '?' + s
    return result
}

//解析返回的参数

/*
header
 对于
 {
 'Content-Type': 'text/html',
 'Content-Length': 127,
 }
 返回如下 string
 'Content-Type: text/html\r\nContent-Length: 127\r\n'
 */
const headerFromDict = (headers) => {
    let ele = []
    for(key in headers){
        const  val = headers[key]
        const  str = `${key}: ${val}`
        ele.push(str)
    }
    const str1 = `${ele[0]}\r\n${ele[1]}\r\n`
    return str1
}

/*
 返回http或者https的client对象
 */
const socketByProtocol = (protocol) => {
    if(protocol == 'http'){
        const client = new net.Socket()
        return client
    }
    if(protocol == 'https'){
        const client = new tls.TLSSocket()
        return client
    }
}

/*
 /*
 把 response 解析出 code headers body 返回
 状态码 code 是 int
 headers 是 object
 body 是 string
//取得code
 */
const parsedResponse = (r) => {
    const  code = r.split(' ')[1]
    //分隔head,body
    const  array = r.split('\r\n\r\n')
    //取得报文头
    let header = {}
    const headcontent = array[0].split('\r\n')
    for(let i = 1 ; i < headcontent.length ; i++){
        let  c = headcontent[i].split(':')
        let  key = c[0]
        let  val = c[1]
        header[key] = val
    }
    //取的报文
    const body = array[1].trim()
    //
    const content =     {
        code: code,
        headers: header,
        body: body
    }
    return content
}

module.exports = {
    log:log,
    parsedUrl: parsedUrl,
    pathWithQuery:pathWithQuery,
    headerFromDict:headerFromDict,
    socketByProtocol: socketByProtocol,
    parsedResponse:parsedResponse
};
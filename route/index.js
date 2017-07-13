const express = require('express')
const movie = require('../model/movie')
const index = express.Router()
const model = movie
const log = console.log.bind(console)

const sendHtml = function(path, response) {
    const fs = require('fs')
    const options = {
        encoding: 'utf-8'
    }
    path = 'template/' + path
    fs.readFile(path, options, function(err, data){
        //log(`读取的html文件 ${path} 内容是`, data)
        response.send(data)
    })
}

index.get('/' , function (req, res) {
    const path = 'movie_index.html'
    sendHtml(path , res)
})

module.exports = index

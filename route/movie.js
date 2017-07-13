const movie = require('../model/movie')
const express = require('express')
const routeMovie = express.Router()
const model = movie

routeMovie.get('/all' , function (req, res) {
    const ms = model.all()
    res.send(ms)
})

module.exports = routeMovie

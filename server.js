require("babel-register")

var webpack = require('webpack')
var express = require('express')
var app = express()
var webpackDevMiddleware = require('webpack-dev-middleware')
var config = require('./webpack.config')
var React = require('react')
var ReactDOM = require('react-dom/server')
var port = 3000

var Page = require('./src/page').Page

var __PROD__ = process.env.NODE_ENV === 'production'
var __STAGING__ = process.env.NODE_ENV === 'staging'
var __DEV__ = !__PROD__ && !__STAGING__
var __COLS__ = Math.min(process.env.COLS, 128)

var lex = __PROD__ ? require('letsencrypt-express') : require('letsencrypt-express').testing()

if (__DEV__) {
  var compiler = webpack(config)
  app.use(webpackDevMiddleware(compiler, { stats: { colors: true } }))
}
else {
  if (__PROD__) port = 80
  app.use(express.static('dist'))
}

var validCols = [16, 32, 64, 128]

function closest (candidate, arr) {
  var currentClosest = arr[0]
  arr.forEach(function (val) {
    if (Math.abs(candidate - val) < Math.abs(candidate - currentClosest)) currentClosest = val
  })
  return currentClosest
}

app.get('/', function (req, res) {
  var cols = closest(req.query.cols || __COLS__, validCols)
  var rows = cols / 16 * 9
  var brand = true

  if (typeof req.query.brand !== 'undefined') brand = +req.query.brand

  var page = React.createElement(Page, {
    cols: cols,
    rows: rows,
    brand: brand,
  })
  res.status(200).send(ReactDOM.renderToStaticMarkup(page))
})

lex.create({
  configDir: '/etc/letsencrypt',
  onRequest: app,
  approveRegistration: function (host, cb) {
    cb(null, {
      domains: [host],
      email: process.env.EMAIL,
      agreeTos: true
    })
  }
}).listen([port], [443], function (err) {
  if (err) console.log(err)
  else console.log('Live at ' + port)
})

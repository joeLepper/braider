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
var __ROWS__ = Math.min(process.env.ROWS, 72)

if (__DEV__) {
  var compiler = webpack(config)
  app.use(webpackDevMiddleware(compiler, { stats: { colors: true } }))
}
else {
  if (__PROD__) port = 80
  app.use(express.static('dist'))
}

app.get('/', (req, res) => {
  var cols = Math.min(req.query.cols || __COLS__, 128)
  var rows = Math.min(req.query.rows || __ROWS__, 72)

  var page = React.createElement(Page, { cols: cols, rows: rows })
  res.status(200).send(ReactDOM.renderToStaticMarkup(page))
})

app.listen(3000, (err) => {
  if (err) console.log(err)
  else console.log('Live at localhost:3000')
})

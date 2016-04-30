const webpack = require('webpack')
const express = require('express')
const app = express()
const webpackDevMiddleware = require('webpack-dev-middleware')
const config = require('./webpack.config')
const port = 3000
const compiler = webpack(config)

app.use(webpackDevMiddleware(compiler, { stats: { colors: true } }))
app.use(express.static('dist'))

app.listen(4000, (err) => {
  if (err) console.log(err)
  else console.log('Live at ' + port)
})

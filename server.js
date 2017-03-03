const webpack = require('webpack')
const express = require('express')
const app = express()
const webpackDevMiddleware = require('webpack-dev-middleware')
const config = require('./webpack.config')
const port = process.env.PORT || 4000
const compiler = webpack(config)

app.use(webpackDevMiddleware(compiler, { stats: { colors: true } }))
app.use(express.static('dist'))

app.listen(port, (err) => {
  if (err) console.log(err)
  else console.log('Live at ' + port)
})

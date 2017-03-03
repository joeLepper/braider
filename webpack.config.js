const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const __DEV__ = ['production', 'test'].indexOf(process.env.NODE_ENV) === -1

const config = {
  devtool: 'source-map',
  entry: ['./src/index'],
  output: {
    path: __dirname + '/dist',
    filename: 'viz.js'
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
   new webpack.optimize.UglifyJsPlugin(),
    // new CopyWebpackPlugin([{ from: './src/style.css'}])
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        exclude: /node_modules/,
        include: __dirname
      }
    ]
  }
}

module.exports = config

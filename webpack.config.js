var webpack = require('webpack')
var CopyWebpackPlugin = require('copy-webpack-plugin')

var __DEV__ = ['production', 'test'].indexOf(process.env.NODE_ENV) === -1

module.exports = {
  devtool: 'source-map',
  entry: [
    './src/index'
  ],
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      '__DEV__': JSON.stringify(__DEV__),
      'COLUMNS': JSON.stringify(process.env.COLUMNS || 64),
      'ROWS': JSON.stringify(process.env.ROWS || 36),
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new CopyWebpackPlugin([{ from: './src/style.css'}])
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

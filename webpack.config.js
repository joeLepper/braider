const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const __DEV__ = ['production', 'test'].indexOf(process.env.NODE_ENV) === -1

module.exports = {
  devtool: 'source-map',
  entry: ['./src/index'],
  output: {
    path: __dirname + '/dist',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
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

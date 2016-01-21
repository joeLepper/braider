let webpack = require('webpack');
let WebpackDevServer = require('webpack-dev-server');
let config = require('./webpack.config');

new WebpackDevServer(webpack(config), {
  hot: true,
  stats: { colors: true }
}).listen(3000, 'localhost', function (err) {
  if (err) console.log(err);
  console.log('Live at localhost:3000');
});

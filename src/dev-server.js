import webpack from 'webpack';
import webpackDevServer from 'webpack-dev-server';

module.exports = function({ here, there }) {

  var webpackConfig = require(thereTmp('webpack.config.js'));
  // webpackConfig.entry.app.unshift("webpack-dev-server/client?http://localhost:8080/", "webpack/hot/dev-server");

  var compiler = webpack(webpackConfig);
  var server = new webpackDevServer(compiler, {
    hot: true
  });

  server.listen(8080);
};

const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');

process.env.NODE_ENV = 'development';

module.exports = merge(common, {
  entry: {
    main: [path.resolve(__dirname, '../src/index.js')],
  },
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.resolve(__dirname, '../src/assets/'),
    hot: true,
    port: 3000,
    publicPath: '/',
    historyApiFallback: true,
  },
});

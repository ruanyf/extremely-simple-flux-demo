var webpack = require('webpack');
var CommonsChunkPlugin = require("webpack/lib/optimize/CommonsChunkPlugin");

module.exports = {
  entry: './index.jsx',
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders:[
      { test: /\.jsx$/, exclude: /node_modules/, loader: 'jsx-loader' },
      { test: /\.js$/, exclude:/node_modules/, loader: 'babel-loader'},
    ]
  },
  plugins: [
    new CommonsChunkPlugin('init.js')
  ]
};

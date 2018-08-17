const path = require('path')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')

const config = require('../config')

module.exports = {
  entry: './src/index.tsx',
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },

  mode: 'production',

  devtool: 'source-map',

  resolve: {
    extensions: ['.js', '.json', '.ts', '.tsx'],
  },

  module: {
    rules: [
      { test: /\.(png|jpg|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      { test: /\.tsx?$/, loader: 'awesome-typescript-loader' },
    ],
  },

  optimization: {
    minimize: true,
    minimizer: [
      new UglifyJsPlugin({ include: /\.js$/ }),
    ],
  },

  plugins: [
    new CopyPlugin([
      { from: './public/index.html' }
    ]),
    new webpack.DefinePlugin({
      'BACKEND': JSON.stringify(config.backend),
      'ORGANIZATION': JSON.stringify(config.organization),
      'DOMAIN': JSON.stringify(config.domain),
    }),
  ],
}

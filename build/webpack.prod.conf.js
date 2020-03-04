
const utils = require('./utils')
const config = require('./config')
const merge = require('webpack-merge')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const baseWebpackConfig = require('./webpack.base.conf')

module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  output: {
    publicPath : config.publicPathProd
  },
  plugins: [
    new CleanWebpackPlugin([config.buildDirectory], {
      root: utils.resolve('/')
    })
  ],
  optimization: {
    minimize: false
  }
})

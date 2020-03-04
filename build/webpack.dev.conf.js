
const utils = require('./utils')
const config = require('./config')
const merge = require('webpack-merge')
const baseWebpackConfig = require('./webpack.base.conf')

module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  output: {
    publicPath: config.publicPathDev
  },
  optimization: {
    minimize: false
  },
  devServer: {
    contentBase: utils.resolve(config.buildDirectory),
    allowedHosts: [
      "0.0.0.0",
      "localhost"
    ],
    port: config.devPort,
    open: false,
    proxy: {
      '/api': {
        target: `http://0.0.0.0:${config.mockPort}`,
        changeOrigin: true,
        pathRewrite: function (_path, req) {
          //可查看http-proxy-middleware插件中对pathRewrite属性的说明
          //return _path.replace(/\/api\/.*\/([^?]+)(\?.*)?/, '/api/$1.json')
        }
      },
      '/': {
        target: `http://wx.nacks.com:9001`,
        // target: `http://nacksapi.asuncloud.com:9001`,
        changeOrigin: true,
        pathRewrite: {
          '^/': '/'   //重写接口
        },
      },
      // '/system': {
      //   target: `http://wx.nacks.com:9001`,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/system': '/system'   //重写接口
      //   },
      // },
      // '/corpWX': {
      //   target: `http://wx.nacks.com:9001`,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/corpWX': '/corpWX'   //重写接口
      //   },
      // },
      // '/common': {
      //   target: `http://wx.nacks.com:9001`,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/common': '/common'   //重写接口
      //   },
      // },
      // '/device': {
      //   target: `http://wx.nacks.com:9001`,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/device': '/device'   //重写接口
      //   },
      // },
      // '/repairInfo': {
      //   target: `http://wx.nacks.com:9001`,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/repairInfo': '/repairInfo'   //重写接口
      //   },
      // },
      // '/repair': {
      //   target: `http://wx.nacks.com:9001`,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/repair': '/repair'   //重写接口
      //   },
      // },
      // '/workOrder': {
      //   target: `http://wx.nacks.com:9001`,
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/workOrder': '/workOrder'   //重写接口
      //   },
      // },
    }
  }
})


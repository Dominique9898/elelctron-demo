'use strict'

process.env.BABEL_ENV = 'main'

const path = require('path')
const { dependencies } = require('../package.json')
const webpack = require('webpack')

const MinifyPlugin = require("babel-minify-webpack-plugin")
const SentryCliPlugin = require('@sentry/webpack-plugin')
const ZipPlugin = require('webpack-zip-plugin')
let mainConfig = {
  entry: {
    main: path.join(__dirname, '../src/main/index.js')
  },
  externals: [
    ...Object.keys(dependencies || {})
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.node$/,
        use: 'node-loader'
      }
    ]
  },
  node: {
    __dirname: process.env.NODE_ENV !== 'production',
    __filename: process.env.NODE_ENV !== 'production'
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(__dirname, '../dist/electron')
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  resolve: {
    extensions: ['.js', '.json', '.node']
  },
  target: 'electron-main'
}

/**
 * Adjust mainConfig for development settings
 */
if (process.env.NODE_ENV !== 'production') {
  mainConfig.plugins.push(
    new webpack.DefinePlugin({
      '__static': `"${path.join(__dirname, '../static').replace(/\\/g, '\\\\')}"`
    })
  )
}

/**
 * Adjust mainConfig for production settings
 */
if (process.env.NODE_ENV === 'production') {
  mainConfig.devtool = 'hidden-source-map'
  mainConfig.plugins.push(
    new MinifyPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new SentryCliPlugin({
      include: "./dist/electron/", // 作用的文件夹，如果只想js报错就./dist/js
      configFile: ".sentryclirc", // 不用改
      ignore: ['node_modules'],
      release: 'demo-1', //对于sentryWebpackPlugin必须
      // release: process.env.SOURCE_VERSION,
      deleteAfterCompile: true, //每次打包前都会先删除全部该release的所有工作,避免重复文件上传,冗余
      urlPrefix: "app:///dist/electron/",//这里指的你项目需要观测的文件如果你的项目有publicPath这里加上就对了
    }),
  )
}

module.exports = mainConfig

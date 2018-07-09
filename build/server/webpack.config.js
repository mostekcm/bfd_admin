const _ = require('lodash');
const path = require('path');
const Webpack = require('webpack');
const project = require('../../package.json');

module.exports = {
  entry: path.join(__dirname, '../../index'),
  target: 'node',
  output: {
    path: path.resolve(__dirname, '../../dist'),
    filename: 'bfd_admin.server.' + project.version + '.js',
    library: 'commonjs2'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: path.join(__dirname, '../../node_modules/')
      },
      { test: /\.json$/, loader: 'json-loader' }
    ]
  },
  plugins: [
    new Webpack.IgnorePlugin(/cls-bluebird/, /request-promise/),
    // new Webpack.optimize.UglifyJsPlugin({
    //   minimize: true,
    //   output: {
    //     comments: false
    //   },
    //   compress: {
    //     warnings: false
    //   }
    // }),
    new Webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        CLIENT_VERSION: JSON.stringify(project.version)
      }
    })
  ],
  resolve: {
    modules: [
      __dirname,
      'node_modules',
      path.join(__dirname, '../../node_modules/')
    ],
    alias: {}
  },
  node: {
    __dirname: true
  }
};

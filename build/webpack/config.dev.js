'use strict';

const webpack = require('webpack');
const logger = require('../../server/lib/logger');
logger.info('Running development configuration...');

const WEBPACK_HOST = 'bfd-admin.appliance-trial.com';
const WEBPACK_PORT = 443;

// Override base configuration.
let config = require('./config.base.js');
config.devtool = 'source-map';
//config.debug = true;
config.entry = [
  'webpack-dev-server/client?http://' + WEBPACK_HOST + ':' + WEBPACK_PORT,
  'webpack/hot/only-dev-server',
  config.entry.app
];
config.output.publicPath = 'https://bfd-admin.appliance-trial.com' + config.output.publicPath;

// Stats configuration.
config.stats = {
  colors: true,
  reasons: true
};

// Development modules.
config.module.loaders.push({
  test: /\.css$/,
  loader: 'style-loader!css-loader!postcss-loader'
});

// Webpack plugins.
config.plugins = config.plugins.concat([
  new webpack.HotModuleReplacementPlugin()
]);

module.exports = config;

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  devtool: 'source-map',
  resolve: {
    alias: {
      React: 'react'
    },
    extensions: [ '.json', '.js', '.jsx' ]
  },
  module: {
    rules: [
      {
        test: /\.js|\.jsx$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      },
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    })
  ]
};

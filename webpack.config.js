const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
// const ChromeExtensionReloader = require('webpack-chrome-extension-reloader');
const CopyWebpackPlugin = require('copy-webpack-plugin');


const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
  devtool: 'source-map',
  mode: isDevelopment ? 'development' : 'production',
  entry: {
    popup: path.join(__dirname, 'src', 'popup', 'popup.js'),
    background: path.join(__dirname, 'src', 'background', 'background.js'),
    content: path.join(__dirname, 'src', 'content', 'content.js'),
    overlayPopup: path.join(__dirname, 'src', 'content', 'overlayPopup','overlayPopup.js')
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src/popup', 'popup.html'),
      filename: 'popup.html',
      chunks: ['popup']
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'icons', to: 'icons' },
        { from: 'manifest.json', to: 'manifest.json' }
      ]
    }),
    new VueLoaderPlugin(),
    // isDevelopment ? new ChromeExtensionReloader(
    //   {
    //     entries: {
    //       contentScript: 'content',
    //       background: 'background',
    //       extensionPage: 'popup'
    //     }
    //   }
    // ) : null
  ].filter(Boolean)
};

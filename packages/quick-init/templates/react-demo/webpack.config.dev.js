/**
 * @PengJiyuan
 */
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');

module.exports = {

  context: __dirname,

  entry: './src/index.js',

  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].min.js',
    publicPath: 'public/'
  },

  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          cacheDirectory: process.env.NODE_ENV !== 'production'
        }
      }
    }, {
      test: /\.less$/,
      use: ExtractTextPlugin.extract({
        use: [{
          loader: 'css-loader'
        }, {
          loader: 'postcss-loader',
          options: {
            plugins: function() {
              return [autoprefixer];
            }
          }
        }, {
          loader: `less-loader?{"sourceMap":true}`
        }]
      })
    }, {
      test: /\.(woff|svg|eot|ttf|otf)\??.*$/,
      use: [{
        loader: 'file-loader',
        options: {
          name: '[name].[hash:8].[ext]'
        }
      }]
    }]
  },

  // only show valid/invalid and errors
  // deal with verbose output
  stats: {
    assets: true,
    colors: true,
    warnings: true,
    errors: true,
    errorDetails: true,
    entrypoints: true,
    version: true,
    hash: false,
    timings: true,
    chunks: false,
    chunkModules: false,
    children: false
  },

  plugins: [
    new ExtractTextPlugin({
      filename: '[name].min.css',
      allChunks: true
    })
  ],

  resolve: {
    extensions: ['.jsx', '.js', 'json'],
    modules: [
      path.resolve(__dirname),
      'node_modules'
    ],
    alias: {
      'react': 'node_modules/react',
      'react-dom': 'node_modules/react-dom'
    }
  },

  devServer: {
    contentBase: path.join(__dirname, 'public'),
    compress: true,
    port: 8888,
    inline: true
  }
};

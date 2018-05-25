/**
 * @PengJiyuan
 */
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const os = require('os');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {

  context: __dirname,

  entry: './src/index.js',

  output: {
    path: './dist',
    filename: '[name].min.js',
    publicPath: '/dist'
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
          loader: 'postcss-loader',
          options: {
            plugins: function() {
              return [autoprefixer];
            }
          }
        }, {
          loader: 'less-loader'
        }]
      })
    }, {
      test: /\.(woff|svg|eot|ttf|otf)\??.*$/,
      use: [
        'file-loader?limit=1000&name=/fonts/[hash:8].icon.[ext]'
      ]
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
      filename: '[hash:6].[name].min.css',
      allChunks: true
    }),
    new UglifyJSPlugin({
      parallel: os.cpus().length
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    })
  ],

  resolve: {
    extensions: ['.jsx', '.js', 'json'],
    modules: [
      path.resolve(__dirname, '../'),
      'node_modules'
    ],
    alias: {
      'react': 'node_modules/react',
      'react-dom': 'node_modules/react-dom'
    }
  },

  devServer: {
    contentBase: path.join(__dirname),
    compress: true,
    port: 9000
  }
};

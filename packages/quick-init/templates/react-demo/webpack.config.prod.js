const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const autoprefixer = require('autoprefixer');

module.exports = {

  context: __dirname,

  mode: 'production',

  entry: './src/index.js',

  output: {
    path: path.resolve(__dirname, 'dist/'),
    filename: '[hash:6].[name].min.js'
  },

  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader'
      }
    }, {
      test: /\.less|css$/,
      use: [
        MiniCssExtractPlugin.loader,
        'css-loader',
        'less-loader',
        {
          loader: 'postcss-loader',
          options: {
            plugins: function() {
              return [autoprefixer];
            }
          }
        }
      ]
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

  optimization: {
    minimize: true
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: "[hash:6].[name].min.css",
      chunkFilename: "[id].css"
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public/index.html')
    }),
    new CopyWebpackPlugin([
      {
        context: path.resolve(__dirname, 'public'),
        from: '**/*',
        to: '.'
      }
    ], {
      ignore: ['public/index.html']
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
  }
};

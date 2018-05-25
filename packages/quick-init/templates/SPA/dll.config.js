/**
 * @PengJiyuan
 */
const path = require('path');
const webpack = require('webpack');

module.exports = (env) => {
  let config = {

    resolve: {
      extensions: ['.js', '.jsx']
    },

    entry: {
      ustack: [
        'react',
        'react-dom'
      ]
    },

    output: {
      path: path.join(__dirname, 'public/dist'),
      filename: '[hash:6].[name].dll.js',
      library: '[name]_[hash]'
    },

    plugins: [
      new webpack.DllPlugin({
        path: path.join(__dirname, 'manifest.json'),
        name: '[name]_[hash]'
      }),
      new webpack.optimize.UglifyJsPlugin({
        mangle: {
          except: ['[name]_[hash]', 'exports', 'require']
        },
        compress: {
          warnings: false
        }
      }),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify('production')
        }
      })
    ]

  };

  if(env && env.development) {
    config.output.filename = '[name].dll.js';
    config.plugins.pop();
    config.plugins.pop();
  }

  return config;
};

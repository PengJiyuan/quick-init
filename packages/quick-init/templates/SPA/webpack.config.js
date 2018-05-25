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
const lessToJs = require('less-var-parse');
const manifestJson = require('./manifest.json');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

let language = process.env.npm_config_lang || process.env.language;

// show webpack bundle analyze
const showMeMore = process.env.npm_config_showmemore;

// Default language
if (!language) {
  language = 'zh-CN';
}

let entry = {};
fs.readdirSync('./applications')
  .filter(function(m) {
    return fs.statSync(path.join('./applications', m)).isDirectory();
  })
  .forEach(function(m) {
    entry[m] = ['babel-polyfill', './applications/' + m + '/index.jsx'];
  });

module.exports = (env) => {
  // production mode
  let themer = lessToJs(fs.readFileSync(path.join(__dirname, './theme/index.less'), 'utf8'));

  let webpackConfig = {

    context: __dirname,

    entry: entry,

    output: {
      path: path.resolve(__dirname, './public/dist'),
      filename: '[hash:6].' + language + '.[name].min.js',
      publicPath: '/public/dist',
      chunkFilename: '[hash:6].' + language + '.[id].bundle.js'
    },

    module: {
      rules: [{
        test: /\.jsx?$/,
        exclude: /node_modules|moment|ufec/,
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
            loader: 'css-loader',
          }, {
            loader: 'postcss-loader',
            options: {
              plugins: function() {
                return [autoprefixer];
              }
            }
          }, {
            loader: `less-loader?{"sourceMap":true,"modifyVars":${JSON.stringify(themer)}}`
          }]
        })
      }, {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          use: [{
            loader: 'css-loader',
          }, {
            loader: 'postcss-loader',
            options: {
              plugins: function() {
                return [autoprefixer];
              }
            }
          }]
        })
      }, {
        test: /\.(woff|svg|eot|ttf|otf)\??.*$/,
        use: [
          'file-loader?limit=1000&name=/fonts/[hash:8].icon.[ext]'
        ]
      }],
      noParse: [
        /moment/g
      ]
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
      }),
      new webpack.DllReferencePlugin({
        context: path.join(__dirname, '..'),
        manifest: manifestJson
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
        'react-dom': 'node_modules/react-dom',
        'moment': 'client/libs/moment',
        '~antd': 'node_modules/antd',
        '~ufec': 'node_modules/ufec'
      }
    },

    devServer: {
      contentBase: path.join(__dirname),
      compress: true,
      port: 9000
    }
  };

  if(env && env.development) {
    webpackConfig.watch = true;
    webpackConfig.devtool = 'cheap-source-map';
    webpackConfig.output.path = path.resolve(__dirname, 'public/dist');
    webpackConfig.output.filename = '[name].min.js';
    webpackConfig.plugins = [
      new ExtractTextPlugin({filename: '[name].min.css'}),
      new webpack.LoaderOptionsPlugin({
        debug: true
      }),
      new webpack.DllReferencePlugin({
        context: path.join(__dirname, '..'),
        manifest: manifestJson
      })
    ];
    if(showMeMore) {
      webpackConfig.plugins.push(new BundleAnalyzerPlugin());
    }
  }
  return webpackConfig;
};

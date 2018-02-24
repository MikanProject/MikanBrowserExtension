const webpack = require('webpack');
const path = require('path');
const buildPath = path.resolve(__dirname, 'dist/firefox');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const config = {
  entry: [path.join(__dirname, '/src/index.jsx')],
  resolve: {
    //When require, do not have to add these extensions to file's name
    extensions: ["", ".js", ".jsx"],
    //node_modules: ["web_modules", "node_modules"]  (Default Settings)
  },
  //output config
  output: {
    path: buildPath,    //Path of output file
    filename: 'index.js',  //Name of output file
  },
  plugins: [
    new CleanWebpackPlugin(buildPath),
    new CopyWebpackPlugin([
      { from: 'manifest-firefox.json', to: 'manifest.json' },
      { from: 'node_modules/jquery/dist/jquery.min.js', to: 'lib/jquery/jquery.js' },
      { from: 'node_modules/moment/min/moment-with-locales.min.js', to: 'lib/moment/moment.js' },
      { from: 'node_modules/clipboard/dist/clipboard.min.js', to: 'lib/clipboard/clipboard.js' },
      { context: 'src/', from: '**/*', to: './', ignore: [ '*.jsx', 'edgelib/*' ] }
    ]),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
      },
    }),
  ],
  module: {
    loaders: [
      {
        test: /(\.js$)|(\.jsx$)/,  //All .js files
        loaders: ['babel-loader'],
        exclude: [nodeModulesPath],
      },
    ],
  },
  //Eslint config
  eslint: {
    configFile: '.eslintrc', //Rules for eslint
  },
};

module.exports = config;

const webpack = require('webpack');
const path = require('path');
const buildPath = path.resolve(__dirname, 'dist/chrome');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const config = {
  //Entry points to the project
  entry: [
    path.join(__dirname, '/src/index.jsx'),
  ],
  //Config options on how to interpret requires imports
  resolve: {
    extensions: [".js", ".jsx"],
    //node_modules: ["web_modules", "node_modules"]  (Default Settings)
  },
  output: {
    path: buildPath,    //Path of output file
    filename: 'index.js',
  },
  plugins: [
    new CleanWebpackPlugin(buildPath),
    new CopyWebpackPlugin([
      { from: 'manifest-chrome.json', to: 'manifest.json' },
      { from: 'node_modules/jquery/dist/jquery.js', to: 'lib/jquery/jquery.js' },
      { from: 'node_modules/moment/min/moment-with-locales.js', to: 'lib/moment/moment.js' },
      { from: 'node_modules/clipboard/dist/clipboard.js', to: 'lib/clipboard/clipboard.js' },
      { context: 'src/', from: '**/*', to: './', ignore: [ '*.jsx', 'edgelib/*' ] }
    ]),
    //Allows error warnings but does not stop compiling. Will remove when eslint is added
    new webpack.NoErrorsPlugin(),
  ],
  module: {
    loaders: [
      {
        //React-hot loader and
        test: /(\.js$)|(\.jsx$)/,  //All .js files
        loaders: ['babel-loader'], 
        exclude: [nodeModulesPath],
      },
    ],
  },
};

module.exports = config;
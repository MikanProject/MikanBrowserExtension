const webpack = require('webpack');
const path = require('path');
const buildPath = path.resolve(__dirname, 'dist/src');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');

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
    filename: '_index.js',  //Name of output file
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production'),
      },
    }),
    //Minify the bundle
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        //supresses warnings, usually from module minification
        warnings: false,
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

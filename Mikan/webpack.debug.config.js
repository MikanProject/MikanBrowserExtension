const webpack = require('webpack');
const path = require('path');
const buildPath = path.resolve(__dirname, 'src');
const nodeModulesPath = path.resolve(__dirname, 'node_modules');

const config = {
  //Entry points to the project
  entry: [
    path.join(__dirname, '/src/index.jsx'),
  ],
  //Config options on how to interpret requires imports
  resolve: {
    extensions: ["", ".js", ".jsx"],
    //node_modules: ["web_modules", "node_modules"]  (Default Settings)
  },
  devtool: 'eval',
  output: {
    path: buildPath,    //Path of output file
    filename: '_index.js',
  },
  plugins: [
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
  //eslint config options. Part of the eslint-loader package
  eslint: {
    configFile: '.eslintrc',
  },
};

module.exports = config;
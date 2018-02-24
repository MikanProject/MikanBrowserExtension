const webpack = require('webpack');
const path = require('path');
const buildPath = path.resolve(__dirname, 'dist/edge');
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
      { from: 'manifest-edge.json', to: 'manifest.json' },
      { from: 'node_modules/jquery/dist/jquery.min.js', to: 'lib/jquery/jquery.js' },
      { from: 'node_modules/moment/min/moment-with-locales.min.js', to: 'lib/moment/moment.js' },
      { context: 'src/', from: '**/*', to: './', ignore: [ '*.jsx' ] }
    ]),
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

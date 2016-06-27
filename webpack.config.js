var precss       = require('precss');
var autoprefixer = require('autoprefixer');

module.exports = {

  entry: {
    'rakr': './src/lib/rakr.ts'
  },

  resolve: {
    extensions: ['', '.ts', '.js'],
    modulesDirectories: ['node_modules']
  },

  devtool: 'source-map',

  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript-loader?tsconfig=src/tsconfig.json'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader!postcss-loader'
      }
    ]
  },
  postcss: function () {
    return [precss, autoprefixer];
  },
  output: {
    path: 'dist',
    filename: '[name].js'
  },
  node: {
    net: 'empty'
  }
};

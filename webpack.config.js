var webpack = require('webpack');

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
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.css$/,
        loader: 'style!css!autoprefixer'
      }
    ]
  },
  output: {
    path: 'dist',
    filename: '[name].js'
  }
};

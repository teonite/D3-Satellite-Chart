import webpack from 'webpack'
import path from 'path'

export default {
  entry: './src/satchart.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'satchart.js',
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          presets: ['stage-0', 'es2015']
        }
      }
    ]
  },
  plugins: []
};

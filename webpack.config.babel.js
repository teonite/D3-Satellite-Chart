import webpack from 'webpack'
import path from 'path'


const dir_src = path.join(__dirname, 'src')
const dir_dist = path.join(__dirname, 'dist')

export default {
  entry: path.join(dir_src, 'satchart.js'),
  output: {
    path: dir_dist,
    filename: 'satchart.js',
    library: 'satchart',
    libraryTarget: 'var'
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

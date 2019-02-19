const path = require('path');

module.exports = {
  mode: 'development',
  context: path.resolve('.'),
  entry: './.tmp/index.tsx',
  devServer: {
    contentBase: path.resolve(__dirname, '../demo'),
    port: 1234,
    hot: true
  },
  module: {
    rules: [
      {
        test: /\.tsx$/,
        use: ['ts-loader', 'import-glob-loader']
      },
    ]
  },
  resolveLoader: {
    alias: {
      "glob-loader": path.join(__dirname, "./glob-loader.js")
    }
  },
  resolve: {
    extensions: [  '.demo.tsx', '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve('./demo')
  }
};

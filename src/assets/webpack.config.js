const path = require('path');

const rootDir = require(path.resolve('./tsconfig.json')).compilerOptions.rootDir;

module.exports = {
  mode: 'development',
  context: path.resolve('.', rootDir),
  entry: './.tmp/index.tsx',
  devServer: {
    contentBase: path.resolve('demo'),
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

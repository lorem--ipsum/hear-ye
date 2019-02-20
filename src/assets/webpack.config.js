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
        test: /\.tsx?$/,
        use: ['ts-loader', 'import-glob-loader']
      },
      {
        test: /\.s?css$/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader'},
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                require('postcss-preset-env')({
                  browsers: ['> 1%', 'last 3 versions', 'Firefox ESR', 'Opera 12.1']
                })
              ]
            }
          },
          {loader: 'sass-loader'}
        ]
      }
    ]
  },
  resolve: {
    extensions: [  '.demo.tsx', '.tsx', '.ts', '.js', '.scss', '.css' ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve('./demo')
  }
};

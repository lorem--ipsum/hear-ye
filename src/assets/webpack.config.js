const path = require('path');
const rootDir = require(path.resolve('./tsconfig.json')).compilerOptions.rootDir;

const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  mode: 'development',
  context: path.resolve('.', rootDir),
  entry: './.tmp/index.tsx',

  devServer: {
    contentBase: path.resolve('demo'),
    port: 1234,
    hot: true,
    publicPath: '/',
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: 'ts-loader',
            options: {onlyCompileBundledFiles: true}
          },
          {loader: 'import-glob-loader'}
        ]
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
    extensions: [ '.tsx', '.ts', '.js', '.scss', '.css', '.demo.tsx' ],
    plugins: [new TsconfigPathsPlugin({/* options: see below */})]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve('./demo')
  }
};

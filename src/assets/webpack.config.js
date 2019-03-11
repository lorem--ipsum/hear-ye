const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const MuskadPlugin = require('muskad/dist/webpack-plugin/muskad');

const rootDir = require(path.resolve('./tsconfig.json')).compilerOptions.rootDir;

const src = path.resolve('.', rootDir);

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  context: src,
  devtool: 'eval-cheap-module-source-map',
  entry: './.tmp/index.tsx',
  devServer: {
    contentBase: path.resolve('demo'),
    port: 1234,
    hot: true,
    publicPath: '/',
    historyApiFallback: true
  },

  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        },
        project: {
          test: (module, chunk) => {
            if (module.resource && module.resource.includes('/src/.tmp/index.tsx')) return false;
            if (/\/node_modules\//.test(module.resource)) return false;
            return /\/src(\/[^.]+)+(\.demo\.tsx)$/.test(module.resource) === false;
          },
          name: 'project',
          chunks: 'all'
        }
      }
    }
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: src,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              compilerOptions: {
                declaration: false
              }
            }
          }
        ]
      },
      {
        test: /\.scss$/,
        include: src,
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
      },
      {
        test: /\.css$/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader'}
        ]
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js', '.scss', '.css', '.demo.tsx' ],
    plugins: [new TsconfigPathsPlugin({})],
    symlinks: false,
    cacheWithContext: false
  },
  output: {
    filename: '[name].js',
    path: path.resolve('./demo'),
    publicPath: '/',
    pathinfo: false
  },
  plugins: [
    new MuskadPlugin({
      context: path.resolve('src')
    }),
    new HtmlWebpackPlugin({
      template: '.tmp/index.html'
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  ]
};

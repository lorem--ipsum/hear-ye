const process = require('process');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  target: 'node',
  mode: process.env.NODE_ENV || 'development',
  entry: {
    'hear-ye': './src/hear-ye.ts',
    'hear-ye-ui-api': './src/ui/hear-ye-ui-api.ts'
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['ts-loader'],
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
    extensions: [ '.tsx', '.ts', '.js', '.scss' ]
  },

  output: {
    path: __dirname + '/dist',
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'umd',
    umdNamedDefine: true
  },

  externals: {
    "@implydata/little-pictures": "@implydata/little-pictures",
    "@implydata/beltful": "@implydata/beltful",
    "react": "react",
    "react-dom": "react-dom"
  },

  plugins: [
    new CopyPlugin([
      { from: 'src/assets', to: 'assets' }
    ])
  ]
};

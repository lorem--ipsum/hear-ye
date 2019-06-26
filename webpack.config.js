const process = require("process");
const CopyPlugin = require("copy-webpack-plugin");
const nodeExternals = require("webpack-node-externals");

module.exports = [
  {
    target: "node",
    mode: process.env.NODE_ENV || "development",
    entry: {
      "hear-ye": "./src/hear-ye.ts"
    },
    module: {
      rules: [{ test: /\.ts$/, use: ["ts-loader"] }]
    },
    resolve: {
      extensions: [".ts", ".js"]
    },

    output: {
      path: __dirname + "/dist",
      filename: "[name].js",
      library: "[name]",
      libraryTarget: "umd",
      umdNamedDefine: true
    },

    plugins: [new CopyPlugin([{ from: "src/assets", to: "assets" }])],

    node: {
      __dirname: false
    },

    externals: [nodeExternals()]
  },

  {
    target: "web",
    mode: process.env.NODE_ENV || "development",
    entry: {
      "hear-ye-ui-api": "./src/ui/hear-ye-ui-api.ts"
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: ["ts-loader"]
        },
        {
          test: /\.s?css$/,
          use: [
            { loader: "style-loader" },
            { loader: "css-loader" },
            {
              loader: "postcss-loader",
              options: {
                ident: "postcss",
                plugins: () => [require("postcss-preset-env")({})]
              }
            },
            { loader: "sass-loader" }
          ]
        }
      ]
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".scss"]
    },

    output: {
      path: __dirname + "/dist",
      filename: "[name].js",
      library: "[name]",
      libraryTarget: "umd",
      umdNamedDefine: true
    },

    externals: {
      react: "react",
      "react-dom": "react-dom"
    }
  }
];

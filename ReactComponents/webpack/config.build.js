const path = require("path");
const getAbsPath = (dirOrFile) => path.resolve(process.cwd(), dirOrFile);
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  target: "web",
  devtool: "eval-source-map",
  mode: "development",
  entry: {
    main: getAbsPath("src/index.tsx"),
  },
  output: {
    publicPath: "/",
    path: getAbsPath("dist"),
    filename: "main.js",
  },
  module: {
    rules: [
      // typescript
      {
        test: /\.(ts|tsx|js|jsx)$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },

      // scsss
      {
        test: /\.s?[ac]ss$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
              importLoaders: 2,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
              additionalData: `
                @import "./src/styles/variables/_variables.scss";
                @import "./src/styles/mixins/_mixins.scss";
          `,
            },
          },
        ],
      },

      // asset
      {
        test: /\.(gif|jpe?g|png|webp|svg)$/i,
        type: "asset",
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "public/index.html",
      favicon: "src/assets/images/sellyLogo.svg",
    }),

    // react를 import하지 않아도 된다.
    new webpack.ProvidePlugin({
      React: "react",
    }),
    new Dotenv(),
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
    new MiniCssExtractPlugin(),
  ],
  resolve: {
    // 절대 경로 설정
    alias: {
      "@": path.resolve(__dirname, "../src/"),
    },
    extensions: [".js", ".ts", ".jsx", ".tsx", ".css", ".scss", ".json"],
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
  },
};

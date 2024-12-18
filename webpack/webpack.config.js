const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: "production",
  entry: {
    background: path.resolve(__dirname, "..", "src", "background.ts"),
    contentScript: path.resolve(__dirname, "..", "src", "contentScript.ts"),
    side_extension: path.resolve(__dirname, "..", "src", "side_extension.ts"),
    contentScriptStyles: path.resolve(__dirname, "..", "styles/contentScript.css"),
    iframeStyles: path.resolve(__dirname, "..", "styles/iframe.css"),
  },
  output: {
    path: path.join(__dirname, "../dist"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|svg)$/i,
        type: "asset/resource",
        generator: {
          filename: "images/[name][ext]",
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      // Generates separate CSS files for each entry point
      filename: ({ chunk }) => {
        if (chunk.name === "contentScriptStyles") return "contentScript.css";
        if (chunk.name === "iframeStyles") return "iframe.css";
        return "[name].css";
      },
    }),
    new CopyPlugin({
      patterns: [
        { from: ".", to: ".", context: "public" },
        { from: "src/side_extension.html", to: "side_extension.html" },
        { from: "src/shortcutComponent.html", to: "shortcutComponent.html" },
        { from: "images", to: "images" },
      ],
    }),
  ],
};
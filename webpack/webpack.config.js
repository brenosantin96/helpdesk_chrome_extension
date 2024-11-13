const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: "production",
  entry: {
    background: path.resolve(__dirname, "..", "src", "background.ts"),
    contentScript: path.resolve(__dirname, "..", "src", "contentScript.ts"),  // adding contentScript.ts
  },
  output: {
    path: path.join(__dirname, "../dist"),
    filename: "[name].js",  // Generates a file for each input (background.js, contentScript.js
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
        test: /\.css$/,  // rule to process .css files
        use: [MiniCssExtractPlugin.loader, "css-loader"],  // Extracts the CSS to a separate file
      },
      {
        test: /\.(png|svg)$/i,  // Rule for processing image files (PNG and SVG)
        type: 'asset/resource',  // Uses Webpack's native assets feature
        generator: {
          filename: 'images/[name][ext]',  // generate images in dist/images folder
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.css',  // Name of the generated CSS file
    }),
    new CopyPlugin({
      patterns: [
        { from: ".", to: ".", context: "public" },  // Copy the contents of the public folder to dist
        { from: "src/side_extension.html", to: "side_extension.html" },  // Copy the HTML to dist
        { from: "src/shortcutComponent.html", to: "shortcutComponent.html" },  // Copy the HTML to dist
        { from: "images", to: "images" },  // Copy the images folder to dist/images
      ],
    }),
  ],
};

const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: "production",
  entry: {
    background: path.resolve(__dirname, "..", "src", "background.ts"),
    contentScript: path.resolve(__dirname, "..", "src", "contentScript.ts"),  // Adiciona o contentScript.ts
  },
  output: {
    path: path.join(__dirname, "../dist"),
    filename: "[name].js",  // Gera um arquivo para cada entrada (background.js, contentScript.js)
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
        test: /\.css$/,  // Regra para processar arquivos .css
        use: [MiniCssExtractPlugin.loader, "css-loader"],  // Extrai o CSS para um arquivo separado
      },
      {
        test: /\.(png|svg)$/i,  // Regra para processar arquivos de imagem (PNG e SVG)
        type: 'asset/resource',  // Usa a feature de assets nativos do Webpack
        generator: {
          filename: 'images/[name][ext]',  // Gera as imagens na pasta dist/images
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.css',  // Nome do arquivo CSS gerado
    }),
    new CopyPlugin({
      patterns: [
        { from: ".", to: ".", context: "public" },  // Copia o conteúdo da pasta public para dist
        { from: "src/side_extension.html", to: "side_extension.html" },  // Copia o HTML para dist
        { from: "images", to: "images" },  // Copia a pasta de imagens para dist/images
      ],
    }),
  ],
};

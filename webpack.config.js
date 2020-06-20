// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
const pathToPhaser = path.join(__dirname, "/node_modules/phaser/");
const phaser = path.join(pathToPhaser, "dist/phaser.js");

module.exports = {

  //エントリポイント
  entry: "./src/index.ts",      
  output: {
    // 出力先 "/dist/bundle.js"
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      // ts-loaderで読み込むファイル
      { test: /\.ts$/, loader: "ts-loader", exclude: "/node_modules/" },
      // Phaserというグローバル変数に格納するファイル("phaser*.js")      
      { test: /phaser\.js$/, loader: "expose-loader?Phaser" }
    ]
  },

  // 開発用サーバ設定
  devServer: {
    contentBase: path.resolve(__dirname, "./"),
    publicPath: "/dist/",
    host: "127.0.0.1",
    port: 8080,
    open: true
  },

  resolve: {
    // バンドル対象にするファイル
    extensions: [".ts", ".js"],
    // import "phaser"の読み込み先
    alias: {
      phaser: phaser
    }
  }
};
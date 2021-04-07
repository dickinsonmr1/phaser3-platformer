var path = require('path');
var pathToPhaser = path.join(__dirname, '/node_modules/phaser/');
var phaser = path.join(pathToPhaser, 'dist/phaser.js');

/*
var serverConfig = Object.assign({}, config, {
  name: "a",
  entry: "./a/app",
  output: {
     path: "./a",
     filename: "bundle.js"
  },
});

var clientConfig = Object.assign({}, config, {
  name: "a",
  entry: "./a/app",
  output: {
     path: "./a",
     filename: "bundle.js"
  },
});
*/

module.exports = {
  //entry: './src/boilerplate/game.ts',
  entry: './src/client/game.ts',
  output: {
    path: path.resolve(__dirname, 'dist/client'),
    publicPath: "/dist/client/",
    filename: 'bundle.js',
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: 'ts-loader', exclude: /node_modules/ },
      { test: /phaser\.js$/, loader: 'expose-loader?Phaser' }
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, './'),
    publicPath: '/dist/client',
    host: '127.0.0.1',
    hot: true,
    port: 8080,
    open: true
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      phaser: phaser
    }
  }
};

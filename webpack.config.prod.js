const webpack = require('webpack');

const reactExternal = {
  root: 'React',
  commonjs2: 'react',
  commonjs: 'react',
  amd: 'react',
};

const config = {
  mode: 'production',
  externals: {
    react: reactExternal,
  },
  module: {
    rules: [{test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/}],
  },
  output: {
    library: 'VindiciaPmt',
    libraryTarget: 'umd',
  },
};

module.exports = (env) => {
  if (env && env.noMinimize) {
    config.optimization = {
      minimize: false,
    };
  }

  return config;
};

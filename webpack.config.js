module.exports = {
  module: {
    rules: [
      {
        test: /\.js/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.css$/i,
        loader: 'style-loader!css-loader',
      },
    ]
  }
};
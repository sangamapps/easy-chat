const webpack = require('webpack');
const path = require('path');

module.exports = {
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, './assets/js/'),
        publicPath: '/assets/js/',
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                query: {
                    presets: ['es2015', 'react'],
                    plugins: [
                        "syntax-dynamic-import",
                        "transform-class-properties",
                    ]
                }
            },
            {
                test: /\.(s)?css$/i,
                loader: 'style-loader!css-loader!sass-loader',
            },
        ]
    },
    resolve: {
        alias: {
            Containers: path.resolve(__dirname, 'src/Containers/'),
            Model: path.resolve(__dirname, 'src/Model/'),
            Utils: path.resolve(__dirname, 'src/Utils/'),
            AppRedux: path.resolve(__dirname, 'src/AppRedux/'),
            styles: path.resolve(__dirname, 'assets/styles/'),
            images: path.resolve(__dirname, 'assets/images/'),
        }
    },
    plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            _: 'lodash',
            moment: 'moment',
            AppConfig: path.resolve(__dirname, 'src/Config/index.js'),
            GameConfig: path.resolve(__dirname, 'src/Config/Game.js'),
        })
    ],
};
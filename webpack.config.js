const webpack = require('webpack');
const { merge } = require('webpack-merge');
const path = require('path');

const commonConfig = {
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, './assets/js/'),
        publicPath: '/assets/js/',
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', "@babel/preset-react"],
                        plugins: ["@babel/plugin-transform-runtime"]
                    }
                }
            },
            {
                test: /\.(s)?css$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ],
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

const developmentConfig = {
    devtool: "source-map",
    watch: true,
    watchOptions: {
        aggregateTimeout: 200,
        poll: 1000,
        ignored: ['**/node_modules/', '**/assests']
    }
}

const productionConfig = {
}

module.exports = (env, args) => {
    switch (args.mode) {
        case 'development':
            return merge(commonConfig, developmentConfig);
        case 'production':
            return merge(commonConfig, productionConfig);
        default:
            throw new Error('No matching configuration was found!');
    }
}
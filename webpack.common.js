const path = require('path');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    entry: './src/tooltip.js',
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'tooltip.css'
        }),
        new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false
        })
    ],
    module: {
        rules: [
            {
                test: /\.svg$/,
                loader: 'svg-inline-loader'

            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 25000,
                        },
                    },
                ]
            }
        ]
    },
    output: {
        filename: "aristotletooltip.min.js",
        library: "aristotleTooltip",
        libraryTarget: "umd",
        path: path.resolve(__dirname, "dist"),

    },
};
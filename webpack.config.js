const path = require('path');

module.exports = {

    // Path to the entrypoint
    entry : './tooltip.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "bundle.js"

    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ]
            },
            {
                test: /\.(png|jpg|gif)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 25000,
                            mimetype: 'image/png',
                        },
                    },
                ]
            }
        ]
    },
    mode: 'development'
};
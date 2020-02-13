const path = require('path');

module.exports = {

    // Path to the entrypoint
    entry : './index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "bundle.js"

    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            }
        ]
    },
    mode: 'development'
};
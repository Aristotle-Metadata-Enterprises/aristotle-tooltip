const merge = require('webpack-merge');
const common = require('./webpack.common');
const EsmWebpackPlugin = require("@purtuga/esm-webpack-plugin");


 module.exports = merge(common, {
   mode: 'production',
   output: {
       libraryTarget: 'var',
       filename: 'aristotletooltip.js'
   },
     plugins: [
         new EsmWebpackPlugin()
     ]
 });
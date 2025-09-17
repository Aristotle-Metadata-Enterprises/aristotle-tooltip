// Karma configuration
const webpack = require('webpack');

process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function (config) {
    config.set({
        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['mocha'],
        browsers: ['ChromeHeadless'],
        customLaunchers: {
            ChromeHeadless: {
                base: 'ChromeHeadless',
                flags: ['--no-sandbox', '--disable-web-security'],
            },
        },
        reporters: ['mocha'],
        mochaReporter: {
            colors: {
                success: 'green',
                info: 'blue',
                warning: 'yellow',
                error: 'red',
            }
        },
        // list of files / patterns to load in the browser
        files: [
            {pattern: 'test/*_test.js', watched: false},
            {pattern: 'test/**/*_test.js', watched: false},
        ],
        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'test/*_test.js': ['webpack'],
            'test/**/*_test.js': ['webpack'],
        },

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false,

        // Concurrency level
        // how many browser should be started simultaneous
        concurrency: Infinity,
        autoWatch: true,

        webpack: {
            mode: 'development'
        },
        webpackMiddleware: {
            stats: 'errors-only'
        }
    })
}
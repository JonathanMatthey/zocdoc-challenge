'use strict';
var path = require('path');

var webpack = require('webpack');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var Clean = require('clean-webpack-plugin');
var merge = require('webpack-merge');

var pkg = require('./package.json');

var TARGET = process.env.npm_lifecycle_event;
var ROOT_PATH = path.resolve(__dirname);
var config = {
    paths: {
        build: path.join(ROOT_PATH, 'build'),
        dist: path.join(ROOT_PATH, 'dist'),
        src: path.join(ROOT_PATH, 'src'),
        ghPages: path.join(ROOT_PATH, 'gh-pages'),
        app: path.join(ROOT_PATH, 'app'),
        test: path.join(ROOT_PATH, 'tests')
    }
};

process.env.BABEL_ENV = TARGET;

var common = {
    entry: config.paths.app,
    resolve: {
        extensions: ['', '.js', '.jsx', '.md', '.css', '.png', '.jpg'],
    },
    output: {
        path: config.paths.build,
        filename: 'bundle.js'
    },
    resolveLoader: {
    },
    module: {
        loaders: [
            {
                test: /\.css$/,
                loaders: ['style', 'css']
            },
            {
                test: /\.md$/,
                loaders: ['html']
            },
            {
                test: /\.png$/,
                loaders: ['url?limit=100000&mimetype=image/png'],
                include: config.paths.app
            },
            {
                test: /\.jpg$/,
                loaders: ['file'],
                include: config.paths.app
            },
            {
                test: /\.jsx?$/,
                loaders: ['babel'],
                include: config.paths.src
            }
        ]
    },
    plugins: [
        new HtmlwebpackPlugin({
            title: "Zocdoc Movies",
            template: 'my-index.html',
            files: {
            }
        })
    ],
};

if (TARGET === 'start' || !TARGET) {
    module.exports = merge(common, {
        devtool: 'eval-source-map',
        entry: config.paths.app,
        devServer: {
            historyApiFallback: true,
            hot: true,
            inline: true,
            progress: true
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin()
        ],
        module: {
            loaders: [
                {
                    test: /\.jsx?$/,
                    loaders: ['babel'],
                    include: config.paths.app
                }
            ]
        }
    });
}

var commonDist = merge(common, {
    devtool: 'source-map',
    entry: './src',
    externals: {
        'lodash': {
            commonjs: 'lodash',
            commonjs2: 'lodash',
            amd: '_',
            root: '_'
        },
        'react/addons': {
            commonjs: 'react/addons',
            commonjs2: 'react/addons',
            amd: 'React',
            root: 'React'
        }
    }
});

if (TARGET === 'dist') {
    module.exports = merge(commonDist, {
        output: {
            path: config.paths.dist,
            filename: 'reactabular.js',
            libraryTarget: 'umd',
            library: 'Reactabular',
            sourceMapFilename: '[file].map'
        },
    });
}

if (TARGET === 'dist-min') {
    module.exports = merge(commonDist, {
        output: {
            path: config.paths.dist,
            filename: 'reactabular.min.js',
            libraryTarget: 'umd',
            library: 'Reactabular',
            sourceMapFilename: '[file].map'
        },
        plugins: [
            new webpack.optimize.UglifyJsPlugin({
                compress: {
                    warnings: false
                },
            }),
        ],
    });
}

if(TARGET === 'test' || TARGET === 'tdd') {
    module.exports = merge(common, {
        entry: {}, // karma will set this
        output: {}, // karma will set this
        devtool: 'inline-source-map',
        resolve: {
            alias: {
                'src': config.paths.src
            }
        },
        module: {
            preLoaders: [
                {
                    test: /\.jsx?$/,
                    loaders: ['isparta-instrumenter'],
                    include: config.paths.src
                }
            ],
            loaders: [
                {
                    test: /\.jsx?$/,
                    loaders: ['babel'],
                    include: config.paths.test
                }
            ]
        }
    });
}

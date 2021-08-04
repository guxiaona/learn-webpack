// webpack.config.js
const path = require('path');

// 多入口文件开发
const HtmlWebpackPlugin = require('html-webpack-plugin')

// 在打包输出前清空文件夹
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

// 拆分css
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

// 解析.vue文件
const vueLoaderPlugin = require('vue-loader/lib/plugin')

// // 配置webpack-dev-server进行热更新
// const Webpack = require('webpack')

const devMode = process.argv.indexOf('--mode=production') === -1;

module.exports = {
        mode: 'development', // 开发模式

        entry: {
            main: path.resolve(__dirname, '../src/main.js'),
        },
        // entry: ["@babel/polyfill", path.resolve(__dirname, '../src/main.js')], // 入口文件

        output: {
            filename: '[name].[hash:8].js', // 打包后的文件名称
            path: path.resolve(__dirname, '../dist'), // 打包后的目录
            chunkFilename: 'js/[name].[hash:8].js'
        },

        // 拆分css
        module: {
            rules: [
                // 解析.vue文件
                {
                    test: /\.vue$/,
                    use: [{
                        loader: 'vue-loader',
                        options: {
                            compilerOptions: {
                                preserveWhitespace: false
                            }
                        }
                    }]
                },
                // 用babel转义js文件 js代码兼容更多的环境
                {
                    test: /\.js$/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    },
                    exclude: /node_modules/
                },
                {
                    test: /\.css$/,
                    use: [{
                        loader: devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "../dist/css/",
                            hmr: devMode
                        }
                    }, 'css-loader', {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [require('autoprefixer')]
                        }
                    }]
                },
                {
                    test: /\.less$/,
                    use: [{
                        loader: devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
                        options: {
                            publicPath: "../dist/css/",
                            hmr: devMode
                        }
                    }, 'css-loader', 'less-loader', {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [require('autoprefixer')]
                        }
                    }]
                },
                {
                    test: /\.(jep?g|png|gif)$/,
                    use: {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: 'img/[name].[hash:8].[ext]'
                                }
                            }
                        }
                    }
                },
                {
                    test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                    use: {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: 'media/[name].[hash:8].[ext]'
                                }
                            }
                        }
                    }
                },
                {
                    test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
                    use: {
                        loader: 'url-loader',
                        options: {
                            limit: 10240,
                            fallback: {
                                loader: 'file-loader',
                                options: {
                                    name: 'media/[name].[hash:8].[ext]'
                                }
                            }
                        }
                    }
                }
            ],
        },
        // 解析.vue文件
        resolve: {
            alias: {
                'vue$': 'vue/dist/vue.runtime.esm.js',
                ' @': path.resolve(__dirname, '../src')
            },
            extensions: ['*', '.js', '.json', '.vue']
        },
        // // 配置webpack-dev-server进行热更新
        // devServer: {
        //     port: 3000,
        //     hot: true,
        //     contentBase: '../dist'
        // },
        plugins: [
            // 多入口文件开发
            new HtmlWebpackPlugin({
                template: path.resolve(__dirname, '../public/index.html'),
                // filename: 'index.html',
                // chunks: ['main'] // 与入口文件对应的模块名
            }),

            // 在打包输出前清空文件夹
            new CleanWebpackPlugin(),

            // 拆分css
            // new MiniCssExtractPlugin({
            //     filename: "[name].[hash].css",
            //     chunkFilename: "[id].css",
            // }),

            // 解析.vue文件
            new vueLoaderPlugin(),

            //     // 配置webpack-dev-server进行热更新
            //     new Webpack.HotModuleReplacementPlugin()
            // ],
            new MiniCssExtractPlugin({
                filename: devMode ? '[name].css' : '[name].[hash].css',
                chunkFilename: devMode ? '[id].css' : '[id].[hash].css'
            })

        }
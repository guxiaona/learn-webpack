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

// 使用HappyPack开启多进程Loader转换
const HappyPack = require('happypack')
const os = require('os')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

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
        // noParse:/jquery/, //不去解析jQuery中的依赖库
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
                    },

                    // include exclude减少webpack loader的搜索转换时间。
                    // include:[path.resolve(__dirname,'src')],
                    // exclude:/node_modules/
                }]
            },
            {
                test: /\.js$/,
                // use: {
                //     // 用babel转义js文件 js代码兼容更多的环境
                //     loader: 'babel-loader',
                //     options: {
                //         presets: ['@babel/preset-env']
                //     } 
                // },
                // 把js文件处理交给id为happyBabel的happyPack的实例执行 
                use: [{
                    loader: 'happypack/loader?id=happyBabel'
                }],
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
            ' @': path.resolve(__dirname, '../src'),
            'assets': path.resolve('src/assets'),
            'components': path.resolve('src/components')
        },
        // webpack会根据extensions定义的后缀查找文件(频率较高的文件类型优先写在前面)
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
        }),

        new HappyPack({
            id: 'happyBabel', // 与loader对应的id标识
            // 用法和loader的配置一样 注意这里是loaders
            loaders: [{
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['@babel/preset-env']
                    ],
                    cacheDirectory: true
                }
            }],
            ThreadPool: happyThreadPool, // 共享进程池
            verbose: true
        })
    ]
}
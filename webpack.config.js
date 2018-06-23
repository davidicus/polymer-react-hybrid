//import npm modules
const path = require('path');
const webpack = require('webpack');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');

//import local modules
const alias = require('./config/import_aliases');

// gives us a global constant which is configured at compile time.
// allows different behavior between development builds and release builds [plugins]
const __DEV__ = (process.env.NODE_ENV === 'development');
const nodeEnvironmentCheck = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(__DEV__),
});

//auto prefix css declarations [plugins]
const postCSS = new webpack.LoaderOptionsPlugin({
  minimize: true,
  debug: false,
  options: {
    context: path.join(__dirname, 'src'),
    postcss: [
      require('autoprefixer')
    ]
  }
});

//split the vendor code into separate chunk [plugins]
const chunks = new webpack.optimize.CommonsChunkPlugin({
  name: 'vendor',
  minChunks: (module) => {
    return module.context && module.context.indexOf('node_modules') !== -1;
  }
});

//uglify plugin [plugins]
const uglify = new webpack.optimize.UglifyJsPlugin({
  sourceMap: true,
  compress: {
    warnings: false,
    unused: true,
    dead_code: true,
    drop_console: true,
  },
  output: {
    comments: false,
  }
});
//generate service worker that will cache webpack's bundles [plugins]
const SWPrecache = new SWPrecacheWebpackPlugin({
  cacheId: 'storeInsight',
  filename: 'js/sw.js',
  maximumFileSizeToCacheInBytes: 4194304,
  minify: true,

  // Ignore any source maps from caching, as well as critical styles as those are inlined
  staticFileGlobsIgnorePatterns: [
    /\.map$/,
  ],
});

// plugin for moving index.html and adding our bundled js
const htmlWebpackPlugin = require('html-webpack-plugin');

//configuration for htmlwebpackplugin: tells the template, what to name the file and where to inject the script tag [plugins]
const htmlWebpackPluginConfig = new htmlWebpackPlugin({
  minify: {
    collapseWhitespace: (__DEV__) ? false : true
  },
  template: __dirname + '/src/index.html',
  hash: true,
});

//extract styles into separate stylesheet [plugin]
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ExtractCSS =  new ExtractTextPlugin({
  filename: 'css/[name]_[contentHash].css',
  allChunks: true,
});

//extract reset into their own stylesheet [plugin]
const ExtractResetCSS =  new ExtractTextPlugin({
  filename: 'css/RESET_[contenthash].css',
  allChunks: true
});

//set stylelint options
const styleLintPlugin = require('stylelint-webpack-plugin');
const stylelint = new styleLintPlugin({
  configFile: '.stylelintrc.yml',
  context: 'src/sass',
  files: '**/*.scss',
  failOnError: true,
  syntax: 'scss'
});

////////////////////////////
//webpack config
///////////////////////////
module.exports = {
  context: path.join(__dirname, 'src'),
  entry: {
    main: './index.js',
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'js/[name]_bundled_[chunkhash].js',
  },
  devtool: 'source-map',
  module: {
   //all loaders used in webpack
    rules: [
      //run static code analysis on js files
      {
        test: /\.js$/,
        enforce: "pre",
        exclude: /node_modules/,
        use: 'eslint-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /reset\.scss$/,
        //only bother extracting for production
        use: (__DEV__)
          ? ['style-loader?sourceMap', 'css-loader?sourceMap', 'postcss-loader?sourceMap', 'sass-loader?sourceMap']
          : ExtractResetCSS.extract({
            fallback: 'style-loader',
            use: ['css-loader?sourceMap', 'postcss-loader?sourceMap', 'sass-loader?sourceMap'],
            publicPath: "/dist",
          })
      },
      {
        test: /\.scss$/,
        //only bother extracting for production
        exclude: /reset\.scss$/,
        use: (__DEV__)
          ? ['style-loader?sourceMap', 'css-loader?sourceMap', 'postcss-loader?sourceMap', 'sass-loader?sourceMap']
          : ExtractCSS.extract({
              fallback: 'style-loader',
              loader: ['css-loader?sourceMap', 'postcss-loader?sourceMap', 'sass-loader?sourceMap'],
              publicPath: "/dist",
          })
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: 'file-loader?name=fonts/[name].[ext]'
      },
      {
        test: /\.(png|jpg|svg)$/,
        use: 'file-loader?name=img/[name].[ext]'
      },
    ],
  },
  resolve: {
    modules: [
      path.join(__dirname, 'node_modules'),
    ],

    //add any new components to the alias.js file to be resolved here
    alias: alias
  },
  //load the plugins into webpack
  plugins: [
    nodeEnvironmentCheck,
    htmlWebpackPluginConfig,
    chunks,
    postCSS,
    (__DEV__) ? stylelint : uglify, ExtractCSS, ExtractResetCSS, SWPrecache
  ],
};

//import npm modules
const path = require("path");
const webpack = require("webpack");
// service work plugin for registering SW
const SWPrecacheWebpackPlugin = require("sw-precache-webpack-plugin");
// plugin for moving index.html and adding our bundled js
const htmlWebpackPlugin = require("html-webpack-plugin");

const uglifyJsPlugin = require("uglifyjs-webpack-plugin");

const ExtractTextPlugin = require("extract-text-webpack-plugin");

// const styleLintPlugin = require("stylelint-webpack-plugin");

//import local modules
const alias = require("./config/import_aliases");

//-----------------------------------
// define plugins and plugin configs
//-----------------------------------

// gives us a global constant which is configured at compile time.
// allows different behavior between development builds and release builds [plugins]
const __DEV__ = process.env.NODE_ENV === "development";
const nodeEnvironmentCheck = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(__DEV__),
  "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
});

//auto prefix css declarations [plugins]
const postCSS = new webpack.LoaderOptionsPlugin({
  minimize: true,
  debug: false,
  options: {
    context: path.join(__dirname, "src"),
    postcss: [require("autoprefixer")]
  }
});

// uglify plugin [plugins]
const uglify = new uglifyJsPlugin({
  cache: true,
  parallel: true,
  uglifyOptions: {
    compress: true,
    mangle: true
  },
  sourceMap: true
});

//generate service worker that will cache webpack's bundles [plugins]
const SWPrecache = new SWPrecacheWebpackPlugin({
  cacheId: "PolymerReactHybrid",
  filename: "js/sw.js",
  maximumFileSizeToCacheInBytes: 4194304,
  minify: true,

  // Ignore any source maps from caching, as well as critical styles as those are inlined
  staticFileGlobsIgnorePatterns: [/\.map$/]
});

//configuration for htmlwebpackplugin: tells the template, what to name the file and where to inject the script tag [plugins]
const htmlWebpackPluginConfig = new htmlWebpackPlugin({
  template: __dirname + "/src/index.html",
  inject: true,
  hash: __DEV__ ? false : true,
  minify: {
    removeComments: __DEV__ ? false : true,
    collapseWhitespace: __DEV__ ? false : true
  }
});

//extract styles into separate stylesheet [plugin]
const ExtractCSS = new ExtractTextPlugin({
  filename: "css/[name]_[contentHash].css",
  allChunks: true
});

//extract reset into their own stylesheet [plugin]
const ExtractResetCSS = new ExtractTextPlugin({
  filename: "css/RESET_[contenthash].css",
  allChunks: true
});

// //set stylelint options
// const stylelint = new styleLintPlugin({
//   configFile: ".stylelintrc.yml",
//   context: "src/sass",
//   files: "**/*.scss",
//   failOnError: true,
//   syntax: "scss"
// });

//------------------------------------
// make plugin array for dev and prod
//------------------------------------

const devPlugins = [postCSS, htmlWebpackPluginConfig, nodeEnvironmentCheck];

const prodPlugins = [
  htmlWebpackPluginConfig,
  postCSS,
  nodeEnvironmentCheck,
  ExtractCSS,
  ExtractResetCSS,
  SWPrecache
];

////////////////////////////
//webpack config
///////////////////////////
module.exports = {
  context: path.join(__dirname, "src"),
  entry: {
    main: "./index.js"
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "js/[name]_bundled_[chunkhash].js"
  },
  // cheap-module-eval-source-map is faster for development
  devtool: __DEV__ ? "#cheap-module-eval-source-map" : "source-map",
  module: {
    //all loaders used in webpack
    rules: [
      //run static code analysis on js files
      {
        test: /\.js$/,
        enforce: "pre",
        exclude: /node_modules/,
        use: "eslint-loader"
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /reset\.scss$/,
        //only bother extracting for production
        use: __DEV__
          ? [
            "style-loader?sourceMap",
            "css-loader?sourceMap",
            "postcss-loader?sourceMap",
            "sass-loader?sourceMap"
          ]
          : ExtractResetCSS.extract({
            fallback: "style-loader",
            use: [
                "css-loader?sourceMap",
                "postcss-loader?sourceMap",
                "sass-loader?sourceMap"
              ],
            publicPath: "/dist"
          })
      },
      {
        test: /\.scss$/,
        //only bother extracting for production
        exclude: /reset\.scss$/,
        use: __DEV__
          ? [
            "style-loader?sourceMap",
            "css-loader?sourceMap",
            "postcss-loader?sourceMap",
            "sass-loader?sourceMap"
          ]
          : ExtractCSS.extract({
            fallback: "style-loader",
            loader: [
                "css-loader?sourceMap",
                "postcss-loader?sourceMap",
                "sass-loader?sourceMap"
              ],
            publicPath: "/dist"
          })
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        use: "file-loader?name=fonts/[name].[ext]"
      },
      {
        test: /\.(png|jpg|svg)$/,
        use: "file-loader?name=img/[name].[ext]"
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx", ".css", ".scss"],
    modules: [path.join(__dirname, "node_modules")],

    //add any new components to the alias.js file to be resolved here
    alias: alias
  },
  mode: __DEV__ ? "development" : "production",

  //load the plugins into webpack
  plugins: __DEV__ ? devPlugins : prodPlugins,
  optimization: __DEV__
    ? {
      splitChunks: {
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: "vendor",
              chunks: "initial",
              enforce: true
            }
          }
        },
      minimizer: [
          // we specify a custom UglifyJsPlugin here to get source maps in production
          uglify
        ],
      noEmitOnErrors: true, // NoEmitOnErrorsPlugin
      concatenateModules: true //ModuleConcatenationPlugin
    }
    : null
};

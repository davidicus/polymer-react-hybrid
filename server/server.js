import express from 'express';
import morgan from 'morgan';
import compression from 'compression';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpack from 'webpack';
import webpackConfig from '../webpack.config.js';
import path from 'path';

//set up express instance
const app = express();
//set up webpack with config for middleware to use
const compiler = webpack(webpackConfig);
//change directory context when in dev
const ROOT_DIR = __dirname.replace('/server', '');
//find out node environment
const NODE_ENV = process.env.NODE_ENV || 'development';

const port = process.env.PORT || 3000;

// ---------------------
// -- some middleware --
// ---------------------

//compress all responses
app.use(compression());

// -------------------
// -- Server Listen --
// -------------------
//check if we are in dev or prod
if (NODE_ENV === 'production') {
  //for serving static assets
  app.use(express.static(__dirname + '/'));
  // send index when root is hit
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });
} else {
  //console logger
  app.use(morgan('dev'));
  //hot reloading in dev mode
  app.use(webpackDevMiddleware(compiler, {
    hot: true,
    filename: 'index_bundled.js',
    publicPath: '/',
    stats: {
      colors: true,
    },
    historyApiFallback: true,
  }));
  //change context for dev locations
  app.use(express.static(ROOT_DIR + './src'));
  app.get('*', (req, res) => {
    res.sendFile(path.join(ROOT_DIR, 'src/index.html'));
  });
}


//have express listen for request
const server = app.listen(port, () => {
  const host = server.address().address || 'localhost';
  console.log('Your awesome app listening at http://%s:%s', host, port);
});

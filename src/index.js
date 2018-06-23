//import npm modules
import React from 'react';
import ReactDOM, { render } from 'react-dom';
import { Router, Route, IndexRoute } from 'react-router';
import { Provider } from 'react-redux';


//import project modules
import store, { history } from './store';
import App from 'App';
import Counter from 'Counter';
require('main');
require('reset');

// In browser a11y testing, only in development
if (__DEV__) {
  var axe = require('react-axe');
  axe(React, ReactDOM, 1000);
}

const router = (
  <Provider store={store}>
    <Router history={history}>
        <Route path="/" component={App}>
          <IndexRoute component={Counter}/>
          <Route path="/counter" component={Counter}/>
        </Route>
    </Router>
  </Provider>
)

render( router, document.getElementById('mount') );

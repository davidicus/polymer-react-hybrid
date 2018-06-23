import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { syncHistoryWithStore } from 'react-router-redux';
import { browserHistory } from 'react-router';

import rootReducer from './reducers/index';

const defaultState = {  };
const middleware = applyMiddleware(thunk);

const store = createStore(rootReducer, defaultState, middleware);

export const history = syncHistoryWithStore(browserHistory, store);

export default store;

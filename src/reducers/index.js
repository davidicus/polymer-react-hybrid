//import npm modules
import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

//import all reducers
import storeData from 'storeData';

const rootReducer = combineReducers({storeData, routing: routerReducer});

export default rootReducer;

import { GET_STORE_DATA, GET_STORE_DATA_FAILURE, GET_STORE_DATA_SUCCESS } from 'actionCreators';

const storeData = (state = {
  fetchingData: false,
  fetchDataError: null,
  storeData: {}
}, action) => {
  switch (action.type) {
  case GET_STORE_DATA:
    return {
      ...state,
      fetchingData: true,
    }

  case GET_STORE_DATA_FAILURE:
    return {
      ...state,
      fetchingData: false,
      fetchDataError: action.payload,
    }

  case GET_STORE_DATA_SUCCESS:
    return {
      ...state,
      fetchingData: false,
      fetchDataError: null,
      storeData: action.payload
    }
  default:
    return state;
  }
}

export default storeData;

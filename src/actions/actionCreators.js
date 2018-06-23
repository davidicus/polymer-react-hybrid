import fetch from 'isomorphic-fetch';

export const GET_STORE_DATA = `GET_STORE_DATA`;
export const GET_STORE_DATA_FAILURE = `GET_STORE_DATA_FAILURE`;
export const GET_STORE_DATA_SUCCESS = `GET_STORE_DATA_SUCCESS`;

//fetch store data
export const fetchStoreData = () => {
  return dispatch => {
    dispatch(getStoreData());
    return fetch(`https://jsonplaceholder.typicode.com/posts/1`, {method: `GET`})
      .then(response => {
        const json = response.json();
        if (response.status >= 200 && response.status < 300) {
          return json;
        } else {
          return json.then(Promise.reject.bind(Promise));
        }
      })
      .then(responseJson => {
        dispatch(getStoreDataSuccess(responseJson));
        return responseJson;
      })
      .catch((error) => {
        dispatch(getStoreDataFailure(error));
      });
  }
}

//action
const getStoreData = () => {
  return {
    type: GET_STORE_DATA,
  }
}

//action
const getStoreDataFailure = (error) => {
  return {
    type: GET_STORE_DATA_FAILURE,
    payload: error
  }
}

//action
const getStoreDataSuccess = (storeData) => {
  return {
    type: GET_STORE_DATA_SUCCESS,
    payload: storeData
  }
}

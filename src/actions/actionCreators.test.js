import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { fetchStoreData, GET_STORE_DATA, GET_STORE_DATA_FAILURE, GET_STORE_DATA_SUCCESS } from './actionCreators';
import nock from 'nock';

const middlewares = [ thunk ];
const mockStore = configureMockStore(middlewares);
const data = [
  {
    "userId": 1,
    "id": 1,
    "title": "sunt aut facere repellat provident occaecati excepturi optio reprehenderit",
    "body": "quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto"
  }
]

const error = [
  {
    "status": 404,
    "message": "Test Error!"
  }
];

it(`Should dispatch GET_STORE_DATA and GET_STORE_DATA_SUCCESS actions`, () => {
  nock(`https://jsonplaceholder.typicode.com`)
  .get(`/posts/1`)
  .reply(200, data);

  const expectedActions = [
    { type: GET_STORE_DATA },
    { type: GET_STORE_DATA_SUCCESS, payload: data }
  ];

  const store = mockStore({
    fetchingData: false,
    fetchDataError: null,
    storeData: {}
  });

  return store.dispatch(fetchStoreData())
  .then(() => {
    expect(store.getActions()).toEqual(expectedActions)
  })
});

it(`Should dispatch GET_STORE_DATA and GET_STORE_DATA_FAILURE action`, () => {
  nock(`https://jsonplaceholder.typicode.com`)
  .get(`/posts/1`)
  .reply(404, error);

  const expectedActions = [
    { type: GET_STORE_DATA },
    { type: GET_STORE_DATA_FAILURE, payload: error }
  ];

  const store = mockStore({
    fetchingData: false,
    fetchDataError: error
  });

  return store.dispatch(fetchStoreData())
  .then(() => {
    expect(store.getActions()).toEqual(expectedActions)
  })
});

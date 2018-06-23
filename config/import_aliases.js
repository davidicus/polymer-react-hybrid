const path = require('path');

module.exports = {

  //redux store, actions, reducers
  actionCreators: path.resolve('src/actions/actionCreators'),
  storeData: path.resolve('src/reducers/storeData/storeData'),

  //containers
  App: path.resolve('src/container/App'),
  Main: path.resolve('src/container/Main/Main'),

  //components
  Counter: path.resolve('src/components/Counter/Counter'),

  //images
  thing: path.resolve('src/img/thing.png'),

  //styles
  main: path.resolve('src/sass/main.scss'),
  reset: path.resolve('src/sass/reset.scss'),
}

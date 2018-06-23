//import npm modules
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

//import project modules
import * as actionCreators from 'actionCreators';
import Main from 'Main';

function mapStateToProps (state) {
  const { storeData } = state;
  return {
    ...storeData
  }
}

function mapDispatchToProps (dispatch) {
  return bindActionCreators(actionCreators, dispatch);
}

const App = connect(mapStateToProps, mapDispatchToProps)(Main);

export default App;

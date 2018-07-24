//import npm modules
import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Tile } from 'carbon-components-react';


//import project modules
import { fetchStoreData } from  'actionCreators';

@connect(store => {
  const { storeData } = store;
  return {
    ...storeData
  }
})

export default class Main extends Component {
  constructor() {
    super()
  }

  componentDidMount () {
    this.props.dispatch(fetchStoreData());
  }

  render() {
    return (
      <main className="app">
        <section className="app-section">
          { this.props.children ? React.cloneElement(this.props.children, this.props) : `Hey!` }
        </section>
        <Tile className="navigation">
          <div>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/counter">Counter</Link></li>
            </ul>
          </div>
        </Tile>
      </main>
    );
  }
}

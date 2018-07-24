//import carbon dependencies
import { Button, Tile } from 'carbon-components-react';

import React, { Component } from 'react';
require('thing');

import { fetchStoreData } from  'actionCreators';

/**
 * A counter button: tap the button to increase the count.
 */
export default class Counter extends Component {
  constructor() {
    super();
    this.state = {
      count: 0,
    };
  }

  componentDidMount () {
    this.props.dispatch(fetchStoreData());
  }

  render() {
    return (
      <div>
        <h1 className="bx--type-alpha">Polymer/React Experiment</h1>
        <Tile>
          <div>
            Count: {this.state.count}
          </div>
          <button
            onClick={() => {
              this.setState({ count: this.state.count + 1 });
            }}
          >
            Normal Button
          </button>

          <paper-button onClick={() => {
            this.setState({ count: this.state.count + 1 });
          }}>
            Polymer Button
          </paper-button>

          <Button onClick={() => {
            this.setState({ count: this.state.count + 1 });
          }} className="some-class">
            React Button
          </Button>

        </Tile>
      </div>
    );
  }
}

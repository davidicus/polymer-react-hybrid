import React, { Component } from "react";
require("thing");

// import { fetchStoreData } from  'actionCreators';

/**
 * A counter button: tap the button to increase the count.
 */
export default class Counter extends Component {
  constructor() {
    super();
    this.state = {
      count: 0
    };
  }

  // componentDidMount () {
  //   this.props.dispatch(fetchStoreData());
  // }

  render() {
    return (
      <div>
        <img alt="a placeholder" src="/img/thing.png" />
        <button
          onClick={() => {
            this.setState({ count: this.state.count + 1 });
          }}
        >
          Count: {this.state.count}
        </button>
      </div>
    );
  }
}

//import npm modules
import React, { Component } from "react";
import { connect } from "react-redux";
import { Route, Link } from "react-router-dom";
import Counter from "Counter";
// import App from "App";

//import project modules
import { fetchStoreData } from "actionCreators";

@connect(store => {
  const { storeData } = store;
  return {
    ...storeData
  };
})
export default class Main extends Component {
  constructor() {
    super();
  }

  componentDidMount() {
    this.props.dispatch(fetchStoreData());
  }

  render() {
    return (
      <main className="app">
        <h1>Hey Now!</h1>
        <ul>
          <li>
            <Link to="counter">Counter</Link>
            {/* <Link to="/">Home</Link> */}
          </li>
        </ul>
        <section className="app-section">
          {this.props.children
            ? React.cloneElement(this.props.children, this.props)
            : `Hey!`}
        </section>
        <Route path="/counter" component={Counter} />
        {/* <Route path="/" component={App} /> */}
      </main>
    );
  }
}

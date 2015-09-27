import 'core-js/shim';
import 'regenerator/runtime';
import 'isomorphic-fetch';
import React, { Component } from 'react';
import { Provider } from 'react-redux';
import store from './store';

class App extends Component {
  render() {
    return (
      <div className="app-container">
        <Provider store={store()}>
          {this.props.children}
        </Provider>
      </div>
    );
  }
}

React.render(<App />, document.querySelector('#mount'));

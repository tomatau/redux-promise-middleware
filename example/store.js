import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from '../src/index';
import reducers from './reducers';

const createStoreWithMiddleware = applyMiddleware(
  promiseMiddleware
)(createStore);

export default function store(initialState) {
  const store = createStoreWithMiddleware(reducers, initialState);

  if (module.hot) {

    // Enable Webpack hot module replacement for reducers
    module.hot.accept('./reducers', () => {
      const nextRootReducer = require('./reducers');
      store.replaceReducer(reducers);
    });
  }

  if (NODE_ENV === 'development') {
    window.store = store.getState();
  }

  return store;
}

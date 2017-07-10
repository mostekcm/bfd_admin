import axios from 'axios';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { browserHistory } from 'react-router';
import { routeActions, syncHistory } from 'redux-simple-router';

import routes from './routes';
import configureStore from './store/configureStore';
import * as constants from './constants';

// Make axios aware of the base path.
axios.defaults.baseURL = window.config.BASE_URL;

// Make history aware of the base path.
const reduxRouterMiddleware = syncHistory(browserHistory);

const store = configureStore([ reduxRouterMiddleware ], { });

store.subscribe(() => {
  switch (store.getState().lastAction.type) {
    case constants.FETCH_SETTINGS_FULFILLED: {
      const data = store.getState().settings.get('record');
      const settings = data.get('settings');

      const title = settings.get('title');
      if (title && title !== '') {
        document.title = title;
      }

      const css = settings.get('css');
      if (css !== '') {
        const head = document.getElementsByTagName('head')[0];
        const link = document.createElement('link');
        link.id = 'custom_css';
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = css;
        link.media = 'all';
        head.appendChild(link);
      }
      break;
    }
    default:
      break;
  }
});

// Render application.
ReactDOM.render(
  <Provider store={store}>
    {routes(browserHistory)}
  </Provider>,
  document.getElementById('app')
);

// Show the developer tools.
if (process.env.NODE_ENV !== 'production') {
  const showDevTools = require('./showDevTools'); // eslint-disable-line global-require
  showDevTools(store);
}

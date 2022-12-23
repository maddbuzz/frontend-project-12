import { ErrorBoundary, Provider as RollbarProvider } from '@rollbar/react';
import profanityFilter from 'leo-profanity';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import reportWebVitals from './reportWebVitals';

import 'bootstrap/dist/css/bootstrap.min.css';
// import 'react-toastify/dist/ReactToastify.css';
// minified version is also included:
import 'react-toastify/dist/ReactToastify.min.css';

import App from './components/App.jsx';
import './i18n';
import store from './slices/index.js';

// profanityFilter.loadDictionary('ru'); // replace current dictionary with the Russian

const rollbarConfig = {
  accessToken: 'f7c9e7e2f6e24c289ccf9d39e612441d',
  environment: 'production', // 'testenv',
};
/*
function TestError() {
  const a = null;
  return a.hello();
}
RollbarProvider instantiates Rollbar client instance handling any uncaught errors or unhandled
promises in the browser.
ErrorBoundary catches all React errors in the tree below and logs them to Rollbar.
*/
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RollbarProvider config={rollbarConfig}>
      <ErrorBoundary>
        {/* <TestError /> */}
        <Provider store={store}>
          <App profanityFilter={profanityFilter} />
          <ToastContainer pauseOnFocusLoss={false} />
        </Provider>
      </ErrorBoundary>
    </RollbarProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

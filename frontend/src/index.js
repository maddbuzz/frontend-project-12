import 'bootstrap/dist/css/bootstrap.min.css';
import profanityFilter from 'leo-profanity';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import reportWebVitals from './reportWebVitals';

// import 'react-toastify/dist/ReactToastify.css';
// minified version is also included
import 'react-toastify/dist/ReactToastify.min.css';

import App from './components/App.jsx';
import './i18n';
import store from './slices/index.js';

profanityFilter.loadDictionary('ru'); // replace current dictionary with the Russian

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App profanityFilter={profanityFilter} />
      <ToastContainer pauseOnFocusLoss={false} />
    </Provider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

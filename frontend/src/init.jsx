/* eslint-disable react/jsx-no-constructed-context-values */

import { configureStore } from '@reduxjs/toolkit';
import { ErrorBoundary, Provider as RollbarProvider } from '@rollbar/react';
import i18next from 'i18next';
import profanityFilter from 'leo-profanity';
import React from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { Provider } from 'react-redux';
import { io } from 'socket.io-client';

import { toast, ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css'; // minified version is also included:
import 'react-toastify/dist/ReactToastify.min.css';

import App from './components/App.jsx';
import { ChatApiContext } from './contexts/index.jsx';
import resources from './locales/index.js';
import { actions as channelsActions } from './slices/channelsSlice.js';
import reducer from './slices/index.js';
import { actions as messagesActions } from './slices/messagesSlice.js';

const defaultLanguage = 'ru';
const socketTimeoutMs = 5000;

export default async () => {
  const i18n = i18next.createInstance();
  await i18n
    .use(initReactI18next)
    .init({
      lng: defaultLanguage,
      debug: false,
      resources,
    });

  const store = configureStore({ reducer });

  const socket = io();

  console.debug(`Subscribe for socket events (socket.id=${socket.id})`);
  socket
    .on('connect', () => {
      console.debug(`socket "connect" id=${socket.id}`);
    })
    .on('connect_error', () => {
      console.debug('socket "connect_error"');
    })
    .on('disconnect', (reason) => {
      console.debug(`socket "disconnect" (${reason})`);
    })

    .on('newMessage', (payload) => {
      console.debug('newMessage "event"', payload);
      store.dispatch(messagesActions.addMessage(payload));
    })
    .on('newChannel', (payload) => {
      console.debug('newChannel "event"', payload);
      store.dispatch(channelsActions.addChannel(payload));
      toast.info(i18n.t('Channel created'));
    })
    .on('removeChannel', (payload) => {
      console.debug('removeChannel "event"', payload);
      store.dispatch(channelsActions.removeChannel(payload.id));
      toast.info(i18n.t('Channel removed'));
    })
    .on('renameChannel', (payload) => {
      console.debug('renameChannel "event"', payload);
      const { id, name } = payload;
      store.dispatch(channelsActions.updateChannel({ id, changes: { name } }));
      toast.info(i18n.t('Channel renamed'));
    });
  // socket.removeAllListeners(); // remove all listeners for all events

  const getSocketEmitPromise = (...args) => new Promise((resolve, reject) => {
    socket.timeout(socketTimeoutMs).emit(...args, (err, response) => {
      if (err) reject(err); // the other side did not acknowledge the event in the given delay
      resolve(response);
    });
  });
  const chatApi = {
    newMessage: (...args) => getSocketEmitPromise('newMessage', ...args),
    newChannel: (...args) => getSocketEmitPromise('newChannel', ...args),
    removeChannel: (...args) => getSocketEmitPromise('removeChannel', ...args),
    renameChannel: (...args) => getSocketEmitPromise('renameChannel', ...args),
  };

  const russianDictionary = profanityFilter.getDictionary('ru');
  profanityFilter.add(russianDictionary);

  const rollbarConfig = {
    accessToken: process.env.REACT_APP_ROLLBAR_TOKEN, // process.env.REACT_APP_NOT_SECRET_CODE
    /*
    "WARNING: Do not store any secrets (such as private API keys) in your React app!
     Environment variables are embedded into the build,
     meaning anyone can view them by inspecting your app's files."
    https://create-react-app.dev/docs/adding-custom-environment-variables/
    */
    environment: 'production',
  };

  return (
    <I18nextProvider i18n={i18n}>
      <RollbarProvider config={rollbarConfig}>
        <ErrorBoundary>
          <Provider store={store}>
            <ChatApiContext.Provider value={chatApi}>
              <App />
              <ToastContainer pauseOnFocusLoss={false} position="top-center" />
            </ChatApiContext.Provider>
          </Provider>
        </ErrorBoundary>
      </RollbarProvider>
    </I18nextProvider>
  );
};

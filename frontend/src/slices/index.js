import { configureStore } from '@reduxjs/toolkit';

import channelsReducer from './channelsSlice.js';
import messagesReducer from './messagesSlice.js';
import currentChannelIdReducer from './currentChannelIdSlice.js';

export default configureStore({
  reducer: {
    messages: messagesReducer,
    channels: channelsReducer,
    currentChannelId: currentChannelIdReducer,
  },
});

import channelsReducer from './channelsSlice.js';
import messagesReducer from './messagesSlice.js';
import currentChannelIdReducer from './currentChannelIdSlice.js';

export default {
  messages: messagesReducer,
  channels: channelsReducer,
  currentChannelId: currentChannelIdReducer,
};

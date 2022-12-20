import { createSlice, createEntityAdapter } from '@reduxjs/toolkit';

import { actions as channelsActions } from './channelsSlice.js';

const messagesAdapter = createEntityAdapter();
const initialState = messagesAdapter.getInitialState();

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    setMessages: messagesAdapter.setAll,
    addMessages: messagesAdapter.addMany,
    addMessage: messagesAdapter.addOne,
    updateMessage: messagesAdapter.updateOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(channelsActions.removeChannel, (state, action) => {
        const removedChannelId = action.payload;
        const allEntities = Object.values(state.entities);
        const removedChannelMessagesIds = allEntities
          .filter((e) => e.channelId === removedChannelId)
          .map(({ id }) => id);
        messagesAdapter.removeMany(state, removedChannelMessagesIds);
      });
  },
});

export const { actions } = messagesSlice;
export const selectors = messagesAdapter.getSelectors((state) => state.messages);
export default messagesSlice.reducer;

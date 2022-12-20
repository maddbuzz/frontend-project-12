/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

import { actions as channelsActions } from './channelsSlice.js';

const defaultChannelId = 1;

const initialState = {
  value: defaultChannelId,
};

const currentChannelIdSlice = createSlice({
  name: 'currentChannelId',
  initialState,
  reducers: {
    defaultCurrentChannelId: (state) => {
      state.value = defaultChannelId;
    },
    setCurrentChannelId: (state, action) => {
      state.value = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(channelsActions.removeChannel, (state, action) => {
        const removedChannelId = action.payload;
        if (state.value === removedChannelId) state.value = defaultChannelId;
      });
  },
});

export const { defaultCurrentChannelId, setCurrentChannelId } = currentChannelIdSlice.actions;
export default currentChannelIdSlice.reducer;

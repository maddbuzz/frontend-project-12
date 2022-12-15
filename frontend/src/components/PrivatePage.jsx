import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import paths from '../paths.js';
import useAuth from '../hooks/index.jsx';
import { actions as channelsActions } from '../slices/channelsSlice.js';
import { actions as messagesActions } from '../slices/messagesSlice.js';

const getAuthHeader = (userId) => {
  const userData = JSON.parse(userId);
  if (userData && userData.token) {
    return { Authorization: `Bearer ${userData.token}` };
  }
  return {};
};

const PrivatePage = () => {
  const auth = useAuth();
  const [content, setContent] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await axios.get(paths.dataPath(), { headers: getAuthHeader(auth.userId) });
      setContent(JSON.stringify(data));
      // console.log('auth.userId:', auth.userId);
      console.log('axios fetched data: ', data);
      dispatch(channelsActions.addChannels(data.channels));
      dispatch(messagesActions.addMessages(data.messages));
    };

    fetchContent();
  }, [auth.userId, dispatch]);

  return content && <p>{content}</p>;
};

export default PrivatePage;

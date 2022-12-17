import axios from 'axios';
import React, { useEffect, useState } from 'react';

import paths from '../paths.js';
import useAuth from '../hooks/index.jsx';

const getAuthHeader = (userData) => {
  // const userData = JSON.parse(userData);
  if (userData && userData.token) {
    return { Authorization: `Bearer ${userData.token}` };
  }
  return {};
};

const PrivatePage = () => {
  const auth = useAuth();
  const [content, setContent] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await axios.get(paths.dataPath(), { headers: getAuthHeader(auth.userData) });
      setContent(JSON.stringify(data));
      // console.log('auth.userData:', auth.userData);
      console.log('axios fetched data: ', data);
    };

    fetchContent();
  }, [auth.userData]);

  return content && <p>{content}</p>;
};

export default PrivatePage;

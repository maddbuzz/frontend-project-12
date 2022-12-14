import axios from 'axios';
import React, { useEffect, useState } from 'react';

import paths from '../paths.js';
import useAuth from '../hooks/index.jsx';

const getAuthHeader = (userId) => {
  const userData = JSON.parse(userId);
  if (userData && userData.token) {
    return { Authorization: `Bearer ${userData.token}` };
  }
  return {};
};

const PrivatePage = () => {
  const auth = useAuth();
  const [content, setContent] = useState({});

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await axios.get(paths.dataPath(), { headers: getAuthHeader(auth.userId) });
      setContent(data);
    };
    fetchContent();
  }, [auth.userId]);

  return content && <p>{JSON.stringify(content)}</p>;
};

export default PrivatePage;

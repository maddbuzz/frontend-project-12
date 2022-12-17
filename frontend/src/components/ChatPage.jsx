import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';

import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

import useAuth from '../hooks/index.jsx';
import paths from '../paths.js';
import { actions as channelsActions, selectors as channelsSelectors } from '../slices/channelsSlice.js';
import { actions as messagesActions, selectors as messagesSelectors } from '../slices/messagesSlice.js';

const LeftCol = ({ channels, selectedChannelId, setSelectedChannelId }) => (
  <Col md={2} className="col-4 border-end pt-5 px-0 bg-light">
    <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
      <span>Каналы</span>
      <button type="button" className="p-0 text-primary btn btn-group-vertical">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor" data-darkreader-inline-fill="" style={{ '--darkreader-inline-fill': 'currentColor;' }}>
          <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
        </svg>
        <span className="visually-hidden">+</span>
      </button>
    </div>
    <ul className="nav flex-column nav-pills nav-fill px-2">
      {channels.map(({ name, id }) => (
        <li className="nav-item w-100" key={id}>
          <button
            className={`w-100 rounded-0 text-start btn${id === selectedChannelId ? ' btn-secondary' : ''}`}
            onClick={() => setSelectedChannelId(id)}
            type="button"
          >
            <span className="me-1">#</span>
            {name}
          </button>
        </li>
      ))}
    </ul>
  </Col>
);

const MessagesBox = ({ channelMessages }) => (
  <div id="messages-box" className="chat-messages overflow-auto px-5 ">
    {channelMessages.map(({ id, body, username }) => (
      <div key={id} className="text-break mb-2">
        <b>{username}</b>
        {`: ${body}`}
      </div>
    ))}
  </div>
);

const SendForm = ({
  submitHandler, message, setMessage, inputRef,
}) => (
  <div className="mt-auto px-5 py-3">
    <form noValidate="" className="py-1 border rounded-2" onSubmit={submitHandler}>
      <div className="input-group has-validation">
        <input
          name="body"
          aria-label="Новое сообщение"
          placeholder="Введите сообщение..."
          className="border-0 p-0 ps-2 form-control"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          ref={inputRef}
        />
        <button type="submit" disabled="" className="btn btn-group-vertical">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor" data-darkreader-inline-fill="" style={{ '--darkreader-inline-fill': 'currentColor;' }}>
            <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
          </svg>
          <span className="visually-hidden">Отправить</span>
        </button>
      </div>
    </form>
  </div>
);

const RightCol = ({
  selectedChannel, channelMessages, submitHandler, message, setMessage, inputRef,
}) => (
  <Col className="p-0 h-100">
    <div className="d-flex flex-column h-100">
      <div className="bg-light mb-4 p-3 shadow-sm small">
        <p className="m-0"><b>{`# ${selectedChannel?.name}`}</b></p>
        <span className="text-muted">{`${channelMessages.length} сообщений`}</span>
      </div>
      <MessagesBox
        channelMessages={channelMessages}
      />
      <SendForm
        submitHandler={submitHandler}
        message={message}
        setMessage={setMessage}
        inputRef={inputRef}
      />
    </div>
  </Col>
);

const getAuthHeader = (userData) => (
  userData?.token ? { Authorization: `Bearer ${userData.token}` } : {}
);

const socket = io();

const ChatPage = () => {
  const inputRef = useRef();

  // const channels = useSelector(channelsSelectors.selectAll);
  // const messages = useSelector(messagesSelectors.selectAll);
  const [selectedChannelId, setSelectedChannelId] = useState(1);

  const { channels, selectedChannel, channelMessages } = useSelector((state) => {
    const allChannels = channelsSelectors.selectAll(state);
    const currentChannel = channelsSelectors.selectById(state, selectedChannelId);
    const messages = messagesSelectors.selectAll(state)
      .filter(({ channelId }) => channelId === selectedChannelId);
    return { channels: allChannels, selectedChannel: currentChannel, channelMessages: messages };
  });

  const [message, setMessage] = useState('');

  const auth = useAuth();
  const dispatch = useDispatch();

  socket.on('newMessage', (payload) => {
    // console.log('newMessage arrived:', payload);
    dispatch(messagesActions.addMessage(payload));
  });

  const submitHandler = (e) => {
    e.preventDefault();
    socket.emit('newMessage', {
      body: message, channelId: selectedChannelId, username: auth.userData.username,
    });
    setMessage('');
  };

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await axios.get(paths.dataPath(), { headers: getAuthHeader(auth.userData) });
      dispatch(channelsActions.addChannels(data.channels));
      dispatch(messagesActions.addMessages(data.messages));
    };
    console.log('ChatPage fetching content...');
    fetchContent();
  }, [auth.userData, dispatch]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [selectedChannel]);

  // if (!selectedChannel) return null;

  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <Row className="h-100 bg-white flex-md-row">
        <LeftCol
          channels={channels}
          selectedChannelId={selectedChannelId}
          setSelectedChannelId={setSelectedChannelId}
        />
        <RightCol
          selectedChannel={selectedChannel}
          channelMessages={channelMessages}
          submitHandler={submitHandler}
          message={message}
          setMessage={setMessage}
          inputRef={inputRef}
        />
      </Row>
    </Container>
  );
};

export default ChatPage;

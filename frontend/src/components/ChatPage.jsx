import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Dropdown from 'react-bootstrap/Dropdown';
import Row from 'react-bootstrap/Row';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';

import useAuth from '../hooks/index.jsx';
import paths from '../paths.js';
import { actions as channelsActions, selectors as channelsSelectors } from '../slices/channelsSlice.js';
import { setCurrentChannelId } from '../slices/currentChannelIdSlice.js';
import { actions as messagesActions, selectors as messagesSelectors } from '../slices/messagesSlice.js';
import getModal from './modals/index.js';

const socketTimeoutMs = 5000;

const socket = io();

const getSocketEmitPromise = (eventName, ...args) => new Promise((resolve, reject) => {
  socket.timeout(socketTimeoutMs).emit(eventName, ...args, (err, response) => {
    //     console.log(`<new Promise socketCallback(
    //     eventName=${eventName}
    //     args=${JSON.stringify(args)}
    //     err=${JSON.stringify(err)}
    //     response=${JSON.stringify(response)}
    // )>`);
    if (err) reject(err); // the other side did not acknowledge the event in the given delay
    resolve(response);
  });
});

const renderModal = ({
  modalInfo, hideModal, socketEmitPromises, channels,
}) => {
  if (!modalInfo.type) {
    return null;
  }
  const Component = getModal(modalInfo.type);
  const socketEmitPromise = socketEmitPromises[modalInfo.type];
  return (
    <Component
      modalInfo={modalInfo}
      socketEmitPromise={socketEmitPromise}
      onHide={hideModal}
      channels={channels}
    />
  );
};

const LeftCol = ({
  channels, currentChannelId, showModal, t,
}) => {
  const dispatch = useDispatch();
  return (
    <Col md={2} className="col-4 border-end pt-5 px-0 bg-light">
      <div className="d-flex justify-content-between mb-2 ps-4 pe-2">
        <span>{t('Channels')}</span>
        <button onClick={() => showModal('newChannel')} type="button" className="p-0 text-primary btn btn-group-vertical">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor" data-darkreader-inline-fill="" style={{ '--darkreader-inline-fill': 'currentColor;' }}>
            <path d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />
            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
          </svg>
          <span className="visually-hidden">+</span>
        </button>
      </div>
      <ul className="nav flex-column nav-pills nav-fill px-2">
        {channels.map((c) => (
          <li className="nav-item w-100" key={c.id}>
            <Dropdown as={ButtonGroup} className="d-flex">
              <Button
                className="w-100 rounded-0 text-start text-truncate"
                variant={c.id === currentChannelId && 'secondary'}
                onClick={() => { dispatch(setCurrentChannelId(c.id)); }}
              >
                <span className="me-1">#</span>
                {c.name}
              </Button>
              {c.removable && (
                <Dropdown.Toggle
                  split
                  variant={c.id === currentChannelId && 'secondary'}
                >
                  <span className="visually-hidden">{t('Channel management')}</span>
                </Dropdown.Toggle>
              )}
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => showModal('removeChannel', c)}>{t('Delete')}</Dropdown.Item>
                <Dropdown.Item onClick={() => showModal('renameChannel', c)}>{t('Rename')}</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </li>
        ))}
      </ul>
    </Col>
  );
};

const MessagesBox = ({ channelMessages }) => {
  const messagesRef = useRef();
  useEffect(() => {
    const { current } = messagesRef;
    const { scrollHeight, clientHeight } = current;
    if (scrollHeight > clientHeight) current.scrollTop = scrollHeight - clientHeight;
  }, [channelMessages.length]);

  return (
    <div ref={messagesRef} className="overflow-auto px-5 ">
      {channelMessages.map(({ id, body, username }) => (
        <div key={id} className="text-break mb-2">
          <b>{username}</b>
          {`: ${body}`}
        </div>
      ))}
    </div>
  );
};

const SendingForm = ({ newMessagePromise, t, profanityFilter }) => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current?.focus();
  });

  const submitHandler = async (e) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage.length) return;
    const cleanedMessage = profanityFilter.clean(trimmedMessage);
    setSubmitting(true);
    try {
      await newMessagePromise(cleanedMessage);
      setMessage('');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-auto px-5 py-3">
      <form noValidate="" className="py-1 border rounded-2" onSubmit={submitHandler}>
        <fieldset disabled={isSubmitting}>
          <div className="input-group has-validation">
            <input
              name="body"
              aria-label={t('A new message')}
              placeholder={t('Enter your message...')}
              className="border-0 p-0 ps-2 form-control"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              ref={inputRef}
            />
            <button type="submit" disabled="" className="btn btn-group-vertical">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor" data-darkreader-inline-fill="" style={{ '--darkreader-inline-fill': 'currentColor;' }}>
                <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
              </svg>
              <span className="visually-hidden">{t('Send')}</span>
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

const RightCol = ({
  currentChannel, channelMessages, newMessagePromise, t, profanityFilter,
}) => (
  <Col className="p-0 h-100">
    <div className="d-flex flex-column h-100">
      <div className="bg-light mb-4 p-3 shadow-sm small">
        <p className="m-0"><b>{`# ${currentChannel?.name}`}</b></p>
        <span className="text-muted">{t('messagesCount', { count: channelMessages.length })}</span>
      </div>
      <MessagesBox
        channelMessages={channelMessages}
      />
      <SendingForm
        newMessagePromise={newMessagePromise}
        t={t}
        profanityFilter={profanityFilter}
      />
    </div>
  </Col>
);

const getAuthHeader = (userData) => (
  userData?.token ? { Authorization: `Bearer ${userData.token}` } : {}
);

const ChatPage = ({ profanityFilter }) => {
  const { t } = useTranslation();
  const auth = useAuth();
  const dispatch = useDispatch();

  const currentChannelId = useSelector((state) => state.currentChannelId.value);
  const currentChannel = useSelector(
    (state) => channelsSelectors.selectById(state, currentChannelId),
  );

  const channels = useSelector(channelsSelectors.selectAll);
  const channelMessages = useSelector(messagesSelectors.selectAll)
    .filter(({ channelId }) => channelId === currentChannelId);

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await axios.get(paths.dataPath(), { headers: getAuthHeader(auth.userData) });
      dispatch(channelsActions.setChannels(data.channels));
      dispatch(messagesActions.setMessages(data.messages));
    };
    console.log('ChatPage fetching content...');
    fetchContent();

    // socket.off(); // remove all listeners for all events ? No !
    // socket.removeAllListeners(); // remove all listeners for all events ? Yes !
    console.log(`Subscribe for socket events (socket.id=${socket.id})`);
    socket
      .on('connect', () => {
        console.log(`socket "connect" id=${socket.id}`);
      })
      .on('connect_error', () => {
        console.log('socket "connect_error"');
      })
      .on('disconnect', (reason) => {
        console.log(`socket "disconnect" (${reason})`);
      })

      .on('newMessage', (payload) => {
        console.log('newMessage "event"', payload);
        dispatch(messagesActions.addMessage(payload));
      })
      .on('newChannel', (payload) => {
        console.log('newChannel "event"', payload);
        dispatch(channelsActions.addChannel(payload));
        toast.info(t('Channel created'));
      })
      .on('removeChannel', (payload) => {
        console.log('removeChannel "event"', payload);
        dispatch(channelsActions.removeChannel(payload.id));
        toast.info(t('Channel removed'));
      })
      .on('renameChannel', (payload) => {
        console.log('renameChannel "event"', payload);
        const { id, name } = payload;
        dispatch(channelsActions.updateChannel({ id, changes: { name } }));
        toast.info(t('Channel renamed'));
      });

    return () => {
      socket.removeAllListeners(); // remove all listeners for all events ? Yes !
      console.log(`Unsubscribe from socket events (socket.id=${socket.id})`);
    };
  }, [auth.userData, dispatch, t]);

  const socketEmitPromises = {
    newMessage: (message) => getSocketEmitPromise(
      'newMessage',
      { body: message, channelId: currentChannelId, username: auth.userData.username },
    ),
    newChannel: async (name) => {
      const { data: channelWithId } = await getSocketEmitPromise('newChannel', { name });
      dispatch(setCurrentChannelId(channelWithId.id));
    },
    removeChannel: (id) => getSocketEmitPromise('removeChannel', { id }),
    renameChannel: (id, name) => getSocketEmitPromise('renameChannel', { id, name }),
  };

  const [modalInfo, setModalInfo] = useState({ type: null, item: null });
  const hideModal = () => setModalInfo({ type: null, item: null });
  const showModal = (type, item = null) => setModalInfo({ type, item });

  return (
    <Container className="h-100 my-4 overflow-hidden rounded shadow">
      <Row className="h-100 bg-white flex-md-row">
        <LeftCol
          t={t}
          channels={channels}
          currentChannelId={currentChannelId}
          showModal={showModal}
        />
        <RightCol
          t={t}
          currentChannel={currentChannel}
          channelMessages={channelMessages}
          newMessagePromise={socketEmitPromises.newMessage}
          profanityFilter={profanityFilter}
        />
      </Row>
      {renderModal({
        modalInfo, hideModal, socketEmitPromises, channels,
      })}
    </Container>
  );
};

export default ChatPage;

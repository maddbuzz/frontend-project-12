import React, { useMemo, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import { useTranslation } from 'react-i18next';
import {
  BrowserRouter as Router, Link,
  Navigate, Route, Routes,
} from 'react-router-dom';

import AuthContext from '../contexts/index.jsx';
import useAuth from '../hooks/index.jsx';
import paths from '../paths.js';
import ChatPage from './ChatPage.jsx';
import LoginPage from './LoginPage.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import SignupPage from './SignupPage.jsx';

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(() => {
    const item = localStorage.getItem('userData');
    return item ? JSON.parse(item) : null;
  });
  const userLogIn = (data) => {
    setUserData(data);
    const stringedData = JSON.stringify(data);
    localStorage.setItem('userData', stringedData);
  };
  const userLogOut = () => {
    setUserData(null);
    localStorage.removeItem('userData');
  };
  const auth = useMemo(() => ({ userData, userLogIn, userLogOut }), [userData]);
  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  return auth.userData ? children : <Navigate to={paths.loginPagePath()} />;
};

const AuthButton = () => {
  const auth = useAuth();
  const { t } = useTranslation();
  return auth.userData && <Button onClick={auth.userLogOut}>{t('Logout')}</Button>;
};

const App = ({ profanityFilter }) => (
  <AuthProvider>
    <Router>
      <div className="d-flex flex-column vh-100">

        <Navbar className="shadow-sm navbar-expand-lg navbar-light bg-white">
          <Container>
            <Navbar.Brand as={Link} to={paths.chatPagePath()}>Hexlet Chat</Navbar.Brand>
            <AuthButton />
          </Container>
        </Navbar>

        <Routes>
          <Route path={paths.loginPagePath()} element={<LoginPage />} />
          <Route path={paths.signupPagePath()} element={<SignupPage />} />
          <Route
            path={paths.chatPagePath()}
            element={(
              <PrivateRoute>
                <ChatPage profanityFilter={profanityFilter} />
              </PrivateRoute>
            )}
          />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

      </div>
    </Router>
  </AuthProvider>
);

export default App;

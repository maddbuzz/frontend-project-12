import React, { useMemo, useState } from 'react';
import {
  BrowserRouter as Router, Link,
  Navigate, Route, Routes, useLocation,
} from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';

import ChatPage from './ChatPage.jsx';
import LoginPage from './LoginPage.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import SignupPage from './SignupPage.jsx';

import AuthContext from '../contexts/index.jsx';
import useAuth from '../hooks/index.jsx';

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
  const location = useLocation();
  return (
    auth.userData ? children : <Navigate to="/login" state={{ from: location }} />
  );
};

const AuthButton = () => {
  const auth = useAuth();
  // const location = useLocation();
  return (
    auth.userData
      ? <Button onClick={auth.userLogOut}>Выйти</Button>
      : null // : <Button as={Link} to="/login" state={{ from: location }}>Войти</Button>
  );
};

const App = () => (
  <AuthProvider>
    <Router>
      <div className="d-flex flex-column vh-100">

        <Navbar className="shadow-sm navbar-expand-lg navbar-light bg-white">
          <Container>
            <Navbar.Brand as={Link} to="/">Hexlet Chat</Navbar.Brand>
            <AuthButton />
          </Container>
        </Navbar>

        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route
            path="/"
            element={(
              <PrivateRoute>
                <ChatPage />
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

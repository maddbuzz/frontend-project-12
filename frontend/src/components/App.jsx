import React, { useMemo, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Navbar from 'react-bootstrap/Navbar';

import LoginPage from './LoginPage.jsx';
import PrivatePage from './PrivatePage.jsx';
import NotFoundPage from './NotFoundPage.jsx';

import AuthContext from '../contexts/index.jsx';
import useAuth from '../hooks/index.jsx';

const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(() => localStorage.getItem('userId'));
  const userLogIn = (userData) => {
    const value = JSON.stringify(userData);
    localStorage.setItem('userId', value);
    setUserId(value);
  };
  const userLogOut = () => {
    localStorage.removeItem('userId');
    setUserId(null);
  };
  const auth = useMemo(() => ({ userId, userLogIn, userLogOut }), [userId]);
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
    auth.userId ? children : <Navigate to="/login" state={{ from: location }} />
  );
};

const AuthButton = () => {
  const auth = useAuth();
  const location = useLocation();
  return (
    auth.userId
      ? <Button onClick={auth.userLogOut}>Log out</Button>
      : <Button as={Link} to="/login" state={{ from: location }}>Log in</Button>
  );
};

const App = () => (
  <AuthProvider>
    <Router>

      <Navbar bg="light" expand="lg">
        <Navbar.Brand as={Link} to="/">Root Place</Navbar.Brand>
        <AuthButton />
      </Navbar>

      <div className="container p-3">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={(
              <PrivateRoute>
                <div>CHAT</div>
                <PrivatePage />
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

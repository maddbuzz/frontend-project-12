import React, { useMemo, useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { Button, Navbar, Nav } from 'react-bootstrap';

import LoginPage from './LoginPage.jsx';
import NotFoundPage from './NotFoundPage.jsx';
import PrivatePage from './PrivatePage.jsx';

import AuthContext from '../contexts/index.jsx';
import useAuth from '../hooks/index.jsx';

const AuthProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(() => (
    localStorage.getItem('userId') !== null
  ));
  const logIn = () => setLoggedIn(true);
  const logOut = () => {
    localStorage.removeItem('userId');
    setLoggedIn(false);
  };
  const authValue = useMemo(() => ({ loggedIn, logIn, logOut }), [loggedIn]);
  return (
    <AuthContext.Provider value={authValue}>
      {children}
    </AuthContext.Provider>
  );
};

const PrivateRoute = ({ children }) => {
  const auth = useAuth();
  const location = useLocation();
  return (
    auth.loggedIn ? children : <Navigate to="/login" state={{ from: location }} />
  );
};

const AuthButton = () => {
  const auth = useAuth();
  const location = useLocation();
  return (
    auth.loggedIn
      ? <Button onClick={auth.logOut}>Log out</Button>
      : <Button as={Link} to="/login" state={{ from: location }}>Log in</Button>
  );
};

const App = () => (
  <AuthProvider>
    <Router>

      <Navbar bg="light" expand="lg">
        <Navbar.Brand as={Link} to="/">Root Place</Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link as={Link} to="/private">Private page</Nav.Link>
        </Nav>
        <AuthButton />
      </Navbar>

      <div className="container p-3">
        <h1 className="text-center mt-5 mb-4">Welcome to the Root Place!</h1>
        <Routes>
          <Route path="/" element={null} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/private"
            element={(
              <PrivateRoute>
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

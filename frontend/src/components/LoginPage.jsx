import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';
import Image from 'react-bootstrap/Image';

import useAuth from '../hooks/index.jsx';
import paths from '../paths.js';

const LoginPage = () => {
  const auth = useAuth();
  const [authFailed, setAuthFailed] = useState(false);
  const inputRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async (values) => {
      setAuthFailed(false);

      try {
        const res = await axios.post(paths.loginPath(), values);
        auth.userLogIn(res.data);
        const { from } = location.state || { from: { pathname: '/' } };
        navigate(from);
      } catch (err) {
        formik.setSubmitting(false);
        if (err.isAxiosError && err.response.status === 401) {
          setAuthFailed(true);
          inputRef.current.select();
          return;
        }
        throw err;
      }
    },
  });

  return (
    <Container fluid className="h-100">
      <Row className="justify-content-center align-content-center h-100">
        <Col xs="12" md="8" xxl="6">
          <Card>
            <Card.Body className="p-5">
              <Row>
                <Col className="d-flex align-items-center justify-content-center">
                  <Image src="login-image.jpg" alt="Войти" roundedCircle thumbnail />
                </Col>
                <Col>
                  <Form onSubmit={formik.handleSubmit}>
                    <h1 className="text-center mb-4">Войти</h1>
                    <fieldset disabled={formik.isSubmitting}>
                      <Stack gap={2}>
                        <FloatingLabel label="Ваш ник">
                          <Form.Control
                            onChange={formik.handleChange}
                            value={formik.values.username}
                            placeholder="Ваш ник"
                            name="username"
                            id="username"
                            autoComplete="username"
                            isInvalid={authFailed}
                            required
                            ref={inputRef}
                          />
                        </FloatingLabel>
                        <FloatingLabel label="Пароль">
                          <Form.Control
                            type="password"
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            placeholder="Пароль"
                            name="password"
                            id="password"
                            autoComplete="current-password"
                            isInvalid={authFailed}
                            required
                          />
                        </FloatingLabel>
                        <Form.Control.Feedback type="invalid">the username or password is incorrect</Form.Control.Feedback>
                        <Button type="submit" variant="outline-primary">Войти</Button>
                      </Stack>
                    </fieldset>
                  </Form>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer>
              <div className="text-center">
                <span>Нет аккаунта? </span>
                <Link to="/signup">Регистрация</Link>
              </div>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginPage;

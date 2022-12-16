import axios from 'axios';
import { useFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
// import * as Yup from 'yup';

import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';

import useAuth from '../hooks/index.jsx';
import paths from '../paths.js';

const SignupPage = () => {
  const auth = useAuth();
  const [authFailed, setAuthFailed] = useState(false);
  const inputRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  // const SignupSchema = Yup.object().shape({
  //   firstName: Yup.string()
  //     .min(2, 'Too Short!')
  //     .max(50, 'Too Long!')
  //     .required('Required'),
  //   lastName: Yup.string()
  //     .min(2, 'Too Short!')
  //     .max(50, 'Too Long!')
  //     .required('Required'),
  //   email: Yup.string().email('Invalid email').required('Required'),
  // });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      passwordConfirmation: '',
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
                  <Image src="avatar_1.6084447160acc893a24d.jpg" alt="Регистрация" roundedCircle thumbnail />
                </Col>
                <Col>
                  <Form onSubmit={formik.handleSubmit}>
                    <h1 className="text-center mb-4">Регистрация</h1>
                    <fieldset disabled={formik.isSubmitting}>
                      <Stack gap={2}>
                        <FloatingLabel label="Имя пользователя">
                          <Form.Control
                            onChange={formik.handleChange}
                            value={formik.values.username}
                            placeholder="Имя пользователя"
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
                        <FloatingLabel label="Подтвердите пароль">
                          <Form.Control
                            type="password"
                            onChange={formik.handleChange}
                            value={formik.values.passwordConfirmation}
                            placeholder="Подтвердите пароль"
                            name="passwordConfirmation"
                            id="passwordConfirmation"
                            autoComplete="current-passwordConfirmation"
                            isInvalid={authFailed}
                            required
                          />
                        </FloatingLabel>
                        <Form.Control.Feedback type="invalid">the username or password is incorrect</Form.Control.Feedback>
                        <Button type="submit" variant="outline-primary">Зарегистрироваться</Button>
                      </Stack>
                    </fieldset>
                  </Form>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default SignupPage;

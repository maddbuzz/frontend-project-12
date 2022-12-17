import axios from 'axios';
import { withFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';

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

const FormContainer = ({ children }) => (
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
                {children}
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

const MyForm = (props) => {
  const {
    values,
    touched,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    isSubmitting,
    authFailed,
    inputRef,
  } = props;
  return (
    <Form onSubmit={handleSubmit}>
      <h1 className="text-center mb-4">Войти</h1>
      <fieldset disabled={isSubmitting}>
        <Stack gap={4}>
          <FloatingLabel label="Имя пользователя">
            <Form.Control
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.username}
              placeholder="Имя пользователя"
              name="username"
              id="username"
              autoComplete="username"
              isInvalid={touched.username && errors.username}
              ref={inputRef}
            />
            <Form.Control.Feedback type="invalid" tooltip>
              {errors.username}
            </Form.Control.Feedback>
          </FloatingLabel>
          <FloatingLabel label="Пароль">
            <Form.Control
              type="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
              placeholder="Пароль"
              name="password"
              id="password"
              autoComplete="current-password"
              isInvalid={authFailed}
            />
            <Form.Control.Feedback type="invalid" tooltip>
              Неверные имя пользователя или пароль
            </Form.Control.Feedback>
          </FloatingLabel>
          <Button type="submit" variant="outline-primary">Войти</Button>
        </Stack>
      </fieldset>
    </Form>
  );
};

const validationSchema = Yup.object().shape({
  username: Yup.string().trim()
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов')
    .required('Обязательное поле'),
});

const LoginPage = () => {
  const auth = useAuth();
  const [authFailed, setAuthFailed] = useState(false);
  const inputRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    inputRef.current?.focus();
  });

  const MyEnhancedForm = withFormik({
    mapPropsToValues: () => ({
      username: '',
      password: '',
    }),
    validationSchema,
    handleSubmit: async (values) => { // (values, { setSubmitting }) => {
      setAuthFailed(false);
      try {
        const res = await axios.post(paths.loginPath(), values);
        auth.userLogIn(res.data);
        const { from } = location.state || { from: { pathname: '/' } };
        navigate(from);
      } catch (err) {
        //  setSubmitting(false); If async Formik will automatically set isSubmitting to false...
        if (err.isAxiosError) {
          setAuthFailed(true);
          inputRef.current?.select();
          return;
        }
        throw err;
      }
    },
  })(MyForm);

  return (
    <FormContainer>
      <MyEnhancedForm authFailed={authFailed} inputRef={inputRef} />
    </FormContainer>
  );
};

export default LoginPage;

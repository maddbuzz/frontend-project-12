import axios from 'axios';
import { withFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
                <Image src="avatar_1.6084447160acc893a24d.jpg" alt="Регистрация" roundedCircle thumbnail />
              </Col>
              <Col>
                {children}
              </Col>
            </Row>
          </Card.Body>
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
    signupFailed,
    inputRef,
  } = props;
  return (
    <Form onSubmit={handleSubmit}>
      <h1 className="text-center mb-4">Регистрация</h1>
      <fieldset disabled={isSubmitting}>
        <Stack gap={2}>
          <FloatingLabel label="Имя пользователя">
            <Form.Control
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.username}
              placeholder="Имя пользователя"
              name="username"
              id="username"
              autoComplete="username"
              isInvalid={signupFailed || (touched.username && errors.username)}
              ref={inputRef}
            />
            <Form.Control.Feedback type="invalid" tooltip>
              {(signupFailed && 'Такой пользователь уже существует') || errors.username}
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
              isInvalid={touched.password && errors.password}
            />
            <Form.Control.Feedback type="invalid" tooltip>
              {errors.password}
            </Form.Control.Feedback>
          </FloatingLabel>
          <FloatingLabel label="Подтвердите пароль">
            <Form.Control
              type="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.passwordConfirmation}
              placeholder="Подтвердите пароль"
              name="passwordConfirmation"
              id="passwordConfirmation"
              autoComplete="current-passwordConfirmation"
              isInvalid={touched.passwordConfirmation && errors.passwordConfirmation}
            />
            <Form.Control.Feedback type="invalid" tooltip>
              {errors.passwordConfirmation}
            </Form.Control.Feedback>
          </FloatingLabel>
          <Button type="submit" variant="outline-primary">Зарегистрироваться</Button>
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
  password: Yup.string().trim()
    .min(6, 'Не менее 6 символов')
    .required('Обязательное поле'),
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Пароли должны совпадать')
    .required('Обязательное поле'),
});

const SignupPage = () => {
  const auth = useAuth();
  const [signupFailed, setSignupFailed] = useState(false);
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
      passwordConfirmation: '',
    }),
    validationSchema,
    handleSubmit: async (values) => {
      setSignupFailed(false);
      try {
        const res = await axios.post(paths.signupPath(), values);
        auth.userLogIn(res.data);
        const { from } = location.state || { from: { pathname: '/' } };
        navigate(from);
      } catch (err) {
        if (err.isAxiosError) {
          setSignupFailed(true);
          inputRef.current?.select();
          return;
        }
        throw err;
      }
    },
  })(MyForm);

  return (
    <FormContainer>
      <MyEnhancedForm signupFailed={signupFailed} inputRef={inputRef} />
    </FormContainer>
  );
};

export default SignupPage;

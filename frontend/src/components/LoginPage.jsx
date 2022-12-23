import axios from 'axios';
import { withFormik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Stack from 'react-bootstrap/Stack';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import useAuth from '../hooks/index.jsx';
import paths from '../paths.js';

const FormContainer = ({ children, t }) => (
  <Container fluid className="h-100">
    <Row className="justify-content-center align-content-center h-100">
      <Col xs="12" md="8" xxl="6">
        <Card>
          <Card.Body className="p-5">
            <Row>
              <Col className="d-flex align-items-center justify-content-center">
                <Image src="login-image.jpg" alt={t('Login')} roundedCircle thumbnail />
              </Col>
              <Col>
                {children}
              </Col>
            </Row>
          </Card.Body>
          <Card.Footer className="p-4">
            <div className="text-center">
              <span>{t('Don\'t have an account? ')}</span>
              <Link to="/signup">{t('Registration')}</Link>
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
    t,
  } = props;
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <Form onSubmit={handleSubmit}>
      <h1 className="text-center mb-4">{t('Login')}</h1>
      <fieldset disabled={isSubmitting}>
        <Stack gap={4}>
          <FloatingLabel controlId="floatingUsername" label={t('Your nickname')} className="position-relative">
            <Form.Control
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.username}
              placeholder={t('Your nickname')}
              name="username"
              autoComplete="username"
              isInvalid={authFailed || (touched.username && errors.username)}
              ref={inputRef}
            />
            {authFailed && (
              <Form.Control.Feedback type="invalid" tooltip className="position-absolute top-0 start-100">
                {t('Invalid username or password')}
              </Form.Control.Feedback>
            )}
            {errors.username && (
              <Form.Control.Feedback type="invalid" tooltip>
                {t(errors.username)}
              </Form.Control.Feedback>
            )}
          </FloatingLabel>
          <FloatingLabel controlId="floatingPassword" label={t('Password')}>
            <Form.Control
              type="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
              placeholder={t('Password')}
              name="password"
              autoComplete="current-password"
              isInvalid={touched.password && errors.password}
            />
            <Form.Control.Feedback type="invalid" tooltip>
              {t(errors.password)}
            </Form.Control.Feedback>
          </FloatingLabel>
          <Button type="submit" variant="outline-primary">{t('Login')}</Button>
        </Stack>
      </fieldset>
    </Form>
  );
};

const validationSchema = Yup.object().shape({
  username: Yup.string().trim()
    .min(3, 'From 3 to 20 characters')
    .max(20, 'From 3 to 20 characters')
    .required('Required field'),
  password: Yup.string().trim()
    .required('Required field'),
});

const LoginPage = () => {
  const { t } = useTranslation();
  const auth = useAuth();
  const [authFailed, setAuthFailed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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
        if (err.isAxiosError) {
          if (err.response?.status === 401) setAuthFailed(true);
          else toast.error(t('Connection error'));
        }
        throw err;
      } finally {
        // setSubmitting(false); If async Formik will automatically set isSubmitting to false...
      }
    },
  })(MyForm);

  return (
    <FormContainer t={t}>
      <MyEnhancedForm authFailed={authFailed} t={t} />
    </FormContainer>
  );
};

export default LoginPage;

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
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';

import { useAuth } from '../hooks/index.jsx';
import paths from '../paths.js';

const FormContainer = ({ children, t }) => (
  <Container fluid className="h-100">
    <Row className="justify-content-center align-content-center h-100">
      <Col xs="12" md="8" xxl="6">
        <Card>
          <Card.Body className="p-5">
            <Row>
              <Col className="d-flex align-items-center justify-content-center">
                <Image src="avatar_1.6084447160acc893a24d.jpg" alt={t('Registration')} roundedCircle thumbnail />
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
    t,
  } = props;
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <Form onSubmit={handleSubmit}>
      <h1 className="text-center mb-4">{t('Registration')}</h1>
      <fieldset disabled={isSubmitting}>
        <Stack gap={2}>
          <FloatingLabel controlId="floatingUsername" label={t('Username')} className="position-relative">
            <Form.Control
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.username}
              placeholder={t('Username')}
              name="username"
              autoComplete="username"
              isInvalid={signupFailed || (touched.username && errors.username)}
              ref={inputRef}
            />
            {signupFailed && (
              <Form.Control.Feedback type="invalid" tooltip className="position-absolute top-0 start-100">
                {t('This user already exists')}
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
          <FloatingLabel controlId="floatingPasswordConfirmation" label={t('Confirm the password')}>
            <Form.Control
              type="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.passwordConfirmation}
              placeholder={t('Confirm the password')}
              name="passwordConfirmation"
              autoComplete="current-passwordConfirmation"
              isInvalid={touched.passwordConfirmation && errors.passwordConfirmation}
            />
            <Form.Control.Feedback type="invalid" tooltip>
              {t(errors.passwordConfirmation)}
            </Form.Control.Feedback>
          </FloatingLabel>
          <Button type="submit" variant="outline-primary">{t('Register')}</Button>
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
    .min(6, 'At least 6 characters')
    .required('Required field'),
  passwordConfirmation: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required field'),
});

const useSubmit = (setSignupFailed, t) => {
  const auth = useAuth();
  const navigate = useNavigate();

  return async (values) => {
    setSignupFailed(false);
    try {
      const res = await axios.post(paths.signupApiPath(), values);
      auth.userLogIn(res.data);
      navigate(paths.chatPagePath());
    } catch (err) {
      if (!err.isAxiosError) throw err;
      console.error(err);
      if (err.response?.status === 409) setSignupFailed(true);
      else toast.error(t('Connection error'));
    } finally {
      // setSubmitting(false); If async Formik will automatically set isSubmitting to false...
    }
  };
};

const SignupPage = () => {
  const { t } = useTranslation();
  const [signupFailed, setSignupFailed] = useState(false);

  const MyEnhancedForm = withFormik({
    mapPropsToValues: () => ({
      username: '',
      password: '',
      passwordConfirmation: '',
    }),
    validationSchema,
    handleSubmit: useSubmit(setSignupFailed, t),
  })(MyForm);

  return (
    <FormContainer t={t}>
      <MyEnhancedForm signupFailed={signupFailed} t={t} />
    </FormContainer>
  );
};

export default SignupPage;

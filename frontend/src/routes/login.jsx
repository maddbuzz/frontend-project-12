import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
  userName: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  password: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
});

const Login = () => (
  <div>
    <h1>Войти</h1>
    <Formik
      initialValues={{
        userName: '',
        password: '',
      }}
      validationSchema={LoginSchema}
      onSubmit={(values) => {
        // same shape as initial values
        console.log(values);
      }}
    >
      {({ errors, touched }) => (
        <Form>
          <div>
            <Field
              name="userName"
              placeholder="Ваш ник"
            />
            {errors.userName && touched.userName && <div>{errors.userName}</div>}
          </div>
          <div>
            <Field
              name="password"
              placeholder="Пароль"
            />
            {errors.password && touched.password && <div>{errors.password}</div>}
          </div>
          <button type="submit">Войти</button>
        </Form>
      )}
    </Formik>
  </div>
);

export default Login;

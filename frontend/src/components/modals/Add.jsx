import { useFormik } from 'formik';
import _map from 'lodash/map.js';
import React, { useEffect, useRef } from 'react';
import * as Yup from 'yup';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Stack from 'react-bootstrap/Stack';

const validationSchema = Yup.object().shape({
  channelName: Yup.string().trim()
    .min(3, 'От 3 до 20 символов')
    .max(20, 'От 3 до 20 символов')
    .required('Обязательное поле')
    .notOneOf([Yup.ref('channelNames')], 'Должно быть уникальным'),
  channelNames: Yup.array(),
});

const Add = ({ socketEmitPromise: newChannelPromise, onHide, channels }) => {
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  });

  const f = useFormik({
    initialValues: { channelName: '', channelNames: _map(channels, 'name') },
    validationSchema,
    onSubmit: async (values) => { // , { setSubmitting }) => {
      try {
        await newChannelPromise(values.channelName);
        onHide();
      } catch (error) {
        console.error(error);
        // inputRef.current.select();
      }
    },
  });

  return (
    <Modal show centered onHide={onHide} keyboard>
      <Modal.Header closeButton>
        <Modal.Title>Добавить канал</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={f.handleSubmit}>
          <fieldset disabled={f.isSubmitting}>
            <Stack gap={2}>
              <Form.Group className="position-relative">
                <Form.Control
                  ref={inputRef}
                  onChange={f.handleChange}
                  // onBlur={f.handleBlur}
                  value={f.values.channelName}
                  data-testid="input-channelName"
                  name="channelName"
                  isInvalid={f.touched.channelName && f.errors.channelName}
                />
                <Form.Control.Feedback type="invalid" tooltip className="position-absolute">
                  {f.errors.channelName}
                </Form.Control.Feedback>
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button onClick={onHide} variant="secondary" className="me-2">Отменить</Button>
                <Button type="submit" variant="primary">Отправить</Button>
              </div>
            </Stack>
          </fieldset>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Add;

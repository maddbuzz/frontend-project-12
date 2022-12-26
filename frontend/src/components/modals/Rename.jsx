import { useFormik } from 'formik';
import React, { useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Stack from 'react-bootstrap/Stack';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

import { useChatApi } from '../../hooks/index.jsx';

const getValidationSchema = (channelNames) => Yup.object().shape({
  channelName: Yup.string().trim()
    .min(3, 'From 3 to 20 characters')
    .max(20, 'From 3 to 20 characters')
    .required('Required field')
    .notOneOf(channelNames, 'Must be unique'),
});

const Rename = ({ modalInfo: { item: channel }, onHide, channels }) => {
  const chatApi = useChatApi();

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  });
  useEffect(() => {
    inputRef.current.select();
  }, []);

  const channelNames = channels.map(({ name }) => name);
  const formik = useFormik({
    initialValues: { channelName: channel.name },
    validationSchema: getValidationSchema(channelNames),
    onSubmit: async (values) => { // , { setSubmitting }) => {
      try {
        await chatApi.renameChannel({ id: channel.id, name: values.channelName });
        onHide();
      } catch (err) {
        console.error(err);
      } finally {
        // setSubmitting(false); If async Formik will automatically set isSubmitting to false...
      }
    },
  });

  const { t } = useTranslation();

  return (
    <Modal show centered onHide={onHide} keyboard>
      <Modal.Header closeButton>
        <Modal.Title>{t('Rename channel')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={formik.handleSubmit}>
          <fieldset disabled={formik.isSubmitting}>
            <Stack gap={2}>
              <Form.Group controlId="formChannelName" className="position-relative">
                <Form.Label visuallyHidden>{t('Channel name')}</Form.Label>
                <Form.Control
                  ref={inputRef}
                  onChange={formik.handleChange}
                  // onBlur={f.handleBlur}
                  value={formik.values.channelName}
                  data-testid="input-channelName"
                  name="channelName"
                  isInvalid={formik.touched.channelName && formik.errors.channelName}
                />
                <Form.Control.Feedback type="invalid" tooltip className="position-absolute">
                  {t(formik.errors.channelName)}
                </Form.Control.Feedback>
              </Form.Group>
              <div className="d-flex justify-content-end">
                <Button onClick={onHide} variant="secondary" className="me-2">{t('Cancel')}</Button>
                <Button type="submit" variant="primary">{t('Send')}</Button>
              </div>
            </Stack>
          </fieldset>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Rename;

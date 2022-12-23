/* eslint-disable react/forbid-prop-types */
import { useFormik } from 'formik';
import _map from 'lodash/map.js';
import React, { useEffect, useRef } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Stack from 'react-bootstrap/Stack';
import { useTranslation } from 'react-i18next';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  channelName: Yup.string().trim()
    .min(3, 'From 3 to 20 characters')
    .max(20, 'From 3 to 20 characters')
    .required('Required field')
    .notOneOf([Yup.ref('channelNames')], 'Must be unique'),
  channelNames: Yup.array(),
});

const Rename = ({
  modalInfo: { item: channel },
  socketEmitPromise: renameChannelPromise,
  onHide, channels,
}) => {
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  });
  useEffect(() => {
    inputRef.current.select();
  }, []);

  const f = useFormik({
    initialValues: { channelName: channel.name, channelNames: _map(channels, 'name') },
    validationSchema,
    onSubmit: async (values) => { // , { setSubmitting }) => {
      try {
        await renameChannelPromise(channel.id, values.channelName);
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
        <Form onSubmit={f.handleSubmit}>
          <fieldset disabled={f.isSubmitting}>
            <Stack gap={2}>
              <Form.Group controlId="formChannelName" className="position-relative">
                <Form.Label visuallyHidden>{t('Channel name')}</Form.Label>
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
                  {t(f.errors.channelName)}
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

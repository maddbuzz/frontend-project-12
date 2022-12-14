import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { useTranslation } from 'react-i18next';

import { useChatApi } from '../../hooks/index.jsx';

const Remove = ({ modalInfo: { item: channel }, onHide }) => {
  const chatApi = useChatApi();
  const [isSubmitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await chatApi.removeChannel({ id: channel.id });
      onHide();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const { t } = useTranslation();

  return (
    <Modal show centered onHide={onHide} keyboard>
      <Modal.Header closeButton>
        <Modal.Title>{t('Delete channel')}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="lead">{t('Are you sure?')}</p>
        <Form onSubmit={onSubmit}>
          <fieldset disabled={isSubmitting}>
            <div className="d-flex justify-content-end">
              <Button onClick={onHide} variant="secondary" className="me-2">{t('Cancel')}</Button>
              <Button type="submit" variant="danger">{t('Delete')}</Button>
            </div>
          </fieldset>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Remove;

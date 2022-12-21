import React, { useState } from 'react';

import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';

const Remove = ({
  modalInfo: { item: channel },
  socketEmitPromise: removeChannelPromise,
  onHide,
}) => {
  const [isSubmitting, setSubmitting] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await removeChannelPromise(channel.id);
      onHide();
    } catch (error) {
      console.error(error);
    }
    setSubmitting(false);
  };

  return (
    <Modal show centered onHide={onHide} keyboard>
      <Modal.Header closeButton>
        <Modal.Title>Удалить канал</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="lead">Уверены?</p>
        <Form onSubmit={onSubmit}>
          <fieldset disabled={isSubmitting}>
            <div className="d-flex justify-content-end">
              <Button onClick={onHide} variant="secondary" className="me-2">Отменить</Button>
              <Button type="submit" variant="danger">Удалить</Button>
            </div>
          </fieldset>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default Remove;

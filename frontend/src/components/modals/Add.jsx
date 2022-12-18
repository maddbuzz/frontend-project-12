import { useFormik } from 'formik';
import React, { useState, useEffect, useRef } from 'react';

import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import Modal from 'react-bootstrap/Modal';

const Add = ({ channelAction, onHide }) => {
  const [error, setError] = useState(null);

  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const f = useFormik({
    initialValues: { channelName: '' },
    onSubmit: (values) => {
      const err = channelAction({ name: values.channelName });
      setError(err);
      if (err) inputRef.current.select();
      else onHide();
    },
  });

  return (
    <Modal show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Add</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={f.handleSubmit}>
          <FormGroup>
            <FormControl
              required
              ref={inputRef}
              onChange={f.handleChange}
              onBlur={f.handleBlur}
              value={f.values.channelName}
              data-testid="input-channelName"
              name="channelName"
              isInvalid={error}
            />
            <FormControl.Feedback type="invalid" tooltip>
              {error}
            </FormControl.Feedback>
          </FormGroup>
          <input type="submit" className="btn btn-primary mt-2" value="submit" />
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Add;

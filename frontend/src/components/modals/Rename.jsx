import React, { useEffect, useRef } from 'react';
import { useFormik } from 'formik';

import FormControl from 'react-bootstrap/FormControl';
import FormGroup from 'react-bootstrap/FormGroup';
import Modal from 'react-bootstrap/Modal';

// BEGIN
const generateOnSubmit = ({ modalInfo, setItems, onHide }) => (values) => {
  setItems((items) => {
    const item = items.find((i) => i.id === modalInfo.item.id);
    item.body = values.body;
  });
  onHide();
};

const Rename = (props) => {
  const { onHide, modalInfo } = props;
  const { item } = modalInfo;
  const f = useFormik({ onSubmit: generateOnSubmit(props), initialValues: item });
  const inputRef = useRef();
  useEffect(() => {
    inputRef.current.select();
  }, []);

  return (
    <Modal show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Rename</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={f.handleSubmit}>
          <FormGroup>
            <FormControl
              required
              ref={inputRef}
              onChange={f.handleChange}
              onBlur={f.handleBlur}
              value={f.values.body}
              data-testid="input-body"
              name="body"
            />
          </FormGroup>
          <input type="submit" className="btn btn-primary mt-2" value="submit" />
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Rename;
// END

import React from 'react';

import FormGroup from 'react-bootstrap/FormGroup';
import Modal from 'react-bootstrap/Modal';

// BEGIN
const generateOnSubmit = ({ modalInfo, setItems, onHide }) => (e) => {
  e.preventDefault();
  setItems((items) => items.filter((i) => i.id !== modalInfo.item.id));
  onHide();
};

const Remove = (props) => {
  const { onHide } = props;
  const onSubmit = generateOnSubmit(props);

  return (
    <Modal show>
      <Modal.Header closeButton onHide={onHide}>
        <Modal.Title>Remove</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <form onSubmit={onSubmit}>
          <FormGroup>
            <input type="submit" className="btn btn-danger mt-2" value="remove" />
          </FormGroup>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default Remove;
// END

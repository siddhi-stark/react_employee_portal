import React from 'react';
import { Modal } from 'react-bootstrap';

export default function ModalComponent(props) {
  const { show, size, id, label, onClick, modalBody, modalFooter, centered } = props;

  return (
    <>
      <Modal
        size={size}
        show={show}
        centered={centered}
        onClick={(e) => {
          if (onClick) onClick(e);
        }}
      >
        <Modal.Header>
          <Modal.Title id={id}>{label}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalBody}</Modal.Body>
        <Modal.Footer>{modalFooter}</Modal.Footer>
      </Modal>
    </>
  );
}

import React from 'react';
import { Modal } from 'react-bootstrap';

export default function ModalComponent(props) {
  const {
    show,
    size,
    id,
    label,
    onClick,
    modalBody,
    modalFooter,
    centered,
    closebutton,
    className,
  } = props;

  return (
    <>
      <Modal
        className={className}
        size={size}
        show={show}
        centered={centered}
        onClick={(e) => {
          if (onClick) onClick(e);
        }}
      >
        <Modal.Header closeButton={closebutton}>
          <Modal.Title id={id}>{label}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalBody}</Modal.Body>
        <Modal.Footer>{modalFooter}</Modal.Footer>
      </Modal>
    </>
  );
}

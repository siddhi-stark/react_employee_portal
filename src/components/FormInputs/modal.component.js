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
    onHide,
    className,
  } = props;

  return (
    <>
      <Modal
        className={className}
        size={size}
        show={show}
        onHide={onHide}
        centered={centered}
        onClick={(e) => {
          if (onClick) onClick(e);
        }}
      >
        <div className="add-task-popup">
          <Modal.Header closeButton>
            <Modal.Title id={id}>
              <div className="title">
                <h2>{label}</h2>
              </div>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>{modalBody}</Modal.Body>
          {modalFooter && <Modal.Footer>{modalFooter}</Modal.Footer>}
        </div>
      </Modal>
    </>
  );
}

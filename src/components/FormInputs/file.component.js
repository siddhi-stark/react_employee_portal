import React from 'react';
import { Form } from 'react-bootstrap';

export default function FileComponent(props) {
  const { label, id, onSelectFile, custom, title, type, className } = props;

  return (
    <>
      <Form.Group>
        <Form.File.Label>{title}</Form.File.Label>
        <Form.File
          id={id}
          className={className}
          type={type}
          onChange={(e) => {
            if (onSelectFile) onSelectFile(e);
          }}
          label={label}
          custom={custom}
        />
      </Form.Group>
    </>
  );
}

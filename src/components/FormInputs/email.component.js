import React from 'react';
import { Form } from 'react-bootstrap';

export default function EmailComponent(props) {
  const { label, value, onChangeEmail, name, placeholder, type, className } =
    props;

  return (
    <>
      <Form.Group>
        <Form.Label>{label}</Form.Label>
        <Form.Control
          value={value}
          onChange={(e) => {
            if (onChangeEmail) onChangeEmail(e);
          }}
          name={name}
          type={type}
          placeholder={placeholder}
          className={className}
        />
      </Form.Group>
    </>
  );
}

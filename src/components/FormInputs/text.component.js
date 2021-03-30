import React from 'react';
import { Form } from 'react-bootstrap';

export default function TextComponent(props) {
  const {
    label,
    placeholder,
    id,
    value,
    onInputChange,
    name,
    className,
  } = props;

  return (
    <>
      <Form.Group>
        <Form.Label>{label}</Form.Label>
        <Form.Control
          id={id}
          value={value}
          onChange={(e) => {
            if (onInputChange) onInputChange(e);
          }}
          name={name}
          placeholder={placeholder}
          className={className}
        />
      </Form.Group>
    </>
  );
}

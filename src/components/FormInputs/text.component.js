import React from 'react';
import { Form, Image, InputGroup } from 'react-bootstrap';

export default function TextComponent(props) {
  const {
    label,
    placeholder,
    id,
    value,
    onInputChange,
    name,
    inputClass,
    inputIcon,
    type,
    containerClass,
    inputVarible,
    errorMessage,
  } = props;

  return (
    <>
      {console.log(errorMessage)}
      <Form.Group className={containerClass}>
        {label ? <Form.Label> {label} </Form.Label> : ''}
        {inputIcon ? <Image src={inputIcon} rounded /> : ''}
        {inputVarible ? (
          <InputGroup.Prepend>{inputVarible}</InputGroup.Prepend>
        ) : (
          ''
        )}
        <Form.Control
          id={id}
          value={value}
          onChange={(e) => {
            if (onInputChange) onInputChange(e);
          }}
          name={name}
          type={type}
          placeholder={placeholder}
          className={inputClass}
        />
        <p style={{ color: 'red' }}> {errorMessage} </p>
      </Form.Group>
    </>
  );
}

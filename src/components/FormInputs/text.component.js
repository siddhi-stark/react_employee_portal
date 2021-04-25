import React from 'react';
import { Form, Image, InputGroup } from 'react-bootstrap';

export default function TextComponent(props) {
  const {
    label,
    placeholder,
    id,
    image,
    value,
    onInputChange,
    name,
    inputClass,
    inputIcon,
    type,
    progressClass,
    containerClass,
    inputVarible,
    errorMessage,
  } = props;

  return (
    <>
     
        {label ? <Form.Label> {label} </Form.Label> : ''}
        {inputIcon ? <Image src={inputIcon} rounded /> : ''}
        {inputVarible ? (
          <InputGroup.Prepend>{inputVarible}</InputGroup.Prepend>
        ) : (
          ''
        )}
        <Form.Group className={containerClass}>
        <Form.Control
          progressClass={progressClass}
          id={id}
          value={value}
          onChange={(e) => {
            if (onInputChange) onInputChange(e);
          }}
          image={<Image src={image} rounded />}
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

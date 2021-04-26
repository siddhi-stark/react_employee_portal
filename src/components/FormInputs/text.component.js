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
    labelIcon,
    asterisk,
  } = props;

  return (
    <>
      {label ? (
        <Form.Label>
          {' '}
          {labelIcon ? <Image src={labelIcon} /> : ''} {label}
          <span style={{ color: 'red' }}>{asterisk}</span>{' '}
        </Form.Label>
      ) : (
        ''
      )}
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

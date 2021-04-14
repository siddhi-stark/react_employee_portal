/* eslint no-unneeded-ternary: "error" */
import React from 'react';
import { Form, InputGroup, Image } from 'react-bootstrap';

export default function InputComponent(props) {
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
    maxlength,
    containerClass,
    inputVarible,
    errorMessage,
    disabled,
    multiple,
    rows,
    as,
    asterisk,
    accept,
  } = props;

  return (
    <>
      <Form.Group className={containerClass}>
        {label && (
          <Form.Label>
            {' '}
            {label} <span style={{ color: 'red' }}>{asterisk}</span>{' '}
          </Form.Label>
        )}
        <InputGroup>
          {inputVarible && (
            <InputGroup.Prepend>
              <InputGroup.Text>{inputVarible}</InputGroup.Text>
            </InputGroup.Prepend>
          )}
          {inputIcon && <Image src={inputIcon} rounded />}
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
            disabled={disabled}
            maxlength={maxlength}
            multiple={multiple}
            accept={accept}
            rows={rows}
            as={as}
          />
        </InputGroup>
        <p style={{ color: 'red' }}> {errorMessage} </p>
      </Form.Group>
    </>
  );
}

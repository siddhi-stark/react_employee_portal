/* eslint no-unneeded-ternary: "error" */
import React, { useState } from 'react';
import { InputGroup } from 'react-bootstrap';
import TextInput from './text.component';

export default function PasswordComponent(props) {
  const [switchItem, setSwitchItem] = useState(false);

  const {
    label,
    placeholder,
    id,
    value,
    onInputChange,
    name,
    type,
    containerClass,
    errorMessage,
    minlength,
    asterisk,
    switchElement,
  } = props;

  const handlePasswordView = (e) => {
    e.preventDefault();
    setSwitchItem(!switchItem);
  };

  return (
    <>
      <InputGroup className="change-password-type">
        <TextInput
          onInputChange={onInputChange}
          name={name}
          containerClass={containerClass}
          label={label}
          value={value}
          minlength={minlength}
          type={switchItem ? 'text' : type}
          asterisk={asterisk}
          placeholder={placeholder}
          id={id}
          errorMessage={errorMessage}
        />
        {switchElement && (
          <InputGroup.Append>
            <InputGroup.Text>
              <a href="javascipt:;" onClick={handlePasswordView}>
                {' '}
                <img
                  src={
                    switchItem ? '/images/visibility.svg' : '/images/eye.svg'
                  }
                  alt="Username"
                />{' '}
              </a>
            </InputGroup.Text>
          </InputGroup.Append>
        )}
      </InputGroup>
    </>
  );
}

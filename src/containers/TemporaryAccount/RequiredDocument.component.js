/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Col, Button, Form } from 'react-bootstrap';
import swal from 'sweetalert';
import { TextInput } from '../../components/FormInputs';
import TemporaryAccount from './temporaryAccount.component';
import customFunctions from '../../helper/customFunctions';

function RequiredDocument(props) {
  let matchUrltoken = props.match.params.token; // eslint-disable-line
  JSON.parse(customFunctions.getLocalStorage('candidateData'));

  const [isBtnClicked, setIsBtnClicked] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    const tempToken = sessionStorage.getItem('tempAccountToken');
    const tempPass = sessionStorage.getItem('passWord');
    if (tempToken && tempPass) {
      addPassword();
      setPassword(tempPass);
      matchUrltoken = tempToken;
    }
  }, [matchUrltoken]);

  useEffect(() => {
    sessionStorage.setItem('tempAccountToken', matchUrltoken);
  }, []);

  const addPassword = () => {
    setIsBtnClicked(true);
  };

  const onSubmit = (e) => {
    sessionStorage.setItem('passWord', password);
    e.preventDefault();
    if (password !== '') {
      addPassword();
    } else {
      swal('Please enter the password provided in the link.', '', 'error');
    }
  };
  return (
    <>
      {isBtnClicked ? (
        <TemporaryAccount
          password={password}
          token={matchUrltoken}
          callback={(isHide) => {
            if (isHide == true) {
              setIsBtnClicked(false);
            }
          }}
        />
      ) : (
        <>
          <div className="login-page d-flex align-items-center justify-content-center flex-column">
            <div className="logo text-center">
              <a href="#">
                <img
                  src="/images/logo-black.svg"
                  className="header-brand-img desktop-logo svg"
                  alt="img"
                />
              </a>
            </div>
            <div className="Required-Document">
              <h5>
                <strong>List of Required Document</strong>
              </h5>
              <h6>
                1. <strong>Personal Document</strong>
              </h6>
              <ul>
                <li>Adhar Card</li>
                <li>PAN Card</li>
              </ul>
              <h6>
                2. <strong>Educational Document</strong>
              </h6>
              <ul>
                <li>SSC</li>
                <li>HSC</li>
              </ul>

              <Col md={12}>
                <Form
                  onSubmit={(e) => {
                    onSubmit(e);
                  }}
                >
                  <TextInput
                    onInputChange={(e) => setPassword(e.target.value)}
                    label="Password"
                    autocomplete="off"
                    containerClass="form-group"
                    type="password"
                    value={password}
                    name="passwordTitle"
                    placeholder="Enter Password"
                  />
                  <Button type="submit">Submit</Button>
                </Form>
              </Col>
            </div>
          </div>
        </>
      )}
    </>
  );
}
export default withRouter(RequiredDocument);

import React, { useState, useRef, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import { PasswordInput, Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import customFunctions from '../../helper/customFunctions';

const items = [
  { to: '/', label: 'Home' },
  { to: '/change-password', label: 'Change Password' },
];

function ManagePassword() {
  const history = useHistory();
  const validator = useRef(
    new SimpleReactValidator({
      messages: {
        in: 'Passwords need to match!',
      },
    })
  );
  const [password, setPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [count, forceUpdate] = useState(0);
  const [title, setTitle] = useState('');
  const [disableButton, setDisableButton] = useState(false);

  useEffect(() => {
    setTitle('Change Password');
  }, []);

  const setNewPassword = async () => {
    const payload = {
      old_password: oldPassword,
      password,
      confirm_password: confirmPassword,
    };

    const postData = customFunctions.cleanObject(payload);

    const { data, message } = await AuthApi.postDataToServer(
      `${Api.changePasswordUrl}`,
      postData
    );
    if (data) {
      swal(data && data.message[0], '', 'success').then((result) => {
        if (result) {
          validator.current.hideMessages();
          history.push('/');
        }
      });
    } else {
      swal(message, '', 'error');
    }
  };

  const validateForm = (e) => {
    e.preventDefault();
    if (disableButton) return;

    setDisableButton(true);
    if (validator.current.allValid()) {
      setNewPassword();
    } else {
      validator.current.showMessages();
      forceUpdate(count + 1);
      setDisableButton(false);
    }
  };

  return (
    <>
      <Helmet title={title} />
      <div className="page-header">
        <div className="title-breadcrumb-section">
          <h2 className="main-content-title tx-24 mg-b-5">Change Password</h2>
          <Breadcrumb items={items} />
        </div>
      </div>
      <section className="content-area">
        <div className="mt-5">
          <Card>
            <Card.Header>
              <h4 className="text-primary mt-2 mb-2">Change Password</h4>
            </Card.Header>
            <Card.Body>
              <Form autoComplete="off" onSubmit={(e) => validateForm(e)}>
                <Row>
                  <Col className="col-md-4">
                    <PasswordInput
                      onInputChange={(e) => setOldPassword(e.target.value)}
                      name="oldPassword"
                      containerClass="form-group"
                      label="Old Password"
                      value={oldPassword}
                      type="password"
                      asterisk="*"
                      placeholder="Old Password"
                      errorMessage={validator.current.message(
                        'oldPassword',
                        oldPassword,
                        'required',
                        {
                          className: 'text-danger',
                        }
                      )}
                      switchElement="true"
                    />
                  </Col>
                  <Col className="col-md-4">
                    <PasswordInput
                      onInputChange={(e) => setPassword(e.target.value)}
                      name="password"
                      containerClass="form-group"
                      inputClass="form-control"
                      label="Password"
                      asterisk="*"
                      value={password}
                      type="password"
                      placeholder="Password"
                      errorMessage={validator.current.message(
                        'Password',
                        password,
                        'required',
                        {
                          className: 'text-danger',
                        }
                      )}
                      switchElement="true"
                    />
                  </Col>
                  <Col className="col-md-4">
                    <PasswordInput
                      onInputChange={(e) => setConfirmPassword(e.target.value)}
                      name="confirmPassword"
                      containerClass="form-group"
                      inputClass="form-control"
                      label="Confirm Password"
                      asterisk="*"
                      value={confirmPassword}
                      type="password"
                      placeholder="Confirm Password"
                      errorMessage={validator.current.message(
                        'confirmPassword',
                        confirmPassword,
                        `required|in:${password}`,
                        {
                          className: 'text-danger',
                        }
                      )}
                      switchElement="true"
                    />
                  </Col>
                </Row>
                <div className="d-flex align-items-center justify-content-end">
                  <Button variant="secondary" onClick={() => history.push('/')}>
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    className="ms-4"
                    disabled={disableButton}
                  >
                    Save
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </section>
    </>
  );
}
export default withRouter(ManagePassword);

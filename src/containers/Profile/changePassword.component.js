import React, { useState, useRef, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';
import AuthApi from '../../helper/authApi';
import Api from '../../helper/api';
import { TextInput, Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';

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

  useEffect(() => {
    setTitle('Change Password');
  }, []);

  const setNewPassword = async () => {
    const payload = {
      old_password: oldPassword,
      password,
      confirm_password: confirmPassword,
    };
    const { data, message } = await AuthApi.postDataToServer(
      `${Api.changePasswordUrl}`,
      payload
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

  const validateForm = async (e) => {
    e.preventDefault();
    if (validator.current.allValid()) {
      setNewPassword();
    } else {
      validator.current.showMessages();
      forceUpdate(count + 1);
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
              <Form autoComplete="off">
                <Row>
                  <Col className="col-md-4">
                    <TextInput
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
                    />
                  </Col>
                  <Col className="col-md-4">
                    <TextInput
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
                    />
                  </Col>
                  <Col className="col-md-4">
                    <TextInput
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
                    onClick={(e) => validateForm(e)}
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

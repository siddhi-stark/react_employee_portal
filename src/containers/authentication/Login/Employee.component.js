import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import SimpleReactValidator from 'simple-react-validator';
import { Row, Col } from 'react-bootstrap';
import { TextInput } from '../../../components/FormInputs';

const validator = new SimpleReactValidator();

function Employee() {
  const initialState = {
    email: '',
    password: '',
    remember: false,
  };
  const [userData, setUserData] = useState(initialState);

  const handleInputChange = (event) => {
    const isChecked = event.target.checked;
    const { name, value } = event.target;
    setUserData((inputValues) => {
      return { ...inputValues, [name]: value, remember: isChecked };
    });
  };

  return (
    <>
      <h6>Employee</h6>
      <Row>
        <Col sm={4}>
          <TextInput
            onInputChange={(e) => handleInputChange(e)}
            name="email"
            inputIcon="images/user.svg"
            // containerClass="form-group"
            // inputClass="form-control form-control-lg"
            value={userData.email}
            placeholder="Username"
            errorMessage={validator.message(
              'email',
              userData.email,
              'required|name'
            )}
          />
        </Col>
      </Row>
    </>
  );
}

export default withRouter(Employee);

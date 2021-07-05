import React from 'react';
import { withRouter } from 'react-router-dom';
import { Col, Form, Button } from 'react-bootstrap';
import {
  Datepicker,
  DropdownInput,
} from '../../components/FormInputs';

function Confirmation() {
	return (
<>
<div>
<p>Employee Name</p>
<section className="content-area">

 <Form>
<Col md={4}>
<Datepicker
                  label="Joining Date"
                  className="form-control"
                  // selected={joiningDate}
                  placeholder="dd/mm/yyyy"
                  // maxDate={maxdate}
                  dateFormat="dd/MM/yyyy"
                  // maxDate={new Date()}
                  // onChange={(e) => {
                  //   setJoiningDate(e);
                  // }}
                  // errorMessage={validator.message(
                  //   'Joining Date',
                  //   joiningDate,
                  //   'required'
                  // )}
                />
</Col> 

<Col md={4}>
<DropdownInput
                  label="Designation"
                  placeholder="Select Designation"
                  // defaultValue={selectedDesignationOption}
                  // onSelectHandler={(select) => {
                  //   setSelectedDesignationOption(select);
                  // }}
                  // errorMessage={validator.message(
                  //   'Designation',
                  //   selectedDesignationOption,
                  //   'required'
                  // )}
                />
</Col> 
<Col md={4}>
 <textarea className="form-control" placeholder="Enter Some Note Here..." type="textarea" id="example-text-input" style={{ 'resize': 'none' }} rows="9" cols="90"  />
</Col>

<div className="justify-content-left mt-4">
              <Button variant="primary">
                Save
              </Button>

              <Button
                variant="primary"
                type="submit"
                className="ms-4"
              >
               Preview and Send
              </Button>
            </div>
 </Form>
</section>



</div>
</>
		)
}

export default withRouter(Confirmation);
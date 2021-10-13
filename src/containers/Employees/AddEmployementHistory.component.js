import React from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Tabs, Tab, Button } from 'react-bootstrap';
import { Helmet } from '../../components/FormInputs';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Personal from '../TemporaryAccount/personal.component';
import EducationalDetails from '../TemporaryAccount/educational.component';
import EmployementHistory from '../TemporaryAccount/employementHistory.component';
import PreviousEmployement from '../TemporaryAccount/previousEmployement.component';

function AddEmployementHistory(props) {
  const title = 'Employement History';
  const items = [{ to: '/', label: 'Home' }, { label: 'Employment History' }];
  const history = useHistory();
  const employee = props;
  const employeeId = employee.match.params.ID;
  console.log('employeeId',employeeId);

	return (
		<>
		 <Helmet title={title} />
      <div className="title-breadcrumb-section">
        <Button 
        className="float-end" 
        onClick={()=> {
          history.push('/employees') // eslint-disable-line
        }}  
        >Back</Button>
        <h2 className="main-content-title tx-24 mg-b-5">Employement History</h2>
        <Breadcrumb items={items} />
			<section className="content-area">
				<div>
					<Tabs defaultActiveKey="Personal">
						<Tab eventKey="Personal" title="Personal Documents">
							<div className="row ml-2">
								<Personal
								ID={employeeId}
								 />
								}
							</div>
						</Tab>
						<Tab eventKey="currentEmployee" title="Educational Documents">
							<div className="row ml-2">
								<EducationalDetails />
							</div>
						</Tab>

						<Tab eventKey="employmentHistory" title="Employment History">
							<div className="row ml-2">
								<EmployementHistory />
							</div>
						</Tab>

						<Tab eventKey="previousEmployment" title="Previous Employment">
							<div className="row ml-2">
								<PreviousEmployement />
							</div>
						</Tab>
					</Tabs>
				</div>
			</section>
			</div>
		</>
	);
}

export default withRouter(AddEmployementHistory);

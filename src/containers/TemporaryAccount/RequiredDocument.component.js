import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Col, Button } from 'react-bootstrap';
import { TextInput } from '../../components/FormInputs';
// import Api from '../../helper/api';
// import AuthApi from '../../helper/authApi';
import TemporaryAccount from './temporaryAccount.component';
import customFunctions from '../../helper/customFunctions';

function RequiredDocument(props) {
	const matchUrltoken = props.match.params.token; // eslint-disable-line
	JSON.parse(customFunctions.getLocalStorage('candidateData'));
	// const [token, setToken] = useState(null);
	// const dispatch = useDispatch();
	const [isBtnClicked, setIsBtnClicked] = useState(false);
	const [password, setPassword] = useState('');

	return (
		<>
			{isBtnClicked ? (
				<TemporaryAccount password={password} token={matchUrltoken} />
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
							</Col>
							<Button onClick={() => setIsBtnClicked(true)}>Submit</Button>
						</div>
					</div>
				</>
			)}
		</>
	);
}
export default withRouter(RequiredDocument);

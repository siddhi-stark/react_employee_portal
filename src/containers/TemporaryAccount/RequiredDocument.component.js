import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { Col, Button } from 'react-bootstrap';
import { TextInput } from '../../components/FormInputs';
// import Api from '../../helper/api';
// import AuthApi from '../../helper/authApi';
import TemporaryAccount from './temporaryAccount.component';

function RequiredDocument(props) {
		const matchUrltoken = props.match.params.token; // eslint-disable-line
	// const [token, setToken] = useState(null);
	// const dispatch = useDispatch();
const [isBtnClicked,setIsBtnClicked] = useState(false);
const [password,setPassword] = useState('');
	// const verifyToken = async (tkn) => {
	// 	console.log('tkn',tkn);
	// 	const { data } = await AuthApi.getDataFromServer(
	// 		`${Api.temporaryAccountUrl}?token=${tkn}`
	// 	);
	// 	if (data) {
	// 		// setEmail(data.data.email);
	// 		console.log('data', data);
	// 	}
	// 	if (!data) {
	// 		console.log('data', data);
	// 		swal('Token is invalid', '', 'error');
	// 		// props.history.push('/login');
	// 	}
	// };

	// useEffect(() => {
	// 	console.log('token', token);
	// 	dispatch({ type: 'LOGIN', value: false });
	// 	const matchUrltoken = props.match.params.token;
	// 	console.log('matchUrltoken', matchUrltoken);
	// 	setToken(matchUrltoken);
	// 	if (!matchUrltoken) {
	// 		window.location = '/login';
	// 		console.log('toeknnnnnnnnnn');
	// 	}
	// 	verifyToken(matchUrltoken);
	// }, [dispatch]);


	return (
		<>
			{isBtnClicked ?  (
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
			</div>
			<h5>
				<strong>List of Required Document</strong>
			</h5>
			<h6>
				1. <strong>Personal Document</strong> <br /> Adhar Card <br />
				PAN Card <br />
				2. <strong>Education Document</strong> <br /> SSC <br />
				HSC
			</h6>
			<Col md={4}>
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
			<Button onClick={() => setIsBtnClicked(true)} >Submit</Button>
			</>

				)}
		</>
	);
}
export default withRouter(RequiredDocument);
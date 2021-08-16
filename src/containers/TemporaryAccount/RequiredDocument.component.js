import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Col, Button } from 'react-bootstrap';
import swal from 'sweetalert';
import { TextInput } from '../../components/FormInputs';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import TemporaryAccount from './temporaryAccount.component';

function RequiredDocument(props) {
	const [token, setToken] = useState(null);
	const dispatch = useDispatch();
const [isBtnClicked,setIsBtnClicked] = useState(false);

	const verifyToken = async (tkn) => {
		console.log('tkn',tkn);
		const { data } = await AuthApi.getDataFromServer(
			`${Api.temporaryAccountUrl}?token=${tkn}`
		);
		if (data) {
			// setEmail(data.data.email);
			console.log('data', data);
		}
		if (!data) {
			console.log('data', data);
			swal('Token is invalid', '', 'error');
			// props.history.push('/login');
		}
	};

	useEffect(() => {
		console.log('token', token);
		dispatch({ type: 'LOGIN', value: false });
		const matchUrltoken = props.match.params.token;
		console.log('matchUrltoken', matchUrltoken);
		setToken(matchUrltoken);
		if (!matchUrltoken) {
			window.location = '/login';
			console.log('toeknnnnnnnnnn');
		}
		verifyToken(matchUrltoken);
	}, [dispatch]);

	return (
		<>
			{isBtnClicked ?  (
				<TemporaryAccount />
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
			<Col>
				<TextInput
					label="Password"
					autocomplete="off"
					containerClass="form-group"
					type="password"
					// minlength="6"
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
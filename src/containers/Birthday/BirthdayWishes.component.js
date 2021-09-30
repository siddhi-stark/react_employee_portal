import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Image, Row } from 'react-bootstrap';
// import SimpleReactValidator from 'simple-react-validator';
// import swal from 'sweetalert';
// import { TextInput } from '../../components/FormInputs';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';

function BirthdayWishes() {
	// const validator = new SimpleReactValidator({ autoForceUpdate: this });
	// const [message, setMessage] = useState('');
	// const ID = customFunctions.getLocalStorage('employeeId');
	const EmpId = customFunctions.getLocalStorage('EmpID');
	const [birthdayWishes, setBirthdayWishes] = useState([]);
	// const isBirthday = customFunctions.getLocalStorage('birthday');
	const id = customFunctions.getLocalStorage('greetingId');
	const GreetingId = customFunctions.getLocalStorage('gId');
	const [greetingMsg, setGreetingMessage] = useState('');
	// const [showMessage, setShowMessage] = useState(false);
	const [wisherProfile, setWisherToProfile] = useState('');
	const [bannerImage, setBannerImage] = useState('');
	// const [showWish, setShowWish] = useState('');
	// const [employeeMessage, setEmployeeMessage] = useState('');
	const userID = customFunctions.getLocalStorage('userId');
	// const showComment = customFunctions.getLocalStorage('comment-allow');
	const EmployeeName = customFunctions.getLocalStorage('EmpName');
	// const history = useHistory();

	const getBirthdayWishes = async (GrtId) => {
		const endPoint = `${Api.greetingWishesUrl}?greeting_id=${GrtId}`;
		const { data } = await AuthApi.getDataFromServer(endPoint);
		if (data && data.data) {
			setBirthdayWishes(data && data.data.length > 0 && data.data);
			data.data.map((bd) => {
				if (Number(userID) === Number(bd.wish_from_id)) {
					// setShowWish(bd.is_wish);
					// setEmployeeMessage(bd.message);
				}
				return bd;
			});
		} else {
			setBirthdayWishes([]);
		}
	};

	const getGreetingById = async (GrtId) => {
		const endPoint = `${Api.greetingsUrl}${GrtId}/?employee_id=${EmpId}`;
		const { data } = await AuthApi.getDataFromServer(endPoint);
		if (data && data.data) {
			setWisherToProfile(
				data &&
					data.data &&
					data.data.employee_data.profile_url &&
					data.data.employee_data.profile_url
			);
			setBannerImage(data && data.data && data.data.file_name);
			setGreetingMessage(data && data.data && data.data.message);
		} else {
			setGreetingMessage('');
			setWisherToProfile('');
			setBannerImage('');
		}
	};

	useEffect(() => {
		document.addEventListener('BirthdayUpdate', () => {
			const GreetingID = customFunctions.getLocalStorage('gId');
			// const EmpID = customFunctions.getLocalStorage('EmpID');
			getBirthdayWishes(GreetingID);
			getGreetingById(GreetingID);
		});

		if (GreetingId) {
			getBirthdayWishes(GreetingId);
			getGreetingById(GreetingId);
		} else {
			getBirthdayWishes(id);
			getGreetingById(id);
		}
	}, []);

	// const addMeaage = async () => {
	// 	const postData = {
	// 		wish_to: Number(ID),
	// 		message,
	// 		greeting: GreetingId,
	// 	};

	// 	const endPoint = Api.greetingWishesUrl;
	// 	const { data } = await AuthApi.postDataToServer(endPoint, postData);
	// 	if (data) {
	// 		swal(data.message[0], '', 'success');
	// 		setMessage('');
	// 		getBirthdayWishes(GreetingId);
	// 		// setShowMessage(false);
	// 		setEmployeeMessage('');
	// 	}
	// };

	// const onSubmit = (e) => {
	// 	e.preventDefault();
	// 	if (validator.allValid()) {
	// 		addMeaage();
	// 	} else {
	// 		validator.showMessages();
	// 	}
	// };
	// validator.purgeFields();

	return (
		<>
			<div
				className="profile-bg mt-3"
				style={{ backgroundImage: '/images/login-img.png' }}
			>
				{bannerImage ? (
					<Image src={bannerImage} alt="image" />
				) : (
					<Image src="/images/login-img.png" alt="image" />
				)}
				<div className="profile-img">
					{wisherProfile ? (
						<Image src={wisherProfile} alt="Card image cap" />
					) : (
						<Image src="/images/noProfile.jpeg" alt="Card image cap" />
					)}
				</div>
			</div>
			<h3>{EmployeeName}</h3>
			<Row className="birthday-block">
				<div className="col-md-12">
					<div className="card">
						<div className="media birthday-media-section">
							<div className="media-body">{greetingMsg}</div>
						</div>
					</div>
				</div>
				{birthdayWishes && birthdayWishes.length >= 1 ? (
					<>
						<p>
							<strong>Employees Wishes</strong>
						</p>
					</>
				) : (
					''
				)}

				{birthdayWishes &&
					birthdayWishes.map((bd) => (
						<>
							<div className="col-md-12">
								<div className="card">
									<div className="media birthday-media-section">
										<Image
											className="mr-3"
											src={
												bd.wish_from_profile
													? bd.wish_from_profile
													: '/images/birthday_full_width.png'
											}
											alt="Generic placeholder image"
										/>
										<div className="media-body">
											<h6 className="mt-0">{bd.wish_from_full_name}</h6>
											{bd.message}
										</div>

										{/* {Number(userID) === Number(bd.wish_from_id) ? (
											<>
												<div className="float-end edit-wishes">
													<a href="javascript:void()">
														<Image
															className="float-end"
															src="/images/edit-button.svg"
															onClick={() => {
																// setShowMessage(true);
																// setMessage(employeeMessage);
															}}
														/>
													</a>
												</div>
											</>
										) : (
											''
										)} */}
									</div>
								</div>
							</div>
						</>
					))}
			</Row>
		</>
	);
}

export default withRouter(BirthdayWishes);

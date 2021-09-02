import React, {useEffect} from 'react';
import { withRouter } from 'react-router-dom';
import { Image, Col, Button, Row } from 'react-bootstrap';
import { TextInput } from '../../components/FormInputs';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';

function BirthdayWishes() {
const id = customFunctions.getLocalStorage('greetingId');

const getBirthdayWishes = () => {
	const endPoint = `${Api.greetingsUrl}${id}/`; 

	const { data } = AuthApi.getDataFromServer(endPoint);
	if(data) {
		console.log('data',data);
	}
}


useEffect(() => {
getBirthdayWishes();
},[])


	return (
		<>
			<div className="profile-bg mt-3">
				<Image src="/images/image.png" alt="image" />
				<div className="profile-img">
					<Image src="noProfile.jpeg" alt="Card image cap" />
				</div>
			</div>
			<Row className="birthday-block">
				<div className="col-md-6">
					<div className="card">
						<div className="media birthday-media-section">
							<Image className="mr-3" src="/images/profile-img.png" alt="Generic placeholder image" />
							<div className="media-body">
								<h6 className="mt-0">Shubham Bhise</h6>Happy Birthday
							</div>
						</div>
					</div>
				</div>
				<div className="col-md-6">
					<div className="card">
						<div className="media birthday-media-section">
							<Image className="mr-3" src="/images/profile-img.png" alt="Generic placeholder image" />
							<div className="media-body">
								<h6 className="mt-0">Shubham Bhise</h6>Happy Birthday
							</div>
						</div>
					</div>
				</div><div className="col-md-6">
					<div className="card">
						<div className="media birthday-media-section">
							<Image className="mr-3" src="/images/profile-img.png" alt="Generic placeholder image" />
							<div className="media-body">
								<h6 className="mt-0">Shubham Bhise</h6>Happy Birthday
							</div>
						</div>
					</div>
				</div>
				<Col sm={12}>
					<TextInput
						label="Message"
						containerClass="form-group"
						type="text"
						as="textarea"
						Row={5}
						name="firstNameTitle"
						placeholder="Enter Full  Name"
					/>
					<Button>Submit</Button>
				</Col>
			</Row>

		</>
	);
}

export default withRouter(BirthdayWishes);

import React, {useState,useEffect} from 'react';
import { withRouter } from 'react-router-dom';
import { Image, Col, Button, Row, Form } from 'react-bootstrap';
import SimpleReactValidator from 'simple-react-validator';
import swal from 'sweetalert';
import { TextInput } from '../../components/FormInputs';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';

function BirthdayWishes() {
const validator = new SimpleReactValidator({ autoForceUpdate: this });
const [message,setMessage] = useState('');
const ID =  customFunctions.getLocalStorage('employeeId');
const [birthdayWishes,setBirthdayWishes] = useState([]);
const isBirthday = customFunctions.getLocalStorage('birthday');
const [profileImage,setProfileImage] = useState('');
const id = customFunctions.getLocalStorage('greetingId');
const GreetingId = customFunctions.getLocalStorage('gId');
const [greetingMsg,setGreetingMessage] = useState('');

const getBirthdayWishes = async (GrtId) => {

	const endPoint = `${Api.greetingWishesUrl}?greeting_id=${GrtId}`;
    const { data } = await AuthApi.getDataFromServer(endPoint);
    if(data) {
		console.log('data',data.data[0].wish_to_profile);
      setBirthdayWishes(data.data);
      setProfileImage(data.data[0].wish_to_profile);
      setGreetingMessage(data.data[0].greeting_message);
    }
};


	useEffect(() => {
		 document.addEventListener('BirthdayUpdate', () => {
      console.log('event calling');
      getBirthdayWishes(GreetingId || id);
    });

		if(GreetingId) {
			getBirthdayWishes(GreetingId);

		}
		else {
			getBirthdayWishes(id);
		}
	}, [])

const addMeaage = async () => {

	const postData = {
		wish_to: Number(ID),
		message,
		greeting: GreetingId
	}

 const endPoint = Api.greetingWishesUrl;
 const { data } = await AuthApi.postDataToServer(endPoint, postData);
 if(data) {
 	swal(data.message[0],'','success');
 }
}


  const onSubmit = (e) => {
    e.preventDefault();
    if (validator.allValid()) {
      addMeaage();
    } else {
      validator.showMessages();
    }
  };
  validator.purgeFields();

	return (
		<>
		{console.log('profileImage',profileImage)}
			<div className="profile-bg mt-3">
				<Image src="/images/image.png" alt="image" />
				<div className="profile-img">
					<Image src={profileImage} alt="Card image cap" />
				</div>
			</div>

			<Row className="birthday-block">
			<div className="col-md-6">
									<div className="card">
										<div className="media birthday-media-section">
											<div className="media-body">
											{greetingMsg}
											</div>
										</div>
									</div>
								</div>
			<p><strong>Employees Wishes</strong></p>

				{birthdayWishes && birthdayWishes.map((bd) => (

								<div className="col-md-6">
									<div className="card">
										<div className="media birthday-media-section">
											<Image className="mr-3" src= {bd.wish_from_profile ? bd.wish_from_profile : '/images/profile-img.png'}  alt="Generic placeholder image" />
											<div className="media-body">
												<h6 className="mt-0">{bd.wish_from_full_name}</h6>{bd.message}
											</div>
										</div>
									</div>
								</div>
								))}

				{isBirthday !== 'true' && (
				<>

					<Form
            onSubmit={(e) => {
              onSubmit(e);
            }}
          >
				<Col sm={12}>
					<TextInput
                        onInputChange={(e) => setMessage(e.target.value)}
						label="Message"
						containerClass="form-group"
						type="text"
						as="textarea"
                        value={message}
						Row={5}
						name="firstNameTitle"
						placeholder="Birthday Wishes..."
						errorMessage={validator.message(
                  'Message',
                  message,
                  'required'
                )}
					/>
					<Button className="mb-4" type="submit">Submit</Button>
				</Col>
				</Form>
				</>
				)}	
			</Row>


		</>
	);
}

export default withRouter(BirthdayWishes);

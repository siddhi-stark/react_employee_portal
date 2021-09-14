import React, {useState,useEffect} from 'react';
import { withRouter, useHistory } from 'react-router-dom';
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
// const EmployeeID = JSON.parse(customFunctions.getLocalStorage('Employee'));
const [birthdayWishes,setBirthdayWishes] = useState([]);
const isBirthday = customFunctions.getLocalStorage('birthday');
const id = customFunctions.getLocalStorage('greetingId');
const GreetingId = customFunctions.getLocalStorage('gId');
const [greetingMsg,setGreetingMessage] = useState('');
const [showMessage,setShowMessage] = useState(false);
const [wisherProfile,setWisherToProfile] = useState('');
const [bannerImage,setBannerImage] = useState('');
const [showWish,setShowWish] = useState('');
const [employeeMessage,setEmployeeMessage] = useState('');
const userID = customFunctions.getLocalStorage('userId');
const showComment = customFunctions.getLocalStorage('comment-allow');
const history = useHistory();


const getBirthdayWishes = async (GrtId) => {
	const endPoint = `${Api.greetingWishesUrl}?greeting_id=${GrtId}`;
    const { data } = await AuthApi.getDataFromServer(endPoint);
    if(data && data.data) {
      setBirthdayWishes(data && data.data.length > 0 && data.data);
      data.data.map((bd) => {
      	if(Number(userID) === Number(bd.wish_from_id)) {
      		setShowWish(bd.is_wish);
      		setEmployeeMessage(bd.message);
      	}
      	return bd;
      })
      setGreetingMessage(data && data.data && data.data.length > 0 && data.data[0].greeting_message && data.data[0].greeting_message);
      setWisherToProfile(data && data.data && data.data.length > 0 && data.data[0].wish_to_profile && data.data[0].wish_to_profile);
   		setBannerImage(data && data.data && data.data.length > 0 && data.data[0].file_name && data.data[0].file_name);
   		
    } else {
    	setBirthdayWishes([]);
    	setGreetingMessage('');
    	setWisherToProfile('');
    	setBannerImage('');
    }
};


	useEffect(() => {
		  document.addEventListener('BirthdayUpdate', () => {
      const GreetingID = customFunctions.getLocalStorage('gId');
      getBirthdayWishes(GreetingID);
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
 	setMessage('');
  getBirthdayWishes(GreetingId);
  setShowMessage(false);
  setEmployeeMessage('');
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
			<div className="profile-bg mt-3">
			{bannerImage ? (
				<Image src={bannerImage} alt="image" />
				) : 
							<Image src='/images/login-img.png' alt="image" />
		}
				

				<div className="profile-img">
				{wisherProfile ? (

					<Image src={wisherProfile} alt="Card image cap" />
					) : 
					<Image src='/images/noProfile.jpeg' alt="Card image cap" />
			}


				</div>
			</div>

			<Row className="birthday-block">
								{birthdayWishes && birthdayWishes.length >= 1 ? (
									<>

			<div className="col-md-12">
									<div className="card">
										<div className="media birthday-media-section">
											<div className="media-body">
											{greetingMsg}
											</div>
										</div>
									</div>
								</div>
			<p><strong>Employees Wishes</strong></p>
									</>
									) : ''}

				{birthdayWishes && birthdayWishes.map((bd) => (
								<>
								<div className="col-md-12">
									<div className="card">
										<div className="media birthday-media-section">
											<Image className="mr-3" src= {bd.wish_from_profile ? bd.wish_from_profile : '/images/profile-img.png'}  alt="Generic placeholder image" />
											<div className="media-body">
												<h6 className="mt-0">{bd.wish_from_full_name}</h6>{bd.message}
											</div>

											{Number(userID) === Number(bd.wish_from_id) ? (
												<>
												<div className="float-end edit-wishes">
					                              <a href="javascript:void()">
					                              <Image 
					                              className="float-end" 
					                              src="/images/edit-button.svg"
					                              onClick={() => {
					                              setShowMessage(true);
					                              setMessage(employeeMessage);
					                           }} 
					                              />

					                              </a>
					                            </div>
												</>
												
					                            ) : ''}		
					                  </div>
														</div>
													</div>
													</>
													))}
			{console.log('showComment',showComment,showComment==='true')}
				{showComment === 'true' ? (
					<>
				{isBirthday !== 'true' && (
				<>
				{(!showWish || showMessage) ? (

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
						placeholder="Enter your message here..."
						errorMessage={validator.message(
                  'Message',
                  message,
                  'required'
                )}
					/>
					<Button className="mb-4" type="submit">{!showMessage ? 'Submit' : 'Update'}</Button>
					<Button className="mb-4 ms-3" variant="secondary" type="submit" onClick={() => history.push('/')} >Cancel</Button>
				</Col>
				</Form>

					) : ''}

				</>
				)}				

					</>

					) : ''}

			</Row>


		</>
	);
}

export default withRouter(BirthdayWishes);

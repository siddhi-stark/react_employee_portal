import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { Image, Row } from 'react-bootstrap';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';

function BirthdayWishes() {
  const EmpId = customFunctions.getLocalStorage('EmpID');
  const [birthdayWishes, setBirthdayWishes] = useState([]);
  const id = customFunctions.getLocalStorage('greetingId');
  const GreetingId = customFunctions.getLocalStorage('gId');
  const [greetingMsg, setGreetingMessage] = useState('');
  const [wisherProfile, setWisherToProfile] = useState('');
  const [bannerImage, setBannerImage] = useState('');
  const userID = customFunctions.getLocalStorage('userId');
  const EmployeeName = customFunctions.getLocalStorage('EmpName');
  const showAnniversary = customFunctions.getLocalStorage('isAnniversary');
  const showBirthday = customFunctions.getLocalStorage('isBirthday');
  const customMessage = ( showAnniversary === 'true' ? 'Congrats on your work anniversary!' : 'Wishing you a day filled with happiness and a year filled with joy. Happy birthday!');

  const getBirthdayWishes = async (GrtId) => {
    const endPoint = `${Api.greetingWishesUrl}?greeting_id=${GrtId}&type=all`;
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

  return (
    <>
      <div
        className="profile-bg mt-3"
        style={{ backgroundImage: '/images/login-img.png' }}
      >
        {bannerImage ? (
          <>
            <Image src={bannerImage} alt="image" />
          </>
        ) : (
          <>
            {showAnniversary === 'true' && (
              <Image src="/images/Full_Anniversary.png" alt="image" />
            )}
            {showBirthday === 'true' && (
              <Image src="/images/birthday_full_width.png" alt="image" />
            )}
          </>
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
              <div className="media-body">
                {
                  greetingMsg ? `${greetingMsg}` : customMessage
                }
              </div>
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

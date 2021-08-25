import React, { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { Button } from 'react-bootstrap';
import swal from 'sweetalert';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';

function AcceptInviteLink(props) {
  const [token, setToken] = useState(null);
  const dispatch = useDispatch();
  const [candidateData, setCandidateData] = useState([]);
  const [hideButtons, setHideButtons] = useState(false);
  const [hideDeclineButton,setHideDeclineButton] = useState(false);
  const [showButton,isShowButtons] = useState(false);

  const verifyToken = async (tkn) => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.offerTokenUrl}?token=${tkn}`
    );
    if (data) {
      // setEmail(data.data.email);
      setCandidateData(data.data);
      customFunctions.setLocalStorage(
        'candidateData',
        JSON.stringify(candidateData)
      );
    }
    if (!data) {
      swal('Token is invalid', '', 'error');
      props.history.push('/login');
    }
  };

  useEffect(() => {
    dispatch({ type: 'LOGIN', value: false });
    const matchUrltoken = props.match.params.offerToken;
    setToken(matchUrltoken);
    if (!matchUrltoken) {
      window.location = '/login';
    }
    verifyToken(matchUrltoken);
  }, [dispatch]);

  const onAcceptBtn = async (type) => {
    const postData = {
      token,
      offer_status: type === 0 ? 1 : 2,
    };
    const { data } = await AuthApi.putDataToServer(
      `${Api.offerStatusUrl}`,
      postData
    );
    if (data) {
      // swal(data.message[0],'','success');
     await verifyToken(token);
      isShowButtons(true);

       if(type === 0) {
      setHideButtons(true);
    }else {
      setHideDeclineButton(true);
    }
    }
  };

  return (
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

         {hideButtons === true && (
        <p>Thank You for accepting the offer. Please check your email for further process. <br /> For any queries, contact on hr@starkdigital.net </p>

          )}

        {hideDeclineButton === true && (
        <p>Thank You for your response.</p>
        )}  

        {showButton === true ? (
          ''
          ) : 
 <>
        <p>Dear <strong>{candidateData.name}</strong>, please click on accept button to accept the offer for the position of {candidateData.applied_for_name} </p>
         <div className="float-end">
              <Button
                variant="success"
                type="button"
                onClick={() => {onAcceptBtn(0); }}
              >
                Accept
              </Button>
              <Button variant="danger" 
               className="ms-4"
                onClick={() => {onAcceptBtn(1);}}

               >
                Declined
              </Button>

            </div>

            </>
        }



        
      </div>
    </>
  );
}

export default withRouter(AcceptInviteLink);

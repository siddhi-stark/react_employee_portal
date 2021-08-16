import React, {useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import { Button } from 'react-bootstrap';
import swal from 'sweetalert';
import Api from '../../helper/api';
import AuthApi from '../../helper/authApi';

function AcceptInviteLink(props) {

  const [token, setToken] = useState(null);
  const dispatch = useDispatch();
  const [type, setType] = useState('');

  const verifyToken = async (tkn) => {
    const { data } = await AuthApi.getDataFromServer(
      `${Api.offerTokenUrl}?token=${tkn}`
    );
    if (data) {
      // setEmail(data.data.email);
      console.log('data',data);
    }
    if (!data) {
      console.log('data',data);
      swal('Token is invalid', '', 'error');
      props.history.push('/login');
    }
  };

  useEffect(() => {
    console.log('token',token)
    dispatch({ type: 'LOGIN', value: false });
    const matchUrltoken = props.match.params.offerToken;
    console.log('matchUrltoken',matchUrltoken);
    setToken(matchUrltoken);
    if (!matchUrltoken) {
      window.location = '/login';
      console.log('toeknnnnnnnnnn')
    }
    verifyToken(matchUrltoken);
  }, [dispatch]);

  const onAcceptBtn = async () => {
    console.log('Accept Button');
    const postData = {
      token,
      offer_status: type === 'acceptBtn' ? 1 : 2,
      is_local: true 
    }
    console.log('postData',postData);
    const { data } = await AuthApi.putDataToServer(
      `${Api.offerStatusUrl}`,
      postData
    );
    if(data) {
      swal(data.message[0],'','success');
    }
  }

	return (
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
         <div className="float-end">
              <Button
                variant="success"
                type="button"
                onClick={() => {onAcceptBtn(); setType('acceptBtn')}}
              >
                Accept
              </Button>
              <Button variant="danger" 
               className="ms-4"
                onClick={() => {onAcceptBtn(); setType('declinedBtn')}}

               >
                Declined
              </Button>

            </div>
        </div>
		)
}

export default withRouter(AcceptInviteLink);
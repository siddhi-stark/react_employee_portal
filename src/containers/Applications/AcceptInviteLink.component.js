import React from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from 'react-bootstrap';

function AcceptInviteLink() {
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
              >
                Accept
              </Button>
              <Button variant="danger" 
               className="ms-4">
                Declined
              </Button>

            </div>
        </div>
		)
}

export default withRouter(AcceptInviteLink);
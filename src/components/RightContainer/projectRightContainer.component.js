import React from 'react';
import { withRouter } from 'react-router-dom';
import { Card, Image } from 'react-bootstrap';
import constants from '../../helper/constants';

function ProjectRightContainer(props) {
  const {
    name,
    projectStatus,
    startDate,
    endDate,
    totalHrsSpend,
    totalHrsEstimate,
    totalHrsAllocated,
    projectCompletion,
    url,
  } = props;

  return (
    <>
      <div className="project-info-box">
        <Card className="project-info-details">
          <Card.Body>
            <h4>Project Information</h4>
            <div className="project-logo">
              <img
                src="/images/project.png"
                // src={imageProfile}
                alt="img"
              />{' '}
            </div>
            <br />
            <h2>{name}</h2>
            <br />
            <a
              href="#"
              className={
                projectStatus < 0
                  ? 'mt-4 btn text-danger'
                  : 'mt-4 btn btn-primary'
              }
            >
              {projectStatus < 0 ? 'Project in Delay' : 'Project Ontrack'}
            </a>
          </Card.Body>
        </Card>
        <Card>
          <Card.Body>
            <ul className="list-unstyled p-0 project-information-total-hr">
              {startDate && (
                <li>
                  Start Date: <strong>{startDate}</strong>
                </li>
              )}
              {endDate && (
                <li>
                  End Date: <strong>{endDate}</strong>
                </li>
              )}
              {totalHrsSpend && (
                <li>
                  Total Hours Spent: <strong>{totalHrsSpend.toFixed(2)}</strong>
                </li>
              )}
              {totalHrsEstimate && (
                <li>
                  Total Hours Estimated:{' '}
                  <strong>{totalHrsEstimate.toFixed(2)}</strong>
                </li>
              )}
              {totalHrsAllocated && (
                <li>
                  Total Hours Allocated:{' '}
                  <strong>{totalHrsAllocated.toFixed(2)}</strong>
                </li>
              )}
              {projectCompletion && (
                <li>
                  Project Completion: <strong>{projectCompletion}%</strong>
                </li>
              )}
              {url && (
                <li>
                  Team work URL:{' '}
                  <a href={`${constants.project}${url}`} target="_blank">
                    <span>
                      <Image src="/images/redirect.png" />
                    </span>
                  </a>
                </li>
              )}
            </ul>
            <hr />
          </Card.Body>
        </Card>
      </div>
    </>
  );
}
export default withRouter(ProjectRightContainer);

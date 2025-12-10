import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { ModalInput } from '../../components/FormInputs';

function MilestoneInfoModal({ show, milestoneWarnings, onClose }) {
  // Format date to "Dec 18, 2025" format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <ModalInput
      size="md"
      centered
      show={show}
      onHide={onClose}
      className="milestone-info-modal"
      id="milestone-info-modal"
      modalHeaderClass="milestone-info-header"
      label={
        <div className="d-flex align-items-center">
          <span className="mr-2" role="img" aria-label="warning">
            ⚠️
          </span>
          <span> Milestone Warning</span>
        </div>
      }
      modalBody={
        <>
          <div className="mb-3">
            <p className="mb-2">
              You have {milestoneWarnings?.length || 0} milestone
              {milestoneWarnings?.length !== 1 ? 's' : ''} scheduled around your leave dates:
            </p>
            <ListGroup>
              {milestoneWarnings?.map((milestone, index) => (
                <ListGroup.Item key={index} className="milestone-item">
                  <div className="d-flex flex-column">
                    <strong className="mb-1">{milestone.title}</strong>
                    <small className="text-muted">
                      <span className="mr-3">
                        <strong>Deadline:</strong> {formatDate(milestone.deadline)}
                      </span>
                      <span>
                        <strong>Project:</strong> {milestone.project_name}
                      </span>
                    </small>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </>
      }
    />
  );
}

export default MilestoneInfoModal;


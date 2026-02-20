import React from 'react';
import { Button, ListGroup } from 'react-bootstrap';
import { ModalInput } from '../../components/FormInputs';

function MilestoneWarningModal({ show, milestoneWarnings, onContinue, onCancel }) {
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
      onHide={onCancel}
      className="milestone-warning-modal"
      id="milestone-warning-modal"
      modalHeaderClass="milestone-warning-header"
      label={
        <div className="d-flex align-items-center">
          <span className="mr-2" role="img" aria-label="warning">
            ⚠️
          </span>
          <span>Milestone Warning</span>
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
          <div className="d-flex justify-content-end mt-3">
            <Button variant="secondary" onClick={onCancel} className="me-3">
              Cancel
            </Button>
            <Button variant="warning" onClick={onContinue}>
              Continue Anyway
            </Button>
          </div>
        </>
      }
    />
  );
}

export default MilestoneWarningModal;


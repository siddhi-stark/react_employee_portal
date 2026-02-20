import React from 'react';
import { ListGroup } from 'react-bootstrap';
import { ModalInput } from '../../components/FormInputs';

function MilestoneInfoModal({ show, milestoneWarnings, applicantName, onClose }) {
  // Format date to "Dec 18, 2025" format
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  // Determine the message based on whether applicant name is provided (team lead view)
  const getWarningMessage = () => {
    const milestoneCount = milestoneWarnings?.length || 0;
    const milestoneText = milestoneCount === 1 ? 'milestone' : 'milestones';
    
    if (applicantName) {
      // Team lead view - show applicant name
      return `${applicantName} have ${milestoneCount} ${milestoneText} scheduled around the leave dates:`;
    }
    // Applicant view - show "You have"
    return `You have ${milestoneCount} ${milestoneText} scheduled around your leave dates:`;
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
              {getWarningMessage()}
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


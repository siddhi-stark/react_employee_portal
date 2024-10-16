/* eslint-disable */
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Button, Image, Form } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import { Helmet } from '../../components/FormInputs';
import './datesGrid.css';
import { format, getDaysInMonth } from 'date-fns';
import Breadcrumb from '../../components/Breadcrumb/breadcrumb.component';
import Loader from '../../components/Loader/index';
import AuthApi from '../../helper/authApi';
import customFunctions from '../../helper/customFunctions';
import Api from '../../helper/api';
import { useHistory, useParams } from 'react-router-dom';



// DateCard Component
const ProjectTaskList = () => {
  const [reportDetails, setReportDetails] = useState([
    {
      id: 10,
      project_id: 1,
      user_id: 9,
      report_date: '2024-10-14',
      current_status: 1,
      current_status_name: 'Progress',
      issues_risks: 'https://docs.google.com/',
      next_steps: 'Ask team to speed up the work.',
      created_at: '2024-10-14T09:09:29.982407Z',
      report_tasks_details: [
        { id: 1, section: 1, section_name: 'Key Tasks Completed Today', status: 1, status_name: 'Completed', task_id: 15767, task_name: 'Update the API' },
        { id: 2, section: 1, section_name: 'Key Tasks Completed Today', status: 1, status_name: 'Completed', task_id: 15148, task_name: 'Check Log' },
        { id: 3, section: 1, section_name: 'Key Tasks Completed Today', status: 2, status_name: 'WIP', task_id: 14343, task_name: 'Create ticket' },
        { id: 4, section: 2, section_name: 'Upcoming Deliverables', status: 2, status_name: 'WIP', task_id: 13570, task_name: 'R&D on API' },
        { id: 5, section: 2, section_name: 'Upcoming Deliverables', status: 3, status_name: 'Not Started', task_id: 13568, task_name: 'Daily monitoring' },
      ],
    },
  ])
  const [currentStatus, setCurrentStatus] = useState(reportDetails[0].current_status_name || '');
  const [selectedTasksCompleted, setSelectedTasksCompleted] = useState([]);
  const [selectedDeliverables, setSelectedDeliverables] = useState([]);
  const [issuesRisks, setIssuesRisks] = useState(reportDetails[0].issues_risks || '');
  const [nextSteps, setNextSteps] = useState(reportDetails[0].next_steps || '');


  // Handle multi-select for "Key Tasks Completed Today"
  const handleSelectTasksCompleted = (taskId) => {
    setSelectedTasksCompleted(prev =>
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  // Handle multi-select for "Upcoming Deliverables"
  const handleSelectDeliverables = (taskId) => {
    setSelectedDeliverables(prev =>
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const handleSubmit = () => {
    const data = {
      current_status: currentStatus,
      selectedTasksCompleted,
      selectedDeliverables,
      issuesRisks,
      nextSteps,
    };
    console.log('Submitted Data:', data);
    // Submit the form data to your backend
  };
  
  console.log('reportDetails.report_tasks_details', reportDetails[0].current_status_name);
  
  const getTasksBySection = (sectionName) => {    
    return reportDetails[0].report_tasks_details.filter(task => task.section_name === sectionName);
  };

  return (
    <div>
      <h2>Project Report</h2>

      {/* 1. Current Project Status */}
      <div>
        <h3>Current Project Status</h3>
        <select value={currentStatus} onChange={(e) => setCurrentStatus(e.target.value)}>
          <option value="Progress">In Progress</option>
          <option value="Completed">Completed</option>
          <option value="On Hold">On Hold</option>
        </select>
      </div>

      {/* 2. Key Tasks Completed Today */}
      <div>
        <h3>Key Tasks Completed Today</h3>
        {getTasksBySection('Key Tasks Completed Today')?.map(task => (
          <div key={task.id}>
            <input
              type="checkbox"
              value={task.task_id}
              onChange={() => handleSelectTasksCompleted(task.task_id)}
              checked={selectedTasksCompleted.includes(task.task_id)}
            />
            <label>{task.task_name} ({task.status_name})</label>
          </div>
        ))}
      </div>

      {/* 3. Upcoming Deliverables */}
      <div>
        <h3>Upcoming Deliverables</h3>
        {getTasksBySection('Upcoming Deliverables')?.map(task => (
          <div key={task.id}>
            <input
              type="checkbox"
              value={task.task_id}
              onChange={() => handleSelectDeliverables(task.task_id)}
              checked={selectedDeliverables.includes(task.task_id)}
            />
            <label>{task.task_name} ({task.status_name})</label>
          </div>
        ))}
      </div>

      {/* 4. Issues/Risks */}
      <div>
        <h3>Issues/Risks</h3>
        <textarea
          value={issuesRisks}
          onChange={(e) => setIssuesRisks(e.target.value)}
          placeholder="Mention delays, blockers"
        />
      </div>

      {/* 5. Next Steps */}
      <div>
        <h3>Next Steps</h3>
        <textarea
          value={nextSteps}
          onChange={(e) => setNextSteps(e.target.value)}
          placeholder="Planned activities for tomorrow"
        />
      </div>

      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
};

export default ProjectTaskList;

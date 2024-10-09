import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Gantt, ViewMode } from 'react-gantt-task';

const EmployeeWorkloadGraph = () => {
  const [data, setData] = useState([]);
  const [barData, setBarData] = useState(null);
  const [ganttTasks, setGanttTasks] = useState([]);

  useEffect(() => {
    // Fetch data from API
    const fetchData = async () => {
      const apiData = {
        message: ["Ok"],
        code: 200,
        success: true,
        data: [
          {
            id: 54872,
            task_name: "Ward Office Services",
            status: "Pending",
            employee_name: "Akash Belokar",
            start_date: "2024-10-09",
            end_date: "2024-10-09",
            project_name: "PMC Drupal 10",
            estimation: 180,
            time_log: 0,
            total_task_time_log: 75988,
            total_task_eta: 0,
            progress: 0
          },
          {
            id: 54877,
            task_name: "Public Disclosure",
            status: "Pending",
            employee_name: "Akash Belokar",
            start_date: "2024-10-08",
            end_date: "2024-10-09",
            project_name: "PMC Drupal 10",
            estimation: 180,
            time_log: 0,
            total_task_time_log: 0,
            total_task_eta: 0,
            progress: 0
          },
          {
            id: 55411,
            task_name: "frontend - group post like/dislike",
            status: "Pending",
            employee_name: "Laxi Fernandis",
            start_date: "2024-10-07",
            end_date: "2024-10-09",
            project_name: "ReferDesk",
            estimation: 60,
            time_log: 0,
            total_task_time_log: 0,
            total_task_eta: 0,
            progress: 0
          },
          {
            id: 55423,
            task_name: "frontend - Post action (delete, turn off comment and pin post)",
            status: "Pending",
            employee_name: "Laxi Fernandis",
            start_date: "2024-10-09",
            end_date: "2024-10-09",
            project_name: "ReferDesk",
            estimation: 120,
            time_log: 0,
            total_task_time_log: 0,
            total_task_eta: 0,
            progress: 0
          },
          {
            id: 55425,
            task_name: "frontend - group notifications actions(accept or remove)",
            status: "Pending",
            employee_name: "Laxi Fernandis",
            start_date: "2024-10-09",
            end_date: "2024-10-09",
            project_name: "ReferDesk",
            estimation: 60,
            time_log: 0,
            total_task_time_log: 0,
            total_task_eta: 0,
            progress: 0
          },
        ],
        paginator: {
          total_count: 97,
          total_pages: 10,
          current_page: "1",
          limit: "10"
        }
      };

      setData(apiData.data);
      prepareBarChart(apiData.data);
      prepareGanttData(apiData.data);
    };

    fetchData();
  }, []);

  // Prepare data for Bar Chart
  const prepareBarChart = (data) => {
    const taskCountByEmployee = {};
    data.forEach((item) => {
      if (taskCountByEmployee[item.employee_name]) {
        taskCountByEmployee[item.employee_name]++;
      } else {
        taskCountByEmployee[item.employee_name] = 1;
      }
    });

    const barData = {
      labels: Object.keys(taskCountByEmployee),
      datasets: [
        {
          label: 'Task Count',
          data: Object.values(taskCountByEmployee),
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
        },
      ],
    };
    setBarData(barData);
  };

  // Prepare data for Gantt Chart
  const prepareGanttData = (data) => {
    const tasks = data.map((task) => ({
      id: task.id,
      name: task.task_name,
      start: new Date(task.start_date),
      end: new Date(task.end_date),
      progress: task.progress,
      dependencies: "",
      type: "task",
    }));
    setGanttTasks(tasks);
  };

  return (
    <div>
      <h2>Employee Workload</h2>

      {/* Table for Workload Data */}
      <table>
        <thead>
          <tr>
            <th>Employee Name</th>
            <th>Project</th>
            <th>Task Name</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>ETA</th>
            <th>Log Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((task) => (
            <tr key={task.id}>
              <td>{task.employee_name}</td>
              <td>{task.project_name}</td>
              <td>{task.task_name}</td>
              <td>{task.start_date}</td>
              <td>{task.end_date}</td>
              <td>{task.estimation} mins</td>
              <td>{task.time_log} mins</td>
              <td>{task.status}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Bar Chart for Task Count */}
      <div style={{ width: '50%', margin: 'auto', paddingTop: '20px' }}>
        <h3>Task Count by Employee</h3>
        {barData && <Bar data={barData} />}
      </div>

      {/* Gantt Chart */}
      <div style={{ marginTop: '40px' }}>
        <h3>Employee Workload Gantt Chart</h3>
        <Gantt tasks={ganttTasks} viewMode={ViewMode.Day} />
      </div>
    </div>
  );
};

export default EmployeeWorkloadGraph;

const menu = [
  {
    title: 'Dashboard',
    path: '/',
    icon: 'dashboard.svg',
    submenu: [],
    roleaccess: [1, 2, 3, 4, 5, 6, 7, 8, 10],
  },
  {
    title: 'Project',
    path: '#',
    redirect: false,
    icon: 'project.svg',
    submenu: [
      {
        title: 'Current Project',
        path: '/current-project',
        icon: 'project.svg',
        roleaccess: [1, 2, 3, 4, 10],
      },
      {
        title: 'Archived Project',
        path: '/archived-project',
        icon: 'project.svg',
        roleaccess: [1, 2, 3, 4, 10],
      },
      {
        title: 'Completed Project',
        path: '/completed-project',
        icon: 'project.svg',
        roleaccess: [1, 2, 3, 4, 10],
      }
    ],
    roleaccess: [1, 2, 3, 4, 10],
  },

  // {
  //   title: 'Leave',
  //   path: '/accountant-leaves',
  //   icon: 'leaves.svg',
  //   roleaccess: [8],
  // },

  // {
  //   title: 'Project',
  //   path: '/project',
  //   icon: 'project.svg',
  //   submenu: [],
  //   roleaccess: [1,2,3,4],
  // },
  {
    title: 'Team Project Scheduler',
    path: '/team-scheduler',
    icon: 'leaves.svg',
    submenu: [],
    roleaccess: [1, 2, 3, 4, 10],
  },

  // {
  //   title: 'Weekly Project Reports',
  //   path: '#',
  //   icon: 'Employee.svg',
  //   submenu: [
  //     {
  //       title: 'Project Reports',
  //       path: '/project-list',
  //       icon: 'report.svg',
  //       submenu: [],
  //       roleaccess: [1, 2, 3, 4, 10],
  //     },
  //   ],
  //   roleaccess: [1, 2, 3, 4, 10],
  // },

  {
    title: 'Quotes',
    path: '/quotes',
    icon: 'quote.svg',
    submenu: [],
    roleaccess: [1, 3, 5, 6, 10],
  },
  {
    title: 'Employee Daily Report',
    path: '/emp-timesheet',
    icon: 'timesheet.svg',
    submenu: [],
    roleaccess: [1, 3, 4, 5, 6],
    // roleaccess: [1, 5, 4, 6],
  },
  {
    title: 'Work From Home Details',
    path: '/wfh',
    icon: 'timesheet.svg',
    submenu: [],
    roleaccess: [1, 2, 3, 10, 5, 6],
  },
  {
    title: 'Work From Home',
    path: '/wfh-employees',
    icon: 'timesheet.svg',
    submenu: [],
    roleaccess: [4, 5, 6, 3],
  },
  {
    title: 'Employees',
    path: '#',
    icon: 'Employee.svg',
    submenu: [
      {
        title: 'Employees',
        path: '/employees',
        icon: 'Employee.svg',
        submenu: [],
        roleaccess: [1, 2, 5, 6, 10],
      },

      {
        title: 'Resignation Applications',
        path: '/resignation-applications',
        icon: 'report.svg',
        submenu: [],
        roleaccess: [1, 2, 5, 6, 10],
      },
      {
        title: 'Terminate and Abscond Employee',
        path: '/abscond-table',
        icon: 'report.svg',
        submenu: [],
        roleaccess: [1, 2, 5, 6, 10],
      },
    ],
    roleaccess: [1, 2, 5, 6, 10],
  },
  // {
  //   title: 'Employees',
  //   path: '/employee',
  //   icon: 'Employee.svg',
  //   submenu: [],
  //   roleaccess: [1],
  // },
  {
    title: 'My Interviews',
    path: '/interview-listing',
    icon: 'recruitement.svg',
    submenu: [],
    roleaccess: [1, 2, 3, 4, 5, 6, 10],
  },
  {
    title: 'Weekly Project Reports',
    path: '#',
    icon: 'Employee.svg',
    submenu: [
      {
        title: 'Weekly Generated Reports',
        path: '/todays-project-reports',
        icon: 'Employee.svg',
        submenu: [],
        roleaccess: [1],
      },
      {
        title: 'Generate Project Reports',
        path: '/project-report-generation',
        icon: 'recruitement.svg',
        submenu: [],
        roleaccess: [1],
      },
    ],
    roleaccess: [1],
  },
  // {
  //   title: 'Project Reports',
  //   path: '/project-report-generation',
  //   icon: 'recruitement.svg',
  //   submenu: [],
  //   roleaccess: [1, 2, 3, 4, 5, 6, 10],
  // },

  {
    title: 'Recruitment',
    path: '/recruitment',
    icon: 'recruitement.svg',
    roleaccess: [5],
  },

  {
    title: 'Candidates',
    path: '/candidates',
    icon: 'candidate.svg',
    submenu: [],
    roleaccess: [5, 1, 6],
  },
  {
    title: 'Leaves',
    path: '/leaves',
    icon: 'leaves.svg',
    roleaccess: [4, 7],
  },
  {
    title: 'Designation',
    path: '/designation',
    icon: 'Designation.svg',
    submenu: [],
    roleaccess: [1],
  },

  {
    title: 'Technology',
    path: '/technology',
    icon: 'technology.svg',
    submenu: [],
    roleaccess: [1],
  },
  {
    title: 'HR Activity',
    path: '#',
    redirect: false,
    icon: 'hr activity.svg',
    submenu: [
      {
        title: 'HR Timesheet',
        path: '/hr-reports',
        icon: 'timesheet.svg',
        roleaccess: [1, 6],
      },
      {
        title: 'Recruitment',
        path: '/recruitments',
        icon: 'recruitement.svg',
        roleaccess: [1, 6],
      },
    ],
    roleaccess: [1, 6],
  },
  {
    title: 'Email Templates',
    path: '/email-templates',
    icon: 'template.svg',
    submenu: [],
    roleaccess: [1, 6],
  },
  // {
  //   title: 'Employees Leaves Calculation',
  //   // path: '/add-leaves-count',
  //   path : '/accountant-leaves',
  //   icon: 'template.svg',
  //   submenu: [],
  //   roleaccess: [1, 4, 5,  6],
  // },

  {
    title: 'Leaves',
    path: '#',
    redirect: false,
    icon: 'leaves.svg',
    submenu: [
      {
        title: 'My Leaves',
        path: '/my-leaves',
        roleaccess: [1, 2, 3, 6, 5, 10],
      },
      {
        title: 'Team Leaves',
        path: '/team-leaves',
        roleaccess: [2, 3, 6, 10],
      },
      {
        title: 'Employee Leaves',
        path: '/employee-leaves',
        roleaccess: [1, 6, 5],
      },
      // {
      //   title: 'Employees Leaves Calculation',
      //   path : '/accountant-leaves',
      //   roleaccess: [1, 5,  6],
      // },
      {
        title: 'Employees Late Marks',
        path: '/late-marks',
        roleaccess: [1, 5, 6],
      },
    ],
    roleaccess: [1, 2, 3, 6, 5, 10],
  },
  {
    title: 'Event',
    path: '/event',
    icon: 'timesheet.svg',
    submenu: [],
    roleaccess: [5, 6, 1, 2, 3, 4, 7, 10],
  },
  {
    title: 'Holidays',
    path: '/holidays',
    icon: 'holiday.svg',
    submenu: [],
    roleaccess: [1, 2, 3, 4, 5, 6, 7, 10],
  },
  {
    title: 'Greetings',
    path: '/greetings',
    icon: 'greetings.svg',
    submenu: [],
    roleaccess: [1, 2, 3, 5, 6, 10],
  },
  {
    title: 'My Timesheet',
    path: '/report',
    icon: 'timesheet.svg',
    submenu: [],
    roleaccess: [4, 7],
  },
  {
    title: 'Timesheet',
    path: '#',
    redirect: false,
    icon: 'timesheet.svg',
    submenu: [
      {
        title: 'My Timesheet',
        path: '/my-report',
        icon: 'timesheet.svg',
        roleaccess: [2, 3, 6, 5, 10],
      },
      {
        title: 'Team Timesheet',
        path: '/team-report',
        icon: 'timesheet.svg',
        roleaccess: [2, 3, 6, 10],
      },
      {
        title: 'Employee Timesheet',
        path: '/employee-report',
        icon: 'timesheet.svg',
        roleaccess: [5, 6],
      },
    ],
    roleaccess: [2, 3, 6, 5, 10],
  },
  {
    title: 'Employee Timesheet',
    path: '/reports',
    icon: 'timesheet.svg',
    submenu: [],
    roleaccess: [1, 7],
  },
  {
    title: 'Performance Report',
    path: '/performance-report',
    icon: 'timesheet.svg',
    submenu: [],
    roleaccess: [1, 3, 4, 10],
  },
  {
    title: 'Employee Review',
    path: '#',
    redirect: false,
    icon: 'template.svg',
    submenu: [

      {
        title: 'Employees KRA KPI',
        path: '/kra-kpi',
        icon: 'technology.svg',
        submenu: [],
        roleaccess: [1, 5, 6, 8],
      },
      {
        title: 'Employees KRA KPI',
        path: '/kra-kpi-employees',
        icon: 'technology.svg',
        submenu: [],
        roleaccess: [3, 4],
      },

      {
        title: 'Employees Quarters Reviews',
        path: '/all-employees-reviews',
        icon: 'template.svg',
        roleaccess: [1, 5, 6],
      },

      {
        title: 'Employee Quarter Review',
        path: '/employee-quarter-review',
        icon: 'template.svg',
        roleaccess: [3, 4],
      },
      {
        title: 'Employees Quarters questionnaires',
        path: '/questionnaire',
        icon: 'template.svg',
        roleaccess: [1, 5, 6],
      },
      {
        title: 'Review Forms',
        path: '/employee-reviews',
        icon: 'report.svg',
        submenu: [],
        roleaccess: [5, 6, 1, 2, 3, 4, 7, 10],
      },
    ],
    roleaccess: [1, 3, 4, 5, 6],
  },

  {
    title: 'Employee Workload',
    path: '/employee-workload',
    icon: 'timesheet.svg',
    submenu: [],
    roleaccess: [1, 8],
  },
  {
    title: 'Policy',
    path: '/policy',
    icon: 'policy.svg',
    submenu: [],
    roleaccess: [1, 2, 3, 4, 5, 6, 7, 10],
  },
  {
    title: 'Broadcast',
    path: '/broadcast',
    icon: 'broadcast.svg',
    submenu: [],
    roleaccess: [1, 5, 6],
  },
  // {
  //   title: 'Projects',
  //   path: '/projects',
  //   icon: 'project.svg',
  //   submenu: [],
  //   roleaccess: [1, 2, 3, 4],
  // },
  // {
  //   title: 'Employee Technology Stack',
  //   path: '/emp-stack',
  //   icon: 'Designation.svg',
  //   submenu: [],
  //   roleaccess: [1],
  // },

  // {
  //   title: 'Reports',
  //   path: '/report',
  //   icon: 'report.svg',
  //   submenu: [],
  //   roleaccess: [2],
  // },

  //  {
  //   title: 'Birthday',
  //   path: '/greetings',
  //   icon: 'report.svg',
  //   submenu: [],
  //   roleaccess: [1,3,5,6],
  // },
  {
    title: 'Resignation',
    path: '/resignation-application',
    icon: 'report.svg',
    submenu: [],
    roleaccess: [3, 4, 5, 6, 7, 8, 10],
  },
  // {
  //   title: 'Reviews',
  //   path: '/employee-reviews',
  //   icon: 'report.svg',
  //   submenu: [],
  //   roleaccess: [3, 4, 5, 6, 7, 8, 10],
  // },

  {
    title: 'Support Ticket',
    path: '/support-ticket',
    icon: 'ticket.svg',
    submenu: [],
    roleaccess: [1, 2, 3, 4, 5, 6, 7, 10],
  },

  {
    title: 'Employee Review Forms Details',
    path: '/employee-reviews-details',
    icon: 'ticket.svg',
    submenu: [],
    roleaccess: [5, 6],
  },

  // {
  //   title: 'Predictions',
  //   path: '/predictions',
  //   icon: 'ticket.svg',
  //   submenu: [],
  //   roleaccess: [1],
  // },
  {
    title: 'Predictions',
    path: '/predictions-details',
    icon: 'technology.svg',
    submenu: [],
    roleaccess: [1],
  },

  // {
  //   title: 'Predictions',
  //   path: '/predictions',
  //   icon: 'ticket.svg',
  //   submenu: [],
  //   roleaccess: [1],
  // },
  
  
  // {
  //   title: 'FAQs',
  //   path: '/faq-listing',
  //   icon: 'ticket.svg',
  //   submenu: [],
  //   roleaccess: [1, 2, 3, 4, 5, 6, 7, 10],
  // },
  // {
  //   title: 'Setting',
  //   path: '#',
  //   redirect: false,
  //   icon: 'setting.svg',
  //   submenu: [
  //     {
  //       title: 'Project Fetch',
  //       path: '/project-fetch',
  //       icon: 'report.svg',
  //       roleaccess: [1],
  //     },
  //   ],
  //   roleaccess: [1],
  // },

  {
    title: 'Log Out',
    path: '#',
    icon: 'logout.svg',
    submenu: [],
    roleaccess: [1, 2, 3, 4, 5, 6, 7, 10],
  },
];

export default menu;

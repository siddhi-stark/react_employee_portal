const menu = [
  {
    title: 'Dashboard',
    path: '/',
    icon: 'dashboard.svg',
    submenu: [],
    roleaccess: [1, 2, 3, 4, 5, 6],
  },


   {
    title: 'Quotes',
    path: '/quotes',
    icon: 'quote.svg',
    submenu: [],
    roleaccess: [1,5],
  },
  {
    title: 'Projects',
    path: '/projects',
    icon: 'project.svg',
    submenu: [],
    roleaccess: [1, 2, 3, 4],
  },
   {
    title: 'Leaves',
    path: '/leaves',
    icon: 'project.svg',
    submenu: [],
    roleaccess: [4],
  },
   {
    title: 'Leaves',
    path: '#',
    redirect: false,
    icon: 'report.svg',
    submenu: [
      {
        title: 'My Leaves',
        path: '/leaves',
        icon: 'report.svg',
        roleaccess: [2,3,6,5],
      },
      {
        title: 'Team Leaves',
        path: '/team-leaves',
        icon: 'report.svg',
        roleaccess: [3,6],
      }, 
      {
        title: 'Employee Leaves',
        path: '/employee-leaves',
        icon: 'report.svg',
        roleaccess: [1,2,6,5],
      },
    ],
    roleaccess: [1,2,3,6,5],
  },
   {
    title: 'Quotes',
    path: '/quotes',
    icon: 'quote.svg',
    submenu: [],
    roleaccess: [2, 3],
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
        title: 'HR Report',
        path: '/hr-reports',
        icon: 'report.svg',
        roleaccess: [1, 2],
      },
      {
        title: 'Recruitment',
        path: '/recruitment',
        icon: 'recruitement.svg',
        roleaccess: [1, 2,6],
      },
    ],
    roleaccess: [1,2,6],
  },
  {
    title: 'Email Templates',
    path: '/email-templates',
    icon: 'template.svg',
    submenu: [],
    roleaccess: [1],
  },
  {
    title: 'Employee Timesheet',
    path: '/emp-timesheet',
    icon: 'timesheet.svg',
    submenu: [],
    roleaccess: [5, 6],
  },
   {
    title: 'Event',
    path: '/event',
    icon: 'timesheet.svg',
    submenu: [],
    roleaccess: [5,6,1,2,3,4],
  },
  {
    title: 'Employees',
    path: '/employees',
    icon: 'Employee.svg',
    submenu: [],
    roleaccess: [5, 6],
  },
  {
    title: 'Recruitment',
    path: '/recruitment',
    icon: 'recruitement.svg',
    roleaccess: [5,4,3],
  }, 
  {
    title: 'Candidates',
    path: '/candidates',
    icon: 'candidate.svg',
    submenu: [],
    roleaccess: [5],
  },
  {
    title: 'Holidays',
    path: '/holidays',
    icon: 'holiday.svg',
    submenu: [],
    roleaccess: [1,2,3,4,5,6],
  },
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

  {
    title: 'Reports',
    path: '/report',
    icon: 'report.svg',
    submenu: [],
    roleaccess: [4],
  },
  {
    title: 'Reports',
    path: '#',
    redirect: false,
    icon: 'report.svg',
    submenu: [
      {
        title: 'My Report',
        path: '/report',
        icon: 'report.svg',
        roleaccess: [2, 3, 6,5],
      },
      {
        title: 'Team Report',
        path: '/team-report',
        icon: 'report.svg',
        roleaccess: [2, 3,6],
      },{
        title: 'Employee Report',
        path: '/reports',
        icon: 'report.svg',
        roleaccess: [5,6],
      },
    ],
    roleaccess: [2, 3, 6, 5],
  },
   {
    title: 'Reports',
    path: '/reports',
    icon: 'report.svg',
    submenu: [],
    roleaccess: [1],
  },
  {
    title: 'Logout',
    path: '#',
    icon: 'logout.svg',
    submenu: [],
    roleaccess: [1, 2, 3, 4, 5, 6],
  },
];

export default menu;

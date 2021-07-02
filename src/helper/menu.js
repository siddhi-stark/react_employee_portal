const menu = [
  {
    title: 'Dashboard',
    path: '/',
    icon: 'dashboard.svg',
    submenu: [],
    roleaccess: [1, 2, 3, 4, 5],
  },
  {
    title: 'Employee Timesheet',
    path: '/emp-timesheet',
    icon: 'dashboard.svg',
    submenu: [],
    roleaccess: [5],
  },
  {
    title: 'Employees',
    path: '/employees',
    icon: 'dashboard.svg',
    submenu: [],
    roleaccess: [5],
  },
  {
    title: 'Recruitment',
    path: '#',
    redirect: false,
    icon: 'dashboard.svg',
    submenu: [
      {
        title: 'Batch Upload',
        path: '/batch-upload',
        icon: 'report.svg',
        roleaccess: [5],
      },
      {
        title: 'Applications',
        path: '/applications',
        icon: 'report.svg',
        roleaccess: [5],
      },
    ],
    roleaccess: [5],
  },
  {
    title: 'Projects',
    path: '/projects',
    icon: 'project.svg',
    submenu: [],
    roleaccess: [1, 2, 3, 4],
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
    icon: 'Designation.svg',
    submenu: [],
    roleaccess: [1],
  },
  {
    title: 'Employees',
    path: '/employee',
    icon: 'Employee.svg',
    submenu: [],
    roleaccess: [1, 2, 3],
  },
  {
    title: 'Reports',
    path: '/reports',
    icon: 'report.svg',
    submenu: [],
    roleaccess: [1, 5],
  },

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
        roleaccess: [2, 3],
      },
      {
        title: 'Team Report',
        path: '/team-report',
        icon: 'report.svg',
        roleaccess: [2, 3],
      },
    ],
    roleaccess: [2, 3],
  },
  {
    title: 'Logout',
    path: '#',
    icon: 'logout.svg',
    submenu: [],
    roleaccess: [1, 2, 3, 4, 5],
  },
];

export default menu;

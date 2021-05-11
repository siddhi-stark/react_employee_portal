const menu = [
  {
    title: 'Dashboard',
    path: '/',
    icon: 'dashboard.svg',
    submenu: [],
    roleaccess: [1, 2, 3, 4],
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
    title: 'Employee',
    path: '/employee',
    icon: 'dashboard.svg',
    submenu: [],
    roleaccess: [1],
  },
  {
    title: 'Reports',
    path: '/reports',
    icon: 'report.svg',
    submenu: [],
    roleaccess: [1],
  },
  {
    title: 'Reports',
    // path: '/reports',
    icon: 'report.svg',
    submenu: [
      {
        title: 'My Report',
        path: '/report',
        icon: 'report.svg',
        roleaccess: [3,4],
      },
      {
        title: 'Team Report',
        path: '/report',
        icon: 'report.svg',
        roleaccess: [3],
      },
    ],
    roleaccess: [3,4],
  },
  {
    title: 'Logout',
    path: '#',
    icon: 'logout.svg',
    submenu: [],
    roleaccess: [1, 2, 3, 4],
  },
];

export default menu;

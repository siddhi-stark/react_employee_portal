import React from 'react';

export default function UserRestrictions(props) {
  const { children, permittedUsers } = props;
  const roleId = localStorage.getItem('group');
  const hasPermissions =
    permittedUsers &&
    permittedUsers.length &&
    permittedUsers.includes(Number(roleId));
  return <>{hasPermissions && <>{children}</>}</>;
}

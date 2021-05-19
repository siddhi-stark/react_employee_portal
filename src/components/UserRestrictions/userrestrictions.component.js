import React from 'react';
import customFunctions from '../../helper/customFunctions';

export default function UserRestrictions(props) {
  const { children, permittedUsers } = props;
  const roleId = customFunctions.getLocalStorage('group');
  const hasPermissions =
    permittedUsers &&
    permittedUsers.length &&
    permittedUsers.includes(Number(roleId));
  return <>{hasPermissions && <>{children}</>}</>;
}

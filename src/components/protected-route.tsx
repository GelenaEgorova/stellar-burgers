import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthCheckedSelector, UserSelector } from './../services/authSlice';
import { useSelector } from './../services/store';
import { Preloader } from './ui/preloader';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const isAuthChecked = useSelector(AuthCheckedSelector);
  const user = useSelector(UserSelector);
  const location = useLocation();

  console.log('isAuthChecked:', isAuthChecked);
  console.log('user:', user);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate replace to='/login' />;
  }

  if (onlyUnAuth && user) {
    const { from } = location.state ?? { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  return children;
};

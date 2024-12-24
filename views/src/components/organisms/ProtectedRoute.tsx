import { guestDisallowPaths, userDisallowPaths } from '@common/variables';
import useToken from '@hooks/useToken';
import ForbiddenPage from '@pages/ForbiddenPage';
import e from 'express';
import { memo, useLayoutEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  roles: ExpandedRole[];
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles }) => {
  const { user } = useToken();
  const navigate = useNavigate();
  const location = useLocation();

  useLayoutEffect(() => {
    if (!user && location.pathname.match(guestDisallowPaths)) {
      navigate('/');
    } else if (user && location.pathname.match(userDisallowPaths)) {
      navigate('/');
    }
  }, [location.pathname, navigate, user]);

  if (!user && roles.includes('Guest')) {
    return <Outlet />;
  } else if (user && roles.includes(user.role)) {
    return <Outlet />;
  } else {
    return <ForbiddenPage />;
  }
};

export default memo(ProtectedRoute);

import { guestDisallowPaths, userDisallowPaths } from '@common/variables';
import useToken from '@hooks/useToken';
import ForbiddenPage from '@pages/ForbiddenPage';
import { memo, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  roles: ExpandedRole[];
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles }) => {
  const { user } = useToken();
  const navigate = useNavigate();
  const locate = useLocation();

  useEffect(() => {
    if (!user && locate.pathname.match(guestDisallowPaths)) {
      navigate('/');
    } else if (user && locate.pathname.match(userDisallowPaths)) {
      navigate('/');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locate.pathname, user]);

  if (!user && roles.includes('Guest')) {
    return <Outlet />;
  } else if (user && roles.includes(user.role)) {
    return <Outlet />;
  } else {
    return <ForbiddenPage />;
  }
};

export default memo(ProtectedRoute);

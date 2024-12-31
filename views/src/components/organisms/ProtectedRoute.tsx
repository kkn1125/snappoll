import { guestDisallowPaths, userDisallowPaths } from '@common/variables';
import useLogger from '@hooks/useLogger';
import useToken from '@hooks/useToken';
import ForbiddenPage from '@pages/ForbiddenPage';
import { memo, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
  roles: ExpandedRole[];
}
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles }) => {
  const { debug } = useLogger('ProtectedRoute');
  const { initialize, user } = useToken();
  const navigate = useNavigate();
  const locate = useLocation();

  useEffect(() => {
    if(initialize){

      if (!user && locate.pathname.match(guestDisallowPaths)) {
        debug('게스트 접근 방지');
        navigate(locate.state?.from || '/');
      } else if (user && locate.pathname.match(userDisallowPaths)) {
        debug('회원 접근 방지');
        navigate(locate.state?.from || '/');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialize,locate.pathname, user]);

  if (!user && roles.includes('Guest')) {
    return <Outlet />;
  } else if (user && roles.includes(user.role)) {
    return <Outlet />;
  } else {
    return <ForbiddenPage />;
  }
};

export default memo(ProtectedRoute);

import {
  guestAllowPaths,
  guestDisallowPaths,
  userDisallowPaths,
} from '@common/variables';
import useLogger from '@hooks/useLogger';
import useToken from '@hooks/useToken';
import ForbiddenPage from '@pages/ForbiddenPage';
import NotfoundPage from '@pages/NotfoundPage';
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
    if (initialize) {
      debug('초기화 완료');
      if (!user && locate.pathname.match(guestDisallowPaths)) {
        if (locate.pathname.match(guestAllowPaths)) {
          debug('게스트 접근 예외 허용');
        } else {
          debug('게스트 접근 방지');
          navigate(locate.state?.from || '/');
        }
      } else if (user && locate.pathname.match(userDisallowPaths)) {
        debug('회원 접근 방지');
        navigate(locate.state?.from || '/');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialize, locate.pathname, user]);

  if (!user && roles.includes('Guest')) {
    return <Outlet />;
  } else if (user && roles.includes(user.role)) {
    return <Outlet />;
  } else {
    if (
      roles.includes('Admin') &&
      user?.role !== 'Admin' &&
      locate.pathname.startsWith('/panel')
    ) {
      return <NotfoundPage />;
    }
    return <ForbiddenPage />;
  }
};

export default memo(ProtectedRoute);

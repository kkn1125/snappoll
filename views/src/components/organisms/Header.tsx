import { sidebarAtom } from '@/recoils/sidebar.atom';
import { useRecoilState } from 'recoil';

interface HeaderProps {}
const Header: React.FC<HeaderProps> = () => {
  const [sidebarState, setSidebarState] = useRecoilState(sidebarAtom);
  function handleToggleSidebar() {
    setSidebarState((sidebarState) => ({
      ...sidebarState,
      opened: !sidebarState.opened,
    }));
  }
  return (
    <div>
      <button onClick={handleToggleSidebar}>
        {sidebarState.opened ? 'open' : 'closed'}
      </button>
    </div>
  );
};

export default Header;

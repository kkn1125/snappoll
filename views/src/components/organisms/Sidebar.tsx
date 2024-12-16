import FlexibleMenu from '@components/atoms/FlexibleMenu';
import { List } from '@mui/material';
import { memo } from 'react';

interface SidebarProps {
  menuList: {
    name: string;
    path: string;
    icon: React.ReactNode;
    badge?: number;
  }[];
}
const Sidebar: React.FC<SidebarProps> = ({ menuList }) => {
  return (
    <List
      sx={{
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      {menuList.map((menu) => (
        <FlexibleMenu
          key={menu.name}
          name={menu.name}
          to={menu.path}
          icon={menu.icon}
          badge={menu.badge}
        />
      ))}
    </List>
  );
};

export default memo(Sidebar);

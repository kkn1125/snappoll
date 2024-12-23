import { Stack, Tab, Tabs } from '@mui/material';

interface PanelSidebarProps {
  currentTab: number;
  handleTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}
const PanelSidebar: React.FC<PanelSidebarProps> = ({
  currentTab,
  handleTabChange,
}) => {
  return (
    <Stack
      sx={{
        overflowY: 'auto',
        overflowX: 'hidden',
      }}
    >
      <Tabs
        orientation="vertical"
        value={currentTab}
        onChange={handleTabChange}
      >
        <Tab label="사용자 관리" value={0} />
        <Tab label="게시글 관리" value={1} />
        <Tab label="설문 관리" value={2} />
        <Tab label="투표 관리" value={3} />
      </Tabs>
    </Stack>
  );
};

export default PanelSidebar;

import { getNotices } from '@apis/panel/getNotices';
import { useQuery } from '@tanstack/react-query';

interface PanelNoticeProps {}
const PanelNotice: React.FC<PanelNoticeProps> = () => {
  const { data } = useQuery({
    queryKey: ['panelNotice'],
    queryFn: getNotices,
  });

  return <div></div>;
};

export default PanelNotice;

import { Stack, Tooltip, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import TimelineIcon from '@mui/icons-material/Timeline';
import { Message } from '@common/messages';
import useModal from '@hooks/useModal';

interface ListItemIconsProps {
  dataId: string;
  type: 'poll' | 'vote';
  handleRemove: (id: string) => void;
}
const ListItemIcons: React.FC<ListItemIconsProps> = ({
  dataId,
  type,
  handleRemove,
}) => {
  const { openInteractiveModal } = useModal();
  return (
    <Stack direction="row" gap={1}>
      <Tooltip placement="top" title="참여결과 보기">
        <IconButton
          component={Link}
          edge="end"
          aria-label="delete"
          color="success"
          to={`/${type}s/${dataId}/response`}
        >
          <TimelineIcon />
        </IconButton>
      </Tooltip>
      <Tooltip placement="top" title="제거">
        <IconButton
          edge="end"
          aria-label="delete"
          color="error"
          onClick={() => {
            openInteractiveModal(Message.Single.Remove, () => {
              handleRemove(dataId);
            });
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};

export default ListItemIcons;

import { Stack, Tooltip, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import TimelineIcon from '@mui/icons-material/Timeline';
import { Message } from '@common/messages';
import useModal from '@hooks/useModal';
import BorderColorIcon from '@mui/icons-material/BorderColor';

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
  return (
    <Stack direction="row" gap={1}>
      <Tooltip placement="top" title="참여결과 보기">
        <IconButton
          component={Link}
          edge="end"
          aria-label="delete"
          color="success"
          to={`/service/${type}/${dataId}/response`}
        >
          <TimelineIcon />
        </IconButton>
      </Tooltip>
      <Tooltip placement="top" title="수정">
        <IconButton
          component={Link}
          edge="end"
          aria-label="delete"
          color="primary"
          to={`/service/${type}/edit/${dataId}`}
        >
          <BorderColorIcon />
        </IconButton>
      </Tooltip>
      <Tooltip placement="top" title="제거">
        <IconButton
          edge="end"
          aria-label="delete"
          color="error"
          onClick={() => handleRemove(dataId)}
        >
          <DeleteIcon />
        </IconButton>
      </Tooltip>
    </Stack>
  );
};

export default ListItemIcons;

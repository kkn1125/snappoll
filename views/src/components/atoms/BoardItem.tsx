import { UnknownName } from '@common/variables';
import { SnapBoard } from '@models/SnapBoard';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import VisibilityIcon from '@mui/icons-material/Visibility';
import {
  Chip,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { formattedDate } from '@utils/formattedDate';
import { getUsernameOrGuest } from '@utils/getUsernameOrGuest';
import { Link } from 'react-router-dom';

interface BoardItemProps {
  board: SnapBoard;
}
const BoardItem: React.FC<BoardItemProps> = ({ board }) => {
  return (
    <ListItem dense>
      <ListItemButton
        disableGutters
        component={Link}
        to={`/board/${board.category}/${board.id}`}
      >
        <ListItemText
          primary={
            <Stack direction="row" alignItems="center" gap={2}>
              <Typography fontSize={18} fontWeight={700} color="textSecondary">
                {board.title}
              </Typography>
              <Stack direction="row" alignItems="center" gap={1}>
                <Chip
                  size="small"
                  icon={<ThumbUpIcon />}
                  label={board.likeCount}
                />
                <Chip
                  size="small"
                  icon={<VisibilityIcon />}
                  label={board.viewCount}
                />
              </Stack>
            </Stack>
          }
          secondary={`작성자: ${getUsernameOrGuest(board.isPrivate ? UnknownName : board.author?.username)} | 생성일: ${formattedDate(board.createdAt)}`}
          primaryTypographyProps={{ fontSize: 18 }}
          secondaryTypographyProps={{ fontSize: 12 }}
        />
      </ListItemButton>
    </ListItem>
  );
};

export default BoardItem;

import { SnapBoard } from '@models/SnapBoard';
import { ListItem, ListItemButton, ListItemText } from '@mui/material';
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
          primary={board.title}
          secondary={`작성자: ${getUsernameOrGuest(board.author?.username)} | 생성일: ${formattedDate(board.createdAt)}`}
          primaryTypographyProps={{ fontSize: 18 }}
          secondaryTypographyProps={{ fontSize: 12 }}
        />
      </ListItemButton>
    </ListItem>
  );
};

export default BoardItem;

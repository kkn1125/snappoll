import { SnapBoard } from '@models/SnapBoard';
import { ListItem, ListItemButton, ListItemText } from '@mui/material';
import { formattedDate } from '@utils/formattedDate';
import { Link, useParams } from 'react-router-dom';

interface BoardItemProps {
  board: SnapBoard;
}
const BoardItem: React.FC<BoardItemProps> = ({ board }) => {
  return (
    <ListItem>
      <ListItemButton
        component={Link}
        to={`/board/${board.category}/${board.id}`}
      >
        <ListItemText
          primary={board.title}
          secondary={`작성자: ${board.author?.username} | 생성일: ${formattedDate(board.createdAt)}`}
          primaryTypographyProps={{ fontSize: 24 }}
        />
      </ListItemButton>
    </ListItem>
  );
};

export default BoardItem;

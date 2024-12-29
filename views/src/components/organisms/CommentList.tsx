import CommentField from '@components/moleculars/CommentField';
import { Stack, Typography } from '@mui/material';

interface CommentListProps {
  comments: SnapComment[];
  count: number;
  initializeComments: () => void;
}
const CommentList: React.FC<CommentListProps> = ({
  comments,
  count,
  initializeComments,
}) => {
  return (
    <Stack gap={3}>
      <Typography>Comments ({count})</Typography>
      <Stack gap={1}>
        {comments?.map((comment) => (
          <CommentField
            key={comment.id}
            comment={comment}
            initializeComments={initializeComments}
          />
        ))}
      </Stack>
      {count === 0 && <Typography>등록된 댓글이 없습니다.</Typography>}
    </Stack>
  );
};

export default CommentList;

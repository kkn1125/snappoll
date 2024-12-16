import { Skeleton, Stack } from '@mui/material';

interface SkeletonBoardListProps {}
const SkeletonBoardList: React.FC<SkeletonBoardListProps> = () => {
  return (
    <Stack>
      <Skeleton />
    </Stack>
  );
};

export default SkeletonBoardList;

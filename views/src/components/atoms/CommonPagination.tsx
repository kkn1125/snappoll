import { Pagination, Stack } from '@mui/material';
import { isNil } from '@utils/isNil';
import { useSearchParams } from 'react-router-dom';

interface CommonPaginationProps {
  total: number;
  limit?: number;
}
const CommonPagination: React.FC<CommonPaginationProps> = ({
  total,
  limit,
}) => {
  const [params, setParams] = useSearchParams({ page: '1' });

  if (!isNil(limit) || total === 0) {
    return <></>;
  }

  return (
    <Stack direction="row" justifyContent="center">
      <Pagination
        onChange={(e, page) => {
          if (page === 1) {
            setParams({});
          } else {
            setParams({ page: '' + page });
          }
        }}
        page={+(params.get('page') || 1)}
        count={total}
        showFirstButton
        showLastButton
      />
    </Stack>
  );
};

export default CommonPagination;

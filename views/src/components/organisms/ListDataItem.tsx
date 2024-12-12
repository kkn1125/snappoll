import { removePoll } from '@/apis/removePoll';
import { removeVote } from '@/apis/removeVote';
import { tokenAtom } from '@/recoils/token.atom';
import { Message } from '@common/messages';
import useModal from '@hooks/useModal';
import { SnapPoll } from '@models/SnapPoll';
import { SnapVote } from '@models/SnapVote';
import { AccessTime } from '@mui/icons-material';
import ThreePIcon from '@mui/icons-material/ThreeP';
import {
  Button,
  Chip,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Pagination,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { formattedDate } from '@utils/formattedDate';
import { isNil } from '@utils/isNil';
import { useCallback, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import ListItemIcons from '../atoms/ListItemIcons';

interface ListDataItemProps<T extends SnapPoll | SnapVote> {
  name: 'poll' | 'vote';
  queryKey: string;
  dataList: T[];
  count: number;
  emptyComment?: string;
  disableCreateButton?: boolean;
  limit?: number;
}

function ListDataItem<T extends SnapPoll | SnapVote>({
  name,
  queryKey,
  dataList,
  count,
  emptyComment = '등록한 데이터가 없습니다.',
  disableCreateButton = false,
  limit,
}: ListDataItemProps<T>) {
  const { openInteractiveModal } = useModal();
  const { user } = useRecoilValue(tokenAtom);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [params, setParams] = useSearchParams({ page: '1' });

  const removeMutate = useMutation({
    mutationKey: [`remove${name}`],
    mutationFn: name === 'poll' ? removePoll : removeVote,
    onSuccess(data, variables, context) {
      queryClient.invalidateQueries({
        queryKey: [queryKey],
      });
    },
  });

  function handleRemove(id: string) {
    openInteractiveModal(Message.Single.Remove, () => {
      removeMutate.mutate(id);
    });
  }

  const total = Math.ceil(count / 10);

  const respondAmount = useCallback((data: SnapPoll | SnapVote) => {
    const response =
      'response' in data
        ? data.response
        : 'voteResponse' in data
          ? data.voteResponse
          : undefined;
    if (!response) return 0;
    return response.length;
  }, []);

  const kor = useMemo(() => {
    return name === 'poll' ? '설문' : '투표';
  }, [name]);

  return (
    <Stack>
      <Stack direction="row" justifyContent="space-between">
        {!disableCreateButton && (
          <Button
            component={Link}
            variant="contained"
            size="large"
            to={`/service/${name}/new`}
          >
            등록하기
          </Button>
        )}
        {user && (
          <Button
            component={Link}
            to={`/service/${name}/me/response`}
            variant="contained"
            color="secondary"
          >
            나의 {kor}응답 보기
          </Button>
        )}
      </Stack>

      <List disablePadding>
        {dataList && dataList.length > 0 ? (
          (limit ? dataList.slice(0, limit) : dataList).map((data, i) => (
            <ListItem
              key={data.id}
              secondaryAction={
                <Stack
                  direction="row"
                  gap={1}
                  alignItems="center"
                  flexWrap="wrap"
                >
                  <Tooltip title="응답자" placement="top">
                    <Chip
                      size="small"
                      icon={<ThreePIcon />}
                      label={respondAmount(data)}
                      sx={{ pl: 0.5 }}
                    />
                  </Tooltip>
                  <Tooltip title="유효기간" placement="top">
                    <Chip
                      size="small"
                      variant="outlined"
                      icon={<AccessTime />}
                      label={
                        !isNil(data.expiresAt)
                          ? formattedDate(data.expiresAt, 'YYYY. MM. DD.')
                          : '상시'
                      }
                    />
                  </Tooltip>

                  {data.user?.id === user?.id && (
                    <ListItemIcons
                      dataId={data.id}
                      type={name}
                      handleRemove={() => handleRemove(data.id)}
                    />
                  )}
                </Stack>
              }
              sx={{
                px: '0 !important',
                boxSizing: 'border-box',
                ['&:not(:last-of-type)']: {
                  borderBottom: '1px solid #eee',
                },
                flexDirection: {
                  xs: 'column',
                  md: 'row',
                },
                ['.MuiListItemSecondaryAction-root']: {
                  position: { xs: 'static', md: 'auto' },
                  transform: { xs: 'none' },
                },
              }}
            >
              <ListItemButton
                onClick={() => navigate(`/service/${name}/${data.id}`)}
                sx={{
                  px: '0 !important',
                }}
              >
                <ListItemText
                  primary={data.title}
                  secondary={`작성자: ${data.user?.username} | 생성일: ${new Date(data.createdAt).toLocaleDateString()}`}
                />
              </ListItemButton>
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText>{emptyComment}</ListItemText>
          </ListItem>
        )}
      </List>
      {isNil(limit) && total > 0 && (
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
      )}
    </Stack>
  );
}

export default ListDataItem;

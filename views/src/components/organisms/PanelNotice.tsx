import { deleteNoticeForce } from '@apis/panel/deleteNotice';
import { getNotices } from '@apis/panel/getNotices';
import { Message } from '@common/messages';
import DataListTable from '@components/moleculars/DataListTable';
import useModal from '@hooks/useModal';
import { Button, IconButton, Paper, Stack, Tooltip } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isNil } from '@utils/isNil';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import ModeEditIcon from '@mui/icons-material/ModeEdit';

interface PanelNoticeProps {}
const PanelNotice: React.FC<PanelNoticeProps> = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { openInteractiveModal } = useModal();
  const [searchParams] = useSearchParams({ page: '1' });
  const page = +(searchParams.get('page') || 1);
  const { data, refetch } = useQuery<
    SnapResponseType<{
      notices: SnapNotice[];
      columns: string[];
      count: number;
    }>
  >({
    queryKey: ['panelNotice', page],
    queryFn: () => getNotices(page),
  });
  const deleteNoticeMutation = useMutation({
    mutationKey: ['deleteNoticeForce'],
    mutationFn: deleteNoticeForce,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ['panelNotice'],
      });
      refetch();
    },
  });
  const notices = data?.data.notices;
  const count = data?.data.count;
  const columnList = data?.data.columns;
  const columns = useMemo(() => {
    if (!columnList) return [] as GridColDef[];
    return columnList.map(
      (column) =>
        ({
          field: column,
          headerName: column,
          flex: 1,
          type: (() => {
            switch (column) {
              case 'id':
              case 'title':
              case 'content':
              case 'cover':
              case 'type':
                return 'string';
              case 'createdAt':
              case 'sendAt':
              case 'updatedAt':
                return 'dateTime';
              default:
                return 'string';
            }
          })(),
          valueFormatter: (params) => {
            if (column.match(/^(created|updated|sendAt)/gi)) {
              if (isNil(params)) return '-';
              return dayjs(params).format('YYYY. MM. DD. HH:mm');
            }
            if (isNil(params)) return '-';
            return params;
          },
        }) as GridColDef,
    );
  }, [columnList]);

  function reloadNotices() {
    queryClient.invalidateQueries({
      queryKey: ['panelNotice'],
    });
    refetch();
  }

  function handleDeleteNotice(id: string) {
    openInteractiveModal({
      content: Message.Single.Remove,
      callback() {
        deleteNoticeMutation.mutate(id);
      },
    });
  }

  function handleEdit(id: string) {
    const noticeData = notices?.find((notice) => notice.id === id);
    if (noticeData) {
      navigate(`/panel/notice/edit`, {
        state: { notice: noticeData },
      });
    }
  }

  return (
    <Stack component={Paper} elevation={5} p={3} gap={2}>
      {/* Button Navigations */}
      <Stack direction="row" gap={1}>
        <Button component={Link} to={`/panel/notice`} state={{ mode: 'admin' }}>
          메일 작성
        </Button>
      </Stack>
      <DataListTable
        columns={columns || []}
        rows={notices || []}
        getActions={({ id }) => {
          return [
            <Tooltip title="수정">
              <IconButton onClick={() => handleEdit(id as string)}>
                <ModeEditIcon />
              </IconButton>
            </Tooltip>,
            <Tooltip title="제거">
              <IconButton onClick={() => handleDeleteNotice(id as string)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>,
          ];
        }}
      />
    </Stack>
  );
};

export default PanelNotice;

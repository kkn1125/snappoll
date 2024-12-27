import { deleteBoardForce } from '@apis/board/deleteBoardForce';
import { getBoardAllList } from '@apis/board/getBoardAllList';
import { updateBoard } from '@apis/board/updateBoard';
import { Message } from '@common/messages';
import DataListTable from '@components/moleculars/DataListTable';
import useModal from '@hooks/useModal';
import { SnapBoard } from '@models/SnapBoard';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Button, IconButton, Paper, Stack, Tooltip } from '@mui/material';
import { GridColDef } from '@mui/x-data-grid';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

interface PanelBoardProps {}
const PanelBoard: React.FC<PanelBoardProps> = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { openModal, openInteractiveModal } = useModal();
  const [searchParams] = useSearchParams({ page: '1' });
  const page = +(searchParams.get('page') ?? '1');
  const { data, refetch } = useQuery<
    SnapResponseType<{ columns: string[]; boards: SnapBoard[]; count: number }>
  >({
    queryKey: ['boards', page],
    queryFn: () => getBoardAllList(page),
  });
  const columnList = data?.data?.columns;
  const boards = data?.data?.boards;
  const columns = useMemo(() => {
    if (!columnList) return [] as GridColDef[];
    return columnList.map(
      (column) =>
        ({
          field: column,
          headerName: column,
          flex: 1,
        }) as GridColDef,
    );
  }, [columnList]);

  function reloadBoards() {
    queryClient.invalidateQueries({
      queryKey: ['boards'],
    });
    refetch();
  }

  const visibleBoardMutation = useMutation({
    mutationKey: ['visibleBoard'],
    mutationFn: updateBoard,
    onSuccess() {
      reloadBoards();
    },
  });

  const deleteBoardMutation = useMutation({
    mutationKey: ['deleteBoardForce'],
    mutationFn: deleteBoardForce,
    onSuccess() {
      reloadBoards();
    },
  });

  function handlePrivate(id: string) {
    const currentVisible = !!boards?.find((board) => board.id)?.isPrivate;
    openInteractiveModal({
      content: Message.Single.Remove,
      callback() {
        visibleBoardMutation.mutate({
          id,
          boardData: {
            isPrivate: !currentVisible,
          },
        });
      },
    });
  }

  function handleDeleteBoard(id: string) {
    openInteractiveModal({
      content: Message.Single.Remove,
      callback() {
        deleteBoardMutation.mutate(id);
      },
    });
  }

  function handleEdit(id: string) {
    const boardData = boards?.find((board) => board.id === id);
    if (boardData) {
      navigate(`/board/${boardData?.category}/edit`, {
        state: { board: boardData },
      });
    }
  }

  return (
    <Stack component={Paper} elevation={5} p={3} gap={2}>
      {/* Button Navigations */}
      <Stack direction="row" gap={1}>
        <Button component={Link} to={`/board/new`} state={{ mode: 'admin' }}>
          글 작성
        </Button>
      </Stack>
      {/* <WriteBoardModal /> */}
      <DataListTable
        checkboxSelection
        columns={columns}
        rows={boards || []}
        getActions={({ id }) => {
          return [
            <Tooltip title="수정">
              <IconButton onClick={() => handleEdit(id as string)}>
                <ModeEditIcon />
              </IconButton>
            </Tooltip>,
            <Tooltip title="비공개 처리">
              <IconButton onClick={() => handlePrivate(id as string)}>
                <VisibilityOffIcon />
              </IconButton>
            </Tooltip>,
            <Tooltip title="제거">
              <IconButton onClick={() => handleDeleteBoard(id as string)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>,
          ];
        }}
      />
    </Stack>
  );
};

export default PanelBoard;

import { removeAccount } from '@apis/removeAccount';
import { findAllUsers } from '@apis/user/findAllUsers';
import { updateUser } from '@apis/user/updateUser';
import DataListTable from '@components/moleculars/DataListTable';
import { Stack, Paper, Tooltip, IconButton } from '@mui/material';
import { GridColDef, GridValidRowModel } from '@mui/x-data-grid';
import { useQuery, useMutation } from '@tanstack/react-query';
import { isNil } from '@utils/isNil';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import CancelIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import useModal from '@hooks/useModal';
import { Message } from '@common/messages';

interface PanelUserProps {}
const PanelUser: React.FC<PanelUserProps> = () => {
  const { openInteractiveModal } = useModal();
  const { data } = useQuery<
    SnapResponseType<{ columns: string[]; users: User; count: number }>
  >({
    queryKey: ['findAllUsers'],
    queryFn: findAllUsers,
  });

  const count = data?.data.count;
  const users = data?.data.users;
  const columnStrings = data?.data.columns;
  const columns = useMemo(() => {
    if (!columnStrings) return [];
    return columnStrings.map(
      (column) =>
        ({
          field: column,
          headerName: column,
          type: (() => {
            switch (column) {
              case 'id':
              case 'email':
              case 'username':
              case 'role':
              case 'grade':
              case 'authProvider':
                return 'string';
              case 'isActive':
                return 'string';
              case 'createdAt':
              case 'updatedAt':
              case 'deletedAt':
              case 'lastLogin':
                return 'dateTime';
              default:
                return 'string';
            }
          })(),
          flex: 1,
          valueFormatter: (params) => {
            if (column === 'is_active') {
              return params ? '활동' : '활동정지';
            }
            if (column.match(/^(created|updated|deleted|last_login)/gi)) {
              if (isNil(params)) return '-';
              return dayjs(params).format('YYYY. MM. DD. HH:mm');
            }
            if (isNil(params)) return '-';
            return params;
          },
        }) as GridColDef,
    );
  }, [columnStrings]);

  const updateUserMutation = useMutation({
    mutationKey: ['updateUser'],
    mutationFn: updateUser,
  });

  const deleteUserMutation = useMutation({
    mutationKey: ['deleteUser'],
    mutationFn: removeAccount,
  });

  function handleStopUser(id: string) {
    openInteractiveModal({
      content: Message.Single.StopUser,
      callback() {
        updateUserMutation.mutate({
          id,
          data: {
            isActive: false,
          },
        });
      },
    });
  }

  function handleDeleteUser(id: string) {
    openInteractiveModal({
      content: Message.Single.Remove,
      callback() {
        deleteUserMutation.mutate(id);
      },
    });
  }

  return (
    <Stack component={Paper} elevation={5} p={3} gap={2}>
      <DataListTable
        checkboxSelection
        columns={columns}
        rows={(users ?? []) as GridValidRowModel[]}
        getActions={({ id }) => {
          return [
            <Tooltip title="활동정지">
              <IconButton onClick={() => handleStopUser(id as string)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>,
            <Tooltip title="탈퇴처리">
              <IconButton onClick={() => handleDeleteUser(id as string)}>
                <CancelIcon />
              </IconButton>
            </Tooltip>,
          ];
        }}
      />
    </Stack>
  );
};

export default PanelUser;

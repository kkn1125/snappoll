import { tokenAtom } from '@/recoils/token.atom';
import { Message } from '@common/messages';
import useModal from '@hooks/useModal';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Button,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemText,
  Stack,
} from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilValue } from 'recoil';

interface ListDataItemProps<
  T extends APIPoll | Vote,
  F extends (id: string) => any,
> {
  name: string;
  queryKey: string;
  mutationKey: string;
  removeMethod: F;
  dataList: T[];
  emptyComment?: string;
}

function ListDataItem<T extends APIPoll | Vote, F extends (id: string) => any>({
  name,
  queryKey,
  mutationKey,
  removeMethod,
  dataList,
  emptyComment = '등록한 데이터가 없습니다.',
}: ListDataItemProps<T, F>) {
  const { openInteractiveModal } = useModal();
  const { user } = useRecoilValue(tokenAtom);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const removeMutate = useMutation({
    mutationKey: [mutationKey],
    mutationFn: removeMethod,
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

  return (
    <Stack>
      <Stack direction="row">
        <Button
          component={Link}
          variant="contained"
          size="large"
          to={`/${name}s/new`}
        >
          등록하기
        </Button>
      </Stack>
      {dataList && dataList.length > 0 ? (
        dataList.map((data) => (
          <ListItem
            key={data.id}
            secondaryAction={
              data.user?.id === user?.id && (
                <IconButton
                  edge="end"
                  aria-label="delete"
                  color="error"
                  onClick={() => handleRemove(data.id)}
                >
                  <DeleteIcon />
                </IconButton>
              )
            }
          >
            <ListItemButton onClick={() => navigate(`/${name}s/${data.id}`)}>
              <ListItemText>{data.title}</ListItemText>
            </ListItemButton>
          </ListItem>
        ))
      ) : (
        <ListItem>
          <ListItemText>{emptyComment}</ListItemText>
        </ListItem>
      )}
    </Stack>
  );
}

export default ListDataItem;

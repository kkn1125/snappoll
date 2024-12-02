import { snapVoteAtom } from '@/recoils/snapVote.atom';
import { Message } from '@common/messages';
import useModal from '@hooks/useModal';
import { SnapVote } from '@models/SnapVote';
import { SnapVoteOption } from '@models/SnapVoteOption';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Stack, TextField } from '@mui/material';
import { ChangeEvent, useCallback } from 'react';
import { useSetRecoilState } from 'recoil';

interface CreateVoteOptionItemProps {
  index: number;
  option: SnapVoteOption;
  errors: ErrorMessage<SnapVoteOption>;
}
const CreateVoteOptionItem: React.FC<CreateVoteOptionItemProps> = ({
  index,
  option,
  errors,
}) => {
  const { openInteractiveModal } = useModal();
  const setSnapVote = useSetRecoilState(snapVoteAtom);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSnapVote((snapVote) => {
      const copySnapVote = SnapVote.copy(snapVote);
      copySnapVote.voteOption = copySnapVote.voteOption.map((opt) => {
        if (opt.id === option.id) {
          const copyOption = SnapVoteOption.copy(option);
          copyOption.content = value;
          return copyOption;
        }
        return opt;
      });
      return copySnapVote;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRemoveVote = useCallback((id: string) => {
    openInteractiveModal(Message.Single.Remove, () => {
      setSnapVote((snapVote) => {
        const copySnapVote = SnapVote.copy(snapVote);
        copySnapVote.voteOption = copySnapVote.voteOption.filter(
          (option) => option.id !== id,
        );
        return copySnapVote;
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack direction="row" gap={2}>
      <TextField
        fullWidth
        autoFocus
        size="small"
        variant="filled"
        value={option.content}
        onChange={handleChange}
        required
        placeholder="항목을 입력하세요."
        sx={{
          ['& .MuiInputBase-root']: {
            flex: 1,
            ['& .MuiInputBase-input']: {
              pt: 1,
            },
          },
        }}
      />
      <IconButton color="error" onClick={() => handleRemoveVote(option.id)}>
        <DeleteIcon />
      </IconButton>
    </Stack>
  );
};

export default CreateVoteOptionItem;

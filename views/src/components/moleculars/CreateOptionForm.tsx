import { snapPollAtom } from '@/recoils/snapPoll.atom';
import CustomInput from '@components/atoms/CustomInput';
import { SnapPoll } from '@models/SnapPoll';
import { SnapPollOption } from '@models/SnapPollOption';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, ListItem, ListItemText } from '@mui/material';
import { ChangeEvent, memo, useCallback } from 'react';
import { useSetRecoilState } from 'recoil';

interface CreateOptionFormProps {
  questionId: string;
  option: SnapPollOption;
}
const CreateOptionForm: React.FC<CreateOptionFormProps> = ({
  questionId,
  option,
}) => {
  const setSnapPoll = useSetRecoilState(snapPollAtom);

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSnapPoll((snapPoll) => {
      const copyOption = SnapPollOption.copy(option);
      copyOption.setContent(value);

      const copyPoll = SnapPoll.copy(snapPoll);
      copyOption.setContent(value);
      copyPoll.updateOptionByInfo(questionId, copyOption);
      return copyPoll;
    });
  }, []);

  const handleRemove = useCallback(() => {
    setSnapPoll((snapPoll) => {
      const copyPoll = SnapPoll.copy(snapPoll);
      copyPoll.deleteOption(questionId, option.id);
      return copyPoll;
    });
  }, []);

  return (
    <ListItem
      secondaryAction={
        <IconButton
          edge="end"
          aria-label="delete"
          color="error"
          onClick={handleRemove}
        >
          <DeleteIcon />
        </IconButton>
      }
    >
      <ListItemText>
        <CustomInput
          fullWidth
          label="내용"
          size="small"
          name="content"
          variant="standard"
          value={option.content}
          onChange={onChange}
          type="text"
        />
      </ListItemText>
    </ListItem>
  );
};

export default memo(CreateOptionForm);

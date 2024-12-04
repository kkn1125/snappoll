import { SnapVoteOption } from '@models/SnapVoteOption';
import { ListItemButton, ListItemText } from '@mui/material';
import { useCallback } from 'react';
import CheckedComponent from './CheckedComponent';

interface VoteAnswerItemProps {
  option: SnapVoteOption;
  isSelected?: boolean;
}
const VoteAnswerItem: React.FC<VoteAnswerItemProps> = ({
  option,
  isSelected = false,
}) => {
  const isDeactivateStyle = useCallback(
    (isDeactive: boolean) =>
      isDeactive
        ? {}
        : {
            disabled: true,
            background: '#eeeeee56',
          },
    [],
  );

  return (
    <ListItemButton
      key={option.id}
      component="label"
      {...isDeactivateStyle(!!isSelected)}
      sx={{
        border: '1px solid #eee',
        borderRadius: 1,
        p: 2,
      }}
    >
      <CheckedComponent checked={!!isSelected} />
      <ListItemText>{option.content}</ListItemText>
    </ListItemButton>
  );
};

export default VoteAnswerItem;

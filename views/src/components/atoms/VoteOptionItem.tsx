import { snapVoteResponseAtom } from '@/recoils/snapVoteResponse.atom';
import { SnapVoteOption } from '@models/SnapVoteOption';
import { Checkbox, FormControlLabel, ListItemButton } from '@mui/material';
import { memo, SyntheticEvent, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import CheckedComponent from './CheckedComponent';

interface VoteOptionItemProps {
  option: SnapVoteOption;
  onChange: (e: SyntheticEvent, checked: boolean) => void;
}
const VoteOptionItem: React.FC<VoteOptionItemProps> = ({
  option,
  onChange,
}) => {
  const response = useRecoilValue(snapVoteResponseAtom);

  const checked = useMemo(() => {
    return !!response.hasOption(option.id);
  }, [option.id, response]);

  return (
    <ListItemButton
      component="label"
      sx={{
        border: '1px solid #eee',
        borderRadius: 1,
        p: 2,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
      }}
    >
      <CheckedComponent checked={checked} />
      <FormControlLabel
        label={option.content}
        slotProps={{
          typography: {
            className: 'font-maru',
          },
        }}
        onChange={onChange}
        control={
          <Checkbox
            name={option.id}
            checked={checked}
            sx={{ display: 'none' }}
          />
        }
      />
    </ListItemButton>
  );
};

export default memo(VoteOptionItem);

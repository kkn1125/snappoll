import { snapResponseAtom } from '@/recoils/snapResponse.atom';
import { SnapPollOption } from '@models/SnapPollOption';
import { Checkbox, FormControlLabel, ListItemButton } from '@mui/material';
import { ChangeEvent, memo, SyntheticEvent, useMemo } from 'react';
import { useRecoilValue } from 'recoil';
import CheckedComponent from './CheckedComponent';

interface OptionItemProps {
  option: SnapPollOption;
  onChange: (e: SyntheticEvent, checked: boolean) => void;
}
const OptionItem: React.FC<OptionItemProps> = ({ option, onChange }) => {
  const response = useRecoilValue(snapResponseAtom);

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

export default memo(OptionItem);

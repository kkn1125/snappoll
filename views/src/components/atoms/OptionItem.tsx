import { snapResponseAtom } from '@/recoils/snapResponse.atom';
import { SnapPollOption } from '@models/SnapPollOption';
import { Checkbox, FormControlLabel, ListItemButton } from '@mui/material';
import { ChangeEvent, memo, SyntheticEvent, useMemo } from 'react';
import { useRecoilValue } from 'recoil';

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
      sx={{ border: '1px solid #eee', borderRadius: 0.5, p: 2 }}
    >
      <FormControlLabel
        label={option.content}
        onChange={onChange}
        control={<Checkbox name={option.id} checked={checked} />}
      />
    </ListItemButton>
  );
};

export default memo(OptionItem);

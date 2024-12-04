import { snapVoteResponseAtom } from '@/recoils/snapVoteResponse.atom';
import { SnapVoteOption } from '@models/SnapVoteOption';
import { SnapVoteResponse } from '@models/SnapVoteResponse';
import {
  Checkbox,
  FormControlLabel,
  List,
  ListItemButton,
  Stack,
  TextField,
} from '@mui/material';
import {
  ChangeEvent,
  memo,
  SyntheticEvent,
  useCallback,
  useMemo,
  useState,
} from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import CheckedComponent from './CheckedComponent';
import OptionItem from './OptionItem';
import { SnapVoteAnswer } from '@models/SnapVoteAnswer';

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

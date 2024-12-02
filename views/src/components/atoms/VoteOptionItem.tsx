import { snapVoteResponseAtom } from '@/recoils/snapVoteResponse.atom';
import { SnapVoteOption } from '@models/SnapVoteOption';
import { SnapVoteResponse } from '@models/SnapVoteResponse';
import {
  Checkbox,
  FormControlLabel,
  ListItemButton,
  Stack,
} from '@mui/material';
import { memo, SyntheticEvent, useCallback, useMemo } from 'react';
import { useRecoilState } from 'recoil';
import CheckedComponent from './CheckedComponent';

interface VoteOptionItemProps {
  option: SnapVoteOption;
}
const VoteOptionItem: React.FC<VoteOptionItemProps> = ({ option }) => {
  const [responses, setResponses] = useRecoilState(snapVoteResponseAtom);

  const checked = useMemo(() => {
    return responses.some((response) => response.voteOptionId === option.id);
  }, [option.id, responses]);

  const handleChange = useCallback((e: SyntheticEvent, checked: boolean) => {
    setResponses((responses) => {
      if (checked) {
        const newResponse = new SnapVoteResponse();
        newResponse.voteOptionId = option.id;
        return [...responses, newResponse];
      } else {
        return responses.filter(
          (response) => response.voteOptionId !== option.id,
        );
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Stack
      direction="row"
      component="label"
      sx={{ border: '1px solid #eee', borderRadius: 0.5, py: 1, px: 2 }}
    >
      <CheckedComponent checked={checked} />
      <FormControlLabel
        label={option.content}
        slotProps={{
          typography: {
            className: 'font-maru',
          },
        }}
        onChange={handleChange}
        control={
          <Checkbox
            name={option.id}
            checked={checked}
            sx={{ display: 'none' }}
          />
        }
        sx={{ whiteSpace: 'nowrap' }}
      />
    </Stack>
  );
};

export default memo(VoteOptionItem);

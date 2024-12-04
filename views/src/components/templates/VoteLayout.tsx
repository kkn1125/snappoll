import { snapVoteResponseAtom } from '@/recoils/snapVoteResponse.atom';
import { tokenAtom } from '@/recoils/token.atom';
import CheckedComponent from '@components/atoms/CheckedComponent';
import VoteOptionItem from '@components/atoms/VoteOptionItem';
import { SnapVote } from '@models/SnapVote';
import { SnapVoteAnswer } from '@models/SnapVoteAnswer';
import { SnapVoteResponse } from '@models/SnapVoteResponse';
import {
  Checkbox,
  FormControlLabel,
  ListItemButton,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import dayjs from 'dayjs';
import { ChangeEvent, SyntheticEvent, useCallback, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';

interface VoteLayoutProps {
  vote: SnapVote;
}
const VoteLayout: React.FC<VoteLayoutProps> = ({ vote }) => {
  const [useEtc, setUseEtc] = useState(false);
  const setSnapVoteResponse = useSetRecoilState(snapVoteResponseAtom);
  const { user } = useRecoilValue(tokenAtom);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSnapVoteResponse((response) => {
      const copyResponse = SnapVoteResponse.copy(response);
      const answer = copyResponse.hasTextAnswer(vote.id);
      if (answer) {
        copyResponse.updateAnswer(answer.id, value);
      } else {
        const newAnswer = new SnapVoteAnswer();
        newAnswer.id = vote.id;
        newAnswer.voteOptionId = undefined;
        newAnswer.value = value;
        copyResponse.addAnswer(newAnswer);
      }
      return copyResponse;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleClearValue = useCallback(() => {
    setSnapVoteResponse((response) => {
      const copyResponse = SnapVoteResponse.copy(response);
      const answer = copyResponse.hasOption(vote.id);
      if (answer) {
        copyResponse.updateAnswer(answer.id, undefined);
      }
      return copyResponse;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChangeCheckbox = useCallback(
    (e: SyntheticEvent, checked: boolean) => {
      const name = (e.target as HTMLInputElement).name;
      setSnapVoteResponse((response) => {
        const copyResponse = SnapVoteResponse.copy(response);
        if (checked) {
          if (!vote.isMultiple) {
            copyResponse.voteAnswer = [];
            setUseEtc(false);
          }
          const option = copyResponse.hasOption(name);
          if (!option) {
            const newAnswer = new SnapVoteAnswer();
            newAnswer.id = vote.id;
            newAnswer.voteOptionId = name;
            copyResponse.addAnswer(newAnswer);
          }
        } else {
          const option = copyResponse.hasOption(name);
          if (option) {
            copyResponse.removeAnswer(name);
          }
        }
        return copyResponse;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <Stack gap={1}>
      <Stack justifyContent="baseline" gap={1}>
        <Typography
          className="font-maru"
          fontSize={32}
          fontWeight={700}
          align="center"
          gutterBottom
        >
          {vote.title}
        </Typography>
        <Stack alignItems="flex-end" mb={1} flex={1} gap={1}>
          <Typography className="font-maru" fontSize={16} fontWeight={100}>
            {user?.username}
          </Typography>

          <Typography className="font-maru" fontSize={16}>
            {(vote.expiresAt &&
              dayjs(vote.expiresAt).format('YYYY. MM. DD HH:mm') + ' 까지') ||
              ''}
          </Typography>
        </Stack>
      </Stack>

      <Toolbar />

      {vote.description && (
        <Typography
          className="font-maru"
          fontSize={14}
          fontWeight={300}
          sx={{
            p: 3,
            backgroundColor: grey['100'],
            borderRadius: 1,
            borderLeft: '5px solid #aaa',
          }}
        >
          {vote.description}
        </Typography>
      )}

      <Toolbar />

      <Stack gap={10}>
        <Stack
          direction="row"
          component="label"
          sx={{ border: '1px solid #eee', borderRadius: 1, p: 2 }}
        >
          <Stack direction="row" gap={1}>
            {vote.voteOption.map((option) => (
              <VoteOptionItem
                key={option.id}
                option={option}
                onChange={handleChangeCheckbox}
              />
            ))}
            {vote.useEtc && (
              <ListItemButton
                component="label"
                sx={{
                  border: '1px solid #eee',
                  borderRadius: 1,
                  p: 2,
                }}
              >
                <CheckedComponent checked={useEtc} />
                <FormControlLabel
                  label="기타"
                  slotProps={{
                    typography: {
                      className: 'font-maru',
                    },
                  }}
                  checked={useEtc}
                  onChange={(e, checked) => {
                    if (!checked) {
                      handleClearValue();
                    } else {
                      if (!vote.isMultiple) {
                        setSnapVoteResponse((response) => {
                          const copyVoteResponse =
                            SnapVoteResponse.copy(response);
                          copyVoteResponse.voteAnswer = [];
                          return copyVoteResponse;
                        });
                      }
                    }
                    setUseEtc(checked);
                  }}
                  control={<Checkbox name="useEtc" sx={{ display: 'none' }} />}
                />
              </ListItemButton>
            )}
            {useEtc && (
              <TextField
                variant="filled"
                name="value"
                slotProps={{
                  input: {
                    className: 'font-maru',
                  },
                }}
                placeholder="작성해주세요."
                onChange={handleChange}
              />
            )}
          </Stack>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default VoteLayout;

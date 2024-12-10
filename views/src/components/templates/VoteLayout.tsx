import { createShareVote } from '@/apis/vote/share/createShareVote';
import { snapVoteResponseAtom } from '@/recoils/snapVoteResponse.atom';
import { tokenAtom } from '@/recoils/token.atom';
import { Message } from '@common/messages';
import { BASE_CLIENT_URL } from '@common/variables';
import CheckedComponent from '@components/atoms/CheckedComponent';
import VoteOptionItem from '@components/atoms/VoteOptionItem';
import { SnapVote } from '@models/SnapVote';
import { SnapVoteAnswer } from '@models/SnapVoteAnswer';
import { SnapVoteResponse } from '@models/SnapVoteResponse';
import { AccessTime } from '@mui/icons-material';
import {
  Alert,
  AlertTitle,
  Button,
  Checkbox,
  Chip,
  FormControlLabel,
  ListItemButton,
  Stack,
  TextField,
  Toolbar,
  Typography,
} from '@mui/material';
import { grey } from '@mui/material/colors';
import { useMutation } from '@tanstack/react-query';
import { formattedDate } from '@utils/formattedDate';
import { printDateOrNot } from '@utils/printDateOrNot';
import { ChangeEvent, SyntheticEvent, useCallback, useState } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import ShareIcon from '@mui/icons-material/Share';
import useModal from '@hooks/useModal';
import { Link } from 'react-router-dom';
import { resumeShareUrl } from '@/apis/vote/share/resumeShareUrl';
import { revokeShareUrl } from '@/apis/vote/share/revokeShareUrl';
import { isNil } from '@utils/isNil';
import ShareControlButton from '@components/atoms/ShareControlButton';

interface VoteLayoutProps {
  vote: SnapVote;
  expired: boolean;
  refetchVote: () => void;
}
const VoteLayout: React.FC<VoteLayoutProps> = ({
  vote,
  expired,
  refetchVote,
}) => {
  const { user } = useRecoilValue(tokenAtom);
  const [useEtc, setUseEtc] = useState(false);
  const setSnapVoteResponse = useSetRecoilState(snapVoteResponseAtom);
  const { openModal } = useModal();

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
        <Stack
          alignItems="flex-end"
          mb={2}
          flex={1}
          gap={1}
          sx={{ backgroundColor: '#f9f9f9', padding: 2, borderRadius: 2 }}
        >
          <Typography
            className="font-maru"
            fontSize={18}
            fontWeight={600}
            color="#333"
          >
            {vote.user?.username} 작성
          </Typography>

          <Stack direction="row" alignItems="center" gap={1}>
            <AccessTime fontSize="small" color={expired ? 'error' : 'action'} />
            <Typography
              className="font-maru"
              fontSize={16}
              color={expired ? 'error' : '#555'}
            >
              {printDateOrNot(vote.expiresAt)}
            </Typography>
          </Stack>

          <ShareControlButton data={vote} user={user} refetch={refetchVote} />
        </Stack>
      </Stack>

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

      {expired ? (
        <Alert severity="warning">
          <AlertTitle>안내</AlertTitle> {formattedDate(vote.expiresAt) + ' '}에
          마감된 투표입니다.
        </Alert>
      ) : (
        <Stack gap={10}>
          <Stack
            direction="row"
            sx={{ border: '1px solid #eee', borderRadius: 1, p: 2 }}
          >
            <Stack direction="row" gap={1} flexWrap="wrap">
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
                    whiteSpace: 'nowrap',
                    flex: '0 1 auto',
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
                    control={
                      <Checkbox name="useEtc" sx={{ display: 'none' }} />
                    }
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
      )}
    </Stack>
  );
};

export default VoteLayout;

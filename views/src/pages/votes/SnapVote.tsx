import { Action } from '@/models/Action';
import {
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import PreviewIcon from '@mui/icons-material/Preview';
import SaveIcon from '@mui/icons-material/Save';
import { useLocation, useNavigate } from 'react-router-dom';
import { VoteOptionItem } from '@utils/Vote';
import DeleteIcon from '@mui/icons-material/Delete';
import useModal from '@hooks/useModal';
import { Message } from '@common/messages';

interface SnapVoteProps {}
const SnapVote: React.FC<SnapVoteProps> = () => {
  const { openModal, openInteractiveModal } = useModal();
  const formRef = useRef<HTMLFormElement>(null);
  const navigate = useNavigate();
  const locate = useLocation();
  const [options, setOptions] = useState<VoteOptionItem[]>([]);
  const [baseInfo, setBaseInfo] = useState<Pick<Vote, 'title' | 'content'>>({
    title: '',
    content: '',
  });

  const actions = [
    new Action('Save', <SaveIcon />, () => {
      formRef.current?.requestSubmit();
    }),
    new Action('Preview', <PreviewIcon />, () =>
      navigate('/votes/new/preview', {
        state: {
          data: {
            ...baseInfo,
            options: JSON.stringify(options),
          },
        },
      }),
    ),
  ];

  useEffect(() => {
    window.history.replaceState({}, '');

    const state = locate.state;
    if (state?.data) {
      const { data } = state;
      const { title, content, options } = data;
      setBaseInfo({
        title,
        content,
      });
      const jsonOption = JSON.parse(options);
      setOptions(
        jsonOption.items.map(
          (item: VoteOptionItem) => new VoteOptionItem(item),
        ),
      );
    } else {
      setOptions([new VoteOptionItem({ name: '', checked: false })]);
    }
  }, [locate.state]);

  function updateBaseInfo(e: ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value;
    setBaseInfo((baseInfo) => ({ ...baseInfo, [name]: value }));
  }

  function handleSubmit(e: FormEvent) {}

  function handleRemoveVote(voteId: string) {
    openInteractiveModal(Message.Single.Remove, () => {
      if (options.length > 1) {
        setOptions(options.filter((option) => option.id !== voteId));
      } else {
        openModal(Message.Info.NoDeleteOne);
      }
    });
  }

  return (
    <Stack>
      <Toolbar />
      <Container component={Stack} p={5} gap={3}>
        <Stack
          ref={formRef}
          component="form"
          onSubmit={handleSubmit}
          gap={3}
          p={3}
          sx={{
            border: '1px solid #ccc',
            borderRadius: 5,
          }}
        >
          <Typography fontSize={28} fontWeight={700}>
            투표지 제작
          </Typography>
          {/* 기본 필드 */}
          <Stack gap={1}>
            <Typography fontSize={20} fontWeight={700}>
              투표 제목
            </Typography>
            <TextField
              autoFocus
              size="small"
              name="title"
              placeholder="제목을 입력해주세요."
              label="제목"
              value={baseInfo.title}
              onChange={updateBaseInfo}
            />
            <Typography fontSize={20} fontWeight={700}>
              투표 내용
            </Typography>
            <TextField
              autoFocus
              size="small"
              name="content"
              placeholder="내용을 입력해주세요."
              label="내용"
              value={baseInfo.content}
              onChange={updateBaseInfo}
            />
          </Stack>
        </Stack>
        <Divider />
        <Stack>
          {options.map((option, i) => (
            <Stack
              key={option.name + i}
              direction="row"
              justifyContent="flex-start"
              gap={2}
            >
              <TextField size="small" label="항목명" name="name" value="" />
              <Tooltip title="제거" placement="right">
                <IconButton color="error" onClick={() => handleRemoveVote}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Stack>
          ))}
        </Stack>
      </Container>
      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.onClick}
          />
        ))}
      </SpeedDial>
    </Stack>
  );
};

export default SnapVote;

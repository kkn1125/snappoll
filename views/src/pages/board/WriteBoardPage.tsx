import { updateBoard } from '@apis/board/updateBoard';
import { writeBoard } from '@apis/board/writeBoard';
import { Message } from '@common/messages';
import CustomInput from '@components/atoms/CustomInput';
import useModal, { OpenModalProps } from '@hooks/useModal';
import useToken from '@hooks/useToken';
import useValidate from '@hooks/useValidate';
import { SnapBoard } from '@models/SnapBoard';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { Logger } from '@utils/Logger';
import { AxiosError } from 'axios';
import {
  ChangeEvent,
  FormEvent,
  SyntheticEvent,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import SunEditor, { buttonList } from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; // Import Sun Editor's CSS File
import { ko } from 'suneditor/src/lang';

const logger = new Logger('WriteBoardPage');

interface SnapBoardType extends Omit<SnapBoard, 'userId'> {
  userId?: string;
}

interface WriteBoardProps {
  title: string;
  content: string;
  userId?: string;
  category: string;
  password?: string;
  isPrivate: boolean;
  isNotice: boolean;
}
interface WriteBoardPageProps {}
const WriteBoardPage: React.FC<WriteBoardPageProps> = () => {
  const navigate = useNavigate();
  const locate = useLocation();
  const params = useParams();
  const { state } = useLocation();
  const board = state?.board as SnapBoardType;
  const isGuestBoard = !board?.userId;
  const [data, setData] = useState<WriteBoardProps>({
    title: '',
    content: '',
    category: board?.category || params?.category || 'community',
    password: undefined,
    isPrivate: false,
    isNotice: false,
  });
  const { isMaster, user } = useToken();
  const validateType = user ? 'writeBoardForUser' : 'writeBoard';
  const { openModal } = useModal();
  const { errors, validate, validated, setValidated } = useValidate(data);
  const writeMutation = useMutation({
    mutationKey: ['writeBoard'],
    mutationFn: writeBoard,
    onSuccess(/* data, variables, context */) {
      const modalOption: OpenModalProps = {
        info: Message.Info.SuccessWrite,
        slot: null,
      };
      modalOption.closeCallback = () => {
        navigate(`/board/${data.category}`);
      };
      openModal(modalOption);
    },
    onError(error: AxiosError<AxiosException>, variables, context) {
      openModal({
        info: {
          title: '안내',
          content: '게시글 저장에 문제가 발생했습니다.',
        },
      });
    },
  });
  const updateMutation = useMutation({
    mutationKey: ['updateBoard'],
    mutationFn: updateBoard,
    onSuccess(/* data, variables, context */) {
      const modalOption: OpenModalProps = {
        info: Message.Info.SuccessUpdate,
        slot: null,
      };
      modalOption.closeCallback = () => {
        navigate(`/board/${board.category}/${board.id}`);
      };

      openModal(modalOption);
    },
    onError(error: AxiosError<AxiosException>, variables, context) {
      logger.error(error);
      openModal({
        info: {
          title: '안내',
          content:
            error.response?.data.errorCode.message ||
            '게시글 저장에 문제가 발생했습니다.',
        },
      });
    },
  });

  useLayoutEffect(() => {
    // logger.log(isMaster);
    if (user && isMaster) {
      // navigate(-1);
    } else {
      if (
        !(
          locate.pathname.startsWith('/board/community/write') ||
          locate.pathname.startsWith('/board/faq/write')
        )
      ) {
        navigate(-1);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMaster, locate.pathname]);

  useLayoutEffect(() => {
    if (board) {
      setData({ ...board });
    } else {
      setData({
        title: '',
        content: '',
        category: params?.category || 'community',
        password: undefined,
        isPrivate: false,
        isNotice: false,
      });
    }
  }, [board, params?.category]);

  useEffect(() => {
    if (validated) {
      validate(validateType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validated, data]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value;
    setData((data) => ({ ...data, [name]: value }));
  }

  function handleCheckboxChange(e: SyntheticEvent, checked: boolean) {
    const name = (e.target as HTMLInputElement).name;
    const value = checked;
    setData((data) => ({ ...data, [name]: value }));
  }

  function handleSelectChange(e: SelectChangeEvent) {
    setData((data) => ({ ...data, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setValidated(true);

    if (!validate(validateType)) return;
    const boardData = { ...data };
    if (user) {
      boardData.userId = user.id;
      delete boardData['password'];
    }
    logger.info('게시글 옵션 확인 :', boardData);
    if (board) {
      if (isGuestBoard) {
        delete board.userId;
      }
      updateMutation.mutate({ id: board.id, boardData });
    } else {
      writeMutation.mutate(boardData);
    }
    return false;
  }

  return (
    <Stack flex={1} gap={2} component="form" noValidate onSubmit={handleSubmit}>
      <CustomInput
        name="title"
        type="text"
        placeholder="제목을 입력해주세요."
        variant="standard"
        size="large"
        fullWidth
        required
        autoFocus
        autoComplete="username"
        onChange={handleChange}
        value={data['title'] || ''}
        errors={errors}
        sx={{ ['.MuiInputBase-input']: { fontSize: 26 } }}
      />
      {isMaster && (
        <Select
          name="category"
          value={data['category'] || 'community'}
          size="small"
          onChange={handleSelectChange}
        >
          <MenuItem value="notice">공지사항</MenuItem>
          <MenuItem value="community">커뮤니티</MenuItem>
          <MenuItem value="event">이벤트</MenuItem>
          <MenuItem value="faq">FAQ</MenuItem>
        </Select>
      )}
      <Box sx={{ py: 1 }} />
      <Stack
        sx={{
          borderWidth: errors['content'] ? 1 : 0,
          borderStyle: 'solid',
          borderColor: (theme) => theme.palette.error.main,
        }}
      >
        <SunEditor
          lang={ko}
          name="content"
          defaultValue={board?.content}
          width="100%"
          height="calc(100vh - 300px)"
          setOptions={{ buttonList: buttonList.complex.slice(0, -1) }}
          placeholder="내용을 입력해주세요."
          setDefaultStyle={`min-height: 300px;`}
          onChange={(content) => setData((data) => ({ ...data, content }))}
        />
      </Stack>
      {!!errors['content'] && (
        <FormHelperText error={!!errors['content']}>
          {errors['content']}
        </FormHelperText>
      )}
      {user && (
        <>
          <FormControlLabel
            name="isPrivate"
            checked={data?.isPrivate}
            onChange={handleCheckboxChange}
            control={<Checkbox />}
            label="익명으로 게시"
          />
          {isMaster && (
            <FormControlLabel
              name="isNotice"
              checked={data?.isNotice}
              onChange={handleCheckboxChange}
              control={<Checkbox />}
              label="상단 고정"
            />
          )}
        </>
      )}
      {!user && (
        <CustomInput
          name="password"
          type="password"
          variant="filled"
          label={!!board ? '비밀번호 확인' : '비밀번호'}
          autoComplete="new-password"
          fullWidth
          required
          value={data['password'] || ''}
          onChange={handleChange}
          errors={errors}
        />
      )}
      <Divider flexItem sx={{ my: 3 }} />
      <Stack direction="row" gap={2}>
        <Button
          type="button"
          variant="outlined"
          color="inherit"
          onClick={() => {
            if (board) {
              navigate(`/board/${board.category}/${board.id}`);
            } else {
              navigate(`/board/${data.category}`);
            }
          }}
        >
          취소
        </Button>
        <Button type="submit" variant="outlined" color="inherit">
          작성
        </Button>
      </Stack>
    </Stack>
  );
};

export default WriteBoardPage;

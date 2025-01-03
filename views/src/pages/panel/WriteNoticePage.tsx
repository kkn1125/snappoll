import { createNotice } from '@apis/panel/createNotice';
import CustomInput from '@components/atoms/CustomInput';
import HistoryPrevBtn from '@components/atoms/HistoryPrevBtn';
import useModal from '@hooks/useModal';
import useValidate from '@hooks/useValidate';
import {
  Box,
  Button,
  Container,
  Divider,
  FormHelperText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import {
  ChangeEvent,
  FormEvent,
  SyntheticEvent,
  useEffect,
  useState,
} from 'react';
import SunEditor, { buttonList } from 'suneditor-react';
import { ko } from 'suneditor/src/lang';

interface WriteNoticePageProps {}
const WriteNoticePage: React.FC<WriteNoticePageProps> = () => {
  const { openModal } = useModal();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const createNoticeMutation = useMutation({
    mutationFn: createNotice,
    onSuccess: (data, variables, context) => {
      openModal({
        info: {
          title: '안내',
          content: '메일 양식 작성이 완료되었습니다.',
        },
      });
    },
  });
  const [data, setData] = useState<
    Omit<SnapNotice, 'id' | 'createdAt' | 'updatedAt'>
  >({
    title: '',
    content: '',
    type: 'Normal',
    cover: null,
  });
  const { validate, validated, setValidated, errors } = useValidate(data);

  useEffect(() => {
    if (validated) {
      validate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validated]);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const name = e.target.name;
    const value = e.target.value;
    setData((data) => ({ ...data, [name]: value }));
  }

  function handleSelectChange(e: SelectChangeEvent) {
    const name = e.target.name;
    const value = e.target.value;
    setData((data) => ({ ...data, [name]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setValidated(true);
    if (!validate()) {
      return;
    }

    createNoticeMutation.mutate(data);
  }

  return (
    <Container maxWidth={isMdUp ? 'md' : 'xs'}>
      <Stack direction="row" justifyContent="flex-start" my={2}>
        <HistoryPrevBtn />
      </Stack>
      <Stack
        flex={1}
        gap={2}
        component="form"
        noValidate
        onSubmit={handleSubmit}
      >
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
        <Select
          name="type"
          value={data['type'] || 'Normal'}
          size="small"
          onChange={handleSelectChange}
        >
          <MenuItem value="Normal">일반</MenuItem>
          <MenuItem value="Batch">예약</MenuItem>
        </Select>
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
            defaultValue={data.content}
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
        <Divider flexItem sx={{ my: 3 }} />
        <Stack direction="row" gap={2}>
          <Button
            type="button"
            variant="outlined"
            color="inherit"
            onClick={() => {
              window.history.back();
            }}
          >
            취소
          </Button>
          <Button type="submit" variant="outlined" color="inherit">
            작성
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
};

export default WriteNoticePage;

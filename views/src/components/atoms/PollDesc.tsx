import { TextField } from '@mui/material';
import { ChangeEvent, memo } from 'react';

interface PollDescProps {
  pollDesc?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
const PollDesc: React.FC<PollDescProps> = ({ pollDesc = '', onChange }) => {
  return (
    <TextField
      name="desc"
      size="small"
      multiline
      rows={5}
      variant="filled"
      value={pollDesc}
      onChange={onChange}
      sx={{
        ['& .MuiInputBase-root']: {
          pt: 1,
          ['& textarea']: {
            minHeight: 'max-content',
            height: 'auto',
            resize: 'vertical', // 크기 조정 활성화
            overflow: 'auto', // 스크롤 동작 제어
          },
          height: 'auto',
        },
      }}
    />
  );
};

export default memo(PollDesc);

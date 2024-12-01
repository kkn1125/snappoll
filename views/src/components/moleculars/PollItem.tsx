import QuestionItem from '@components/atoms/QuestionItem';
import { SnapPoll } from '@models/SnapPoll';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  MenuItem,
  Select,
  Stack,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import { ChangeEvent, useEffect, useState } from 'react';

const LegendText = styled((props) => <Typography {...props} />)``;

interface PollItemProps {
  poll: SnapPoll;
  onChange: (id: string, value: string | boolean) => void;
  onChangeCheckbox: (id: string, index: number, checked: boolean) => void;
  onChangeEtc: (id: string, value: string) => void;
}
const PollItem: React.FC<PollItemProps> = ({
  poll,
  onChange,
  onChangeCheckbox,
  onChangeEtc,
}) => {
  // const [etcActive, setEtcActive] = useState(false);

  // useEffect(() => {
  //   if (poll.items.length === 1 && poll.items[0].value) {
  //     setEtcActive(true);
  //   } else {
  //     setEtcActive(false);
  //   }
  // }, []);

  return (
    <Stack>
      {poll.question.map((question) => (
        <QuestionItem key={question.id} question={question} />
      ))}{' '}
    </Stack>
  );
};

export default PollItem;

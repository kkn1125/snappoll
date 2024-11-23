import useSnapPoll from '@hooks/useSnapPoll';
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
import { Poll } from '@utils/Poll';

const LegendText = styled((props) => <Typography {...props} />)``;

interface PollItemProps {
  poll: Poll<'text' | 'option' | 'checkbox'>;
}
const PollItem: React.FC<PollItemProps> = ({ poll }) => {
  const { updateSnapPoll } = useSnapPoll();
  switch (poll.type) {
    case 'text':
      return (
        <Stack gap={1}>
          <Typography fontSize={24} fontWeight={700}>
            {poll.label}
            {poll.required && '*'}
          </Typography>
          <FormControl
            required={poll.required}
            component="fieldset"
            variant="standard"
            sx={{ gap: 2 }}
          >
            <FormLabel
              component={LegendText}
              className="font-maru"
              sx={{
                color: 'CaptionText',
                fontWeight: 500,
              }}
            >
              {poll.desc}
            </FormLabel>
            <TextField
              required={poll.required}
              name={poll.name}
              placeholder={poll.placeholder}
              value={poll.value || poll.default}
            />
          </FormControl>
        </Stack>
      );
    case 'option':
      return (
        <Stack gap={1}>
          <Typography fontSize={24} fontWeight={700}>
            {poll.label}
            {poll.required && '*'}
          </Typography>
          <FormControl
            required={poll.required}
            component="fieldset"
            variant="standard"
            sx={{ gap: 2 }}
          >
            <FormLabel
              component={LegendText}
              className="font-maru"
              sx={{ color: 'CaptionText', fontWeight: 500 }}
            >
              {poll.desc}
            </FormLabel>

            <Select value={poll.value || poll.default} required={poll.required}>
              {(poll as Poll<'option'>).items.map((item) => (
                <MenuItem key={item.name} value={item.value}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      );
    case 'checkbox':
      return (
        <Stack gap={1}>
          <Typography fontSize={24} fontWeight={700}>
            {poll.label}
            {poll.required && '*'}
          </Typography>

          <Stack direction="row" gap={1}>
            <FormControl
              required={poll.required}
              component="fieldset"
              variant="standard"
              sx={{ gap: 2 }}
            >
              <FormLabel
                component={LegendText}
                className="font-maru"
                sx={{ color: 'CaptionText', fontWeight: 500 }}
              >
                {poll.desc}
              </FormLabel>
              <FormGroup>
                {(poll as Poll<'checkbox'>).items.map((item, i) => (
                  <FormControlLabel
                    key={item.name + i}
                    label={item.name}
                    control={
                      <Checkbox
                        name={item.name}
                        checked={
                          item.checked ||
                          (poll as Poll<'checkbox'>).default ||
                          false
                        }
                      />
                    }
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Stack>
        </Stack>
      );
    default:
      return <TextField />;
  }
};

export default PollItem;

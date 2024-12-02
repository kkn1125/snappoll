import { Box, keyframes, Stack } from '@mui/material';

interface CheckedComponentProps {
  checked: boolean;
  size?: number;
}
const CheckedComponent: React.FC<CheckedComponentProps> = ({
  checked = false,
  size = 15,
}) => {
  const checkRatio = 9 / 16;
  const show = keyframes`
    0%   {
      opacity: 0;
      width: 0px;
      height: 0px;
    }
    50%   {
      opacity: 1;
      width: ${size * checkRatio}px;
      height: 0px;
    }
    100% {
      opacity: 1;
      width: ${size * checkRatio}px;
      height: ${size}px;
    }
  `;
  const close = keyframes`
    0% {
      opacity: 1;
      width: ${size * checkRatio}px;
      height: ${size}px;
    }
    50%   {
      opacity: 1;
      width: ${size * checkRatio}px;
      height: 0px;
    }
    100%   {
      opacity: 0;
      width: 0px;
      height: 0px;
    }
  `;

  return (
    <Stack direction="row" width={size * 2.5} height={size} alignItems="center">
      <Box
        sx={{
          opacity: checked ? 1 : 0,
          transform: 'rotate(45deg)',
          borderRightStyle: 'solid',
          borderBottomStyle: 'solid',
          borderRightColor: 'green',
          borderBottomColor: 'green',
          borderRightWidth: 3,
          borderBottomWidth: 3,
          animation: `${checked ? show : close} 150ms linear both`,
        }}
      />
    </Stack>
  );
};

export default CheckedComponent;

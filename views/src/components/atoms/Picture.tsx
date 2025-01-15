import { Box, Paper, Stack, SxProps, Typography } from '@mui/material';
import { isNil } from '@utils/isNil';

interface PictureProps {
  top?: number | string;
  left?: number | string;
  width?: number | string;
  height?: number | string;
  filename: string;
  label?: string;
  img: {
    width?: number | string;
    height?: number | string;
  };
  sx?: SxProps;
}
const Picture: React.FC<PictureProps> = ({
  top,
  left,
  width,
  height,
  filename,
  label,
  img,
  sx,
}) => {
  return (
    <Paper className="img-wrap" elevation={5} sx={sx}>
      <Stack
        sx={{
          position: 'relative',
          width: 'fit-content',
          ...(!isNil(top) &&
            !isNil(left) &&
            !isNil(width) &&
            !isNil(height) && {
              ['&::before']: {
                content: '""',
                position: 'absolute',
                border: '2px dashed red',
                boxShadow: 'inset 0 0 0 9999999px #ff000026',
                borderRadius: '0.3em',
                top,
                left,
                width,
                height,
              },
            }),
        }}
      >
        <Box
          component="img"
          src={import.meta.resolve(`/images${filename}.png`)}
          alt={filename}
          width={{ xs: '100%', md: img.width }}
          height={{ xs: 'auto', md: img.height }}
        />
      </Stack>
      {label && (
        <Typography
          fontWeight={700}
          align="center"
          sx={{
            p: 1,
            background: (theme) => theme.palette.background.marketing,
          }}
        >
          {label}
        </Typography>
      )}
    </Paper>
  );
};

export default Picture;

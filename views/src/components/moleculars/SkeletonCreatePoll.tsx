import {
  Button,
  Divider,
  Paper,
  Skeleton,
  SpeedDial,
  SpeedDialIcon,
  Stack,
} from '@mui/material';

interface SkeletonCreatePollProps {
  mode?: 'create' | 'edit';
}
const SkeletonCreatePoll: React.FC<SkeletonCreatePollProps> = ({
  mode = 'create',
}) => {
  return (
    <Stack gap={2}>
      <Stack direction="row">
        <Button variant="contained" color="inherit">
          이전으로
        </Button>
      </Stack>

      <Stack gap={3}>
        <Skeleton variant="rounded" animation="wave" width={150} height={42} />
        <Skeleton variant="rounded" animation="wave" height={56} />
        <Skeleton variant="rounded" animation="wave" height={148} />

        <Stack gap={1}>
          <Skeleton variant="rounded" animation="wave" width={50} height={30} />
          <Stack direction="row" gap={1} alignItems="center">
            <Skeleton
              variant="rounded"
              animation="wave"
              width={260}
              height={40}
            />
            <Skeleton
              variant="rounded"
              animation="wave"
              width={150}
              height={38}
            />
          </Stack>
        </Stack>
      </Stack>

      <Divider />

      {mode === 'edit' && (
        <Stack gap={3}>
          <Paper sx={{ p: 3 }}>
            <Stack gap={2}>
              <Stack
                direction="row"
                gap={2}
                justifyContent="space-between"
                alignItems="center"
                flexWrap="wrap"
              >
                <Skeleton
                  variant="rounded"
                  animation="wave"
                  height={41.88}
                  sx={{ flex: 1 }}
                />
                <Skeleton
                  variant="rounded"
                  animation="wave"
                  width={100}
                  height={40}
                />
                <Skeleton
                  variant="circular"
                  animation="wave"
                  width={40}
                  height={40}
                />
              </Stack>
              <Skeleton variant="rounded" animation="wave" height={102} />
              <Stack direction="row" gap={1} alignItems="center">
                <Skeleton
                  variant="rounded"
                  animation="wave"
                  width={34}
                  height={14}
                  sx={{ m: 1 }}
                />
                <Skeleton
                  variant="rounded"
                  animation="wave"
                  width={61.8}
                  height={24}
                />
              </Stack>
            </Stack>
          </Paper>

          <Skeleton variant="rounded" animation="wave" height={46.83} />
        </Stack>
      )}

      <SpeedDial
        ariaLabel="SpeedDial basic example"
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      />
    </Stack>
  );
};

export default SkeletonCreatePoll;

import {
  Container,
  Divider,
  List,
  ListItem,
  ListItemButton,
  Skeleton,
  Stack,
  Toolbar,
} from '@mui/material';

interface SkeletonResponseListProps {}
const SkeletonResponseList: React.FC<SkeletonResponseListProps> = () => {
  return (
    <Container maxWidth="md">
      <Toolbar />
      <Stack gap={3}>
        <List>
          {Array.from(Array(5), (_, index) => (
            <ListItem key={index}>
              <ListItemButton>
                <Stack direction="row" gap={3} flexWrap="wrap">
                  <Skeleton variant="rounded" width={9.18} height={24} />
                  <Skeleton variant="rounded" height={24} sx={{ flex: 1 }} />
                  <Skeleton variant="rounded" width={78.42} height={24} />
                  <Skeleton variant="rounded" width={132.34} height={24} />
                </Stack>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Stack direction="row" justifyContent="center" gap={1}>
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="circular" width={32} height={32} />
        </Stack>
        <Divider />
        <Skeleton variant="rounded" height={42.25} />
      </Stack>
      <Toolbar />
    </Container>
  );
};

export default SkeletonResponseList;

import {
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Skeleton,
  Stack,
} from '@mui/material';

interface SkeletonGraphListProps {}
const SkeletonGraphList: React.FC<SkeletonGraphListProps> = () => {
  return (
    <Container maxWidth="md">
      <Stack>
        <List>
          {Array.from(Array(5), (_, i) => (
            <ListItem key={i}>
              <ListItemButton sx={{ display: 'flex', gap: 2.5 }}>
                <Stack
                  justifyContent="center"
                  alignItems="center"
                  width={50}
                  minWidth={50}
                  height={50}
                  minHeight={50}
                  sx={{
                    borderRadius: '100%',
                    boxShadow: '3px 3px 5px 0 #00000056',
                  }}
                >
                  <Skeleton variant="circular" width={50} height={50} />
                </Stack>
                <ListItemText
                  primary={
                    <Skeleton
                      animation="wave"
                      variant="rounded"
                      height={18}
                      sx={{ maxWidth: 246, flex: 1, my: 0.4 }}
                    />
                  }
                  secondary={
                    <Skeleton
                      animation="wave"
                      variant="rounded"
                      height={16.2}
                      sx={{ maxWidth: 292.32, flex: 1, mb: 0.5 }}
                    />
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Stack direction="row" justifyContent="center" gap={1}>
          <Skeleton
            animation="wave"
            variant="circular"
            width={32}
            height={32}
          />
          <Skeleton
            animation="wave"
            variant="circular"
            width={32}
            height={32}
          />
          <Skeleton
            animation="wave"
            variant="circular"
            width={32}
            height={32}
          />
          <Skeleton
            animation="wave"
            variant="circular"
            width={32}
            height={32}
          />
          <Skeleton
            animation="wave"
            variant="circular"
            width={32}
            height={32}
          />
        </Stack>
      </Stack>
    </Container>
  );
};

export default SkeletonGraphList;

import {
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Skeleton,
  Stack,
  Toolbar,
} from '@mui/material';

interface SkeletonMeListProps {}
const SkeletonMeList: React.FC<SkeletonMeListProps> = () => {
  return (
    <Stack>
      <Toolbar />
      <Container>
        <List>
          <Stack>
            <Stack direction="row" justifyContent="space-between">
              <Skeleton
                animation="wave"
                variant="rounded"
                width={98}
                height={42.25}
              />
              <Skeleton
                animation="wave"
                variant="rounded"
                width={140.34}
                height={42.25}
              />
            </Stack>

            <List>
              {Array.from(Array(5), (_, i) => (
                <ListItem
                  key={i}
                  secondaryAction={
                    <Stack
                      direction="row"
                      gap={1}
                      alignItems="center"
                      flexWrap="wrap"
                    >
                      <Skeleton
                        animation="wave"
                        variant="rounded"
                        width={42.7}
                        height={24}
                      />
                      <Skeleton
                        animation="wave"
                        variant="rounded"
                        width={103.69}
                        height={24}
                      />

                      <Stack direction="row" gap={1}>
                        <Skeleton
                          animation="wave"
                          variant="circular"
                          width={40}
                          height={40}
                        />
                        <Skeleton
                          animation="wave"
                          variant="circular"
                          width={40}
                          height={40}
                        />
                        <Skeleton
                          animation="wave"
                          variant="circular"
                          width={40}
                          height={40}
                        />
                      </Stack>
                    </Stack>
                  }
                  sx={{
                    boxSizing: 'border-box',
                    ['&:not(:last-of-type)']: {
                      borderBottom: '1px solid #eee',
                    },
                    flexDirection: {
                      xs: 'column',
                      md: 'row',
                    },
                    ['.MuiListItemSecondaryAction-root']: {
                      position: { xs: 'static', md: 'auto' },
                      transform: { xs: 'none' },
                    },
                  }}
                >
                  <ListItemButton sx={{ display: 'flex', width: '100%' }}>
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
        </List>
        <Toolbar />
      </Container>
    </Stack>
  );
};

export default SkeletonMeList;

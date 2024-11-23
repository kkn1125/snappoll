import { Button, Paper, Stack } from '@mui/material';
import { useEffect, useState } from 'react';

interface PollOptionWrapperProps {
  children: React.ReactNode;
  noHighlight?: boolean;
}
const PollOptionWrapper: React.FC<PollOptionWrapperProps> = ({
  children,
  noHighlight = false,
}) => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (noHighlight) return;
    setLoaded(true);
    setTimeout(() => {
      setLoaded(false);
    }, 2000);
  }, [noHighlight]);

  return (
    <Paper
      component={Stack}
      elevation={5}
      direction="row"
      gap={3}
      p={3}
      justifyContent="space-between"
      alignItems="flex-start"
      sx={{
        transition: '150ms ease-in-out',
        ...(loaded && {
          boxShadow: (theme) => `0 0 1rem 0 ${theme.palette.info.light}56`,
        }),
      }}
    >
      {children}
      <Button variant="outlined" color="error">
        Del
      </Button>
    </Paper>
  );
};

export default PollOptionWrapper;

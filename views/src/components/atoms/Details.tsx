import { Box, Stack, Typography } from '@mui/material';

interface DetailsProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}
const Details: React.FC<DetailsProps> = ({ title, children, defaultOpen }) => {
  return (
    <Box component="details" open={defaultOpen} sx={{ ml: 3 }}>
      <Typography component="summary" variant="body1" gutterBottom>
        {title}
      </Typography>
      <Stack justifyContent="center" gap={3}>
        {children}
      </Stack>
    </Box>
  );
};

export default Details;

import { BRAND_NAME } from '@common/variables';
import { Stack, Typography } from '@mui/material';

interface FooterProps {}
const Footer: React.FC<FooterProps> = () => {
  return (
    <Stack p={2.5} sx={{ borderTop: '1px solid #eee' }}>
      <Typography align="center">
        &copy; 2024. {BRAND_NAME} All rights reserved.
      </Typography>
    </Stack>
  );
};

export default Footer;

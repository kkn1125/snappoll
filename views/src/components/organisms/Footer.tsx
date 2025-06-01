import { BASE_CLIENT_URL, BRAND_NAME, VERSION } from '@common/variables';
import { Box, Stack, Typography } from '@mui/material';
import { joinElement } from '@utils/joinElement';
import { Link } from 'react-router-dom';
import { Fragment } from 'react/jsx-runtime';

const footerMenu = [
  { name: '서비스 소개', to: `${BASE_CLIENT_URL}/about` },
  { name: '서비스 약관', to: `${BASE_CLIENT_URL}/service-agreement` },
  { name: '개인정보처리방침', to: `${BASE_CLIENT_URL}/privacy-policy` },
  { name: '도움말', to: `${BASE_CLIENT_URL}/help` },
  { name: '유료 서비스 안내', to: `${BASE_CLIENT_URL}/price` },
];

interface FooterProps {}
const Footer: React.FC<FooterProps> = () => {
  return (
    <Stack
      gap={2}
      p={2.5}
      sx={{
        borderTop: '1px solid #eee',
        boxSizing: 'border-box',
        fontSize: '0.9em',
      }}
    >
      <Stack
        direction="row"
        gap={2}
        justifyContent="center"
        width="inherit"
        overflow="auto"
      >
        <Stack direction="row" gap={3} flexWrap="nowrap" p={1}>
          {joinElement(footerMenu).map((footer, i) =>
            footer.name ? (
              <Typography
                key={footer.name}
                component={Link}
                to={footer.to}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  whiteSpace: 'nowrap',
                  fontSize: 'inherit',
                  textDecoration: 'none',
                }}
              >
                {footer.name}
              </Typography>
            ) : (
              <Fragment key={i}>{footer}</Fragment>
            ),
          )}
        </Stack>
      </Stack>
      <Typography align="center" sx={{ fontSize: 'inherit' }}>
        &copy; 2024. {BRAND_NAME} All rights reserved.
      </Typography>
      <Box sx={{ position: 'absolute', bottom: 5, left: 5 }}>
        <Typography variant="caption" color="text.secondary">
          version {VERSION}
        </Typography>
      </Box>
    </Stack>
  );
};

export default Footer;

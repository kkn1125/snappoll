import { guestMainImage, illu01, illu02 } from '@common/variables';
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';

import { Link } from 'react-router-dom';

interface GuestHomePageProps {}
const GuestHomePage: React.FC<GuestHomePageProps> = () => {
  const screenRatio = 3 / 4;
  return (
    <Stack>
      {/* section 01 */}
      <Stack
        position="relative"
        height={`calc(100vh * ${screenRatio})`}
        overflow="hidden"
      >
        <Box
          component="img"
          src={guestMainImage}
          alt="mainCover"
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            zIndex: -1,
          }}
        />
        <Toolbar />
        <Stack alignItems="center" gap={1}>
          <Typography
            align="center"
            fontSize={32}
            fontWeight={700}
            gutterBottom
          >
            간편한 모두의 설문조사
          </Typography>

          <Typography
            className="font-maru"
            maxWidth={500}
            align="center"
            fontWeight={500}
            sx={{ whiteSpace: 'balance' }}
          >
            쉽고 간편하게 만들어 공유하는 설문조사.
          </Typography>
          <Typography
            className="font-maru"
            maxWidth={500}
            align="center"
            fontWeight={500}
            sx={{ whiteSpace: 'balance' }}
          >
            설문 결과도 그래프로 간편하게 보세요!
          </Typography>
        </Stack>
      </Stack>

      {/* section 02 */}
      <Container>
        <Stack>
          <Toolbar />
          <Typography align="center" fontSize={32} fontWeight={700}>
            왜 SnapPoll인가?
          </Typography>
          <Toolbar />
          <Stack flex={1}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              justifyContent="space-between"
              alignItems={{ xs: 'center', md: 'space-between' }}
              gap={5}
              flexWrap="wrap"
            >
              {/* survey */}
              <Paper component={Stack} flex={1} maxWidth={300} p={3}>
                <Stack
                  minHeight={170}
                  alignItems="center"
                  sx={{ float: 'right' }}
                >
                  <Box
                    component="img"
                    src={illu01}
                    alt="item01"
                    width={150}
                    height={150}
                    sx={{
                      objectFit: 'cover',
                      objectPosition: 'center',
                    }}
                  />
                </Stack>
                <Typography fontSize={24} fontWeight={700}>
                  Poll
                </Typography>
                <Typography minHeight={80} fontSize={14} fontWeight={500}>
                  설문조사를 더 쉽고 스마트하게 만들어보세요. 복잡한 설정 없이
                  3분 만에 전문적인 설문지를 제작하고, 실시간으로 응답을 수집할
                  수 있습니다.
                </Typography>
              </Paper>
              {/* graph */}
              <Paper component={Stack} flex={1} maxWidth={300} p={3}>
                <Stack
                  minHeight={170}
                  alignItems="center"
                  sx={{ float: 'left' }}
                >
                  <Box
                    component="img"
                    src={illu02}
                    alt="item02"
                    width={150}
                    height={150}
                    sx={{
                      objectFit: 'cover',
                      objectPosition: 'center',
                    }}
                  />
                </Stack>
                <Typography fontSize={24} fontWeight={700}>
                  Graph
                </Typography>
                <Typography minHeight={80} fontSize={14} fontWeight={500}>
                  다양한 차트와 그래프로 한눈에 보는 분석 리포트를 제공합니다.
                  응답자들의 의견을 직관적으로 파악하고 인사이트를 도출하세요.
                </Typography>
              </Paper>
              {/* share */}
              <Paper component={Stack} flex={1} maxWidth={300} p={3}>
                <Stack
                  minHeight={170}
                  alignItems="center"
                  sx={{ float: 'right' }}
                >
                  <Box
                    component="img"
                    src={illu01}
                    alt="item03"
                    width={150}
                    height={150}
                    sx={{
                      objectFit: 'cover',
                      objectPosition: 'center',
                    }}
                  />
                </Stack>
                <Typography fontSize={24} fontWeight={700}>
                  Share
                </Typography>
                <Typography minHeight={80} fontSize={14} fontWeight={500}>
                  설문 링크 하나로 누구나 쉽게 참여할 수 있습니다. 이메일,
                  메신저, SNS 등 다양한 채널을 통해 설문을 공유하고 더 많은
                  의견을 모아보세요.
                </Typography>
              </Paper>
            </Stack>
          </Stack>
        </Stack>
      </Container>

      {/* section 03 */}
      <Container>
        <Stack>
          <Toolbar />
          <Typography
            align="center"
            fontSize={32}
            fontWeight={700}
            gutterBottom
          >
            어떻게 하면 되나요?
          </Typography>
          <Box flex={1}>
            <Typography fontSize={20} align="center">
              지금 바로 무료로 시작하고, 설문조사의 새로운 경험을 만나보세요.
            </Typography>
          </Box>
          <Toolbar />
          <Stack alignItems="center">
            <Button
              component={Link}
              variant="contained"
              size="large"
              to="/user/login"
              state={{ type: 'required' }}
            >
              설문조사 만들기
            </Button>
          </Stack>
          <Toolbar />
        </Stack>
      </Container>
    </Stack>
  );
};

export default GuestHomePage;

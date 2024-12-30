import Pricing from '@components/organisms/Pricing';
import {
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Toolbar,
  Typography,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getPlans } from '@apis/plan/getPlans';
import DataListTable from '@components/moleculars/DataListTable';

interface SubscribeProps {}
const Subscribe: React.FC<SubscribeProps> = () => {
  const { data } = useQuery<
    SnapResponseType<{ plans: Plan[]; subscribers: number }>
  >({ queryKey: ['plans'], queryFn: getPlans });
  const plans = data?.data.plans;
  const subscribers = data?.data.subscribers;

  return (
    <Container sx={{ flex: 1 }}>
      <Stack alignItems="center">
        <Typography fontSize={32} align="center" gutterBottom>
          요금제 유형
        </Typography>
        <Typography
          fontSize={20}
          fontWeight={300}
          align="center"
          minWidth={150}
          width="90vw"
          maxWidth={1000}
          gutterBottom
          sx={{ wordBreak: 'auto-phrase' }}
        >
          요금제는 사용자의 부담을 최소화하기 위해 구성되었습니다. 서비스를 일부
          무료로 사용할 수 있는 Free Plan부터 전문적으로 통계 데이터를 다루는
          Enterprise Plan까지 4가지 유형의 요금제가 있습니다.
          <br />
          <br />
          지금 무료로 사용해보세요!
        </Typography>

        <Toolbar />

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          width="100%"
          justifyContent="center"
          p={2}
          gap={3}
        >
          {plans?.map((plan) => <Pricing key={plan.id} plan={plan} />)}
        </Stack>

        <Toolbar />

        <Stack direction="row" width="100%">
          <TableContainer component={Paper}>
            <Table>
              <TableHead
                sx={{
                  whiteSpace: 'nowrap',
                  backgroundColor: (theme) =>
                    theme.palette.background.marketing,
                }}
              >
                <TableRow>
                  <TableCell
                    width={270}
                    align="center"
                    component="th"
                    scope="column"
                    sx={{ fontSize: 16, fontWeight: 700 }}
                  >
                    구분
                  </TableCell>
                  {plans?.map((plan) => (
                    <TableCell
                      key={plan.id}
                      align="center"
                      component="th"
                      scope="column"
                      sx={{ fontSize: 16, fontWeight: 700 }}
                    >
                      {plan.name}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody sx={{ whiteSpace: 'nowrap' }}>
                <TableRow hover>
                  <TableCell variant="head">요금제 기간</TableCell>
                  {plans?.map((plan) => (
                    <TableCell key={plan.id} align="center">
                      {plan.planType === 'Free'
                        ? ['❌'].join(', ')
                        : ['월', '년'].join(' 또는 ')}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow hover>
                  <TableCell variant="head">비용 (월단위)</TableCell>
                  {plans?.map((plan) => (
                    <TableCell key={plan.id} align="center">
                      {plan.price.toLocaleString('ko-KR', {
                        style: 'currency',
                        currency: 'KRW',
                      })}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow hover>
                  <TableCell variant="head">비용 (연단위)</TableCell>
                  {plans?.map((plan) => (
                    <TableCell key={plan.id} align="center">
                      {(plan.price * 12).toLocaleString('ko-KR', {
                        style: 'currency',
                        currency: 'KRW',
                      })}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow hover>
                  <TableCell variant="head">설문, 투표 제작</TableCell>
                  {plans?.map((plan, i) => (
                    <TableCell key={plan.id} align="center">
                      {[3, 7, 12, 30][i]}개
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow hover>
                  <TableCell variant="head">응답자 제한</TableCell>
                  {plans?.map((plan, i) => (
                    <TableCell key={plan.id} align="center">
                      {[100, 200, 500, 5000][i].toLocaleString('ko-KR')}명
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow hover>
                  <TableCell variant="head">
                    설문, 투표 공유 링크 제작
                  </TableCell>
                  {plans?.map((plan) => (
                    <TableCell key={plan.id} align="center">
                      ✅
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow hover>
                  <TableCell variant="head">통계 데이터</TableCell>
                  {plans?.map((plan, i) => (
                    <TableCell key={plan.id} align="center">
                      {['❌', '✅', '✅', '✅'][i]}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow hover>
                  <TableCell variant="head">응답자 추첨</TableCell>
                  {plans?.map((plan, i) => (
                    <TableCell key={plan.id} align="center">
                      {['❌', '✅', '✅', '✅'][i]}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow hover>
                  <TableCell variant="head">질문 비교 그래프</TableCell>
                  {plans?.map((plan, i) => (
                    <TableCell key={plan.id} align="center">
                      {['❌', '❌', '✅', '✅'][i]}
                    </TableCell>
                  ))}
                </TableRow>
                <TableRow hover>
                  <TableCell variant="head">
                    통계 데이터 내보내기 지원(Excel, CSV)
                  </TableCell>
                  {plans?.map((plan, i) => (
                    <TableCell key={plan.id} align="center">
                      {['❌', '❌', '❌', '✅'][i]}
                    </TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Stack>
      </Stack>
    </Container>
  );
};

export default Subscribe;

import Pricing from '@components/organisms/Pricing';
import { Container, Stack, Toolbar, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getPlans } from '@apis/plan/getPlans';

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
          justifyContent="center"
          gap={3}
        >
          {plans?.map((plan) => <Pricing key={plan.id} plan={plan} />)}
        </Stack>
      </Stack>
    </Container>
  );
};

export default Subscribe;

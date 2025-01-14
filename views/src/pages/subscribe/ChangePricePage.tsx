import { snapApi } from '@apis/index';
import { CLIENT_KEY } from '@common/variables';
import useToken from '@hooks/useToken';
import { Button, Divider, Paper, Stack, Typography } from '@mui/material';
import * as TossPayments from '@tosspayments/tosspayments-sdk';
import { useLocation } from 'react-router-dom';

interface ChangePricePageProps {}
const ChangePricePage: React.FC<ChangePricePageProps> = () => {
  const { user } = useToken();
  const { state } = useLocation();
  const plan = state?.plan as Plan;

  function getTotalPrice(price: number, discount: number) {
    return (price * (100 - discount)) / 100;
  }

  async function handlePayment() {
    if (!user || !plan) return;

    const clientKey = CLIENT_KEY;
    const customerKey = 'dyeW2_HTNDXQcnI86GNPS'; // 비회원은 ANONYMOUS
    const tossPayments = await TossPayments.loadTossPayments(clientKey);
    const payment = tossPayments.payment({ customerKey });
    await snapApi.post('/plans/subscribe/prepare', {
      amount: getTotalPrice(plan.price, plan.discount),
      planName: plan.name,
    });

    await payment.requestBillingAuth({
      method: 'CARD',
      successUrl: window.location.origin + `/price/change/billing`,
      failUrl: window.location.origin + '/price/change/fail',
      customerEmail: user.email,
      customerName: user.username,
    });
  }

  if (!plan) <></>;

  return (
    <Stack
      gap={2}
      direction={{ xs: 'column', md: 'row' }}
      justifyContent="center"
      alignItems="center"
    >
      <Stack p={3} gap={2} maxWidth="50vmin" height="100%">
        <Typography fontSize={24} fontWeight={700}>
          플랜 결제 안내
        </Typography>
        <Typography fontSize={15}>
          선택하신 구독 요금제로 결제를 진행합니다.
        </Typography>
        <Typography fontSize={15}>
          결제 취소는 프로필에서 취소할 수 있습니다.
        </Typography>
      </Stack>

      <Paper elevation={5}>
        <Stack
          p={3}
          gap={2}
          alignItems="center"
          minWidth={200}
          width="50vmin"
          maxWidth="50vmin"
        >
          <Typography fontSize={24} fontWeight={700} color="info">
            {plan.name}
          </Typography>
          <Typography fontSize={20} fontWeight={700} color="info">
            {plan.planType} 유형
          </Typography>
          <Typography fontSize={20} fontWeight={700}>
            {getTotalPrice(plan.price, plan.discount).toLocaleString('ko-KR', {
              currency: 'KRW',
              style: 'currency',
            })}
            원
          </Typography>
          <Typography fontSize={16} fontWeight={200}>
            {plan.description}
          </Typography>
          <Divider flexItem />
          {plan.feature?.map((feat) => (
            <Typography key={feat.id} fontSize={16} fontWeight={200}>
              {feat.feature}
            </Typography>
          ))}
          <Button
            id="payment-button"
            variant="contained"
            onClick={handlePayment}
          >
            결제하기
          </Button>
        </Stack>
      </Paper>
    </Stack>
  );
};

export default ChangePricePage;

import { snapApi } from '@apis/index';
import useLogger from '@hooks/useLogger';
import { Box, Button, Stack, Toolbar, Typography } from '@mui/material';
import { useCallback, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

interface PricePaymentBillingPageProps {}
const PricePaymentBillingPage: React.FC<PricePaymentBillingPageProps> = () => {
  const { debug } = useLogger('PricePaymentB');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const authKey = searchParams.get('authKey');
  const customerKey = searchParams.get('customerKey');
  const getBuillingKey = useCallback(async () => {
    if (authKey && customerKey) {
      try {
        const { data } = await snapApi
          .post(
            `/plans/subscribe/builling`,
            {
              customerKey,
              authKey,
            },
            {
              timeout: 30 * 1000,
            },
          )
          .then(({ data }) => {
            const bodyData = data.data;
            debug(bodyData);
            const {
              mId,
              authenticatedAt,
              method,
              billingKey,
              cardCompany,
              cardNumber,
              card,
            } = bodyData;
            return snapApi.post('/plans/subscribe/builling/confirm', {
              billingKey,
              customerKey,
              taxFreeAmount: 0,
              taxExemptionAmount: 0,
            });
          });

        if (!data.ok) {
          navigate('/price/change/fail', {
            state: {
              message: '결제에 문제가 발생했습니다. 다시 시도해주세요.',
            },
          });
        }
        const bodyData = data.data as SuccessPayment;
        navigate('/price/change/success', {
          state: {
            billing: bodyData,
            message: '결제가 완료되었습니다.',
          },
        });
      } catch (error: any) {
        navigate('/price/change/fail', {
          state: {
            message: error.response.data.errorCode.message,
          },
        });
      }
    }
  }, [authKey, customerKey, navigate]);

  useEffect(() => {
    getBuillingKey();
  }, [getBuillingKey, searchParams]);

  return (
    <Stack justifyContent="center" alignItems="center">
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        gap={2}
      >
        <Box
          component="img"
          src={import.meta.resolve('/images/loading.webp')}
          alt="loading"
          width={150}
          height={150}
        />
        <Typography fontSize={32} fontWeight={700}>
          결제를 진행 중입니다.
        </Typography>
      </Stack>
      <Toolbar />
      <Button variant="contained" component={Link} to="/">
        메인으로
      </Button>
    </Stack>
  );
};

export default PricePaymentBillingPage;

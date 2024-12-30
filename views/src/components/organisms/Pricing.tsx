import useModal from '@hooks/useModal';
import useToken from '@hooks/useToken';
import { Button, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

interface PricingProps {
  plan: Plan;
}
const Pricing: React.FC<PricingProps> = ({ plan }) => {
  const { user } = useToken();
  const navigate = useNavigate();
  const { openModal, openInteractiveModal } = useModal();
  const userSubscription = useMemo(() => {
    if (user) {
      return user.subscription;
    }
    return undefined;
  }, [user]);
  const isFree = plan.planType === 'Free';
  function handleRequireSignup(plan: Plan) {
    if (userSubscription?.planId === plan.id) {
      openModal({
        info: {
          title: '구독',
          content: '이미 구독중인 플랜입니다.',
        },
      });
      return;
    }

    openInteractiveModal({
      content: userSubscription
        ? [
            `현재 ${userSubscription.plan?.name}을 구독 중입니다.`,
            `${plan.name}으로 변경하시겠습니까?`,
          ]
        : isFree
          ? [
              '무료로 시작하기 위해 회원가입이 필요합니다.',
              '회원가입 페이지로 이동하시겠습니까?',
            ]
          : [
              `${plan.name}을 구독하기 위해 회원가입이 필요합니다.`,
              '회원가입 페이지로 이동하시겠습니까?',
            ],
      callback: () => {
        if (userSubscription) {
          navigate('/price/change');
        } else {
          navigate('/auth/signup');
        }
      },
    });
  }

  return (
    <Stack
      flex={1}
      minWidth={200}
      width="100vw"
      maxWidth="100%"
      justifyContent="space-between"
      gap={5}
      p={2}
      sx={{
        borderRadius: 3,
        transition: '150ms ease',
        borderColor: '#00000026',
        borderWidth: 5,
        borderStyle: 'solid',
        ['&:hover']: {
          borderColor: (theme) => theme.palette.text.secondary,
          transform: 'translate(-5px, -5px)',
          boxShadow: ' 5px 5px 7px -5px #000000',
        },
      }}
    >
      <Stack gap={2}>
        <Typography fontSize={24} fontWeight={700}>
          {plan.name}
        </Typography>
        <Typography fontSize={15} fontWeight={400} color="textSecondary">
          {plan.description}
        </Typography>
        <Typography fontSize={28} fontWeight={700}>
          {plan.price.toLocaleString('ko-KR', {
            style: 'currency',
            currency: 'KRW',
          })}
          /월
        </Typography>
        <Stack gap={1}>
          {plan.feature?.map((feature) => (
            <Typography
              key={feature.id}
              fontSize={14}
              fontWeight={400}
              color="textSecondary"
            >
              - {feature.feature}
            </Typography>
          ))}
        </Stack>
      </Stack>
      <Button
        variant={isFree ? 'contained' : 'outlined'}
        sx={{ fontSize: 16 }}
        onClick={() => handleRequireSignup(plan)}
      >
        {userSubscription?.planId === plan.id
          ? '구독 중'
          : userSubscription
            ? '구독하기'
            : isFree
              ? '무료로 시작하기'
              : '구독하기'}
      </Button>
    </Stack>
  );
};

export default Pricing;

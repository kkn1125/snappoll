import useModal from '@hooks/useModal';
import useToken from '@hooks/useToken';
import { Badge, Button, Stack, Typography } from '@mui/material';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

interface PricingProps {
  plan: Plan;
}
const Pricing: React.FC<PricingProps> = ({ plan }) => {
  const { user } = useToken();
  const navigate = useNavigate();
  const { openModal, openInteractiveModal } = useModal();
  const isMyPlan = useMemo(() => {
    return user?.subscription.plan?.id === plan.id;
  }, [plan, user]);

  const userSubscription = useMemo(() => {
    if (user) {
      return user.subscription;
    }
    return undefined;
  }, [user]);
  const isFree = plan.planType === 'Free';
  function handleRequireSignup(plan: Plan) {
    /* 현재 결재 기능 연동이 테스트로 연결되어 있어 추후 개봉 */
    openModal({
      info: {
        title: '구독 안내',
        content: '준비중인 기능입니다.',
      },
    });
    return;

    // if (userSubscription?.planId === plan.id) {
    //   openModal({
    //     info: {
    //       title: '구독 안내',
    //       content: '이미 구독중인 플랜입니다.',
    //     },
    //   });
    //   return;
    // }

    // openInteractiveModal({
    //   content: userSubscription
    //     ? [
    //         `현재 ${userSubscription.plan?.name}을 구독 중입니다.`,
    //         `${plan.name}으로 변경하시겠습니까?`,
    //       ]
    //     : isFree
    //       ? [
    //           '무료로 시작하기 위해 회원가입이 필요합니다.',
    //           '회원가입 페이지로 이동하시겠습니까?',
    //         ]
    //       : [
    //           `${plan.name}을 구독하기 위해 회원가입이 필요합니다.`,
    //           '회원가입 페이지로 이동하시겠습니까?',
    //         ],
    //   callback: () => {
    //     if (userSubscription) {
    //       navigate('/price/change', { state: { plan } });
    //     } else {
    //       navigate('/auth/signup');
    //     }
    //   },
    // });
  }

  return (
    <Stack
      flex={1}
      minWidth={200}
      width="100vw"
      maxWidth="100%"
      sx={{
        borderRadius: 3,
        transition: '150ms ease',
        borderColor: '#00000026',
        borderWidth: 5,
        borderStyle: 'solid',
        boxShadow: (theme) => `inset 0 0 0 9999999px ${'inherit'}`,
        ['&:hover']: {
          borderColor: (theme) => theme.palette.text.secondary,
          transform: 'translate(-5px, -5px)',
          boxShadow: ' 5px 5px 7px -5px #000000',
        },
      }}
    >
      <Badge
        variant="standard"
        color="info"
        badgeContent={isMyPlan ? '✨구독중' : undefined}
        overlap="rectangular"
        slotProps={{
          badge: {
            style: {
              fontSize: 14,
              paddingInline: '5px',
              borderRadius: 5,
              fontSizeAdjust: 'ic-width',
              marginRight: 20,
            },
          },
        }}
        sx={{ height: '100%' }}
      >
        <Stack gap={5} flex={1} p={2} justifyContent="space-between">
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
          {user ? (
            plan.planType !== 'Free' ? (
              <Button
                variant="outlined"
                sx={{ fontSize: 16 }}
                onClick={() => handleRequireSignup(plan)}
              >
                {
                  userSubscription?.planId === plan.id
                    ? '구독중'
                    : userSubscription
                      ? '준비중 입니다.' /* '구독하기' */
                      : isFree
                        ? '무료로 시작하기'
                        : '준비중 입니다.' /* '구독하기' */
                }
              </Button>
            ) : (
              <Button
                variant={isFree ? 'contained' : 'outlined'}
                sx={{ fontSize: 16 }}
                onClick={() =>
                  openModal({
                    info: {
                      title: '구독 안내',
                      content: [
                        '이미 다른 플랜을 구독중입니다.',
                        '기존 구독을 해지하면 자동으로 무료 플랜이 적용됩니다.',
                      ],
                    },
                  })
                }
              >
                다른 플랜을 구독중
              </Button>
            )
          ) : (
            <Button
              variant={isFree ? 'contained' : 'outlined'}
              sx={{ fontSize: 16 }}
              onClick={() => handleRequireSignup(plan)}
            >
              구독하기
            </Button>
          )}
        </Stack>
      </Badge>
    </Stack>
  );
};

export default Pricing;

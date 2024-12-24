import useModal from '@hooks/useModal';
import { Button, Stack, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

interface PricingProps {
  plan: Plan;
}
const Pricing: React.FC<PricingProps> = ({ plan }) => {
  const navigate = useNavigate();
  const { openInteractiveModal } = useModal();
  const isFree = plan.price === 0;

  function handleRequireSignup() {
    openInteractiveModal({
      content: isFree
        ? [
            '무료로 시작하기 위해 회원가입이 필요합니다.',
            '회원가입 페이지로 이동하시겠습니까?',
          ]
        : [
            '구독하기 위해 회원가입이 필요합니다.',
            '회원가입 페이지로 이동하시겠습니까?',
          ],
      callback: () => {
        navigate('/auth/signup');
      },
    });
  }

  return (
    <Stack
      minWidth={250}
      width="100vw"
      maxWidth={300}
      alignItems="center"
      justifyContent="space-between"
      gap={5}
      sx={{
        borderRadius: 3,
        p: 2,
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
        onClick={handleRequireSignup}
      >
        {isFree ? '무료로 시작하기' : '구독하기'}
      </Button>
    </Stack>
  );
};

export default Pricing;

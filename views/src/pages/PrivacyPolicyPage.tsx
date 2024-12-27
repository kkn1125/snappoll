import { getTerms } from '@apis/terms/getTerms';
import { SnapResponse } from '@models/SnapResponse';
import { SnapTerms } from '@models/SnapTerms';
import { Chip, Container, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { formattedDate } from '@utils/formattedDate';
import { useMemo } from 'react';

interface PrivacyPolicyPageProps {}
const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = () => {
  const { data } = useQuery<SnapResponseType<SnapTerms>>({
    queryKey: ['terms'],
    queryFn: getTerms,
  });
  const terms = data?.data;

  const privacy = useMemo(() => {
    return terms?.termsSection.find(
      (section) => section.title === '개인정보처리방침',
    );
  }, [terms]);

  return (
    <Container>
      <Stack gap={2}>
        <Stack direction="row" gap={2}>
          <Chip label={`version ${terms?.version}`} size="small" />
          <Typography>{formattedDate(terms?.createdAt)}</Typography>
        </Stack>
        <Typography sx={{ whiteSpace: 'pre-wrap' }}>
          {privacy?.content}
        </Typography>
      </Stack>
    </Container>
  );
};

export default PrivacyPolicyPage;

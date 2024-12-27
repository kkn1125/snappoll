import { getTerms } from '@apis/terms/getTerms';
import { SnapResponse } from '@models/SnapResponse';
import { SnapTerms } from '@models/SnapTerms';
import { Chip, Container, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { formattedDate } from '@utils/formattedDate';
import { useMemo } from 'react';

interface ServiceAgreementPageProps {}
const ServiceAgreementPage: React.FC<ServiceAgreementPageProps> = () => {
  const { data } = useQuery<SnapResponseType<SnapTerms>>({
    queryKey: ['terms'],
    queryFn: getTerms,
  });
  const terms = data?.data;

  const serviceAgreement = useMemo(() => {
    return terms?.termsSection.find(
      (section) => section.title === '서비스이용동의',
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
          {serviceAgreement?.content}
        </Typography>
      </Stack>
    </Container>
  );
};

export default ServiceAgreementPage;

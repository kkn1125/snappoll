import { Alert, AlertTitle } from '@mui/material';

interface SignupNoticeProps {}
const SignupNotice: React.FC<SignupNoticeProps> = () => {
  return (
    <Alert
      severity="error"
      sx={{ wordBreak: 'auto-phrase', position: 'relative' }}
    >
      <details>
        <AlertTitle component="summary" sx={{ cursor: 'pointer' }}>
          회원 가입 안내
        </AlertTitle>
        SnapPoll은 현재 인증된 사용자만 서비스에 접근할 수 있습니다. 추가 계정이
        필요한 경우 담당자에게 문의하세요. 서비스 개방은 검토 단계에 있으며,
        추후 정상 서비스 예정입니다.
        <br />
        문의 메일:{' '}
        <a href="mailto:devkimsonhelper@gmail.com">devkimsonhelper@gmail.com</a>
      </details>
    </Alert>
  );
};

export default SignupNotice;

import { USER_EMAIL } from '@common/variables';
import Details from '@components/atoms/Details';
import Picture from '@components/atoms/Picture';
import {
  Container,
  Divider,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Link } from 'react-router-dom';

interface HelpPageProps {}
const HelpPage: React.FC<HelpPageProps> = () => {
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  return (
    <Container maxWidth={isMdUp ? 'md' : 'xl'}>
      <Stack
        gap={3}
        sx={{
          wordBreak: 'auto-phrase',
          ['& .img-wrap']: {
            mx: 'auto',
          },
        }}
      >
        {/* <CheckCircleIcon color="success" /> */}
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          1. 서비스 가이드
        </Typography>
        <Details title="1.1 설문 제작">
          <Typography variant="body2" color="text.secondary">
            사이드바에서 "나의 설문지" 탭으로 이동합니다.
          </Typography>
          <Picture
            filename="mypolltab"
            label="설문지 제작"
            top="3%"
            left={0}
            width="100%"
            height="22%"
            img={{
              width: 250,
            }}
          />
          <Typography variant="body2" color="text.secondary">
            "등록하기" 버튼을 클릭합니다.
          </Typography>
          <Picture
            filename="mypolllist"
            label="설문 등록하기"
            top="31.5%"
            left="27.5%"
            width="11.3%"
            height="10%"
            img={{
              height: 400,
            }}
          />
          <Typography variant="body2" color="text.secondary">
            설문에 필요한 기본 정보를 입력합니다.
          </Typography>
          <Picture
            filename="createpoll"
            label="기본 정보 입력"
            img={{
              height: 400,
            }}
          />
          <Typography variant="body2" color="text.secondary">
            설문 또는 투표 기간을 설정합니다. 설문 기간을 설정하지 않으면 상시로
            설정됩니다.
          </Typography>
          <Picture
            filename="setendtime"
            label="설문 기간 설정"
            img={{
              height: 400,
            }}
          />
          <Typography variant="body2" color="text.secondary">
            질문 추가 버튼을 클릭하고 질문을 추가할 수 있습니다.
          </Typography>
          <Picture
            filename="addquestion"
            label="질문 추가"
            img={{
              height: 400,
            }}
          />
          <Details title="1.1.1 질문 종류">
            <Typography variant="body2" color="text.secondary">
              질문의 종류는 3가지가 있습니다. 자유 입력형, 선택형, 다중 선택형
              입니다.
            </Typography>
            <Picture
              filename="question-input"
              label="자유 입력형"
              img={{
                height: 400,
              }}
            />
            <Picture
              filename="question-select"
              label="선택형"
              img={{
                height: 400,
              }}
            />
            <Picture
              filename="question-checkbox"
              label="다중 선택형"
              img={{
                height: 400,
              }}
            />
          </Details>
          <Typography variant="body2" color="text.secondary">
            작성이 완료되었다면 우하단의 "+"모양의 버튼에 마우스를 대고 팝업되는
            플로피 디스크 아이콘을 클릭하여 저장합니다.
          </Typography>
          <Picture
            filename="questionsave"
            label="저장하기"
            img={{
              height: 400,
            }}
          />
        </Details>
        <Details title="1.2 그래프">
          <Typography variant="body2" color="text.secondary">
            그래프는 설문과 투표 둘 다 제공되며, 그래프 간 비교 기능은 설문
            그래프에만 적용됩니다.
          </Typography>
          <Picture
            filename="graph"
            label="그래프 유형 선택"
            img={{
              height: 400,
            }}
          />
          <Typography variant="body2" color="text.secondary">
            설문 그래프를 선택하고 그래프 결과 보기를 원하는 설문을 선택합니다.
          </Typography>
          <Picture
            filename="graph-select"
            label="그래프 분석 선택"
            img={{
              height: 400,
            }}
          />
          <Details title="1.2.1 기본 그래프">
            <Typography variant="body2" color="text.secondary">
              아래는 전체 그래프 페이지 입니다. 기본적으로 설문의 질문별로 응답
              항목을 그래프로 제공합니다.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              아래는 전체 그래프 페이지 입니다.
            </Typography>
            <Picture
              filename="fullshot"
              label="그래프 페이지"
              img={{
                width: '100vmin',
              }}
            />
          </Details>
        </Details>
        <Details title="1.3 고급 기능">
          <Typography variant="body2" color="text.secondary">
            고급 기능으로 특정 질문을 선택하여 응답자가 다른 질문에 어떤 응답을
            했는지 트래킹할 수도 있습니다.
          </Typography>
          <Details title="1.3.1 고급 그래프">
            <Picture
              filename="graph-compare01"
              label="그래프 기준 질문 선택"
              img={{
                width: '100vmin',
              }}
            />
            <Picture
              filename="graph-compare02"
              label="그래프 비교 질문 선택"
              img={{
                width: '100vmin',
              }}
            />
            <Typography variant="body2" color="text.secondary">
              예를 들면, 아래와 같이 응답자의 직종과 분야를 기준으로 어떤 직종의
              응답자가 다른 질문에 어떻게 응답했는지 추이를 볼 수 있습니다.
            </Typography>
            <Picture
              filename="graph-ex-select"
              label="직종/분야 기준"
              img={{
                width: '100vmin',
              }}
            />
            <Typography variant="body2" color="text.secondary">
              비교 질문은 선택한 순서대로 생성되며, 다시 선택하면 취소되며 자동
              정렬됩니다.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              기준 질문을 다시 선택하면 초기화 됩니다.
            </Typography>
            <Picture
              filename="graph-ex-job-hope"
              label="직종/분야 ⇄ 원하는 주제"
              img={{
                width: '100vmin',
              }}
            />
            <Picture
              filename="graph-ex-job-hope-value"
              label="비교 그래프 보는 방법"
              img={{
                width: '100vmin',
              }}
            />
            <Typography variant="body2" color="text.secondary">
              다음은 각 직종 응답자가 생각하는 개선사항과 불편한 점이 무엇인지
              한눈에 볼 수 있습니다.
            </Typography>
            <Picture
              filename="graph-ex-job-feat"
              label="직종/분야 ⇄ 개선사항"
              img={{
                width: '100vmin',
              }}
            />
            <Picture
              filename="graph-ex-job-uncomfortable"
              label="직종/분야 ⇄ 불편한 점"
              img={{
                width: '100vmin',
              }}
            />
            <Typography variant="body2" color="text.secondary">
              위 예시는 백엔드 직종의 응답자가 원하는 주제가 어떤 것인지 볼 수
              있습니다. 다른 비교 그래프 또한 해당 직종의 응답자가 어떤 그래프와
              연관할 지에 따라 적은 질문으로도 다양한 통계자료를 얻을 수
              있습니다.
            </Typography>
          </Details>
          <Details title="1.3.2 고급 그래프 뷰 타입">
            <Typography variant="body2" color="text.secondary">
              고급 그래프에서 그래프 타입을 토글 전환할 수 있습니다.
            </Typography>
            <Typography variant="body2" color="text.secondary">
              선형 그래프는 동일 값이 있을 경우 겹쳐서 잘 보이지 않기 때문에
              막대 그래프로 전환하면 보기 편합니다.
            </Typography>
            <Picture
              filename="graph-toggle-type"
              label="그래프 질문 비교 선택"
              img={{
                width: '100vmin',
              }}
            />
            <Typography variant="body2" color="text.secondary">
              기기별 사이즈에 따라 범례가 그래프와 겹친다면 생성된 비교 그래프
              우상단의 "범례 숨기기"를 클릭하여 토글 전환하면 그래프만 볼 수
              있습니다.
            </Typography>
            <Picture
              filename="graph-toggle-type"
              label="그래프 질문 비교 선택"
              top="34.5%"
              left="80.1%"
              width="9.5%"
              height="7%"
              img={{
                width: '100vmin',
              }}
            />
          </Details>
        </Details>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold' }}>
          2. 서비스 이용 안내
        </Typography>
        <Details title="2.1 회원가입">
          <Typography variant="body2" color="text.secondary">
            현재 회원가입은 제한된 인원에게 테스트 계정을 발급하여 이용되고
            있습니다. 사용을 원하신다면 최하단의 메일로 문의 주시기 바랍니다.
          </Typography>
        </Details>
        <Details title="2.2 요금제 이용">
          <Typography variant="body2" color="text.secondary">
            요금제 정기 결제 기능은 테스트용으로 연결만 해두었습니다. 상업적
            이용 계획은 현재까지 없습니다. 각 플랜별 기능 제한을 풀어둔
            상태이며, 모든 계정이 무제한으로 생성하고 그래프를 이용할 수
            있습니다.
          </Typography>
        </Details>
      </Stack>
      <Divider flexItem sx={{ my: 3 }} />
      <Typography
        component={Link}
        to={`mailto:${USER_EMAIL}`}
        color="text.secondary"
        sx={{textDecoration:'none'}}
      >
        문의메일: {USER_EMAIL}
      </Typography>
    </Container>
  );
};

export default HelpPage;

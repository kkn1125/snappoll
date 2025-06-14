# SnapPoll Back-end

서버사이드 구현

- 2025-06-08 (v0.0.64)
  - fix
    - 정보 보호를 위해 상세 페이지 API 응답 및 만료 조건문 수정
- 2025-06-01 (v0.0.63)
  - feat
    - 구독 잠금
    - 카카오 로그인 허용
    - 회원가입 허용
    - 플랜별 설문, 투표 생성 제한 로직 개선
    - 대시보드 응답 수정
      - 누적, 이번달 사용량
    - 회원가입 현황 디스코드 웹훅 알림 추가
    - 회원 가입 시 디스코드 웹훅 알림 추가
    - 게시판 생성 시 디스코드 웹훅 알림 추가
    - 게시판 정렬 기능 추가
- 2025-01-15
  - feat
    - 전체 로그 기능 SnapLogger로 교체
    - 결제 취소 시 무료 플랜으로 변경
    - Auth getMe Response 설문, 투표, 응답 데이터 포함
    - 구독 취소 로직 수정
- 2025-01-14
  - feat
    - Toss 정기결제 기능 추가
    - Toss 정기결제 취소 기능 추가
    - Payment table 추가
      - 결제 후 데이터 저장
      - 정기결제 취소 시 데이터 사용, 업데이트
- 2025-01-08
  - add
    - 회원가입 임시 금지
    - 임시 참여 계정 생성
    - 탈퇴 회원 정보 완전 제거 배치 일정 추가
    - exception filter 응답 method 속성 추가
  - fix
    - 좋아요 API 수정
      - removeLike API 제거
      - post메서드 like API를 action 바디값으로 분기
      - Throttler Exception와 Exception 생성자 인자 차이로 ThrottlerException만 예외 응답 메세지 포맷 변경
    - 회원 가입 방지 (마스터 권한 특수 허용)
    - role guard 강화
    - UserController RoleGuard 추가
    - user remove 시 active false 적용
  - bugfix
    - 플랜 가드 로직 수정
      - 생성, 응답 검증 주체 오류 수정
- 2025-01-07
  - feat
    - Kubernates 테스트
  - bugfix
    - 공개 설문, 투표 응답 거부되는 버그 수정
    - 공개 설문, 투표 저장 시 플랜가드 권한 검증 오류 수정
- 2025-01-04
  - fix
    - 요금제 응답 오더 적용
  - bugfix
    - 설문, 투표 응답 PlanGuard 미적용 부분 수정
    - PlanGuard 설문, 투표 1인 1응답 원칙 적용 (회원만)
  - todo
    - [ ] 비회원 1인 1응답 제한 구상 및 검토
- 2025-01-03
  - feat
    - 게시글 likeCount 컬럼 제거
    - BoardLike 테이블 추가 및 교체
    - 게시글 좋아요 기능 추가
      - 기존 API only 파라미터 유무로 viewCount 구분
    - jest config 설정 pkg에서 파일로 분리
  - add
    - PathDomain 클래스 테스트 케이스 추가
    - 설문 질문 수정 기능 로직 변경
      - 질문 순서, 삭제, 수정 반영
    - 질문, 투표 항목 수정 기능 로직 변경
      - 항목 순서, 삭제, 수정 반영
    - sitemap 최신화
  - fix
    - 사이트맵 최신화
      - PathDomain 클래스 재구성 및 Nested 구현
      - 회원 경로 제외
    - poll option, vote option order 컬럼 추가
  - bugfix
    - ctype 깃허브 액션 빌드 오작동 수정
    - 게시글 수정 버그 원인 파악 및 해결
- 2025-01-02
  - add
    - notice hbs 페이지 추가
    - 수동 메일 발송 기능 추가
      - 메일 수신 허용 회원에게만 발송
  - fix
    - 기존 alertPage, confirmPage, header, footer 구글 메일 기준으로 템플릿 재구성
    - 설문 질문
      - 수정, 추가 업데이트 로직 테스트 완료
      - 순서 조정 버튼 추가
  - bugfix
    - 비밀번호 초기화 발급 해시 값 대신 원본 키 응답
  - todo
    - [x] 수동 메일 발송 기능 구현
    - [x] 설문 질문 삭제 업데이트 구현
      - [x] 설문 질문에 포함된 질문 id로 In 연산해서 나머지 없으면 제거 하도록
- 2024-12-31
  - feat
    - 설문, 투표 통계 데이터 연산 API 구현
- 2024-12-30
  - add
    - user model 메일 수신 동의 컬럼 추가
    - 댓글 수정 기능 추가
    - 정적 리소스 읽기 쓰로틀링 무시
    - 수동 메일 발송 Notice 모델 추가
  - bugfix
    - 모바일 사설망 IP로 접속 시 쿠키 보안 정책으로 미설정되는 버그 수정
- 2024-12-29
  - add
    - 계층형 댓글 API 구현
    - 클라이언트 사이드 연동
  - fix
    - 게시글 상세보기 시 조회수 증가
  - todo
    - [x] 계층형 댓글 저장 시 동일 그룹에 대한 댓글 오더 밀어서 추가
    - [x] 계층형 댓글 생성 시 하위 댓글일 경우 상위 댓글 아이디 그룹으로 가져갈 것
- 2024-12-27
  - add
    - 구독 플랜별 생성, 응답 제한 Guard 제작
  - fix
    - 설문, 투표 제거 시 응답 제거되도록 제약 조건 수정
  - todo
    - [x] 계층형 댓글
    - [ ] 게시글 좋아요
    - [ ] 구글 로그인
- 2024-12-26
  - add
    - 개인정보처리방침, 서비스이용동의 약관 추가 및 Terms 테이블 추가
    - 이용동의 테이블 추가
    - 에러 정의 이용동의 도메인 추가
    - 회원가입 이용약관 동의 로직 추가
    - 구독 API 추가
  - fix
    - 이용약관 동의 저장 로직 수정
    - 로그인 버그 수정
- 2024-12-24
  - add
    - 구독 테이블 추가
    - 구독 API 추가
    - 메일러 컨트롤러 추가 (테스트용)
  - fix
    - LocalUser, SocialUser onDelete 설정
    - UserProfile Table OnDelete 옵션 추가
    - 카카오 회원가입, 로그인 기능 복원
    - 암호화 관련 기능 EncryptManager로 분리
  - bugfix
    - 프로필 이미지 데이터베이스 저장 및 읽기 안되는 버그 수정
    - 리프레시 토큰 만료 처리 과정 버그 수정
- 2024-12-23
  - add
    - 구독 결제 테이블 재설계
  - fix
    - 컬럼 명 snakeToCamel 서버사이드 처리
    - 마스터 전용 강제 게시글 삭제 API 추가
    - 게시판 카테고리 조회 조건 수정
- 2024-12-21
  - feat
    - 어드민 전용 API 제거
    - 메일러 컨트롤러
- 2024-12-19
  - feat
    - 관리자 페이지 생성
- 2024-12-18
  - add
    - 프로필 이미지 읽기 API 추가
  - fix
    - board category 조회 page 미적용 부분 수정
    - stateless server를 위해 이미지 리소스 데이터베이스 저장으로 변경
    - 프로필 저장 로직 수정
  - del
    - 기존 디스크 저장된 이미지 파일 제거
- 2024-12-17
  - add
    - 회원, 비회원 게시글 쓰기, 수정, 삭제 기능 추가
    - 게시판 비밀번호 검증 API 추가
- 2024-12-16
  - add
    - 게시판 API 추가
  - fix
    - sitemap 수정
- 2024-12-15
  - fix
    - 쿠키 토큰 검증 방식 재설계
      - 리프레시 API 추가
      - 쿠키 검증 시 토큰 만료일 시 자동 리프레시 검증 및 발급
      - 리프레시 만료 시 최종 로그아웃 처리
      - 토큰 검증 비효율적인 로직 수정
- 2024-12-14
  - add
    - 프로필 이미지 업로드 기능 추가
    - 프로필 이미지 읽기 API 추가
  - fix
    - 토큰 발급 방식 변경
    - 쿠키 검증 로직 개선
    - 로그인 strategy 로직 개선
    - auth service
      - 불필요한 응답 제거
      - 토큰 발급 및 getMe 로직 개선
      - 메일 발송 부분 clientDomain 변수 제거
  - todo
    - [x] 미사용 리소스 제거
- 2024-12-13
  - add
    - Grade, AuthProvider, Role Enum 타입 추가
    - 로컬, 소셜 유저 dto 생성
  - fix
    - 로거 클래스 컨텍스트 표기
    - prisma 유저 로컬, 소셜 테이블 분리 상하 관계로 변경
    - 테이블 변경 사항 코드레벨 반영
    - RoleGuard 로직 변경, 단일책임
    - CookieGuard 로직 수정
    - CookieGuard 전역 가드로 설정
    - IgnoreCookie 데코레이터 수정
- 2024-12-12
  - add
    - 계정 비밀번호 초기화 및 임시 발급 기능 구현
    - 비밀번호 변경 API 추가
  - fix
    - 개인정보 변경 기능 활성화
    - 카카오 로그인 비활성화
- 2024-12-11
  - add
    - 429 too many requests 예외 추가
    - throttler 미들웨어 추가
    - 전역 exception filter 추가
    - 소셜 로그인 추가 (카카오)
    - KAKAO_KEY키 yaml 추가
- 2024-12-10
  - feat
    - 이메일 본인인증 구현
    - 회원가입 시 이메일 인증 절차 추가
    - 인증 토큰 만료 및 확인 페이지 제작
    - 인증 만료시간 1분 지정
  - add
    - 설문, 투표 공개 URL 생성, 정지, 복구 API 구현
- 2024-12-09
  - feat
    - 설문, 투표 수정 API 구현
      - nested update 구현
- 2024-12-08
  - feat
    - 보드 API 수정
    - 프리즈마 테이블 onDelete, onUpdate 구조 수정
  - add
    - response interceptor 추가
- 2024-12-06
  - feat
    - profile upload API 수정
      - 존재 할 경우 업데이트
      - 없을 경우 생성
    - auth verify 응답 값 getMe API와 통일
    - logger middleware query 표시 방식 변경
    - role guard 토큰 만료 에러 분기 처리
- 2024-12-05
  - feat
    - board API 초안 제작
    - basic 모듈 제작
    - 미들웨어 로거 출력 옵션 추가
    - sitemap 동적 응답 추가
    - 알림 모두 읽기 메세지 이벤트 추가
    - sitemap prefix 제외
- 2024-12-04
  - feat
    - version API 추가
    - 투표 테이블 구조 변경
    - 투표 API 기능 개선
    - (polls|votes)/me/response API 추가
    - 참여 기록 제거 기능추가
    - 로그인 리프레시 토큰 기능 추가 구현
      - 토큰 만료 시 리프레시 검증 및 재발급
      - 리프레시마저 만료 시 토큰 제거 및 로그아웃 처리
- 2024-12-03
  - feat
    - 설문조사 API 기능 점검
    - 투표 API 기능 개선
    - 설문, 투표 각 응답 API 기능 제작
    - 설문, 투표 API 전체 및 사용자 아이템 조회 페이지네이션 기능 추가
    - 메세지 테이블 추가, 알림 기능 추가
    - 설문조사 작성 시 글쓴 사람에게 알림
- 2024-12-02
  - feat
    - 설문조사 post메서드 nested write 방식으로 변경
    - 설문조사 응답 post 메서드 상동
- 2024-11-28
  - feat
    - 회원탈퇴 API 데이터 삭제에서 제거 시간 업데이트로 변경
    - 탈퇴 신청 리스트 배치를 통해 제거 기능 구현 예정
- 2024-11-27
  - feat
    - 로그인 및 verify API 응답 변경
    - 로그인 및 토큰 검증, 로그인 유지 설계 변경
- 2024-11-26
  - feat
    - logout API 구현
    - 쿠키, 롤 가드 기능 개선
- 2024-11-25
  - feat
    - user auth API 제작
    - 토큰 검증 API 추가 구현
    - passport이용하여 토큰 검증
    - passport이용하여 로그인 토큰 검증
    - 커스텀 가드 추가
      - 쿠키 파싱
      - 토큰 검증
      - 토큰 + 유저 데이터 검증
    - 로그인 유지 관리 로직 수정
    - 로거 미들웨어 자세히 출력되도록 수정
    - polls 및 votes, users에 공통 호출 API 외 모두 Guard처리

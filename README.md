# SnapPoll 서버사이드

서버사이드 구현

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

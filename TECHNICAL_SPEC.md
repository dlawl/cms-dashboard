# Admin Dashboard MVP – 기술 명세서

## 1. 프로젝트 목표

- 실무에서 활용 가능한 관리자 대시보드 MVP 구현
- 상태 관리, 비동기 처리, UX 피드백 등 프론트엔드 역량 증명

## 2. 시스템 아키텍처

- Next.js 기반 SPA (pages router)
- 상태 관리: Zustand (전역), React Query (서버 상태)
- 스타일: Tailwind CSS, shadcn/ui
- 데이터: mock API (services/에 구현)
- 인증: localStorage + Zustand
- 배포: Vercel

## 3. 주요 기능 상세

### 3.1 로그인/인증

- 로그인 폼: React Hook Form + Zod
- 인증 성공 시 localStorage에 토큰 저장, Zustand로 상태 관리
- ProtectedRoute 미들웨어로 인증 없는 접근 차단

### 3.2 사용자 목록/상태 전환

- React Query로 mock API에서 유저 데이터 fetch
- UserCard 컴포넌트: 승인/반려 버튼, 상태 뱃지, 토스트 알림
- 상태 전환 시 optimistic UI 적용

### 3.3 필터/검색

- 전체/승인/반려 필터 (URL query param 연동)
- Zustand로 필터 상태 관리
- (보너스) 검색/정렬 기능 확장 가능

### 3.4 에러/예외 처리

- react-error-boundary로 에러 UI 처리
- 404/403 등 예외 페이지

### 3.5 UX/디자인

- GSAP/framer-motion으로 애니메이션
- 다크모드, 반응형, 접근성 고려
- shadcn/ui로 일관성 유지

## 4. 폴더 구조

src/
├── pages/
├── components/
├── features/
├── services/
├── stores/
├── hooks/
├── schemas/
├── types/
├── styles/
├── utils/
└── constants/

## 5. 트러블슈팅/의사결정 기록

- 상태 필터와 React Query 캐싱 충돌 → 쿼리키 분리로 해결
- optimistic UI 적용 시 race condition 주의
- UI/UX 피드백(토스트, 애니메이션) 구현 방식

## 6. 향후 확장/로드맵

- 통계/차트, Role 권한, 실 DB 연동 등 구조상 확장 가능
- 2차 개발 시 백엔드 API 연동 및 기능 추가 예정
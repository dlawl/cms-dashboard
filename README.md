# Admin Dashboard MVP

## 프로젝트 개요

이 프로젝트는 **실제 MySQL 기반 백엔드 + Next.js 프론트엔드**로 구현된 관리자 대시보드 MVP입니다.

- **로그인, JWT 인증, 사용자 승인/반려, 필터, 통계** 등 핵심 관리자 기능 제공
- **Express 5 + MySQL2** 기반의 RESTful API 서버, **JWT 기반 인증** 및 CORS 적용
- **Next.js + React Query + Zustand**로 상태/데이터 관리, **Tailwind CSS**로 반응형 UI
- **실제 DB 연동** (mock 데이터 아님)
- 통계, Role 관리, 전체 CRUD 등은 구조상 확장 가능

## 배포 주소

- [배포 URL](https://your-vercel-url.vercel.app)

### 테스트 계정
- ID: admin@naver.com
- PW: 1234

## 기술 스택

| 분야          | 기술/라이브러리          | 도입 이유                                  |
| ------------- | ----------------------- | ------------------------------------------ |
| 프론트엔드    | Next.js (pages router), TypeScript | SSR/CSR, 타입 안정성, 빠른 개발           |
| 상태 관리      | Zustand, React Query     | 인증/필터 등 전역 상태, 서버 상태 관리      |
| 스타일링       | Tailwind CSS, shadcn/ui  | 반응형 UI, 실무형 컴포넌트                 |
| 알림/UX        | react-hot-toast, framer-motion | UX 피드백, 애니메이션                    |
| 백엔드        | Express 5, MySQL2, JWT, bcrypt | REST API, DB 연동, 인증/암호화           |
| 기타          | dotenv, cors, nodemon    | 환경변수 관리, CORS, 개발 편의             |

## 주요 기능 요약

### 프론트엔드
- **로그인/로그아웃**: JWT 토큰 발급 후 localStorage 저장 및 axios 인터셉터로 자동 Authorization 주입
- **사용자 목록/상태 관리**: React Query로 목록/상태 동기화, optimistic UI, 실패 시 롤백
- **승인/반려/대기**: 버튼 상태/로딩/중복 방지, Tailwind CSS로 disabled:opacity-40 적용
- **필터/검색**: 상태별 사용자 필터링, FilterBar 컴포넌트 제공
- **통계**: 최근 7일간 상태변경/게시글 현황 시각화 (StatsCard, StatsChart)
- **UX**: 토스트, 애니메이션, 빈 상태/에러/로딩 UI 등

### 백엔드
- **Express 5 기반 REST API**: /api/auth (로그인/회원가입), /api/users (목록, 상태변경)
- **JWT 인증 미들웨어**: 모든 API 인증 필요, 유효하지 않은 토큰시 401/403 반환
- **CORS**: 프론트엔드(3000)와 연동을 위한 CORS 옵션 적용
- **MySQL2**: 실제 DB 연동 (DB 설정은 .env 참고)
- **에러 처리**: 401/403/500 등 상황별 명확한 메시지 반환

## 폴더 구조 (주요)

```
backend/
├── index.js         # Express 서버 진입점
├── routes.auth.js   # 인증/회원가입 API
├── routes.users.js  # 사용자 목록/상태변경 API
├── package.json     # 백엔드 의존성
├── schema.sql       # DB 스키마 예시
└── ...

src/
├── pages/           # login.tsx, dashboard.tsx 등 라우트
├── components/      # UI 컴포넌트 (UserCard, FilterBar, Stats 등)
├── services/        # API 통신 모듈 (userService 등)
├── store/           # Zustand 인증 상태 관리
├── hooks/           # useAuth 등 커스텀 훅
└── ...
```

## 통계/차트(Stats) 기능

- 최근 7일간의 사용자 상태 변경(승인/반려/대기)과 게시글 처리 현황(발행/임시/삭제)을 카드와 차트로 시각화합니다.
- 관련 컴포넌트: `StatsCard`, `StatsChart`, `StatsSummarySection` (`src/components/Stats/`)
- 카드/차트 모두 미니멀&깔끔 스타일, 반응형 대응
- 데이터는 mock user/post 배열에서 statusChangeDate, date 기준으로 직접 집계합니다.
- **현재 모든 통계/차트 데이터는 임시(mock) 데이터 기반이며, 실제 백엔드 연동 시에는 API/DB에서 집계된 데이터를 받아와야 합니다.**

### 트러블슈팅/회고
- mock 데이터의 날짜가 실제 "최근 7일"과 불일치하여, UI/UX 혼란이 발생할 수 있음을 경험했습니다.
- 실제 서비스에서는 오늘 날짜 기준으로 동적으로 데이터를 생성하거나, 백엔드 API에서 집계 데이터를 받아와야 함을 절감했습니다.
- 컴포넌트와 서비스 레이어를 분리하여, 추후 실제 데이터 연동 및 새로운 통계 항목 추가 시에도 확장성이 높도록 구조화했습니다.

## 기능 요약 및 범위

| 기능 영역        | 1차(MVP) 구현 | 향후 확장 가능 | 비고                   |
| ------------- | :---------: | :---------: | -------------------- |
| 로그인/인증      |      ✅      |      -      | JWT + localStorage, 백엔드 인증 미들웨어 |
| 사용자 승인/반려   |      ✅      |      -      | React Query 기반 상태 관리, optimistic UI(즉시 반영), 실패 시 롤백, mutation 중복 방지 및 일관성 보장 |
| 필터/검색        |      ✅      |      ✅      | 상태별 필터, 검색은 확장 예정 |
| 통계/차트        |      ✅      |      ✅      | 최근 7일 현황, 향후 DB 기반 확장 가능 |
| Role 권한 관리   |      -      |      ✅      | 단일 관리자만 MVP 포함, 향후 확장 |
| CRUD 전체       |      -      |      ✅      | 상태 기반 워크플로우만 MVP, 전체 CRUD 확장 가능 |

## 개발 일정 (예시)

| 날짜 | 작업 내용 | 체크포인트 |
| --- | --- | --- |
| D1 | 프로젝트 초기 세팅 + 폴더 구조 설계 | GitHub, Tailwind, Express, MySQL 연동 |
| D2 | 로그인/회원가입 API, JWT 인증 구현 | bcrypt, JWT, DB 연동 |
| D3 | 프론트엔드 로그인 연동, 상태 저장(Zustand) | localStorage + zustand |
| D4 | 사용자 목록/상태변경 API, 프론트 대시보드 | React Query, optimistic UI |
| D5 | 필터/통계/UX 디테일 | Toast, 애니메이션, 차트 등 |
| D6 | 에러처리, 반응형 대응 | 로딩/에러 UI, media query |
| D7 | README/문서화/배포 | 포트폴리오 문서화, 배포 완료 |
    |

## 향후 확장 기능 체크리스트

- [ ] 통계/차트 대시보드
- [ ] Role 기반 관리자 권한
- [ ] 전체 CRUD(게시글/파일 등)
- [ ] 실 백엔드/DB 연동
- [ ] 고급 검색/정렬

## 🧪 트러블슈팅

### [2025-08] 인증 상태 전역 관리 구조 개선 (zustand 도입)
- 배경: 기존 useState + localStorage 방식은 여러 컴포넌트/페이지에서 인증 상태 공유에 한계가 있었음
- 시도: zustand store(authStore.ts) 도입, useAuth 훅에서 zustand selector로 상태 관리
- 시행착오: zustand import, 타입스크립트 selector 파라미터 타입, useEffect dependency 등에서 에러 발생
- 해결: 타입 명시, dependency array 보완, store 구조 단순화
- 결과: 인증 상태가 전역에서 일관성 있게 공유되고, 새로고침/이동에도 유지됨. 기획서와 실제 코드 일치


| 항목   | 내용 |
| ------ | ---- |
| 문제   | 상태 필터 변경 시, 이전 캐시된 데이터가 그대로 유지됨 |
| 원인   | React Query의 staleTime 설정과 쿼리키 구분 문제 |
| 해결   | 쿼리키를 [‘users’, status]로 분리하여 관리 |
| 결과   | 필터 전환 시 응답 데이터 정확성 개선, UI 반응성 향상 |
| 문제   | 사용자 승인/반려 버튼을 빠르게 여러 번 클릭하면, 상태가 꼬이거나 UI와 저장된 데이터가 불일치하는 현상 발생 |
| 원인   | mutation이 끝나기 전에 동일 유저에 대해 추가 요청이 발생할 수 있음 |
| 해결   | 각 유저별로 actionLoading 상태를 두고, mutation 중에는 추가 요청을 무시하도록 로직 보강. React Query의 onMutate, onError를 활용해 optimistic UI와 실패 시 롤백을 구현 |
| 결과   | 동일 유저에 대한 중복 요청이 차단되어 race condition 없이 항상 일관된 상태가 유지됨. 실패 시에도 UI가 원래대로 복구됨 |



> 보안/실무 전략, SSR/CSR 인증 분기, UX 개선 등 상세 회고는 TECHNICAL_SPEC.md 부록 참고






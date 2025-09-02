# Admin Dashboard MVP

## 프로젝트 개요

실제 MySQL DB와 연동되는 **Express + Next.js 기반 관리자 대시보드**입니다. 
- **JWT 인증, 사용자 승인/반려, 상태 필터, 통계 대시보드** 등 실무형 기능 제공
- **Express 5 + MySQL2** RESTful API, **JWT 인증/미들웨어** 적용
- **Next.js (pages router) + React Query + Zustand**로 상태/데이터 관리
- **Tailwind CSS** 기반 반응형 UI, UX 개선(토스트, 애니메이션 등)
- **실제 DB 연동** (mock 데이터는 통계/차트에만 임시 사용)
- 구조 분리로 추후 Role 관리, 전체 CRUD, 고급 검색 등 확장 가능

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
- **로그인/로그아웃**: JWT 토큰 localStorage 저장, axios 인터셉터로 자동 Authorization 주입
- **사용자 목록/상태 관리**: React Query로 동기화, optimistic UI, 실패 시 롤백, mutation 중복 방지
- **승인/반려/대기**: 버튼별 상태/로딩/중복 방지, Tailwind `disabled:opacity-40` 활용
- **필터/검색**: 상태별 필터(FilterBar 컴포넌트)
- **통계/차트**: 최근 7일간 상태변경·게시글 현황을 카드/차트로 시각화 (StatsCard, StatsChart, StatsSummarySection)
- **UX**: react-hot-toast, framer-motion, 빈 상태/에러/로딩 UI 등

### 백엔드
- **Express 5 기반 REST API**: 
  - 로그인: `/api/auth/login`
  - 회원가입: `/api/auth/register`
  - 사용자 목록: `/api/users`
  - 사용자 상태변경: `/api/users/[id]/status`
  - 헬스체크: `/api/health`
- **JWT 인증 미들웨어**: 모든 API 인증 필요, 유효하지 않은 토큰시 401/403 반환
- **CORS**: 프론트엔드(3000) 연동용 CORS 옵션 적용
- **MySQL2**: 실제 DB 연동 (DB 설정은 .env 참고)
- **에러 처리**: 401/403/500 등 상황별 명확한 메시지 반환

## 주요 폴더 구조

```
backend/
├── index.js           # Express 서버 진입점
├── routes.auth.js     # 인증/회원가입 API
├── routes.users.js    # 사용자 목록/상태변경 API
├── package.json       # 백엔드 의존성
├── schema.sql         # DB 스키마 예시
└── ...

src/
├── pages/             # 라우트(login, dashboard 등)
├── components/        # UI 컴포넌트(UserCard, FilterBar, Stats 등)
├── services/          # API 통신(userService, statsService 등)
├── store/             # Zustand 인증/역할 상태 관리
├── hooks/             # useAuth 등 커스텀 훅
└── ...
```

## 통계/차트(Stats) 기능

- 최근 7일간의 사용자 상태 변경(승인/반려/대기), 게시글 처리 현황(발행/임시/삭제)을 카드/차트로 시각화
- 관련 컴포넌트: `StatsCard`, `StatsChart`, `StatsSummarySection` (`src/components/Stats/`)
- **현재 통계/차트 데이터는 mock 데이터 기반** (실제 DB 연동 전, 추후 API/DB 집계 필요)

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

## 배포/운영 환경 변수 설정

- **Vercel(Next.js API 통합 기준):**
  - 환경변수: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET` (서버 전용)
  - 로컬 MySQL은 Vercel에서 접근 불가 → PlanetScale, RDS 등 클라우드 MySQL 사용 필수
  - (PlanetScale 등 TLS 필요 시) `lib/db.ts`에 ssl: { rejectUnauthorized: true } 추가

- **레거시 Express 서버:**
  - `/backend/index.js`는 Vercel에서 사용되지 않으므로 `/backend-legacy/`로 이동하거나 삭제 권장

---

## 배포 체크리스트

1. Vercel > Project > Settings → Environment Variables
   - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET` 추가 → Save
2. 배포 후 `/api/health`로 헬스체크 (200 OK)
3. 로그인, 회원가입, 사용자 관리 기능 정상 동작 확인
4. DB 연결 오류(ECONNREFUSED/ETIMEDOUT 등)는 DB 방화벽/접근권한 문제일 수 있음 (클라우드 DB 필수)
5. CORS 에러는 구조상 발생하지 않음
6. 레거시 Express 코드(backend/index.js)는 빌드/배포에 영향 없음 (정리 권장)
필요 시) `lib/db.ts`에 ssl: { rejectUnauthorized: true } 추가

## 실행 및 개발 일정 예시

1. **백엔드 실행**
   - `cd backend && npm install && npm start`
   - .env에 MySQL 연결 정보 필요
2. **프론트엔드 실행**
   - `npm install && npm run dev`
   - 기본 포트: 3000 (API: 4000)

| 날짜 | 작업 내용 | 체크포인트 |
| --- | --- | --- |
| D1 | 프로젝트 초기 세팅/폴더 구조 | GitHub, Tailwind, Express, MySQL 연동 |
| D2 | 로그인/회원가입 API, JWT 인증 | bcrypt, JWT, DB 연동 |
| D3 | 프론트엔드 로그인 연동, Zustand | localStorage + zustand |
| D4 | 사용자 목록/상태변경 API, 대시보드 | React Query, optimistic UI |
| D5 | 필터/통계/UX 디테일 | Toast, 애니메이션, 차트 등 |
| D6 | 에러처리, 반응형 대응 | 로딩/에러 UI, media query |
| D7 | README/문서화/배포 | 문서화, 배포 완료 |
    |

## 향후 확장 기능 체크리스트

- [ ] 통계/차트 실시간 DB 연동
- [ ] Role 기반 관리자 권한(다중 역할)
- [ ] 전체 CRUD(게시글/파일 등)
- [ ] 고급 검색/정렬/필터
- [ ] 알림/이벤트 로그 등

## 🧪 트러블슈팅/회고

### [2025-08] 인증 상태 전역 관리 구조 개선 (zustand 도입)
- 기존 useState + localStorage → zustand store(authStore.ts)로 전역화
- selector 파라미터 타입, useEffect dependency 등 시행착오 후 구조 단순화
- 인증 상태가 전역에서 일관성 있게 공유되고, 새로고침/이동에도 유지됨

#### 주요 이슈/해결
| 항목   | 내용 |
| ------ | ---- |
| 문제   | 상태 필터 변경 시 이전 캐시 데이터가 유지됨 |
| 원인   | React Query의 staleTime, 쿼리키 구분 미흡 |
| 해결   | 쿼리키를 [‘users’, status]로 분리 |
| 결과   | 필터 전환 시 데이터 정확성/반응성 개선 |
| 문제   | 승인/반려 버튼 중복 클릭 시 상태 꼬임, UI 불일치 |
| 원인   | mutation 중 추가 요청 발생 가능 |
| 해결   | 각 유저별 actionLoading, onMutate/onError로 optimistic UI/롤백 구현 |
| 결과   | 중복 요청 차단, 항상 일관된 상태 유지, 실패 시 UI 복구 |

> 보안/SSR/CSR 분기, UX 개선 등 상세 회고는 TECHNICAL_SPEC.md 참고






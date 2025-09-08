# Admin Dashboard MVP

## 프로젝트 개요

실제 MySQL DB와 연동되는 **Express + Next.js 기반 관리자 대시보드**입니다.

- **배포 주소:** [https://cms-dashboard-blue.vercel.app/](https://cms-dashboard-blue.vercel.app/)
- **테스트 계정(데모 전용):** admin@naver.com / 1234  
  ※ 프로덕션에서는 비활성화/주기적 초기화 예정

- **JWT 인증, 사용자 승인/반려/대기, 상태 필터, 통계 대시보드** 등 실무형 관리자 기능 제공
- **Express 5 + MySQL2** 기반 RESTful API, **JWT 인증/미들웨어** 적용
- **Next.js (pages router) + React Query + Zustand**로 인증/상태/데이터 관리
- **Tailwind CSS** 기반 반응형 UI, UX 개선(토스트, 애니메이션 등)
- **실제 DB 연동** (mock 데이터는 통계/차트에만 임시 사용)
- 구조 분리로 추후 Role 관리, 전체 CRUD, 고급 검색 등 확장 가능

> **보안 메모**: 데모는 localStorage 토큰 저장을 사용하지만, 프로덕션에선 **httpOnly 쿠키** 저장을 권장합니다.

---

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

> **DB 초기화:** `mysql -u <USER> -p <DB_NAME> < backend/schema.sql` 명령어로 빠르게 테이블을 생성할 수 있습니다.

## 실행 방법

### 프론트엔드(Next.js)
1) `npm install && npm run dev`  # http://localhost:3000
2) 환경변수: `.env.local` (예: DB_HOST/DB_USER/DB_PASSWORD/DB_NAME/JWT_SECRET 등)

### (선택) 레거시 Express 백엔드 로컬 실행
1) `cd backend && npm install && npm start`  # http://localhost:4000
2) 환경변수: `backend/.env`

---

## 아키텍처/기술 스택

- **Next.js (pages router), TypeScript, Zustand, React Query, Tailwind CSS, react-hot-toast, framer-motion**
- (레거시) Express 5, MySQL2, JWT, bcrypt, dotenv, cors
※ 상세 도입 배경 및 설계는 TECHNICAL_SPEC.md 참고




## 향후 확장 체크리스트
- [ ] 통계/차트 실시간 DB 연동
- [ ] Role 기반 관리자 권한(다중 역할)
- [ ] 전체 CRUD(게시글/파일 등)
- [ ] 고급 검색/정렬/필터
- [ ] 알림/이벤트 로그 등

## 참고/기타
- 보안/SSR/CSR/UX 상세 회고, 주요 코드 예시/패턴은 TECHNICAL_SPEC.md 참고

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
  - 사용자 상태변경: `/api/users/:id/status`
  - 헬스체크: `/api/health`
- **JWT 인증 미들웨어**: 모든 API 인증 필요, 유효하지 않은 토큰시 401/403 반환
- **CORS**: Next.js API(동일 도메인) 사용 시 CORS 이슈 없음.  
  분리된 Express 사용 시 `http://localhost:3000`(혹은 배포 도메인)을 CORS 허용 도메인에 추가해야 합니다.
- **MySQL2**: 실제 DB 연동 (DB 설정은 .env 참고)
- **에러 처리**: 401/403/500 등 상황별 명확한 메시지 반환

## 배포/운영 환경 변수 설정

- **Vercel(Next.js API 통합 기준)**  
  - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`
  - (PlanetScale 등 TLS 필요 시) `lib/db.ts`에 `ssl: { rejectUnauthorized: true }` 추가

- **(선택) 레거시 Express 서버 분리 배포 시**  
  - 동일 환경변수를 백엔드에도 설정
  - 프론트 도메인을 CORS 허용 도메인으로 등록

---

## 배포 체크리스트
1. Vercel > Project > Settings → Environment Variables
   - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET` 추가 → Save
2. 배포 후 `/api/health`로 헬스체크 (200 OK)
3. 로그인, 회원가입, 사용자 관리 기능 정상 동작 확인
4. DB 연결 오류(ECONNREFUSED/ETIMEDOUT 등) 발생 시 방화벽/접근권한 확인(클라우드 MySQL 권장)
5. **CORS 확인:** Vercel의 Next API 통합 사용 시 동일 출처로 CORS 이슈가 거의 없습니다. 로컬/레거시 Express 분리 운영 시에는 허용 도메인(예: http://localhost:3000)을 CORS 설정에 추가하세요.
6. 레거시 Express 코드(`backend/index.js`)는 빌드/배포에 영향 없음(정리 권장)

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
| 해결   | 쿼리키를 `['users', status]`로 분리 |
| 결과   | 필터 전환 시 데이터 정확성/반응성 개선 |
| 문제   | 승인/반려 버튼 중복 클릭 시 상태 꼬임, UI 불일치 |
| 원인   | mutation 중 추가 요청 발생 가능 |
| 해결   | 각 유저별 actionLoading, onMutate/onError로 optimistic UI/롤백 구현 |
| 결과   | 중복 요청 차단, 항상 일관된 상태 유지, 실패 시 UI 복구 |

> 보안/SSR/CSR 분기, UX 개선 등 상세 회고는 TECHNICAL_SPEC.md 참고






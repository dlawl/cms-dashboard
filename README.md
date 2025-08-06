# Admin Dashboard MVP

## 📌 프로젝트 개요

이 프로젝트는 “프론트엔드 기반 관리자 대시보드 MVP”로,
- 로그인, 사용자 승인/반려, 필터 등 핵심 관리자 기능에 집중  
- 복잡한 백엔드/DB 연동 없이 mock 데이터 기반으로 동작  
- 통계, Role 관리, 전체 CRUD 등은 구조상 확장 가능하나, 1차 목표에는 포함하지 않음

## 🚀 배포 주소

- [배포 URL](https://your-vercel-url.vercel.app)

## 🛠️ 기술 스택

| 분야          | 기술/라이브러리          | 도입 이유                                  |
| ------------- | ----------------------- | ------------------------------------------ |
| 프레임워크     | Next.js (pages router)  | 실무에서 많이 사용, SSR 구조 이해           |
| 언어          | TypeScript              | 타입 기반 안정성 확보                      |
| 상태 관리      | Zustand                 | lightweight, 코드 분산 최소화               |
| 서버 상태      | React Query             | API 캐싱, 비동기 통신 흐름 관리, optimistic UI(즉시 반영), 실패 시 롤백, mutation 중복/동시성(race condition) 방지 |
| 스타일링       | Tailwind CSS            | 빠른 UI, 반응형 용이                       |
| 컴포넌트       | shadcn/ui               | 실무형 컴포넌트 라이브러리, UI 일관성 강화  |
| 알림           | react-hot-toast         | UX 피드백                                  |
| 애니메이션     | GSAP or framer-motion   | 시각적 전환 효과, UX 강화                  |
| 유효성 검증    | Zod + React Hook Form   | 폼 유효성 체크                             |
| 배포           | Vercel                  | 빠른 배포, 실시간 URL 공유                 |

## 🚦 서버 상태 관리 & Optimistic UI

- 사용자 목록과 상태 변경(승인/반려/대기)은 React Query를 사용해 관리합니다.
- [src/pages/dashboard.tsx](cci:7://file:///c:/Users/master/Downloads/newpro-real/src/pages/dashboard.tsx:0:0-0:0)에서 `useQuery`로 사용자 목록을 가져오고, `useMutation`으로 사용자 상태를 변경합니다.
- 상태 변경 시, onMutate에서 UI를 먼저 낙관적으로(optimistic) 변경하고, onError에서 실패 시 이전 상태로 롤백합니다.
- 동일 유저에 대해 상태 변경 요청이 중복 발생하는 것을 방지하기 위해, 각 유저별로 actionLoading 상태를 관리합니다. mutation이 진행 중인 유저에 대해서는 추가 요청을 무시하여 race condition을 방지합니다.
- 쿼리키에 필터(상태)를 포함해, 필터 전환 시마다 해당 조건의 데이터만 새로 불러옵니다.
- 승인/반려/대기 버튼은 mutation 중이거나 이미 해당 상태일 때 비활성화되며, Tailwind CSS의 `disabled:opacity-40` 클래스를 사용해 시각적으로도 구분됩니다.

## 📁 폴더 구조

```
src/ ├── pages/ # login.tsx, dashboard.tsx ├── components/ # UI 단위 컴포넌트 (UserCard, FilterBar 등) ├── features/ # 도메인 기반 폴더 (users/, auth/ 등) ├── services/ # API 통신 모듈 (mock 포함) ├── stores/ # Zustand store ├── hooks/ # 커스텀 훅 ├── schemas/ # Zod 스키마 ├── types/ # 타입 선언 ├── styles/ # 글로벌 스타일 ├── utils/ # 공통 유틸 함수 └── constants/ # 상태 값, 필터 옵션 등
```


## ✅ 기능 요약 및 범위

| 기능 영역        | 1차(MVP) 구현 | 향후 확장 가능 | 비고                   |
| ------------- | :---------: | :---------: | -------------------- |
| 로그인/인증      |      ✅      |      -      | localStorage 기반    |
| 사용자 승인/반려   |      ✅      |      -      | React Query 기반 상태 관리, optimistic UI(즉시 반영), 실패 시 롤백, mutation 중복 방지 및 일관성 보장 |
| 필터/검색        |      ✅      |      ✅      | MVP는 필터만, 검색은 확장 |
| 통계/차트        |      -      |      ✅      | 보너스/확장 기능      |
| Role 권한 관리   |      -      |      ✅      | 단일 관리자만 MVP 포함 |
| CRUD 전체       |      -      |      ✅      | 상태 기반 워크플로우만 MVP |

## 🧭 개발 일정

| 날짜 | 작업 내용 | 체크포인트 |
| --- | --- | --- |
| D1 | 프로젝트 초기 세팅 + 폴더 구조 설계 | GitHub 연결, Tailwind 적용 |
| D2 | 로그인 UI + 상태 저장 (Zustand) | localStorage 연동 |
| D3 | /dashboard 구성 + mock 유저 데이터 연동 | React Query + Suspense |
| D4 | 필터 기능 + 상태 전환 로직 구현 | Zustand 전역 상태 연동 |
| D5 | UX 디테일 작업 (Toast, 애니메이션) | react-hot-toast, GSAP 적용 |
| D6 | 에러처리, 반응형 대응 | 로딩/에러 UI, media query |
| D7 | README 작성 + PPT 이미지 캡처 | 포트폴리오 문서화, 배포 완료 |

## 📝 기획서 vs 실제 구현 비교

| 항목                 | 기획서 내용                      | 실제 구현(MVP)           | 비고                     |
| ------------------ | ---------------------------- | --------------------- | ---------------------- |
| 백엔드 연동            | Node.js/Express/MySQL 예상      | mock 기반 프론트만 개발     | MVP는 FE에 집중          |
| 통계/차트             | 방문자, 게시글, 활동 통계        | 미포함(보너스 영역)        | 향후 확장 가능           |
| 사용자 관리/권한 설정    | 관리자 추가/삭제, 권한 설정       | 단일 로그인만 구현         | Role 관리 제외           |
| CRUD 전체            | 게시글/파일 등 전체 CRUD         | 상태 전환, 승인/반려 위주   | 워크플로우 관리 중심      |

## 🚦 향후 확장 기능 체크리스트

- [ ] 통계/차트 대시보드
- [ ] Role 기반 관리자 권한
- [ ] 전체 CRUD(게시글/파일 등)
- [ ] 실 백엔드/DB 연동
- [ ] 고급 검색/정렬

## 🧪 트러블슈팅

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



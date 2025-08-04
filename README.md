

---

# 📊 Dashbit – 관리자 대시보드 (Admin Dashboard)

간단하고 직관적인 승인/반려 워크플로우 기반의 **관리자 전용 미니 CMS 대시보드**입니다.  
**실무형 UI/UX 구성, 비동기 데이터 처리, 상태 관리 흐름**을 종합적으로 보여주는 프로젝트로,  
Next.js + TypeScript 기반의 **최신 프론트엔드 아키텍처와 문제 해결 과정**을 담고 있습니다.

<br />

<p align="center">
  <a href="https://dashbit.vercel.app/" target="_blank"><strong>🚀 배포 링크 바로가기</strong></a>
</p>

---

## 📝 기획 배경

- 실무에서 가장 자주 다뤄지는 관리 도구(CMS/Admin Panel) 패턴을 학습하고 **상태 관리 및 비동기 데이터 흐름 제어 역량**을 강화하기 위해 제작했습니다.
- 기존 포트폴리오 프로젝트들이 **UI/UX나 마크업 중심**이었다면, 이번 프로젝트는 **React Query, Zustand, Zod** 등을 통해 **데이터 흐름 및 에러 처리까지 포함한 SPA 아키텍처**를 중점적으로 다뤘습니다.
- 최소 기능 제품을 기준으로 개발해 **작지만 완성도 높은 대시보드**를 빠르게 구축하고, 차후 확장 가능한 구조로 설계했습니다.

---

## 🔍 주요 기능

- **로그인 및 보호 라우팅**
  - Mock 기반 localStorage 로그인
  - 비밀번호 검증 없이 접근 제어 (ProtectedRoute)
- **유저 관리**
  - 사용자 리스트 조회 (React Query + mock API)
  - 상태 필터 (전체 / 승인 / 반려)
  - 승인 / 반려 액션 → 상태 업데이트 + toast 알림
- **UX 최적화**
  - GSAP 기반 카드 등장 애니메이션
  - 반응형 UI (모바일 / 태블릿 / 데스크톱)
  - 다크모드(선택사항)
- **로딩 및 에러 상태 처리**
  - React Query 로딩 스피너, 에러 메시지 표시
  - Axios 에러 핸들링

---

## 🧱 기술 스택 및 선택 이유

| 구분 | 기술 | 선택 이유 |
|------|------|-----------|
| **Framework** | Next.js (Pages Router) | 파일 기반 라우팅, 빠른 배포(Vercel)와 친화적 |
| **Language** | TypeScript | 타입 안정성과 유지보수성 강화 |
| **상태 관리** | Zustand | Redux 대비 가볍고, 간결한 전역 상태 관리에 적합 |
| **서버 상태** | React Query | API 캐싱, 로딩/에러 관리, 쿼리 무효화 지원 |
| **UI/UX** | Tailwind CSS + shadcn/ui | 빠른 스타일링 + 실무형 UI 컴포넌트 |
| **Form** | React Hook Form + Zod | Form 유효성 검사 및 에러 핸들링 효율화 |
| **애니메이션** | GSAP | 부드러운 페이지 전환 및 인터랙션 강화 |
| **알림** | react-hot-toast | UX 개선을 위한 실시간 피드백 |
| **배포** | Vercel | CI/CD가 간단하고 실시간 공유에 용이 |

---

## 📁 폴더 구조

```

src/
├── components/      # 공통 UI 컴포넌트 (UserCard, FilterBar 등)
├── pages/           # login.tsx, dashboard.tsx
├── features/        # users/, auth/ 등 기능 단위 디렉토리
├── services/        # API 요청 모듈 (axios + mock)
├── stores/          # Zustand 상태 저장소
├── hooks/           # 커스텀 훅 (useAuth, useUserActions 등)
├── schemas/         # Zod 유효성 스키마
├── types/           # 전역 타입 정의
├── utils/           # 공통 유틸 함수 (formatDate, clsx 등)
└── styles/          # 글로벌 스타일 파일

````

---

## 🚀 실행 방법

```bash
# 1. 레포 클론
git clone https://github.com/your-id/dashbit.git

# 2. 의존성 설치
cd dashbit
npm install

# 3. 개발 서버 실행
npm run dev
````

---

## 🧪 트러블슈팅 사례

### 1. React Query 캐싱 충돌 문제

* **문제**: 상태 필터 전환 시 기존 캐시가 유지되어 UI가 잘못 표시됨.
* **원인**: 쿼리 키가 고정되어 상태별 요청을 구분하지 못함.
* **해결**: `['users', status]` 형태로 쿼리 키를 동적 생성하여 문제 해결.
* **결과**: 필터 전환 시 정확한 데이터 반영, UX 개선.

### 2. Zustand 상태 초기화 문제

* **문제**: 로그아웃 후 이전 상태가 남아있는 현상 발생.
* **해결**: Zustand store에서 `reset()` 메서드 추가로 로그아웃 시 상태 초기화.
* **결과**: 로그인/로그아웃 흐름 정상화.

---

## 📷 주요 화면 미리보기

> `/public/readme/` 폴더에 캡처 이미지를 저장하고 아래 경로로 수정하세요.

| 화면            | 이미지                                         |
| ------------- | ------------------------------------------- |
| 로그인 화면        | ![login](./public/readme/login.png)         |
| 대시보드 전체 UI    | ![dashboard](./public/readme/dashboard.png) |
| 필터 동작 예시      | ![filter](./public/readme/filter.png)       |
| 승인 → Toast 발생 | ![toast](./public/readme/toast.png)         |
| 모바일 대응        | ![responsive](./public/readme/mobile.png)   |

---

## 📚 프로젝트 요약

| 항목     | 내용                       |
| ------ | ------------------------ |
| 제작 기간  | 2025.08.01 \~ 2025.08.07 |
| 기여도    | 100% 개인 개발               |
| 핵심 포인트 | 상태 관리, 비동기 처리, UI/UX 최적화 |
| 목적     | 실무형 관리자 대시보드 구현 경험 확보    |

---

## 🔗 기타 링크

* 🔍 [트러블슈팅 아카이브 (Notion)](https://www.notion.so/your-troubleshooting-link)
* 🧾 [포트폴리오 PPT 정리본](https://your-link.com)

---





# Dashbit – 관리자 대시보드 (Admin Dashboard)

[배포 링크](https://dashbit.vercel.app)
[시연 영상](https://youtu.be/...)
[트러블슈팅 정리](https://notion.so/...)

---

## 📌 프로젝트 소개

이 프로젝트는 관리자용 콘텐츠 승인 대시보드로, 실무에서 자주 등장하는 상태 관리 및 비동기 데이터 흐름을 중심으로 구성된 SPA입니다.

- 승인/반려 워크플로우를 통한 **상태 관리 구현력** 어필
- shadcn/ui + Tailwind 기반의 **일관된 UI/UX 구성**
- React Query, Zustand, Zod 등 트렌디한 기술 스택 활용

---

## 💻 사용 기술 스택

- **Framework**: Next.js (pages router), TypeScript
- **State**: Zustand, React Query
- **UI/UX**: Tailwind CSS, shadcn/ui, GSAP, toast
- **Form**: React Hook Form + Zod
- **기타**: Vercel 배포, ESLint, Prettier

---

## 📁 폴더 구조 (요약)

```txt
src/
├── pages/
├── components/
├── features/
├── services/
├── stores/
├── hooks/
├── schemas/
├── types/

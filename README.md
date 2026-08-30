# leelog

리눅스 운영 · 네트워크 · 컨테이너 · 클라우드를 공부하며 기록하는 개인 기술 블로그입니다.

- **스택**: Astro 7 · TypeScript · MDX · Tailwind CSS v4 · KaTeX · Shiki(rehype-pretty-code) · Giscus · astro-icon
- **배포 타깃**: GitHub Pages

## 프로젝트 구조

```text
src/
├── config.ts             # 사이트 메타, 프로필, 소셜 링크, Giscus 설정, 카테고리 트리 (전부 여기서 관리)
├── content.config.ts      # posts 컬렉션 Zod 스키마
├── content/posts/*.mdx    # 실제 글
├── layouts/
│   ├── BaseLayout.astro   # 헤더 + (있으면) 우측 TOC + 푸터 뼈대 (사이드바 없음)
│   └── PostLayout.astro   # 글 상세 전용 레이아웃(메타/배지/시리즈/관련글/댓글)
├── components/            # Header, PostListItem, Badge, Callout, SeriesWidget, TOC, Giscus 등
├── lib/                   # posts/dates/search/techStack 등 콘텐츠 집계 유틸
└── pages/                 # 라우팅 (아래 참고)
```

내비게이션은 헤더 로고(홈) + `Series` + `About` + 검색(⌘K)만 남겨 최대한 단순화했습니다. 카테고리·태그별로 글을 훑어보는 전용 페이지(`/blog`, `/tags`)는 없고, 태그는 검색 모달 안의 필터 칩으로만 씁니다.

### 라우팅

| 경로 | 파일 |
| --- | --- |
| `/` | `src/pages/index.astro` — 전체 글 목록, "더 보기" 클릭으로 10개씩 배치 로딩 |
| `/series`, `/series/<이름>` | `src/pages/series/` |
| `/about` | `src/pages/about.astro` |
| `/<category>/<slug>` | `src/pages/[category]/[slug].astro` — 글 상세 (frontmatter의 `category`가 URL 세그먼트일 뿐, 카테고리 전용 목록 페이지는 없음) |
| `/search-index.json` | `src/pages/search-index.json.ts` — ⌘K 검색(제목/설명/태그) + 태그 필터용 정적 인덱스 |

## 로컬 실행

```sh
npm install
npm run dev          # http://localhost:4321
```

기타 명령:

```sh
npm run build         # 정적 빌드 → dist/
npm run preview       # 빌드 결과 로컬 미리보기
npx astro check        # 타입 검사
```

## 글 작성 방법

`src/content/posts/` 아래에 `.mdx` 파일을 하나 추가하면 됩니다. 파일 이름이 곧 URL의 slug가 되므로 영문 kebab-case를 권장합니다 (예: `my-new-post.mdx`).

```yaml
---
title: "글 제목"
description: "카드/메타에 노출되는 한 줄 요약"
pubDate: 2024-03-01
updatedDate: 2024-03-05        # 생략 가능. 있으면 글 상세에 pubDate 대신 이 날짜만 표시됨
category: "linux"               # src/config.ts의 CATEGORY_TREE에 정의된 slug 중 하나
tags: ["Linux", "Systemd"]
series: "시리즈 이름"            # 선택. 여러 글이 같은 값을 쓰면 자동으로 묶임
seriesOrder: 1                   # 시리즈 내 정렬 순서(선택)
draft: false                     # true면 프로덕션 빌드에서 제외 (dev에서는 계속 보임)
pinned: false                    # 현재 코드에서는 미사용. 추후 정렬/추천 기능용으로 필드만 유지
views: 0                         # 현재 코드에서는 미사용(선택)
---

## 첫 번째 섹션

본문은 MDX이므로 컴포넌트를 바로 쓸 수 있습니다.

import Callout from '../../components/Callout.astro';

<Callout emoji="ℹ️">이런 식으로 콜아웃을 넣을 수 있습니다.</Callout>
```

- **카테고리**: `category` 값은 `src/config.ts`의 `CATEGORY_TREE`에 정의된 slug와 정확히 일치해야 합니다(빌드 시 Zod로 검증됨). 새 카테고리를 추가하려면 이 파일의 트리를 수정하세요.
- **읽기 시간 / 카테고리·태그·시리즈 개수**는 전부 콘텐츠에서 자동 계산됩니다(`src/lib/`). 하드코딩할 필요 없습니다.
- **코드블록**: 언어 뒤에 ` title="파일명"` 을 붙이면 상단 라벨이 파일명으로 표시됩니다. 없으면 언어명이 자동으로 표시됩니다. 복사 버튼은 자동으로 붙습니다.
- **수식**: `$...$`(인라인), `$$...$$`(블록) 문법으로 KaTeX 수식을 쓸 수 있습니다.

## TODO

- [ ] `SITE_URL` 실제 도메인 반영 (`astro.config.mjs`) — 도메인 구매 후 연결할 예정이라 보류 중. 연결 시 `base` 필요 여부도 함께 확인
- [ ] Giscus 연동 (Discussions 카테고리 확정 → [giscus.app](https://giscus.app)에서 값 발급 → `src/config.ts`의 `GISCUS_CONFIG` 채우기)
- [x] 반응형 스타일링 1차 (모바일에서 본문이 다른 요소보다 먼저 나오도록 순서 수정, 표 가로 스크롤 처리) — 세부 컴포넌트별 점검은 계속 필요할 수 있음
- [ ] SEO (메타태그, `sitemap.xml`, RSS, OG 이미지)
- [x] 테마 색상 재구성 (다크 테마를 네이비 톤에서 뉴트럴 zinc 계열로 교체)

> 완료: `SITE`/`PROFILE`/`SOCIAL_LINKS`(GitHub, Email) 및 아바타 이미지(`public/avatar.jpg`) 반영 완료. 좌측 사이드바(프로필 카드·카테고리 트리)는 제거했고, 프로필/카테고리 정보는 `/about` 페이지로 이전 완료. 내비게이션을 로고(홈)+Series+About+검색만 남기도록 단순화하고 `/blog`, `/tags` 페이지는 삭제, 태그는 검색 모달 필터로만 사용하도록 변경 완료. `PostCard`/`readingTime` 관련 코드가 정리되면서 읽기 시간 캐시 버그 항목은 대상 기능 자체가 없어져 삭제.

### 콘텐츠 관리 방식 (MDX vs DB)

현재는 `src/content/posts/*.mdx` + git으로 글을 관리합니다. 개인 기술 블로그 규모(수백 편 이내)에서는 이 방식을 유지하는 걸 권장합니다:

- 글 작성/수정 이력이 git으로 자동 기록되고, 별도 백엔드·DB 운영 부담이 없습니다.
- Astro content collections는 수천 개 파일까지도 빌드 성능에 큰 문제가 없습니다.
- 검색은 이미 정적 인덱스(`search-index.json`)로 처리 중이라 DB 없이도 충분합니다.

아래 상황이 되면 DB(혹은 헤드리스 CMS) 도입을 다시 고려하면 됩니다:

- 비개발자가 git 없이 웹에서 직접 글을 쓰고 싶어질 때
- 댓글 수/조회수처럼 **런타임에 계속 바뀌는 데이터**를 직접 저장·집계해야 할 때 (지금은 `views`가 frontmatter에 하드코딩된 임시값)
- 글 수가 수천 단위로 늘어나 빌드 시간이 실제로 병목이 될 때

지금 단계에서는 액션 아이템 아님 — 위 조건 중 하나라도 현실화되면 그때 다시 논의.

### Giscus 설정 방법

1. 블로그로 쓸 GitHub 저장소에 [giscus 앱](https://github.com/apps/giscus)을 설치합니다.
2. 해당 저장소 **Settings → General → Features**에서 Discussions를 켭니다.
3. [giscus.app](https://giscus.app)에서 저장소를 입력해 `data-repo-id`, `data-category-id` 값을 발급받습니다.
4. `src/config.ts`의 `GISCUS_CONFIG`에 `repo`, `repoId`, `category`, `categoryId`를 채워 넣습니다.

## GitHub Pages 배포 (GitHub Actions)

`.github/workflows/deploy.yml`에 빌드·배포 워크플로우가 포함되어 있습니다 (공식 [`withastro/action`](https://github.com/withastro/action) 사용). **현재는 `workflow_dispatch`(수동 실행)만 트리거로 걸려 있어 push해도 자동으로 돌지 않습니다** — 저장소에서 아직 Pages를 설정하지 않아 자동 배포가 계속 실패했기 때문에 의도적으로 꺼둔 상태입니다. 도메인을 연결할 준비가 되면:

1. GitHub 저장소 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 설정합니다.
2. `astro.config.mjs`의 `SITE_URL`(및 필요 시 `base`)을 실제 배포 도메인에 맞게 수정합니다.
   - `<username>.github.io` 유저 사이트: `base` 불필요.
   - `<username>.github.io/<repo>` 프로젝트 사이트: `base: '/<repo>'` 주석을 해제하세요.
3. `deploy.yml`의 `on:`에 `push: branches: [main]`을 다시 추가해 push마다 자동 배포되게 하거나, Actions 탭에서 `workflow_dispatch`로 수동 실행합니다.

> 참고: 코드 안의 페이지 내비게이션 링크(`/series`, `/about` 등)는 절대 경로 문자열로 작성되어 있습니다. 프로젝트 사이트로 배포해 `base`를 설정하는 경우, 별도 헬퍼 없이 하드코딩된 절대 경로를 그대로 쓰면 `base` 프리픽스가 붙지 않으니 주의하세요(유저 사이트 배포라면 문제없습니다).

## 범위 밖

이번 초기 구축에서는 SEO 메타태그, `sitemap.xml`, RSS, OG 이미지, 실제 조회수 애널리틱스 연동은 의도적으로 제외했습니다(요구사항 범위 밖). 인기 글 섹션은 홈페이지에서 제거되어 현재 별도로 노출되지 않습니다 — `content.config.ts`의 `views`/`pinned` 스키마 필드는 이후 다시 쓸 수 있도록 남겨두었지만 현재 코드에서 참조하는 곳은 없습니다.

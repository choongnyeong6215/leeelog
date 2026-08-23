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
│   ├── BaseLayout.astro   # 헤더 + 좌측 사이드바 + (있으면) 우측 TOC + 푸터 뼈대
│   └── PostLayout.astro   # 글 상세 전용 레이아웃(메타/배지/시리즈/관련글/댓글)
├── components/            # Header, Sidebar, PostCard, Badge, Callout, SeriesWidget, Giscus 등
├── lib/                   # posts/categories/dates/readingTime/search 등 콘텐츠 집계 유틸
└── pages/                 # 라우팅 (아래 참고)
```

### 라우팅

| 경로 | 파일 |
| --- | --- |
| `/` | `src/pages/index.astro` — 인기글 3개 + 최근 포스트 |
| `/blog` | `src/pages/blog/index.astro` — 전체 글, 카테고리/태그 클라이언트 필터 + 더보기 |
| `/series`, `/series/<이름>` | `src/pages/series/` |
| `/tags`, `/tags/<태그>` | `src/pages/tags/` |
| `/about` | `src/pages/about.astro` |
| `/<category>/<slug>` | `src/pages/[category]/[slug].astro` — 글 상세 (frontmatter의 `category`가 URL 세그먼트) |
| `/search-index.json` | `src/pages/search-index.json.ts` — ⌘K 검색용 정적 인덱스 |

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
updatedDate: 2024-03-05        # 생략 가능. pubDate와 다르면 "(수정: ...)" 표기
category: "linux"               # src/config.ts의 CATEGORY_TREE에 정의된 slug 중 하나
tags: ["Linux", "Systemd"]
series: "시리즈 이름"            # 선택. 여러 글이 같은 값을 쓰면 자동으로 묶임
seriesOrder: 1                   # 시리즈 내 정렬 순서(선택)
draft: false                     # true면 프로덕션 빌드에서 제외 (dev에서는 계속 보임)
pinned: false                    # 홈 "인기 글" 노출 후보로 우선 반영
views: 0                         # 추후 애널리틱스 연동 전까지 임시 조회수 값(선택)
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

## 배포 전 채워야 할 값 (플레이스홀더)

| 위치 | 항목 |
| --- | --- |
| `astro.config.mjs` | `SITE_URL` (실제 GitHub Pages 도메인), 프로젝트 사이트라면 `base` 주석 해제 |
| `src/config.ts` | `SITE`, `PROFILE`(닉네임/아바타), `SOCIAL_LINKS`(GitHub/LinkedIn/Email), `GISCUS_CONFIG` |
| `public/avatar.svg` | 실제 프로필 이미지로 교체 |

### Giscus 설정 방법

1. 블로그로 쓸 GitHub 저장소에 [giscus 앱](https://github.com/apps/giscus)을 설치합니다.
2. 해당 저장소 **Settings → General → Features**에서 Discussions를 켭니다.
3. [giscus.app](https://giscus.app)에서 저장소를 입력해 `data-repo-id`, `data-category-id` 값을 발급받습니다.
4. `src/config.ts`의 `GISCUS_CONFIG`에 `repo`, `repoId`, `category`, `categoryId`를 채워 넣습니다.

## GitHub Pages 배포 (GitHub Actions)

`.github/workflows/deploy.yml`에 `main` 브랜치 push 시 자동 빌드·배포하는 워크플로우가 이미 포함되어 있습니다 (공식 [`withastro/action`](https://github.com/withastro/action) 사용).

1. GitHub 저장소 **Settings → Pages → Build and deployment → Source**를 **GitHub Actions**로 설정합니다.
2. `astro.config.mjs`의 `SITE_URL`(및 필요 시 `base`)을 실제 배포 도메인에 맞게 수정합니다.
   - `<username>.github.io` 유저 사이트: `base` 불필요.
   - `<username>.github.io/<repo>` 프로젝트 사이트: `base: '/<repo>'` 주석을 해제하세요.
3. `main` 브랜치에 push하면 Actions 탭에서 빌드/배포가 진행됩니다.

> 참고: 코드 안의 페이지 내비게이션 링크(`/blog`, `/about` 등)는 절대 경로 문자열로 작성되어 있습니다. 프로젝트 사이트로 배포해 `base`를 설정하는 경우, 별도 헬퍼 없이 하드코딩된 절대 경로를 그대로 쓰면 `base` 프리픽스가 붙지 않으니 주의하세요(유저 사이트 배포라면 문제없습니다).

## 범위 밖

이번 초기 구축에서는 SEO 메타태그, `sitemap.xml`, RSS, OG 이미지, 실제 조회수 애널리틱스 연동은 의도적으로 제외했습니다(요구사항 범위 밖). 인기 글 노출은 frontmatter의 `views`/`pinned`로 임시 대체되어 있습니다 — 관련 지점은 `src/lib/posts.ts`의 `getPopularPosts` 주석을 참고하세요.

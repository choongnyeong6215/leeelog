// 사이트 전역 설정. 실제 배포 전 아래 플레이스홀더 값들을 교체하세요.

export const SITE = {
  // 브라우저 탭 타이틀 접미사 등에도 사용됨
  title: 'cnl99',
  description:
    '시스템 엔지니어를 지향하며 리눅스 운영, 네트워크, 컨테이너, 클라우드를 공부하고 기록하는 블로그입니다.',
} as const;

export const PROFILE = {
  nickname: 'cnl',
  // public/ 아래에 실제 아바타 이미지를 넣고 경로를 교체하세요. (예: '/avatar.png')
  avatar: '/avatar.jpg',
} as const;

export type SocialLink = {
  label: string;
  // astro-icon 아이콘 이름. 브랜드 로고는 simple-icons:*, UI 아이콘은 lucide:* 사용.
  icon: string;
  url: string;
};

// About 페이지와 홈 인트로 카드가 이 배열을 공통으로 사용합니다.
export const SOCIAL_LINKS: SocialLink[] = [
  { label: 'GitHub', icon: 'simple-icons:github', url: 'https://github.com/choongnyeong6215' },
  { label: 'Email', icon: 'lucide:mail', url: 'mailto:choong6215@gmail.com' },
];

export type NavLink = { label: string; href: string };

// 홈은 별도 탭 없이 헤더 로고 클릭으로 이동. 글 검색은 검색(⌘K)으로만.
export const NAV_LINKS: NavLink[] = [
  { label: 'Series', href: '/series' },
  { label: 'About', href: '/about' },
];

/**
 * Giscus 설정.
 * 1) 저장소에 giscus 앱(https://github.com/apps/giscus)을 설치하고
 * 2) 해당 저장소에서 GitHub Discussions 기능을 켠 뒤
 * 3) https://giscus.app 에서 repo/repoId/category/categoryId 값을 발급받아 아래에 채워넣으세요.
 */
export const GISCUS_CONFIG = {
  repo: 'USERNAME/REPO', // TODO: 예) 'octocat/octocat.github.io'
  repoId: 'REPLACE_WITH_REPO_ID', // TODO
  category: 'General', // TODO: Discussions 카테고리 이름
  categoryId: 'REPLACE_WITH_CATEGORY_ID', // TODO
  mapping: 'pathname' as const,
  strict: '0',
  reactionsEnabled: '1',
  emitMetadata: '0',
  inputPosition: 'bottom' as const,
  lang: 'ko',
};

// ---------------------------------------------------------------------------
// 카테고리 트리
// 운영자의 커리어 방향(리눅스 엔지니어 이직 준비)을 반영한 고정 트리.
// slug는 라우팅(/<category>/<slug>)과 posts frontmatter의 `category` 값으로 사용됩니다.
// 글 개수는 하드코딩하지 않고 src/lib/categories.ts 에서 콘텐츠로부터 자동 집계합니다.
// ---------------------------------------------------------------------------

export type CategoryLeaf = { slug: string; label: string };
export type CategoryGroup = { label: string; children: CategoryLeaf[] };

export const CATEGORY_TREE: CategoryGroup[] = [
  {
    label: 'System & Ops',
    children: [
      { slug: 'linux', label: 'Linux' },
      { slug: 'oracle-db', label: 'Oracle / Database' },
      { slug: 'network', label: 'Network' },
    ],
  },
  {
    label: 'Container',
    children: [
      { slug: 'docker', label: 'Docker' },
      { slug: 'kubernetes', label: 'Kubernetes' },
    ],
  },
  {
    label: 'Programming',
    children: [
      { slug: 'python', label: 'Python' },
      { slug: 'golang', label: 'Golang' },
    ],
  },
  {
    label: 'Cloud',
    children: [
      { slug: 'aws', label: 'AWS' },
      { slug: 'etc-cloud', label: '기타 (GCP/Azure)' },
    ],
  },
  {
    label: 'Learning',
    children: [
      { slug: 'retrospective', label: '회고 (Retrospective)' },
      { slug: 'review', label: 'Review' },
    ],
  },
];

export const CATEGORY_SLUGS = CATEGORY_TREE.flatMap((group) =>
  group.children.map((leaf) => leaf.slug),
) as [string, ...string[]];

export function getCategoryLeaf(slug: string): { leaf: CategoryLeaf; group: CategoryGroup } | undefined {
  for (const group of CATEGORY_TREE) {
    const leaf = group.children.find((c) => c.slug === slug);
    if (leaf) return { leaf, group };
  }
  return undefined;
}

// ---------------------------------------------------------------------------
// 이 블로그를 만든 기술 스택 배지 (About 페이지). 버전은 하드코딩하지 말고
// package.json에서 읽어 표시합니다 (src/lib/techStack.ts 참고).
// ---------------------------------------------------------------------------
export const TECH_STACK_PACKAGES = [
  { label: 'Astro', pkg: 'astro' },
  { label: 'TypeScript', pkg: 'typescript' },
  { label: 'MDX', pkg: '@astrojs/mdx' },
  { label: 'Tailwind CSS', pkg: 'tailwindcss' },
  { label: 'KaTeX', pkg: 'katex' },
  { label: 'Giscus', pkg: null },
] as const;

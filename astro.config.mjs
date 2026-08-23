// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import icon from 'astro-icon';
import tailwindcss from '@tailwindcss/vite';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypePrettyCode from 'rehype-pretty-code';

// TODO(deploy): GitHub Pages 배포 시 아래 site/base를 실제 값으로 교체하세요.
// - 유저 사이트(<username>.github.io)로 배포한다면: site만 실제 도메인으로 바꾸고 base는 생략(= '/').
// - 프로젝트 사이트(<username>.github.io/<repo>)로 배포한다면: base: '/<repo>' 를 추가.
const SITE_URL = 'https://username.github.io'; // TODO: 실제 GitHub Pages 도메인으로 교체
// const BASE_PATH = '/<repo>';

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  // base: BASE_PATH,
  integrations: [mdx(), icon()],
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    // rehype-pretty-code가 자체적으로 Shiki 하이라이팅을 수행하므로 Astro 기본 하이라이터는 끈다.
    syntaxHighlight: false,
    // Astro 7 기본 처리기(Sätteri)는 임의의 remark/rehype 플러그인을 지원하지 않으므로,
    // KaTeX/코드 하이라이팅 플러그인을 쓰기 위해 명시적으로 remark/rehype 파이프라인(unified)을 사용한다.
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [
        [
          rehypePrettyCode,
          {
            // 코드블록은 사이트 테마와 무관하게 항상 다크로 통일한다.
            theme: 'github-dark',
            keepBackground: true,
          },
        ],
        rehypeKatex,
      ],
    }),
  },
});

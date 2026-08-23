import pkgJson from '../../package.json';
import { TECH_STACK_PACKAGES } from '../config';

const pkg = pkgJson as { dependencies?: Record<string, string>; devDependencies?: Record<string, string> };

const allDeps: Record<string, string> = {
  ...(pkg.dependencies ?? {}),
  ...(pkg.devDependencies ?? {}),
};

function cleanVersion(range: string | undefined): string | null {
  if (!range) return null;
  return range.replace(/^[\^~]/, '');
}

export type TechBadge = { label: string; version: string | null };

/** About 페이지 Tech Stack 배지용 — 버전은 하드코딩하지 않고 package.json에서 읽는다. */
export function getTechStackBadges(): TechBadge[] {
  return TECH_STACK_PACKAGES.map(({ label, pkg: pkgName }) => ({
    label,
    version: pkgName ? cleanVersion(allDeps[pkgName]) : null,
  }));
}

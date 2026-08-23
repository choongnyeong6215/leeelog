// 한국어 본문 기준 대략적인 분당 읽기 속도(글자 수)로 읽기 시간을 추정한다.
const CHARS_PER_MINUTE = 500;

export function estimateReadingMinutes(rawBody: string): number {
  const stripped = rawBody
    .replace(/```[\s\S]*?```/g, '') // 코드블록 제외
    .replace(/`[^`]*`/g, '')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '') // 이미지
    .replace(/\[[^\]]*\]\([^)]*\)/g, '') // 링크 텍스트만 남기고 싶으면 별도 처리 필요하지만 근사치이므로 통째로 제외
    .replace(/[#>*_~-]/g, '')
    .trim();

  const charCount = stripped.replace(/\s/g, '').length;
  return Math.max(1, Math.round(charCount / CHARS_PER_MINUTE));
}

/**
 * Google Drive 공유 링크를 embed 가능한 URL로 변환
 * @param url Google Drive 공유 링크
 * @returns embed용 URL (/preview 형식)
 *
 * @example
 * // 입력: https://drive.google.com/file/d/1iwxpq3Pw1uLzODaavPi_5tsd0XL2W7d6/view?usp=drive_link
 * // 출력: https://drive.google.com/file/d/1iwxpq3Pw1uLzODaavPi_5tsd0XL2W7d6/preview
 */
export function getGoogleDriveEmbedUrl(url: string): string {
  // /view?usp=... 또는 /view 를 /preview 로 변환
  return url.replace(/\/view(\?.*)?$/, "/preview");
}

/**
 * YouTube URL을 embed 가능한 URL로 변환
 * @param url YouTube URL (watch, youtu.be, 또는 이미 embed 형식)
 * @returns embed용 URL
 *
 * @example
 * // 입력: https://www.youtube.com/watch?v=dQw4w9WgXcQ
 * // 출력: https://www.youtube.com/embed/dQw4w9WgXcQ
 *
 * // 입력: https://youtu.be/dQw4w9WgXcQ
 * // 출력: https://www.youtube.com/embed/dQw4w9WgXcQ
 */
export function getYouTubeEmbedUrl(url: string): string {
  if (url.includes("/embed/")) {
    return url;
  }

  const shortUrlMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortUrlMatch) {
    return `https://www.youtube.com/embed/${shortUrlMatch[1]}`;
  }

  const watchUrlMatch = url.match(/youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/);
  if (watchUrlMatch) {
    return `https://www.youtube.com/embed/${watchUrlMatch[1]}`;
  }

  return url;
}

/**
 * URL 타입을 감지하여 적절한 embed URL로 변환
 */
export function getVideoEmbedUrl(url: string): string {
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    return getYouTubeEmbedUrl(url);
  }
  if (url.includes("drive.google.com")) {
    return getGoogleDriveEmbedUrl(url);
  }
  return url;
}

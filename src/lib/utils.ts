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

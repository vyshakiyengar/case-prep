/**
 * Apps like Instagram, LinkedIn and Facebook open links in their own built-in browser.
 * Google blocks its sign-in there, so we spot those browsers and help people open the
 * page in Safari or Chrome instead. Add ?inapp=1 to a URL to preview this on a computer.
 */
const ua = typeof navigator === 'undefined' ? '' : navigator.userAgent

function detect(): string | null {
  try { if (new URLSearchParams(location.search).get('inapp') === '1') return 'Instagram' } catch { /* ignore */ }
  if (/Instagram/i.test(ua)) return 'Instagram'
  if (/FBAN|FBAV|FB_IAB|FBIOS/i.test(ua)) return 'Facebook'
  if (/LinkedInApp/i.test(ua)) return 'LinkedIn'
  if (/Snapchat/i.test(ua)) return 'Snapchat'
  if (/musical_ly|TikTok|BytedanceWebview/i.test(ua)) return 'TikTok'
  if (/Twitter/i.test(ua)) return 'X'
  if (/MicroMessenger/i.test(ua)) return 'WeChat'
  if (/\bLine\//i.test(ua)) return 'LINE'
  if (/Android.*; wv\)/i.test(ua)) return 'this app'
  return null
}

/** The app whose built-in browser this is, or null in a normal browser. */
export const inAppName = detect()
export const isAndroid = /Android/i.test(ua)
export const isIOS = /iPhone|iPad|iPod/i.test(ua)

/** On Android, a link that hands the current page to Chrome. */
export function chromeIntent(href: string): string {
  const u = new URL(href)
  u.searchParams.delete('inapp')
  return `intent://${u.host}${u.pathname}${u.search}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${encodeURIComponent(u.toString())};end`
}

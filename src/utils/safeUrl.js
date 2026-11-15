/**
 * Returns the URL if it is an absolute http(s) URL without embedded
 * credentials, otherwise null. Used for admin-entered links rendered as
 * <a href> / <img src>, so javascript:, data:, vbscript: etc. never reach
 * the DOM even for rows saved before server-side validation existed.
 * @param {unknown} value
 * @returns {string | null}
 */
export function safeHttpUrl(value) {
  if (typeof value !== 'string' || value.length > 2048) return null;
  try {
    const url = new URL(value.trim());
    if ((url.protocol === 'https:' || url.protocol === 'http:') && !url.username && !url.password) {
      return url.href;
    }
  } catch {
    // fall through
  }
  return null;
}

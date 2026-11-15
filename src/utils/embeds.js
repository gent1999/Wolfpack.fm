// Builds iframe src URLs for third-party players from admin-entered links.
// Every builder parses the input strictly and constructs the embed URL from
// validated parts only (fixed https host + allowlisted path + ID), so no
// part of an untrusted string is ever used as an iframe src verbatim.
// Rules mirror ServerPack's save-time validation (src/lib/urlValidation.js).

function parseUrl(value) {
  if (typeof value !== 'string' || value.length > 2048) return null;
  try {
    return new URL(value.trim());
  } catch {
    return null;
  }
}

// ---- Spotify ---------------------------------------------------------------

const SPOTIFY_HOST = 'open.spotify.com';
const SPOTIFY_TYPES = new Set(['track', 'album', 'playlist', 'artist', 'episode', 'show']);
const SPOTIFY_ID_RE = /^[A-Za-z0-9]{22}$/;
const SPOTIFY_LOCALE_RE = /^intl-[a-z]{2}(?:-[a-z]{2,4})?$/i;

export function isValidSpotifyId(value) {
  return typeof value === 'string' && SPOTIFY_ID_RE.test(value);
}

/**
 * Parses a Spotify link into { type, id }, or null.
 * Requires https, the exact host open.spotify.com (no lookalikes,
 * subdomains, ports or credentials) and one of these paths:
 *   /<type>/<id>, /intl-<lang>/<type>/<id>, /embed/<type>/<id>,
 *   /user/<user>/playlist/<id>
 * with <type> in track|album|playlist|artist|episode|show and a 22-char ID.
 */
export function parseSpotifyUrl(value) {
  const url = parseUrl(value);
  if (!url || url.protocol !== 'https:' || url.hostname !== SPOTIFY_HOST) return null;
  if (url.port || url.username || url.password) return null;

  const segments = url.pathname.split('/').filter(Boolean);
  if (segments.length && SPOTIFY_LOCALE_RE.test(segments[0])) segments.shift();
  if (segments[0] === 'embed') segments.shift();

  let type;
  let id;
  if (segments.length === 4 && segments[0] === 'user' && segments[2] === 'playlist') {
    [type, id] = ['playlist', segments[3]];
  } else if (segments.length === 2) {
    [type, id] = segments;
  } else {
    return null;
  }

  if (!SPOTIFY_TYPES.has(type) || !isValidSpotifyId(id)) return null;

  const theme = url.searchParams.get('theme');
  return { type, id, theme: theme === '0' || theme === '1' ? theme : null };
}

/** { src, type } for a valid Spotify link, otherwise null. */
export function getSpotifyEmbed(value) {
  const parsed = parseSpotifyUrl(value);
  if (!parsed) return null;
  const params = new URLSearchParams({ utm_source: 'generator' });
  if (parsed.theme) params.set('theme', parsed.theme);
  return {
    type: parsed.type,
    src: `https://${SPOTIFY_HOST}/embed/${parsed.type}/${parsed.id}?${params}`,
  };
}

export function getSpotifyEmbedUrl(value) {
  return getSpotifyEmbed(value)?.src ?? null;
}

// ---- YouTube ---------------------------------------------------------------

const YOUTUBE_ID_RE = /^[A-Za-z0-9_-]{11}$/;

export function getYoutubeEmbedUrl(value) {
  const url = parseUrl(value);
  if (!url || (url.protocol !== 'https:' && url.protocol !== 'http:') || url.username || url.password) return null;

  const host = url.hostname.replace(/^www\./, '');
  let videoId = null;
  if (host === 'youtu.be') {
    videoId = url.pathname.slice(1).split('/')[0];
  } else if (host === 'youtube.com' || host === 'm.youtube.com') {
    if (url.pathname === '/watch') {
      videoId = url.searchParams.get('v');
    } else if (url.pathname.startsWith('/embed/')) {
      videoId = url.pathname.split('/')[2];
    } else if (url.pathname.startsWith('/shorts/')) {
      videoId = url.pathname.split('/')[2];
    }
  }

  return videoId && YOUTUBE_ID_RE.test(videoId) ? `https://www.youtube.com/embed/${videoId}` : null;
}

// ---- SoundCloud ------------------------------------------------------------

const SOUNDCLOUD_HOSTS = new Set(['soundcloud.com', 'm.soundcloud.com', 'on.soundcloud.com']);

export function getSoundcloudEmbedUrl(value) {
  const url = parseUrl(value);
  if (!url || (url.protocol !== 'https:' && url.protocol !== 'http:') || url.username || url.password || url.port) return null;
  const host = url.hostname.replace(/^www\./, '');
  if (!SOUNDCLOUD_HOSTS.has(host) || url.pathname.length < 2) return null;

  const trackUrl = `https://${host}${url.pathname}`;
  return `https://w.soundcloud.com/player/?url=${encodeURIComponent(trackUrl)}&color=%233b82f6&auto_play=false&show_user=true&visual=false`;
}

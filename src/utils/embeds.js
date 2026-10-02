export function getSpotifyEmbedUrl(url) {
  if (!url) return null;
  if (url.includes('/embed/')) return url;

  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes('spotify.com')) return null;
    return `https://open.spotify.com/embed${parsed.pathname}${parsed.search}`;
  } catch {
    return null;
  }
}

export function getYoutubeEmbedUrl(url) {
  if (!url) return null;

  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, '');

    let videoId = null;
    if (host === 'youtu.be') {
      videoId = parsed.pathname.slice(1);
    } else if (host === 'youtube.com' || host === 'm.youtube.com') {
      if (parsed.pathname === '/watch') {
        videoId = parsed.searchParams.get('v');
      } else if (parsed.pathname.startsWith('/embed/')) {
        videoId = parsed.pathname.split('/embed/')[1];
      } else if (parsed.pathname.startsWith('/shorts/')) {
        videoId = parsed.pathname.split('/shorts/')[1];
      }
    }

    if (!videoId) return null;
    videoId = videoId.split('&')[0].split('?')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  } catch {
    return null;
  }
}

export function getSoundcloudEmbedUrl(url) {
  if (!url) return null;
  return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%233b82f6&auto_play=false&show_user=true&visual=false`;
}

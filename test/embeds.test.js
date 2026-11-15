import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getSpotifyEmbed, getSpotifyEmbedUrl, getYoutubeEmbedUrl, getSoundcloudEmbedUrl, isValidSpotifyId } from '../src/utils/embeds.js';
import { safeHttpUrl } from '../src/utils/safeUrl.js';

const ID = '4uLU6hMCjMI75M1A2tKUQC';
const PLAYLIST = '5BU7iuKWstCxQQ5C45Zg8Y';

test('existing legitimate Spotify links still embed', () => {
  const cases = [
    [`https://open.spotify.com/track/${ID}?si=abc`, { type: 'track', src: `https://open.spotify.com/embed/track/${ID}?utm_source=generator` }],
    [`https://open.spotify.com/album/${ID}`, { type: 'album', src: `https://open.spotify.com/embed/album/${ID}?utm_source=generator` }],
    [`https://open.spotify.com/playlist/${PLAYLIST}?si=c91a08c8045f4ecc`, { type: 'playlist', src: `https://open.spotify.com/embed/playlist/${PLAYLIST}?utm_source=generator` }],
    // Already-embed URLs (the old code passed these through unchanged).
    [`https://open.spotify.com/embed/playlist/${PLAYLIST}?utm_source=generator`, { type: 'playlist', src: `https://open.spotify.com/embed/playlist/${PLAYLIST}?utm_source=generator` }],
    [`https://open.spotify.com/embed/track/${ID}?utm_source=generator&theme=0`, { type: 'track', src: `https://open.spotify.com/embed/track/${ID}?utm_source=generator&theme=0` }],
    [`https://open.spotify.com/intl-fr/artist/${ID}`, { type: 'artist', src: `https://open.spotify.com/embed/artist/${ID}?utm_source=generator` }],
    [`https://open.spotify.com/episode/${ID}`, { type: 'episode', src: `https://open.spotify.com/embed/episode/${ID}?utm_source=generator` }],
    [`https://open.spotify.com/user/wolfpack/playlist/${PLAYLIST}`, { type: 'playlist', src: `https://open.spotify.com/embed/playlist/${PLAYLIST}?utm_source=generator` }],
  ];
  for (const [input, expected] of cases) assert.deepEqual(getSpotifyEmbed(input), expected, input);
});

test('malicious, lookalike, non-HTTPS and malformed Spotify links are rejected', () => {
  const bad = [
    'javascript:alert(1)//embed/',                                  // passed the OLD includes('/embed/') check
    `javascript:alert(1)//open.spotify.com/embed/track/${ID}`,
    `data:text/html,<script>alert(1)</script>/embed/`,
    `https://evil.example/embed/track/${ID}`,                       // also passed the old check
    `https://open.spotify.com.evil.example/track/${ID}`,
    `https://evilspotify.com/track/${ID}`,                          // old check: hostname.includes('spotify.com')
    `https://spotify.com.attacker.net/track/${ID}`,
    `https://open-spotify.com/track/${ID}`,
    `https://open.spotify.co/track/${ID}`,
    `https://open.spotify.com@evil.example/track/${ID}`,
    `https://x:y@open.spotify.com/track/${ID}`,
    `https://open.spotify.com:444/track/${ID}`,
    `http://open.spotify.com/track/${ID}`,
    `https://open.spotify.com/track/${ID}/extra`,
    `https://open.spotify.com/track/../../../evil`,
    `https://open.spotify.com/track/abc"onload="alert(1)`,
    `https://open.spotify.com/collection/tracks`,
    `https://open.spotify.com/`,
    `//open.spotify.com/track/${ID}`,
    `spotify:track:${ID}`,
    '', null, undefined, 123,
  ];
  for (const url of bad) assert.equal(getSpotifyEmbedUrl(url), null, String(url));
});

test('radio Spotify track IDs', () => {
  assert.equal(isValidSpotifyId(ID), true);
  for (const v of ['', null, 'abc', `${ID}?autoplay=1`, `../../embed/x`, `${ID}"><script>`]) assert.equal(isValidSpotifyId(v), false, String(v));
});

test('YouTube embeds are built from a validated 11-char video ID only', () => {
  assert.equal(getYoutubeEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ'), 'https://www.youtube.com/embed/dQw4w9WgXcQ');
  assert.equal(getYoutubeEmbedUrl('https://youtu.be/dQw4w9WgXcQ?t=10'), 'https://www.youtube.com/embed/dQw4w9WgXcQ');
  assert.equal(getYoutubeEmbedUrl('https://youtube.com/shorts/dQw4w9WgXcQ'), 'https://www.youtube.com/embed/dQw4w9WgXcQ');
  for (const bad of ['javascript:alert(1)', 'https://evil.example/watch?v=dQw4w9WgXcQ', 'https://www.youtube.com/watch?v=../../x', 'https://youtube.com.evil.example/watch?v=dQw4w9WgXcQ']) {
    assert.equal(getYoutubeEmbedUrl(bad), null, bad);
  }
});

test('SoundCloud embeds only for soundcloud.com links', () => {
  assert.match(getSoundcloudEmbedUrl('https://soundcloud.com/artist/track'), /^https:\/\/w\.soundcloud\.com\/player\/\?url=https%3A%2F%2Fsoundcloud\.com%2Fartist%2Ftrack&/);
  for (const bad of ['javascript:alert(1)', 'https://evil.example/artist/track', 'https://soundcloud.com.evil.example/x', 'not a url']) {
    assert.equal(getSoundcloudEmbedUrl(bad), null, bad);
  }
});

test('safeHttpUrl allows only absolute http(s) links', () => {
  assert.equal(safeHttpUrl('https://genius.com/artists/Echo'), 'https://genius.com/artists/Echo');
  for (const bad of ['javascript:alert(1)', ' JAVASCRIPT:alert(1)', 'data:text/html,x', 'vbscript:x', '/relative', 'https://u:p@x.example/', null]) {
    assert.equal(safeHttpUrl(bad), null, String(bad));
  }
});

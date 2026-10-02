import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { marked } from 'marked';
import { getSpotifyEmbedUrl, getSoundcloudEmbedUrl, getYoutubeEmbedUrl } from '../utils/embeds.js';
import './Story.css';

const API_URL = import.meta.env.VITE_API_URL;
const WOLFPACK_PLAYLIST_EMBED_URL = 'https://open.spotify.com/embed/playlist/5BU7iuKWstCxQQ5C45Zg8Y?utm_source=generator';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
}

function AdPlaceholder({ label }) {
  return <div className="ad-placeholder">{label}</div>;
}

function Story() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    setStatus('loading');
    fetch(`${API_URL}/api/articles/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('not found');
        return res.json();
      })
      .then((data) => {
        setArticle(data.article);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [slug]);

  if (status === 'loading') {
    return (
      <main className="page-main">
        <div className="story-page story--loading">Loading&hellip;</div>
      </main>
    );
  }

  if (status === 'error') {
    return (
      <main className="page-main">
        <div className="story-page story--error">
          <h1>Story not found</h1>
          <Link to="/" className="story__back">
            &larr; Back to home
          </Link>
        </div>
      </main>
    );
  }

  const spotifyEmbed = getSpotifyEmbedUrl(article.spotifyUrl);
  const soundcloudEmbed = getSoundcloudEmbedUrl(article.soundcloudUrl);
  const youtubeEmbed = getYoutubeEmbedUrl(article.youtubeUrl);
  const hasEmbeds = spotifyEmbed || soundcloudEmbed || youtubeEmbed;

  return (
    <main className="page-main">
      <div className="story-page">
        {/* Once articles have a cover image, it renders here, full-width
            across all three columns below, above this grid. */}

        <div className="story-layout">
          <aside className="story-ads-left">
            <AdPlaceholder label="Ad" />
            <AdPlaceholder label="Ad" />
          </aside>

          <article className="story-main">
            <Link to="/" className="story__back">
              &larr; Back to home
            </Link>

            <span className="story__tag">{article.tag}</span>
            <h1 className="story__title">{article.title}</h1>
            <p className="story__meta">
              {article.authorName}&nbsp;&nbsp;•&nbsp;&nbsp;{formatDate(article.publishedAt)}
            </p>

            <div className="story__content" dangerouslySetInnerHTML={{ __html: marked.parse(article.content) }} />

            {hasEmbeds && (
              <div className="story__embeds">
                {spotifyEmbed && (
                  <iframe
                    className="story__embed"
                    src={spotifyEmbed}
                    height={article.spotifyUrl.includes('/track/') ? 152 : 352}
                    frameBorder="0"
                    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                    loading="lazy"
                    title="Spotify embed"
                  />
                )}

                {soundcloudEmbed && (
                  <iframe
                    className="story__embed"
                    src={soundcloudEmbed}
                    height={166}
                    frameBorder="0"
                    scrolling="no"
                    allow="autoplay"
                    loading="lazy"
                    title="SoundCloud embed"
                  />
                )}

                {youtubeEmbed && (
                  <div className="story__embed-video">
                    <iframe
                      src={youtubeEmbed}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      loading="lazy"
                      title="YouTube embed"
                    />
                  </div>
                )}
              </div>
            )}
          </article>

          <aside className="story-side">
            <div className="story-side__playlist">
              <h2 className="story-side__playlist-title">Wolfpack Radio</h2>
              <iframe
                className="story__embed"
                src={WOLFPACK_PLAYLIST_EMBED_URL}
                height={352}
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="Wolfpack Radio playlist"
              />
            </div>

            <AdPlaceholder label="Ad" />
            <AdPlaceholder label="Ad" />
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Story;

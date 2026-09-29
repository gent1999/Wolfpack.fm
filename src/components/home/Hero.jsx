import { ArrowRight, Play } from 'lucide-react';
import wolfPic5 from '../../assets/wolf_pic5.jpg';
import './Hero.css';

const PLAYLIST_URL = 'https://open.spotify.com/playlist/5BU7iuKWstCxQQ5C45Zg8Y?si=c91a08c8045f4ecc';
const PLAYLIST_EMBED_URL = 'https://open.spotify.com/embed/playlist/5BU7iuKWstCxQQ5C45Zg8Y?utm_source=generator';

function Hero() {
  return (
    <section className="hero" aria-label="Wolfpack Radio">
      <div className="hero__bg" style={{ '--hero-bg-image': `url(${wolfPic5})` }} aria-hidden="true" />

      <div className="site-container hero__inner">
        <div className="hero__content">
          <h1 className="hero__title">
            <span className="hero__title-line">Wolfpack</span>
            <span className="hero__title-line">Radio</span>
          </h1>

          <p className="hero__description">
            Underground rap, lyricism, and new voices.
            <br />
            Curated by ECHO + pluggpress.
          </p>

          <div className="hero__actions">
            <a
              className="hero__button hero__button--primary"
              href={PLAYLIST_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Play size={16} strokeWidth={2} fill="currentColor" aria-hidden="true" />
              Listen Now
            </a>
            <a
              className="hero__button hero__button--secondary"
              href={PLAYLIST_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Playlist
              <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
            </a>
          </div>

          <p className="hero__meta">7 tracks&nbsp;&nbsp;•&nbsp;&nbsp;16 min</p>
        </div>

        <div className="hero__playlist">
          <span className="hero__eyebrow">Featured Playlist</span>

          <div className="hero__artwork">
            <iframe
              className="hero__artwork-embed"
              src={PLAYLIST_EMBED_URL}
              title="Wolfpack Radio playlist on Spotify"
              width="100%"
              height="352"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
            />
          </div>

          <div className="hero__playlist-info">
            <h2 className="hero__playlist-title">Wolfpack Radio</h2>
            <p className="hero__playlist-description">
              Underground rap, lyricism, and new voices.
            </p>
            <p className="hero__playlist-credit">Curated by ECHO + pluggpress.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Mic2 } from 'lucide-react';
import './ArtistPage.css';

const API_URL = import.meta.env.VITE_API_URL;

const PLATFORM_LINKS = [
  { key: 'spotifyUrl', label: 'Spotify' },
  { key: 'soundcloudUrl', label: 'SoundCloud' },
  { key: 'youtubeUrl', label: 'YouTube' },
  { key: 'geniusUrl', label: 'Genius' },
  { key: 'appleMusicUrl', label: 'Apple Music' },
];

function ArtistPage() {
  const { slug } = useParams();
  const [artist, setArtist] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    setStatus('loading');
    fetch(`${API_URL}/api/artists/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error('not found');
        return res.json();
      })
      .then((data) => {
        setArtist(data.artist);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [slug]);

  if (status === 'loading') {
    return (
      <main className="page-main">
        <div className="artist-page artist-page--loading">Loading&hellip;</div>
      </main>
    );
  }

  if (status === 'error') {
    return (
      <main className="page-main">
        <div className="artist-page artist-page--error">
          <h1>Artist not found</h1>
          <Link to="/artists" className="artist-page__back">
            &larr; Back to artists
          </Link>
        </div>
      </main>
    );
  }

  const links = PLATFORM_LINKS.filter(({ key }) => artist[key]);

  return (
    <main className="page-main">
      <div className="artist-page">
        <Link to="/artists" className="artist-page__back">
          &larr; Back to artists
        </Link>

        <div className="artist-page__header">
          <div className="artist-page__photo">
            {artist.imageUrl ? (
              <img src={artist.imageUrl} alt={artist.name} />
            ) : (
              <div className="artist-page__photo-fallback">
                <Mic2 size={48} strokeWidth={1.5} />
              </div>
            )}
          </div>

          <div className="artist-page__intro">
            <h1 className="artist-page__name">{artist.name}</h1>
            {artist.bio && <p className="artist-page__bio">{artist.bio}</p>}

            {links.length > 0 && (
              <div className="artist-page__links">
                {links.map(({ key, label }) => (
                  <a key={key} href={artist[key]} target="_blank" rel="noopener noreferrer" className="artist-page__link">
                    {label}
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default ArtistPage;

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mic2 } from 'lucide-react';
import './Artists.css';

const API_URL = import.meta.env.VITE_API_URL;

function Artists() {
  const [artists, setArtists] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    fetch(`${API_URL}/api/artists`)
      .then((res) => res.json())
      .then((data) => {
        setArtists(data.artists || []);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  return (
    <main className="page-main">
      <section className="artists-page">
        <div className="site-container">
          <h1 className="artists-page__heading">Artists</h1>
          <p className="artists-page__subhead">Voices from the underground, featured on Wolfpack.fm.</p>

          {status === 'loading' && <div className="artists-page__empty">Loading&hellip;</div>}
          {status === 'error' && <div className="artists-page__empty">Could not load artists.</div>}
          {status === 'ready' && artists.length === 0 && (
            <div className="artists-page__empty">No artist profiles yet.</div>
          )}

          {status === 'ready' && artists.length > 0 && (
            <div className="artists-page__grid">
              {artists.map((artist) => (
                <Link key={artist.id} to={`/artists/${artist.slug}`} className="artist-card">
                  <div className="artist-card__image-wrap">
                    {artist.imageUrl ? (
                      <img src={artist.imageUrl} alt="" className="artist-card__image" />
                    ) : (
                      <div className="artist-card__fallback">
                        <Mic2 size={32} strokeWidth={1.5} />
                      </div>
                    )}
                  </div>
                  <h3 className="artist-card__name">{artist.name}</h3>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Artists;

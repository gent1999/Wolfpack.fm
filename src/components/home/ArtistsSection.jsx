import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Mic2 } from 'lucide-react';
import './ArtistsSection.css';

const API_URL = import.meta.env.VITE_API_URL;
const PREVIEW_COUNT = 4;

function ArtistsSection() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/artists`)
      .then((res) => res.json())
      .then((data) => setArtists(data.artists || []))
      .catch(() => setArtists([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading || artists.length === 0) return null;

  return (
    <section className="artists-section" aria-label="Featured Artists">
      <div className="site-container">
        <div className="artists-section__header">
          <div>
            <span className="section-eyebrow">The Collective</span>
            <h2 className="artists-section__heading">Featured Artists</h2>
          </div>
          <Link to="/artists" className="artists-section__view-all">
            View All &rarr;
          </Link>
        </div>

        <div className="artists-section__grid">
          {artists.slice(0, PREVIEW_COUNT).map((artist) => (
            <Link key={artist.id} to={`/artists/${artist.slug}`} className="artist-card">
              <div className="artist-card__image-wrap">
                {artist.imageUrl ? (
                  <img src={artist.imageUrl} alt="" className="artist-card__image" />
                ) : (
                  <div className="artist-card__fallback">
                    <Mic2 size={28} strokeWidth={1.5} />
                  </div>
                )}
              </div>
              <h3 className="artist-card__name">{artist.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ArtistsSection;

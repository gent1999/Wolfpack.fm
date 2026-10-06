import { Link } from 'react-router-dom';
import { Music2 } from 'lucide-react';
import SpotifyPlaylistEmbed from '../components/radio/SpotifyPlaylistEmbed.jsx';
import SpotifyTrackEmbed from '../components/radio/SpotifyTrackEmbed.jsx';
import './Radio.css';

const PLAYLIST_ID = '5BU7iuKWstCxQQ5C45Zg8Y';
const PLAYLIST_URL = `https://open.spotify.com/playlist/${PLAYLIST_ID}?si=c91a08c8045f4ecc`;

// Fill in spotifyTrackId for each track to enable real playback -- see
// SpotifyTrackEmbed, which renders a placeholder until an ID is present.
const rotationTracks = [
  { number: '01', title: 'bmw', artist: 'R2R MOE', spotifyTrackId: '' },
  { number: '02', title: "Actin' Crazy", artist: 'Solo B', spotifyTrackId: '' },
  { number: '03', title: 'Platinum Fubu', artist: 'Mez, UMI', spotifyTrackId: '' },
  { number: '04', title: 'Stay Focused', artist: 'Drob, Waldy', spotifyTrackId: '' },
];

const recentlyAdded = [
  { title: 'GASLIGHT', artist: 'ECHO' },
  { title: 'ROCKSTAR', artist: 'ECHO' },
  { title: 'SMOKE N MIRRORS', artist: 'ECHO' },
  { title: 'DEAR LORD', artist: 'ECHO' },
];

const featuredTrack = rotationTracks[0];
const featuredHref = featuredTrack.spotifyTrackId
  ? `https://open.spotify.com/track/${featuredTrack.spotifyTrackId}`
  : PLAYLIST_URL;

function Radio() {
  return (
    <main className="page-main radio-page" aria-label="Radio">
      <section className="radio-intro">
        <div className="radio-container">
          <span className="radio-eyebrow">Wolfpack Radio</span>
          <h1 className="radio-intro__heading">Radio</h1>
          <p className="radio-intro__copy">
            A curated rotation of underground rap, lyricism, and new voices.
            <br />
            Updated regularly by ECHO and pluggpress.
          </p>
        </div>
      </section>

      <section className="radio-playlist" aria-label="Wolfpack Radio playlist">
        <div className="radio-container">
          <SpotifyPlaylistEmbed playlistId={PLAYLIST_ID} title="Wolfpack Radio playlist on Spotify" height={352} />
          <p className="radio-playlist__meta">
            7 Tracks&nbsp;&nbsp;&bull;&nbsp;&nbsp;16 Min&nbsp;&nbsp;&bull;&nbsp;&nbsp;Updated Weekly
          </p>
        </div>
      </section>

      <section className="radio-rotation" aria-label="Now in rotation">
        <div className="radio-container">
          <div className="radio-section-header">
            <div>
              <span className="radio-eyebrow">Now In Rotation</span>
              <h2 className="radio-section-heading">In Rotation</h2>
            </div>
            <a className="radio-view-all" href={PLAYLIST_URL} target="_blank" rel="noopener noreferrer">
              View Full Playlist &rarr;
            </a>
          </div>

          <div className="radio-rotation__grid">
            {rotationTracks.map((track) => (
              <SpotifyTrackEmbed key={track.number} {...track} />
            ))}
          </div>
        </div>
      </section>

      <section className="radio-feature">
        <div className="radio-container radio-feature__grid">
          <div className="radio-about" aria-label="About Wolfpack Radio">
            <span className="radio-eyebrow">About Wolfpack Radio</span>
            <p className="radio-about__copy">
              Wolfpack Radio is a curated rotation of underground rap, emerging artists, and records we think deserve
              more attention.
            </p>
            <p className="radio-about__copy">
              Updated regularly by ECHO and pluggpress, the playlist moves between new discoveries, Wolfpack
              affiliates, and artists from across the underground.
            </p>
          </div>

          <div className="feature-card" aria-label="Featured this week">
            <span className="radio-eyebrow">Featured This Week</span>

            <div className="feature-card__body">
              <div className="feature-card__art" aria-hidden="true">
                <Music2 size={30} strokeWidth={1.5} />
              </div>

              <div className="feature-card__text">
                <span className="feature-card__label">Featured Artist</span>
                <h3 className="feature-card__title">{featuredTrack.artist}</h3>
                <p className="feature-card__track">&ldquo;{featuredTrack.title}&rdquo;</p>
                <p className="feature-card__copy">
                  R2R MOE&rsquo;s &ldquo;bmw&rdquo; stands out for its raw energy and confident delivery, making it
                  one of the strongest new records in the underground right now. It is a natural fit for Wolfpack
                  Radio.
                </p>
                <a className="feature-card__link" href={featuredHref} target="_blank" rel="noopener noreferrer">
                  Listen On Spotify &rarr;
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="radio-recent" aria-label="Recently added">
        <div className="radio-container">
          <div className="radio-section-header">
            <div>
              <span className="radio-eyebrow">Recently Added</span>
              <h2 className="radio-section-heading">Recently Added</h2>
            </div>
            <Link className="radio-view-all" to="/artists/echo">
              View All &rarr;
            </Link>
          </div>

          <div className="radio-recent__grid">
            {recentlyAdded.map((track) => (
              <div key={track.title} className="recent-card">
                <div className="recent-card__art" aria-hidden="true">
                  <Music2 size={18} strokeWidth={1.5} />
                </div>
                <div className="recent-card__body">
                  <p className="recent-card__title">{track.title}</p>
                  <p className="recent-card__artist">{track.artist}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Radio;

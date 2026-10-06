import './SpotifyTrackEmbed.css';

// Real Spotify compact track embeds only -- no custom player UI. When a
// track doesn't have a spotifyTrackId yet, render a placeholder at the same
// height so the grid doesn't jump once real IDs are filled in.
function SpotifyTrackEmbed({ number, title, artist, spotifyTrackId }) {
  return (
    <div className="spotify-track-embed">
      <span className="spotify-track-embed__number">{number}</span>

      {spotifyTrackId ? (
        <iframe
          className="spotify-track-embed__frame"
          src={`https://open.spotify.com/embed/track/${spotifyTrackId}?utm_source=generator`}
          title={`${title} by ${artist} on Spotify`}
          width="100%"
          height="80"
          frameBorder="0"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        />
      ) : (
        <div className="spotify-track-embed__placeholder">
          <p className="spotify-track-embed__placeholder-title">{title}</p>
          <p className="spotify-track-embed__placeholder-artist">{artist}</p>
          <p className="spotify-track-embed__placeholder-note">Add a spotifyTrackId to enable playback</p>
        </div>
      )}
    </div>
  );
}

export default SpotifyTrackEmbed;

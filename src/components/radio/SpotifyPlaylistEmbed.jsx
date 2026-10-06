import './SpotifyPlaylistEmbed.css';

function SpotifyPlaylistEmbed({ playlistId, title = 'Spotify playlist', height = 352 }) {
  return (
    <div className="spotify-playlist-embed">
      <iframe
        className="spotify-playlist-embed__frame"
        src={`https://open.spotify.com/embed/playlist/${playlistId}?utm_source=generator`}
        title={title}
        width="100%"
        height={height}
        frameBorder="0"
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
        loading="lazy"
      />
    </div>
  );
}

export default SpotifyPlaylistEmbed;

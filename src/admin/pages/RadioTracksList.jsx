import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { api } from '../api.js';

function RadioTracksList() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api
      .listRadioTracks()
      .then((data) => setTracks(data.tracks))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id, title) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await api.deleteRadioTrack(id);
    load();
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1>Radio Tracks</h1>
        <Link to="/admin/radio-tracks/new" className="admin-button admin-button--primary" style={{ width: 'auto' }}>
          + New Track
        </Link>
      </div>

      <div className="admin-table-wrap">
        {loading ? (
          <div className="admin-empty">Loading&hellip;</div>
        ) : tracks.length === 0 ? (
          <div className="admin-empty">No radio tracks yet.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Position</th>
                <th>Title</th>
                <th>Artist</th>
                <th>Spotify ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tracks.map((track) => (
                <tr key={track.id}>
                  <td>{track.position}</td>
                  <td>
                    {track.featured && (
                      <Star size={14} fill="currentColor" className="admin-table__star" aria-label="Featured" />
                    )}
                    {track.title}
                  </td>
                  <td>{track.artist}</td>
                  <td>
                    {track.spotifyTrackId ? (
                      track.spotifyTrackId
                    ) : (
                      <span className="admin-badge">No ID</span>
                    )}
                  </td>
                  <td className="admin-table__actions">
                    <Link to={`/admin/radio-tracks/${track.id}/edit`}>Edit</Link>
                    <button type="button" className="admin-table__delete" onClick={() => handleDelete(track.id, track.title)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default RadioTracksList;

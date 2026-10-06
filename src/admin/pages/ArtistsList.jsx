import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { api } from '../api.js';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function ArtistsList() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api
      .listArtists()
      .then((data) => setArtists(data.artists))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id, name) {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await api.deleteArtist(id);
    load();
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1>Artists</h1>
        <Link to="/admin/artists/new" className="admin-button admin-button--primary" style={{ width: 'auto' }}>
          + New Artist
        </Link>
      </div>

      <div className="admin-table-wrap">
        {loading ? (
          <div className="admin-empty">Loading&hellip;</div>
        ) : artists.length === 0 ? (
          <div className="admin-empty">No artist profiles yet.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Created</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {artists.map((artist) => (
                <tr key={artist.id}>
                  <td>
                    {artist.featured && (
                      <Star
                        size={14}
                        fill="currentColor"
                        className="admin-table__star"
                        aria-label="Featured"
                      />
                    )}
                    {artist.name}
                  </td>
                  <td>{formatDate(artist.createdAt)}</td>
                  <td>{formatDate(artist.updatedAt)}</td>
                  <td className="admin-table__actions">
                    <Link to={`/admin/artists/${artist.id}/edit`}>Edit</Link>
                    <button type="button" className="admin-table__delete" onClick={() => handleDelete(artist.id, artist.name)}>
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

export default ArtistsList;

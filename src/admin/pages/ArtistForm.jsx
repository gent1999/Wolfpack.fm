import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api.js';

const EMPTY_FORM = {
  name: '',
  featured: false,
  bio: '',
  imageUrl: '',
  spotifyUrl: '',
  soundcloudUrl: '',
  youtubeUrl: '',
  geniusUrl: '',
  appleMusicUrl: '',
};

function ArtistForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEditing) return;

    api
      .getArtist(id)
      .then((data) => {
        const { name, featured, bio, imageUrl, spotifyUrl, soundcloudUrl, youtubeUrl, geniusUrl, appleMusicUrl } = data.artist;
        setForm({
          name,
          featured: Boolean(featured),
          bio: bio || '',
          imageUrl: imageUrl || '',
          spotifyUrl: spotifyUrl || '',
          soundcloudUrl: soundcloudUrl || '',
          youtubeUrl: youtubeUrl || '',
          geniusUrl: geniusUrl || '',
          appleMusicUrl: appleMusicUrl || '',
        });
      })
      .catch(() => setError('Could not load this artist.'))
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      if (isEditing) {
        await api.updateArtist(id, form);
      } else {
        await api.createArtist(form);
      }
      navigate('/admin/artists');
    } catch (err) {
      setError(err.message || 'Could not save this artist.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${form.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await api.deleteArtist(id);
      navigate('/admin/artists');
    } catch (err) {
      setError(err.message || 'Could not delete this artist.');
      setDeleting(false);
    }
  }

  if (loading) {
    return <div className="admin-empty">Loading&hellip;</div>;
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1>{isEditing ? 'Edit Artist' : 'New Artist'}</h1>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-field">
          <label htmlFor="name">Name</label>
          <input
            id="name"
            type="text"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            required
          />
        </div>

        <div className="admin-field admin-field--checkbox">
          <label htmlFor="featured">
            <input
              id="featured"
              type="checkbox"
              checked={form.featured}
              onChange={(e) => updateField('featured', e.target.checked)}
            />
            Featured (shows first on the homepage and artists page)
          </label>
        </div>

        <div className="admin-field">
          <label htmlFor="bio">Bio (optional)</label>
          <textarea
            id="bio"
            rows={5}
            value={form.bio}
            onChange={(e) => updateField('bio', e.target.value)}
            placeholder="Short bio shown on the artist's page…"
          />
        </div>

        <div className="admin-field">
          <label htmlFor="imageUrl">Image URL (optional)</label>
          <input
            id="imageUrl"
            type="url"
            value={form.imageUrl}
            onChange={(e) => updateField('imageUrl', e.target.value)}
            placeholder="https://example.com/photo.jpg"
          />
        </div>

        <div className="admin-field">
          <label htmlFor="spotifyUrl">Spotify Link (optional)</label>
          <input
            id="spotifyUrl"
            type="url"
            value={form.spotifyUrl}
            onChange={(e) => updateField('spotifyUrl', e.target.value)}
            placeholder="https://open.spotify.com/artist/..."
          />
        </div>

        <div className="admin-field">
          <label htmlFor="soundcloudUrl">SoundCloud Link (optional)</label>
          <input
            id="soundcloudUrl"
            type="url"
            value={form.soundcloudUrl}
            onChange={(e) => updateField('soundcloudUrl', e.target.value)}
            placeholder="https://soundcloud.com/..."
          />
        </div>

        <div className="admin-field">
          <label htmlFor="youtubeUrl">YouTube Link (optional)</label>
          <input
            id="youtubeUrl"
            type="url"
            value={form.youtubeUrl}
            onChange={(e) => updateField('youtubeUrl', e.target.value)}
            placeholder="https://www.youtube.com/@..."
          />
        </div>

        <div className="admin-field">
          <label htmlFor="geniusUrl">Genius Link (optional)</label>
          <input
            id="geniusUrl"
            type="url"
            value={form.geniusUrl}
            onChange={(e) => updateField('geniusUrl', e.target.value)}
            placeholder="https://genius.com/artists/..."
          />
        </div>

        <div className="admin-field">
          <label htmlFor="appleMusicUrl">Apple Music Link (optional)</label>
          <input
            id="appleMusicUrl"
            type="url"
            value={form.appleMusicUrl}
            onChange={(e) => updateField('appleMusicUrl', e.target.value)}
            placeholder="https://music.apple.com/..."
          />
        </div>

        <div className="admin-form__actions">
          <button type="submit" className="admin-button admin-button--primary" style={{ width: 'auto' }} disabled={saving}>
            {saving ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Artist'}
          </button>
          <button type="button" className="admin-button admin-button--secondary" onClick={() => navigate('/admin/artists')}>
            Cancel
          </button>
          {isEditing && (
            <button
              type="button"
              className="admin-button admin-button--danger"
              onClick={handleDelete}
              disabled={deleting}
              style={{ marginLeft: 'auto' }}
            >
              {deleting ? 'Deleting…' : 'Delete Artist'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ArtistForm;

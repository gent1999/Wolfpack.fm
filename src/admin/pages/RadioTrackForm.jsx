import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api.js';

const EMPTY_FORM = {
  title: '',
  artist: '',
  spotifyTrackId: '',
  featured: false,
  blurb: '',
  position: '',
};

function RadioTrackForm() {
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
      .getRadioTrack(id)
      .then((data) => {
        const { title, artist, spotifyTrackId, featured, blurb, position } = data.track;
        setForm({
          title,
          artist,
          spotifyTrackId: spotifyTrackId || '',
          featured: Boolean(featured),
          blurb: blurb || '',
          position: String(position),
        });
      })
      .catch(() => setError('Could not load this track.'))
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  function updateField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSaving(true);

    const payload = { ...form, position: form.position === '' ? undefined : Number(form.position) };

    try {
      if (isEditing) {
        await api.updateRadioTrack(id, payload);
      } else {
        await api.createRadioTrack(payload);
      }
      navigate('/admin/radio-tracks');
    } catch (err) {
      setError(err.message || 'Could not save this track.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${form.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await api.deleteRadioTrack(id);
      navigate('/admin/radio-tracks');
    } catch (err) {
      setError(err.message || 'Could not delete this track.');
      setDeleting(false);
    }
  }

  if (loading) {
    return <div className="admin-empty">Loading&hellip;</div>;
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1>{isEditing ? 'Edit Radio Track' : 'New Radio Track'}</h1>
      </div>

      {error && <div className="admin-error">{error}</div>}

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-field">
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={form.title}
            onChange={(e) => updateField('title', e.target.value)}
            required
          />
        </div>

        <div className="admin-field">
          <label htmlFor="artist">Artist</label>
          <input
            id="artist"
            type="text"
            value={form.artist}
            onChange={(e) => updateField('artist', e.target.value)}
            required
          />
        </div>

        <div className="admin-field">
          <label htmlFor="spotifyTrackId">Spotify Track ID (optional)</label>
          <input
            id="spotifyTrackId"
            type="text"
            value={form.spotifyTrackId}
            onChange={(e) => updateField('spotifyTrackId', e.target.value)}
            placeholder="e.g. 4uLU6hMCjMI75M1A2tKUQC"
          />
          <p className="admin-field__hint">
            On Spotify: &ldquo;&hellip;&rdquo; menu &rarr; Share &rarr; Copy Song Link. The ID is the part of the URL
            between /track/ and the ?.
          </p>
        </div>

        <div className="admin-field admin-field--checkbox">
          <label htmlFor="featured">
            <input
              id="featured"
              type="checkbox"
              checked={form.featured}
              onChange={(e) => updateField('featured', e.target.checked)}
            />
            Featured (shows in the &ldquo;Featured This Week&rdquo; card on the Radio page)
          </label>
        </div>

        <div className="admin-field">
          <label htmlFor="blurb">Featured Write-Up (optional)</label>
          <textarea
            id="blurb"
            rows={4}
            value={form.blurb}
            onChange={(e) => updateField('blurb', e.target.value)}
            placeholder="Short editorial blurb shown only when this track is featured…"
          />
        </div>

        <div className="admin-field">
          <label htmlFor="position">Position</label>
          <input
            id="position"
            type="number"
            value={form.position}
            onChange={(e) => updateField('position', e.target.value)}
            placeholder="Lower numbers show first in Now In Rotation"
          />
        </div>

        <div className="admin-form__actions">
          <button type="submit" className="admin-button admin-button--primary" style={{ width: 'auto' }} disabled={saving}>
            {saving ? 'Saving…' : isEditing ? 'Save Changes' : 'Create Track'}
          </button>
          <button type="button" className="admin-button admin-button--secondary" onClick={() => navigate('/admin/radio-tracks')}>
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
              {deleting ? 'Deleting…' : 'Delete Track'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default RadioTrackForm;

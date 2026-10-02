import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api.js';

const EMPTY_FORM = {
  title: '',
  tag: '',
  content: '',
  authorName: 'Wolfpack.fm',
  spotifyUrl: '',
  soundcloudUrl: '',
  youtubeUrl: '',
};

function ArticleForm() {
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
      .getArticle(id)
      .then((data) => {
        const { title, tag, content, authorName, spotifyUrl, soundcloudUrl, youtubeUrl } = data.article;
        setForm({
          title,
          tag,
          content,
          authorName,
          spotifyUrl: spotifyUrl || '',
          soundcloudUrl: soundcloudUrl || '',
          youtubeUrl: youtubeUrl || '',
        });
      })
      .catch(() => setError('Could not load this article.'))
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
        await api.updateArticle(id, form);
      } else {
        await api.createArticle(form);
      }
      navigate('/admin/articles');
    } catch (err) {
      setError(err.message || 'Could not save this article.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete "${form.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await api.deleteArticle(id);
      navigate('/admin/articles');
    } catch (err) {
      setError(err.message || 'Could not delete this article.');
      setDeleting(false);
    }
  }

  if (loading) {
    return <div className="admin-empty">Loading&hellip;</div>;
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1>{isEditing ? 'Edit Article' : 'New Article'}</h1>
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
          <label htmlFor="tag">Tag</label>
          <input
            id="tag"
            type="text"
            value={form.tag}
            onChange={(e) => updateField('tag', e.target.value)}
            placeholder="e.g. Interviews, News, Reviews"
            required
          />
        </div>

        <div className="admin-field">
          <label htmlFor="content">Content (Markdown supported)</label>
          <textarea
            id="content"
            className="admin-field__markdown"
            value={form.content}
            onChange={(e) => updateField('content', e.target.value)}
            required
          />
        </div>

        <div className="admin-field">
          <label htmlFor="spotifyUrl">Spotify Link (optional)</label>
          <input
            id="spotifyUrl"
            type="url"
            value={form.spotifyUrl}
            onChange={(e) => updateField('spotifyUrl', e.target.value)}
            placeholder="https://open.spotify.com/track/..."
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
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>

        <div className="admin-field">
          <label htmlFor="authorName">Author Name</label>
          <input
            id="authorName"
            type="text"
            value={form.authorName}
            onChange={(e) => updateField('authorName', e.target.value)}
          />
        </div>

        <div className="admin-form__actions">
          <button type="submit" className="admin-button admin-button--primary" style={{ width: 'auto' }} disabled={saving}>
            {saving ? 'Publishing…' : isEditing ? 'Save Changes' : 'Publish'}
          </button>
          <button type="button" className="admin-button admin-button--secondary" onClick={() => navigate('/admin/articles')}>
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
              {deleting ? 'Deleting…' : 'Delete Article'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ArticleForm;

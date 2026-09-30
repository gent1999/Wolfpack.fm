import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function ArticlesList() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  function load() {
    setLoading(true);
    api
      .listArticles()
      .then((data) => setArticles(data.articles))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id, title) {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    await api.deleteArticle(id);
    load();
  }

  return (
    <div>
      <div className="admin-page-header">
        <h1>Articles</h1>
        <Link to="/admin/articles/new" className="admin-button admin-button--primary" style={{ width: 'auto' }}>
          + New Article
        </Link>
      </div>

      <div className="admin-table-wrap">
        {loading ? (
          <div className="admin-empty">Loading&hellip;</div>
        ) : articles.length === 0 ? (
          <div className="admin-empty">No articles yet.</div>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Tag</th>
                <th>Created</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {articles.map((article) => (
                <tr key={article.id}>
                  <td>{article.title}</td>
                  <td>
                    <span className="admin-badge">{article.tag}</span>
                  </td>
                  <td>{formatDate(article.createdAt)}</td>
                  <td>{formatDate(article.updatedAt)}</td>
                  <td className="admin-table__actions">
                    <Link to={`/admin/articles/${article.id}/edit`}>Edit</Link>
                    <button type="button" className="admin-table__delete" onClick={() => handleDelete(article.id, article.title)}>
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

export default ArticlesList;

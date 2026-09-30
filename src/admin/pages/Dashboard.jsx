import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api.js';

function Dashboard() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .listArticles()
      .then((data) => setArticles(data.articles))
      .finally(() => setLoading(false));
  }, []);

  const total = articles.length;
  const tagCount = new Set(articles.map((a) => a.tag)).size;

  return (
    <div>
      <div className="admin-page-header">
        <h1>Dashboard</h1>
        <Link to="/admin/articles/new" className="admin-button admin-button--primary" style={{ width: 'auto' }}>
          + New Article
        </Link>
      </div>

      <div className="admin-stats">
        <div className="admin-stat">
          <div className="admin-stat__value">{loading ? '—' : total}</div>
          <div className="admin-stat__label">Total Articles</div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat__value">{loading ? '—' : tagCount}</div>
          <div className="admin-stat__label">Tags</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

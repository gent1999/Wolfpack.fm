import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import placeholderArt from '../assets/wolf_pic3.jpg';
import '../components/home/ArticlesSection.css';
import './Stories.css';

const API_URL = import.meta.env.VITE_API_URL;

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function Stories() {
  const [articles, setArticles] = useState([]);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    fetch(`${API_URL}/api/articles`)
      .then((res) => res.json())
      .then((data) => {
        setArticles(data.articles || []);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, []);

  return (
    <main className="page-main">
      <section className="stories-page">
        <div className="site-container">
          <h1 className="stories-page__heading">Stories</h1>
          <p className="stories-page__subhead">Interviews, features, and write-ups from the underground.</p>

          {status === 'loading' && <div className="stories-page__empty">Loading&hellip;</div>}
          {status === 'error' && <div className="stories-page__empty">Could not load stories.</div>}
          {status === 'ready' && articles.length === 0 && (
            <div className="stories-page__empty">No stories published yet.</div>
          )}

          {status === 'ready' && articles.length > 0 && (
            <div className="articles-section__grid stories-page__grid">
              {articles.map((article) => (
                <Link key={article.id} to={`/stories/${article.slug}`} className="article-card">
                  <div className="article-card__image-wrap">
                    <img src={article.imageUrl || placeholderArt} alt="" className="article-card__image" />
                  </div>
                  <span className="article-card__tag">{article.tag}</span>
                  <h3 className="article-card__title">{article.title}</h3>
                  <p className="article-card__meta">
                    {article.authorName}&nbsp;&nbsp;•&nbsp;&nbsp;{formatDate(article.publishedAt || article.createdAt)}
                  </p>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Stories;

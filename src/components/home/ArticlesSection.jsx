import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import placeholderArt from '../../assets/wolf_pic3.jpg';
import './ArticlesSection.css';

const API_URL = import.meta.env.VITE_API_URL;
const PREVIEW_COUNT = 3;

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function ArticlesSection() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/articles`)
      .then((res) => res.json())
      .then((data) => setArticles(data.articles || []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading || articles.length === 0) return null;

  return (
    <section className="articles-section" aria-label="Latest Stories">
      <div className="site-container">
        <div className="articles-section__header">
          <h2 className="articles-section__heading">Latest Stories</h2>
          <Link to="/stories" className="articles-section__view-all">
            View All &rarr;
          </Link>
        </div>

        <div className="articles-section__grid">
          {articles.slice(0, PREVIEW_COUNT).map((article) => (
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
      </div>
    </section>
  );
}

export default ArticlesSection;

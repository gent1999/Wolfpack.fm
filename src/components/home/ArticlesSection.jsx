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

  const [lead, ...rest] = articles.slice(0, PREVIEW_COUNT);

  return (
    <section className="articles-section" aria-label="Latest Stories">
      <div className="site-container">
        <div className="articles-section__header">
          <div>
            <span className="section-eyebrow">From The Underground</span>
            <h2 className="articles-section__heading">Latest Stories</h2>
          </div>
          <Link to="/stories" className="articles-section__view-all">
            View All &rarr;
          </Link>
        </div>

        <div className={`articles-section__layout${rest.length === 0 ? ' articles-section__layout--single' : ''}`}>
          <Link to={`/stories/${lead.slug}`} className="article-feature">
            <div className="article-feature__image-wrap">
              <img src={lead.imageUrl || placeholderArt} alt="" className="article-feature__image" />
            </div>
            <div className="article-feature__body">
              <span className="article-feature__tag">{lead.tag}</span>
              <h3 className="article-feature__title">{lead.title}</h3>
              <p className="article-feature__meta">
                {lead.authorName}&nbsp;&nbsp;•&nbsp;&nbsp;{formatDate(lead.publishedAt || lead.createdAt)}
              </p>
            </div>
          </Link>

          {rest.length > 0 && (
            <div className="article-list">
              {rest.map((article) => (
                <Link key={article.id} to={`/stories/${article.slug}`} className="article-row">
                  <div className="article-row__image-wrap">
                    <img src={article.imageUrl || placeholderArt} alt="" className="article-row__image" />
                  </div>
                  <div className="article-row__body">
                    <span className="article-row__tag">{article.tag}</span>
                    <h3 className="article-row__title">{article.title}</h3>
                    <p className="article-row__meta">
                      {article.authorName}&nbsp;&nbsp;•&nbsp;&nbsp;{formatDate(article.publishedAt || article.createdAt)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ArticlesSection;

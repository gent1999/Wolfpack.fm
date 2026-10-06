import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import placeholderArt from '../../assets/wolf_pic3.jpg';
import './ArticlesSection.css';

const API_URL = import.meta.env.VITE_API_URL;
const PREVIEW_COUNT = 3;
const EXCERPT_LENGTH = 110;

function formatDate(iso) {
  return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function stripMarkdown(markdown) {
  return markdown
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/[#*_`>~]/g, '')
    .replace(/\n+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Derived from the article's own Markdown content -- there is no separate
// excerpt field in the schema, so this is the only source for preview text.
function makeExcerpt(content) {
  const text = stripMarkdown(content || '');
  if (!text) return '';
  if (text.length <= EXCERPT_LENGTH) return text;
  const truncated = text.slice(0, EXCERPT_LENGTH);
  const cut = truncated.lastIndexOf(' ');
  return `${truncated.slice(0, cut > 60 ? cut : EXCERPT_LENGTH)}…`;
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
          <div>
            <span className="articles-section__eyebrow">Editorial</span>
            <h2 className="articles-section__heading">Latest Stories</h2>
          </div>
          <Link to="/stories" className="articles-section__view-all">
            View All &rarr;
          </Link>
        </div>

        <div className="articles-section__grid">
          {articles.slice(0, PREVIEW_COUNT).map((article) => {
            const excerpt = makeExcerpt(article.content);

            return (
              <Link key={article.id} to={`/stories/${article.slug}`} className="story-card">
                <div className="story-card__image-wrap">
                  <img src={article.imageUrl || placeholderArt} alt="" className="story-card__image" />
                  <div className="story-card__image-fade" aria-hidden="true" />
                </div>

                <div className="story-card__body">
                  <span className="story-card__tag">{article.tag}</span>
                  <h3 className="story-card__title">{article.title}</h3>
                  {excerpt && <p className="story-card__excerpt">{excerpt}</p>}

                  <div className="story-card__footer">
                    <p className="story-card__meta">
                      <span className="story-card__avatar" aria-hidden="true">
                        {(article.authorName || 'W').charAt(0).toUpperCase()}
                      </span>
                      <span className="story-card__meta-text">
                        {article.authorName}&nbsp;&bull;&nbsp;{formatDate(article.publishedAt || article.createdAt)}
                      </span>
                    </p>
                    <span className="story-card__arrow" aria-hidden="true">
                      <ArrowRight size={14} strokeWidth={2} />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default ArticlesSection;

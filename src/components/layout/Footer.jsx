import { NavLink } from 'react-router-dom';
import './Footer.css';

const FOOTER_LINKS = [
  { label: 'Radio', to: '/radio' },
  { label: 'Artists', to: '/artists' },
  { label: 'Stories', to: '/stories' },
  { label: 'Submit', to: '/submit' },
];

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-container site-footer__top">
        <div className="site-footer__brand">
          <NavLink to="/" className="site-footer__logo" aria-label="Wolfpack.fm home">
            <img src="/wolf_favicon.png" alt="" className="site-footer__logo-icon" />
            WOLFPACK.FM
          </NavLink>
          <p className="site-footer__tagline">Underground rap, lyricism, and new voices.</p>
        </div>

        <nav className="site-footer__links" aria-label="Footer">
          {FOOTER_LINKS.map(({ label, to }) => (
            <NavLink key={to} to={to} className="site-footer__link">
              {label}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="site-container site-footer__bottom">
        <p className="site-footer__copyright">&copy; {year} Wolfpack.fm. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;

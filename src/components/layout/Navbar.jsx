import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Search } from 'lucide-react';
import MobileNav from './MobileNav.jsx';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Radio', to: '/radio' },
  { label: 'Artists', to: '/artists' },
  { label: 'Stories', to: '/stories' },
  { label: 'Submit', to: '/submit' },
];

function Navbar() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  return (
    <header className="navbar">
      <div className="site-container navbar__inner">
        <NavLink to="/" className="navbar__logo" aria-label="Wolfpack.fm home">
          <img src="/wolf_favicon.png" alt="" className="navbar__logo-icon" />
          WOLFPACK.FM
        </NavLink>

        <nav className="navbar__nav" aria-label="Primary">
          <ul className="navbar__links">
            {NAV_LINKS.map(({ label, to }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  className={({ isActive }) =>
                    isActive ? 'navbar__link navbar__link--active' : 'navbar__link'
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          <span className="navbar__divider" aria-hidden="true" />

          <button type="button" className="navbar__icon-button" aria-label="Search">
            <Search size={18} strokeWidth={1.75} />
          </button>
        </nav>

        <button
          type="button"
          className="navbar__icon-button navbar__menu-button"
          aria-label="Open menu"
          aria-haspopup="true"
          aria-expanded={isMobileNavOpen}
          aria-controls="mobile-nav"
          onClick={() => setIsMobileNavOpen(true)}
        >
          <Menu size={22} strokeWidth={1.75} />
        </button>
      </div>

      <MobileNav
        id="mobile-nav"
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
        links={NAV_LINKS}
      />
    </header>
  );
}

export default Navbar;

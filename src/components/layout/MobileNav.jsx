import { useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import './MobileNav.css';

function MobileNav({ id, isOpen, onClose, links }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      id={id}
      className="mobile-nav"
      role="dialog"
      aria-modal="true"
      aria-label="Mobile navigation"
    >
      <div className="mobile-nav__header">
        <button
          type="button"
          ref={closeButtonRef}
          className="mobile-nav__close"
          aria-label="Close menu"
          onClick={onClose}
        >
          <X size={24} strokeWidth={1.75} />
        </button>
      </div>

      <ul className="mobile-nav__links">
        {links.map(({ label, to }) => (
          <li key={to} className="mobile-nav__item">
            <NavLink
              to={to}
              className={({ isActive }) =>
                isActive ? 'mobile-nav__link mobile-nav__link--active' : 'mobile-nav__link'
              }
              onClick={onClose}
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MobileNav;

import { useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 bg-white border-b border-mb-border shadow-sm">
      <div className="px-4 sm:px-6 lg:px-20 flex items-center justify-between h-14">
        {/* Brand */}
        <span className="text-mb-brand font-bold text-lg tracking-wide">
          WR Advisory
        </span>

        {/* Nav links — desktop */}
        <nav className="hidden sm:flex items-center gap-6">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `text-sm font-semibold transition-colors ${
                isActive ? 'text-mb-brand border-b-2 border-mb-brand pb-0.5' : 'text-mb-text-dark hover:text-mb-brand'
              }`
            }
          >
            Bills
          </NavLink>
          <NavLink
            to="/keywords"
            className={({ isActive }) =>
              `text-sm font-semibold transition-colors ${
                isActive ? 'text-mb-brand border-b-2 border-mb-brand pb-0.5' : 'text-mb-text-dark hover:text-mb-brand'
              }`
            }
          >
            Keywords
          </NavLink>
        </nav>

        {/* Mobile: Legislative Tracker label + hamburger */}
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline text-mb-text-light text-sm font-medium tracking-wider uppercase">
            Legislative Tracker
          </span>

          {/* Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="sm:hidden bg-mb-bg-medium rounded-lg p-2.5 text-mb-text-dark hover:bg-mb-blue-20 transition-colors"
            aria-label="Toggle menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-mb-border bg-white px-4 py-3 flex flex-col gap-3">
          <NavLink
            to="/"
            end
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `text-sm font-semibold py-2 ${isActive ? 'text-mb-brand' : 'text-mb-text-dark'}`
            }
          >
            Bills
          </NavLink>
          <NavLink
            to="/keywords"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `text-sm font-semibold py-2 ${isActive ? 'text-mb-brand' : 'text-mb-text-dark'}`
            }
          >
            Keywords
          </NavLink>
        </div>
      )}
    </div>
  );
}

'use client';

// NavBar: a context-aware fixed header that stays transparent over hero content
// and softly materializes a frosted cream pane once the user scrolls past the
// fold. Numbered links nod to editorial print layouts; mobile collapses into a
// minimal hamburger panel for thumb-friendly navigation.

import { useEffect, useState } from 'react';

type NavLink = {
  href: string;
  label: string;
  index: string;
};

const links: NavLink[] = [
  { href: '#work', label: 'Field Manual', index: '01.' },
  { href: '#casefiles', label: 'Work', index: '02.' },
  { href: '#experience', label: 'Experience', index: '03.' },
  { href: '#built', label: 'Built & Led', index: '04.' },
];

const socials = [
  { label: '{github}', href: 'https://github.com/thakursanju' },
  { label: '{linkedin}', href: 'https://www.linkedin.com/in/khushvinder-thakur-404a70323/' },
  { label: '{codeforces}', href: 'https://codeforces.com/profile/thakursanju' },
  { label: '{leetcode}', href: 'https://leetcode.com/u/thakursanju/' },
  { label: '{email}', href: 'mailto:khushvinder057@gmail.com' },
  { label: '{resume}', href: '/Khushvinder-Thakur-Resume.pdf' },
];

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const closeMenu = () => setOpen(false);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-cream-100/80 backdrop-blur border-b border-ink-900/10'
          : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex flex-col gap-1.5">
          <a
            href="#"
            className="font-script text-2xl text-ink-900 leading-none"
            aria-label="Khushvinder Thakur home"
          >
            Khushvinder Thakur
          </a>
          <div className="hidden sm:flex items-center gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-[10px] text-ink-900/60 hover:text-accent-coral transition-colors"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <ul className="hidden sm:flex items-center gap-8">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="font-mono text-sm uppercase tracking-wider text-ink-900 hover:text-accent-coral transition-colors"
              >
                <span className="mr-1 text-ink-900/40">{link.index}</span>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Toggle navigation menu"
          className="sm:hidden flex flex-col items-end gap-1.5 p-2"
        >
          <span
            className={`block h-0.5 w-6 bg-ink-900 transition-transform duration-200 ${
              open ? 'translate-y-2 rotate-45' : ''
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-ink-900 transition-opacity duration-200 ${
              open ? 'opacity-0' : 'opacity-100'
            }`}
          />
          <span
            className={`block h-0.5 w-6 bg-ink-900 transition-transform duration-200 ${
              open ? '-translate-y-2 -rotate-45' : ''
            }`}
          />
        </button>
      </nav>

      {open && (
        <div
          id="mobile-menu"
          className="sm:hidden bg-cream-100/95 backdrop-blur border-t border-ink-900/10"
        >
          <ul className="flex flex-col px-6 py-4">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={closeMenu}
                  className="flex items-center gap-2 py-3 font-mono text-sm uppercase tracking-wider text-ink-900 hover:text-accent-coral transition-colors"
                >
                  <span className="text-ink-900/40">{link.index}</span>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-x-4 gap-y-2 px-6 pb-4">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={closeMenu}
                className="font-mono text-xs text-ink-900/60 hover:text-accent-coral transition-colors"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
// Footer: a quiet sign-off using literal `{token}` syntax that hints at template
// placeholders, reinforcing the engineer-zine vibe of the rest of the site. A
// dotted divider above and a handwritten thank-you below soften the closing
// without competing with the page's content.

const socials = [
  { label: '{github}', href: 'https://github.com/thakursanju' },
  { label: '{linkedin}', href: 'https://www.linkedin.com/in/khushvinder-thakur-404a70323/' },
  { label: '{codeforces}', href: 'https://codeforces.com/profile/thakursanju' },
  { label: '{leetcode}', href: 'https://leetcode.com/u/thakursanju/' },
  { label: '{email}', href: 'mailto:khushvinder057@gmail.com' },
  { label: '{resume}', href: '/Khushvinder-Thakur-Resume.pdf' },
];

export default function Footer() {
  return (
    <footer className="py-16 text-center">
      <div
        aria-hidden="true"
        className="mx-auto mb-12 h-px max-w-3xl border-t border-dotted border-ink-900/20"
      />

      <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
        {socials.map((s) => (
          <li key={s.label}>
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-ink-900 hover:text-accent-coral transition-colors"
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-10 font-script text-2xl text-ink-900">
        thanks for scrolling
      </p>
    </footer>
  );
}

import Link from "next/link";

const footerLinks = [
  {
    heading: "Platform",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Services", href: "#services" },
      { label: "Browse clinicians", href: "#clinicians" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About AfyaNow", href: "#" },
      { label: "Contact us", href: "#" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Terms of service", href: "#" },
      { label: "Privacy policy", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-indigo-100 bg-indigo-50/40">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="#top" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 text-sm font-bold text-white">
                A
              </span>
              <span className="text-lg font-semibold text-slate-900">
                Afya<span className="text-indigo-600">Now</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-600">
              Helping people across Kenya find the right verified clinician
              for their concern, quickly and clearly.
            </p>
          </div>

          {footerLinks.map((column) => (
            <div key={column.heading}>
              <h3 className="text-sm font-semibold text-slate-900">
                {column.heading}
              </h3>
              <ul className="mt-4 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-600 hover:text-indigo-700"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-indigo-100 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; 2026 AfyaNow. All rights reserved.</p>
          <p>Fictional demonstration platform — not a real medical service.</p>
        </div>
      </div>
    </footer>
  );
}

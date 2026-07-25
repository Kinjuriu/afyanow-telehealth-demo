"use client";

import { useState } from "react";
import Link from "next/link";
import Button from "./Button";
import { IconMenu, IconClose } from "./icons";

const navLinks = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Services", href: "#services" },
  { label: "Browse clinicians", href: "/patient/clinicians" },
];

function isHashLink(href: string) {
  return href.startsWith("#");
}

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-indigo-100/70 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="#top" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 text-sm font-bold text-white shadow-sm shadow-indigo-200">
            A
          </span>
          <span className="text-lg font-semibold text-slate-900">
            Afya<span className="text-indigo-600">Now</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) =>
            isHashLink(link.href) ? (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-indigo-700"
              >
                {link.label}
              </a>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 hover:text-indigo-700"
              >
                {link.label}
              </Link>
            )
          )}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/patient/intake"
            className="text-sm font-medium text-slate-600 hover:text-indigo-700"
          >
            Patient demo
          </Link>
          <Button href="/clinician" variant="secondary" className="px-5 py-2.5">
            Clinician login
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-slate-600 hover:bg-indigo-50 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-indigo-100 bg-white px-4 pb-6 pt-2 md:hidden">
          <nav className="flex flex-col gap-1">
            {navLinks.map((link) =>
              isHashLink(link.href) ? (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  {link.label}
                </Link>
              )
            )}
            <Link
              href="/patient/intake"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-700"
            >
              Patient demo
            </Link>
            <Link
              href="/clinician"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-full bg-indigo-600 px-3 py-2.5 text-center text-sm font-semibold text-white"
            >
              Clinician login
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

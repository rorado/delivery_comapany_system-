"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { BoxIconLine, CloseLineIcon, ListIcon } from "@/icons";

export default function LandingHeader() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    if (!mobileNavOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileNavOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileNavOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:border-gray-800 dark:bg-gray-900/70">
      <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BoxIconLine className="w-8 h-8 text-brand-500" />
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              FastDeliver
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#features"
              className="relative text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-brand-500 after:transition-transform hover:after:scale-x-100"
            >
              Fonctionnalités
            </a>
            <a
              href="#about"
              className="relative text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-brand-500 after:transition-transform hover:after:scale-x-100"
            >
              À propos
            </a>
            <a
              href="#contact"
              className="relative text-gray-600 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:bg-brand-500 after:transition-transform hover:after:scale-x-100"
            >
              Contact
            </a>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/connexion"
              className="px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
            >
              Se connecter
            </Link>
            <Link
              href="/connexion"
              className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg transition-colors hover:bg-brand-600"
            >
              Commencer
            </Link>
          </div>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white p-2 text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
            aria-label={mobileNavOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={mobileNavOpen}
            onClick={() => setMobileNavOpen((open) => !open)}
          >
            <span
              className={
                "transition-transform duration-200 " +
                (mobileNavOpen ? "rotate-90" : "rotate-0")
              }
            >
              {mobileNavOpen ? (
                <CloseLineIcon className="h-5 w-5" />
              ) : (
                <ListIcon className="h-6 w-6" />
              )}
            </span>
          </button>
        </div>

        <div
          className={
            "md:hidden overflow-hidden transition-[max-height,opacity,transform] duration-200 ease-out " +
            (mobileNavOpen
              ? "max-h-96 opacity-100 translate-y-0 pt-4"
              : "max-h-0 opacity-0 -translate-y-2 pointer-events-none")
          }
          aria-hidden={!mobileNavOpen}
        >
          <div className="rounded-2xl border border-gray-200 bg-white p-3 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex flex-col">
              <a
                href="#features"
                onClick={() => setMobileNavOpen(false)}
                className="rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                Fonctionnalités
              </a>
              <a
                href="#about"
                onClick={() => setMobileNavOpen(false)}
                className="rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                À propos
              </a>
              <a
                href="#contact"
                onClick={() => setMobileNavOpen(false)}
                className="rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
              >
                Contact
              </a>
            </div>

            <div className="mt-3 grid grid-cols-2 gap-2">
              <Link
                href="/connexion"
                onClick={() => setMobileNavOpen(false)}
                className="inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Se connecter
              </Link>
              <Link
                href="/connexion"
                onClick={() => setMobileNavOpen(false)}
                className="inline-flex items-center justify-center rounded-xl bg-brand-500 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-600"
              >
                Commencer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

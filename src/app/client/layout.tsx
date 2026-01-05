"use client";

import { useSidebar } from "@/context/SidebarContext";
import AppHeader from "@/layout/AppHeader";
import Backdrop from "@/layout/Backdrop";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BoxIconLine,
  ChevronDownIcon,
  PaperPlaneIcon,
  UserCircleIcon,
} from "@/icons";
import { usePathname } from "next/navigation";

type ClientNavItem = {
  name: string;
  path?: string;
  icon: React.ReactNode;
  children?: { name: string; path: string }[];
};

const clientNavItems: ClientNavItem[] = [
  {
    name: "Tableau de bord",
    path: "/client",
    icon: <BoxIconLine className="w-5 h-5" />,
  },
  {
    name: "Colis",
    icon: <PaperPlaneIcon className="w-5 h-5" />,
    children: [
      { name: "Liste des colis", path: "/client/colis/liste" },
      { name: "Ajouter un colis", path: "/client/colis/nouveau" },
      { name: "Colis pour ramassage", path: "/client/colis/ramassage" },
    ],
  },
  {
    name: "Suivre un colis",
    path: "/client/suivi",
    icon: <BoxIconLine className="w-5 h-5" />,
  },
  {
    name: "Profil",
    path: "/client/profil",
    icon: <UserCircleIcon className="w-5 h-5" />,
  },
];

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isMobileOpen, isExpanded } = useSidebar();
  const pathname = usePathname();
  const isOnColisRoute = useMemo(
    () => pathname.startsWith("/client/colis"),
    [pathname]
  );
  const [isColisOpen, setIsColisOpen] = useState(false);

  useEffect(() => {
    if (isOnColisRoute) setIsColisOpen(true);
  }, [isOnColisRoute]);

  return (
    <div className="min-h-screen">
      {/* Simple Sidebar for Client */}
      <aside
        className={`fixed mt-16 flex flex-col lg:mt-0 top-0 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 ${
          isExpanded ? "w-[250px] px-5" : "w-[90px] px-3"
        } ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div
          className={`py-8 flex ${
            !isExpanded ? "lg:justify-center" : "justify-start"
          }`}
        >
          <Link href="/client" className="flex items-center gap-2">
            <BoxIconLine className="w-6 h-6 text-brand-500 shrink-0" />
            {(isExpanded || isMobileOpen) && (
              <span className="text-lg font-bold text-gray-900 dark:text-white whitespace-nowrap">
                Portail client
              </span>
            )}
          </Link>
        </div>
        <nav className="flex-1">
          <ul className="space-y-2">
            {clientNavItems.map((item) => (
              <li key={item.name}>
                {item.children ? (
                  <div>
                    <button
                      type="button"
                      onClick={() => setIsColisOpen((v) => !v)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                        isOnColisRoute
                          ? "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      }`}
                    >
                      {item.icon}
                      {(isExpanded || isMobileOpen) && (
                        <>
                          <span className="flex-1 text-left">{item.name}</span>
                          <ChevronDownIcon
                            className={`w-4 h-4 transition-transform ${
                              isColisOpen ? "rotate-180" : "rotate-0"
                            }`}
                          />
                        </>
                      )}
                    </button>
                    {(isExpanded || isMobileOpen) && isColisOpen && (
                      <ul className="mt-1 space-y-1">
                        {item.children.map((child) => (
                          <li key={child.path}>
                            <Link
                              href={child.path}
                              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition ml-6 ${
                                pathname === child.path
                                  ? "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                              }`}
                            >
                              <span className="text-sm">{child.name}</span>
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  item.path && (
                    <Link
                      href={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                        pathname === item.path
                          ? "bg-brand-50 text-brand-600 dark:bg-brand-500/10 dark:text-brand-400"
                          : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                      }`}
                    >
                      {item.icon}
                      {(isExpanded || isMobileOpen) && <span>{item.name}</span>}
                    </Link>
                  )
                )}
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <Backdrop />
      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          isExpanded ? "lg:ml-[250px]" : "lg:ml-[90px]"
        }`}
      >
        <AppHeader />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

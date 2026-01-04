import Link from "next/link";
import Image from "next/image";
import {
  ArrowRightIcon,
  BoxIconLine,
  CheckCircleIcon,
  PaperPlaneIcon,
} from "@/icons";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="absolute -bottom-40 right-[-120px] h-[520px] w-[520px] rounded-full bg-brand-500/10 blur-3xl" />
        <div
          className="absolute inset-0 opacity-60 dark:opacity-40"
          style={{
            backgroundImage: "url(/images/shape/grid-01.svg)",
            backgroundRepeat: "repeat",
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white/70 px-4 py-2 text-sm text-gray-700 backdrop-blur dark:border-gray-800 dark:bg-gray-900/60 dark:text-gray-300">
              <span className="inline-flex h-2 w-2 rounded-full bg-brand-500" />
              Suivi temps réel • Chauffeurs • Rapports
            </div>

            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
              Système de gestion de
              <span className="text-brand-500"> livraison</span> rapide et
              fiable
            </h1>

            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 sm:text-xl">
              Simplifiez vos opérations de livraison avec une plateforme
              complète : suivi des expéditions, gestion des chauffeurs,
              optimisation des itinéraires et rapports.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/connexion"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition"
              >
                Commencer
                <ArrowRightIcon className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="#features"
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                Voir les fonctionnalités
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6">
              <div className="rounded-2xl border border-gray-200 bg-white/70 p-4 backdrop-blur dark:border-gray-800 dark:bg-gray-900/60">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  24/7
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Suivi & statut
                </div>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white/70 p-4 backdrop-blur dark:border-gray-800 dark:bg-gray-900/60">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  -30%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Temps de tournée
                </div>
              </div>
              <div className="rounded-2xl border border-gray-200 bg-white/70 p-4 backdrop-blur dark:border-gray-800 dark:bg-gray-900/60">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">
                  +15%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Satisfaction
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative mx-auto max-w-xl">
              <div className="absolute -inset-4 -z-10 rounded-3xl bg-linear-to-r from-brand-500/20 to-brand-500/5 blur-2xl" />
              <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-gray-800">
                  <div className="flex items-center gap-2">
                    <BoxIconLine className="h-5 w-5 text-brand-500" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">
                      Tableau de bord
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Aperçu
                  </span>
                </div>

                <div className="p-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/40">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                        <CheckCircleIcon className="h-5 w-5 text-brand-500" />
                        Livraisons aujourd’hui
                      </div>
                      <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                        128
                      </div>
                      <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        +12% vs hier
                      </div>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-gray-800/40">
                      <div className="flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                        <PaperPlaneIcon className="h-5 w-5 text-brand-500" />
                        Expéditions en cours
                      </div>
                      <div className="mt-2 text-3xl font-bold text-gray-900 dark:text-white">
                        42
                      </div>
                      <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                        Mises à jour temps réel
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800">
                    <Image
                      src="/images/grid-image/image-03.png"
                      alt="Aperçu de la plateforme de gestion des livraisons"
                      width={1200}
                      height={720}
                      priority
                      className="h-auto w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

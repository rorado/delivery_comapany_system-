"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowRightIcon, CheckCircleIcon, BoxIconLine, PaperPlaneIcon, UserCircleIcon } from "@/icons";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BoxIconLine className="w-8 h-8 text-brand-500" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">FastDeliver</span>
            </div>
                <nav className="hidden md:flex items-center gap-6">
                  <a href="#features" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    Fonctionnalités
                  </a>
                  <a href="#about" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    À propos
                  </a>
                  <a href="#contact" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
                    Contact
                  </a>
                </nav>
            <div className="flex items-center gap-4">
              <Link
                href="/connexion"
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                    Se connecter
              </Link>
              <Link
                href="/connexion"
                className="px-4 py-2 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition"
              >
                    Commencer
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="text-center">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl lg:text-7xl">
                Système de gestion de
                <span className="text-brand-500"> livraison</span> rapide et fiable
              </h1>
          <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 sm:text-xl max-w-3xl mx-auto">
                Simplifiez vos opérations de livraison avec notre plateforme complète de gestion.
                Suivez les expéditions, gérez les chauffeurs et ravissez vos clients.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
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
                  En savoir plus
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 dark:bg-gray-800 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                  Fonctionnalités puissantes
                </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
                  Tout ce dont vous avez besoin pour gérer votre entreprise de livraison
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 rounded-lg flex items-center justify-center mb-4">
                <BoxIconLine className="w-6 h-6 text-brand-500" />
              </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Suivi des expéditions
                  </h3>
              <p className="text-gray-600 dark:text-gray-400">
                    Suivi en temps réel de toutes les expéditions avec des mises à jour détaillées et des informations de localisation.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 rounded-lg flex items-center justify-center mb-4">
                <UserCircleIcon className="w-6 h-6 text-brand-500" />
              </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Gestion des chauffeurs
                  </h3>
              <p className="text-gray-600 dark:text-gray-400">
                    Gérez votre équipe de livraison avec des plannings, un suivi des performances et l’optimisation des itinéraires.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 rounded-lg flex items-center justify-center mb-4">
                <PaperPlaneIcon className="w-6 h-6 text-brand-500" />
              </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Optimisation des itinéraires
                  </h3>
              <p className="text-gray-600 dark:text-gray-400">
                    Optimisez les itinéraires pour gagner du temps et du carburant tout en améliorant la satisfaction client.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 rounded-lg flex items-center justify-center mb-4">
                <CheckCircleIcon className="w-6 h-6 text-brand-500" />
              </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Analyses et rapports
                  </h3>
              <p className="text-gray-600 dark:text-gray-400">
                    Analyses et rapports complets pour prendre des décisions basées sur les données.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 rounded-lg flex items-center justify-center mb-4">
                <CheckCircleIcon className="w-6 h-6 text-brand-500" />
              </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Sécurisé et fiable
                  </h3>
              <p className="text-gray-600 dark:text-gray-400">
                    Sécurité de niveau entreprise pour protéger vos données et assurer un service fiable.
              </p>
            </div>
            <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
              <div className="w-12 h-12 bg-brand-100 dark:bg-brand-900/30 rounded-lg flex items-center justify-center mb-4">
                <BoxIconLine className="w-6 h-6 text-brand-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Portail client
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Portail en libre-service pour permettre aux clients de suivre leurs expéditions et gérer leurs commandes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-brand-500 to-brand-600 rounded-3xl p-12 text-center">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Prêt à transformer vos opérations de livraison ?
              </h2>
          <p className="mt-4 text-lg text-brand-100">
                Rejoignez des milliers d’entreprises qui utilisent FastDeliver pour simplifier la gestion de leurs livraisons.
          </p>
          <div className="mt-8">
            <Link
              href="/signin"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-brand-600 bg-white rounded-lg hover:bg-gray-50 transition"
            >
                  Commencer gratuitement
              <ArrowRightIcon className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <BoxIconLine className="w-6 h-6 text-brand-500" />
                <span className="text-lg font-bold text-white">FastDeliver</span>
              </div>
              <p className="text-sm">
                    La solution complète de gestion des livraisons pour les entreprises modernes.
              </p>
            </div>
            <div>
                  <h4 className="text-white font-semibold mb-4">Produit</h4>
              <ul className="space-y-2 text-sm">
                    <li><a href="#features" className="hover:text-white">Fonctionnalités</a></li>
                    <li><a href="#pricing" className="hover:text-white">Tarifs</a></li>
                    <li><a href="#about" className="hover:text-white">À propos</a></li>
              </ul>
            </div>
            <div>
                  <h4 className="text-white font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-2 text-sm">
                    <li><a href="#about" className="hover:text-white">À propos de nous</a></li>
                    <li><a href="#contact" className="hover:text-white">Contact</a></li>
                    <li><a href="#careers" className="hover:text-white">Carrières</a></li>
              </ul>
            </div>
            <div>
                  <h4 className="text-white font-semibold mb-4">Assistance</h4>
              <ul className="space-y-2 text-sm">
                    <li><a href="#help" className="hover:text-white">Centre d’aide</a></li>
                    <li><a href="#docs" className="hover:text-white">Documentation</a></li>
                    <li><a href="#contact" className="hover:text-white">Contacter l’assistance</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
                <p>&copy; {new Date().getFullYear()} FastDeliver. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}


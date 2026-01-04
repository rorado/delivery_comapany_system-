import {
  BoxIconLine,
  CheckCircleIcon,
  PaperPlaneIcon,
  UserCircleIcon,
} from "@/icons";

export default function FeaturesSection() {
  return (
    <section id="features" className="bg-gray-50 dark:bg-gray-800 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Fonctionnalités puissantes
          </h2>
          <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Tout ce dont vous avez besoin pour gérer votre entreprise de
            livraison
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
              Suivi en temps réel de toutes les expéditions avec des mises à
              jour détaillées et des informations de localisation.
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
              Gérez votre équipe de livraison avec des plannings, un suivi des
              performances et l’optimisation des itinéraires.
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
              Optimisez les itinéraires pour gagner du temps et du carburant
              tout en améliorant la satisfaction client.
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
              Analyses et rapports complets pour prendre des décisions basées
              sur les données.
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
              Sécurité de niveau entreprise pour protéger vos données et assurer
              un service fiable.
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
              Portail en libre-service pour permettre aux clients de suivre
              leurs expéditions et gérer leurs commandes.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

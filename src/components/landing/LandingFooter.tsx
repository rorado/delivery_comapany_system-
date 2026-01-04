import { BoxIconLine } from "@/icons";

export default function LandingFooter() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BoxIconLine className="w-6 h-6 text-brand-500" />
              <span className="text-lg font-bold text-white">FastDeliver</span>
            </div>
            <p className="text-sm">
              La solution complète de gestion des livraisons pour les
              entreprises modernes.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Produit</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="hover:text-white">
                  Fonctionnalités
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white">
                  Tarifs
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white">
                  À propos
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Entreprise</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#about" className="hover:text-white">
                  À propos de nous
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white">
                  Contact
                </a>
              </li>
              <li>
                <a href="#careers" className="hover:text-white">
                  Carrières
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Assistance</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#help" className="hover:text-white">
                  Centre d’aide
                </a>
              </li>
              <li>
                <a href="#docs" className="hover:text-white">
                  Documentation
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-white">
                  Contacter l’assistance
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} FastDeliver. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}

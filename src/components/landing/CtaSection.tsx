import Link from "next/link";
import { ArrowRightIcon } from "@/icons";

export default function CtaSection() {
  return (
    <section className="container mx-auto px-4 py-20 sm:px-6 lg:px-8">
      <div className="bg-linear-to-r from-brand-500 to-brand-600 rounded-3xl p-12 text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl">
          Prêt à transformer vos opérations de livraison ?
        </h2>
        <p className="mt-4 text-lg text-brand-100">
          Rejoignez des milliers d’entreprises qui utilisent FastDeliver pour
          simplifier la gestion de leurs livraisons.
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
  );
}

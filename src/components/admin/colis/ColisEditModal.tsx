"use client";
import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";
import type { Shipment } from "@/types/expedition";

interface ColisEditModalProps {
  isOpen: boolean;
  editData: Shipment | null;
  isSaving: boolean;
  onClose: () => void;
  onSave: () => void;
  onUpdate: (field: keyof Shipment, value: string) => void;
}

export default function ColisEditModal({
  isOpen,
  editData,
  isSaving,
  onClose,
  onSave,
  onUpdate,
}: ColisEditModalProps) {
  if (!isOpen || !editData) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-[900px] m-4 p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
            Éditer Colis
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {editData.packageNumber}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="text-theme-xs text-gray-500 dark:text-gray-400">
            Statut
          </label>
          <select
            value={editData.status}
            onChange={(e) => onUpdate("status", e.target.value)}
            className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-800 dark:text-white/90 dark:border-gray-700"
          >
            <option value="Pending">Pending</option>
            <option value="In Transit">In Transit</option>
            <option value="Out for Delivery">Out for Delivery</option>
            <option value="Delivered">Delivered</option>
            <option value="Failed">Failed</option>
          </select>
        </div>

        <div>
          <label className="text-theme-xs text-gray-500 dark:text-gray-400">
            Prix
          </label>
          <input
            type="text"
            value={editData.price}
            onChange={(e) => onUpdate("price", e.target.value)}
            className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-800 dark:text-white/90 dark:border-gray-700"
          />
        </div>

        <div>
          <label className="text-theme-xs text-gray-500 dark:text-gray-400">
            Destinataire
          </label>
          <input
            type="text"
            value={editData.recipient}
            onChange={(e) => onUpdate("recipient", e.target.value)}
            className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-800 dark:text-white/90 dark:border-gray-700"
          />
        </div>

        <div>
          <label className="text-theme-xs text-gray-500 dark:text-gray-400">
            Tél. Destinataire
          </label>
          <input
            type="text"
            value={editData.recipientPhone}
            onChange={(e) => onUpdate("recipientPhone", e.target.value)}
            className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-800 dark:text-white/90 dark:border-gray-700"
          />
        </div>

        <div>
          <label className="text-theme-xs text-gray-500 dark:text-gray-400">
            Expéditeur
          </label>
          <input
            type="text"
            value={editData.sender}
            onChange={(e) => onUpdate("sender", e.target.value)}
            className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-800 dark:text-white/90 dark:border-gray-700"
          />
        </div>

        <div>
          <label className="text-theme-xs text-gray-500 dark:text-gray-400">
            Tél. Expéditeur
          </label>
          <input
            type="text"
            value={editData.senderPhone}
            onChange={(e) => onUpdate("senderPhone", e.target.value)}
            className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-800 dark:text-white/90 dark:border-gray-700"
          />
        </div>

        <div>
          <label className="text-theme-xs text-gray-500 dark:text-gray-400">
            Ville
          </label>
          <input
            type="text"
            value={editData.city}
            onChange={(e) => onUpdate("city", e.target.value)}
            className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-800 dark:text-white/90 dark:border-gray-700"
          />
        </div>

        <div>
          <label className="text-theme-xs text-gray-500 dark:text-gray-400">
            Adresse
          </label>
          <input
            type="text"
            value={editData.address}
            onChange={(e) => onUpdate("address", e.target.value)}
            className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-800 dark:text-white/90 dark:border-gray-700"
          />
        </div>

        <div>
          <label className="text-theme-xs text-gray-500 dark:text-gray-400">
            Origine
          </label>
          <input
            type="text"
            value={editData.origin}
            onChange={(e) => onUpdate("origin", e.target.value)}
            className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-800 dark:text-white/90 dark:border-gray-700"
          />
        </div>

        <div>
          <label className="text-theme-xs text-gray-500 dark:text-gray-400">
            Destination
          </label>
          <input
            type="text"
            value={editData.destination}
            onChange={(e) => onUpdate("destination", e.target.value)}
            className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-800 dark:text-white/90 dark:border-gray-700"
          />
        </div>

        <div>
          <label className="text-theme-xs text-gray-500 dark:text-gray-400">
            Poids
          </label>
          <input
            type="text"
            value={editData.weight}
            onChange={(e) => onUpdate("weight", e.target.value)}
            className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-800 dark:text-white/90 dark:border-gray-700"
          />
        </div>

        <div>
          <label className="text-theme-xs text-gray-500 dark:text-gray-400">
            Produit
          </label>
          <input
            type="text"
            value={editData.product}
            onChange={(e) => onUpdate("product", e.target.value)}
            className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-800 dark:text-white/90 dark:border-gray-700"
          />
        </div>

        <div>
          <label className="text-theme-xs text-gray-500 dark:text-gray-400">
            Chauffeur
          </label>
          <input
            type="text"
            value={editData.driver}
            onChange={(e) => onUpdate("driver", e.target.value)}
            className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-800 dark:text-white/90 dark:border-gray-700"
          />
        </div>

        <div>
          <label className="text-theme-xs text-gray-500 dark:text-gray-400">
            Livraison estimée
          </label>
          <input
            type="text"
            value={editData.estimatedDelivery}
            onChange={(e) => onUpdate("estimatedDelivery", e.target.value)}
            className="mt-1 h-11 w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-800 dark:text-white/90 dark:border-gray-700"
          />
        </div>

        <div className="md:col-span-2">
          <label className="text-theme-xs text-gray-500 dark:text-gray-400">
            Commentaire
          </label>
          <textarea
            value={editData.comment}
            onChange={(e) => onUpdate("comment", e.target.value)}
            className="mt-1 min-h-[90px] w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-800 dark:text-white/90 dark:border-gray-700"
          />
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3">
        <Button
          size="sm"
          variant="outline"
          onClick={onClose}
          disabled={isSaving}
        >
          Annuler
        </Button>
        <Button size="sm" onClick={onSave} disabled={isSaving}>
          {isSaving ? "Enregistrement…" : "Sauvegarder"}
        </Button>
      </div>
    </Modal>
  );
}

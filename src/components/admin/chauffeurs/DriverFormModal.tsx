"use client";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import type { Driver } from "@/types/driver";

export interface DriverFormData {
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  status: Driver["status"];
  password: string;
}

interface DriverFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  formData: DriverFormData;
  setFormData: (next: DriverFormData) => void;
  editingDriver: Driver | null;
}

export default function DriverFormModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  editingDriver,
}: DriverFormModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[600px] p-5 lg:p-10"
    >
      <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
        {editingDriver ? "Modifier le livreur" : "Ajouter un livreur"}
      </h4>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-5"
      >
        <div>
          <Label>Nom complet</Label>
          <input
            type="text"
            placeholder="Entrez le nom du livreur"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
        </div>

        <div>
          <Label>Email</Label>
          <input
            type="email"
            placeholder="Entrez l’adresse email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            required
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
        </div>

        <div>
          <Label>Téléphone</Label>
          <input
            type="tel"
            placeholder="Entrez le numéro de téléphone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            required
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
        </div>

        <div>
          <Label>Véhicule</Label>
          <input
            type="text"
            placeholder="Entrez le numéro du véhicule"
            value={formData.vehicle}
            onChange={(e) =>
              setFormData({ ...formData, vehicle: e.target.value })
            }
            required
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
        </div>

        <div>
          <Label>Mot de passe</Label>
          <input
            type="password"
            placeholder={
              editingDriver
                ? "Laisser vide pour ne pas modifier"
                : "Entrez un mot de passe"
            }
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            required={!editingDriver}
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700 dark:placeholder:text-white/30 dark:focus:border-brand-800"
          />
        </div>

        <div>
          <Label>Statut</Label>
          <select
            value={formData.status}
            onChange={(e) =>
              setFormData({
                ...formData,
                status: e.target.value as Driver["status"],
              })
            }
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700 dark:focus:border-brand-800"
          >
            <option value="Active">Actif</option>
            <option value="On Route">En livraison</option>
            <option value="On Break">En pause</option>
            <option value="Offline">Hors ligne</option>
          </select>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <Button type="button" size="sm" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" size="sm">
            {editingDriver ? "Mettre à jour" : "Ajouter"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

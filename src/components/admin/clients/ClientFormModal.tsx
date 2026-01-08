"use client";
import { Modal } from "@/components/ui/modal";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import type { Customer } from "@/types/customer";
import { useCallback } from "react";

export interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  image: string;
  password: string;
}

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  formData: ClientFormData;
  setFormData: (next: ClientFormData) => void;
  editingCustomer: Customer | null;
}

export default function ClientFormModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  editingCustomer,
}: ClientFormModalProps) {
  const handleChange = useCallback(
    (key: keyof ClientFormData, value: string) => {
      setFormData({ ...formData, [key]: value });
    },
    [formData, setFormData]
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[600px] p-5 lg:p-10"
    >
      <h4 className="mb-6 text-lg font-semibold text-gray-800 dark:text-white/90">
        {editingCustomer ? "Modifier le Client" : "Ajouter un Nouveau Client"}
      </h4>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
        className="space-y-5"
      >
        <div>
          <Label>Nom Complet</Label>
          <input
            type="text"
            placeholder="Entrez le nom du client"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            required
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
          />
        </div>
        <div>
          <Label>Email</Label>
          <input
            type="email"
            placeholder="Entrez l'adresse e-mail"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            required
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
          />
        </div>
        <div>
          <Label>Téléphone</Label>
          <input
            type="tel"
            placeholder="Entrez le numéro de téléphone"
            value={formData.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            required
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
          />
        </div>
        <div>
          <Label>Mot de passe</Label>
          <input
            type="password"
            placeholder={
              editingCustomer
                ? "Laisser vide pour ne pas modifier"
                : "Entrez un mot de passe"
            }
            value={formData.password}
            onChange={(e) => handleChange("password", e.target.value)}
            required={!editingCustomer}
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
          />
        </div>
        <div>
          <Label>Adresse</Label>
          <input
            type="text"
            placeholder="Entrez l'adresse"
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
            required
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
          />
        </div>
        <div>
          <Label>Image (URL) (optionnel)</Label>
          <input
            type="text"
            placeholder="Ex: /images/user/user-02.jpg ou https://..."
            value={formData.image}
            onChange={(e) => handleChange("image", e.target.value)}
            className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
          />
          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
            Si vide, un avatar par défaut sera affiché.
          </p>
        </div>
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button type="button" size="sm" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" size="sm">
            {editingCustomer ? "Mettre à Jour" : "Ajouter"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

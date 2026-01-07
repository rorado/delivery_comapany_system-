"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import { PencilIcon } from "@/icons";

type ClientProfile = {
  name: string;
  email: string;
  phone: string;
  address: string;
  company: string;
};

export default function ClientProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const defaultProfile = useMemo<ClientProfile>(
    () => ({
      name: "Jean Dupont",
      email: "client@fastdeliver.com",
      phone: "+212 6 12 34 56 78",
      address: "12 Avenue Mohammed V, Rabat 10000",
      company: "ABC Société",
    }),
    []
  );

  const [profileData, setProfileData] = useState<ClientProfile>(defaultProfile);
  const [savedProfile, setSavedProfile] =
    useState<ClientProfile>(defaultProfile);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/client/profile", {
          method: "GET",
          headers: { Accept: "application/json" },
        });
        if (!res.ok) return;
        const data = (await res.json()) as ClientProfile;
        if (!mounted) return;
        if (data && typeof data === "object") {
          setProfileData(data);
          setSavedProfile(data);
        }
      } catch {
        // keep defaults
      }
    })();
    return () => {
      mounted = false;
    };
  }, [defaultProfile]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/client/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profileData),
      });

      if (!res.ok) {
        let details = "";
        try {
          details = await res.text();
        } catch {
          // ignore
        }
        throw new Error(details || `HTTP ${res.status}`);
      }

      const saved = (await res.json()) as ClientProfile;
      setSavedProfile(saved);
      setProfileData(saved);
      setIsEditing(false);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      window.alert(`Erreur: impossible d'enregistrer le profil (${message})`);
    } finally {
      setIsSaving(false);
    }
  }, [profileData]);

  const handleCancel = useCallback(() => {
    setProfileData(savedProfile);
    setIsEditing(false);
  }, [savedProfile]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            Mon Profil
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Gérez vos informations personnelles et paramètres de compte.
          </p>
        </div>
        {!isEditing && (
          <Button size="sm" onClick={() => setIsEditing(true)}>
            <PencilIcon className="w-4 h-4 mr-2" />
            Modifier le profil
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
            <div className="text-center">
              <div className="mx-auto w-24 h-24 rounded-full overflow-hidden mb-4">
                <Image
                  width={96}
                  height={96}
                  src="/images/user/user-01.jpg"
                  alt={profileData.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                {profileData.name}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">Client</p>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Total des colis
                    </span>
                    <span className="font-medium text-gray-800 dark:text-white/90">
                      30
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Livrés
                    </span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      28
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      En transit
                    </span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      2
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <div className="lg:col-span-2">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-6">
              Informations personnelles
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void handleSave();
              }}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <Label>Nom complet</Label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
                    />
                  ) : (
                    <p className="mt-2 text-gray-800 dark:text-white/90">
                      {profileData.name}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Email</Label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          email: e.target.value,
                        })
                      }
                      className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
                    />
                  ) : (
                    <p className="mt-2 text-gray-800 dark:text-white/90">
                      {profileData.email}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Téléphone</Label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          phone: e.target.value,
                        })
                      }
                      className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
                    />
                  ) : (
                    <p className="mt-2 text-gray-800 dark:text-white/90">
                      {profileData.phone}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Entreprise</Label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.company}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          company: e.target.value,
                        })
                      }
                      className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
                    />
                  ) : (
                    <p className="mt-2 text-gray-800 dark:text-white/90">
                      {profileData.company}
                    </p>
                  )}
                </div>
                <div className="sm:col-span-2">
                  <Label>Adresse</Label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.address}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          address: e.target.value,
                        })
                      }
                      className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
                    />
                  ) : (
                    <p className="mt-2 text-gray-800 dark:text-white/90">
                      {profileData.address}
                    </p>
                  )}
                </div>
              </div>
              {isEditing && (
                <div className="flex items-center gap-3 pt-4">
                  <Button type="submit" size="sm" disabled={isSaving}>
                    Enregistrer les modifications
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSaving}
                  >
                    Annuler
                  </Button>
                </div>
              )}
            </form>
          </div>

          {/* Account Settings */}
          {/* <div className="mt-6 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90 mb-4">
              Paramètres du compte
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800 dark:text-white/90">
                    Notifications par email
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Recevoir des mises à jour par email sur vos colis
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    defaultChecked
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-800 dark:text-white/90">
                    Notifications SMS
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Recevoir des mises à jour par SMS sur vos colis
                  </p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-300 dark:peer-focus:ring-brand-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-brand-600"></div>
                </label>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

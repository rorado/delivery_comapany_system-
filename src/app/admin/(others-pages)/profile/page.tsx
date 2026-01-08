"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import { PencilIcon } from "@/icons";

type AdminProfile = {
  name: string;
  email: string;
  phone: string;
  address: string;
  company: string;
};

export default function AdminProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const defaultProfile = useMemo<AdminProfile>(
    () => ({
      name: "Admin Principal",
      email: "admin@fastdeliver.com",
      phone: "+212 6 22 33 44 55",
      address: "Siège FastDeliver, Casablanca 20000",
      company: "FastDeliver",
    }),
    []
  );

  const [profileData, setProfileData] = useState<AdminProfile>(defaultProfile);
  const [savedProfile, setSavedProfile] =
    useState<AdminProfile>(defaultProfile);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/profile", {
          method: "GET",
          headers: { Accept: "application/json" },
        });
        if (!res.ok) return;
        const data = (await res.json()) as AdminProfile;
        if (!mounted) return;
        if (data && typeof data === "object") {
          setProfileData(data);
          setSavedProfile(data);
        }
      } catch {
        // keep defaults if read fails
      }
    })();
    return () => {
      mounted = false;
    };
  }, [defaultProfile]);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/admin/profile", {
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

      const saved = (await res.json()) as AdminProfile;
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
            Profil Administrateur
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Gérez les informations du compte administrateur.
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
                  src="/images/user/owner.jpg"
                  alt={profileData.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
                {profileData.name}
              </h2>
              <p className="text-gray-500 dark:text-gray-400">Administrateur</p>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Société
                    </span>
                    <span className="font-medium text-gray-800 dark:text-white/90">
                      {profileData.company}
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
        </div>
      </div>
    </div>
  );
}

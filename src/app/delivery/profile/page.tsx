"use client";
import { useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/button/Button";
import Label from "@/components/form/Label";
import { PencilIcon } from "@/icons";

export default function DeliveryProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: "Omar El Fassi",
    email: "omar.elfassi@example.ma",
    phone: "+212 6 45 67 89 10",
    vehicle: "Camion #DLV-001",
    licenseNumber: "MA-123456",
    address: "Boulevard Zerktouni, Casablanca 20000",
  });

  const handleSave = () => {
    setIsEditing(false);
    // In production, save to backend
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
            Mon profil
          </h1>
          <p className="mt-1 text-gray-500 dark:text-gray-400">
            Gérez vos informations et paramètres.
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
              <p className="text-gray-500 dark:text-gray-400">Livreur</p>
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Total Deliveries
                    </span>
                    <span className="font-medium text-gray-800 dark:text-white/90">
                      245
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Success Rate
                    </span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      98%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">
                      Rating
                    </span>
                    <span className="font-medium text-gray-800 dark:text-white/90">
                      4.8 ⭐
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
                handleSave();
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
                  <Label>Véhicule</Label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.vehicle}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          vehicle: e.target.value,
                        })
                      }
                      className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
                    />
                  ) : (
                    <p className="mt-2 text-gray-800 dark:text-white/90">
                      {profileData.vehicle}
                    </p>
                  )}
                </div>
                <div>
                  <Label>Numéro de permis</Label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={profileData.licenseNumber}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          licenseNumber: e.target.value,
                        })
                      }
                      className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
                    />
                  ) : (
                    <p className="mt-2 text-gray-800 dark:text-white/90">
                      {profileData.licenseNumber}
                    </p>
                  )}
                </div>
                <div>
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
                  <Button type="submit" size="sm">
                    Enregistrer
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
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

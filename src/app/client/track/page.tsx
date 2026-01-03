"use client";
import { useState, useEffect, Suspense } from "react";
import Badge from "@/components/ui/badge/Badge";
import { PaperPlaneIcon, CheckCircleIcon } from "@/icons";
import { useSearchParams } from "next/navigation";

interface TrackingEvent {
  time: string;
  location: string;
  status: string;
  description: string;
}

interface ShipmentTracking {
  trackingNumber: string;
  sender: string;
  recipient: string;
  origin: string;
  destination: string;
  currentLocation: string;
  status: "En attente" | "En transit" | "En livraison" | "Livré" | "Échoué";
  estimatedDelivery: string;
  weight: string;
  image: string;
  events: TrackingEvent[];
}

const trackingDatabase: Record<string, ShipmentTracking> = {
  "DLV-2024-001": {
    trackingNumber: "DLV-2024-001",
    sender: "ABC Société",
    recipient: "Jean Dupont",
    origin: "New York, NY",
    destination: "123 Rue Principale, Los Angeles, CA",
    currentLocation: "Chicago, IL",
    status: "En transit",
    estimatedDelivery: "2024-01-15 14:00",
    weight: "2,5 kg",
    image:
      "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=400&h=300&fit=crop",
    events: [
      {
        time: "2024-01-12 14:30",
        location: "Chicago, IL",
        status: "En transit",
        description: "Colis en route vers sa destination",
      },
      {
        time: "2024-01-11 10:15",
        location: "New York, NY",
        status: "En transit",
        description: "Colis parti du centre d'origine",
      },
      {
        time: "2024-01-10 09:00",
        location: "New York, NY",
        status: "En attente",
        description: "Colis récupéré chez l'expéditeur",
      },
    ],
  },
  "DLV-2024-002": {
    trackingNumber: "DLV-2024-002",
    sender: "XYZ Corp",
    recipient: "Jean Dupont",
    origin: "Chicago, IL",
    destination: "123 Rue Principale, Los Angeles, CA",
    currentLocation: "Los Angeles, CA",
    status: "Livré",
    estimatedDelivery: "2024-01-12 16:00",
    weight: "5,0 kg",
    image:
      "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=400&h=300&fit=crop",
    events: [
      {
        time: "2024-01-12 15:30",
        location: "Los Angeles, CA",
        status: "Livré",
        description: "Colis livré avec succès",
      },
      {
        time: "2024-01-12 10:00",
        location: "Los Angeles, CA",
        status: "En livraison",
        description: "Le livreur est en route",
      },
      {
        time: "2024-01-11 18:30",
        location: "Los Angeles, CA",
        status: "En transit",
        description: "Colis arrivé au centre de destination",
      },
      {
        time: "2024-01-08 10:00",
        location: "Chicago, IL",
        status: "En attente",
        description: "Colis récupéré chez l'expéditeur",
      },
    ],
  },
};

function TrackPackageContent() {
  const searchParams = useSearchParams();
  const [trackingNumber, setTrackingNumber] = useState(
    searchParams.get("tracking") || ""
  );
  const [trackingData, setTrackingData] = useState<ShipmentTracking | null>(
    null
  );
  const [error, setError] = useState("");

  const handleTrack = () => {
    if (!trackingNumber.trim()) {
      setError("Veuillez saisir un numéro de suivi");
      return;
    }

    const data = trackingDatabase[trackingNumber.toUpperCase()];
    if (data) {
      setTrackingData(data);
      setError("");
    } else {
      setTrackingData(null);
      setError("Numéro de suivi introuvable. Veuillez vérifier et réessayer.");
    }
  };

  useEffect(() => {
    const tracking = searchParams.get("tracking");
    if (tracking) {
      setTrackingNumber(tracking);
      const data = trackingDatabase[tracking.toUpperCase()];
      if (data) {
        setTrackingData(data);
        setError("");
      } else {
        setTrackingData(null);
        setError(
          "Numéro de suivi introuvable. Veuillez vérifier et réessayer."
        );
      }
    }
  }, [searchParams]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">
          Suivi de colis
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400">
          Saisissez votre numéro de suivi pour voir le statut en temps réel de
          votre expédition.
        </p>
      </div>

      {/* Tracking Input */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Numéro de suivi (ex: DLV-2024-001)"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleTrack();
                }
              }}
              className="h-11 w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500/10 focus:border-brand-300 dark:bg-gray-900 dark:text-white/90 dark:border-gray-700"
            />
          </div>
          <button
            onClick={handleTrack}
            className="px-6 py-2.5 text-sm font-medium text-white bg-brand-500 rounded-lg hover:bg-brand-600 transition"
          >
            Suivre le colis
          </button>
        </div>
        {error && (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>

      {/* Tracking Results */}
      {trackingData && (
        <div className="space-y-6">
          {/* Shipment Info */}
          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
            <div className="mb-6 flex flex-col sm:flex-row gap-4">
              {trackingData.image && (
                <div className="sm:w-48 shrink-0">
                  <img
                    src={trackingData.image}
                    alt={trackingData.trackingNumber}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}
              <div className="flex-1 flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white/90">
                    {trackingData.trackingNumber}
                  </h2>
                  <p className="mt-1 text-gray-500 dark:text-gray-400">
                    {trackingData.sender} → {trackingData.recipient}
                  </p>
                </div>
                <Badge
                  size="sm"
                  color={
                    trackingData.status === "Livré"
                      ? "success"
                      : trackingData.status === "En transit" ||
                        trackingData.status === "En livraison"
                      ? "info"
                      : trackingData.status === "En attente"
                      ? "warning"
                      : "error"
                  }
                >
                  {trackingData.status}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Emplacement actuel
                </p>
                <p className="mt-1 font-medium text-gray-800 dark:text-white/90">
                  {trackingData.currentLocation}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Livraison estimée
                </p>
                <p className="mt-1 font-medium text-gray-800 dark:text-white/90">
                  {trackingData.estimatedDelivery}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Poids
                </p>
                <p className="mt-1 font-medium text-gray-800 dark:text-white/90">
                  {trackingData.weight}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Destination
                </p>
                <p className="mt-1 font-medium text-gray-800 dark:text-white/90">
                  {trackingData.destination}
                </p>
              </div>
            </div>

            {/* Tracking Timeline */}
            <div>
              <h3 className="mb-4 font-semibold text-gray-800 dark:text-white/90">
                Historique du suivi
              </h3>
              <div className="space-y-4">
                {trackingData.events.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`h-3 w-3 rounded-full ${
                          index === 0
                            ? "bg-brand-500"
                            : "bg-gray-300 dark:bg-gray-700"
                        }`}
                      />
                      {index < trackingData.events.length - 1 && (
                        <div className="h-16 w-0.5 bg-gray-200 dark:bg-gray-700" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-800 text-theme-sm dark:text-white/90">
                          {event.status}
                        </p>
                        <p className="text-gray-500 text-theme-xs dark:text-gray-400">
                          {event.time}
                        </p>
                      </div>
                      <p className="mt-1 text-gray-500 text-theme-xs dark:text-gray-400">
                        {event.location}
                      </p>
                      <p className="mt-1 text-gray-500 text-theme-xs dark:text-gray-400">
                        {event.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Track Examples */}
      {!trackingData && !error && (
        <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/3">
          <h3 className="mb-4 font-semibold text-gray-800 dark:text-white/90">
            Exemples rapides
          </h3>
          <div className="space-y-2">
            <button
              onClick={() => {
                setTrackingNumber("DLV-2024-001");
                handleTrack();
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              DLV-2024-001 (En transit)
            </button>
            <button
              onClick={() => {
                setTrackingNumber("DLV-2024-002");
                handleTrack();
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 bg-gray-50 rounded-lg hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              DLV-2024-002 (Livré)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackPackagePage() {
  return (
    <Suspense fallback={<div className="p-6">Chargement...</div>}>
      <TrackPackageContent />
    </Suspense>
  );
}

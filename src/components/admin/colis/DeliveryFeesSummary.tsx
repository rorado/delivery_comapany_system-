"use client";

type Props = {
  pickupFee: number;
  pickupOutFee: number;
};

export default function DeliveryFeesSummary({
  pickupFee,
  pickupOutFee,
}: Props) {
  return (
    <div className="text-sm text-gray-700 dark:text-gray-300">
      <div>Frais de livraison ( Ramassage ) : {pickupFee.toFixed(2)}</div>
      <div>
        Frais de livraison ( Ramassage Hors ) : {pickupOutFee.toFixed(2)}
      </div>
    </div>
  );
}

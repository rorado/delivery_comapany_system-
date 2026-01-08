"use client";
import Button from "@/components/ui/button/Button";

type Props = {
  onCancel: () => void;
  onSubmit: () => void;
  disabled: boolean;
  isSaving: boolean;
};

export default function FormActions({
  onCancel,
  onSubmit,
  disabled,
  isSaving,
}: Props) {
  return (
    <div className="flex gap-2">
      <Button size="sm" variant="outline" onClick={onCancel}>
        Retour
      </Button>
      <Button size="sm" onClick={onSubmit} disabled={disabled}>
        {isSaving ? "Enregistrement..." : "Enregistrer"}
      </Button>
    </div>
  );
}

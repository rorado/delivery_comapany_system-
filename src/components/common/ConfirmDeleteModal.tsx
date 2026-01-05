import { Modal } from "@/components/ui/modal";
import Button from "@/components/ui/button/Button";

type ConfirmDeleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
};

export default function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm deletion",
  description = "This action cannot be undone.",
  confirmText = "Delete",
  cancelText = "Cancel",
}: ConfirmDeleteModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-[520px] p-5 lg:p-10"
    >
      <h4 className="mb-2 text-lg font-semibold text-gray-800 dark:text-white/90">
        {title}
      </h4>
      <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>

      <div className="flex items-center justify-end gap-3 pt-6">
        <Button type="button" size="sm" variant="outline" onClick={onClose}>
          {cancelText}
        </Button>
        <Button type="button" size="sm" onClick={onConfirm}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}

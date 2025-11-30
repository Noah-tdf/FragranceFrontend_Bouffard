import "./ConfirmDeleteModal.css";

interface ConfirmDeleteModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  message: string;
}

export default function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  message,
}: ConfirmDeleteModalProps) {
  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <p className="modal-message">{message}</p>

        <div className="modal-buttons">
          <button className="btn-delete" onClick={onConfirm}>
            Delete
          </button>

          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

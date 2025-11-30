import { useState, useEffect } from "react";
import "./CustomerModal.css";

interface CustomerData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface CustomerModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: CustomerData) => void;
  initialData?: CustomerData | null;
}

export default function CustomerModal({
  open,
  onClose,
  onSave,
  initialData,
}: CustomerModalProps) {
  const [customer, setCustomer] = useState<CustomerData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });

  useEffect(() => {
    if (initialData) {
      setCustomer(initialData);
    } else {
      setCustomer({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
      });
    }
  }, [initialData]);

  if (!open) return null;

  const handleChange = (field: keyof CustomerData, value: string) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(customer);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <h2 className="modal-title">
          {initialData ? "Edit Customer" : "Add Customer"}
        </h2>

        <form className="modal-form" onSubmit={handleSubmit}>
          <input
            className="modal-input"
            placeholder="First Name"
            value={customer.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
          />

          <input
            className="modal-input"
            placeholder="Last Name"
            value={customer.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
          />

          <input
            className="modal-input"
            type="email"
            placeholder="Email"
            value={customer.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />

          <input
            className="modal-input"
            placeholder="Phone"
            value={customer.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />

          <div className="modal-buttons">
            <button type="submit" className="btn-primary">
              Save
            </button>
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

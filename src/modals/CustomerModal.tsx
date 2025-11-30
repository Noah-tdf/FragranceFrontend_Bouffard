import { useState, useEffect } from "react";

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
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2>{initialData ? "Edit Customer" : "Add Customer"}</h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <input
            placeholder="First Name"
            value={customer.firstName}
            onChange={(e) => handleChange("firstName", e.target.value)}
          />

          <input
            placeholder="Last Name"
            value={customer.lastName}
            onChange={(e) => handleChange("lastName", e.target.value)}
          />

          <input
            placeholder="Email"
            type="email"
            value={customer.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />

          <input
            placeholder="Phone"
            value={customer.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
          />

          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const modalStyle: React.CSSProperties = {
  background: "white",
  padding: "1.5rem",
  borderRadius: "0.5rem",
  minWidth: "320px",
};

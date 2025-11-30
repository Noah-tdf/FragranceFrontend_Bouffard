import { useState, useEffect } from "react";

interface ProductData {
  id?: number;
  name: string;
  brand: string;
  price: number;
  description: string;
  notes: string;
  category: string;
}

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: ProductData) => void;
  initialData?: ProductData | null;
}

export default function ProductModal({
  open,
  onClose,
  onSave,
  initialData,
}: ProductModalProps) {
  const [product, setProduct] = useState<ProductData>({
    id: undefined,
    name: "",
    brand: "",
    price: 0,
    description: "",
    notes: "",
    category: "",
  });

  useEffect(() => {
    if (initialData) {
      setProduct(initialData);
    } else {
      setProduct({
        id: undefined,
        name: "",
        brand: "",
        price: 0,
        description: "",
        notes: "",
        category: "",
      });
    }
  }, [initialData]);

  if (!open) return null;

  const handleChange = (field: keyof ProductData, value: string) => {
    setProduct((prev) => ({
      ...prev,
      [field]: field === "price" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(product);
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <h2>{product.id ? "Edit Product" : "Add Product"}</h2>

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <input
            placeholder="Name"
            value={product.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
          <input
            placeholder="Brand"
            value={product.brand}
            onChange={(e) => handleChange("brand", e.target.value)}
          />
          <input
            placeholder="Category"
            value={product.category}
            onChange={(e) => handleChange("category", e.target.value)}
          />
          <input
            placeholder="Description"
            value={product.description}
            onChange={(e) => handleChange("description", e.target.value)}
          />
          <input
            placeholder="Notes"
            value={product.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
          />
          <input
            placeholder="Price"
            type="number"
            step="0.01"
            value={product.price}
            onChange={(e) => handleChange("price", e.target.value)}
          />

          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
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

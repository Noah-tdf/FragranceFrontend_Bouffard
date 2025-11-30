import { useState, useEffect } from "react";
import "./ProductModal.css";

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
    <div className="product-overlay">
      <div className="product-modal">
        <h2>{product.id ? "Edit Product" : "Add Product"}</h2>

        <form onSubmit={handleSubmit} className="product-form">
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

          <div className="product-btn-row">
            <button type="submit" className="product-save-btn">
              Save
            </button>
            <button
              type="button"
              className="product-cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

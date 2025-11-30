import { useEffect, useState } from "react";
import { api } from "../api/api";
import "./OrderModal.css";

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

export interface OrderItemInput {
  productId: number;
  quantity: number;
}

export interface InitialData {
  id?: number;
  customerId: number;
  items: OrderItemInput[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (data: {
    orderDate: string;
    customerId: number;
    items: OrderItemInput[];
    id?: number;
  }) => void;
  initialData?: InitialData | null;
}

export default function OrderModal({ open, onClose, onSave, initialData }: Props) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  const [customerId, setCustomerId] = useState<number>(0);
  const [items, setItems] = useState<OrderItemInput[]>([]);

  useEffect(() => {
    if (!open) return;

    const load = async () => {
      const c = await api.get<Customer[]>("/customers");
      const p = await api.get<Product[]>("/products");
      setCustomers(c.data);
      setProducts(p.data);
    };

    load();
  }, [open]);

  useEffect(() => {
    if (!open) return;

    if (initialData) {
      setCustomerId(initialData.customerId);
      setItems(
        initialData.items.length > 0
          ? initialData.items.map((it) => ({ ...it }))
          : [{ productId: 0, quantity: 1 }]
      );
    } else {
      setCustomerId(0);
      setItems([{ productId: 0, quantity: 1 }]);
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleItemChange = (
    index: number,
    field: "productId" | "quantity",
    value: number
  ) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    setItems(updated);
  };

  const addItem = () => {
    setItems([...items, { productId: 0, quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleaned = items.filter(
      (i) => i.productId !== 0 && i.quantity > 0
    );

    onSave({
      id: initialData?.id,
      orderDate: new Date().toISOString().split("T")[0],
      customerId,
      items: cleaned
    });
  };

  return (
    <div className="order-overlay">
      <div className="order-modal">
        <h2>{initialData ? "Edit Order" : "Create Order"}</h2>

        <form onSubmit={handleSubmit} className="order-form">
          <select
            value={customerId}
            onChange={(e) => setCustomerId(Number(e.target.value))}
          >
            <option value={0}>Select customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.firstName} {c.lastName}
              </option>
            ))}
          </select>

          <h3>Items</h3>

          {items.map((item, index) => (
            <div key={index} className="order-item-row">
              <select
                value={item.productId}
                onChange={(e) =>
                  handleItemChange(index, "productId", Number(e.target.value))
                }
              >
                <option value={0}>Select product</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>

              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  handleItemChange(index, "quantity", Number(e.target.value))
                }
              />

              <button
                type="button"
                className="order-remove-btn"
                onClick={() => removeItem(index)}
              >
                X
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addItem}
            className="order-add-btn"
          >
            + Add Item
          </button>

          <div style={{ display: "flex", gap: "0.6rem" }}>
            <button type="submit" className="order-save-btn">
              Save Order
            </button>
            <button
              type="button"
              className="order-cancel-btn"
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

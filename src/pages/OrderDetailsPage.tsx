import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api/api";

interface OrderItem {
  id: number;
  productName: string;
  quantity: number;
  subtotal: number;
}

interface Order {
  id: number;
  orderDate: string;
  totalAmount: number;

  customerId: number;
  customerFirstName: string;
  customerLastName: string;

  items: OrderItem[] | null;
}

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    (async () => {
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data);
    })();
  }, [id]);

  if (!order) return <p>Loading…</p>;

  return (
    <div>
      <h1>Order #{order.id}</h1>

      <p>Date: {order.orderDate}</p>
      <p>Total: ${order.totalAmount.toFixed(2)}</p>

      <div>
        <h2>Customer</h2>
        <p>
          {order.customerFirstName} {order.customerLastName}
        </p>
      </div>

      {order.items && (
        <div>
          <h2>Items</h2>
          <ul>
            {order.items.map((it) => (
              <li key={it.id}>
                {it.productName} — Qty {it.quantity} — ${it.subtotal.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}

      <Link to="/orders">Back</Link>
    </div>
  );
}

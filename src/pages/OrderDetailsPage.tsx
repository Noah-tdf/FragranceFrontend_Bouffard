import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api/api";
import "./OrderDetailsPage.css";

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
    <div className="order-page">
      <h1 className="order-title">Order #{order.id}</h1>

      <div className="order-info-card">
        <p><strong>Date:</strong> {order.orderDate}</p>
        <p><strong>Total:</strong> ${order.totalAmount.toFixed(2)}</p>
      </div>

      <h2 className="section-title">Customer</h2>
      <div className="customer-card">
        <p>{order.customerFirstName} {order.customerLastName}</p>
      </div>

      {order.items && (
        <>
          <h2 className="section-title">Items</h2>
          <div className="items-card">
            <table className="items-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                </tr>
              </thead>

              <tbody>
                {order.items.map((it) => (
                  <tr key={it.id}>
                    <td>{it.productName}</td>
                    <td>{it.quantity}</td>
                    <td>${it.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <Link to="/orders" className="back-link">
        ← Back to Orders
      </Link>
    </div>
  );
}

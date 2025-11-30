import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  items: OrderItem[];
}

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export default function CustomerDetailsPage() {
  const { id } = useParams();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchCustomer = async () => {
    const res = await api.get<Customer>(`/customers/${id}`);
    setCustomer(res.data);
  };

  const fetchOrders = async () => {
    const res = await api.get<Order[]>(`/orders/customers/${id}`);
    setOrders(res.data);
  };

  useEffect(() => {
    fetchCustomer();
    fetchOrders();
  }, [id]);

  if (!customer) return <p>Loading...</p>;

  return (
    <div>
      <h1>
        {customer.firstName} {customer.lastName}
      </h1>
      <p>Email: {customer.email}</p>
      <p>Phone: {customer.phone}</p>

      <h2 style={{ marginTop: "1.5rem" }}>Orders</h2>
      {orders.length === 0 && <p>No orders for this customer yet.</p>}

      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "0.5rem",
            padding: "0.75rem",
            marginTop: "0.75rem",
          }}
        >
          <p>
            <strong>Order #{order.id}</strong> — {order.orderDate} — Total: ${order.totalAmount.toFixed(2)}
          </p>

          {order.items && order.items.length > 0 && (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "0.5rem",
              }}
            >
              <thead>
                <tr>
                  <th style={th}>Product</th>
                  <th style={th}>Quantity</th>
                  <th style={th}>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td style={td}>{item.productName}</td>
                    <td style={td}>{item.quantity}</td>
                    <td style={td}>${item.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ))}
    </div>
  );
}

const th: React.CSSProperties = {
  borderBottom: "1px solid #e5e7eb",
  textAlign: "left",
  padding: "0.4rem",
};

const td: React.CSSProperties = {
  borderBottom: "1px solid #f3f4f6",
  padding: "0.4rem",
};

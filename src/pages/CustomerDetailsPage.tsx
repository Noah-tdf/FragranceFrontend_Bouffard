import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/api";
import "./CustomerDetailsPage.css";

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

  useEffect(() => {
    const loadData = async () => {
      const c = await api.get<Customer>(`/customers/${id}`);
      const o = await api.get<Order[]>(`/orders/customers/${id}`);

      setCustomer(c.data);
      setOrders(o.data);
    };

    loadData();
  }, [id]);

  if (!customer) return <p>Loading...</p>;

  return (
    <div className="customer-details">
      <h1>
        {customer.firstName} {customer.lastName}
      </h1>

      <div className="customer-info">
        <p>Email: {customer.email}</p>
        <p>Phone: {customer.phone}</p>
      </div>

      <h2 className="orders-title">Orders</h2>
      {orders.length === 0 && (
        <p className="no-orders-text">No orders for this customer yet.</p>
      )}

      {orders.map((order) => (
        <div key={order.id} className="order-card">
          <p className="order-header">
            <strong>Order #{order.id}</strong> • {order.orderDate} •{" "}
            Total: ${order.totalAmount.toFixed(2)}
          </p>

          {order.items && order.items.length > 0 && (
            <table className="order-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                </tr>
              </thead>

              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id}>
                    <td>{item.productName}</td>
                    <td>{item.quantity}</td>
                    <td>${item.subtotal.toFixed(2)}</td>
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

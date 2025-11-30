import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import OrderModal from "../modals/OrderModal";
import type { InitialData, OrderItemInput } from "../modals/OrderModal";

interface OrderItem {
  id: number;
  productId: number;
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

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    const res = await api.get<Order[]>("/orders");
    setOrders(res.data);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleCreateOrderClick = () => {
    setEditingOrder(null);
    setModalOpen(true);
  };

  const handleEditOrderClick = (order: Order) => {
    setEditingOrder(order);
    setModalOpen(true);
  };

  const handleDeleteOrder = async (orderId: number) => {
    await api.delete(`/orders/${orderId}`);
    setOrders((prev) => prev.filter((o) => o.id !== orderId));
  };

  const handleSaveOrder = async (data: {
    id?: number;
    orderDate: string;
    customerId: number;
    items: OrderItemInput[];
  }) => {
    if (data.id) {
      const res = await api.put<Order>(`/orders/${data.id}`, {
        orderDate: data.orderDate,
        customerId: data.customerId,
        items: data.items,
      });

      const updated = res.data;
      setOrders((prev) =>
        prev.map((o) => (o.id === updated.id ? updated : o))
      );
    } else {
      const res = await api.post<Order>("/orders", {
        orderDate: data.orderDate,
        customerId: data.customerId,
        items: data.items,
      });

      setOrders((prev) => [...prev, res.data]);
    }

    setModalOpen(false);
    setEditingOrder(null);
  };

  const getInitialDataForModal = (): InitialData | null => {
    if (!editingOrder) return null;

    return {
      id: editingOrder.id,
      customerId: editingOrder.customerId,
      items:
        editingOrder.items?.map((it) => ({
          productId: Number(it.productId),
          quantity: Number(it.quantity),
        })) ?? [],
    };
  };

  return (
    <div>
      <h1>Orders</h1>

      <button onClick={handleCreateOrderClick}>+ Create Order</button>

      {orders.length === 0 && <p>No orders found.</p>}

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
          <div
            style={{ cursor: "pointer" }}
            onClick={() => navigate(`/orders/${order.id}`)}
          >
            <p>
              <strong>Order #{order.id}</strong> — Date: {order.orderDate} — Total: $
              {order.totalAmount.toFixed(2)}
            </p>

            <p>
              Customer: {order.customerFirstName} {order.customerLastName}
            </p>

            {order.items && order.items.length > 0 && (
              <ul>
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.productName} — Qty: {item.quantity} — Subtotal: $
                    {item.subtotal.toFixed(2)}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div style={{ marginTop: "0.5rem", display: "flex", gap: "0.5rem" }}>
            <button onClick={() => handleEditOrderClick(order)}>Edit</button>
            <button onClick={() => handleDeleteOrder(order.id)}>Delete</button>
          </div>
        </div>
      ))}

      <OrderModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingOrder(null);
        }}
        onSave={handleSaveOrder}
        initialData={getInitialDataForModal()}
      />
    </div>
  );
}

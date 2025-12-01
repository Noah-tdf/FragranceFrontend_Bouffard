import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import OrderModal from "../modals/OrderModal";
import type { InitialData, OrderItemInput } from "../modals/OrderModal";
import "./OrdersPage.css";

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

  // 🔍 SEARCH STATE
  const [search, setSearch] = useState("");

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

  const filteredOrders = orders.filter((order) => {
    const fullName = `${order.customerFirstName} ${order.customerLastName}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  return (
    <div className="orders-page">
      <h1 className="orders-title">Orders</h1>

      {/* 🔍 SEARCH INPUT */}
      <input
        className="search-input"
        type="text"
        placeholder="Search by customer name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button className="create-btn" onClick={handleCreateOrderClick}>
        + Create Order
      </button>

      {filteredOrders.length === 0 && <p>No matching orders found.</p>}

      {filteredOrders.map((order) => (
        <div key={order.id} className="order-card">
          <div
            className="order-header"
            onClick={() => navigate(`/orders/${order.id}`)}
          >
            <p className="order-title">
              Order #{order.id} — {order.orderDate}
            </p>
            <p className="order-customer">
              Customer: {order.customerFirstName} {order.customerLastName}
            </p>

            {order.items && order.items.length > 0 && (
              <ul className="order-items">
                {order.items.map((item) => (
                  <li key={item.id}>
                    {item.productName} — Qty {item.quantity} — $
                    {item.subtotal.toFixed(2)}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="action-row">
            <button
              className="action-btn action-edit"
              onClick={() => handleEditOrderClick(order)}
            >
              Edit
            </button>

            <button
              className="action-btn action-delete"
              onClick={() => handleDeleteOrder(order.id)}
            >
              Delete
            </button>
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

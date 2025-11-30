import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api/api";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import CustomerModal from "../modals/CustomerModal";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";

const PAGE_SIZE = 5;

interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editCustomer, setEditCustomer] = useState<Customer | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  const navigate = useNavigate();

  const fetchCustomers = async () => {
    const res = await api.get<Customer[]>("/customers");
    setCustomers(res.data);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filtered = customers.filter((c) => {
    const text = `${c.firstName} ${c.lastName} ${c.email} ${c.phone}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(startIndex, startIndex + PAGE_SIZE);

  const handleAdd = () => {
    setEditCustomer(null);
    setModalOpen(true);
  };

  const handleEdit = (customer: Customer) => {
    setEditCustomer(customer);
    setModalOpen(true);
  };

  const handleSave = async (customerData: Omit<Customer, "id">) => {
    if (editCustomer) {
      await api.put(`/customers/${editCustomer.id}`, customerData);
    } else {
      await api.post("/customers", customerData);
    }
    setModalOpen(false);
    setEditCustomer(null);
    fetchCustomers();
  };

  const handleDeleteClick = (customer: Customer) => {
    setCustomerToDelete(customer);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (customerToDelete) {
      await api.delete(`/customers/${customerToDelete.id}`);
      setDeleteModalOpen(false);
      setCustomerToDelete(null);
      fetchCustomers();
    }
  };

  const handleRowClick = (customer: Customer) => {
    navigate(`/customers/${customer.id}`);
  };

  return (
    <div>
      <h1>Customers</h1>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <SearchBar
          value={search}
          onChange={(value: string) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          placeholder="Search by name, email, or phone"
        />
        <button onClick={handleAdd}>Add Customer</button>
      </div>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "1rem",
        }}
      >
        <thead>
          <tr>
            <th style={th}>Name</th>
            <th style={th}>Email</th>
            <th style={th}>Phone</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((c) => (
            <tr key={c.id}>
              <td style={td} onClick={() => handleRowClick(c)}>
                {c.firstName} {c.lastName}
              </td>
              <td style={td} onClick={() => handleRowClick(c)}>{c.email}</td>
              <td style={td} onClick={() => handleRowClick(c)}>{c.phone}</td>
              <td style={td}>
                <button onClick={() => handleEdit(c)}>Edit</button>
                <button onClick={() => handleDeleteClick(c)}>Delete</button>
              </td>
            </tr>
          ))}
          {visible.length === 0 && (
            <tr>
              <td colSpan={4} style={td}>
                No customers found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page: number) => setCurrentPage(page)}
      />

      <CustomerModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditCustomer(null);
        }}
        onSave={handleSave}
        initialData={editCustomer || undefined}
      />

      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        message={
          customerToDelete
            ? `Delete customer ${customerToDelete.firstName} ${customerToDelete.lastName}?`
            : "Delete customer?"
        }
      />
    </div>
  );
}

const th: React.CSSProperties = {
  borderBottom: "1px solid #e5e7eb",
  textAlign: "left",
  padding: "0.5rem",
};

const td: React.CSSProperties = {
  borderBottom: "1px solid #f3f4f6",
  padding: "0.5rem",
  cursor: "pointer",
};

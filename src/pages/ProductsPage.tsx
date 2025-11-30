import { useEffect, useState } from "react";
import { api } from "../api/api";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import ProductModal from "../modals/ProductModal";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";

interface ProductData {
  id?: number;
  name: string;
  brand: string;
  price: number;
  description: string;
  notes: string;
  category: string;
}

interface Product extends ProductData {
  id: number;
}

const PAGE_SIZE = 5;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [modalOpen, setModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const fetchProducts = async () => {
    const res = await api.get<Product[]>("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const filtered = products.filter((p) => {
    const text = `${p.name} ${p.brand} ${p.category} ${p.description} ${p.notes}`.toLowerCase();
    return text.includes(search.toLowerCase());
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const visible = filtered.slice(startIndex, startIndex + PAGE_SIZE);

  const handleAdd = () => {
    setEditProduct(null);
    setModalOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditProduct(product); // keep the id!
    setModalOpen(true);
  };

  const handleSave = async (data: ProductData) => {
    const payload = { ...data, price: Number(data.price) };

    // CREATE
    if (!data.id) {
      await api.post("/products", payload);
    }
    // UPDATE
    else {
      await api.put(`/products/${data.id}`, payload);
    }

    setModalOpen(false);
    setEditProduct(null);
    fetchProducts();
  };

  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      await api.delete(`/products/${productToDelete.id}`);
      setDeleteModalOpen(false);
      setProductToDelete(null);
      fetchProducts();
    }
  };

  return (
    <div>
      <h1>Products</h1>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <SearchBar
          value={search}
          onChange={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          placeholder="Search by name, brand, category, description, notes"
        />
        <button onClick={handleAdd}>Add Product</button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
        <thead>
          <tr>
            <th style={th}>Name</th>
            <th style={th}>Brand</th>
            <th style={th}>Category</th>
            <th style={th}>Price</th>
            <th style={th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {visible.map((p) => (
            <tr key={p.id}>
              <td style={td}>{p.name}</td>
              <td style={td}>{p.brand}</td>
              <td style={td}>{p.category}</td>
              <td style={td}>${p.price.toFixed(2)}</td>
              <td style={td}>
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => handleDeleteClick(p)}>Delete</button>
              </td>
            </tr>
          ))}
          {visible.length === 0 && (
            <tr>
              <td colSpan={5} style={td}>No products found.</td>
            </tr>
          )}
        </tbody>
      </table>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <ProductModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditProduct(null);
        }}
        onSave={handleSave}
        initialData={editProduct}
      />

      <ConfirmDeleteModal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        message={productToDelete ? `Delete product "${productToDelete.name}"?` : "Delete product?"}
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
};

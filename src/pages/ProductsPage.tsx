import { useEffect, useState } from "react";
import { api } from "../api/api";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import ProductModal from "../modals/ProductModal";
import ConfirmDeleteModal from "../modals/ConfirmDeleteModal";
import "./ProductsPage.css";

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
    setEditProduct(product);
    setModalOpen(true);
  };

  const handleSave = async (data: ProductData) => {
    const payload = { ...data, price: Number(data.price) };

    if (!data.id) {
      await api.post("/products", payload);
    } else {
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
    <div className="products-page">
      <h1 className="products-title">Products</h1>

      <div className="top-controls">
        <SearchBar
          value={search}
          onChange={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          placeholder="Search by name, brand, category, description, notes"
        />

        <button className="add-btn" onClick={handleAdd}>
          Add Product
        </button>
      </div>

      <table className="products-table">
        <thead>
          <tr>
            <th className="products-th">Name</th>
            <th className="products-th">Brand</th>
            <th className="products-th">Category</th>
            <th className="products-th">Price</th>
            <th className="products-th">Actions</th>
          </tr>
        </thead>

        <tbody>
          {visible.map((p) => (
            <tr key={p.id}>
              <td className="products-td">{p.name}</td>
              <td className="products-td">{p.brand}</td>
              <td className="products-td">{p.category}</td>
              <td className="products-td">${p.price.toFixed(2)}</td>
              <td className="products-td">
                <button className="action-btn action-edit" onClick={() => handleEdit(p)}>
                  Edit
                </button>

                <button className="action-btn action-delete" onClick={() => handleDeleteClick(p)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {visible.length === 0 && (
            <tr>
              <td className="products-td" colSpan={5}>
                No products found.
              </td>
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

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import CustomersPage from "./pages/CustomersPage";
import CustomerDetailsPage from "./pages/CustomerDetailsPage";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";
import OrderDetailsPage from "./pages/OrderDetailsPage";
console.log("API URL =", import.meta.env.VITE_API_URL);


function App() {
  return (
    <Router>
      <Navbar />

      <main style={{ padding: "1.5rem" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />

          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/customers/:id" element={<CustomerDetailsPage />} />

          <Route path="/products" element={<ProductsPage />} />

          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailsPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;

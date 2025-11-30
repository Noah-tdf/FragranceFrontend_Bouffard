import "./HomePage.css";

export default function HomePage() {
  return (
    <div className="home-page">
      <h1 className="home-title">Fragrance Online Shop Dashboard</h1>

      <p className="home-subtext">
        Manage customers, products, and orders — powered by your Spring Boot +
        PostgreSQL backend, deployed live in the cloud.
      </p>

      <div className="home-grid">
        <div className="home-card">
          <h2 className="card-title">👤 Customers</h2>
          <p className="card-text">
            Add, edit, search, and manage your customer database.
            View full details and order history instantly.
          </p>
        </div>

        <div className="home-card">
          <h2 className="card-title">🧴 Products</h2>
          <p className="card-text">
            Manage your fragrance collection: brands, pricing, descriptions,
            notes, and categories.
          </p>
        </div>

        <div className="home-card">
          <h2 className="card-title">📦 Orders</h2>
          <p className="card-text">
            Create new orders, edit existing ones, track quantities,
            and view complete order summaries.
          </p>
        </div>
      </div>
    </div>
  );
}

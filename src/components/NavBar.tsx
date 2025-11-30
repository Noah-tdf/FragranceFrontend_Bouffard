import { Link, useLocation } from "react-router-dom";

interface NavItem {
  to: string;
  name: string;
}

export default function Navbar() {
  const location = useLocation();

  const renderLink = ({ to, name }: NavItem) => (
    <Link
      to={to}
      style={{
        color:
          location.pathname === to ||
          location.pathname.startsWith(to)
            ? "#38bdf8"
            : "white",
        marginRight: "1rem",
        textDecoration: "none",
        fontWeight: 600,
      }}
    >
      {name}
    </Link>
  );

  return (
    <nav style={{ background: "#111827", padding: "1rem", color: "white" }}>
      {renderLink({ to: "/", name: "Home" })}
      {renderLink({ to: "/customers", name: "Customers" })}
      {renderLink({ to: "/products", name: "Products" })}
      {renderLink({ to: "/orders", name: "Orders" })}
    </nav>
  );
}

import { NavLink } from "react-router-dom";
import "./NavBar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" end className="nav-item">
        Home
      </NavLink>

      <NavLink to="/customers" className="nav-item">
        Customers
      </NavLink>

      <NavLink to="/products" className="nav-item">
        Products
      </NavLink>

      <NavLink to="/orders" className="nav-item">
        Orders
      </NavLink>
    </nav>
  );
}

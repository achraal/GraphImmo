// src/components/Navbar.tsx
import { NavLink } from "react-router-dom"

export default function Navbar() {
  return (
    <nav style={{ padding: "12px 16px", borderBottom: "1px solid #e5e7eb" }}>
      <NavLink to="/" style={{ marginRight: 12 }}>Home</NavLink>
      <NavLink to="/recherche">Recherche</NavLink>
    </nav>
  )
}

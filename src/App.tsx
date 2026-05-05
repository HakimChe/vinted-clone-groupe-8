import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

export default function App() {

  const [menuOpen, setMenuOpen] = useState(false);

  const linkClass = ({ isActive }: { isActive: boolean }) => isActive ? "font-semibold text-white" : "hover:text-teal-200";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-teal-600 text-white">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <NavLink to="/" className="text-2xl font-bold hover:text-teal-100"> Vinted Clone </NavLink>

          <button className="sm:hidden text-white text-2xl" onClick={() => setMenuOpen(!menuOpen)} > {menuOpen ? "✕" : "☰"} </button>

          <nav className="hidden sm:flex items-center gap-4 text-sm">
            <NavLink to="/" end className={linkClass}>Accueil</NavLink>
            <NavLink to="/my-articles" className={linkClass}>Mes annonces</NavLink>
            <NavLink to="/favorites" className={linkClass}>Favoris</NavLink>
            <NavLink to="/publish" className="bg-white text-teal-700 font-semibold px-4 py-1.5 rounded-full hover:bg-teal-50"> Publier </NavLink>
          </nav>
        </div>

        {menuOpen && (
          <nav className="sm:hidden flex flex-col px-4 pb-4 gap-3 text-sm">
            <NavLink to="/" end className={linkClass} onClick={() => setMenuOpen(false)}> Accueil </NavLink>
            <NavLink to="/my-articles" className={linkClass} onClick={() => setMenuOpen(false)}> Mes annonces </NavLink>
            <NavLink to="/favorites" className={linkClass} onClick={() => setMenuOpen(false)}> Favoris </NavLink>
            <NavLink to="/publish" onClick={() => setMenuOpen(false)} className="bg-white
            text-teal-700 font-semibold px-4 py-1.5 rounded-full text-center hover:bg-teal-50"> Publier </NavLink>
          </nav>
        )}
      </header>
      <main className="max-w-4xl mx-auto p-4">
        <Outlet />
      </main>
    </div>
  );}
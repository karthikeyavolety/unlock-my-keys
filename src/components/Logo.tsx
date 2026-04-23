import { Link } from "@tanstack/react-router";
import logoImg from "@/assets/logo.jpg";

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 group">
      <img
        src={logoImg}
        alt="Vaultix logo"
        className="h-9 w-9 rounded-xl object-cover shadow-md transition-transform group-hover:scale-105"
      />
      <span className="text-xl font-bold tracking-tight">Vaultix</span>
    </Link>
  );
}

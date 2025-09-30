import { Link } from 'react-router-dom';
import Logo from '../assets/logo.svg';

const Nav = () => {
  return (
    <nav className="bg-[#14001dff] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="cursor-pointer">
          <img src={Logo} alt="logo" className="h-17 w-auto" />
        </Link>

        {/* Links de navegação */}
        <div className="space-x-6">
          <Link
            to="/"
            className="hover:text-[#F06292] font-bold transition-colors cursor-pointer"
          >
            Home
          </Link>

          <Link
            to="/login"
            className="hover:text-[#F06292] font-bold transition-colors cursor-pointer"
          >
            Login
          </Link>

          <Link
            to="/cadastro-organizador"
            className="hover:text-[#F06292] font-bold transition-colors cursor-pointer"
          >
             Painel dos organizadores
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Nav;
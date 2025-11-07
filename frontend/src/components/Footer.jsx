import Logo from "../assets/logo.svg";
import { FaInstagram, FaFacebookF } from "react-icons/fa";

const SocialFooter = () => {
  return (
    <div className="bg-[#14001dff] text-white flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto px-8 py-6 gap-4">
      {/* Logo e nome - canto esquerdo */}
      <div className="flex items-center gap-3 md:justify-start justify-center w-full md:w-auto">
        <img src={Logo} alt="logo" className="h-10 w-auto" />
        <span className="text-lg font-bold">FutDelas</span>
      </div>

      {/* Redes sociais - centralizadas */}
      <div className="flex justify-center items-center gap-8 w-full md:w-auto md:absolute left-1/2 -translate-x-1/2">
        <a
          href="https://www.instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-pink-500 transition-colors"
        >
          <FaInstagram size={22} />
        </a>
        <a
          href="https://www.facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-blue-600 transition-colors"
        >
          <FaFacebookF size={22} />
        </a>
      </div>

      {/* Direitos autorais - canto direito */}
      <p className="text-gray-400 text-xs text-center md:text-right w-full md:w-auto">
        © {new Date().getFullYear()} todos os direitos reservados FutDelas
      </p>
    </div>
  );
};

export default SocialFooter;

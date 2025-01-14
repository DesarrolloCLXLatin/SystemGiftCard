import React, { useState } from 'react';
import { FaSun, FaMoon, FaChartBar, FaIdCard, FaLayerGroup, FaQrcode, FaCheckCircle, FaCreditCard, FaUsers, FaKey, FaStore, FaUser, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import '../styles/css/sidebar.css';
import logoLight from '../assets/images/logo.svg';
import logoDark from '../assets/images/logo_dark.svg';
import miniLogoLight from '../assets/images/icono.svg';
import miniLogoDark from '../assets/images/icon_dark.svg';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ role, userImage, children }) => {
  const { theme, toggleTheme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isGiftCardsOpen, setIsGiftCardsOpen] = useState(false);
  const navigate = useNavigate();

  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
  };

  const toggleGiftCards = () => {
    setIsGiftCardsOpen(!isGiftCardsOpen);
  };

  const handleSubOptionClick = (path) => {
    if (path) {
      navigate(path);
    }
  };

  const handleBlur = () => {
    setIsGiftCardsOpen(false);
  };

  const logo = theme === 'light' ? logoLight : logoDark;
  const miniLogo = theme === 'light' ? miniLogoLight : miniLogoDark;

  const adminOptions = [
    { name: 'Consulta', path: '/card/consulta', icon: <FaChartBar /> },
    { name: 'Generador de tarjeta', path: '/card/generator', icon: <FaIdCard /> },
    { name: 'Generador por Lotes', path: '/card/batch-generator', icon: <FaLayerGroup /> },
    { name: 'Generador de QR', path: '/card/qr-generator', icon: <FaQrcode /> },
    { name: 'Gift Cards', path: '/card/gift-card', icon: <FaCheckCircle /> },
    { name: 'Consumir Tarjeta', path: '/card/consume', icon: <FaCreditCard /> },
    { name: 'Beneficiarios', path: '/services/beneficiaries', icon: <FaUsers /> },
    { name: 'Permisos', path: '/services/permissions', icon: <FaKey /> },
    { name: 'Tiendas', path: '/services/stores', icon: <FaStore /> },
    { name: 'Usuarios', path: '/services/users', icon: <FaUser /> }, // Asegúrate de que esta opción tenga la ruta correcta
  ];

  return (
    <>
      <aside
        className={`sidebar-container ${isExpanded ? 'expanded' : 'collapsed'}`}
        aria-expanded={isExpanded}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div className={`sidebar ${theme}`}>
          <div className="sidebar-header">
            <div className="logo-container">
              {isExpanded ? (
                <img src={logo} alt="Logo" className="main-logo" />
              ) : (
                <img src={miniLogo} alt="Mini Logo" className="mini-logo" />
              )}
            </div>
          </div>

          {role === 'admin' && (
            <ul className="admin-options">
              {adminOptions.map((option) => (
                <li key={option.name} className="relative">
                  <div
                    className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700`}
                    onClick={() => handleSubOptionClick(option.path)}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="flex-shrink-0 icon-large">{option.icon}</span>
                      {isExpanded && (
                        <span className="text-sm font-bold">{option.name}</span>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          <button
            className="theme-toggle-button"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            <div className="icon-container">
              {theme === 'light' ? <FaMoon /> : <FaSun />}
            </div>
            {isExpanded && (
              <span className="option-text">
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </span>
            )}
          </button>
        </div>
      </aside>
      <Navbar userImage={userImage} isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      <main className={`main-content ${isExpanded ? 'content-expanded' : 'content-collapsed'}`}>
        {React.cloneElement(children, { isSidebarExpanded: isExpanded })}
      </main>
    </>
  );
};

export default Sidebar;

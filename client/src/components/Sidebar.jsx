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
    navigate(path);
  };

  const handleBlur = () => {
    setIsGiftCardsOpen(false);
  };

  const logo = theme === 'light' ? logoLight : logoDark;
  const miniLogo = theme === 'light' ? miniLogoLight : miniLogoDark;

  const adminOptions = [
    { name: 'Consulta', path: '/card/consulta', icon: <FaChartBar /> },
    { name: 'Generador de tarjeta', icon: <FaIdCard /> },
    { name: 'Generador por Lotes', icon: <FaLayerGroup /> },
    { name: 'Generador de QR', path: '/card/qr-generator', icon: <FaQrcode /> },
    {
      name: 'Gift Cards',
      icon: <FaCheckCircle />,
      hasSubOptions: true,
      subOptions: [
        { name: 'Activar', path: '/activar' },
        { name: 'Deshabilitar', path: '/deshabilitar' },
        { name: 'Desactivación personalizada', path: '/desactivacion-personalizada' },
        { name: 'Cambiar Convenio', path: '/cambiar-convenio' },
        { name: 'Cambiar tienda de Canje', path: '/cambiar-tienda-canje' }
      ]
    },
    { name: 'Consumir Tarjeta', icon: <FaCreditCard /> },
    { name: 'Beneficiarios', icon: <FaUsers /> },
    { name: 'Permisos', icon: <FaKey /> },
    { name: 'Tiendas', icon: <FaStore /> },
    { name: 'Usuarios', icon: <FaUser /> },
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
                    className={`flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                      option.hasSubOptions ? 'text-blue-600 dark:text-blue-400' : ''
                    }`}
                    onClick={() => handleSubOptionClick(option.path)}
                    onBlur={option.hasSubOptions ? handleBlur : null}
                    tabIndex={option.hasSubOptions ? 0 : null}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="flex-shrink-0 icon-large">{option.icon}</span>
                      {isExpanded && (
                        <span className="text-sm font-bold">{option.name}</span>
                      )}
                    </div>
                    {option.hasSubOptions && isExpanded && (
                      <span className="flex-shrink-0">
                        {isGiftCardsOpen ? (
                          <FaChevronUp className="w-4 h-4" />
                        ) : (
                          <FaChevronDown className="w-4 h-4" />
                        )}
                      </span>
                    )}
                  </div>
                  {option.hasSubOptions && isGiftCardsOpen && isExpanded && (
                    <ul className="bg-gray-50 dark:bg-gray-900">
                      {option.subOptions.map((subOption) => (
                        <li
                          key={subOption.name}
                          className="pl-12 pr-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={() => handleSubOptionClick(subOption.path)}
                        >
                          {subOption.name}
                        </li>
                      ))}
                    </ul>
                  )}
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

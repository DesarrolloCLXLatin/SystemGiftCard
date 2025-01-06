import React, { useState } from 'react';
import { FaSun, FaMoon, FaChartBar, FaIdCard, FaLayerGroup, FaQrcode, FaCheckCircle, FaCreditCard, FaUsers, FaKey, FaStore, FaUser } from 'react-icons/fa';
import { useTheme } from '../context/ThemeContext';
import '../styles/css/sidebar.css';
import logoLight from '../assets/images/logo.svg';
import logoDark from '../assets/images/logo_dark.svg';
import miniLogoLight from '../assets/images/icono.svg';
import miniLogoDark from '../assets/images/icon_dark.svg';
import Navbar from './Navbar';

const Sidebar = ({ role, userImage, children }) => {
  const { theme, toggleTheme } = useTheme();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMouseEnter = () => {
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    setIsExpanded(false);
  };

  const logo = theme === 'light' ? logoLight : logoDark;
  const miniLogo = theme === 'light' ? miniLogoLight : miniLogoDark;

  const adminOptions = [
    { name: 'Estadísticas', icon: <FaChartBar /> },
    { name: 'Generador de tarjeta', icon: <FaIdCard /> },
    { name: 'Generador por Lotes', icon: <FaLayerGroup /> },
    { name: 'Generador de QR', icon: <FaQrcode /> },
    { name: 'Activar Tarjeta', icon: <FaCheckCircle /> },
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
                <li key={option.name} className="sidebar-item">
                  <div className="icon-container">
                    {option.icon}
                  </div>
                  {isExpanded && (
                    <span className="option-text">{option.name}</span>
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
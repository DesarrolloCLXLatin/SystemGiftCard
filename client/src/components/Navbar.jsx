import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaUserCircle, FaCog, FaSignOutAlt, FaUser } from 'react-icons/fa';
import styles from '../styles/css/Navbar.module.css'; // Importamos el archivo de estilos CSS Modules
import { useAuth } from "../context/AuthContext";

const Navbar = ({ isExpanded }) => {
  const { user } = useAuth();
  const userImage = user ? user.profileImage : null;
  const [menuVisible, setMenuVisible] = useState(false);
  const dropdownRef = useRef(null);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setMenuVisible(false);
    }
  };

  useEffect(() => {
    if (menuVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuVisible]);

  return (
    <nav className={`${styles.navbar} ${isExpanded ? '' : styles.collapsed}`}>
      <div className={styles.navbarContent}>
        <div className={styles.navbarLeft}>
          {/* Aquí puedes agregar más elementos si es necesario */}
        </div>
        <div className={styles.navbarRight}>
          <div className={styles.userCircle} onClick={toggleMenu}>
            {userImage ? (
              <img src={userImage} alt="User" className={styles.userImage} />
            ) : (
              <FaUserCircle className={styles.userIcon} />
            )}
          </div>
          {menuVisible && (
            <div className={styles.dropdownMenu} ref={dropdownRef}>
              <ul>
                <li><a href="/profile"><FaUser className={styles.menuIcon} /> Perfil</a></li>
                <li><a href="/settings"><FaCog className={styles.menuIcon} /> Configuraciones</a></li>
                <li><a href="/logout"><FaSignOutAlt className={styles.menuIcon} /> Cerrar sesión</a></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

Navbar.propTypes = {
  isExpanded: PropTypes.bool.isRequired,
};

export default Navbar;
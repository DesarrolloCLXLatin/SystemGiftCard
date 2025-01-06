import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaUserCircle, FaCog, FaSignOutAlt, FaUser, FaInfoCircle, FaBell, FaTrash } from 'react-icons/fa';
import Swal from 'sweetalert2';
import styles from '../styles/css/Navbar.module.css'; // Importamos el archivo de estilos CSS Modules
import { useAuth } from "../context/AuthContext";

const Navbar = ({ isExpanded }) => {
  const { user } = useAuth();
  const userImage = user ? user.profileImage : null;
  const [menuVisible, setMenuVisible] = useState(false);
  const [infoVisible, setInfoVisible] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'Nueva actualización', description: 'Hay una nueva actualización disponible.', read: false },
    { id: 2, title: 'Mensaje importante', description: 'Tienes un nuevo mensaje importante.', read: false },
  ]);
  const dropdownRef = useRef(null);
  const infoRef = useRef(null);
  const notificationRef = useRef(null);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const toggleInfo = () => {
    setInfoVisible(!infoVisible);
  };

  const toggleNotification = () => {
    setNotificationVisible(!notificationVisible);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setMenuVisible(false);
    }
    if (infoRef.current && !infoRef.current.contains(event.target)) {
      setInfoVisible(false);
    }
    if (notificationRef.current && !notificationRef.current.contains(event.target)) {
      setNotificationVisible(false);
    }
  };

  const handleNotificationClick = (notification) => {
    Swal.fire({
      title: 'Notificación',
      text: `${notification.title}\n${notification.description}`,
      confirmButtonText: 'Cerrar',
    });
    setNotifications(notifications.map(n => n.id === notification.id ? { ...n, read: true } : n));
  };

  const handleDeleteNotification = (notificationId) => {
    setNotifications(notifications.filter(n => n.id !== notificationId));
  };

  useEffect(() => {
    if (menuVisible || infoVisible || notificationVisible) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuVisible, infoVisible, notificationVisible]);

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <nav className={`${styles.navbar} ${isExpanded ? '' : styles.collapsed}`}>
      <div className={styles.navbarContent}>
        <div className={styles.navbarLeft}>
          {/* Aquí puedes agregar más elementos si es necesario */}
        </div>
        <div className={styles.navbarRight}>
          <div className={`${styles.iconContainer} ${styles.notification}`} onClick={toggleNotification} ref={notificationRef}>
            <FaBell className={styles.icon} />
            <span className={`${styles.notificationBadge} ${unreadNotificationsCount === 0 ? styles.hidden : ''}`}>{unreadNotificationsCount}</span>
            {notificationVisible && (
              <div className={`${styles.dropdownMenu} ${styles.notificationDropdown}`}>
                <ul>
                  {notifications.map(notification => (
                    <li
                      key={notification.id}
                      className={`${styles.notificationItem} ${notification.read ? styles.read : ''}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <span className={styles.notificationItemIcon}>🔔</span>
                      <div className={styles.notificationItemContent}>
                        <div className={`${styles.notificationItemTitle} ${notification.read ? '' : styles.bold}`}>{notification.title}</div>
                        <div className={styles.notificationItemDescription}>{notification.description}</div>
                      </div>
                      <button
                        className={styles.deleteButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteNotification(notification.id);
                        }}
                      >
                        <FaTrash />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className={`${styles.iconContainer} ${styles.info}`} onClick={toggleInfo} ref={infoRef}>
            <FaInfoCircle className={styles.icon} />
            {infoVisible && (
              <div className={styles.dropdownMenu}>
                <ul>
                  <li><a href="/info1">1</a></li>
                  <li><a href="/info2">2</a></li>
                </ul>
              </div>
            )}
          </div>
          <div className={styles.userCircle} onClick={toggleMenu} ref={dropdownRef}>
            {userImage ? (
              <img src={userImage} alt="User" className={styles.userImage} />
            ) : (
              <FaUserCircle className={styles.userIcon} />
            )}
          </div>
          {menuVisible && (
            <div className={styles.dropdownMenu}>
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

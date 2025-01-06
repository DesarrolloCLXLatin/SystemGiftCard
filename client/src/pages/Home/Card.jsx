import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js';
import styles from '../../styles/css/AdminHome.module.css'; // Importamos el archivo de estilos CSS Modules

const Card = ({ title, value, percentage, currency = false }) => {
  const [open, setOpen] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [{
          label: 'Sales',
          data: [65, 59, 80, 81, 56, 55, 40],
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          fill: false,
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }, []);

  const toggleMenu = () => {
    setOpen(!open);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <h2 className={styles.cardTitle}>{title}</h2>
        <div className={styles.menuButton} onClick={toggleMenu}>
          <button className={styles.menuButtonToggle} aria-haspopup="true" aria-expanded={open}>
            <span>Menu</span>
            <svg className={styles.menuButtonIcon} viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="2"></circle>
              <circle cx="10" cy="16" r="2"></circle>
              <circle cx="22" cy="16" r="2"></circle>
            </svg>
          </button>
          {open && (
            <div className={styles.menuDropdown} onClick={closeMenu}>
              <ul>
                <li><a href="#0" onClick={closeMenu}>Option 1</a></li>
                <li><a href="#0" onClick={closeMenu}>Option 2</a></li>
                <li><a href="#0" onClick={closeMenu}>Remove</a></li>
              </ul>
            </div>
          )}
        </div>
      </div>
      <div className={styles.cardContent}>Sales</div>
      <div className={styles.cardValueContainer}>
        <div className={styles.cardValue}>{currency ? `$${value}` : value}</div>
        <div className={styles.cardPercentage}>{percentage}</div>
      </div>
      <div className={styles.cardChart}>
        <canvas ref={chartRef} width="474" height="128" style={{ display: 'block', boxSizing: 'border-box', height: '128px', width: '474px' }}></canvas>
      </div>
    </div>
  );
};

export default Card;

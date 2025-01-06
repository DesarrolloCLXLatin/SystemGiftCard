import { useState } from 'react';
import authService from '../../services/authService';
import Swal from 'sweetalert2';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/images/logo.png';
import "../../styles/css/forgot-password.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Hook para la navegación

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authService.forgotPassword({ email });
      setLoading(false);
      Swal.fire({
        icon: 'success',
        title: 'El correo ha sido enviado.',
        text: 'Por favor, revise su bandeja de entrada.',
      });
      setEmail('');

      // Redirigir al usuario al login después de 2 segundos
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
    } catch (error) {
      setLoading(false);
      Swal.fire({
        icon: 'error',
        title: 'Ups!',
        text: 'Envío de correo fallido. Por favor, inténtelo de nuevo.',
      });
      console.error('Forgot password failed', error);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-header">
        <img src={logo} alt="Logo" className="forgot-password-logo" />
        <h1 className="header-title">¿Olvidaste tu contraseña?</h1>
      </div>
      <div className="forgot-password-form-container">
        <div className="forgot-password-form">
          <form onSubmit={handleSubmit} className="form">
            <div className="input-container">
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo de recuperación"
                required
                className="input"
              />
            </div>
            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="spinner-path" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </>
              ) : (
                'Enviar'
              )}
            </button>
          </form>
          <div className="text-center">
            <Link to="/auth/login">Regresar a inicio de sesión</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import authService from '../../services/authService';
import Swal from 'sweetalert2';
import logo from "../../assets/images/logo.png";
import "../../styles/css/reset-password.css";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();
  const { token } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden.',
      });
      return;
    }
    try {
      await authService.resetPassword(token, newPassword);
      Swal.fire({
        icon: 'success',
        title: 'Contraseña restablecida',
        text: 'Tu contraseña ha sido restablecida exitosamente. Redirigiendo al inicio de sesión...',
        timer: 2000
      });
      setTimeout(() => {
        navigate('/auth/login');
      }, 2000);
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No se pudo restablecer la contraseña. Por favor, inténtelo de nuevo.',
      });
    }
  };

  return (
    <div className="reset-password-container">
      <div className="reset-password-box">
        <div className="reset-password-header">
          <img src={logo} alt="Logo" className="reset-password-logo" />
          <h1 className="reset-password-title">Restablecer contraseña</h1>
        </div>
        <form className="reset-password-form" onSubmit={handleSubmit}>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Nueva contraseña"
            required
            className="input"
          />
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirmar contraseña"
            required
            className="input"
          />
          <button type="submit" className="submit-button">Restablecer contraseña</button>
        </form>
        <div className="text-center">
          <Link to="/auth/login" className="text-link">Regresar a inicio de sesión</Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
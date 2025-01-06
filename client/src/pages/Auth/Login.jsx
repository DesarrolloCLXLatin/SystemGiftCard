import { useState, useEffect } from "react";
import { AlertCircle, Lock, User, Eye, EyeOff } from "lucide-react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.png";
import PropTypes from 'prop-types';
import "../../styles/css/login.css";
import '../../styles/css/buttons.css';
import { useAuth } from "../../context/AuthContext";

const Login = ({ onLogin = () => {} }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedPassword = localStorage.getItem("password");
    if (storedUsername && storedPassword) {
      setUsername(storedUsername);
      setPassword(storedPassword);
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (username) {
        fetchProfileImage(username);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [username]);

  const fetchProfileImage = async (username) => {
    try {
      const response = await fetch("http://localhost:5000/api/user/find_user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();
      if (response.ok) {
        setProfileImage(data.photo_url !== "NULL" ? data.photo_url : data.avatar_url);
      } else {
        setProfileImage("");
      }
    } catch (error) {
      console.error(error);
      setProfileImage("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);

      if (rememberMe) {
        localStorage.setItem("username", username);
        localStorage.setItem("password", password);
      } else {
        localStorage.removeItem("username");
        localStorage.removeItem("password");
      }

      // Incluir la imagen del usuario en los datos de autenticación
      login({ ...data, profileImage });

      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "Has iniciado sesión correctamente.",
        showConfirmButton: false,
        timer: 2000,
        willClose: () => {
          switch (data.role) {
            case 'admin':
              navigate('/home/home-admin');
              break;
            default:
              navigate('/');
              break;
          }
        }
      });

    } catch (error) {
      console.error(error);
      setError("Credenciales inválidas. Por favor, intenta nuevamente.");
      Swal.fire({
        icon: "error",
        title: "Ups!!!",
        text: "Credenciales inválidas. Por favor, intenta nuevamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleBlur = () => {
    if (username) {
      fetchProfileImage(username);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <img src={logo} alt="Logo" className="login-logo" />
          <h1 className="login-title">Ingresar</h1>
        </div>

        {profileImage && (
          <div className="profile-preview">
            <img src={profileImage} alt="Profile" className="profile-image" />
          </div>
        )}

        {error && (
          <div className="error-message">
            <AlertCircle className="error-icon" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <User className="input-icon" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Usuario"
              required
              className="input-field"
              onKeyPress={handleKeyPress}
              onBlur={handleBlur}
              aria-label="Usuario"
            />
          </div>

          <div className="input-group">
            <Lock className="input-icon" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Contraseña"
              required
              className="input-field"
              onKeyPress={handleKeyPress}
              aria-label="Contraseña"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="toggle-password-button"
              aria-label="Toggle Password Visibility"
            >
              {showPassword ? <EyeOff className="input-icon eye-icon" /> : <Eye className="input-icon eye-icon" />}
            </button>
          </div>

          <div className="remember-me">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="checkbox"
              aria-label="Recordar"
            />
            <label htmlFor="rememberMe" className="checkbox-label">
              Recordar
            </label>

            <button
              type="button"
              onClick={() => (window.location.href = "/auth/register")}
              className="remember-me-button"
            >
              ¿No tienes cuenta?
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`submit-button ${isLoading ? "loading" : ""}`}
          >
            {isLoading ? "Ingresando..." : "Ingresar"}
          </button>
        </form>

        <div className="login-actions">
          <button
            type="button"
            onClick={() => (window.location.href = "/auth/forgot-password")}
            className="action-button"
          >
            ¿Olvidaste tu contraseña?
          </button>

          <div className="login-footer">
            <p>&copy; 2025 <strong>Multimax Store C.A</strong>. Todos los derechos reservados.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

Login.propTypes = {
  onLogin: PropTypes.func,
};

export default Login;

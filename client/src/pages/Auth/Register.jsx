import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import 'animate.css';
import Swal from "sweetalert2";
import { Info } from "lucide-react"; // Importar el icono de información
import { Tooltip as ReactTooltip } from 'react-tooltip'; // Importar Tooltip específico
import logo from "../../assets/images/logo.png";
import authService from '../../services/authService';
import storeService from '../../services/storeService'; 
import avatar1 from '../../assets/avatars/avatar-1.png';
import avatar2 from '../../assets/avatars/avatar-2.png';
import avatar3 from '../../assets/avatars/avatar-3.png';
import avatar4 from '../../assets/avatars/avatar-4.png';
import avatar5 from '../../assets/avatars/avatar-5.png';
import avatar6 from '../../assets/avatars/avatar-6.png';
import '../../styles/css/register.css';
import '../../styles/css/buttons.css';

const Register = () => {
  const [step, setStep] = useState(1);
  const [username, setUsername] = useState('');
  const [isUsernameAvailable, setIsUsernameAvailable] = useState(true);
  const [firstname, setFirstname] = useState('');
  const [lastname, setLastname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [store, setStore] = useState('');
  const [stores, setStores] = useState([]); 
  const [photo, setPhoto] = useState('');
  const [avatar, setAvatar] = useState('');
  const [imagePreviewUrl, setImagePreviewUrl] = useState('');
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const storeData = await storeService.getStores();
        setStores(storeData);
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };

    fetchStores();
  }, []);

  const isPasswordValid = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    return regex.test(password);
  };

  const isEmailValid = (email) => {
    const regex = /^[\w-\.]+@(multimaxstore\.com|clxsamsung\.com)$/;
    return regex.test(email);
  };

  const handleUsernameChange = async (e) => {
    const newUsername = e.target.value;
    setUsername(newUsername);

    if (newUsername && newUsername.length >= 4) {
      try {
        const response = await authService.checkUsername(newUsername);
        setIsUsernameAvailable(!response.exists);
      } catch (error) {
        console.error('Error checking username availability', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (username.length < 4) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El nombre de usuario debe tener al menos 4 caracteres',
      });
      return;
    }
    if (password !== confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Las contraseñas no coinciden',
      });
      return;
    }
    if (!isPasswordValid(password)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, una letra minúscula y un carácter especial.',
      });
      return;
    }
    if (!username || !firstname || !lastname || !email || !store || (!photo && !avatar)) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor, completa todos los campos requeridos',
      });
      return;
    }
    if (!isUsernameAvailable) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El nombre de usuario no está disponible',
      });
      return;
    }
    const userData = {
      username,
      firstname,
      lastname,
      email,
      password,
      phone: phone || null, // Si el campo phone está vacío, se asigna null
      store,
      photo,
      avatar,
    };
    try {
      await authService.register(userData);
      Swal.fire({
        icon: 'success',
        title: 'Registro Exitoso',
        text: 'Te has registrado exitosamente',
      });
      navigate('/auth/login');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'El registro ha fallado';
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: errorMessage,
      });
      console.error('Registration failed', error);
    }
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!firstname || !lastname || !email) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por favor, completa todos los campos requeridos',
        });
        return;
      }
      if (!isEmailValid(email)) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El correo electrónico debe pertenecer a multimaxstore.com o clxsamsung.com',
        });
        return;
      }
    }
    if (step === 2) {
      if (!username || username.length < 4 || !password || !confirmPassword || !store) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Por favor, completa todos los campos requeridos y asegúrate de que el nombre de usuario tenga al menos 4 caracteres',
        });
        return;
      }
      if (!isPasswordValid(password)) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, una letra minúscula y un carácter especial.',
        });
        return;
      }
      if (!isUsernameAvailable) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'El nombre de usuario no está disponible',
        });
        return;
      }
    }
    setStep(step + 1);
  };

  const handlePreviousStep = () => setStep(step - 1);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
    setAvatar('');
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAvatarChange = (avatar) => {
    setAvatar(avatar);
    setPhoto(null);
    setImagePreviewUrl(avatar);
    setShowAvatarModal(false);
  };

  return (
    <div className="register-container">
      <div className='register-header'>
        <img src={logo} alt="Logo" className="login-logo" />
        <h1 className="login-title">Regístrate</h1>
      </div>
      <form onSubmit={handleSubmit} className="register-form">
        {step === 1 && (
          <>
            <input
              type="text"
              value={firstname}
              onChange={(e) => setFirstname(e.target.value)}
              placeholder="Nombre (Requerido)"
              aria-label="Nombre"
              required
            />
            <input
              type="text"
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
              placeholder="Apellido (Requerido)"
              aria-label="Apellido"
              required
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email (Requerido)"
              aria-label="Email"
              required
            />
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Teléfono"
              aria-label="Teléfono"
            />
            <button type="button" onClick={handleNextStep} className="btn-primary w-full">
              Siguiente
            </button>
          </>
        )}
        {step === 2 && (
          <>
            <div className="input-group">
              <input
                type="text"
                value={username}
                onChange={handleUsernameChange}
                placeholder="Usuario (Requerido)"
                aria-label="Usuario"
                required
              />
              {!isUsernameAvailable && (
                <p style={{ color: 'red', fontSize: '12px', marginTop: '-15px', marginBottom: '10px' }}>
                  El nombre de usuario no está disponible
                </p>
              )}
              {isUsernameAvailable && username && (
                <p style={{ color: 'green', fontSize: '12px', marginTop: '-15px', marginBottom: '10px' }}>
                  Usuario disponible
                </p>
              )}
            </div>
            <div className="input-group">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña (Requerido)"
                aria-label="Contraseña"
                required
              />
              <Info data-tip data-for="passwordTip" className="info-icon" />
              <ReactTooltip id="passwordTip" place="top" effect="solid">
                La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, una letra minúscula y un carácter especial.
              </ReactTooltip>
            </div>
            <div className="input-group">
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirmar Contraseña (Requerido)"
                aria-label="Confirmar Contraseña"
                required
              />
              <Info data-tip data-for="confirmPasswordTip" className="info-icon" />
              <ReactTooltip id="confirmPasswordTip" place="top" effect="solid">
                La contraseña debe tener al menos 8 caracteres, incluir una letra mayúscula, una letra minúscula y un carácter especial.
              </ReactTooltip>
            </div>
            <select
              value={store}
              onChange={(e) => setStore(e.target.value)}
              aria-label="Selecciona la tienda (Requerido)"
              required
            >
              <option value="" disabled>
                Selecciona la tienda
              </option>
              {stores.map((store) => (
                <option key={store.id} value={store.id}>
                  {store.name}
                </option>
              ))}
            </select>
            <div className="button-group">
              <button type="button" onClick={handlePreviousStep} className="btn-secondary">
                Atrás
              </button>
              <button type="button" onClick={handleNextStep} className="btn-primary">
                Siguiente
              </button>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <div className="file-input-container">
              <input type="file" onChange={handlePhotoChange} id="photo" aria-label="Subir foto" />
              <label htmlFor="photo" className="file-input-label">Subir Foto</label>
            </div>
            <button
              type="button"
              onClick={() => setShowAvatarModal(true)}
              className="btn-primary w-full mb-4"
            >
              Elige un Avatar
            </button>
            {showAvatarModal && (
              <div className="avatar-modal">
                <div className="avatar-modal-content">
                  <h3>Elige un Avatar</h3>
                  <div className="avatar-grid">
                    <img
                      src={avatar1}
                      alt="Avatar 1"
                      className={`${avatar === avatar1 ? 'selected' : ''}`}
                      onClick={() => handleAvatarChange(avatar1)}
                    />
                    <img
                      src={avatar2}
                      alt="Avatar 2"
                      className={`${avatar === avatar2 ? 'selected' : ''}`}
                      onClick={() => handleAvatarChange(avatar2)}
                    />
                    <img
                      src={avatar3}
                      alt="Avatar 3"
                      className={`${avatar === avatar3 ? 'selected' : ''}`}
                      onClick={() => handleAvatarChange(avatar3)}
                    />
                    <img
                      src={avatar4}
                      alt="Avatar 4"
                      className={`${avatar === avatar4 ? 'selected' : ''}`}
                      onClick={() => handleAvatarChange(avatar4)}
                    />
                    <img
                      src={avatar5}
                      alt="Avatar 5"
                      className={`${avatar === avatar5 ? 'selected' : ''}`}
                      onClick={() => handleAvatarChange(avatar5)}
                    />
                    <img
                      src={avatar6}
                      alt="Avatar 6"
                      className={`${avatar === avatar6 ? 'selected' : ''}`}
                      onClick={() => handleAvatarChange(avatar6)}
                    />
                  </div>
                  <button onClick={() => setShowAvatarModal(false)} className="btn-danger">
                    Cerrar
                  </button>
                </div>
              </div>
            )}
            {imagePreviewUrl && (
              <div className="avatar-preview">
                <img src={imagePreviewUrl} alt="Avatar Preview" />
              </div>
            )}
            <div className="avatar-buttons">
              <button type="button" onClick={handlePreviousStep} className="btn-secondary">
                Atrás
              </button>
              <button type="submit" className="btn-success">
                Registrarse
              </button>
            </div>
          </>
        )}
      </form>
      <div className="text-center">
        <Link to="/auth/login" className="text-indigo-600 hover:text-indigo-500">
          Regresar a inicio de sesión
        </Link>
      </div>
    </div>
  );
};

export default Register;
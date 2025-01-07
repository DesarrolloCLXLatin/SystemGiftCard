// src/App.jsx

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import MyRoutes from './routers/Routes';
import './styles/css/style.css';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <MyRoutes />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
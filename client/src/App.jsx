// src/App.jsx

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import MyRoutes from './routers/Routes';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import './styles/css/style.css';

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <TooltipProvider>
          <MyRoutes />
        </TooltipProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
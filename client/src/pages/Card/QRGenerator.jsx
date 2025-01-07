import React, { useState, useRef } from 'react';
import { QRCode } from 'react-qr-code';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Card,
  CardContent,
  Box,
  Stack,
  CircularProgress,
  Tooltip,
  IconButton
} from '@mui/material';
import {
  QrCode,
  FileDownload,
  Print,
  Clear,
  Add,
  Warning,
  Refresh,
  Info
} from '@mui/icons-material';
import '../../styles/css/QRGenerator.css';
import { useTheme } from '../../context/ThemeContext'; // Importa el hook useTheme

const MotionContainer = motion(Container);
const MotionPaper = motion(Paper);
const MotionCard = motion(Card);

const QRGenerator = () => {
  const { theme } = useTheme(); // Obtén el tema actual
  const [formData, setFormData] = useState({
    amount: '',
    quantity: 1,
    assignedTo: '',
    store: '',
    prefix: '',
    size: 128,
    errorLevel: 'M'
  });

  const [generatedCodes, setGeneratedCodes] = useState([]);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [totalQRCodes, setTotalQRCodes] = useState(0);
  const [generationTime, setGenerationTime] = useState(0);
  const qrContainerRef = useRef(null);

  const validateForm = () => {
    if (!formData.amount || formData.amount <= 0) {
      setError('El monto debe ser mayor a 0');
      return false;
    }
    if (!formData.quantity || formData.quantity <= 0) {
      setError('La cantidad debe ser mayor a 0');
      return false;
    }
    if (!formData.assignedTo.trim()) {
      setError('La asignación es requerida');
      return false;
    }
    if (!formData.store.trim()) {
      setError('La tienda es requerida');
      return false;
    }
    return true;
  };

  const generateSerial = () => {
    const prefix = formData.prefix ? `${formData.prefix}-` : '';
    const timestamp = new Date().getTime().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `${prefix}${timestamp}-${random}`.toUpperCase();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const generateQRCodes = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    setError('');

    const startTime = performance.now();

    try {
      const newCodes = Array.from({ length: Number(formData.quantity) }, () => {
        const serial = generateSerial();
        return {
          serial,
          amount: formData.amount,
          assignedTo: formData.assignedTo,
          store: formData.store,
          createdAt: new Date().toISOString(),
          qrContent: JSON.stringify({
            serial,
            amount: formData.amount,
            store: formData.store,
            createdAt: new Date().toISOString()
          })
        };
      });

      setGeneratedCodes(newCodes);
      setTotalQRCodes(prev => prev + newCodes.length);
      const endTime = performance.now();
      setGenerationTime((endTime - startTime) / 1000);
    } catch (err) {
      setError('Error al generar los códigos QR');
    } finally {
      setIsLoading(false);
    }
  };

  const exportToExcel = () => {
    try {
      const worksheet = XLSX.utils.json_to_sheet(
        generatedCodes.map(code => ({
          Serial: code.serial,
          'Fecha de Creación': new Date(code.createdAt).toLocaleDateString(),
          Monto: `$${Number(code.amount).toLocaleString()}`,
          Asignado: code.assignedTo,
          Tienda: code.store
        }))
      );

      const colWidths = [
        { wch: 25 }, // Serial
        { wch: 15 }, // Fecha
        { wch: 12 }, // Monto
        { wch: 20 }, // Asignado
        { wch: 20 }, // Tienda
      ];
      worksheet['!cols'] = colWidths;

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "QR Codes");

      const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
      const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(data, `qr-codes-${new Date().toISOString().split('T')[0]}.xlsx`);
    } catch (err) {
      setError('Error al exportar a Excel');
    }
  };

  const printQRCodes = () => {
    const printWindow = window.open('', '_blank');
    const codesHTML = generatedCodes.map(code => `
      <div style="page-break-inside: avoid; margin: 20px; text-align: center;">
        <img src="data:image/svg+xml,${encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${formData.size} ${formData.size}">
            ${document.getElementById(`qr-${code.serial}`).innerHTML}
          </svg>`
        )}" width="${formData.size}" height="${formData.size}" />
        <p style="margin: 10px 0; font-family: Arial, sans-serif;">
          <strong>Serial:</strong> ${code.serial}<br>
          <strong>Monto:</strong> $${Number(code.amount).toLocaleString()}<br>
          <strong>Tienda:</strong> ${code.store}
        </p>
      </div>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>QR Codes - ${new Date().toLocaleDateString()}</title>
          <style>
            @media print {
              body { margin: 0; }
              @page { size: auto; margin: 0mm; }
            }
          </style>
        </head>
        <body>
          ${codesHTML}
          <script>
            window.onload = () => {
              window.print();
              window.close();
            }
          </script>
        </body>
      </html>
    `);
  };

  const clearForm = () => {
    setFormData({
      amount: '',
      quantity: 1,
      assignedTo: '',
      store: '',
      prefix: '',
      size: 128,
      errorLevel: 'M'
    });
    setGeneratedCodes([]);
    setError('');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };

  return (
    <MotionContainer
      maxWidth="lg"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={`qr-generator-container${theme}`}
      style={{ overflowX: 'hidden', marginTop: '4rem' }}
    >
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <MotionPaper
            elevation={3}
            className={`form-container${theme}`}
            variants={cardVariants}
          >
            <Box sx={{ p: 4 }}>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  mb: 4,
                  background: '#90caf9',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontWeight: 'bold'
                }}
              >
                Generador de Códigos QR
              </Typography>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                  >
                    <Alert
                      severity="error"
                      sx={{
                        mb: 3,
                        animation: 'shake 0.5s ease-in-out'
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Warning />
                        <Typography>{error}</Typography>
                      </Stack>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <Stack spacing={3}>
                {[
                  { name: 'amount', label: 'Monto', type: 'number' },
                  { name: 'quantity', label: 'Cantidad a Generar', type: 'number' },
                  { name: 'assignedTo', label: 'Asignación', type: 'text' },
                  { name: 'store', label: 'Tienda', type: 'text' },
                  { name: 'prefix', label: 'Prefijo del Serial (Opcional)', type: 'text' }
                ].map((field, index) => (
                  <motion.div
                    key={field.name}
                    className="input-field"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <TextField
                      fullWidth
                      label={field.label}
                      name={field.name}
                      type={field.type}
                      value={formData[field.name]}
                      onChange={handleInputChange}
                      InputProps={{
                        sx: {
                          borderRadius: '50px',
                          '&:hover': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: 'primary.main',
                            }
                          }
                        }
                      }}
                    />
                  </motion.div>
                ))}

                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <FormControl fullWidth>
                    <InputLabel>Tamaño del QR</InputLabel>
                    <Select
                      value={formData.size}
                      label="Tamaño del QR"
                      name="size"
                      onChange={handleInputChange}
                      sx={{ borderRadius: '50px' }}
                    >
                      <MenuItem value={128}>Pequeño (128px)</MenuItem>
                      <MenuItem value={256}>Mediano (256px)</MenuItem>
                      <MenuItem value={512}>Grande (512px)</MenuItem>
                    </Select>
                  </FormControl>
                </motion.div>

                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    onClick={generateQRCodes}
                    disabled={isLoading}
                    className="action-button"
                    sx={{
                      flexGrow: 1,
                      background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                      boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                      borderRadius: '50px'
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      <>
                        <Add sx={{ mr: 1 }} />
                        Generar Códigos QR
                      </>
                    )}
                  </Button>

                  <Tooltip title="Limpiar formulario">
                    <Button
                      variant="outlined"
                      onClick={clearForm}
                      className="action-button"
                      sx={{ borderRadius: '50px' }}
                    >
                      <Clear />
                    </Button>
                  </Tooltip>
                </Stack>
              </Stack>
            </Box>
          </MotionPaper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Stack spacing={2}>
            <MotionCard
              className="stats-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                QRs: {totalQRCodes}
                </Typography>
                <Typography variant="body1">
                  Total de QR generados
                </Typography>
              </CardContent>
            </MotionCard>

            <MotionCard
              className="stats-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2 }}>
                {generationTime.toFixed(2)} segundos
                </Typography>
                <Typography variant="body1">
                  Tiempo de generación del último lote
                </Typography>
              </CardContent>
            </MotionCard>

            <AnimatePresence>
              {generatedCodes.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <Stack spacing={3}>
                    <Stack direction="row" spacing={2}>
                      <Button
                        variant="contained"
                        onClick={exportToExcel}
                        className="action-button"
                        sx={{
                          flexGrow: 1,
                          background: 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)',
                          borderRadius: '50px'
                        }}
                      >
                        <FileDownload sx={{ mr: 1 }} />
                        Exportar a Excel
                      </Button>

                      <Button
                        variant="contained"
                        onClick={printQRCodes}
                        className="action-button"
                        sx={{
                          flexGrow: 1,
                          background: 'linear-gradient(45deg, #9C27B0 30%, #BA68C8 90%)',
                          borderRadius: '50px'
                        }}
                      >
                        <Print sx={{ mr: 1 }} />
                        Imprimir QRs
                      </Button>
                    </Stack>

                    <Box
                      ref={qrContainerRef}
                      className="scroll-container"
                      sx={{
                        maxHeight: 600,
                        overflow: 'auto',
                        '& > div': { mb: 2 }
                      }}
                    >
                      {generatedCodes.map((code, index) => (
                        <MotionCard
                          key={code.serial}
                          className="qr-card"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <CardContent>
                            <Grid container justifyContent="space-between" sx={{ mb: 2 }}>
                              <Grid item>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                  Serial: {code.serial}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {new Date(code.createdAt).toLocaleDateString()}
                                </Typography>
                              </Grid>
                              <Grid item>
                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                  ${Number(code.amount).toLocaleString()}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {code.store}
                                </Typography>
                              </Grid>
                            </Grid>

                            <Box
                              className="qr-code-container"
                              id={`qr-${code.serial}`}
                              sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                p: 2,
                                borderRadius: 2,
                              }}
                            >
                              <QRCode
                                value={code.qrContent}
                                size={Number(formData.size)}
                                level={formData.errorLevel}
                              />
                            </Box>
                          </CardContent>
                        </MotionCard>
                      ))}
                    </Box>
                  </Stack>
                </motion.div>
              )}
            </AnimatePresence>
          </Stack>
        </Grid>
      </Grid>
    </MotionContainer>
  );
};

export default QRGenerator;

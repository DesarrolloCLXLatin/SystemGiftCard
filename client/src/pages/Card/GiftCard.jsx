import React, { useState, useCallback } from 'react';
import { Card, CardContent, Modal, Box, Typography, Button, TextField, MenuItem, Select } from '@mui/material';
import Swal from 'sweetalert2';
import cardActivate from '../../assets/images/activar.svg';
import cardDesactivate from '../../assets/images/inhabilitar.svg';
import cardReassign from '../../assets/images/reasignar.svg';
import cardRelocate from '../../assets/images/reubicar.svg';
import styles from '../../styles/css/giftcard.module.css'; // Asegúrate de que la ruta sea correcta

const CARD_ACTIONS = {
  ACTIVATE: 'activate',
  DISABLE: 'disable',
  REASSIGN: 'reassign',
  RELOCATE: 'relocate',
};

const CARDS_CONFIG = [
  {
    title: 'Activar',
    image: cardActivate,
    action: CARD_ACTIONS.ACTIVATE,
    modalTitle: 'Activar Tarjeta',
    modalDescription: 'Ingrese el código de activación'
  },
  {
    title: 'Inhabilitar',
    image: cardDesactivate,
    action: CARD_ACTIONS.DISABLE,
    modalTitle: 'Inhabilitar Tarjeta',
    modalDescription: 'Ingrese el código que deseas inhabilitar'
  },
  {
    title: 'Re-Asignar',
    image: cardReassign,
    action: CARD_ACTIONS.REASSIGN,
    modalTitle: 'Re-Asignar Tarjeta',
    modalDescription: 'Ingrese el código que deseas re-asignar?'
  },
  {
    title: 'Re-Ubicar',
    image: cardRelocate,
    action: CARD_ACTIONS.RELOCATE,
    modalTitle: 'Re-Ubicar Tarjeta',
    modalDescription: 'Ingrese el código que deseas re-ubicar'
  },
];

const ConfirmationModal = ({ open, onClose, title, description, onActivate, onCustomizeAndActivate }) => {
  const [serial, setSerial] = useState('');

  const handleSerialChange = (event) => {
    setSerial(event.target.value);
  };

  const handleActivate = () => {
    onClose(); // Cerrar la modal
    Swal.fire({
      title: 'Confirmar Activación',
      text: `¿Deseas activar la tarjeta con el serial ${serial}?`,
      icon: 'question',
      confirmButtonText: 'Sí, activar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        onActivate(serial);
        Swal.fire({
          title: 'Activación Completada',
          text: `La tarjeta con el serial ${serial} ha sido activada exitosamente.`,
          icon: 'success',
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  };

  const handleCustomizeAndActivate = () => {
    onClose(); // Cerrar la modal
    Swal.fire({
      title: 'Confirmar Personalización y Activación',
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Nombre">
        <input id="swal-input2" class="swal2-input" placeholder="Número de Identidad">
      `,
      focusConfirm: false,
      preConfirm: () => {
        const name = document.getElementById('swal-input1').value;
        const idNumber = document.getElementById('swal-input2').value;
        if (!name || !idNumber) {
          Swal.showValidationMessage(`Por favor, ingresa el nombre y el número de identidad`);
          return false;
        }
        return { name, idNumber };
      },
      confirmButtonText: 'Sí, personalizar y activar',
    }).then((result) => {
      if (result.isConfirmed) {
        const { name, idNumber } = result.value;
        onCustomizeAndActivate(serial, name, idNumber);
        Swal.fire({
          title: 'Personalización y Activación Completadas',
          text: `La tarjeta con el serial ${serial} ha sido personalizada y activada exitosamente.`,
          icon: 'success',
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      className={styles.giftCardModal}
    >
      <Box className={styles.giftCardModalBox}>
        <Typography
          id="modal-title"
          variant="h6"
          component="h2"
          className={styles.giftCardModalTitle}
        >
          {title}
        </Typography>
        <Typography
          id="modal-description"
          className={styles.giftCardModalDescription}
        >
          {description}
        </Typography>
        <TextField
          label="Serial"
          value={serial}
          onChange={handleSerialChange}
          fullWidth
          margin="normal"
        />
        <Box className={styles.modalActions}>
          <Button onClick={handleActivate} variant="contained" color="success">
            Activar
          </Button>
          <Button onClick={handleCustomizeAndActivate} variant="contained" color="info">
            Personalizar y Activar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

const DisableModal = ({ open, onClose, title, description, onDisable }) => {
  const [serial, setSerial] = useState('');

  const handleSerialChange = (event) => {
    setSerial(event.target.value);
  };

  const handleDisable = () => {
    onClose(); // Cerrar la modal
    Swal.fire({
      title: 'Confirmar Inhabilitación',
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Motivo de la inhabilitación">
      `,
      focusConfirm: false,
      preConfirm: () => {
        const reason = document.getElementById('swal-input1').value;
        if (!reason) {
          Swal.showValidationMessage(`Por favor, ingresa el motivo de la inhabilitación`);
          return false;
        }
        return reason;
      },
      confirmButtonText: 'Sí, inhabilitar',
    }).then((result) => {
      if (result.isConfirmed) {
        const reason = result.value;
        onDisable(serial, reason);
        Swal.fire({
          title: 'Inhabilitación Completada',
          text: `La tarjeta con el serial ${serial} ha sido inhabilitada exitosamente.`,
          icon: 'success',
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      className={styles.giftCardModal}
    >
      <Box className={styles.giftCardModalBox}>
        <Typography
          id="modal-title"
          variant="h6"
          component="h2"
          className={styles.giftCardModalTitle}
        >
          {title}
        </Typography>
        <Typography
          id="modal-description"
          className={styles.giftCardModalDescription}
        >
          {description}
        </Typography>
        <TextField
          label="Serial"
          value={serial}
          onChange={handleSerialChange}
          fullWidth
          margin="normal"
        />
        <Box className={styles.modalActions}>
          <Button onClick={handleDisable} variant="contained" color="primary">
            Inhabilitar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

const ReassignModal = ({ open, onClose, title, description, currentAssignment, beneficiaries, onReassign }) => {
  const [serial, setSerial] = useState('');
  const [selectedBeneficiary, setSelectedBeneficiary] = useState('');

  const handleSerialChange = (event) => {
    setSerial(event.target.value);
  };

  const handleBeneficiaryChange = (event) => {
    setSelectedBeneficiary(event.target.value);
  };

  const handleReassign = () => {
    onClose(); // Cerrar la modal
    Swal.fire({
      title: 'Confirmar Re-Asignación',
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Motivo de la re-asignación">
      `,
      focusConfirm: false,
      preConfirm: () => {
        const reason = document.getElementById('swal-input1').value;
        if (!reason) {
          Swal.showValidationMessage(`Por favor, ingresa el motivo de la re-asignación`);
          return false;
        }
        return reason;
      },
      confirmButtonText: 'Sí, re-asignar',
    }).then((result) => {
      if (result.isConfirmed) {
        const reason = result.value;
        onReassign(serial, selectedBeneficiary, reason);
        Swal.fire({
          title: 'Re-Asignación Completada',
          text: `La tarjeta con el serial ${serial} ha sido re-asignada exitosamente.`,
          icon: 'success',
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      className={styles.giftCardModal}
    >
      <Box className={styles.giftCardModalBox}>
        <Typography
          id="modal-title"
          variant="h6"
          component="h2"
          className={styles.giftCardModalTitle}
        >
          {title}
        </Typography>
        <Typography
          id="modal-description"
          className={styles.giftCardModalDescription}
        >
          {description}
        </Typography>
        <TextField
          label="Serial"
          value={serial}
          onChange={handleSerialChange}
          fullWidth
          margin="normal"
        />
        <Box display="flex" alignItems="center" marginBottom={2}>
          <TextField
            label="Asignación Actual"
            value={currentAssignment}
            InputProps={{
              readOnly: true,
            }}
            fullWidth
            margin="normal"
          />
          <Typography variant="h6" style={{ margin: '0 10px' }}>→</Typography>
          <Select
            value={selectedBeneficiary}
            onChange={handleBeneficiaryChange}
            fullWidth
            margin="normal"
          >
            {beneficiaries.map((beneficiary, index) => (
              <MenuItem key={index} value={beneficiary}>
                {beneficiary}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box className={styles.modalActions}>
          <Button onClick={handleReassign} variant="contained" color="primary">
            Re-Asignar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

const RelocateModal = ({ open, onClose, title, description, currentStore, stores, onRelocate }) => {
  const [serial, setSerial] = useState('');
  const [selectedStore, setSelectedStore] = useState('');

  const handleSerialChange = (event) => {
    setSerial(event.target.value);
  };

  const handleStoreChange = (event) => {
    setSelectedStore(event.target.value);
  };

  const handleRelocate = () => {
    onClose(); // Cerrar la modal
    Swal.fire({
      title: 'Confirmar Re-Ubicación',
      html: `
        <input id="swal-input1" class="swal2-input" placeholder="Motivo de la re-ubicación">
      `,
      focusConfirm: false,
      preConfirm: () => {
        const reason = document.getElementById('swal-input1').value;
        if (!reason) {
          Swal.showValidationMessage(`Por favor, ingresa el motivo de la re-ubicación`);
          return false;
        }
        return reason;
      },
      confirmButtonText: 'Sí, re-ubicar',
    }).then((result) => {
      if (result.isConfirmed) {
        const reason = result.value;
        onRelocate(serial, selectedStore, reason);
        Swal.fire({
          title: 'Re-Ubicación Completada',
          text: `La tarjeta con el serial ${serial} ha sido re-ubicada exitosamente.`,
          icon: 'success',
          showConfirmButton: false,
          timer: 2000,
        });
      }
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      className={styles.giftCardModal}
    >
      <Box className={styles.giftCardModalBox}>
        <Typography
          id="modal-title"
          variant="h6"
          component="h2"
          className={styles.giftCardModalTitle}
        >
          {title}
        </Typography>
        <Typography
          id="modal-description"
          className={styles.giftCardModalDescription}
        >
          {description}
        </Typography>
        <TextField
          label="Serial"
          value={serial}
          onChange={handleSerialChange}
          fullWidth
          margin="normal"
        />
        <Box display="flex" alignItems="center" marginBottom={2}>
          <TextField
            label="Tienda Actual"
            value={currentStore}
            InputProps={{
              readOnly: true,
            }}
            fullWidth
            margin="normal"
          />
          <Typography variant="h6" style={{ margin: '0 10px' }}>→</Typography>
          <Select
            value={selectedStore}
            onChange={handleStoreChange}
            fullWidth
            margin="normal"
          >
            {stores.map((store, index) => (
              <MenuItem key={index} value={store}>
                {store}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box className={styles.modalActions}>
          <Button onClick={handleRelocate} variant="contained" color="primary">
            Re-Ubicar
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

const GiftCardItem = ({ title, image, onActionClick }) => (
  <Card className={styles.giftCard}>
    <CardContent className={styles.giftCardContent}>
      <img
        src={image}
        alt={title}
        className={styles.giftCardImage}
        onClick={onActionClick}
        style={{ cursor: 'pointer' }} // Añadir estilo para indicar que es clicable
      />
    </CardContent>
  </Card>
);

const GiftCard = () => {
  const [selectedAction, setSelectedAction] = useState(null);

  const handleOpenModal = useCallback((action) => {
    setSelectedAction(action);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedAction(null);
  }, []);

  const handleActivate = useCallback((serial) => {
    console.log(`Activated card with serial: ${serial}`);
  }, []);

  const handleCustomizeAndActivate = useCallback((serial, name, idNumber) => {
    console.log(`Customized and activated card with serial: ${serial}, name: ${name}, idNumber: ${idNumber}`);
  }, []);

  const handleDisable = useCallback((serial, reason) => {
    console.log(`Disabled card with serial: ${serial}, reason: ${reason}`);
  }, []);

  const handleReassign = useCallback((serial, beneficiary, reason) => {
    console.log(`Reassigned card with serial: ${serial} to beneficiary: ${beneficiary}, reason: ${reason}`);
  }, []);

  const handleRelocate = useCallback((serial, store, reason) => {
    console.log(`Relocated card with serial: ${serial} to store: ${store}, reason: ${reason}`);
  }, []);

  const selectedCard = CARDS_CONFIG.find(card => card.action === selectedAction);

  // Datos de prueba para la asignación actual y los beneficiarios
  const currentAssignment = 'Beneficiario Actual';
  const beneficiaries = ['Beneficiario 1', 'Beneficiario 2', 'Beneficiario 3'];

  // Datos de prueba para la tienda actual y las tiendas
  const currentStore = 'Tienda Actual';
  const stores = ['Tienda 1', 'Tienda 2', 'Tienda 3'];

  return (
    <div className={styles.giftCardContainer}>
        <div className={styles.giftCardHeader}>
      <Typography variant="h4" component="h1" gutterBottom>
        Centro de Acciones
      </Typography>
      <Typography variant="h2" gutterBottom>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Acciones Generales
          </p>
      </Typography>
      </div>

      <div className={styles.giftCardGrid}>
      {CARDS_CONFIG.map((card) => (
        <GiftCardItem
          key={card.action}
          title={card.title}
          image={card.image}
          onActionClick={() => handleOpenModal(card.action)}
        />
      ))}

      {selectedAction === CARD_ACTIONS.ACTIVATE && (
        <ConfirmationModal
          open={Boolean(selectedAction)}
          onClose={handleCloseModal}
          title={selectedCard?.modalTitle}
          description={selectedCard?.modalDescription}
          onActivate={handleActivate}
          onCustomizeAndActivate={handleCustomizeAndActivate}
        />
      )}

      {selectedAction === CARD_ACTIONS.DISABLE && (
        <DisableModal
          open={Boolean(selectedAction)}
          onClose={handleCloseModal}
          title={selectedCard?.modalTitle}
          description={selectedCard?.modalDescription}
          onDisable={handleDisable}
        />
      )}

      {selectedAction === CARD_ACTIONS.REASSIGN && (
        <ReassignModal
          open={Boolean(selectedAction)}
          onClose={handleCloseModal}
          title={selectedCard?.modalTitle}
          description={selectedCard?.modalDescription}
          currentAssignment={currentAssignment}
          beneficiaries={beneficiaries}
          onReassign={handleReassign}
        />
      )}

      {selectedAction === CARD_ACTIONS.RELOCATE && (
        <RelocateModal
          open={Boolean(selectedAction)}
          onClose={handleCloseModal}
          title={selectedCard?.modalTitle}
          description={selectedCard?.modalDescription}
          currentStore={currentStore}
          stores={stores}
          onRelocate={handleRelocate}
        />
      )}
      </div>
    </div>
  );
};

export default GiftCard;

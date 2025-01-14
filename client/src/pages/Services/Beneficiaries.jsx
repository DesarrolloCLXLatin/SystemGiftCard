import React, { useState } from 'react';
import { Search, Plus, Trash2, UserX, Award, Users, Edit2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Swal from 'sweetalert2';
import '../../styles/css/beneficiaries.css'; // Importa el archivo CSS
import CustomSwitch from './CustomSwitch';

const StatusBadge = ({ status }) => {
  const styles = {
    active: 'bg-green-100 text-green-800 hover:bg-green-200',
    disabled: 'bg-red-100 text-red-800 hover:bg-red-200'
  };

  return (
    <Badge variant="outline" className={`beneficiaries-status-badge ${styles[status]}`}>
      {status === 'active' ? 'Activo' : 'Deshabilitado'}
    </Badge>
  );
};

const BeneficiaryTable = ({
  beneficiaries,
  title,
  icon: Icon,
  iconColor,
  showActions = false,
  showStatus = false,
  className = ""
}) => (
  <Card className={`beneficiaries-card h-full ${className}`}>
    <CardHeader>
      <div className="flex items-center gap-2">
        <Icon className={`${iconColor} h-6 w-6`} />
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </div>
    </CardHeader>
    <CardContent>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Nombre</TableHead>
            <TableHead className="font-semibold text-center">Asignaciones</TableHead>
            {showStatus && <TableHead className="font-semibold">Estado</TableHead>}
            {showActions && <TableHead className="font-semibold">Acciones</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {beneficiaries.length > 0 ? (
            beneficiaries.map((beneficiary) => (
              <TableRow key={beneficiary.id}>
                <TableCell>{beneficiary.name}</TableCell>
                <TableCell className="text-center">{beneficiary.assignments}</TableCell>
                {showStatus && (
                  <TableCell>
                    <StatusBadge status={beneficiary.status} />
                  </TableCell>
                )}
                {showActions && (
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-blue-600 hover:text-blue-900 hover:bg-blue-50"
                        onClick={() => handleEditBeneficiary(beneficiary)}
                      >
                        <Edit2 size={18} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-600 hover:text-red-900 hover:bg-red-50"
                        onClick={() => handleDeleteBeneficiary(beneficiary)}
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={showActions ? 4 : 2} className="text-center text-gray-500">
                No hay beneficiarios disponibles
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </CardContent>
  </Card>
);

function Beneficiaries() {
  const [searchTerm, setSearchTerm] = useState('');
  const [beneficiaries, setBeneficiaries] = useState([
    { id: 1, name: 'Seniat', assignments: 5, status: 'active' },
    { id: 2, name: 'Sudeban', assignments: 8, status: 'active' },
    { id: 3, name: 'Bancon de Venezuela', assignments: 12, status: 'disabled' },
    { id: 4, name: 'Tesoreria Nacional', assignments: 6, status: 'disabled' },
    { id: 5, name: 'Vicepresidencia', assignments: 4, status: 'active' },
  ]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [disabledCurrentPage, setDisabledCurrentPage] = useState(1);

  const handleAddBeneficiary = async () => {
    const result = await Swal.fire({
      title: 'Añadir Beneficiario',
      html: `
        <input
          type="text"
          id="name"
          class="swal2-input"
          placeholder="Nombre del beneficiario"
        >
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#d33',
      focusConfirm: false,
      preConfirm: () => {
        const name = document.getElementById('name').value;
        if (!name) {
          Swal.showValidationMessage('Por favor ingrese un nombre');
          return false;
        }
        return name;
      }
    });

    if (result.isConfirmed) {
      const newBeneficiary = {
        id: beneficiaries.length + 1,
        name: result.value,
        assignments: 0,
        status: 'active'
      };

      setBeneficiaries([...beneficiaries, newBeneficiary]);

      Swal.fire({
        icon: 'success',
        title: 'Beneficiario agregado',
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  const handleEditBeneficiary = async (beneficiary) => {
    const result = await Swal.fire({
      title: 'Editar Beneficiario',
      html: `
        <input
          type="text"
          id="name"
          class="swal2-input"
          placeholder="Nombre del beneficiario"
          value="${beneficiary.name}"
        >
      `,
      showCancelButton: true,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#d33',
      focusConfirm: false,
      preConfirm: () => {
        const name = document.getElementById('name').value;
        if (!name) {
          Swal.showValidationMessage('Por favor ingrese un nombre');
          return false;
        }
        return name;
      }
    });

    if (result.isConfirmed) {
      setBeneficiaries(beneficiaries.map(b =>
        b.id === beneficiary.id ? { ...b, name: result.value } : b
      ));

      Swal.fire({
        icon: 'success',
        title: 'Beneficiario actualizado',
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  const handleDeleteBeneficiary = async (beneficiary) => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Deseas eliminar a ${beneficiary.name}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3b82f6',
    });

    if (result.isConfirmed) {
      setBeneficiaries(beneficiaries.filter(b => b.id !== beneficiary.id));

      Swal.fire({
        icon: 'success',
        title: 'Beneficiario eliminado',
        showConfirmButton: false,
        timer: 1500
      });
    }
  };

  const handleToggleStatus = (beneficiary) => {
    setBeneficiaries(beneficiaries.map(b =>
      b.id === beneficiary.id
        ? { ...b, status: b.status === 'active' ? 'disabled' : 'active' }
        : b
    ));
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset to the first page when searching
  };

  const filteredBeneficiaries = beneficiaries.filter(b =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeBeneficiaries = beneficiaries.filter(b => b.status === 'active');
  const disabledBeneficiaries = beneficiaries.filter(b => b.status === 'disabled');
  const topBeneficiaries = [...activeBeneficiaries]
    .sort((a, b) => b.assignments - a.assignments)
    .slice(0, 5);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBeneficiaries = filteredBeneficiaries.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleItemsPerPageChange = (event) => {
    setItemsPerPage(parseInt(event.target.value, 10));
    setCurrentPage(1); // Reset to the first page when changing items per page
  };

  const handleDisabledPageChange = (pageNumber) => setDisabledCurrentPage(pageNumber);

  const disabledIndexOfLastItem = disabledCurrentPage * 3;
  const disabledIndexOfFirstItem = disabledIndexOfLastItem - 3;
  const currentDisabledBeneficiaries = disabledBeneficiaries.slice(disabledIndexOfFirstItem, disabledIndexOfLastItem);

  return (
    <div className="beneficiaries-container min-h-screen p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-900">Gestión de Beneficiarios</h1>

        {/* Grid para las dos tablas superiores */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BeneficiaryTable
            beneficiaries={topBeneficiaries}
            title="Beneficiarios con Más Asignaciones"
            icon={Award}
            iconColor="text-yellow-500"
            className="beneficiaries-card shadow-lg hover:shadow-xl transition-shadow duration-200"
          />

          <Card className="beneficiaries-card h-full shadow-lg hover:shadow-xl transition-shadow duration-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <UserX className="text-red-500 h-6 w-6" />
                <CardTitle className="text-lg font-semibold">Beneficiarios Deshabilitados</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Nombre</TableHead>
                    <TableHead className="font-semibold text-center">Asignaciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentDisabledBeneficiaries.length > 0 ? (
                    currentDisabledBeneficiaries.map((beneficiary) => (
                      <TableRow key={beneficiary.id}>
                        <TableCell>{beneficiary.name}</TableCell>
                        <TableCell className="text-center">{beneficiary.assignments}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2} className="text-center text-gray-500">
                        No hay beneficiarios disponibles
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <div className="flex justify-center mt-4">
                {Array.from({ length: Math.ceil(disabledBeneficiaries.length / 3) }, (_, i) => (
                  <Button
                    key={i}
                    onClick={() => handleDisabledPageChange(i + 1)}
                    className={`mx-1 pagination-button ${disabledCurrentPage === i + 1 ? 'active' : ''}`}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabla principal de beneficiarios */}
        <Card className="beneficiaries-main-card shadow-xl">
          <CardHeader>
            <div className="flex flex-col space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Users className="text-blue-500 h-6 w-6" />
                  <CardTitle>Lista de Beneficiarios</CardTitle>
                </div>
                <Button
                  onClick={handleAddBeneficiary}
                  className="beneficiaries-add-button bg-blue-600 hover:bg-blue-700 text-white shadow-lg transition-all duration-200 ease-in-out transform hover:scale-105"
                >
                  <Plus size={20} className="mr-2" />
                  Añadir Beneficiario
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <Input
                  type="text"
                  placeholder="Buscar beneficiario..."
                  className="pl-10 w-full md:w-96 shadow-sm"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <div className="flex items-center gap-2">
                <label htmlFor="itemsPerPage">Mostrar</label>
                <select
                  id="itemsPerPage"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                  className="border rounded px-2 py-1"
                >
                  {[5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
                <span>resultados por página</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold">Nombre</TableHead>
                    <TableHead className="font-semibold text-center">Asignaciones</TableHead>
                    <TableHead className="font-semibold">Estado</TableHead>
                    <TableHead className="font-semibold">Acciones</TableHead>
                    <TableHead className="font-semibold text-center">Habilitar/Deshabilitar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentBeneficiaries.map((beneficiary) => (
                    <TableRow key={beneficiary.id} className="hover:bg-gray-50">
                      <TableCell>{beneficiary.name}</TableCell>
                      <TableCell className="text-center">{beneficiary.assignments}</TableCell>
                      <TableCell>
                        <StatusBadge status={beneficiary.status} />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-blue-600 hover:text-blue-900 hover:bg-blue-50"
                            onClick={() => handleEditBeneficiary(beneficiary)}
                          >
                            <Edit2 size={18} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-600 hover:text-red-900 hover:bg-red-50"
                            onClick={() => handleDeleteBeneficiary(beneficiary)}
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <CustomSwitch
                          checked={beneficiary.status === 'active'}
                          onCheckedChange={() => handleToggleStatus(beneficiary)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-center mt-4">
              {Array.from({ length: Math.ceil(filteredBeneficiaries.length / itemsPerPage) }, (_, i) => (
                <Button
                  key={i}
                  onClick={() => paginate(i + 1)}
                  className={`mx-1 pagination-button ${currentPage === i + 1 ? 'active' : ''}`}
                >
                  {i + 1}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Beneficiaries;

import React, { useState } from 'react';
import { Users, Shield, UserCog, Pencil, Trash2 } from 'lucide-react';
import '../../styles/css/permissions.css';
import { useTheme } from '../../context/ThemeContext';

function Permissions() {
  const { theme } = useTheme();

  const [permissions, setPermissions] = useState([
    { id: 1, name: 'read:users', description: 'Ver usuarios' },
    { id: 2, name: 'write:users', description: 'Crear/Editar usuarios' },
    { id: 3, name: 'delete:users', description: 'Eliminar usuarios' },
    { id: 4, name: 'manage:roles', description: 'Gestionar roles' },
    { id: 5, name: 'read:reports', description: 'Ver reportes' },
    { id: 6, name: 'write:reports', description: 'Crear/Editar reportes' },
    { id: 7, name: 'delete:reports', description: 'Eliminar reportes' },
    { id: 8, name: 'manage:settings', description: 'Gestionar configuraciones' },
  ]);

  const [roles, setRoles] = useState([
    { id: 1, name: 'Administrador', permissions: [1, 2, 3, 4, 5, 6, 7, 8] },
    { id: 2, name: 'Editor', permissions: [1, 2, 5, 6] },
    { id: 3, name: 'Lector', permissions: [1, 5] },
  ]);

  const [users, setUsers] = useState([
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', role: 1, active: true },
    { id: 2, name: 'María García', email: 'maria@example.com', role: 2, active: true },
    { id: 3, name: 'Carlos López', email: 'carlos@example.com', role: 3, active: true },
  ]);

  const [activeTab, setActiveTab] = useState('users');
  const [editingUser, setEditingUser] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [editingPermission, setEditingPermission] = useState(null);

  const getRoleName = (roleId) => {
    return roles.find(role => role.id === roleId)?.name || 'Sin rol';
  };

  const getPermissionsForRole = (roleId) => {
    const role = roles.find(r => r.id === roleId);
    return role?.permissions.map(pId =>
      permissions.find(p => p.id === pId)?.name
    ).join(', ') || 'Sin permisos';
  };

  const getPermissionsForUser = (userId) => {
    const user = users.find(u => u.id === userId);
    const role = roles.find(r => r.id === user.role);
    return role?.permissions.map(pId =>
      permissions.find(p => p.id === pId)?.name
    ).join(', ') || 'Sin permisos';
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  const handleSaveUser = (updatedUser) => {
    setUsers(users.map(user => user.id === updatedUser.id ? updatedUser : user));
    setEditingUser(null);
  };

  const handleEditRole = (role) => {
    setEditingRole(role);
  };

  const handleSaveRole = (updatedRole) => {
    setRoles(roles.map(role => role.id === updatedRole.id ? updatedRole : role));
    setEditingRole(null);
  };

  const handleEditPermission = (permission) => {
    setEditingPermission(permission);
  };

  const handleSavePermission = (updatedPermission) => {
    setPermissions(permissions.map(p => p.id === updatedPermission.id ? updatedPermission : p));
    setEditingPermission(null);
  };

  const handleAddPermission = (newPermission) => {
    setPermissions([...permissions, { ...newPermission, id: permissions.length + 1 }]);
  };

  const handleDeletePermission = (permissionId) => {
    setPermissions(permissions.filter(p => p.id !== permissionId));
  };

  return (
    <div className={`permissions-container ${theme}`}>
      {/* Header */}
      <div className="permissions-header">
        <div className="permissions-header-content">
          <h1 className="permissions-title">Sistema de Gestión de Permisos</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="permissions-main">
        {/* Tabs */}
        <div className="permissions-tabs">
          <nav className="permissions-nav">
            <button
              onClick={() => setActiveTab('users')}
              className={`permissions-tab ${activeTab === 'users' ? 'active' : ''}`}
            >
              <Users className="permissions-icon" />
              Usuarios
            </button>
            <button
              onClick={() => setActiveTab('permissions')}
              className={`permissions-tab ${activeTab === 'permissions' ? 'active' : ''}`}
            >
              <Shield className="permissions-icon" />
              Permisos
            </button>
            <button
              onClick={() => setActiveTab('roles')}
              className={`permissions-tab ${activeTab === 'roles' ? 'active' : ''}`}
            >
              <UserCog className="permissions-icon" />
              Roles
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="permissions-content">
          {activeTab === 'users' && (
            <div className="permissions-table">
              <table>
                <thead>
                  <tr>
                    <th>Usuario</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Permisos</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{getRoleName(user.role)}</td>
                      <td>{getPermissionsForUser(user.id)}</td>
                      <td>
                        <span className={`permissions-status ${user.active ? 'active' : 'inactive'}`}>
                          {user.active ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => handleEditUser(user)} className="permissions-edit-button">
                          <Pencil />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {editingUser && (
                <div className="permissions-form">
                  <h2>Editar Usuario</h2>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveUser(editingUser);
                  }}>
                    <div className="permissions-form-group">
                      <label>Nombre</label>
                      <input
                        type="text"
                        value={editingUser.name}
                        onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                      />
                    </div>
                    <div className="permissions-form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        value={editingUser.email}
                        onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                      />
                    </div>
                    <div className="permissions-form-group">
                      <label>Rol</label>
                      <select
                        value={editingUser.role}
                        onChange={(e) => setEditingUser({ ...editingUser, role: parseInt(e.target.value) })}
                      >
                        {roles.map(role => (
                          <option key={role.id} value={role.id}>{role.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="permissions-form-group">
                      <label>Estado</label>
                      <select
                        value={editingUser.active}
                        onChange={(e) => setEditingUser({ ...editingUser, active: e.target.value === 'true' })}
                      >
                        <option value={true}>Activo</option>
                        <option value={false}>Inactivo</option>
                      </select>
                    </div>
                    <button type="submit" className="permissions-save-button">
                      Guardar
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {activeTab === 'permissions' && (
            <div className="permissions-table">
              <table>
                <thead>
                  <tr>
                    <th>Permiso</th>
                    <th>Descripción</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {permissions.map((permission) => (
                    <tr key={permission.id}>
                      <td>{permission.name}</td>
                      <td>{permission.description}</td>
                      <td>
                        <button onClick={() => handleEditPermission(permission)} className="permissions-edit-button">
                          <Pencil />
                        </button>
                        <button onClick={() => handleDeletePermission(permission.id)} className="permissions-delete-button">
                          <Trash2 />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {editingPermission && (
                <div className="permissions-form">
                  <h2>Editar Permiso</h2>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleSavePermission(editingPermission);
                  }}>
                    <div className="permissions-form-group">
                      <label>Nombre</label>
                      <input
                        type="text"
                        value={editingPermission.name}
                        onChange={(e) => setEditingPermission({ ...editingPermission, name: e.target.value })}
                      />
                    </div>
                    <div className="permissions-form-group">
                      <label>Descripción</label>
                      <input
                        type="text"
                        value={editingPermission.description}
                        onChange={(e) => setEditingPermission({ ...editingPermission, description: e.target.value })}
                      />
                    </div>
                    <button type="submit" className="permissions-save-button">
                      Guardar
                    </button>
                  </form>
                </div>
              )}
              <div className="permissions-form">
                <h2>Agregar Permiso</h2>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const newPermission = {
                    name: e.target.name.value,
                    description: e.target.description.value,
                  };
                  handleAddPermission(newPermission);
                  e.target.reset();
                }}>
                  <div className="permissions-form-group">
                    <label>Nombre</label>
                    <input
                      type="text"
                      name="name"
                    />
                  </div>
                  <div className="permissions-form-group">
                    <label>Descripción</label>
                    <input
                      type="text"
                      name="description"
                    />
                  </div>
                  <button type="submit" className="permissions-save-button">
                    Agregar
                  </button>
                </form>
              </div>
            </div>
          )}

          {activeTab === 'roles' && (
            <div className="permissions-table">
              <table>
                <thead>
                  <tr>
                    <th>Rol</th>
                    <th>Permisos</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role) => (
                    <tr key={role.id}>
                      <td>{role.name}</td>
                      <td>{getPermissionsForRole(role.id)}</td>
                      <td>
                        <button onClick={() => handleEditRole(role)} className="permissions-edit-button">
                          <Pencil />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {editingRole && (
                <div className="permissions-form">
                  <h2>Editar Rol</h2>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveRole(editingRole);
                  }}>
                    <div className="permissions-form-group">
                      <label>Nombre</label>
                      <input
                        type="text"
                        value={editingRole.name}
                        onChange={(e) => setEditingRole({ ...editingRole, name: e.target.value })}
                      />
                    </div>
                    <div className="permissions-form-group">
                      <label>Permisos</label>
                      <select
                        multiple
                        value={editingRole.permissions}
                        onChange={(e) => setEditingRole({ ...editingRole, permissions: Array.from(e.target.selectedOptions, option => parseInt(option.value)) })}
                      >
                        {permissions.map(permission => (
                          <option key={permission.id} value={permission.id}>{permission.name}</option>
                        ))}
                      </select>
                    </div>
                    <button type="submit" className="permissions-save-button">
                      Guardar
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Permissions;

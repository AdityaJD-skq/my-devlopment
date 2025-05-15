import { useEffect, useState } from 'react';
import useAuthStore from '../../store/authStore';
import RoleBadge from '../../components/RoleBadge';
import ProtectedRoute from '../../components/ProtectedRoute';
import { HiSearch, HiPlus, HiFilter, HiRefresh, HiTrash, HiPencil, HiEye } from 'react-icons/hi';
import { Link } from 'react-router-dom';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  registrationDate: string;
  isConfirmed: boolean;
}

const roles = ['Developer', 'Admin', 'Teacher', 'Student'];

export default function UserManagementPage() {
  const { token, user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Check if current user can modify a given user based on role hierarchy
  const canModifyUser = (targetUser: User) => {
    if (!currentUser) return false;
    
    // Developer can modify anyone
    if (currentUser.role === 'Developer') return true;
    
    // Admin can modify anyone except Developer
    if (currentUser.role === 'Admin' && targetUser.role !== 'Developer') return true;
    
    return false;
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (roleFilter) params.append('role', roleFilter);
      if (statusFilter) params.append('isActive', statusFilter);
      if (searchQuery) params.append('search', searchQuery);
      
      const res = await fetch(`/api/admin/users?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [token, roleFilter, statusFilter]);

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}/role`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ role: newRole })
      });
      
      if (res.ok) {
        setUsers(users => users.map(u => 
          u._id === id ? { ...u, role: newRole } : u
        ));
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to update role');
      }
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  const handleStatusChange = async (id: string, isActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json', 
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ isActive })
      });
      
      if (res.ok) {
        setUsers(users => users.map(u => 
          u._id === id ? { ...u, isActive } : u
        ));
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDeleteUser = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.ok) {
        setUsers(users => users.filter(u => u._id !== id));
        setShowDeleteModal(false);
        setSelectedUser(null);
      } else {
        const error = await res.json();
        alert(error.message || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers();
  };

  return (
    <ProtectedRoute allowedRoles={['Developer', 'Admin']}>
      <div className="max-w-7xl mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">User Management</h1>
          
          {currentUser?.role === 'Developer' && (
            <Link 
              to="/admin/users/create" 
              className="btn btn-primary flex items-center"
            >
              <HiPlus className="mr-1" /> Add User
            </Link>
          )}
        </div>
        
        {/* Filters and Search */}
        <div className="card p-4 mb-6">
          <form onSubmit={handleSearch} className="flex flex-wrap gap-4 items-end">
            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <select 
                value={roleFilter} 
                onChange={e => setRoleFilter(e.target.value)} 
                className="select w-full sm:w-auto"
              >
                <option value="">All Roles</option>
                {roles.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <select 
                value={statusFilter} 
                onChange={e => setStatusFilter(e.target.value)} 
                className="select w-full sm:w-auto"
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            
            <div className="flex-grow">
              <label className="block text-sm font-medium mb-1">Search</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name or email"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="input pr-10 w-full"
                />
                <button 
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <HiSearch className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <button 
              type="button"
              onClick={fetchUsers}
              className="flex items-center px-3 py-2 text-sm border rounded-md hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              <HiRefresh className="h-4 w-4 mr-1" /> Refresh
            </button>
          </form>
        </div>
        
        {/* Users Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700/50 text-left">
                    <th className="p-3">Name</th>
                    <th className="p-3">Email</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Registered</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length > 0 ? (
                    users.map(user => (
                      <tr 
                        key={user._id} 
                        className={`border-t dark:border-gray-700 ${!user.isActive ? 'bg-gray-50 dark:bg-gray-800/50 text-gray-400' : ''}`}
                      >
                        <td className="p-3">{user.name}</td>
                        <td className="p-3">
                          {user.email}
                          {!user.isConfirmed && (
                            <span className="ml-2 badge badge-yellow">Unconfirmed</span>
                          )}
                        </td>
                        <td className="p-3"><RoleBadge role={user.role} /></td>
                        <td className="p-3">{new Date(user.registrationDate).toLocaleDateString()}</td>
                        <td className="p-3">
                          <span className={`badge ${user.isActive ? 'badge-green' : 'badge-red'}`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Link 
                              to={`/admin/users/${user._id}`} 
                              className="p-1 text-gray-500 hover:text-primary-600" 
                              title="View Details"
                            >
                              <HiEye className="h-5 w-5" />
                            </Link>
                            
                            {canModifyUser(user) && (
                              <>
                                <div className="relative">
                                  <select
                                    value={user.role}
                                    onChange={e => handleRoleChange(user._id, e.target.value)}
                                    className="select select-sm py-0 pl-2 pr-6 text-xs"
                                    disabled={user.role === 'Developer' && currentUser?.role !== 'Developer'}
                                  >
                                    {roles.map(r => (
                                      <option 
                                        key={r} 
                                        value={r}
                                        disabled={r === 'Developer' && currentUser?.role !== 'Developer'}
                                      >
                                        {r}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                                
                                <button
                                  className={`p-1 ${user.isActive ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'}`}
                                  onClick={() => handleStatusChange(user._id, !user.isActive)}
                                  title={user.isActive ? 'Deactivate User' : 'Activate User'}
                                >
                                  {user.isActive ? 'Deactivate' : 'Activate'}
                                </button>
                                
                                {currentUser?.role === 'Developer' && (
                                  <button
                                    className="p-1 text-red-500 hover:text-red-700"
                                    onClick={() => {
                                      setSelectedUser(user);
                                      setShowDeleteModal(true);
                                    }}
                                    title="Delete User"
                                  >
                                    <HiTrash className="h-5 w-5" />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-4 text-center text-gray-500">
                        No users found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
        
        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full">
              <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
              <p className="mb-4">
                Are you sure you want to delete the user <span className="font-semibold">{selectedUser.name}</span>?
                This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  className="px-4 py-2 border rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedUser(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  onClick={() => handleDeleteUser(selectedUser._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 
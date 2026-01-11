import React, { useState } from 'react';
import { useAuth, SUPER_ADMIN_EMAIL } from '../context/AuthContext';
import { UserRole } from '../types';
import { ShieldCheck, User as UserIcon, CheckCircle, XCircle, Search, KeyRound, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Users = () => {
  const { usersList, updateUser, deleteUser, isAdmin, user: currentUser, adminUpdatePassword } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');

  // Protect route
  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const filteredUsers = usersList.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    if (confirm(`Вы уверены, что хотите изменить роль пользователя на ${newRole}?`)) {
        updateUser(userId, { role: newRole });
    }
  };

  const toggleVerification = (userId: string, currentStatus: boolean | undefined) => {
    updateUser(userId, { isVerified: !currentStatus });
  };

  const handleChangePassword = (userId: string, userName: string) => {
      const newPass = prompt(`Введите новый пароль для пользователя ${userName}:`);
      if (newPass) {
          if (newPass.length < 6) {
              alert('Пароль должен быть не менее 6 символов');
              return;
          }
          adminUpdatePassword(userId, newPass);
          alert('Пароль успешно изменен');
      }
  };

  const handleDeleteUser = (userId: string, userName: string) => {
      if (confirm(`ВНИМАНИЕ: Вы уверены, что хотите удалить пользователя ${userName}? Это действие необратимо.`)) {
          deleteUser(userId);
      }
  };

  const isSuperAdmin = currentUser?.email === SUPER_ADMIN_EMAIL;

  if (!isAdmin) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Управление участниками</h2>
          <p className="text-slate-500 text-sm">Всего зарегистрировано: {usersList.length} чел.</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Поиск по имени или email..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Пользователь</th>
                <th className="px-6 py-4">Роль</th>
                <th className="px-6 py-4">Статус</th>
                <th className="px-6 py-4">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map(u => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center overflow-hidden">
                        {u.avatarUrl ? <img src={u.avatarUrl} alt={u.name} /> : <UserIcon className="text-slate-500"/>}
                      </div>
                      <div>
                        <div className="font-medium text-slate-800 flex items-center gap-1">
                          {u.name}
                          {u.id === currentUser?.id && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded ml-1">Вы</span>}
                        </div>
                        <div className="text-xs text-slate-500">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select 
                      value={u.role}
                      onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                      className="text-sm border border-slate-200 rounded px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                      // Disable if user is editing themselves AND they are NOT the super admin
                      disabled={u.id === currentUser?.id && !isSuperAdmin} 
                    >
                      {Object.values(UserRole).map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-4">
                     <button 
                       onClick={() => toggleVerification(u.id, u.isVerified)}
                       className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition ${
                         u.isVerified 
                           ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                           : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                       }`}
                     >
                       {u.isVerified ? <CheckCircle size={14} /> : <XCircle size={14} />}
                       {u.isVerified ? 'Подтвержден' : 'Не подтвержден'}
                     </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                     <div className="flex items-center gap-2">
                         <button 
                           onClick={() => handleChangePassword(u.id, u.name)}
                           className="p-1.5 text-slate-400 hover:text-orange-500 hover:bg-orange-50 rounded transition-colors"
                           title="Сменить пароль"
                         >
                            <KeyRound size={16} />
                         </button>
                         
                         {/* Cannot delete yourself */}
                         {u.id !== currentUser?.id && (
                             <button 
                               onClick={() => handleDeleteUser(u.id, u.name)}
                               className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                               title="Удалить пользователя"
                             >
                                <Trash2 size={16} />
                             </button>
                         )}
                         
                         <span className="font-mono text-xs text-slate-300 ml-1">ID: {u.id}</span>
                     </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-slate-500">
                    Пользователи не найдены
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
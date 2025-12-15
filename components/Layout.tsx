import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  CalendarDays, 
  Box, 
  ClipboardList, 
  MessageSquareHeart, 
  PartyPopper, 
  LogOut,
  Menu,
  X,
  User as UserIcon,
  Settings,
  CalendarCheck,
  Bell,
  Users as UsersIcon,
  AlertTriangle,
  Save
} from 'lucide-react';
import { UserRole, User } from '../types';

const NotificationsPopover = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { user, notifications, markAsRead, markAllAsRead } = useAuth();
  
  if (!isOpen || !user) return null;

  const myNotifications = notifications.filter(n => n.userId === user.id);
  const unreadCount = myNotifications.filter(n => !n.isRead).length;

  return (
    <div className="absolute bottom-16 left-4 w-64 md:w-80 bg-white rounded-xl shadow-2xl border border-slate-200 z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
       <div className="bg-slate-900 text-white p-3 flex justify-between items-center">
          <h4 className="font-bold text-sm">Уведомления</h4>
          {unreadCount > 0 && (
             <button onClick={markAllAsRead} className="text-xs text-orange-400 hover:text-orange-300">
               Все прочитаны
             </button>
          )}
       </div>
       <div className="max-h-64 overflow-y-auto">
         {myNotifications.length === 0 ? (
           <p className="p-4 text-center text-slate-400 text-xs">Нет новых уведомлений</p>
         ) : (
           myNotifications.map(n => (
             <div 
               key={n.id} 
               onClick={() => markAsRead(n.id)}
               className={`p-3 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition ${!n.isRead ? 'bg-orange-50' : ''}`}
             >
                <p className={`text-xs ${!n.isRead ? 'font-semibold text-slate-800' : 'text-slate-600'}`}>{n.text}</p>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {new Date(n.date).toLocaleDateString()} {new Date(n.date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                </span>
             </div>
           ))
         )}
       </div>
       <div className="p-2 bg-slate-50 border-t border-slate-100 text-center">
          <button onClick={onClose} className="text-xs text-slate-500 hover:text-slate-800">Закрыть</button>
       </div>
    </div>
  );
};

const ProfileModal = ({ 
    isOpen, 
    onClose, 
    user, 
    onSave 
}: { 
    isOpen: boolean; 
    onClose: () => void; 
    user: User; 
    onSave: (id: string, data: Partial<User>) => void 
}) => {
    const [name, setName] = useState(user.name);
    const [avatarUrl, setAvatarUrl] = useState(user.avatarUrl || '');

    useEffect(() => {
        if(isOpen) {
            setName(user.name);
            setAvatarUrl(user.avatarUrl || '');
        }
    }, [isOpen, user]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(user.id, { name, avatarUrl });
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                    <h3 className="font-bold">Настройки профиля</h3>
                    <button onClick={onClose} className="hover:text-slate-300"><X size={20}/></button>
                </div>
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="flex justify-center mb-4">
                        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden border-2 border-orange-500">
                             {avatarUrl ? <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover"/> : <UserIcon size={32} className="text-slate-400"/>}
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">ФИО</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                            required
                        />
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Ссылка на аватар</label>
                        <input 
                            type="text" 
                            value={avatarUrl}
                            onChange={(e) => setAvatarUrl(e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                            placeholder="https://..."
                        />
                        <p className="text-[10px] text-slate-400 mt-1">Рекомендуем использовать DiceBear или прямые ссылки на фото.</p>
                    </div>

                    <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition flex items-center justify-center gap-2">
                        <Save size={16} />
                        Сохранить
                    </button>
                </form>
            </div>
        </div>
    );
}

const Layout = () => {
  const { user, logout, changeRole, updateUser, isAdmin, notifications, markAsRead, markAllAsRead } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  if (!user) return <Outlet />;

  const navigation = [
    { name: 'Дашборд', href: '/', icon: LayoutDashboard },
    { name: 'Бронирование', href: '/bookings', icon: CalendarDays },
    { name: 'Инвентарь', href: '/inventory', icon: Box },
    { name: 'Мой Планер', href: '/my-calendar', icon: CalendarCheck },
    { name: 'Заявки', href: '/requests', icon: ClipboardList },
    { name: 'Пожелания', href: '/community', icon: MessageSquareHeart },
    { name: 'Афиша', href: '/events', icon: PartyPopper },
  ];

  if (isAdmin) {
      navigation.push({ name: 'Участники', href: '/users', icon: UsersIcon });
  }

  const unreadCount = notifications.filter(n => n.userId === user.id && !n.isRead).length;

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white shadow-xl relative">
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold text-orange-500">
            NewVisionHub
          </h1>
          <p className="text-xs text-slate-400 mt-1">Production Management</p>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navigation.map((item) => (
              <li key={item.name}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-orange-500 text-white font-medium'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  <item.icon size={20} />
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-700 bg-slate-800/50 relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="relative cursor-pointer group" onClick={() => setIsProfileOpen(true)}>
               <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center overflow-hidden hover:opacity-90 border-2 border-transparent group-hover:border-white transition-all">
                  {user.avatarUrl ? <img src={user.avatarUrl} alt="avatar" /> : <UserIcon />}
               </div>
               {/* Note: Unread badge moved to bell icon only */}
            </div>
            
            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setIsProfileOpen(true)}>
              <p className="text-sm font-medium truncate text-white hover:text-orange-300 transition-colors">{user.name}</p>
              <p className="text-xs text-slate-400 truncate flex items-center gap-1">
                 {user.role}
                 {!user.isVerified && <span className="text-orange-500 text-[10px]">(Не подтв.)</span>}
              </p>
            </div>

            <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="text-slate-400 hover:text-white relative">
               <Bell size={18} />
               {unreadCount > 0 && <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-slate-900"></span>}
            </button>
          </div>
          
          <NotificationsPopover isOpen={isNotifOpen} onClose={() => setIsNotifOpen(false)} />
          
          <ProfileModal 
             isOpen={isProfileOpen} 
             onClose={() => setIsProfileOpen(false)} 
             user={user}
             onSave={updateUser}
          />

          {isAdmin && (
            <select 
              value={user.role} 
              onChange={(e) => changeRole(e.target.value as UserRole)}
              className="w-full mb-3 bg-slate-700 text-xs text-white p-2 rounded border border-slate-600 focus:outline-none"
            >
              {Object.values(UserRole).map(role => (
                 <option key={role} value={role}>{role}</option>
              ))}
            </select>
          )}

          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-red-300 hover:bg-red-500/10 hover:text-red-200 rounded-lg transition-colors"
          >
            <LogOut size={16} />
            Выйти
          </button>
        </div>
      </aside>

      {/* Mobile Header & Menu */}
      <div className="md:hidden absolute top-0 left-0 w-full z-50">
        <div className="bg-slate-900 text-white p-4 flex justify-between items-center shadow-md">
           <div className="flex items-center gap-2">
             <h1 className="text-xl font-bold text-orange-500">NewVisionHub</h1>
             {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
             )}
           </div>
           <button onClick={toggleMenu} className="p-1">
             {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
           </button>
        </div>
        
        {isMobileMenuOpen && (
          <div className="bg-slate-800 text-white absolute w-full shadow-xl rounded-b-xl border-t border-slate-700">
             <nav className="p-4">
               <ul className="space-y-2">
                 {navigation.map((item) => (
                   <li key={item.name}>
                     <NavLink
                       to={item.href}
                       onClick={() => setIsMobileMenuOpen(false)}
                       className={({ isActive }) =>
                         `flex items-center gap-3 px-4 py-3 rounded-lg ${
                           isActive ? 'bg-orange-500' : 'hover:bg-slate-700'
                         }`
                       }
                     >
                       <item.icon size={20} />
                       {item.name}
                     </NavLink>
                   </li>
                 ))}
                 <li className="pt-4 border-t border-slate-600 space-y-2">
                    <button onClick={() => { setIsProfileOpen(true); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 px-4 py-3 text-slate-300 w-full hover:bg-slate-700 rounded-lg">
                       <UserIcon size={20} /> Профиль
                    </button>
                    <button onClick={() => { setIsNotifOpen(true); setIsMobileMenuOpen(false); }} className="flex items-center gap-3 px-4 py-3 text-slate-300 w-full hover:bg-slate-700 rounded-lg">
                       <Bell size={20} /> Уведомления ({unreadCount})
                    </button>
                    <button onClick={logout} className="flex items-center gap-3 px-4 py-3 text-red-300 w-full hover:bg-slate-700 rounded-lg">
                       <LogOut size={20} /> Выйти
                    </button>
                 </li>
               </ul>
             </nav>
          </div>
        )}
        
        {/* Mobile Notification Modal Overlay */}
        {isNotifOpen && (
             <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4" onClick={() => setIsNotifOpen(false)}>
                <div className="bg-white rounded-xl w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
                    <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
                        <h4 className="font-bold">Уведомления</h4>
                        <button onClick={() => setIsNotifOpen(false)}><X size={20}/></button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.filter(n => n.userId === user.id).length === 0 ? (
                           <p className="p-6 text-center text-slate-500">Нет уведомлений</p>
                        ) : (
                           notifications.filter(n => n.userId === user.id).map(n => (
                             <div 
                               key={n.id} 
                               onClick={() => markAsRead(n.id)}
                               className={`p-4 border-b border-slate-100 ${!n.isRead ? 'bg-orange-50' : ''}`}
                             >
                                <p className="text-sm text-slate-800">{n.text}</p>
                             </div>
                           ))
                        )}
                    </div>
                    <div className="p-3 bg-slate-50 border-t text-center">
                        <button onClick={markAllAsRead} className="text-orange-600 font-medium text-sm">Прочитать все</button>
                    </div>
                </div>
             </div>
        )}

        {/* Mobile Profile Modal */}
        <ProfileModal 
             isOpen={isProfileOpen} 
             onClose={() => setIsProfileOpen(false)} 
             user={user}
             onSave={updateUser}
        />
      </div>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden h-full relative">
        {/* Account Verification Warning Banner */}
        {!user.isVerified && (
           <div className="bg-amber-100 border-b border-amber-200 px-6 py-2 flex items-center gap-2 justify-center text-amber-800 text-sm font-medium">
              <AlertTriangle size={16} />
              Ваш аккаунт ожидает подтверждения администратором. Некоторые функции могут быть ограничены.
           </div>
        )}

        <div className="flex-1 overflow-y-auto p-4 md:p-8 pt-20 md:pt-8">
           <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole, UserTask, Notification } from '../types';
import { MOCK_USERS, MOCK_TASKS, MOCK_NOTIFICATIONS } from '../mockData';

export const SUPER_ADMIN_EMAIL = 'emelinnikita99@gmail.com';

interface AuthContextType {
  user: User | null;
  usersList: User[];
  login: (email: string) => boolean;
  initiateRegistration: (name: string, email: string) => void;
  confirmEmail: (code: string) => boolean;
  logout: () => void;
  changeRole: (role: UserRole) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  isAdmin: boolean;
  canEdit: (ownerId: string) => boolean;
  
  // Registration Flow State
  pendingUser: { name: string; email: string; code: string } | null;

  // Tasks
  tasks: UserTask[];
  addTask: (task: UserTask) => void;
  toggleTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (userId: string, text: string, type?: 'info' | 'alert' | 'success') => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [usersList, setUsersList] = useState<User[]>(MOCK_USERS);
  const [user, setUser] = useState<User | null>(MOCK_USERS[3]); 
  
  // Registration State
  const [pendingUser, setPendingUser] = useState<{ name: string; email: string; code: string } | null>(null);

  const [tasks, setTasks] = useState<UserTask[]>(MOCK_TASKS);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const login = (email: string) => {
    const foundUser = usersList.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    return false;
  };

  const initiateRegistration = (name: string, email: string) => {
    // Generate a 4-digit code (mock)
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    console.log(`[EMAIL SIMULATION] Code sent to ${email}: ${code}`);
    setPendingUser({ name, email, code });
  };

  const confirmEmail = (code: string) => {
    if (!pendingUser) return false;
    if (pendingUser.code === code) {
        // Create actual user
        const newUser: User = {
            id: Math.random().toString(36).substr(2, 9),
            name: pendingUser.name,
            email: pendingUser.email,
            role: UserRole.BLOGGER, 
            avatarUrl: `https://api.dicebear.com/7.x/avataaars/svg?seed=${pendingUser.name}`,
            isVerified: false, // Wait for admin approval
            isEmailVerified: true
        };
        
        const newList = [...usersList, newUser];
        setUsersList(newList);
        setUser(newUser); // Auto login
        setPendingUser(null);
        return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
  };

  const changeRole = (role: UserRole) => {
    if (user) {
      const updatedUser = { ...user, role };
      setUser(updatedUser);
      setUsersList(usersList.map(u => u.id === user.id ? updatedUser : u));
    }
  };

  const updateUser = (id: string, data: Partial<User>) => {
    setUsersList(prev => prev.map(u => u.id === id ? { ...u, ...data } : u));
    // If we are updating the currently logged-in user, update that state as well
    if (user && user.id === id) {
       setUser(prev => prev ? { ...prev, ...data } : null);
    }
  };

  const isAdmin = user ? [UserRole.STUDIO_ADMIN, UserRole.TECH_ADMIN, UserRole.PRODUCER_ADMIN].includes(user.role) : false;

  const canEdit = (ownerId: string) => {
    if (!user) return false;
    if (isAdmin) return true;
    return user.id === ownerId;
  };

  // --- Task Logic ---
  const addTask = (task: UserTask) => {
    setTasks(prev => [...prev, task]);
    // If task is assigned by admin to someone else, notify them
    if (task.userId !== user?.id) {
        addNotification(
          task.userId, 
          `Администратор ${user?.name} назначил вам задачу: "${task.title}"`,
          'alert'
        );
    }
  };

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // --- Notification Logic ---
  const addNotification = (userId: string, text: string, type: 'info' | 'alert' | 'success' = 'info') => {
    const newNotif: Notification = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      text,
      isRead: false,
      date: new Date().toISOString(),
      type
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllAsRead = () => {
    if (!user) return;
    setNotifications(prev => prev.map(n => n.userId === user.id ? { ...n, isRead: true } : n));
  };

  return (
    <AuthContext.Provider value={{ 
      user, usersList, login, initiateRegistration, confirmEmail, logout, changeRole, updateUser, isAdmin, canEdit,
      pendingUser,
      tasks, addTask, toggleTask, deleteTask,
      notifications, addNotification, markAsRead, markAllAsRead
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
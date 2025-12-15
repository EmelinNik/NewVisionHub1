import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import Inventory from './pages/Inventory';
import Requests from './pages/Requests';
import Community from './pages/Community';
import Events from './pages/Events';
import MyCalendar from './pages/MyCalendar';
import Users from './pages/Users';
import GeminiAssistant from './components/GeminiAssistant';

// Auth Page Component
const AuthPage = () => {
  const { login, initiateRegistration, confirmEmail, pendingUser } = useAuth();
  
  // UI States
  // 'login' | 'register' | 'code'
  const [viewState, setViewState] = useState<'login' | 'register' | 'code'>('login');
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(email);
    if (!success) {
        setError('Пользователь не найден. Проверьте почту или зарегистрируйтесь.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
        setError('Заполните все поля');
        return;
    }
    
    // Step 1: Send Code
    initiateRegistration(name, email);
    setViewState('code');
    setError('');
    // For demo purposes, we show the code in an alert, normally this goes to email
    alert(`[ДЕМО] Код подтверждения отправлен на ${email}. (Проверьте консоль, если не пришло)`);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const success = confirmEmail(code);
    if (!success) {
        setError('Неверный код. Попробуйте снова.');
    }
    // If success, AuthContext sets user automatically and Router redirects
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center animate-in fade-in zoom-in duration-300">
        <h1 className="text-3xl font-bold mb-2 text-orange-500">NewVisionHub</h1>
        
        {viewState === 'login' && (
            <>
                <p className="text-slate-500 mb-8">Войдите в свой аккаунт</p>
                <form onSubmit={handleLogin} className="text-left space-y-4">
                    <input 
                        type="email" 
                        placeholder="Email" 
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input 
                        type="password" 
                        placeholder="Пароль" 
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-200">
                        Войти
                    </button>
                </form>
                <div className="mt-6 pt-6 border-t border-slate-100">
                   <p className="text-sm text-slate-500 mb-2">Нет аккаунта?</p>
                   <button 
                     onClick={() => { setViewState('register'); setError(''); }}
                     className="text-orange-600 font-medium hover:text-orange-700 hover:underline"
                   >
                     Создать аккаунт блогера
                   </button>
                </div>
            </>
        )}

        {viewState === 'register' && (
            <>
                <p className="text-slate-500 mb-8">Регистрация нового участника</p>
                <form onSubmit={handleRegister} className="text-left space-y-4">
                    <input 
                        type="text" 
                        placeholder="Ваше Имя" 
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input 
                        type="email" 
                        placeholder="Email" 
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input 
                        type="password" 
                        placeholder="Пароль" 
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-200">
                        Получить код
                    </button>
                </form>
                <div className="mt-6 pt-6 border-t border-slate-100">
                   <p className="text-sm text-slate-500 mb-2">Уже есть аккаунт?</p>
                   <button 
                     onClick={() => { setViewState('login'); setError(''); }}
                     className="text-orange-600 font-medium hover:text-orange-700 hover:underline"
                   >
                     Войти в систему
                   </button>
                </div>
            </>
        )}

        {viewState === 'code' && (
             <>
                <p className="text-slate-500 mb-8">Введите код из письма</p>
                <div className="bg-blue-50 text-blue-800 p-3 rounded-lg text-sm mb-4">
                    Код отправлен на <b>{pendingUser?.email}</b>
                </div>
                <form onSubmit={handleVerify} className="text-left space-y-4">
                    <input 
                        type="text" 
                        placeholder="0000" 
                        maxLength={4}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-orange-500 focus:outline-none text-center text-2xl tracking-widest font-mono"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    
                    {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                    <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-200">
                        Подтвердить и Войти
                    </button>
                </form>
                <button 
                    onClick={() => { setViewState('register'); setError(''); }}
                    className="mt-4 text-sm text-slate-400 hover:text-slate-600"
                >
                    Назад к регистрации
                </button>
            </>
        )}

      </div>
    </div>
  );
};

const AppRoutes = () => {
    const { user } = useAuth();
    return (
        <Routes>
          <Route path="/" element={user ? <Layout /> : <Navigate to="/login" />}>
            <Route index element={<Dashboard />} />
            <Route path="bookings" element={<Bookings />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="my-calendar" element={<MyCalendar />} />
            <Route path="requests" element={<Requests />} />
            <Route path="community" element={<Community />} />
            <Route path="events" element={<Events />} />
            <Route path="users" element={<Users />} />
          </Route>
          <Route path="/login" element={!user ? <AuthPage /> : <Navigate to="/" />} />
        </Routes>
    );
};

const App = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
        <GeminiAssistant />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
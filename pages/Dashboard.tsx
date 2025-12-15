import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Users, Box, AlertCircle, Calendar, Clock, ArrowRight } from 'lucide-react';
import { MOCK_BOOKINGS, MOCK_INVENTORY, MOCK_REQUESTS } from '../mockData';
import { BookingType } from '../types';
import { useAuth } from '../context/AuthContext';

interface StatCardProps {
  icon: any;
  label: string;
  value: number;
  color: string;
  onClick: () => void;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, color, onClick }) => (
  <div 
    onClick={onClick}
    className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all hover:scale-[1.02] active:scale-95 group"
  >
    <div className={`p-4 rounded-full ${color} transition-transform group-hover:rotate-6`}>
      <Icon size={24} className="text-white" />
    </div>
    <div>
      <p className="text-slate-500 text-sm font-medium">{label}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
    </div>
  </div>
);

interface ScheduleItemProps {
  time: string;
  title: string;
  user: string;
  type: BookingType;
  isTomorrow?: boolean;
  onClick?: () => void;
}

const ScheduleItem: React.FC<ScheduleItemProps> = ({ time, title, user, type, isTomorrow = false, onClick }) => (
  <div 
    onClick={onClick}
    className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer hover:scale-[1.01] active:scale-95 ${
      isTomorrow 
        ? 'bg-slate-50 border-slate-100 hover:bg-slate-100' 
        : 'bg-white border-orange-100 shadow-sm hover:shadow-md hover:border-orange-200'
    }`}
  >
    <div className={`min-w-[60px] text-center p-2 rounded-lg ${isTomorrow ? 'bg-slate-200 text-slate-600' : 'bg-orange-100 text-orange-700'}`}>
      <span className="block font-bold text-sm">{time}</span>
    </div>
    <div className="flex-1">
      <h4 className="font-semibold text-slate-800">{title}</h4>
      <p className="text-sm text-slate-500 flex items-center gap-2 mt-1">
        <Users size={14} />
        {user}
      </p>
    </div>
    <div className={`text-xs px-2 py-1 rounded-full ${type === BookingType.ROOM ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
      {type === BookingType.ROOM ? 'Помещение' : 'Техника'}
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { usersList, isAdmin } = useAuth();
  const activeBookings = MOCK_BOOKINGS.filter(b => b.status === 'Активно').length;
  const totalItems = MOCK_INVENTORY.length;
  const newRequests = MOCK_REQUESTS.filter(r => r.status === 'Новая').length;

  // Filter Bookings for Today and Tomorrow
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const isSameDay = (d1: Date, d2: Date) => {
      return d1.getDate() === d2.getDate() && 
             d1.getMonth() === d2.getMonth() && 
             d1.getFullYear() === d2.getFullYear();
  };

  const todayBookings = MOCK_BOOKINGS.filter(b => isSameDay(new Date(b.startTime), today)).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
  const tomorrowBookings = MOCK_BOOKINGS.filter(b => isSameDay(new Date(b.startTime), tomorrow)).sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  // Helper to generate next dates for clickability
  const getUpcomingDay = (offset: number) => {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    // Format manually to avoid timezone issues in simple ISO string
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getDayName = (offset: number) => {
     const d = new Date();
     d.setDate(d.getDate() + offset);
     const dayName = d.toLocaleDateString('ru-RU', { weekday: 'short' }); // "пн", "вт"
     return dayName.charAt(0).toUpperCase() + dayName.slice(1);
  };

  // Generate week stats based on mock bookings count
  const upcomingWeek = Array.from({ length: 7 }, (_, i) => {
      const offset = i + 1; // start from tomorrow or day after? Let's show next 7 days including today or starting tomorrow. Let's start from tomorrow + 1 to simulate "week load"
      const dateStr = getUpcomingDay(i);
      // Count mock bookings for this day (simulated random distribution + existing mocks)
      const count = MOCK_BOOKINGS.filter(b => b.startTime.startsWith(dateStr)).length + Math.floor(Math.random() * 5); 
      return {
          day: getDayName(i),
          count: count > 0 ? count : Math.floor(Math.random() * 8), // Fill with some dummy data if empty
          date: dateStr
      };
  });

  const handleWeekDayClick = (dateStr: string) => {
    navigate(`/bookings?date=${dateStr}`);
  };

  const handleBookingClick = (isoDateString: string, bookingId: string) => {
    // Navigate to bookings page with the specific date selected AND the booking ID to open it
    const date = new Date(isoDateString);
    const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
    navigate(`/bookings?date=${dateStr}&bookingId=${bookingId}`);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Обзор студии</h2>

      {/* Stats Grid - Clickable */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Activity} 
          label="Активные брони" 
          value={activeBookings} 
          color="bg-orange-500"
          onClick={() => navigate('/bookings')}
        />
        <StatCard 
          icon={Box} 
          label="Единиц техники" 
          value={totalItems} 
          color="bg-slate-700"
          onClick={() => navigate('/inventory')}
        />
        <StatCard 
          icon={AlertCircle} 
          label="Новые заявки" 
          value={newRequests} 
          color="bg-red-500"
          onClick={() => navigate('/requests')}
        />
        <StatCard 
          icon={Users} 
          label="Всего участников" 
          value={usersList.length} 
          color="bg-emerald-500"
          onClick={() => isAdmin ? navigate('/users') : navigate('/community')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Schedule Column (Today & Tomorrow) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div 
              className="flex items-center justify-between mb-4 cursor-pointer hover:bg-slate-50 p-2 -m-2 rounded-lg transition-colors"
              onClick={() => navigate('/bookings')}
            >
               <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                 <Calendar className="text-orange-500" size={20}/>
                 Сегодня, {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
               </h3>
               <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                 {todayBookings.length} события
               </span>
            </div>
            <div className="space-y-3">
              {todayBookings.length > 0 ? todayBookings.map((item, idx) => (
                <ScheduleItem 
                    key={item.id} 
                    time={new Date(item.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    title={item.resourceName}
                    user={item.clientInfo?.name || (item.userId === 'u1' ? 'Алексей Смирнов' : 'Администратор')}
                    type={item.type}
                    onClick={() => handleBookingClick(item.startTime, item.id)}
                />
              )) : (
                  <p className="text-slate-400 text-sm text-center py-4">На сегодня событий нет</p>
              )}
            </div>
          </div>

          {/* Tomorrow Section */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 opacity-90">
            <div 
              className="flex items-center justify-between mb-4 cursor-pointer hover:bg-slate-50 p-2 -m-2 rounded-lg transition-colors"
              onClick={() => handleBookingClick(tomorrow.toISOString(), '')}
            >
               <h3 className="text-lg font-bold text-slate-700 flex items-center gap-2">
                 <Clock className="text-slate-400" size={20}/>
                 Завтра
               </h3>
               <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-full">
                 {tomorrowBookings.length} события
               </span>
            </div>
            <div className="space-y-3">
              {tomorrowBookings.length > 0 ? tomorrowBookings.map((item, idx) => (
                <ScheduleItem 
                    key={item.id} 
                    time={new Date(item.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    title={item.resourceName}
                    user={item.clientInfo?.name || (item.userId === 'u1' ? 'Алексей Смирнов' : 'Администратор')}
                    type={item.type}
                    isTomorrow
                    onClick={() => handleBookingClick(item.startTime, item.id)}
                />
              )) : (
                  <p className="text-slate-400 text-sm text-center py-4">На завтра событий нет</p>
              )}
            </div>
          </div>
        </div>

        {/* 7 Days Overview Column */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-full">
            <h3 className="text-lg font-bold text-slate-800 mb-6">Загрузка на неделю</h3>
            <div className="space-y-4">
               <div className="relative pl-4 border-l-2 border-slate-100 space-y-6">
                  {upcomingWeek.map((day, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[21px] top-1 w-3 h-3 rounded-full bg-orange-200 border-2 border-white"></div>
                      <div 
                        onClick={() => handleWeekDayClick(day.date)}
                        className="flex justify-between items-center group cursor-pointer hover:bg-slate-50 p-2 -m-2 rounded-lg transition-colors"
                      >
                        <span className="text-slate-600 font-medium group-hover:text-orange-600 transition-colors">{day.day}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-800">{day.count}</span>
                          <span className="text-xs text-slate-400">броней</span>
                        </div>
                      </div>
                      <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-orange-400 rounded-full opacity-50" 
                          style={{ width: `${Math.min((day.count / 10) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
            
            <button 
              onClick={() => navigate('/bookings')}
              className="w-full mt-8 flex items-center justify-center gap-2 text-orange-600 font-medium hover:bg-orange-50 py-3 rounded-lg transition-colors border border-dashed border-orange-200"
            >
              Открыть календарь <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
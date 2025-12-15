import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MOCK_BOOKINGS, MOCK_INVENTORY } from '../mockData';
import { Booking, BookingStatus, BookingType, ItemStatus, ClientInfo } from '../types';
import { Calendar as CalendarIcon, Clock, X, ChevronLeft, ChevronRight, Edit2, Trash2, Plus, Users, Box, ChevronDown, ChevronUp } from 'lucide-react';

// --- Types & Helpers ---
const DAYS_OF_WEEK = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

const getMonthData = (year: number, month: number) => {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startDayOfWeek = (firstDay.getDay() + 6) % 7; // Shift to Mon=0

  const days = [];
  // Empty slots for previous month
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null);
  }
  // Days of current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }
  return days;
};

// --- Modal Component ---
const BookingModal = ({ 
  isOpen, 
  onClose, 
  onSave, 
  booking, 
  selectedDate 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (b: Partial<Booking>) => void;
  booking?: Booking;
  selectedDate: Date;
}) => {
  const [resourceName, setResourceName] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('14:00');
  const [type, setType] = useState<BookingType>(BookingType.ROOM);
  
  // Client Info State
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientVk, setClientVk] = useState('');
  const [clientTg, setClientTg] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (booking) {
        setResourceName(booking.resourceName);
        setStartTime(new Date(booking.startTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}));
        setEndTime(new Date(booking.endTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}));
        setType(booking.type);
        // Client info
        setClientName(booking.clientInfo?.name || '');
        setClientPhone(booking.clientInfo?.phone || '');
        setClientVk(booking.clientInfo?.vk || '');
        setClientTg(booking.clientInfo?.telegram || '');
      } else {
        setResourceName('');
        setStartTime('10:00');
        setEndTime('14:00');
        setType(BookingType.ROOM);
        setClientName('');
        setClientPhone('');
        setClientVk('');
        setClientTg('');
      }
    }
  }, [booking, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clientInfo: ClientInfo = {
        name: clientName,
        phone: clientPhone,
        vk: clientVk,
        telegram: clientTg
    };

    onSave({
      id: booking?.id || Math.random().toString(36).substr(2, 9),
      resourceName,
      type,
      startTime: `${selectedDate.toISOString().split('T')[0]}T${startTime}:00`,
      endTime: `${selectedDate.toISOString().split('T')[0]}T${endTime}:00`,
      status: BookingStatus.PLANNED,
      userId: booking?.userId || 'currentUser', // Keep existing or mock
      clientInfo
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 max-h-[90vh] flex flex-col">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800">{booking ? 'Редактировать бронь' : 'Новая бронь'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Дата</label>
            <div className="w-full px-4 py-2 bg-slate-100 rounded-lg text-slate-700 font-medium">
              {selectedDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>

          {/* Client Info Collapsible Section */}
          <details className="group bg-slate-50 p-3 rounded-lg border border-slate-200" open={!!booking?.clientInfo}>
             <summary className="flex justify-between items-center cursor-pointer list-none text-sm font-bold text-slate-700">
                 <span>Данные арендатора</span>
                 <span className="group-open:rotate-180 transition-transform"><ChevronDown size={16}/></span>
             </summary>
             <div className="mt-3 space-y-3">
                 <div>
                    <input 
                      type="text" 
                      placeholder="ФИО" 
                      value={clientName}
                      onChange={e => setClientName(e.target.value)}
                      className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    />
                 </div>
                 <div>
                    <input 
                      type="text" 
                      placeholder="Телефон" 
                      value={clientPhone}
                      onChange={e => setClientPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    />
                 </div>
                 <div className="grid grid-cols-2 gap-2">
                    <input 
                      type="text" 
                      placeholder="Telegram (@nick)" 
                      value={clientTg}
                      onChange={e => setClientTg(e.target.value)}
                      className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    />
                    <input 
                      type="text" 
                      placeholder="VK Link" 
                      value={clientVk}
                      onChange={e => setClientVk(e.target.value)}
                      className="w-full px-3 py-2 rounded border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    />
                 </div>
             </div>
          </details>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Тип брони</label>
            <div className="flex gap-2">
              <button 
                type="button"
                onClick={() => setType(BookingType.ROOM)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${type === BookingType.ROOM ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                Помещение
              </button>
              <button 
                type="button"
                onClick={() => setType(BookingType.EQUIPMENT)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${type === BookingType.EQUIPMENT ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
              >
                Техника
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">Что бронируем?</label>
            {type === BookingType.ROOM ? (
              <select 
                value={resourceName} 
                onChange={e => setResourceName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                <option value="">Выберите помещение</option>
                <option value="Студия (Циклорама)">Студия (Циклорама)</option>
                <option value="Переговорка">Переговорка</option>
                <option value="Подкаст-зона">Подкаст-зона</option>
              </select>
            ) : (
              <select
                value={resourceName} 
                onChange={e => setResourceName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required
              >
                 <option value="">Выберите оборудование</option>
                 {MOCK_INVENTORY.map(item => (
                   <option key={item.id} value={item.name}>{item.name}</option>
                 ))}
              </select>
            )}
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 mb-1">Начало</label>
              <input 
                type="time" 
                value={startTime}
                onChange={e => setStartTime(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required 
              />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-slate-500 mb-1">Конец</label>
              <input 
                type="time" 
                value={endTime}
                onChange={e => setEndTime(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                required 
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition mt-4">
            Сохранить
          </button>
        </form>
      </div>
    </div>
  );
};

// --- Main Page Component ---
const Bookings = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | undefined>(undefined);

  // Initialize selected date and check for Booking ID in URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const dateParam = params.get('date');
    const bookingIdParam = params.get('bookingId');

    if (dateParam) {
      const date = new Date(dateParam);
      if (!isNaN(date.getTime())) {
        setSelectedDate(date);
        // Only update current view month if it's different to prevent jumping if navigating within month
        if (date.getMonth() !== currentDate.getMonth() || date.getFullYear() !== currentDate.getFullYear()) {
             setCurrentDate(date);
        }
      }
    }

    if (bookingIdParam) {
        // Find the booking
        const foundBooking = bookings.find(b => b.id === bookingIdParam);
        if (foundBooking) {
            setEditingBooking(foundBooking);
            setIsModalOpen(true);
            // Also ensure we are looking at that date
            const date = new Date(foundBooking.startTime);
            setSelectedDate(date);
            if (date.getMonth() !== currentDate.getMonth()) {
                setCurrentDate(date);
            }
        }
    }
  }, [location.search, bookings]); // Added bookings to deps in case they load async later

  // Calendar Navigation
  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const days = getMonthData(currentDate.getFullYear(), currentDate.getMonth());

  // CRUD Operations
  const handleSaveBooking = (newBooking: Partial<Booking>) => {
    if (editingBooking) {
      setBookings(bookings.map(b => b.id === editingBooking.id ? { ...b, ...newBooking } as Booking : b));
    } else {
      setBookings([...bookings, newBooking as Booking]);
    }
    setIsModalOpen(false);
    setEditingBooking(undefined);
    // Clear the ID from URL without refreshing
    const params = new URLSearchParams(location.search);
    params.delete('bookingId');
    navigate(`?${params.toString()}`, { replace: true });
  };

  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
      setIsModalOpen(false);
      setEditingBooking(undefined);
      // Clear URL params
      const params = new URLSearchParams(location.search);
      if (params.get('bookingId')) {
          params.delete('bookingId');
          navigate(`?${params.toString()}`, { replace: true });
      }
  };

  const handleCancel = (id: string) => {
    if (window.confirm('Вы уверены, что хотите отменить эту бронь?')) {
       setBookings(bookings.map(b => b.id === id ? { ...b, status: BookingStatus.CANCELLED } : b));
    }
  };

  const handleCreate = () => {
    setEditingBooking(undefined);
    setIsModalOpen(true);
  };

  // Filtering for Selected Date
  const selectedDateBookings = bookings.filter(b => {
    const bDate = new Date(b.startTime);
    return bDate.getDate() === selectedDate.getDate() &&
           bDate.getMonth() === selectedDate.getMonth() &&
           bDate.getFullYear() === selectedDate.getFullYear();
  });

  const getStatusColor = (status: BookingStatus) => {
    switch (status) {
      case BookingStatus.ACTIVE: return 'text-green-600 bg-green-50 border-green-200';
      case BookingStatus.PLANNED: return 'text-blue-600 bg-blue-50 border-blue-200';
      case BookingStatus.COMPLETED: return 'text-slate-600 bg-slate-50 border-slate-200';
      case BookingStatus.CANCELLED: return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Бронирования</h2>
        <button 
          onClick={handleCreate}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition font-medium shadow-sm shadow-orange-200 flex items-center gap-2"
        >
          <Plus size={18} />
          Новая бронь
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        {/* Calendar Column */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-lg text-slate-700 capitalize">
               {currentDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })}
             </h3>
             <div className="flex gap-2">
               <button onClick={prevMonth} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                 <ChevronLeft size={20} />
               </button>
               <button onClick={() => setCurrentDate(new Date())} className="px-3 py-1 text-sm bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 font-medium">
                 Сегодня
               </button>
               <button onClick={nextMonth} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
                 <ChevronRight size={20} />
               </button>
             </div>
          </div>
          
          <div className="grid grid-cols-7 mb-2">
             {DAYS_OF_WEEK.map(d => (
               <div key={d} className="text-center text-xs font-semibold text-slate-400 uppercase py-2">
                 {d}
               </div>
             ))}
          </div>
          
          <div className="grid grid-cols-7 gap-px bg-slate-100 rounded-lg overflow-hidden border border-slate-100 flex-1">
             {days.map((d, i) => {
               if (!d) return <div key={i} className="bg-slate-50/50" />;
               
               const isSelected = d.toDateString() === selectedDate.toDateString();
               const isToday = d.toDateString() === new Date().toDateString();
               const dayBookings = bookings.filter(b => new Date(b.startTime).toDateString() === d.toDateString());
               
               return (
                 <div 
                    key={i} 
                    onClick={() => setSelectedDate(d)}
                    className={`bg-white min-h-[100px] p-2 relative hover:bg-slate-50 transition-colors cursor-pointer group flex flex-col ${isSelected ? 'ring-2 ring-inset ring-orange-500 z-10' : ''}`}
                 >
                    <span className={`text-xs w-6 h-6 flex items-center justify-center rounded-full font-medium ${isToday ? 'bg-orange-500 text-white' : 'text-slate-500'}`}>
                      {d.getDate()}
                    </span>
                    
                    <div className="mt-1 space-y-1 overflow-y-auto max-h-[80px] no-scrollbar">
                      {dayBookings.slice(0, 3).map(b => (
                        <div key={b.id} className={`text-[10px] px-1.5 py-0.5 rounded truncate ${b.status === BookingStatus.CANCELLED ? 'opacity-50 line-through' : ''} ${b.type === BookingType.ROOM ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'}`}>
                           {b.resourceName}
                        </div>
                      ))}
                      {dayBookings.length > 3 && (
                         <div className="text-[10px] text-slate-400 pl-1">+{dayBookings.length - 3} ещё</div>
                      )}
                    </div>
                 </div>
               );
             })}
          </div>
        </div>

        {/* Selected Day Details */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50">
            <h3 className="font-bold text-slate-800">
               {selectedDate.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {selectedDateBookings.length > 0 ? `${selectedDateBookings.length} бронирований` : 'Нет броней'}
            </p>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {selectedDateBookings.length === 0 && (
               <div className="text-center py-10 text-slate-400">
                  <CalendarIcon size={48} className="mx-auto mb-2 opacity-20" />
                  <p>На этот день ничего не запланировано</p>
                  <button onClick={handleCreate} className="mt-4 text-orange-500 font-medium hover:text-orange-600 text-sm">
                    Создать бронь
                  </button>
               </div>
            )}
            
            {selectedDateBookings.map(booking => (
              <div key={booking.id} className="p-4 rounded-xl border border-slate-100 bg-white shadow-sm group hover:border-orange-200 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-xs px-2 py-0.5 rounded border ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                     <button onClick={() => handleEdit(booking)} className="p-1 text-slate-400 hover:text-blue-500"><Edit2 size={14} /></button>
                     <button onClick={() => handleCancel(booking.id)} className="p-1 text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                </div>
                
                <h4 className="font-bold text-slate-800 mb-1 flex items-center gap-2">
                   {booking.type === BookingType.ROOM ? <Users size={16} className="text-blue-500"/> : <Box size={16} className="text-purple-500"/>}
                   {booking.resourceName}
                </h4>
                
                <div className="space-y-1">
                   <div className="flex items-center gap-2 text-xs text-slate-500">
                     <Clock size={12} />
                     {new Date(booking.startTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})} - {new Date(booking.endTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                   </div>
                   <div className="flex items-center gap-2 text-xs text-slate-500">
                     <Users size={12} />
                     {booking.clientInfo?.name ? booking.clientInfo.name : 'Пользователь'}
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BookingModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveBooking}
        booking={editingBooking}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default Bookings;
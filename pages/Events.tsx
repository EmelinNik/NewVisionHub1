import React, { useState, useEffect } from 'react';
import { MOCK_EVENTS } from '../mockData';
import { Event } from '../types';
import { Calendar, MapPin, Users, Plus, Edit2, Trash2, X, Save, Clock } from 'lucide-react';

const EventModal = ({
  isOpen,
  onClose,
  event,
  onSave
}: {
  isOpen: boolean;
  onClose: () => void;
  event?: Event;
  onSave: (event: Partial<Event>) => void;
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [datePart, setDatePart] = useState('');
  const [timePart, setTimePart] = useState('');
  const [capacity, setCapacity] = useState(20);
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (event) {
        setTitle(event.title);
        setDescription(event.description);
        setLocation(event.location);
        setCapacity(event.capacity);
        setImageUrl(event.image);
        
        const d = new Date(event.date);
        setDatePart(d.toISOString().split('T')[0]);
        setTimePart(d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
      } else {
        setTitle('');
        setDescription('');
        setLocation('');
        setCapacity(20);
        setImageUrl('');
        setDatePart('');
        setTimePart('');
      }
    }
  }, [event, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Combine date and time
    let isoDate = new Date().toISOString();
    if (datePart && timePart) {
        const d = new Date(`${datePart}T${timePart}`);
        isoDate = d.toISOString();
    }

    onSave({
      id: event?.id,
      title,
      description,
      location,
      capacity,
      image: imageUrl || 'https://picsum.photos/600/400', // default mock image
      date: isoDate
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800 text-lg">{event ? 'Редактировать событие' : 'Новое мероприятие'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        
        <div className="overflow-y-auto p-6">
            <form id="eventForm" onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Название</label>
                <input 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    required
                    placeholder="Название воркшопа или встречи"
                />
            </div>
            
            <div className="flex gap-4">
                <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Дата</label>
                    <input 
                        type="date"
                        value={datePart}
                        onChange={(e) => setDatePart(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                        required
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Время</label>
                    <input 
                        type="time"
                        value={timePart}
                        onChange={(e) => setTimePart(e.target.value)}
                        className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                        required
                    />
                </div>
            </div>

            <div className="flex gap-4">
                <div className="flex-[2]">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Адрес / Локация</label>
                    <div className="relative">
                        <MapPin size={16} className="absolute left-3 top-2.5 text-slate-400"/>
                        <input 
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full pl-9 pr-3 py-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                            required
                            placeholder="Студия 1, Лаунж..."
                        />
                    </div>
                </div>
                <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Вместимость</label>
                    <input 
                        type="number"
                        value={capacity}
                        onChange={(e) => setCapacity(Number(e.target.value))}
                        className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                        required
                        min="1"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Изображение (URL)</label>
                <input 
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                    placeholder="https://..."
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Описание</label>
                <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm h-24 resize-none"
                    required
                    placeholder="О чем мероприятие?"
                />
            </div>
            </form>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50">
            <button form="eventForm" type="submit" className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition flex items-center justify-center gap-2">
                <Save size={18} />
                Сохранить
            </button>
        </div>
      </div>
    </div>
  );
};

const Events = () => {
  const [events, setEvents] = useState<Event[]>(MOCK_EVENTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>(undefined);

  const handleCreate = () => {
    setEditingEvent(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Вы уверены, что хотите удалить это мероприятие?')) {
        setEvents(events.filter(e => e.id !== id));
    }
  };

  const handleSave = (eventData: Partial<Event>) => {
    if (eventData.id) {
        // Edit
        setEvents(events.map(e => e.id === eventData.id ? { ...e, ...eventData } as Event : e));
    } else {
        // Create
        const newEvent: Event = {
            ...eventData as Event,
            id: Math.random().toString(36).substr(2, 9),
            registeredCount: 0
        };
        setEvents([...events, newEvent]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Афиша мероприятий</h2>
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition shadow-sm shadow-orange-200"
        >
          <Plus size={18} />
          Создать мероприятие
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map(event => (
          <div key={event.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all group flex flex-col h-full">
            <div className="h-48 overflow-hidden relative bg-slate-200">
              {event.image ? (
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">Нет изображения</div>
              )}
              
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-orange-600 shadow-sm">
                {new Date(event.date).toLocaleDateString()}
              </div>

              {/* Admin Actions Overlay */}
              <div className="absolute top-4 left-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEdit(event)}
                  className="p-2 bg-white/90 rounded-full text-slate-700 hover:text-blue-600 shadow-sm"
                >
                    <Edit2 size={14} />
                </button>
                <button 
                  onClick={() => handleDelete(event.id)}
                  className="p-2 bg-white/90 rounded-full text-slate-700 hover:text-red-600 shadow-sm"
                >
                    <Trash2 size={14} />
                </button>
              </div>
            </div>
            
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-bold text-slate-800 mb-2">{event.title}</h3>
              <p className="text-slate-600 text-sm mb-4 line-clamp-2 flex-1">{event.description}</p>
              
              <div className="space-y-3 mb-6 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <Clock size={16} className="text-orange-500" />
                  {new Date(event.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <MapPin size={16} className="text-orange-500" />
                  <span className="truncate">{event.location}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <Users size={16} className="text-orange-500" />
                  {event.registeredCount} / {event.capacity} участников
                </div>
              </div>

              <button className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition">
                Записаться
              </button>
            </div>
          </div>
        ))}
      </div>

      <EventModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        event={editingEvent}
      />
    </div>
  );
};

export default Events;
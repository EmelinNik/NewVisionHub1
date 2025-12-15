import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { TaskType, UserTask } from '../types';
import { Plus, CheckCircle, Circle, Trash2, Calendar, Clock, User as UserIcon } from 'lucide-react';

const MyCalendar = () => {
  const { user, tasks, addTask, toggleTask, deleteTask, isAdmin, usersList } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [time, setTime] = useState('12:00');
  const [type, setType] = useState<TaskType>(TaskType.POST);
  const [assignedTo, setAssignedTo] = useState(user?.id || '');
  
  // Initialize date field in form with current selected date in calendar view
  const [formDate, setFormDate] = useState(selectedDate);

  const myTasks = tasks.filter(t => t.userId === user?.id);
  
  // Sort tasks: Incomplete first, then by date/time
  const sortedTasks = [...myTasks].sort((a, b) => {
      if (a.isCompleted === b.isCompleted) {
          return new Date(a.date + 'T' + a.time).getTime() - new Date(b.date + 'T' + b.time).getTime();
      }
      return a.isCompleted ? 1 : -1;
  });

  const getDayTasks = (date: string) => sortedTasks.filter(t => t.date === date);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newTask: UserTask = {
        id: Math.random().toString(36).substr(2, 9),
        userId: assignedTo, // Can be self or assigned user
        title,
        description: desc,
        date: formDate, // Deadline Date
        time, // Deadline Time
        isCompleted: false,
        type,
        assignedBy: assignedTo !== user.id ? user.name : undefined
    };

    addTask(newTask);
    setIsModalOpen(false);
    // Reset form
    setTitle('');
    setDesc('');
  };
  
  const handleOpenModal = () => {
      setFormDate(selectedDate); // Default deadline to currently viewed day
      setAssignedTo(user?.id || '');
      setIsModalOpen(true);
  }

  // Simplified week generator around selected date
  const generateWeek = () => {
      const dates = [];
      const base = new Date(selectedDate);
      for(let i=-2; i<=4; i++) {
          const d = new Date(base);
          d.setDate(base.getDate() + i);
          dates.push(d);
      }
      return dates;
  }

  const getTypeColor = (t: TaskType) => {
      switch(t) {
          case TaskType.POST: return 'bg-purple-100 text-purple-700 border-purple-200';
          case TaskType.MEETING: return 'bg-blue-100 text-blue-700 border-blue-200';
          case TaskType.SHOOTING: return 'bg-orange-100 text-orange-700 border-orange-200';
          case TaskType.WORKSHOP: return 'bg-pink-100 text-pink-700 border-pink-200';
          default: return 'bg-slate-100 text-slate-700 border-slate-200';
      }
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
            <h2 className="text-2xl font-bold text-slate-800">Мой Планер</h2>
            <p className="text-slate-500 text-sm">Управляйте своим расписанием, задачами и встречами.</p>
        </div>
        <button 
          onClick={handleOpenModal}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition shadow-sm shadow-orange-200"
        >
          <Plus size={18} />
          Добавить задачу
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
          {/* Calendar/List View */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-slate-100 flex flex-col">
              {/* Date Strip */}
              <div className="p-4 border-b border-slate-100 overflow-x-auto">
                  <div className="flex justify-between gap-2 min-w-[300px]">
                      {generateWeek().map((date, idx) => {
                          const dateStr = date.toISOString().split('T')[0];
                          const isSelected = dateStr === selectedDate;
                          const isToday = dateStr === new Date().toISOString().split('T')[0];
                          const hasTask = getDayTasks(dateStr).length > 0;
                          
                          return (
                              <button 
                                key={idx}
                                onClick={() => setSelectedDate(dateStr)}
                                className={`flex flex-col items-center p-3 rounded-xl min-w-[60px] transition-all ${
                                    isSelected ? 'bg-orange-500 text-white shadow-lg shadow-orange-200 scale-105' : 'hover:bg-slate-50 text-slate-600'
                                }`}
                              >
                                  <span className="text-xs font-medium uppercase opacity-80">
                                      {date.toLocaleDateString('ru-RU', {weekday: 'short'})}
                                  </span>
                                  <span className={`text-lg font-bold ${isToday && !isSelected ? 'text-orange-500' : ''}`}>
                                      {date.getDate()}
                                  </span>
                                  {hasTask && !isSelected && (
                                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-1"></span>
                                  )}
                              </button>
                          )
                      })}
                  </div>
              </div>

              {/* Tasks List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  <h3 className="font-bold text-slate-700 mb-2">
                      Задачи на {new Date(selectedDate).toLocaleDateString('ru-RU', {day: 'numeric', month: 'long'})}
                  </h3>
                  
                  {getDayTasks(selectedDate).length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-40 text-slate-400 border-2 border-dashed border-slate-100 rounded-xl">
                          <Calendar size={32} className="mb-2 opacity-50"/>
                          <p>Нет задач на этот день</p>
                      </div>
                  ) : (
                      getDayTasks(selectedDate).map(task => (
                          <div key={task.id} className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${task.isCompleted ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-slate-100 shadow-sm hover:shadow-md'}`}>
                              <button 
                                onClick={() => toggleTask(task.id)}
                                className={`mt-1 ${task.isCompleted ? 'text-green-500' : 'text-slate-300 hover:text-orange-500'}`}
                              >
                                  {task.isCompleted ? <CheckCircle size={24} /> : <Circle size={24} />}
                              </button>
                              
                              <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                      <span className={`text-[10px] px-2 py-0.5 rounded border font-medium uppercase tracking-wide ${getTypeColor(task.type)}`}>
                                          {task.type}
                                      </span>
                                      {task.assignedBy && (
                                          <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded flex items-center gap-1">
                                              <UserIcon size={10} /> от {task.assignedBy}
                                          </span>
                                      )}
                                  </div>
                                  <h4 className={`font-bold text-slate-800 ${task.isCompleted ? 'line-through text-slate-500' : ''}`}>
                                      {task.title}
                                  </h4>
                                  {task.description && <p className="text-sm text-slate-500 mt-1">{task.description}</p>}
                                  
                                  <div className="flex items-center gap-4 mt-3 text-xs text-slate-400 font-medium">
                                      <div className="flex items-center gap-1 text-red-400">
                                          <Clock size={14} />
                                          Дедлайн: {task.time}
                                      </div>
                                  </div>
                              </div>

                              <button onClick={() => deleteTask(task.id)} className="text-slate-300 hover:text-red-500">
                                  <Trash2 size={18} />
                              </button>
                          </div>
                      ))
                  )}
              </div>
          </div>

          {/* Sidebar / Stats */}
          <div className="bg-slate-900 text-white rounded-xl p-6 shadow-xl flex flex-col">
              <h3 className="text-xl font-bold mb-6">Ваша статистика</h3>
              
              <div className="space-y-6">
                  <div>
                      <div className="flex justify-between text-sm mb-2 text-slate-300">
                          <span>Выполнено сегодня</span>
                          <span className="text-white font-bold">{getDayTasks(selectedDate).filter(t => t.isCompleted).length} / {getDayTasks(selectedDate).length}</span>
                      </div>
                      <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-orange-500 h-full transition-all duration-500" 
                            style={{ 
                                width: `${getDayTasks(selectedDate).length > 0 
                                    ? (getDayTasks(selectedDate).filter(t => t.isCompleted).length / getDayTasks(selectedDate).length) * 100 
                                    : 0}%` 
                            }}
                          ></div>
                      </div>
                  </div>

                  <div className="pt-6 border-t border-slate-700">
                      <h4 className="font-bold mb-4 text-orange-500">Предстоящие дедлайны</h4>
                      <div className="space-y-3">
                          {sortedTasks.filter(t => !t.isCompleted && t.date > selectedDate).slice(0, 3).map(task => (
                              <div key={task.id} className="bg-slate-800 p-3 rounded-lg text-sm border-l-2 border-orange-500">
                                  <div className="flex justify-between mb-1">
                                      <span className="text-slate-300">{new Date(task.date).toLocaleDateString('ru-RU', {day:'numeric', month:'short'})}</span>
                                      <span className="text-slate-500">{task.time}</span>
                                  </div>
                                  <p className="font-medium truncate">{task.title}</p>
                              </div>
                          ))}
                          {sortedTasks.filter(t => !t.isCompleted && t.date > selectedDate).length === 0 && (
                              <p className="text-slate-500 text-xs italic">Нет предстоящих задач</p>
                          )}
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* Add Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden p-6 animate-in fade-in zoom-in duration-200">
                <h3 className="text-xl font-bold text-slate-800 mb-4">Новая задача</h3>
                <form onSubmit={handleCreateTask} className="space-y-4">
                    {/* Admin Assignment Field */}
                    {isAdmin && (
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Назначить пользователю</label>
                            <select 
                                value={assignedTo} 
                                onChange={(e) => setAssignedTo(e.target.value)}
                                className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white"
                            >
                                {usersList.map(u => (
                                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Что нужно сделать?</label>
                        <input 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                            placeholder="Название задачи"
                            required
                        />
                    </div>
                    
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Тип</label>
                            <select 
                                value={type} 
                                onChange={(e) => setType(e.target.value as TaskType)}
                                className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white"
                            >
                                {Object.values(TaskType).map(t => <option key={t} value={t}>{t}</option>)}
                            </select>
                        </div>
                        <div className="flex-1">
                             {/* DEADLINE FIELDS */}
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Дедлайн (Время)</label>
                            <input 
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                                required
                            />
                        </div>
                    </div>
                    
                    {/* DEADLINE DATE FIELD */}
                    <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Дедлайн (Дата)</label>
                         <input 
                            type="date"
                            value={formDate}
                            onChange={(e) => setFormDate(e.target.value)}
                            className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                            required
                         />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Заметки</label>
                        <textarea 
                            value={desc}
                            onChange={(e) => setDesc(e.target.value)}
                            className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm h-20 resize-none"
                            placeholder="Дополнительные детали..."
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button 
                            type="button" 
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 transition"
                        >
                            Отмена
                        </button>
                        <button 
                            type="submit" 
                            className="flex-1 bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition"
                        >
                            Сохранить
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default MyCalendar;
import React, { useState } from 'react';
import { MOCK_REQUESTS } from '../mockData';
import { RequestStatus, RequestTicket } from '../types';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, Wrench, Lock, Lightbulb, Plus, X, Save, Trash2 } from 'lucide-react';

const RequestModal = ({
  isOpen,
  onClose,
  request,
  onSave
}: {
  isOpen: boolean;
  onClose: () => void;
  request: Partial<RequestTicket> | null;
  onSave: (req: RequestTicket) => void;
}) => {
  const [formData, setFormData] = useState<Partial<RequestTicket>>({
    title: '',
    description: '',
    type: 'Проблема',
    status: RequestStatus.NEW,
    ...request
  });

  React.useEffect(() => {
    if (request) {
        setFormData({ ...request });
    } else {
        setFormData({
            title: '',
            description: '',
            type: 'Проблема',
            status: RequestStatus.NEW
        });
    }
  }, [request, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as RequestTicket);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800">{request?.id ? 'Заявка #' + request.id : 'Новая заявка'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
           <div>
             <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Тип заявки</label>
             <select 
               value={formData.type}
               onChange={(e) => setFormData({...formData, type: e.target.value as any})}
               className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white"
             >
               <option value="Проблема">Проблема</option>
               <option value="Техника">Техника</option>
               <option value="Доступ">Доступ</option>
               <option value="Предложение">Предложение</option>
             </select>
           </div>
           
           <div>
             <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Заголовок</label>
             <input 
               type="text" 
               value={formData.title}
               onChange={(e) => setFormData({...formData, title: e.target.value})}
               className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
               required
               placeholder="Краткая суть..."
             />
           </div>

           <div>
             <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Описание</label>
             <textarea 
               value={formData.description}
               onChange={(e) => setFormData({...formData, description: e.target.value})}
               className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm h-32 resize-none"
               required
               placeholder="Подробное описание ситуации..."
             />
           </div>

           {request?.id && (
             <div>
               <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Статус</label>
               <select 
                 value={formData.status}
                 onChange={(e) => setFormData({...formData, status: e.target.value as RequestStatus})}
                 className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white"
               >
                 {Object.values(RequestStatus).map(s => <option key={s} value={s}>{s}</option>)}
               </select>
             </div>
           )}

           <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition flex justify-center items-center gap-2 mt-4">
             <Save size={18} />
             {request?.id ? 'Сохранить' : 'Отправить заявку'}
           </button>
        </form>
      </div>
    </div>
  );
};

const Requests = () => {
  const { user, canEdit } = useAuth();
  const [requests, setRequests] = useState<RequestTicket[]>(MOCK_REQUESTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Partial<RequestTicket> | null>(null);

  const handleCreate = () => {
    setSelectedRequest(null);
    setIsModalOpen(true);
  };

  const handleOpen = (req: RequestTicket) => {
    setSelectedRequest(req);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if(window.confirm('Удалить эту заявку?')) {
        setRequests(requests.filter(r => r.id !== id));
    }
  };

  const handleSave = (req: RequestTicket) => {
    if (req.id) {
       // Update existing
       setRequests(requests.map(r => r.id === req.id ? req : r));
    } else {
       // Create new
       const newReq: RequestTicket = {
         ...req,
         id: Math.random().toString(36).substr(2, 9),
         authorId: user?.id || 'guest',
         createdAt: new Date().toISOString(),
         comments: []
       };
       setRequests([newReq, ...requests]);
    }
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'Проблема': return <AlertCircle className="text-red-500" size={20} />;
      case 'Техника': return <Wrench className="text-blue-500" size={20} />;
      case 'Доступ': return <Lock className="text-slate-500" size={20} />;
      case 'Предложение': return <Lightbulb className="text-amber-500" size={20} />;
      default: return <AlertCircle size={20} />;
    }
  };

  const getStatusStyle = (status: RequestStatus) => {
    switch (status) {
      case RequestStatus.NEW: return 'bg-blue-100 text-blue-700';
      case RequestStatus.IN_PROGRESS: return 'bg-amber-100 text-amber-700';
      case RequestStatus.DONE: return 'bg-green-100 text-green-700';
      case RequestStatus.REJECTED: return 'bg-red-100 text-red-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Заявки и Проблемы</h2>
        <button 
          onClick={handleCreate}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition flex items-center gap-2"
        >
          <Plus size={18} />
          Создать заявку
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
            <tr>
              <th className="px-6 py-4">Тип</th>
              <th className="px-6 py-4">Заголовок</th>
              <th className="px-6 py-4">Дата</th>
              <th className="px-6 py-4">Статус</th>
              <th className="px-6 py-4 text-right">Действие</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {requests.map(req => (
              <tr key={req.id} className="hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => handleOpen(req)}>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2" title={req.type}>
                     {getIcon(req.type)}
                     <span className="text-sm text-slate-700 hidden md:inline">{req.type}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-800">{req.title}</div>
                  <div className="text-xs text-slate-500 truncate max-w-xs">{req.description}</div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{new Date(req.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusStyle(req.status)}`}>
                    {req.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                   <div className="flex justify-end gap-2">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleOpen(req); }}
                        className="text-slate-400 hover:text-orange-600 transition font-medium text-sm"
                      >
                        Открыть
                      </button>
                      {canEdit(req.authorId) && (
                          <button 
                            onClick={(e) => handleDelete(req.id, e)}
                            className="text-slate-300 hover:text-red-500 transition"
                          >
                            <Trash2 size={18} />
                          </button>
                      )}
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <RequestModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        request={selectedRequest}
        onSave={handleSave}
      />
    </div>
  );
};

export default Requests;
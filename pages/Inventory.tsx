import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ItemCategory, ItemStatus, OwnerType, InventoryItem } from '../types';
import { Search, Plus, Battery, BatteryWarning, Save, X, User, HardDrive, Info } from 'lucide-react';

// Default empty item for creation
const NEW_ITEM: InventoryItem = {
  id: '',
  name: '',
  category: ItemCategory.CAMERA,
  serialNumber: '',
  quantity: 1,
  ownerType: OwnerType.STUDIO,
  location: 'Склад',
  status: ItemStatus.AVAILABLE,
  description: '',
  batteryLevel: 'Full',
  memoryCardStatus: 'Empty',
  history: []
};

const InventoryModal = ({ 
  item, 
  isOpen, 
  onClose, 
  onSave 
}: { 
  item: InventoryItem | null, 
  isOpen: boolean, 
  onClose: () => void, 
  onSave: (item: InventoryItem) => void 
}) => {
  const [formData, setFormData] = useState<InventoryItem | null>(null);

  React.useEffect(() => {
    if (item) {
      setFormData({ ...item });
    }
  }, [item]);

  if (!isOpen || !formData) return null;

  const isNew = !formData.id;

  const handleChange = (field: keyof InventoryItem, value: any) => {
    setFormData(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleRenterChange = (field: string, value: string) => {
    setFormData(prev => prev ? {
      ...prev,
      renter: { ...prev.renter || { name: '', phone: '' }, [field]: value }
    } : null);
  };

  // Logic to determine which fields to show based on category
  const showBattery = [ItemCategory.CAMERA, ItemCategory.LIGHT, ItemCategory.SOUND, ItemCategory.STABILIZER].includes(formData.category);
  const showMemory = [ItemCategory.CAMERA].includes(formData.category);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800 text-lg">{isNew ? 'Добавить оборудование' : formData.name}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6 overflow-y-auto">
          {/* Basic Info */}
          <div className="space-y-4">
             <div>
               <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Название</label>
               <input 
                 type="text" 
                 value={formData.name}
                 onChange={e => handleChange('name', e.target.value)}
                 className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                 placeholder="Например: Sony A7S III"
               />
             </div>

             {/* Description Field (NEW) */}
             <div>
               <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Описание / Комплектация</label>
               <textarea
                 value={formData.description || ''}
                 onChange={e => handleChange('description', e.target.value)}
                 className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm h-16 resize-none"
                 placeholder="Например: Клетка, ручка, HDMI кабель..."
               />
             </div>

             <div className="flex gap-4">
                <div className="flex-1">
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Серийный номер</label>
                   <input 
                     type="text" 
                     value={formData.serialNumber}
                     onChange={e => handleChange('serialNumber', e.target.value)}
                     className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                     placeholder="SN-XXXXX"
                   />
                </div>
                <div className="flex-1">
                   <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Категория</label>
                   <select 
                     value={formData.category}
                     onChange={e => handleChange('category', e.target.value)}
                     className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white"
                   >
                     {Object.values(ItemCategory).map(c => <option key={c} value={c}>{c}</option>)}
                   </select>
                </div>
             </div>
          </div>

          {/* Status Section */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Статус</label>
            <div className="grid grid-cols-3 gap-2">
               {[ItemStatus.AVAILABLE, ItemStatus.BUSY, ItemStatus.ON_SHOOT, ItemStatus.REPAIR, ItemStatus.BROKEN].map(status => (
                 <button
                   key={status}
                   onClick={() => handleChange('status', status)}
                   className={`py-2 px-1 text-xs font-medium rounded-lg border transition-all ${
                     formData.status === status 
                       ? 'bg-slate-800 text-white border-slate-800' 
                       : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                   }`}
                 >
                   {status}
                 </button>
               ))}
            </div>
          </div>

          {/* Renter Info - Only if Busy or On Shoot */}
          {(formData.status === ItemStatus.BUSY || formData.status === ItemStatus.ON_SHOOT) && (
            <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
               <label className="block text-xs font-bold text-orange-700 uppercase mb-3 flex items-center gap-2">
                 <User size={14}/> Данные арендатора
               </label>
               <div className="space-y-3">
                 <input 
                   type="text" 
                   placeholder="ФИО" 
                   value={formData.renter?.name || ''}
                   onChange={e => handleRenterChange('name', e.target.value)}
                   className="w-full px-3 py-2 rounded border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                 />
                 <input 
                   type="text" 
                   placeholder="Телефон" 
                   value={formData.renter?.phone || ''}
                   onChange={e => handleRenterChange('phone', e.target.value)}
                   className="w-full px-3 py-2 rounded border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                 />
                 <div className="grid grid-cols-2 gap-3">
                   <input 
                     type="text" 
                     placeholder="Telegram" 
                     value={formData.renter?.telegram || ''}
                     onChange={e => handleRenterChange('telegram', e.target.value)}
                     className="w-full px-3 py-2 rounded border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                   />
                   <input 
                     type="text" 
                     placeholder="VK" 
                     value={formData.renter?.vk || ''}
                     onChange={e => handleRenterChange('vk', e.target.value)}
                     className="w-full px-3 py-2 rounded border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                   />
                 </div>
               </div>
            </div>
          )}

          {/* Tech Check - Conditional Rendering */}
          {(showBattery || showMemory) && (
             <div>
               <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Техническое состояние</label>
               <div className="flex gap-4">
                 {showBattery && (
                     <div className="flex-1">
                        <span className="text-xs text-slate-400 mb-1 block">Заряд батареи</span>
                        <select 
                          value={formData.batteryLevel || 'Full'}
                          onChange={(e) => handleChange('batteryLevel', e.target.value)}
                          className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white"
                        >
                          <option value="Full">Полный 100%</option>
                          <option value="Low">Низкий &lt; 20%</option>
                          <option value="Empty">Разряжен</option>
                          <option value="Missing">Отсутствует</option>
                        </select>
                     </div>
                 )}
                 {showMemory && (
                     <div className="flex-1">
                        <span className="text-xs text-slate-400 mb-1 block">Карта памяти</span>
                        <select 
                          value={formData.memoryCardStatus || 'Empty'}
                          onChange={(e) => handleChange('memoryCardStatus', e.target.value)}
                          className="w-full p-2 border border-slate-200 rounded-lg text-sm bg-white"
                        >
                          <option value="Empty">Пустая (Ок)</option>
                          <option value="Full">Заполнена</option>
                          <option value="Missing">Отсутствует</option>
                        </select>
                     </div>
                 )}
               </div>
             </div>
          )}

           {/* Location */}
           <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Текущая локация</label>
              <input 
                type="text" 
                value={formData.location}
                onChange={e => handleChange('location', e.target.value)}
                className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                placeholder="Например: Шкаф А1 или Студия 1"
              />
           </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50">
          <button 
            onClick={() => onSave(formData)}
            className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition flex items-center justify-center gap-2"
          >
            <Save size={18} />
            {isNew ? 'Создать' : 'Сохранить изменения'}
          </button>
        </div>
      </div>
    </div>
  );
};

const Inventory = () => {
  const { inventory, addInventoryItem, updateInventoryItem } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const handleSaveItem = (updatedItem: InventoryItem) => {
    if (!updatedItem.id) {
        // Create new
        const newItem = { ...updatedItem, id: Math.random().toString(36).substr(2, 9) };
        addInventoryItem(newItem);
    } else {
        // Update existing
        updateInventoryItem(updatedItem.id, updatedItem);
    }
    setSelectedItem(null);
  };

  const handleCreate = () => {
    setSelectedItem({ ...NEW_ITEM });
  };

  const filteredItems = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.serialNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: ItemStatus) => {
    switch (status) {
      case ItemStatus.AVAILABLE: return 'bg-green-100 text-green-700';
      case ItemStatus.BUSY: return 'bg-blue-100 text-blue-700';
      case ItemStatus.ON_SHOOT: return 'bg-orange-100 text-orange-700';
      case ItemStatus.REPAIR: return 'bg-amber-100 text-amber-700';
      case ItemStatus.BROKEN: return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getOwnerBadge = (type: OwnerType, name?: string) => {
     switch (type) {
       case OwnerType.STUDIO: return <span className="text-xs font-semibold px-2 py-1 rounded border border-slate-200 text-slate-600">Студия NewVision</span>;
       case OwnerType.PRODUCER_CENTER: return <span className="text-xs font-semibold px-2 py-1 rounded border border-purple-200 text-purple-600 bg-purple-50">Продюсерский центр</span>;
       case OwnerType.PERSONAL: return <span className="text-xs font-semibold px-2 py-1 rounded border border-orange-200 text-orange-600 bg-orange-50">Личное: {name}</span>;
     }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-800">Инвентарь и Техника</h2>
        <button 
          onClick={handleCreate}
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
        >
          <Plus size={18} />
          Добавить
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Поиск по названию или SN..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          <select 
            className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">Все категории</option>
            {Object.values(ItemCategory).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select 
            className="px-4 py-2 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Все статусы</option>
            {Object.values(ItemStatus).map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Название / SN</th>
                <th className="px-6 py-4">Категория</th>
                <th className="px-6 py-4">Владелец</th>
                <th className="px-6 py-4">Локация</th>
                <th className="px-6 py-4">Статус</th>
                <th className="px-6 py-4 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map(item => {
                  const showBattery = [ItemCategory.CAMERA, ItemCategory.LIGHT, ItemCategory.SOUND, ItemCategory.STABILIZER].includes(item.category);
                  const showMemory = [ItemCategory.CAMERA].includes(item.category);

                  return (
                    <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-medium text-slate-800">{item.name}</div>
                        <div className="text-xs text-slate-400">{item.serialNumber}</div>
                        {item.description && (
                           <div className="text-[10px] text-slate-500 mt-1 max-w-[200px] truncate flex items-center gap-1">
                              <Info size={10} /> {item.description}
                           </div>
                        )}
                        
                        <div className="flex gap-2 mt-1">
                            {/* Battery Status */}
                            {showBattery && item.batteryLevel === 'Empty' && (
                              <span title="Батарея разряжена">
                                <Battery size={14} className="text-red-500" />
                              </span>
                            )}
                            {showBattery && item.batteryLevel === 'Missing' && (
                              <span title="Нет аккумулятора">
                                <BatteryWarning size={14} className="text-slate-400" />
                              </span>
                            )}

                            {/* Memory Status */}
                            {showMemory && item.memoryCardStatus === 'Missing' && (
                                <span title="Нет карты памяти">
                                    <HardDrive size={14} className="text-slate-400" />
                                </span>
                            )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{item.category}</td>
                      <td className="px-6 py-4">
                        {getOwnerBadge(item.ownerType, item.ownerName)}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{item.location}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                        {(item.status === ItemStatus.BUSY || item.status === ItemStatus.ON_SHOOT) && item.renter && (
                           <div className="text-[10px] text-slate-500 mt-1">
                             {item.renter.name}
                           </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => setSelectedItem(item)}
                          className="text-orange-500 hover:text-orange-700 text-sm font-medium"
                        >
                          Детали
                        </button>
                      </td>
                    </tr>
                  );
              })}
              {filteredItems.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                    Ничего не найдено
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <InventoryModal 
        isOpen={!!selectedItem}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onSave={handleSaveItem}
      />
    </div>
  );
};

export default Inventory;
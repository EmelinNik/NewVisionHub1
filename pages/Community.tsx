import React, { useState } from 'react';
import { WishlistItem, Comment } from '../types';
import { useAuth } from '../context/AuthContext';
import { ThumbsUp, MessageCircle, Send, Plus, X, User, Trash2, Edit2, ShieldCheck } from 'lucide-react';

const WishlistModal = ({ 
  isOpen, 
  onClose, 
  onSave,
  initialData
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onSave: (title: string, description: string, category: string) => void;
  initialData?: WishlistItem;
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Пространство');

  React.useEffect(() => {
    if (isOpen) {
        if (initialData) {
            setTitle(initialData.title);
            setDescription(initialData.description);
            setCategory(initialData.category);
        } else {
            setTitle('');
            setDescription('');
            setCategory('Пространство');
        }
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(title, description, category);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h3 className="font-bold text-slate-800">{initialData ? 'Редактировать' : 'Новое пожелание'}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
           <div>
             <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Категория</label>
             <select 
               value={category}
               onChange={(e) => setCategory(e.target.value)}
               className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm bg-white"
             >
               <option value="Пространство">Пространство</option>
               <option value="Техника">Техника</option>
               <option value="Процессы">Процессы</option>
               <option value="Мероприятия">Мероприятия</option>
             </select>
           </div>
           <div>
             <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Заголовок</label>
             <input 
               value={title}
               onChange={(e) => setTitle(e.target.value)}
               className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
               placeholder="Краткая идея"
               required
             />
           </div>
           <div>
             <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Описание</label>
             <textarea 
               value={description}
               onChange={(e) => setDescription(e.target.value)}
               className="w-full px-3 py-2 rounded border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm h-32 resize-none"
               placeholder="Почему это важно?"
               required
             />
           </div>
           <button type="submit" className="w-full bg-orange-500 text-white py-3 rounded-xl font-bold hover:bg-orange-600 transition">
             {initialData ? 'Сохранить изменения' : 'Опубликовать'}
           </button>
        </form>
      </div>
    </div>
  );
};

interface WishCardProps {
    item: WishlistItem;
    onVote: (id: string) => void;
    onAddComment: (id: string, text: string) => void;
    onDeleteComment: (itemId: string, commentId: string) => void;
    onDelete: (id: string) => void;
    onEdit: (item: WishlistItem) => void;
}

const WishCard: React.FC<WishCardProps> = ({ 
    item, 
    onVote, 
    onAddComment, 
    onDeleteComment,
    onDelete,
    onEdit
}) => {
  const { user, canEdit } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);
  const [commentText, setCommentText] = useState('');

  const canModifyItem = canEdit('') || (user && item.authorName === user.name);
  const hasVoted = user ? item.votedUserIds.includes(user.id) : false;

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      onAddComment(item.id, commentText);
      setCommentText('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Реализовано': return 'bg-green-100 text-green-700';
      case 'В работе': return 'bg-blue-100 text-blue-700';
      case 'Рассмотрение': return 'bg-purple-100 text-purple-700';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col h-full group relative">
       {/* Actions for Item */}
       {canModifyItem && (
         <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => onEdit(item)} className="p-1.5 bg-slate-100 text-slate-500 rounded-full hover:bg-blue-100 hover:text-blue-600">
                <Edit2 size={14}/>
            </button>
            <button onClick={() => onDelete(item.id)} className="p-1.5 bg-slate-100 text-slate-500 rounded-full hover:bg-red-100 hover:text-red-600">
                <Trash2 size={14}/>
            </button>
         </div>
       )}

       {/* Header */}
       <div className="flex justify-between items-start mb-4">
         <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>
           {item.status}
         </span>
         <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded mr-16">{item.category}</span>
       </div>
       
       <h3 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h3>
       <p className="text-slate-600 text-sm mb-4 flex-1">{item.description}</p>
       
       {/* Author & Actions */}
       <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-auto">
         <div className="flex items-center gap-2 text-xs text-slate-500">
            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center">
               <User size={14} className="text-slate-500"/>
            </div>
            <div className="flex flex-col">
              <span className="font-medium text-slate-700">{item.authorName}</span>
              <span className="text-[10px]">{new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
         </div>
         
         <div className="flex gap-2">
           <button 
             onClick={() => setIsExpanded(!isExpanded)}
             className={`flex items-center gap-1.5 px-2 py-1 rounded-lg transition text-sm ${isExpanded ? 'bg-slate-100 text-slate-800' : 'text-slate-400 hover:text-orange-600'}`}
           >
             <MessageCircle size={18} />
             <span>{item.comments.length}</span>
           </button>
           <button 
              onClick={() => onVote(item.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full transition text-sm font-medium ${
                  hasVoted 
                  ? 'bg-orange-500 text-white shadow-md shadow-orange-200' 
                  : 'text-orange-600 bg-orange-50 hover:bg-orange-100'
              }`}
           >
             <ThumbsUp size={16} fill={hasVoted ? "currentColor" : "none"} />
             <span>{item.votedUserIds.length}</span>
           </button>
         </div>
       </div>

       {/* Comments Section */}
       {isExpanded && (
         <div className="mt-4 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="space-y-3 mb-4 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
              {item.comments.length === 0 && <p className="text-xs text-slate-400 italic">Нет комментариев. Будьте первым!</p>}
              {item.comments.map(comment => (
                <div key={comment.id} className={`p-2 rounded-lg text-sm relative group/comment ${comment.isAdminResponse ? 'bg-blue-50 border border-blue-100' : 'bg-slate-50'}`}>
                   <div className="flex justify-between items-baseline mb-1">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold text-xs ${comment.isAdminResponse ? 'text-blue-800' : 'text-slate-700'}`}>{comment.userName}</span>
                        {comment.isAdminResponse && (
                           <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[9px] font-bold uppercase tracking-wider">
                             <ShieldCheck size={10} />
                             Официальный ответ
                           </span>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-400">{comment.date}</span>
                   </div>
                   <p className="text-slate-600 pr-4">{comment.text}</p>
                   
                   {canEdit(comment.userId) && (
                       <button 
                         onClick={() => onDeleteComment(item.id, comment.id)}
                         className="absolute top-2 right-2 text-slate-300 hover:text-red-500 opacity-0 group-hover/comment:opacity-100 transition-opacity"
                       >
                           <X size={14} />
                       </button>
                   )}
                </div>
              ))}
            </div>
            <form onSubmit={handleCommentSubmit} className="flex gap-2">
               <input 
                 type="text" 
                 value={commentText}
                 onChange={(e) => setCommentText(e.target.value)}
                 placeholder="Ваш комментарий..."
                 className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
               />
               <button type="submit" disabled={!commentText.trim()} className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 disabled:opacity-50">
                 <Send size={16} />
               </button>
            </form>
         </div>
       )}
    </div>
  );
};

const Community = () => {
  const { user, isAdmin, addNotification, wishlist, addWishlistItem, updateWishlistItem, deleteWishlistItem } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WishlistItem | undefined>(undefined);

  const handleVote = (id: string) => {
    if (!user) return;
    const item = wishlist.find(i => i.id === id);
    if (!item) return;

    const hasVoted = item.votedUserIds.includes(user.id);
    let newVotedIds;
    if (hasVoted) {
        newVotedIds = item.votedUserIds.filter(uid => uid !== user.id);
    } else {
        newVotedIds = [...item.votedUserIds, user.id];
    }
    updateWishlistItem(id, { votedUserIds: newVotedIds });
  };

  const handleSave = (title: string, description: string, category: string) => {
    if (editingItem) {
        updateWishlistItem(editingItem.id, { title, description, category: category as any });
    } else {
        const newItem: WishlistItem = {
            id: Math.random().toString(36).substr(2, 9),
            title,
            description,
            category: category as any,
            votedUserIds: [],
            status: 'Идея',
            authorName: user?.name || 'Аноним',
            authorId: user?.id,
            createdAt: new Date().toISOString(),
            comments: []
        };
        addWishlistItem(newItem);
    }
    setIsModalOpen(false);
    setEditingItem(undefined);
  };

  const handleDelete = (id: string) => {
      if(window.confirm("Удалить это пожелание?")) {
          deleteWishlistItem(id);
      }
  };

  const handleEdit = (item: WishlistItem) => {
      setEditingItem(item);
      setIsModalOpen(true);
  };

  const handleAddComment = (id: string, text: string) => {
    if (!user) return;
    
    const targetItem = wishlist.find(i => i.id === id);
    if(!targetItem) return;

    const newComment: Comment = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      userName: user.name,
      text,
      date: new Date().toLocaleDateString(),
      isAdminResponse: isAdmin // Flag if it's an admin reply
    };
    
    updateWishlistItem(id, { comments: [...targetItem.comments, newComment] });

    // Send Notification to Author if it's an Admin replying
    if (isAdmin && targetItem.authorId && targetItem.authorId !== user.id) {
        addNotification(
            targetItem.authorId,
            `Администратор ${user.name} ответил на ваше пожелание "${targetItem.title}"`,
            'info'
        );
    }
  };

  const handleDeleteComment = (itemId: string, commentId: string) => {
    if(window.confirm("Удалить комментарий?")) {
        const item = wishlist.find(i => i.id === itemId);
        if(item) {
            updateWishlistItem(itemId, { comments: item.comments.filter(c => c.id !== commentId) });
        }
    }
  };

  const handleOpenCreate = () => {
      setEditingItem(undefined);
      setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
         <div>
            <h2 className="text-2xl font-bold text-slate-800">Пожелания и Идеи</h2>
            <p className="text-slate-500 text-sm">Голосуйте за идеи улучшения нашей студии или предлагайте свои.</p>
         </div>
         <button 
           onClick={handleOpenCreate}
           className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition flex items-center gap-2 font-medium shadow-sm shadow-orange-200"
         >
           <Plus size={18} />
           Предложить идею
         </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {wishlist.map(item => (
           <WishCard 
              key={item.id} 
              item={item} 
              onVote={handleVote} 
              onAddComment={handleAddComment} 
              onDeleteComment={handleDeleteComment}
              onDelete={handleDelete}
              onEdit={handleEdit}
           />
         ))}
      </div>

      <WishlistModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingItem}
      />
    </div>
  );
};

export default Community;
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole, UserTask, Notification, Booking, InventoryItem, RequestTicket, WishlistItem, Event } from '../types';
import { supabase } from '../supabase';

export const SUPER_ADMIN_EMAIL = 'emelinnikita99@gmail.com';

interface AuthContextType {
  user: User | null;
  usersList: User[];
  connectionError: boolean;
  login: (email: string, password?: string) => Promise<{success: boolean; error?: string}>;
  initiateRegistration: (name: string, email: string, password?: string, telegramId?: string) => string;
  confirmEmail: (code: string) => Promise<boolean>;
  initiatePasswordReset: (email: string) => string | null;
  confirmPasswordReset: (code: string, newPassword: string) => Promise<boolean>;
  adminUpdatePassword: (userId: string, newPassword: string) => Promise<void>;
  logout: () => void;
  changeRole: (role: UserRole) => void;
  updateUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => void;
  isAdmin: boolean;
  canEdit: (ownerId: string) => boolean;
  pendingUser: any;
  tasks: UserTask[];
  addTask: (task: UserTask) => void;
  toggleTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, data: Partial<Booking>) => void;
  deleteBooking: (id: string) => void;
  inventory: InventoryItem[];
  addInventoryItem: (item: InventoryItem) => void;
  updateInventoryItem: (id: string, data: Partial<InventoryItem>) => void;
  requests: RequestTicket[];
  addRequest: (req: RequestTicket) => void;
  updateRequest: (id: string, data: Partial<RequestTicket>) => void;
  deleteRequest: (id: string) => void;
  wishlist: WishlistItem[];
  addWishlistItem: (item: WishlistItem) => void;
  updateWishlistItem: (id: string, data: Partial<WishlistItem>) => void;
  deleteWishlistItem: (id: string) => void;
  events: Event[];
  addEvent: (event: Event) => void;
  updateEvent: (id: string, data: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  notifications: Notification[];
  addNotification: (userId: string, text: string, type?: 'info' | 'alert' | 'success') => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mapProfileToUser = (p: any): User => ({
  id: p.id,
  name: p.full_name || 'Без имени',
  email: p.email,
  role: (p.role as UserRole) || UserRole.BLOGGER,
  avatarUrl: p.avatar_url,
  isVerified: p.is_verified,
  isEmailVerified: true, 
  telegramId: p.telegram_id
});

const mapTask = (t: any): UserTask => ({ id: t.id, userId: t.user_id, title: t.title, description: t.description, date: t.date, time: t.time, isCompleted: t.is_completed, type: t.type, assignedBy: t.assigned_by });
const mapBooking = (b: any): Booking => ({ id: b.id, userId: b.user_id, resourceId: b.resource_id, resourceName: b.resource_name, type: b.type, startTime: b.start_time, endTime: b.end_time, status: b.status, clientInfo: b.client_info, comment: b.comment });
const mapInventory = (i: any): InventoryItem => ({ id: i.id, name: i.name, category: i.category, serialNumber: i.serial_number, quantity: i.quantity, ownerType: i.owner_type, ownerName: i.owner_name, location: i.location, status: i.status, description: i.description, batteryLevel: i.battery_level, memoryCardStatus: i.memory_card_status, renter: i.renter, history: [] });
const mapRequest = (r: any): RequestTicket => ({ id: r.id, authorId: r.author_id, title: r.title, description: r.description, type: r.type, status: r.status, createdAt: r.created_at, comments: r.comments || [] });
const mapWishlist = (w: any): WishlistItem => ({ id: w.id, title: w.title, description: w.description, category: w.category, votedUserIds: w.voted_user_ids || [], status: w.status, authorName: w.author_name, authorId: w.author_id, createdAt: w.created_at, comments: w.comments || [] });
const mapEvent = (e: any): Event => ({ id: e.id, title: e.title, description: e.description, date: e.date, image: e.image, location: e.location, capacity: e.capacity, registeredCount: e.registered_count || 0 });
const mapNotification = (n: any): Notification => ({ id: n.id, userId: n.user_id, text: n.text, isRead: n.is_read, date: n.date, type: n.type });

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [tasks, setTasks] = useState<UserTask[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [requests, setRequests] = useState<RequestTicket[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pendingUser, setPendingUser] = useState<any>(null);
  const [connectionError, setConnectionError] = useState<boolean>(false);

  useEffect(() => {
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchUserProfile(session.user.id);
        await fetchData();
      }
    };
    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserProfile(session.user.id);
        fetchData();
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (data && !error) {
      setUser(mapProfileToUser(data));
    }
  };

  const fetchData = async () => {
    try {
      const results = await Promise.allSettled([
        supabase.from('profiles').select('*'),
        supabase.from('tasks').select('*'),
        supabase.from('bookings').select('*'),
        supabase.from('inventory').select('*'),
        supabase.from('requests').select('*'),
        supabase.from('wishlist').select('*'),
        supabase.from('events').select('*'),
        supabase.from('notifications').select('*')
      ]);
      const [uRes, tRes, bRes, iRes, rRes, wRes, eRes, nRes] = results;
      const isSuccess = (res: any): res is PromiseFulfilledResult<any> => res.status === 'fulfilled' && res.value && !res.value.error;

      if (isSuccess(uRes)) setUsersList(uRes.value.data.map(mapProfileToUser));
      if (isSuccess(tRes)) setTasks(tRes.value.data.map(mapTask));
      if (isSuccess(bRes)) setBookings(bRes.value.data.map(mapBooking));
      if (isSuccess(iRes)) setInventory(iRes.value.data.map(mapInventory));
      if (isSuccess(rRes)) setRequests(rRes.value.data.map(mapRequest));
      if (isSuccess(wRes)) setWishlist(wRes.value.data.map(mapWishlist));
      if (isSuccess(eRes)) setEvents(eRes.value.data.map(mapEvent));
      if (isSuccess(nRes)) setNotifications(nRes.value.data.map(mapNotification));
      setConnectionError(false);
    } catch (e) {
      setConnectionError(true);
    }
  };

  const login = async (email: string, password?: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: password || '' });
    if (error) return { success: false, error: error.message };
    await fetchUserProfile(data.user.id);
    await fetchData();
    return { success: true };
  };

  const initiateRegistration = (name: string, email: string, password?: string, telegramId?: string) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setPendingUser({ name, email: email.trim(), code, telegramId, password });
    return code;
  };

  const confirmEmail = async (code: string) => {
    if (!pendingUser || pendingUser.code !== code) return false;
    
    const { data, error } = await supabase.auth.signUp({
      email: pendingUser.email,
      password: pendingUser.password,
      options: { data: { full_name: pendingUser.name } }
    });

    if (error || !data.user) return false;
    
    // Create profile manually if trigger didn't fire
    await supabase.from('profiles').insert({
        id: data.user.id,
        email: pendingUser.email,
        full_name: pendingUser.name,
        role: UserRole.BLOGGER,
        is_verified: false,
        telegram_id: pendingUser.telegramId
    });

    setPendingUser(null);
    return true;
  };

  const logout = async () => { await supabase.auth.signOut(); setUser(null); };

  const updateUser = async (id: string, data: Partial<User>) => {
    const dbData: any = {};
    if (data.name) dbData.full_name = data.name;
    if (data.role) dbData.role = data.role;
    if (data.avatarUrl) dbData.avatar_url = data.avatarUrl;
    if (data.isVerified !== undefined) dbData.is_verified = data.isVerified;
    await supabase.from('profiles').update(dbData).eq('id', id);
    fetchData();
  };

  const addTask = async (t: UserTask) => { await supabase.from('tasks').insert({ user_id: t.userId, title: t.title, description: t.description, date: t.date, time: t.time, is_completed: t.isCompleted, type: t.type, assigned_by: t.assignedBy }); fetchData(); };
  const toggleTask = async (taskId: string) => { const t = tasks.find(x => x.id === taskId); if (t) { await supabase.from('tasks').update({ is_completed: !t.isCompleted }).eq('id', taskId); fetchData(); } };
  const deleteTask = async (taskId: string) => { await supabase.from('tasks').delete().eq('id', taskId); fetchData(); };
  const addBooking = async (b: Booking) => { await supabase.from('bookings').insert({ user_id: b.userId, resource_id: b.resourceId, resource_name: b.resourceName, type: b.type, start_time: b.startTime, end_time: b.endTime, status: b.status, client_info: b.clientInfo, comment: b.comment }); fetchData(); };
  const updateBooking = async (id: string, data: Partial<Booking>) => { await supabase.from('bookings').update(data).eq('id', id); fetchData(); };
  const deleteBooking = async (id: string) => { await supabase.from('bookings').delete().eq('id', id); fetchData(); };
  const addInventoryItem = async (i: InventoryItem) => { await supabase.from('inventory').insert({ name: i.name, category: i.category, serial_number: i.serialNumber, quantity: i.quantity, owner_type: i.ownerType, location: i.location, status: i.status, description: i.description, battery_level: i.batteryLevel, memory_card_status: i.memoryCardStatus, renter: i.renter }); fetchData(); };
  const updateInventoryItem = async (id: string, data: Partial<InventoryItem>) => { await supabase.from('inventory').update(data).eq('id', id); fetchData(); };
  const addRequest = async (r: RequestTicket) => { await supabase.from('requests').insert({ author_id: r.authorId, title: r.title, description: r.description, type: r.type, status: r.status, comments: r.comments }); fetchData(); };
  const updateRequest = async (id: string, data: Partial<RequestTicket>) => { await supabase.from('requests').update(data).eq('id', id); fetchData(); };
  const deleteRequest = async (id: string) => { await supabase.from('requests').delete().eq('id', id); fetchData(); };
  const addWishlistItem = async (w: WishlistItem) => { await supabase.from('wishlist').insert({ title: w.title, description: w.description, category: w.category, status: w.status, author_name: w.authorName, author_id: w.authorId, voted_user_ids: w.votedUserIds, comments: w.comments }); fetchData(); };
  const updateWishlistItem = async (id: string, data: Partial<WishlistItem>) => { await supabase.from('wishlist').update(data).eq('id', id); fetchData(); };
  const deleteWishlistItem = async (id: string) => { await supabase.from('wishlist').delete().eq('id', id); fetchData(); };
  const addEvent = async (e: Event) => { await supabase.from('events').insert({ title: e.title, description: e.description, date: e.date, image: e.image, location: e.location, capacity: e.capacity, registered_count: e.registeredCount }); fetchData(); };
  const updateEvent = async (id: string, data: Partial<Event>) => { await supabase.from('events').update(data).eq('id', id); fetchData(); };
  const deleteEvent = async (id: string) => { await supabase.from('events').delete().eq('id', id); fetchData(); };
  const addNotification = async (userId: string, text: string, type: any = 'info') => { await supabase.from('notifications').insert({ user_id: userId, text, type, is_read: false, date: new Date().toISOString() }); fetchData(); };
  const markAsRead = async (id: string) => { await supabase.from('notifications').update({ is_read: true }).eq('id', id); fetchData(); };
  const markAllAsRead = async () => { if (user) { await supabase.from('notifications').update({ is_read: true }).eq('user_id', user.id); fetchData(); } };

  const isAdmin = user ? [UserRole.STUDIO_ADMIN, UserRole.TECH_ADMIN, UserRole.PRODUCER_ADMIN].includes(user.role) : false;
  const canEdit = (ownerId: string) => isAdmin || (user?.id === ownerId);

  return (
    <AuthContext.Provider value={{
      user, usersList, connectionError, login, initiateRegistration, confirmEmail, logout, changeRole: (r) => updateUser(user?.id || '', {role: r}), updateUser, deleteUser: (id) => { supabase.from('profiles').delete().eq('id', id); fetchData(); }, isAdmin, canEdit, pendingUser,
      initiatePasswordReset: () => null, confirmPasswordReset: async () => true, adminUpdatePassword: async () => {},
      tasks, addTask, toggleTask, deleteTask,
      bookings, addBooking, updateBooking, deleteBooking,
      inventory, addInventoryItem, updateInventoryItem,
      requests, addRequest, updateRequest, deleteRequest,
      wishlist, addWishlistItem, updateWishlistItem, deleteWishlistItem,
      events, addEvent, updateEvent, deleteEvent,
      notifications, addNotification, markAsRead, markAllAsRead
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
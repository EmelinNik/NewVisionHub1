export enum UserRole {
  BLOGGER = 'Blogger',
  STUDIO_ADMIN = 'Studio Admin',
  PRODUCER_ADMIN = 'Producer Admin',
  TECH_ADMIN = 'Tech Admin'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  isVerified?: boolean; // Admin verification status
  isEmailVerified?: boolean; // Email confirmation status
  telegramId?: string;
  password?: string; // Added field for auth simulation
}

export enum ItemCategory {
  CAMERA = 'Камера',
  LIGHT = 'Свет',
  SOUND = 'Звук',
  STABILIZER = 'Стабилизатор',
  ACCESSORY = 'Аксессуары',
  LENS = 'Объектив'
}

export enum OwnerType {
  STUDIO = 'Видеостудия',
  PRODUCER_CENTER = 'Продюсерский центр',
  PERSONAL = 'Личная'
}

export enum ItemStatus {
  AVAILABLE = 'Доступно',
  BUSY = 'Занято',
  ON_SHOOT = 'На съёмке',
  REPAIR = 'На ремонте',
  BROKEN = 'Сломано'
}

export interface RenterInfo {
  name: string;
  phone: string;
  vk?: string;
  telegram?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: ItemCategory;
  serialNumber: string;
  quantity: number;
  ownerType: OwnerType;
  ownerName?: string; // If personal
  location: string;
  status: ItemStatus;
  responsibleId?: string;
  
  // New Field Added Here
  description?: string; 
  
  // Tech details
  batteryLevel?: 'Full' | 'Low' | 'Empty' | 'Missing';
  memoryCardStatus?: 'Empty' | 'Full' | 'Missing';
  
  // Renter details (if busy/on shoot)
  renter?: RenterInfo;
  
  history: ItemHistory[];
}

export interface ItemHistory {
  date: string;
  action: string;
  userId: string;
  userName: string;
}

export enum BookingType {
  ROOM = 'Помещение',
  EQUIPMENT = 'Оборудование'
}

export enum RoomType {
  MEETING = 'Переговорка',
  STUDIO = 'Студия',
  PODCAST = 'Подкаст-зона'
}

export enum BookingStatus {
  PLANNED = 'Запланировано',
  ACTIVE = 'Активно',
  COMPLETED = 'Завершено',
  CANCELLED = 'Отменено'
}

export interface ClientInfo {
  name: string;
  phone: string;
  vk?: string;
  telegram?: string;
}

export interface Booking {
  id: string;
  userId: string;
  resourceId: string; // Room ID or list of Item IDs
  resourceName: string;
  type: BookingType;
  startTime: string;
  endTime: string;
  status: BookingStatus;
  clientInfo?: ClientInfo; 
  
  // New Field Added Here
  comment?: string;
}

export enum RequestStatus {
  NEW = 'Новая',
  IN_PROGRESS = 'В работе',
  DONE = 'Выполнено',
  REJECTED = 'Отклонено'
}

export interface RequestTicket {
  id: string;
  authorId: string;
  title: string;
  description: string;
  type: 'Проблема' | 'Техника' | 'Доступ' | 'Предложение';
  status: RequestStatus;
  assignedTo?: string;
  comments: Comment[];
  createdAt: string;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  text: string;
  date: string;
  isAdminResponse?: boolean; // New field for official admin replies
}

export interface WishlistItem {
  id: string;
  title: string;
  description: string;
  category: 'Пространство' | 'Техника' | 'Процессы' | 'Мероприятия';
  votedUserIds: string[]; // Changed from votes number to array of user IDs
  status: 'Идея' | 'Рассмотрение' | 'В работе' | 'Реализовано';
  authorName: string;
  authorId?: string; // Added to enable notifications
  comments: Comment[];
  createdAt: string;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // ISO string
  image: string;
  location: string;
  capacity: number;
  registeredCount: number;
}

// --- New Types for Notifications & Planner ---

export interface Notification {
  id: string;
  userId: string; // Recipient
  text: string;
  isRead: boolean;
  date: string;
  type: 'info' | 'alert' | 'success';
}

export enum TaskType {
  POST = 'Публикация',
  MEETING = 'Встреча',
  SHOOTING = 'Съёмка',
  WORKSHOP = 'Мастер-класс',
  OTHER = 'Другое'
}

export interface UserTask {
  id: string;
  userId: string; // Owner of the task
  title: string;
  description?: string;
  date: string; // ISO date string YYYY-MM-DD
  time?: string; // HH:mm
  isCompleted: boolean;
  type: TaskType;
  assignedBy?: string; // Name of admin who assigned it, if any
}
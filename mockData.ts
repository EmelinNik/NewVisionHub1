import { User, UserRole, InventoryItem, ItemCategory, OwnerType, ItemStatus, Booking, BookingType, BookingStatus, RequestTicket, RequestStatus, WishlistItem, Event, UserTask, TaskType, Notification } from './types';

// Pre-defined users
export const MOCK_USERS: User[] = [
  {
    id: 'admin1',
    name: 'Никита',
    email: 'emelinnikita99@gmail.com',
    role: UserRole.TECH_ADMIN,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nikita',
    isVerified: true,
    isEmailVerified: true
  },
  {
    id: 'admin2',
    name: 'Даниил',
    email: 'daniil@hub.com',
    role: UserRole.PRODUCER_ADMIN,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Daniil',
    isVerified: true,
    isEmailVerified: true
  },
  {
    id: 'admin3',
    name: 'Виктория',
    email: 'victoria@hub.com',
    role: UserRole.STUDIO_ADMIN,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Victoria',
    isVerified: true,
    isEmailVerified: true
  },
  {
    id: 'u1',
    name: 'Алексей Смирнов',
    email: 'alex@blog.com',
    role: UserRole.BLOGGER,
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    isVerified: true,
    isEmailVerified: true
  }
];

export const CURRENT_USER: User = MOCK_USERS[3]; // Default logic replaced in AuthContext

export const MOCK_INVENTORY: InventoryItem[] = [
  {
    id: 'i1',
    name: 'Sony A7S III',
    category: ItemCategory.CAMERA,
    serialNumber: 'SN-993821',
    quantity: 1,
    ownerType: OwnerType.STUDIO,
    location: 'Шкаф А1',
    status: ItemStatus.AVAILABLE,
    batteryLevel: 'Full',
    memoryCardStatus: 'Empty',
    history: []
  },
  {
    id: 'i2',
    name: 'Aputure 300d II',
    category: ItemCategory.LIGHT,
    serialNumber: 'AP-2211',
    quantity: 2,
    ownerType: OwnerType.PRODUCER_CENTER,
    location: 'Студия 1',
    status: ItemStatus.ON_SHOOT,
    responsibleId: 'admin2',
    renter: {
      name: 'Даниил Денисов',
      phone: '+79990001122',
      telegram: '@dan_den'
    },
    history: []
  },
  {
    id: 'i3',
    name: 'Rode PodMic',
    category: ItemCategory.SOUND,
    serialNumber: 'RD-555',
    quantity: 4,
    ownerType: OwnerType.PERSONAL,
    ownerName: 'Никита',
    location: 'Подкаст-зона',
    status: ItemStatus.AVAILABLE,
    history: []
  },
  {
    id: 'i4',
    name: 'Sigma 24-70mm f/2.8',
    category: ItemCategory.LENS,
    serialNumber: 'SG-1234',
    quantity: 1,
    ownerType: OwnerType.STUDIO,
    location: 'Ремонт',
    status: ItemStatus.REPAIR,
    history: []
  }
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b1',
    userId: 'u1',
    resourceId: 'r1',
    resourceName: 'Студия (Циклорама)',
    type: BookingType.ROOM,
    startTime: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(), // Today 10:00
    endTime: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
    status: BookingStatus.PLANNED,
    clientInfo: {
      name: 'Алексей Смирнов',
      phone: '+79001112233',
      telegram: '@alex_sm'
    }
  },
  {
    id: 'b2',
    userId: 'admin2',
    resourceId: 'i1',
    resourceName: 'Sony A7S III + Kit',
    type: BookingType.EQUIPMENT,
    startTime: new Date(new Date().setHours(13, 30, 0, 0)).toISOString(), // Today 13:30
    endTime: new Date(new Date().setHours(18, 0, 0, 0)).toISOString(),
    status: BookingStatus.ACTIVE,
    clientInfo: {
      name: 'Иван Петров (Продакшн)',
      phone: '+79998887766'
    }
  },
  {
    id: 'b3',
    userId: 'u1',
    resourceId: 'r2',
    resourceName: 'Подкаст-зона',
    type: BookingType.ROOM,
    startTime: new Date(new Date().setHours(15, 0, 0, 0)).toISOString(), // Today 15:00
    endTime: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(),
    status: BookingStatus.PLANNED,
    clientInfo: {
        name: 'Алексей Смирнов',
        phone: '+79001112233'
    }
  },
  {
    id: 'b4',
    userId: 'admin3',
    resourceId: 'r3',
    resourceName: 'Переговорка',
    type: BookingType.ROOM,
    startTime: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(), // Tomorrow
    endTime: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    status: BookingStatus.PLANNED
  }
];

export const MOCK_REQUESTS: RequestTicket[] = [
  {
    id: 't1',
    authorId: 'admin2',
    title: 'Сломан штатив Manfrotto',
    description: 'У штатива в студии 2 отвалилась ручка фиксации.',
    type: 'Проблема',
    status: RequestStatus.NEW,
    createdAt: '2023-10-25',
    comments: []
  },
  {
    id: 't2',
    authorId: 'u1',
    title: 'Закупка RGB палок',
    description: 'Для съемок клипов не хватает цветного света.',
    type: 'Предложение',
    status: RequestStatus.IN_PROGRESS,
    createdAt: '2023-10-20',
    comments: []
  }
];

export const MOCK_WISHLIST: WishlistItem[] = [
  {
    id: 'w1',
    title: 'Кофемашина в лаунж-зону',
    description: 'Очень нужен хороший кофе для гостей и команды.',
    category: 'Пространство',
    votedUserIds: ['admin2', 'admin3', 'u1', 'admin1'], // Replaced votes: 24 with real array
    status: 'Рассмотрение',
    authorName: 'Виктория',
    authorId: 'admin3',
    createdAt: '2023-10-20',
    comments: [
      {
        id: 'c1',
        userId: 'admin2',
        userName: 'Даниил',
        text: 'Поддерживаю! Капсульная была бы супер.',
        date: '2023-10-21',
        isAdminResponse: true
      }
    ]
  },
  {
    id: 'w2',
    title: 'Мастер-класс по свету',
    description: 'Пригласить гаффера для обучения новичков.',
    category: 'Мероприятия',
    votedUserIds: ['u1', 'admin1'],
    status: 'Идея',
    authorName: 'Алексей Смирнов',
    authorId: 'u1',
    createdAt: '2023-10-22',
    comments: []
  }
];

export const MOCK_EVENTS: Event[] = [
  {
    id: 'e1',
    title: 'Воркшоп: Съемка еды',
    description: 'Учимся ставить свет для фуд-съемки с топовым фуд-стилистом.',
    date: '2023-11-05T12:00:00',
    image: 'https://picsum.photos/id/292/600/400',
    location: 'Студия 1',
    capacity: 20,
    registeredCount: 15
  },
  {
    id: 'e2',
    title: 'Нетворкинг блогеров',
    description: 'Вечер знакомств, пицца и обмен опытом продвижения.',
    date: '2023-11-10T18:00:00',
    image: 'https://picsum.photos/id/338/600/400',
    location: 'Лаунж-зона',
    capacity: 50,
    registeredCount: 32
  }
];

export const MOCK_TASKS: UserTask[] = [
  {
    id: 'task1',
    userId: 'u1',
    title: 'Смонтировать влог',
    description: 'Дедлайн до пятницы, нужно успеть покрасить.',
    date: new Date().toISOString().split('T')[0],
    time: '18:00',
    isCompleted: false,
    type: TaskType.POST
  },
  {
    id: 'task2',
    userId: 'u1',
    title: 'Встреча с рекламодателем',
    description: 'Обсуждение интеграции в выпуск.',
    date: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
    time: '14:00',
    isCompleted: false,
    type: TaskType.MEETING
  },
  {
    id: 'task3',
    userId: 'admin1',
    title: 'Проверка оборудования',
    description: 'Ежемесячная ревизия камер.',
    date: new Date().toISOString().split('T')[0],
    time: '10:00',
    isCompleted: true,
    type: TaskType.OTHER
  }
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    userId: 'u1',
    text: 'Ваша бронь на 25.10 подтверждена.',
    isRead: false,
    date: new Date().toISOString(),
    type: 'success'
  },
  {
    id: 'n2',
    userId: 'u1',
    text: 'Администратор Даниил ответил на ваше пожелание.',
    isRead: true,
    date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    type: 'info'
  }
];
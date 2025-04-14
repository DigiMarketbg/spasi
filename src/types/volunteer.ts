
export interface Volunteer {
  id: string;
  created_at: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string | null;
  city: string;
  can_help_with: string[];
  motivation: string | null;
  is_approved: boolean;
}

export type VolunteerFormData = Omit<Volunteer, 'id' | 'created_at' | 'user_id' | 'is_approved'>;

export interface VolunteerMission {
  id: string;
  created_at: string;
  title: string;
  description: string;
  location: string;
  date: string;
  category: string;
  status: 'active' | 'upcoming' | 'completed';
  max_volunteers: number;
  created_by: string;
}

export const HELP_OPTIONS = [
  { id: 'transport', label: 'Транспорт' },
  { id: 'food', label: 'Храна' },
  { id: 'blood', label: 'Кръв' },
  { id: 'logistics', label: 'Логистика' },
  { id: 'other', label: 'Друго' }
];

export const BULGARIAN_CITIES = [
  'София', 'Пловдив', 'Варна', 'Бургас', 'Русе', 'Стара Загора', 'Плевен', 
  'Добрич', 'Сливен', 'Шумен', 'Перник', 'Хасково', 'Ямбол', 'Пазарджик', 
  'Благоевград', 'Велико Търново', 'Враца', 'Габрово', 'Асеновград', 'Видин',
  'Казанлък', 'Кърджали', 'Кюстендил', 'Монтана', 'Търговище', 'Силистра', 
  'Разград', 'Свищов', 'Горна Оряховица', 'Смолян', 'Севлиево', 'Лом', 'Дупница', 
  'Троян', 'Нова Загора', 'Карлово', 'Велинград', 'Димитровград', 'Ботевград', 'Попово'
].sort();

export interface Contact {
  id: string
  name: string
  avatar: string
  online?: boolean
}

/* Мок-контакты «Быстрая отправка» (бэкенд подключим позже).
   Аватарки — стоковые портреты pravatar.cc. */
export const CONTACTS: Contact[] = [
  { id: 'c1', name: 'Анна', avatar: 'https://i.pravatar.cc/160?img=5', online: true },
  { id: 'c2', name: 'Гио', avatar: 'https://i.pravatar.cc/160?img=12' },
  { id: 'c3', name: 'Лиза', avatar: 'https://i.pravatar.cc/160?img=32', online: true },
  { id: 'c4', name: 'Давид', avatar: 'https://i.pravatar.cc/160?img=14' },
  { id: 'c5', name: 'Нино', avatar: 'https://i.pravatar.cc/160?img=47' },
  { id: 'c6', name: 'Тео', avatar: 'https://i.pravatar.cc/160?img=33', online: true },
  { id: 'c7', name: 'Мария', avatar: 'https://i.pravatar.cc/160?img=9' },
  { id: 'c8', name: 'Леван', avatar: 'https://i.pravatar.cc/160?img=51' },
  { id: 'c9', name: 'Кейт', avatar: 'https://i.pravatar.cc/160?img=16', online: true },
  { id: 'c10', name: 'Сандро', avatar: 'https://i.pravatar.cc/160?img=60' },
  { id: 'c11', name: 'Софи', avatar: 'https://i.pravatar.cc/160?img=23' },
  { id: 'c12', name: 'Илья', avatar: 'https://i.pravatar.cc/160?img=68' },
  { id: 'c13', name: 'Майя', avatar: 'https://i.pravatar.cc/160?img=44', online: true },
  { id: 'c14', name: 'Ника', avatar: 'https://i.pravatar.cc/160?img=25' },
  { id: 'c15', name: 'Тамар', avatar: 'https://i.pravatar.cc/160?img=1', online: true },
  { id: 'c16', name: 'Олег', avatar: 'https://i.pravatar.cc/160?img=3' },
  { id: 'c17', name: 'Елена', avatar: 'https://i.pravatar.cc/160?img=45' },
  { id: 'c18', name: 'Бека', avatar: 'https://i.pravatar.cc/160?img=8' },
  { id: 'c19', name: 'Дина', avatar: 'https://i.pravatar.cc/160?img=49', online: true },
  { id: 'c20', name: 'Реваз', avatar: 'https://i.pravatar.cc/160?img=11' },
  { id: 'c21', name: 'Алекс', avatar: 'https://i.pravatar.cc/160?img=15' },
  { id: 'c22', name: 'Кето', avatar: 'https://i.pravatar.cc/160?img=20' },
  { id: 'c23', name: 'Паата', avatar: 'https://i.pravatar.cc/160?img=52', online: true },
  { id: 'c24', name: 'Вера', avatar: 'https://i.pravatar.cc/160?img=26' },
  { id: 'c25', name: 'Гурам', avatar: 'https://i.pravatar.cc/160?img=56' },
  { id: 'c26', name: 'Ия', avatar: 'https://i.pravatar.cc/160?img=31' },
  { id: 'c27', name: 'Зура', avatar: 'https://i.pravatar.cc/160?img=64' },
  { id: 'c28', name: 'Лана', avatar: 'https://i.pravatar.cc/160?img=36', online: true },
]

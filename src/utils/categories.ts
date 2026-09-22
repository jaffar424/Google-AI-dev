import { CategoryId, CategoryMeta, StoreType } from '../types/party';

export const PARTY_CATEGORIES: CategoryMeta[] = [
  {
    id: 'proteins',
    name: 'Proteins & Mains',
    icon: 'Beef',
    emoji: '🥩',
    color: '#ef4444',
    badgeBg: 'bg-red-50 text-red-700 border-red-200',
  },
  {
    id: 'produce',
    name: 'Fresh Produce & Herbs',
    icon: 'Salad',
    emoji: '🥗',
    color: '#10b981',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    id: 'dairy_charcuterie',
    name: 'Dairy, Cheeses & Dips',
    icon: 'UtensilsCrossed',
    emoji: '🧀',
    color: '#f59e0b',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    id: 'bakery',
    name: 'Bakery, Buns & Desserts',
    icon: 'Cake',
    emoji: '🥖',
    color: '#d97706',
    badgeBg: 'bg-orange-50 text-orange-700 border-orange-200',
  },
  {
    id: 'pantry_snacks',
    name: 'Pantry, Chips & Condiments',
    icon: 'Package',
    emoji: '🥫',
    color: '#8b5cf6',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  {
    id: 'alcohol',
    name: 'Beer, Wine & Spirits',
    icon: 'Wine',
    emoji: '🍷',
    color: '#ec4899',
    badgeBg: 'bg-pink-50 text-pink-700 border-pink-200',
  },
  {
    id: 'beverages_mixers',
    name: 'Sodas, Mixers & Juices',
    icon: 'CupSoda',
    emoji: '🧃',
    color: '#06b6d4',
    badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  },
  {
    id: 'ice',
    name: 'Party Ice & Chilling',
    icon: 'Snowflake',
    emoji: '🧊',
    color: '#3b82f6',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    id: 'tableware',
    name: 'Cups, Plates & Napkins',
    icon: 'Sparkles',
    emoji: '🍽️',
    color: '#64748b',
    badgeBg: 'bg-slate-50 text-slate-700 border-slate-200',
  },
  {
    id: 'decor_ambience',
    name: 'Decor, Lighting & Music',
    icon: 'PartyPopper',
    emoji: '🎈',
    color: '#f43f5e',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  {
    id: 'favors_activities',
    name: 'Favors, Games & Activities',
    icon: 'Gift',
    emoji: '🎁',
    color: '#14b8a6',
    badgeBg: 'bg-teal-50 text-teal-700 border-teal-200',
  },
];

export const STORES_LIST: StoreType[] = [
  'Costco / Wholesale',
  'Trader Joe’s',
  'Target',
  'Local Supermarket',
  'Liquor Store',
  'Amazon / Online',
  'Bakery / Specialty',
  'Other'
];

export const STORE_COLORS: Record<StoreType, { bg: string; text: string; border: string }> = {
  'Costco / Wholesale': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  'Trader Joe’s': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  'Target': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
  'Local Supermarket': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' },
  'Liquor Store': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' },
  'Amazon / Online': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
  'Bakery / Specialty': { bg: 'bg-yellow-50', text: 'text-yellow-800', border: 'border-yellow-200' },
  'Other': { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
};

export function getCategoryMeta(id: CategoryId): CategoryMeta {
  return PARTY_CATEGORIES.find((c) => c.id === id) || PARTY_CATEGORIES[0];
}

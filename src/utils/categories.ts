import { CategoryId, CategoryMeta, StoreType } from '../types/party';

export const PARTY_CATEGORIES: CategoryMeta[] = [
  {
    id: 'proteins',
    name: 'Butcher & Seafood',
    aisle: 'Aisle 4',
    icon: 'Beef',
    emoji: '🥩',
    color: '#ef4444',
    badgeBg: 'bg-red-50 text-red-700 border-red-200',
  },
  {
    id: 'produce',
    name: 'Fresh Produce & Herbs',
    aisle: 'Aisle 1',
    icon: 'Salad',
    emoji: '🥗',
    color: '#10b981',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    id: 'dairy_charcuterie',
    name: 'Deli, Cheese & Dips',
    aisle: 'Aisle 3',
    icon: 'UtensilsCrossed',
    emoji: '🧀',
    color: '#f59e0b',
    badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    id: 'bakery',
    name: 'Bakery & Sweets',
    aisle: 'Aisle 2',
    icon: 'Cake',
    emoji: '🥖',
    color: '#d97706',
    badgeBg: 'bg-orange-50 text-orange-700 border-orange-200',
  },
  {
    id: 'pantry_snacks',
    name: 'Pantry, Chips & Salsas',
    aisle: 'Aisle 5',
    icon: 'Package',
    emoji: '🥫',
    color: '#8b5cf6',
    badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
  },
  {
    id: 'beverages_mixers',
    name: 'Mixers, Juices & Sodas',
    aisle: 'Aisle 6',
    icon: 'CupSoda',
    emoji: '🧃',
    color: '#06b6d4',
    badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  },
  {
    id: 'alcohol',
    name: 'Wine, Craft Beer & Spirits',
    aisle: 'Aisle 7',
    icon: 'Wine',
    emoji: '🍷',
    color: '#ec4899',
    badgeBg: 'bg-pink-50 text-pink-700 border-pink-200',
  },
  {
    id: 'ice',
    name: 'Party Ice & Chilling',
    aisle: 'Aisle 8 (Freezer)',
    icon: 'Snowflake',
    emoji: '🧊',
    color: '#3b82f6',
    badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  {
    id: 'tableware',
    name: 'Plates, Cups & Eco-Paper',
    aisle: 'Aisle 9',
    icon: 'Sparkles',
    emoji: '🍽️',
    color: '#64748b',
    badgeBg: 'bg-slate-50 text-slate-700 border-slate-200',
  },
  {
    id: 'decor_ambience',
    name: 'Party Supplies & Ambience',
    aisle: 'Aisle 10',
    icon: 'PartyPopper',
    emoji: '🎈',
    color: '#f43f5e',
    badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  {
    id: 'favors_activities',
    name: 'Favors, Games & Activities',
    aisle: 'Aisle 11',
    icon: 'Gift',
    emoji: '🎁',
    color: '#14b8a6',
    badgeBg: 'bg-teal-50 text-teal-700 border-teal-200',
  },
];

export const STORES_LIST: StoreType[] = [
  'CymbalMart Supercenter',
  'CymbalMart Fresh Market',
  'CymbalMart Wine & Spirits',
  'CymbalMart Wholesale Club',
  'CymbalMart Express',
  'Local Supermarket',
  'Specialty Market',
];

export const STORE_COLORS: Record<StoreType, { bg: string; text: string; border: string }> = {
  'CymbalMart Supercenter': { bg: 'bg-teal-50', text: 'text-teal-800', border: 'border-teal-200' },
  'CymbalMart Fresh Market': { bg: 'bg-emerald-50', text: 'text-emerald-800', border: 'border-emerald-200' },
  'CymbalMart Wine & Spirits': { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
  'CymbalMart Wholesale Club': { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
  'CymbalMart Express': { bg: 'bg-amber-50', text: 'text-amber-800', border: 'border-amber-200' },
  'Local Supermarket': { bg: 'bg-slate-50', text: 'text-slate-700', border: 'border-slate-200' },
  'Specialty Market': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' },
};

export const CYMBALMART_LOCATIONS = [
  'CymbalMart Supercenter #101 - Metro Center',
  'CymbalMart Fresh Market #204 - West End',
  'CymbalMart Supercenter #312 - Oakridge Plaza',
  'CymbalMart Express #405 - Downtown Transit',
];

export function getCategoryMeta(id: CategoryId): CategoryMeta {
  return PARTY_CATEGORIES.find((c) => c.id === id) || PARTY_CATEGORIES[0];
}

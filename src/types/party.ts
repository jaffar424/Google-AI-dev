export type StoreType = 
  | 'CymbalMart Supercenter' 
  | 'CymbalMart Fresh Market' 
  | 'CymbalMart Wine & Spirits' 
  | 'CymbalMart Wholesale Club' 
  | 'CymbalMart Express'
  | 'Local Supermarket'
  | 'Specialty Market';

export type PriorityLevel = 'essential' | 'recommended' | 'optional';

export type CategoryId = 
  | 'proteins'
  | 'produce'
  | 'dairy_charcuterie'
  | 'bakery'
  | 'pantry_snacks'
  | 'alcohol'
  | 'beverages_mixers'
  | 'ice'
  | 'tableware'
  | 'decor_ambience'
  | 'favors_activities';

export interface CategoryMeta {
  id: CategoryId;
  name: string;
  aisle: string;
  icon: string;
  emoji: string;
  color: string;
  badgeBg: string;
}

export interface ShoppingItem {
  id: string;
  name: string;
  category: CategoryId;
  quantity: number;
  unit: string;
  estimatedPrice: number;
  store: StoreType;
  priority: PriorityLevel;
  notes?: string;
  isBought: boolean;
  assignedTo?: string; // guest name if assigned
  isCymbalMartBrand?: boolean; // CymbalMart Select / Private Label
  brandName?: string; // e.g. "CymbalMart Select", "CymbalMart Organic"
  aisleNumber?: string;
  dietaryTags?: string[];
  originalPrice?: number; // for tracking savings
}

export interface DrinkCalculation {
  totalDrinks: number;
  beerBottles: number;
  wineBottles: number;
  liquorBottles750ml: number;
  mixersBottles: number;
  mocktailLitres: number;
  iceLbs: number;
  waterSeltzers: number;
  glassesCups: number;
  formulaNote: string;
}

export interface FoodCalculation {
  appetizerPieces: number;
  proteinLbs: number;
  sideDishesLbs: number;
  saladLbs: number;
  dessertPieces: number;
  formulaNote: string;
}

export interface PrepTask {
  id: string;
  task: string;
  completed: boolean;
  category: 'Shopping' | 'Food Prep' | 'Bar Setup' | 'Decor & Ambience' | 'Host Ready';
}

export interface TimelinePhase {
  phaseName: string;
  timeframe: string;
  tasks: PrepTask[];
}

export interface RunOfShowItem {
  time: string;
  activity: string;
  tip: string;
}

export interface PartyDetails {
  id: string;
  title: string;
  theme: string;
  eventType: string;
  guestCountAdults: number;
  guestCountKids: number;
  durationHours: number;
  budgetLimit: number;
  drinkStyle: 'full_bar' | 'beer_wine_only' | 'cocktail_special' | 'mocktails_only' | 'byob';
  cateringStyle: 'homemade' | 'semi_homemade' | 'store_bought' | 'bbq_grill';
  dietaryRestrictions: string[];
  specialRequests?: string;
  date?: string;
}

export interface FulfillmentDetails {
  type: 'pickup' | 'delivery';
  storeLocation: string;
  deliveryAddress?: string;
  slot: string;
  orderNumber?: string;
  status: 'planning' | 'ready_for_checkout' | 'placed';
  placedAt?: string;
}

export interface PartyPlan {
  details: PartyDetails;
  themeTitle: string;
  themeDescription: string;
  vibeKeywords: string[];
  signatureCocktail?: {
    name: string;
    description: string;
    ingredients: string[];
  };
  signatureMocktail?: {
    name: string;
    description: string;
    ingredients: string[];
  };
  items: ShoppingItem[];
  drinkCalc: DrinkCalculation;
  foodCalc: FoodCalculation;
  costSavingTips: string[];
  timeline: TimelinePhase[];
  runOfShow: RunOfShowItem[];
  fulfillment: FulfillmentDetails;
  createdAt: string;
  updatedAt: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: string;
  suggestedPrompts?: string[];
  itemModifications?: {
    added?: ShoppingItem[];
    removedIds?: string[];
    swapped?: Array<{ oldId: string; newItem: ShoppingItem }>;
    note?: string;
  };
}

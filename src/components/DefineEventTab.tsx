import React, { useState } from 'react';
import { 
  Sparkles, 
  Users, 
  DollarSign, 
  Clock, 
  Wine, 
  ChefHat, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Flame, 
  GlassWater,
  HeartHandshake,
  Lightbulb,
  ShoppingBag
} from 'lucide-react';
import { PartyDetails, PartyPlan } from '../types/party';
import { PARTY_TEMPLATES, createPartyFromTemplate } from '../utils/templates';

interface DefineEventTabProps {
  currentPlan: PartyPlan;
  onPlanGenerated: (newPlan: PartyPlan) => void;
  onNavigateToReview: () => void;
}

const PARTY_TYPES = [
  { id: 'Dinner Party', label: 'Dinner Party Soirée', icon: '🍷', desc: 'Curated courses, wine pairings & cozy table ambience' },
  { id: 'Outdoor BBQ Cookout', label: 'Backyard BBQ & Grill', icon: '🥩', desc: 'Smash burgers, bratwurst, lawn games & iced beer tubs' },
  { id: 'Street Taco Fiesta', label: 'Street Taco Fiesta', icon: '🌮', desc: 'Slow-cooked carnitas, fresh guac, salsas & lime margaritas' },
  { id: 'Cocktail & Tapas Soiree', label: 'Cocktail & Tapas Bar', icon: '🍸', desc: 'Craft cocktails, charcuterie boards & artisan finger foods' },
  { id: 'Birthday Celebration', label: 'Birthday Celebration', icon: '🎂', desc: 'Festive treats, bakery cake, party decor & bubbly' },
  { id: 'Game Day & Tailgate', label: 'Game Day & Tailgate', icon: '🏈', desc: 'Wings, dips, sliders, chips & ice-cold beverages' },
  { id: 'Sunday Brunch Buffet', label: 'Sunday Brunch & Bubbly', icon: '🥂', desc: 'Pastries, fruit platters, mimosas & savory quiches' },
  { id: 'Kids & Family Birthday', label: 'Kids & Family Party', icon: '🎈', desc: 'Fun finger foods, juice boxes, cupcakes & party games' },
];

const DIETARY_OPTIONS = [
  'Gluten-Free Friendly',
  'Vegetarian Options',
  'Vegan Options',
  'Nut-Free Safe',
  'Dairy-Free Options',
  'Kid-Friendly Choices',
  'Low Sugar / Keto',
  'Eco-Friendly / Compostable',
];

export const DefineEventTab: React.FC<DefineEventTabProps> = ({
  currentPlan,
  onPlanGenerated,
  onNavigateToReview,
}) => {
  const [details, setDetails] = useState<PartyDetails>({
    ...currentPlan.details,
    dietaryRestrictions: currentPlan.details.dietaryRestrictions || [],
    specialRequests: currentPlan.details.specialRequests || '',
  });

  const [customIdea, setCustomIdea] = useState(currentPlan.themeTitle || '');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const toggleDietary = (item: string) => {
    setDetails((prev) => {
      const exists = prev.dietaryRestrictions.includes(item);
      return {
        ...prev,
        dietaryRestrictions: exists
          ? prev.dietaryRestrictions.filter((d) => d !== item)
          : [...prev.dietaryRestrictions, item],
      };
    });
  };

  const handleSelectTemplate = (templateKey: string) => {
    setIsLoading(true);
    setTimeout(() => {
      const plan = createPartyFromTemplate(templateKey);
      onPlanGenerated(plan);
      setIsLoading(false);
      onNavigateToReview();
    }, 350);
  };

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/plan/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ details, customIdea }),
      });

      if (!res.ok) {
        throw new Error('Server returned error while generating party plan');
      }

      const newPlan: PartyPlan = await res.json();
      onPlanGenerated(newPlan);
      onNavigateToReview();
    } catch (err: any) {
      console.error('Error generating party plan:', err);
      // Graceful local fallback template
      const fallback = createPartyFromTemplate('taco_fiesta');
      fallback.details = { ...fallback.details, ...details };
      if (customIdea) fallback.themeTitle = customIdea;
      onPlanGenerated(fallback);
      onNavigateToReview();
    } finally {
      setIsLoading(false);
    }
  };

  const costPerGuest = details.guestCountAdults + details.guestCountKids > 0
    ? (details.budgetLimit / (details.guestCountAdults + details.guestCountKids)).toFixed(1)
    : '0';

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* CUJ Stage Header */}
      <div className="bg-linear-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              <span>Step 1 of 3: Define Event</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Tell CymbalMart Your Event Intent
            </h1>
            <p className="text-sm text-slate-300">
              Busy hosts shouldn't spend hours figuring out quantities and budgets. Define your party type, theme, guest count, budget, and special requests — and let CymbalMart create a curated, budget-conscious shopping list.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
            <button
              type="button"
              onClick={onNavigateToReview}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold transition-all backdrop-blur-sm"
            >
              <span>View Current List ({currentPlan.items.length} items)</span>
              <ArrowRight className="w-4 h-4 text-teal-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Quick-Start Blueprints for Busy Hosts */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>Or Quick-Start With a Curated CymbalMart Blueprint</span>
          </h2>
          <span className="text-xs text-slate-400">1-click instant setup</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div 
            onClick={() => handleSelectTemplate('taco_fiesta')}
            className="cursor-pointer group relative bg-white rounded-2xl p-5 border border-slate-200 hover:border-teal-500 hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">🌮</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                $280 Budget · 18 Guests
              </span>
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
              Street Taco & Margarita Cantina
            </h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              Carnitas, street tortillas, fresh guacamole, salsas, and pitcher margaritas.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-600">
              <span>Load Blueprint</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div 
            onClick={() => handleSelectTemplate('backyard_bbq')}
            className="cursor-pointer group relative bg-white rounded-2xl p-5 border border-slate-200 hover:border-teal-500 hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">🥩</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                $330 Budget · 26 Guests
              </span>
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
              Backyard Smokehouse Cookout
            </h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              Smash burgers, artisan sausages, sweet watermelon, corn on cob & iced craft IPAs.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-600">
              <span>Load Blueprint</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          <div 
            onClick={() => handleSelectTemplate('wine_tapas')}
            className="cursor-pointer group relative bg-white rounded-2xl p-5 border border-slate-200 hover:border-teal-500 hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">🍷</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                $250 Budget · 12 Guests
              </span>
            </div>
            <h3 className="font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
              Mediterranean Tapas & Wine Soirée
            </h3>
            <p className="text-xs text-slate-500 mt-1 line-clamp-2">
              Cured meats, aged Manchego, pan con tomate, marinated olives & Spanish Rioja.
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-teal-600">
              <span>Load Blueprint</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Define Event Form */}
      <form onSubmit={handleGeneratePlan} className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-8">
        {/* Section 1: Party Type */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>1. Select Party Type</span>
              <span className="text-rose-500">*</span>
            </label>
            <span className="text-xs text-slate-400">Sets base portion calculations</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {PARTY_TYPES.map((pt) => {
              const isSelected = details.eventType === pt.id;
              return (
                <div
                  key={pt.id}
                  onClick={() => setDetails({ ...details, eventType: pt.id })}
                  className={`cursor-pointer rounded-2xl p-3.5 border transition-all ${
                    isSelected
                      ? 'bg-teal-50/80 border-teal-500 ring-2 ring-teal-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-2xl">{pt.icon}</span>
                    {isSelected && (
                      <span className="h-5 w-5 rounded-full bg-teal-600 text-white flex items-center justify-center">
                        <Check className="w-3 h-3" />
                      </span>
                    )}
                  </div>
                  <h4 className="font-semibold text-xs text-slate-900 mt-2">{pt.label}</h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{pt.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 2: Theme & Occasion */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">
              2. Event Title or Occasion
            </label>
            <input
              type="text"
              value={details.title}
              onChange={(e) => setDetails({ ...details, title: e.target.value })}
              placeholder="e.g. Maya's 30th Birthday Fiesta"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-900">
              Custom Theme, Vibe or Signature Idea
            </label>
            <input
              type="text"
              value={customIdea}
              onChange={(e) => setCustomIdea(e.target.value)}
              placeholder="e.g. Tropical Tiki with coconut drinks, colorful skewers & grilled pineapple"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm"
            />
          </div>
        </div>

        {/* Section 3: Budget & Guest Count */}
        <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>3. Budget & Guest Count Parameters</span>
            </h3>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              ${costPerGuest} per guest target
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Budget */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Total Budget Limit ($ USD)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-slate-400 font-semibold">$</span>
                <input
                  type="number"
                  min="30"
                  max="5000"
                  step="10"
                  value={details.budgetLimit}
                  onChange={(e) => setDetails({ ...details, budgetLimit: Number(e.target.value) || 200 })}
                  className="w-full pl-8 pr-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-sm font-bold text-slate-900"
                />
              </div>
            </div>

            {/* Adults */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Adult Guests (21+)</label>
              <div className="relative">
                <Users className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={details.guestCountAdults}
                  onChange={(e) => setDetails({ ...details, guestCountAdults: Number(e.target.value) || 0 })}
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-sm font-bold text-slate-900"
                />
              </div>
            </div>

            {/* Kids */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Kids & Teens (&lt;21)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={details.guestCountKids}
                onChange={(e) => setDetails({ ...details, guestCountKids: Number(e.target.value) || 0 })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-sm font-bold text-slate-900"
              />
            </div>

            {/* Duration */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Duration (Hours)</label>
              <div className="relative">
                <Clock className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={details.durationHours}
                  onChange={(e) => setDetails({ ...details, durationHours: Number(e.target.value) || 4 })}
                  className="w-full pl-10 pr-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-sm font-bold text-slate-900"
                />
              </div>
            </div>
          </div>

          {/* Beverage & Prep Style Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <Wine className="w-3.5 h-3.5 text-purple-600" />
                <span>Drink Program Format</span>
              </label>
              <select
                value={details.drinkStyle}
                onChange={(e) => setDetails({ ...details, drinkStyle: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-800"
              >
                <option value="cocktail_special">Signature Batch Cocktail + Mocktail & Beer</option>
                <option value="full_bar">Full Bar (Liquor, Wine, Beer & Mixers)</option>
                <option value="beer_wine_only">Beer, Wine & Non-Alcoholic Only</option>
                <option value="mocktails_only">100% Zero-Proof Mocktails & Craft Sodas</option>
                <option value="byob">BYOB (Provide Ice, Mixers & Cups Only)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                <ChefHat className="w-3.5 h-3.5 text-amber-600" />
                <span>Culinary & Prep Style</span>
              </label>
              <select
                value={details.cateringStyle}
                onChange={(e) => setDetails({ ...details, cateringStyle: e.target.value as any })}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white text-xs font-medium text-slate-800"
              >
                <option value="semi_homemade">Semi-Homemade (Best Balance of Value & Time)</option>
                <option value="store_bought">CymbalMart Deli Platters & Ready-to-Serve</option>
                <option value="bbq_grill">Outdoor BBQ & Grill Stations</option>
                <option value="homemade">100% From Scratch Culinary</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 4: Dietary Needs & Special Requests */}
        <div className="space-y-4">
          <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>4. Dietary Needs & Special Requests</span>
          </label>

          <div className="flex flex-wrap gap-2">
            {DIETARY_OPTIONS.map((tag) => {
              const active = details.dietaryRestrictions.includes(tag);
              return (
                <button
                  type="button"
                  key={tag}
                  onClick={() => toggleDietary(tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {active && <Check className="w-3 h-3" />}
                  <span>{tag}</span>
                </button>
              );
            })}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Host Special Requests or Specific Grocery Aisles to Prioritize
            </label>
            <textarea
              rows={2}
              value={details.specialRequests || ''}
              onChange={(e) => setDetails({ ...details, specialRequests: e.target.value })}
              placeholder="e.g. Include 100% compostable bamboo plates, lots of party ice for coolers, a kid-friendly punch bowl, and prioritize CymbalMart Select brand items to maximize budget."
              className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-xs text-slate-800"
            />
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
            {errorMsg}
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
          <div className="text-xs text-slate-500">
            CymbalMart Shopping Agent will curate items, portion calculations, and store aisles.
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-linear-to-r from-teal-600 via-teal-700 to-indigo-700 hover:from-teal-700 hover:to-indigo-800 text-white font-bold text-sm shadow-md shadow-teal-700/20 flex items-center justify-center gap-2.5 transition-all active:scale-95 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Curating CymbalMart Shopping List...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-teal-200" />
                <span>Curate CymbalMart Shopping Plan →</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

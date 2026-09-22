import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Users, 
  Clock, 
  DollarSign, 
  Wine, 
  ChefHat,
  Loader2,
  Store,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PartyDetails, PartyPlan } from '../types/party';
import { PARTY_TEMPLATES, createPartyFromTemplate } from '../utils/templates';

interface NewPartyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPlanCreated: (plan: PartyPlan) => void;
}

export const NewPartyModal: React.FC<NewPartyModalProps> = ({
  isOpen,
  onClose,
  onPlanCreated,
}) => {
  const [mode, setMode] = useState<'template' | 'ai'>('ai');
  const [isGenerating, setIsGenerating] = useState(false);

  // AI Form State
  const [title, setTitle] = useState('');
  const [themePrompt, setThemePrompt] = useState('');
  const [eventType, setEventType] = useState('Dinner & Cocktails Party');
  const [adults, setAdults] = useState(14);
  const [kids, setKids] = useState(2);
  const [duration, setDuration] = useState(4);
  const [budget, setBudget] = useState(260);
  const [drinkStyle, setDrinkStyle] = useState<'full_bar' | 'beer_wine_only' | 'cocktail_special' | 'mocktails_only' | 'byob'>('cocktail_special');
  const [cateringStyle, setCateringStyle] = useState<'homemade' | 'semi_homemade' | 'store_bought' | 'bbq_grill'>('semi_homemade');
  const [selectedDietary, setSelectedDietary] = useState<string[]>(['Gluten-Free Friendly']);
  const [specialRequests, setSpecialRequests] = useState('');

  if (!isOpen) return null;

  const dietaryOptions = [
    'Gluten-Free Friendly',
    'Vegetarian Option',
    'Vegan Option',
    'Nut-Free Safe',
    'Dairy-Free Option',
    'Kid-Friendly',
    'Eco-Friendly Tableware',
  ];

  const toggleDietary = (item: string) => {
    setSelectedDietary((prev) =>
      prev.includes(item) ? prev.filter((d) => d !== item) : [...prev, item]
    );
  };

  const handlePickTemplate = (templateKey: string) => {
    const plan = createPartyFromTemplate(templateKey);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
    onPlanCreated(plan);
    onClose();
  };

  const handleGenerateAI = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    const partyDetails: PartyDetails = {
      id: `party_${Date.now()}`,
      title: title.trim() || 'CymbalMart Celebration',
      theme: themePrompt.trim() || 'Festive and memorable party',
      eventType,
      guestCountAdults: adults,
      guestCountKids: kids,
      durationHours: duration,
      budgetLimit: budget,
      drinkStyle,
      cateringStyle,
      dietaryRestrictions: selectedDietary,
      specialRequests: specialRequests.trim(),
    };

    try {
      const response = await fetch('/api/plan/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          details: partyDetails,
          customIdea: themePrompt.trim(),
        }),
      });

      const plan: PartyPlan = await response.json();

      confetti({
        particleCount: 100,
        spread: 90,
        origin: { y: 0.6 },
      });

      onPlanCreated(plan);
      onClose();
    } catch (err) {
      console.error('Failed to generate plan:', err);
      const fallback = createPartyFromTemplate('taco_fiesta');
      fallback.details = partyDetails;
      onPlanCreated(fallback);
      onClose();
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-600/20">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-xl text-slate-900">
                Plan a New Party with CymbalMart
              </h2>
              <p className="text-xs text-slate-500">
                Define your event to get a curated, budget-conscious shopping list and aisle schedule.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex rounded-xl bg-slate-100 p-1 border border-slate-200 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setMode('ai')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
              mode === 'ai' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            <Sparkles className="w-4 h-4 text-teal-600" />
            <span>AI Custom Generator</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('template')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
              mode === 'template' ? 'bg-white text-teal-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            <Store className="w-4 h-4 text-teal-600" />
            <span>Instant CymbalMart Blueprints</span>
          </button>
        </div>

        {mode === 'template' ? (
          /* TEMPLATE PICKER */
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              onClick={() => handlePickTemplate('taco_fiesta')}
              className="p-4 rounded-2xl border-2 border-slate-200 hover:border-teal-500 bg-linear-to-b from-teal-50/50 to-white cursor-pointer transition-all hover:shadow-md group"
            >
              <div className="text-2xl mb-2">🌮</div>
              <h4 className="font-heading font-bold text-sm text-slate-900 group-hover:text-teal-700">
                Street Taco Cantina
              </h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                Carnitas, corn tortillas, fresh guac, salsa bar & pitcher margaritas.
              </p>
              <div className="mt-3 text-[11px] font-semibold text-teal-700 bg-teal-100/70 px-2 py-0.5 rounded-md w-fit">
                $280 Budget · 18 Guests
              </div>
            </div>

            <div
              onClick={() => handlePickTemplate('backyard_bbq')}
              className="p-4 rounded-2xl border-2 border-slate-200 hover:border-teal-500 bg-linear-to-b from-amber-50/50 to-white cursor-pointer transition-all hover:shadow-md group"
            >
              <div className="text-2xl mb-2">🥩</div>
              <h4 className="font-heading font-bold text-sm text-slate-900 group-hover:text-teal-700">
                Smokehouse Cookout
              </h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                Angus beef smash burgers, smoked brats, watermelon, corn & craft IPAs.
              </p>
              <div className="mt-3 text-[11px] font-semibold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-md w-fit">
                $330 Budget · 26 Guests
              </div>
            </div>

            <div
              onClick={() => handlePickTemplate('wine_tapas')}
              className="p-4 rounded-2xl border-2 border-slate-200 hover:border-teal-500 bg-linear-to-b from-purple-50/50 to-white cursor-pointer transition-all hover:shadow-md group"
            >
              <div className="text-2xl mb-2">🍷</div>
              <h4 className="font-heading font-bold text-sm text-slate-900 group-hover:text-teal-700">
                Mediterranean Wine & Tapas
              </h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                Cured charcuterie, aged Manchego, pan con tomate, Rioja & Spanish Cava.
              </p>
              <div className="mt-3 text-[11px] font-semibold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded-md w-fit">
                $250 Budget · 12 Guests
              </div>
            </div>
          </div>
        ) : (
          /* AI CUSTOM PROMPT GENERATOR */
          <form onSubmit={handleGenerateAI} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Event Name / Occasion *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sam's 30th Birthday Cookout"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Party Type
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500 font-medium"
                >
                  <option value="Dinner & Cocktails Party">Dinner & Cocktails Party</option>
                  <option value="Outdoor BBQ Cookout">Outdoor BBQ Cookout</option>
                  <option value="Street Taco Fiesta">Street Taco Fiesta</option>
                  <option value="Cocktail & Tapas Soiree">Cocktail & Tapas Soiree</option>
                  <option value="Birthday Celebration">Birthday Celebration</option>
                  <option value="Game Day & Tailgate">Game Day & Tailgate</option>
                  <option value="Sunday Brunch Buffet">Sunday Brunch Buffet</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  Custom Theme or Signature Food/Vibe Request
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Tropical Tiki with coconut rum punch, glazed pineapple sliders, and Hawaiian coleslaw."
                  value={themePrompt}
                  onChange={(e) => setThemePrompt(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Adults: <strong className="text-teal-700">{adults}</strong> | Kids: <strong className="text-amber-700">{kids}</strong>
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    placeholder="Adults"
                    value={adults}
                    onChange={(e) => setAdults(Number(e.target.value))}
                    className="w-1/2 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                  <input
                    type="number"
                    min="0"
                    max="50"
                    placeholder="Kids"
                    value={kids}
                    onChange={(e) => setKids(Number(e.target.value))}
                    className="w-1/2 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Target Budget ($ USD)
                </label>
                <input
                  type="number"
                  min="40"
                  max="5000"
                  step="10"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-bold text-slate-900"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  Special Requests (compostable plates, cooler ice, kids punch)
                </label>
                <input
                  type="text"
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g. Include 100% compostable bamboo plates, lots of ice bags, and kid juices"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1.5">
                  Dietary Accommodations
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {dietaryOptions.map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => toggleDietary(opt)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                        selectedDietary.includes(opt)
                          ? 'bg-teal-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isGenerating}
                className="w-full py-3 bg-linear-to-r from-teal-600 to-indigo-700 hover:from-teal-700 hover:to-indigo-800 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-teal-700/20 transition-all active:scale-[0.99]"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>CymbalMart Agent is Curating Your Shopping List...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 text-teal-200" />
                    <span>Generate Curated CymbalMart Plan</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

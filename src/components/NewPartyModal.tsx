import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  PartyPopper, 
  Users, 
  Clock, 
  DollarSign, 
  Wine, 
  Flame, 
  ChefHat,
  Loader2,
  CheckCircle
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
  const [kids, setKids] = useState(0);
  const [duration, setDuration] = useState(4);
  const [budget, setBudget] = useState(250);
  const [drinkStyle, setDrinkStyle] = useState<'full_bar' | 'beer_wine_only' | 'cocktail_special' | 'mocktails_only' | 'byob'>('cocktail_special');
  const [cateringStyle, setCateringStyle] = useState<'homemade' | 'semi_homemade' | 'store_bought' | 'bbq_grill'>('semi_homemade');
  const [selectedDietary, setSelectedDietary] = useState<string[]>(['Gluten-Free Friendly']);

  if (!isOpen) return null;

  const dietaryOptions = [
    'Gluten-Free Friendly',
    'Vegetarian Option',
    'Vegan Option',
    'Nut-Free Alert',
    'Dairy-Free Option',
    'Kid-Friendly',
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
      title: title.trim() || 'Custom Celebration',
      theme: themePrompt.trim() || 'Festive and memorable party',
      eventType,
      guestCountAdults: adults,
      guestCountKids: kids,
      durationHours: duration,
      budgetLimit: budget,
      drinkStyle,
      cateringStyle,
      dietaryRestrictions: selectedDietary,
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
      // Fallback
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
            <div className="w-10 h-10 rounded-2xl bg-linear-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
              <PartyPopper className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-heading font-extrabold text-xl text-slate-900">
                Plan a New Party
              </h2>
              <p className="text-xs text-slate-500">
                Generate a custom shopping list, cocktail ratios, and timeline with Gemini AI.
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
              mode === 'ai' ? 'bg-white text-indigo-950 shadow-xs' : 'text-slate-600'
            }`}
          >
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>AI Custom Generator</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('template')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 transition-all ${
              mode === 'template' ? 'bg-white text-indigo-950 shadow-xs' : 'text-slate-600'
            }`}
          >
            <PartyPopper className="w-4 h-4 text-amber-500" />
            <span>Instant Party Templates</span>
          </button>
        </div>

        {mode === 'template' ? (
          /* TEMPLATE PICKER */
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Taco Fiesta */}
            <div
              onClick={() => handlePickTemplate('taco_fiesta')}
              className="p-4 rounded-2xl border-2 border-slate-200 hover:border-amber-500 bg-linear-to-b from-amber-50/50 to-white cursor-pointer transition-all hover:shadow-md group"
            >
              <div className="text-2xl mb-2">🌮</div>
              <h4 className="font-heading font-bold text-sm text-slate-900 group-hover:text-amber-600">
                Taco & Margarita Fiesta
              </h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                Slow-braised carnitas, fresh guac bar, and batch lime margaritas for 16-18 guests.
              </p>
              <div className="mt-3 text-[11px] font-semibold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-md w-fit">
                ~$280 Est. Budget
              </div>
            </div>

            {/* Backyard BBQ */}
            <div
              onClick={() => handlePickTemplate('backyard_bbq')}
              className="p-4 rounded-2xl border-2 border-slate-200 hover:border-red-500 bg-linear-to-b from-red-50/50 to-white cursor-pointer transition-all hover:shadow-md group"
            >
              <div className="text-2xl mb-2">🍔</div>
              <h4 className="font-heading font-bold text-sm text-slate-900 group-hover:text-red-600">
                Smokehouse Backyard BBQ
              </h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                Smash burgers, grilled brats, watermelon, potato salad, and craft IPA coolers.
              </p>
              <div className="mt-3 text-[11px] font-semibold text-red-700 bg-red-100/70 px-2 py-0.5 rounded-md w-fit">
                ~$340 Est. Budget
              </div>
            </div>

            {/* Wine & Tapas */}
            <div
              onClick={() => handlePickTemplate('wine_tapas')}
              className="p-4 rounded-2xl border-2 border-slate-200 hover:border-pink-500 bg-linear-to-b from-pink-50/50 to-white cursor-pointer transition-all hover:shadow-md group"
            >
              <div className="text-2xl mb-2">🍷</div>
              <h4 className="font-heading font-bold text-sm text-slate-900 group-hover:text-pink-600">
                Spanish Tapas & Wine
              </h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                Jamón Serrano, aged Manchego, pan con tomate, Rioja reds, and chilled Cava.
              </p>
              <div className="mt-3 text-[11px] font-semibold text-pink-700 bg-pink-100/70 px-2 py-0.5 rounded-md w-fit">
                ~$260 Est. Budget
              </div>
            </div>
          </div>
        ) : (
          /* AI CUSTOM PROMPT GENERATOR */
          <form onSubmit={handleGenerateAI} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Party Name / Occasion *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Leo's 30th Birthday Bash"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Event Style
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 font-medium"
                >
                  <option value="Dinner & Cocktails Party">Dinner & Cocktails Party</option>
                  <option value="Cocktail & Hors d'Oeuvres Soiree">Cocktail & Hors d'Oeuvres Soiree</option>
                  <option value="Outdoor BBQ Cookout">Outdoor BBQ Cookout</option>
                  <option value="Birthday Party Celebration">Birthday Party Celebration</option>
                  <option value="Game Night & Snack Attack">Game Night & Snack Attack</option>
                  <option value="Sunday Brunch & Mimosas">Sunday Brunch & Mimosas</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">
                  Theme, Vibe & Food Prompt (Tell Festivity What You Want)
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Tropical Hawaiian Luau with slow cooker Kalua pork, pineapple fried rice, Mai Tai rum punch, and tiki decorations."
                  value={themePrompt}
                  onChange={(e) => setThemePrompt(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Guests & Budget Row */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Adults: <strong className="text-indigo-600">{adults}</strong> | Kids: <strong className="text-amber-600">{kids}</strong>
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
                  Budget Target ($ USD)
                </label>
                <input
                  type="number"
                  min="50"
                  max="5000"
                  step="10"
                  value={budget}
                  onChange={(e) => setBudget(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Drink Format
                </label>
                <select
                  value={drinkStyle}
                  onChange={(e) => setDrinkStyle(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  <option value="cocktail_special">Signature Batch Cocktail & Beer</option>
                  <option value="full_bar">Full Bar (Spirits, Wine & Beer)</option>
                  <option value="beer_wine_only">Beer & Wine Only</option>
                  <option value="mocktails_only">Zero-Proof / Mocktails</option>
                  <option value="byob">BYOB (Host provides mixers/ice)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Food Preparation Style
                </label>
                <select
                  value={cateringStyle}
                  onChange={(e) => setCateringStyle(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl"
                >
                  <option value="semi_homemade">Semi-Homemade (Store shortcuts + fresh mains)</option>
                  <option value="homemade">100% Homemade from Scratch</option>
                  <option value="store_bought">Zero Cook / Store-Bought Platters</option>
                  <option value="bbq_grill">Outdoor BBQ & Smoker</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1.5">
                  Dietary Tags & Accommodations
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {dietaryOptions.map((opt) => (
                    <button
                      type="button"
                      key={opt}
                      onClick={() => toggleDietary(opt)}
                      className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                        selectedDietary.includes(opt)
                          ? 'bg-indigo-600 text-white shadow-xs'
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
                className="w-full py-3 bg-linear-to-r from-rose-500 via-amber-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.99]"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Festivity Agent is Generating Your Plan & Shopping Route...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>Synthesize Complete Party Shopping Plan</span>
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

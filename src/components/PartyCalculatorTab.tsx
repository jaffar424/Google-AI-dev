import React, { useState } from 'react';
import { 
  Wine, 
  Beer, 
  Sparkles, 
  Users, 
  Clock, 
  Snowflake, 
  Beef, 
  UtensilsCrossed, 
  CupSoda, 
  Info,
  RefreshCw,
  CheckCircle,
  GlassWater
} from 'lucide-react';
import { PartyPlan, PartyDetails } from '../types/party';
import { calculatePartyDrinks, calculatePartyFood } from '../utils/calculator';

interface PartyCalculatorTabProps {
  currentPlan: PartyPlan;
  onUpdatePlanDetails: (details: PartyDetails) => void;
  onSyncCalculatedQuantitiesToItems: () => void;
}

export const PartyCalculatorTab: React.FC<PartyCalculatorTabProps> = ({
  currentPlan,
  onUpdatePlanDetails,
  onSyncCalculatedQuantitiesToItems,
}) => {
  const [details, setDetails] = useState<PartyDetails>({ ...currentPlan.details });
  const [syncedRecently, setSyncedRecently] = useState(false);

  const drinkCalc = calculatePartyDrinks(details);
  const foodCalc = calculatePartyFood(details);

  const handleUpdate = (field: keyof PartyDetails, val: any) => {
    const updated = { ...details, [field]: val };
    setDetails(updated);
    onUpdatePlanDetails(updated);
  };

  const handleSync = () => {
    onSyncCalculatedQuantitiesToItems();
    setSyncedRecently(true);
    setTimeout(() => setSyncedRecently(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                <Users className="w-5 h-5" />
              </div>
              <h2 className="font-heading font-bold text-lg text-slate-900">
                Dynamic Quantity & Portion Calculator
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-xl">
              Calibrated using event hospitality standards: 2 drinks per guest in the first hour, 1 drink each additional hour, 1.5 lbs of ice per person, and 0.5 lb protein per adult.
            </p>
          </div>

          <button
            onClick={handleSync}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-xs ${
              syncedRecently
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white active:scale-95'
            }`}
          >
            {syncedRecently ? (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Quantities Synced!</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Sync to Shopping List</span>
              </>
            )}
          </button>
        </div>

        {/* Input Parameters Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-5 border-t border-slate-100 text-xs">
          {/* Adults Stepper */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
            <label className="font-bold text-slate-700 flex items-center justify-between mb-2">
              <span>Adult Guests</span>
              <span className="text-indigo-600 font-extrabold text-sm">{details.guestCountAdults}</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleUpdate('guestCountAdults', Math.max(1, (details.guestCountAdults || 1) - 1))}
                className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100"
              >
                -
              </button>
              <input
                type="range"
                min="1"
                max="100"
                value={details.guestCountAdults}
                onChange={(e) => handleUpdate('guestCountAdults', Number(e.target.value))}
                className="flex-1 accent-indigo-600"
              />
              <button
                onClick={() => handleUpdate('guestCountAdults', (details.guestCountAdults || 1) + 1)}
                className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Kids Stepper */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
            <label className="font-bold text-slate-700 flex items-center justify-between mb-2">
              <span>Kid Guests</span>
              <span className="text-amber-600 font-extrabold text-sm">{details.guestCountKids || 0}</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleUpdate('guestCountKids', Math.max(0, (details.guestCountKids || 0) - 1))}
                className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100"
              >
                -
              </button>
              <input
                type="range"
                min="0"
                max="50"
                value={details.guestCountKids || 0}
                onChange={(e) => handleUpdate('guestCountKids', Number(e.target.value))}
                className="flex-1 accent-amber-600"
              />
              <button
                onClick={() => handleUpdate('guestCountKids', (details.guestCountKids || 0) + 1)}
                className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Party Duration */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
            <label className="font-bold text-slate-700 flex items-center justify-between mb-2">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Party Duration
              </span>
              <span className="text-indigo-600 font-extrabold text-sm">{details.durationHours} hrs</span>
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleUpdate('durationHours', Math.max(1, (details.durationHours || 3) - 1))}
                className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100"
              >
                -
              </button>
              <input
                type="range"
                min="1"
                max="10"
                value={details.durationHours}
                onChange={(e) => handleUpdate('durationHours', Number(e.target.value))}
                className="flex-1 accent-indigo-600"
              />
              <button
                onClick={() => handleUpdate('durationHours', (details.durationHours || 3) + 1)}
                className="w-8 h-8 rounded-lg bg-white border border-slate-300 text-slate-700 font-bold hover:bg-slate-100"
              >
                +
              </button>
            </div>
          </div>

          {/* Drink Format */}
          <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60">
            <label className="font-bold text-slate-700 block mb-2">Drink Serving Style</label>
            <select
              value={details.drinkStyle}
              onChange={(e) => handleUpdate('drinkStyle', e.target.value)}
              className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold focus:ring-2 focus:ring-indigo-500"
            >
              <option value="full_bar">Full Bar (Beer, Wine & Spirits)</option>
              <option value="beer_wine_only">Beer & Wine Only</option>
              <option value="cocktail_special">Signature Cocktail Focus</option>
              <option value="mocktails_only">Zero-Proof / Mocktails Only</option>
              <option value="byob">BYOB (Host provides mixers & ice)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Drink Calculation Cards Grid */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wine className="w-5 h-5 text-rose-500" />
            <h3 className="font-heading font-bold text-base text-slate-900">
              Alcohol & Drink Ratios
            </h3>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-200/60">
            Total Drinks: <strong>{drinkCalc.totalDrinks}</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Beer */}
          <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200/60 text-center">
            <Beer className="w-5 h-5 text-amber-600 mx-auto mb-1" />
            <p className="text-[11px] font-semibold text-amber-900">Beer Cans / Bottles</p>
            <p className="text-xl font-heading font-extrabold text-amber-700 mt-1">
              {drinkCalc.beerBottles}
            </p>
            <p className="text-[10px] text-amber-700/80 mt-0.5">
              ≈ {Math.ceil(drinkCalc.beerBottles / 12)} 12-packs
            </p>
          </div>

          {/* Wine */}
          <div className="p-3.5 rounded-xl bg-pink-50/60 border border-pink-200/60 text-center">
            <Wine className="w-5 h-5 text-pink-600 mx-auto mb-1" />
            <p className="text-[11px] font-semibold text-pink-900">Wine Bottles (750ml)</p>
            <p className="text-xl font-heading font-extrabold text-pink-700 mt-1">
              {drinkCalc.wineBottles}
            </p>
            <p className="text-[10px] text-pink-700/80 mt-0.5">
              ≈ {drinkCalc.wineBottles * 5} glasses total
            </p>
          </div>

          {/* Liquor */}
          <div className="p-3.5 rounded-xl bg-violet-50/60 border border-violet-200/60 text-center">
            <GlassWater className="w-5 h-5 text-violet-600 mx-auto mb-1" />
            <p className="text-[11px] font-semibold text-violet-900">Spirits / Liquor</p>
            <p className="text-xl font-heading font-extrabold text-violet-700 mt-1">
              {drinkCalc.liquorBottles750ml}
            </p>
            <p className="text-[10px] text-violet-700/80 mt-0.5">
              750ml bottles (16 drinks/ea)
            </p>
          </div>

          {/* Mixers */}
          <div className="p-3.5 rounded-xl bg-cyan-50/60 border border-cyan-200/60 text-center">
            <CupSoda className="w-5 h-5 text-cyan-600 mx-auto mb-1" />
            <p className="text-[11px] font-semibold text-cyan-900">Mixers & Sodas</p>
            <p className="text-xl font-heading font-extrabold text-cyan-700 mt-1">
              {drinkCalc.mixersBottles}
            </p>
            <p className="text-[10px] text-cyan-700/80 mt-0.5">Liters / large bottles</p>
          </div>

          {/* Ice */}
          <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200/60 text-center">
            <Snowflake className="w-5 h-5 text-blue-600 mx-auto mb-1" />
            <p className="text-[11px] font-semibold text-blue-900">Party Ice Needed</p>
            <p className="text-xl font-heading font-extrabold text-blue-700 mt-1">
              {drinkCalc.iceLbs} lbs
            </p>
            <p className="text-[10px] text-blue-700/80 mt-0.5">
              ≈ {Math.ceil(drinkCalc.iceLbs / 10)} 10-lb bags
            </p>
          </div>

          {/* Cups / Glassware */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
            <Sparkles className="w-5 h-5 text-slate-600 mx-auto mb-1" />
            <p className="text-[11px] font-semibold text-slate-800">Cups / Glasses</p>
            <p className="text-xl font-heading font-extrabold text-slate-800 mt-1">
              {drinkCalc.glassesCups}
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5">2.5 cups per guest</p>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl flex items-start gap-2.5 text-xs text-slate-600">
          <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
          <span>{drinkCalc.formulaNote}</span>
        </div>
      </div>

      {/* Food Portions Grid */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Beef className="w-5 h-5 text-red-500" />
          <h3 className="font-heading font-bold text-base text-slate-900">
            Food & Portion Benchmarks
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl bg-orange-50/60 border border-orange-200/60">
            <p className="text-xs font-semibold text-orange-900">Appetizers & Bites</p>
            <p className="text-2xl font-heading font-extrabold text-orange-700 mt-1">
              {foodCalc.appetizerPieces}
            </p>
            <p className="text-[11px] text-orange-700/80 mt-0.5">
              Individual pieces / skewers / sliders
            </p>
          </div>

          <div className="p-4 rounded-xl bg-red-50/60 border border-red-200/60">
            <p className="text-xs font-semibold text-red-900">Main Protein (Raw Weight)</p>
            <p className="text-2xl font-heading font-extrabold text-red-700 mt-1">
              {foodCalc.proteinLbs} lbs
            </p>
            <p className="text-[11px] text-red-700/80 mt-0.5">
              Chicken, beef, pork, or tofu
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/60">
            <p className="text-xs font-semibold text-emerald-900">Sides & Salads</p>
            <p className="text-2xl font-heading font-extrabold text-emerald-700 mt-1">
              {(foodCalc.sideDishesLbs + foodCalc.saladLbs).toFixed(1)} lbs
            </p>
            <p className="text-[11px] text-emerald-700/80 mt-0.5">
              Grains, potatoes, greens, or pasta
            </p>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/60">
            <p className="text-xs font-semibold text-amber-900">Dessert Portions</p>
            <p className="text-2xl font-heading font-extrabold text-amber-700 mt-1">
              {foodCalc.dessertPieces}
            </p>
            <p className="text-[11px] text-amber-700/80 mt-0.5">
              Cupcakes, cake slices, cookies
            </p>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl flex items-start gap-2.5 text-xs text-slate-600">
          <Info className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
          <span>{foodCalc.formulaNote}</span>
        </div>
      </div>
    </div>
  );
};

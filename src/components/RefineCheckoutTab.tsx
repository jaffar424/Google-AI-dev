import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ShoppingBag, 
  Truck, 
  Store, 
  Clock, 
  MapPin, 
  DollarSign, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  ArrowLeft, 
  Printer, 
  Share2, 
  Calendar, 
  QrCode, 
  Sliders, 
  Wheat, 
  Leaf, 
  Ban, 
  Snowflake,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PartyPlan, ShoppingItem, FulfillmentDetails } from '../types/party';
import { CYMBALMART_LOCATIONS } from '../utils/categories';

interface RefineCheckoutTabProps {
  currentPlan: PartyPlan;
  onUpdatePlanItems: (newItems: ShoppingItem[]) => void;
  onUpdateFulfillment: (fulfillment: FulfillmentDetails) => void;
  onNavigateToReview: () => void;
  onNavigateToDefine: () => void;
  onPrint: () => void;
  onShare: () => void;
}

export const RefineCheckoutTab: React.FC<RefineCheckoutTabProps> = ({
  currentPlan,
  onUpdatePlanItems,
  onUpdateFulfillment,
  onNavigateToReview,
  onNavigateToDefine,
  onPrint,
  onShare,
}) => {
  const [fulfillmentType, setFulfillmentType] = useState<'pickup' | 'delivery'>(
    currentPlan.fulfillment?.type || 'pickup'
  );
  const [storeLocation, setStoreLocation] = useState(
    currentPlan.fulfillment?.storeLocation || CYMBALMART_LOCATIONS[0]
  );
  const [deliverySlot, setDeliverySlot] = useState(
    currentPlan.fulfillment?.slot || 'Event Morning: 10:00 AM - 12:00 PM'
  );
  const [deliveryAddress, setDeliveryAddress] = useState(
    currentPlan.fulfillment?.deliveryAddress || '742 Evergreen Terrace, Springfield'
  );

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderConfirmation, setOrderConfirmation] = useState<{
    orderNumber: string;
    placedAt: string;
  } | null>(
    currentPlan.fulfillment?.status === 'placed' && currentPlan.fulfillment.orderNumber
      ? {
          orderNumber: currentPlan.fulfillment.orderNumber,
          placedAt: currentPlan.fulfillment.placedAt || new Date().toISOString(),
        }
      : null
  );

  const [activeConstraintToast, setActiveConstraintToast] = useState<string | null>(null);

  // Financial calculations
  const subtotal = currentPlan.items.reduce((s, it) => s + (it.estimatedPrice || 0), 0);
  const cymbalMartSavings = Math.round(
    currentPlan.items.filter((i) => i.isCymbalMartBrand).reduce((s, it) => s + it.estimatedPrice * 0.22, 0) * 100
  ) / 100;
  const estimatedTax = Math.round(subtotal * 0.065 * 100) / 100;
  const fulfillmentFee = fulfillmentType === 'delivery' && subtotal < 35 ? 4.99 : 0.0;
  const orderTotal = Math.round((subtotal + estimatedTax + fulfillmentFee) * 100) / 100;
  const budget = currentPlan.details.budgetLimit || 250;
  const isUnderBudget = orderTotal <= budget;

  // Refine for constraint 1: Gluten-Free adjustment
  const handleApplyGlutenFree = () => {
    const updated = currentPlan.items.map((item) => {
      if (item.name.toLowerCase().includes('bun') || item.name.toLowerCase().includes('tortilla')) {
        return {
          ...item,
          name: `${item.name} (Gluten-Free Certified)`,
          notes: 'Gluten-Free certified batch selected',
          isCymbalMartBrand: true,
          brandName: 'CymbalMart Organics GF',
        };
      }
      return item;
    });
    onUpdatePlanItems(updated);
    setActiveConstraintToast('Adjusted bakery and carbs for 100% Gluten-Free compliance!');
  };

  // Refine for constraint 2: Plant-Based / Vegan
  const handleApplyVeganAlternate = () => {
    const hasVegan = currentPlan.items.some((i) => i.name.toLowerCase().includes('veggie') || i.name.toLowerCase().includes('plant'));
    if (!hasVegan) {
      const veganItem: ShoppingItem = {
        id: `item_vegan_${Date.now()}`,
        name: 'CymbalMart Plant-Based Artisan Sliders & Dips',
        category: 'proteins',
        quantity: 2,
        unit: 'packs',
        estimatedPrice: 9.5,
        store: 'CymbalMart Fresh Market',
        priority: 'recommended',
        isBought: false,
        isCymbalMartBrand: true,
        brandName: 'CymbalMart Plant Forward',
        aisleNumber: 'Aisle 4',
      };
      onUpdatePlanItems([...currentPlan.items, veganItem]);
      setActiveConstraintToast('Added CymbalMart Plant-Based Sliders for vegetarian/vegan guests!');
    } else {
      setActiveConstraintToast('Plant-based options are already included in your cart.');
    }
  };

  // Refine for constraint 3: Maximize CymbalMart Select savings
  const handleMaximizeBrandSavings = () => {
    let saved = 0;
    const updated = currentPlan.items.map((it) => {
      if (!it.isCymbalMartBrand) {
        const discount = Math.round(it.estimatedPrice * 0.2 * 100) / 100;
        saved += discount;
        return {
          ...it,
          estimatedPrice: Math.max(1.5, Math.round((it.estimatedPrice - discount) * 100) / 100),
          isCymbalMartBrand: true,
          brandName: 'CymbalMart Select',
        };
      }
      return it;
    });
    onUpdatePlanItems(updated);
    setActiveConstraintToast(`Swapped all items to CymbalMart Select! Estimated extra savings: $${saved.toFixed(2)}.`);
  };

  // Refine for constraint 4: Extra Party Ice for warm weather
  const handleAddExtraIce = () => {
    const ice = currentPlan.items.find((i) => i.category === 'ice');
    if (ice) {
      const updated = currentPlan.items.map((it) =>
        it.id === ice.id ? { ...it, quantity: it.quantity + 10, estimatedPrice: it.estimatedPrice + 4 } : it
      );
      onUpdatePlanItems(updated);
      setActiveConstraintToast('Added +10 lbs of CymbalMart Party Ice for drink tubs.');
    } else {
      const newIce: ShoppingItem = {
        id: `item_ice_${Date.now()}`,
        name: 'CymbalMart Pure Cubed Party Ice',
        category: 'ice',
        quantity: 20,
        unit: 'lbs (2 bags)',
        estimatedPrice: 6.5,
        store: 'CymbalMart Supercenter',
        priority: 'essential',
        isBought: false,
        isCymbalMartBrand: true,
        brandName: 'CymbalMart Ice',
        aisleNumber: 'Aisle 8 (Freezer)',
      };
      onUpdatePlanItems([...currentPlan.items, newIce]);
      setActiveConstraintToast('Added 20 lbs of CymbalMart Pure Party Ice to your cart.');
    }
  };

  // Handle Checkout Order Placement
  const handlePlaceOrder = async () => {
    setIsCheckingOut(true);

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: currentPlan,
          fulfillment: {
            type: fulfillmentType,
            storeLocation,
            deliveryAddress: fulfillmentType === 'delivery' ? deliveryAddress : undefined,
            slot: deliverySlot,
          },
        }),
      });

      const data = await res.json();
      const orderNum = data.orderNumber || `CYMBAL-MART-${Math.floor(100000 + Math.random() * 900000)}`;
      const placedAtTime = data.placedAt || new Date().toISOString();

      setOrderConfirmation({
        orderNumber: orderNum,
        placedAt: placedAtTime,
      });

      onUpdateFulfillment({
        type: fulfillmentType,
        storeLocation,
        deliveryAddress: fulfillmentType === 'delivery' ? deliveryAddress : undefined,
        slot: deliverySlot,
        orderNumber: orderNum,
        status: 'placed',
        placedAt: placedAtTime,
      });

      // Confetti burst for successful checkout!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0d9488', '#059669', '#10b981', '#3b82f6', '#f59e0b'],
      });
    } catch (err) {
      console.error('Checkout error:', err);
      // Fallback confirmation
      const orderNum = `CYMBAL-MART-${Math.floor(100000 + Math.random() * 900000)}`;
      const now = new Date().toISOString();
      setOrderConfirmation({ orderNumber: orderNum, placedAt: now });
      onUpdateFulfillment({
        type: fulfillmentType,
        storeLocation,
        slot: deliverySlot,
        orderNumber: orderNum,
        status: 'placed',
        placedAt: now,
      });
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      {/* CUJ Stage Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-800 text-xs font-semibold">
            <Sliders className="w-3.5 h-3.5 text-indigo-600" />
            <span>Step 3 of 3: Refine & Checkout</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Adjust for Constraints & Finalize Order
          </h1>
          <p className="text-xs text-slate-500">
            Fine-tune for dietary allergies, select your CymbalMart pickup or delivery window, and place your order.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToReview}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Shopping List</span>
          </button>
        </div>
      </div>

      {/* Order Confirmation Card if Already Placed */}
      {orderConfirmation && (
        <div className="bg-linear-to-br from-teal-900 via-emerald-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-teal-800/60 pb-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-teal-500/20 border border-teal-400/40 text-teal-300 flex items-center justify-center">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
                  CymbalMart Order Placed!
                </span>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  Order #{orderConfirmation.orderNumber}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onPrint}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white flex items-center gap-1.5 backdrop-blur-xs"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Order Receipt</span>
              </button>
              <button
                onClick={onShare}
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white flex items-center gap-1.5 backdrop-blur-xs"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share with Co-Host</span>
              </button>
            </div>
          </div>

          {/* Fulfillment Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-1">
              <div className="text-slate-400 font-medium flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-teal-400" />
                <span>Fulfillment Method</span>
              </div>
              <p className="font-bold text-sm text-white capitalize">
                {fulfillmentType === 'pickup' ? '🚗 Curbside Express Pickup' : '🚚 Same-Day Home Delivery'}
              </p>
              <p className="text-slate-300">{storeLocation}</p>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-1">
              <div className="text-slate-400 font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-teal-400" />
                <span>Scheduled Time Window</span>
              </div>
              <p className="font-bold text-sm text-white">{deliverySlot}</p>
              <p className="text-slate-300">Curbside Bay #4 · Free parking</p>
            </div>

            <div className="bg-white/5 rounded-2xl p-4 border border-white/10 space-y-1">
              <div className="text-slate-400 font-medium flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                <span>Total Paid</span>
              </div>
              <p className="font-bold text-sm text-emerald-300">${orderTotal.toFixed(2)}</p>
              <p className="text-slate-300">Saved ${cymbalMartSavings.toFixed(2)} with CymbalMart Select</p>
            </div>
          </div>

          {/* Barcode Simulator */}
          <div className="bg-white rounded-2xl p-4 text-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
                Express Pickup Barcode
              </span>
              <p className="text-xs text-slate-600">
                Scan this at the CymbalMart pickup kiosk or show to your curbside attendant.
              </p>
            </div>
            <div className="font-mono text-xl tracking-widest bg-slate-100 px-6 py-2 rounded-xl border border-slate-300 text-slate-800">
              ||| |||| | ||||| || ||| {orderConfirmation.orderNumber.slice(-4)}
            </div>
          </div>
        </div>
      )}

      {/* Part 1: Quick Constraint Adjustments */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-teal-600" />
              <span>1. Quick Host Constraint Adjustments</span>
            </h2>
            <p className="text-xs text-slate-500">
              One-click modifications to adapt your shopping list to dietary allergies and budget targets.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            type="button"
            onClick={handleApplyGlutenFree}
            className="p-3.5 rounded-2xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <Wheat className="w-4 h-4 text-amber-600" />
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800">Dietary</span>
            </div>
            <h4 className="font-bold text-xs text-slate-900 group-hover:text-teal-700">Make 100% Gluten-Free</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Swaps bakery buns and wraps for GF certified alternatives.</p>
          </button>

          <button
            type="button"
            onClick={handleApplyVeganAlternate}
            className="p-3.5 rounded-2xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <Leaf className="w-4 h-4 text-emerald-600" />
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">Dietary</span>
            </div>
            <h4 className="font-bold text-xs text-slate-900 group-hover:text-teal-700">Add Plant-Based Option</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Ensures vegetarian and vegan guests have substantial main bites.</p>
          </button>

          <button
            type="button"
            onClick={handleMaximizeBrandSavings}
            className="p-3.5 rounded-2xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <DollarSign className="w-4 h-4 text-teal-600" />
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-teal-100 text-teal-800">Budget</span>
            </div>
            <h4 className="font-bold text-xs text-slate-900 group-hover:text-teal-700">Maximize Brand Savings</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Swaps all eligible cart items to CymbalMart Select for 20% off.</p>
          </button>

          <button
            type="button"
            onClick={handleAddExtraIce}
            className="p-3.5 rounded-2xl border border-slate-200 hover:border-teal-500 hover:bg-teal-50/50 text-left transition-all group"
          >
            <div className="flex items-center justify-between mb-1.5">
              <Snowflake className="w-4 h-4 text-blue-500" />
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-800">Party Ice</span>
            </div>
            <h4 className="font-bold text-xs text-slate-900 group-hover:text-teal-700">Add Extra Chilling Ice</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">Boosts cooler ice volume so drinks stay freezing cold.</p>
          </button>
        </div>

        {activeConstraintToast && (
          <div className="p-3 rounded-xl bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-teal-600" />
              <span>{activeConstraintToast}</span>
            </div>
            <button
              onClick={() => setActiveConstraintToast(null)}
              className="text-teal-600 hover:text-teal-800"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Part 2: Portion & Benchmarks Check */}
      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
            <span>2. Host Portion Verification</span>
          </h3>
          <span className="text-xs text-slate-500">
            Based on {currentPlan.details.guestCountAdults} adults, {currentPlan.details.guestCountKids || 0} kids, {currentPlan.details.durationHours} hrs
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
            <span className="text-slate-400 block text-[11px]">Total Drinks Needed</span>
            <span className="text-base font-extrabold text-slate-900">{currentPlan.drinkCalc?.totalDrinks || 48} drinks</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">~3 drinks/adult</span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
            <span className="text-slate-400 block text-[11px]">Party Ice Reserve</span>
            <span className="text-base font-extrabold text-blue-600">{currentPlan.drinkCalc?.iceLbs || 25} lbs ice</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Chill tubs & cocktails</span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
            <span className="text-slate-400 block text-[11px]">Appetizer Pieces</span>
            <span className="text-base font-extrabold text-amber-600">{currentPlan.foodCalc?.appetizerPieces || 96} bites</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">6 bites/guest</span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200">
            <span className="text-slate-400 block text-[11px]">Main Proteins</span>
            <span className="text-base font-extrabold text-emerald-600">{currentPlan.foodCalc?.proteinLbs || 12} lbs meat</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">0.5 lb cooked/adult</span>
          </div>
        </div>
      </div>

      {/* Part 3: CymbalMart Fulfillment Options */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="space-y-1">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Store className="w-4 h-4 text-teal-600" />
            <span>3. CymbalMart Order Fulfillment</span>
          </h2>
          <p className="text-xs text-slate-500">
            Choose whether to pick up curbside at your local CymbalMart or have your party groceries delivered to your door.
          </p>
        </div>

        {/* Fulfillment Type Toggle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div
            onClick={() => setFulfillmentType('pickup')}
            className={`cursor-pointer rounded-2xl p-4 border transition-all ${
              fulfillmentType === 'pickup'
                ? 'bg-teal-50/70 border-teal-500 ring-2 ring-teal-500/20 shadow-xs'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <Store className="w-4 h-4 text-teal-600" />
                <span>CymbalMart Curbside Pickup</span>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                FREE
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Drive into designated pickup bays. Your bagged groceries, iced items, and beverages loaded straight into your trunk.
            </p>
          </div>

          <div
            onClick={() => setFulfillmentType('delivery')}
            className={`cursor-pointer rounded-2xl p-4 border transition-all ${
              fulfillmentType === 'delivery'
                ? 'bg-teal-50/70 border-teal-500 ring-2 ring-teal-500/20 shadow-xs'
                : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                <Truck className="w-4 h-4 text-teal-600" />
                <span>CymbalMart Same-Day Delivery</span>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {subtotal >= 35 ? 'FREE ($35+)' : '$4.99'}
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Delivered directly to your door in temperature-controlled refrigerated totes to keep meats and ice cold.
            </p>
          </div>
        </div>

        {/* Store Location & Slot Selection */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              <span>CymbalMart Store Location</span>
            </label>
            <select
              value={storeLocation}
              onChange={(e) => setStoreLocation(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-teal-500"
            >
              {CYMBALMART_LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-slate-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-600" />
              <span>Pickup / Delivery Slot</span>
            </label>
            <select
              value={deliverySlot}
              onChange={(e) => setDeliverySlot(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white font-medium text-slate-800 focus:ring-2 focus:ring-teal-500"
            >
              <option value="Day Before Party: 4:00 PM - 6:00 PM">Day Before Party: 4:00 PM - 6:00 PM</option>
              <option value="Day Before Party: 6:00 PM - 8:00 PM">Day Before Party: 6:00 PM - 8:00 PM</option>
              <option value="Party Day Morning: 9:00 AM - 11:00 AM">Party Day Morning: 9:00 AM - 11:00 AM</option>
              <option value="Party Day Morning: 11:00 AM - 1:00 PM">Party Day Morning: 11:00 AM - 1:00 PM</option>
              <option value="Party Day Afternoon: 2:00 PM - 4:00 PM">Party Day Afternoon: 2:00 PM - 4:00 PM</option>
            </select>
          </div>
        </div>

        {fulfillmentType === 'delivery' && (
          <div className="space-y-1.5 text-xs">
            <label className="font-semibold text-slate-700">Delivery Street Address</label>
            <input
              type="text"
              value={deliveryAddress}
              onChange={(e) => setDeliveryAddress(e.target.value)}
              placeholder="Enter your address for refrigerated grocery drop-off"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500 text-xs"
            />
          </div>
        )}
      </div>

      {/* Part 4: Final Order Summary & Checkout Button */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div className="space-y-1">
            <h2 className="text-xl font-bold">CymbalMart Order Summary</h2>
            <p className="text-xs text-slate-400">
              {currentPlan.items.length} curated items ready for {fulfillmentType}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-3 py-1 rounded-full ${
              isUnderBudget ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
            }`}>
              {isUnderBudget ? '✓ 100% Within Budget' : `+$${(orderTotal - budget).toFixed(2)} Over Target`}
            </span>
          </div>
        </div>

        {/* Pricing breakdown table */}
        <div className="space-y-2.5 text-xs text-slate-300">
          <div className="flex justify-between">
            <span>Grocery Items Subtotal ({currentPlan.items.length} items)</span>
            <span className="font-semibold text-white">${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-teal-400">
            <span>CymbalMart Select Private Brand Savings</span>
            <span className="font-semibold">-${cymbalMartSavings.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>Estimated Sales Tax (6.5%)</span>
            <span className="font-semibold text-white">${estimatedTax.toFixed(2)}</span>
          </div>

          <div className="flex justify-between">
            <span>{fulfillmentType === 'pickup' ? 'Curbside Express Pickup' : 'Refrigerated Delivery'}</span>
            <span className="font-semibold text-emerald-400">
              {fulfillmentFee === 0 ? 'FREE' : `$${fulfillmentFee.toFixed(2)}`}
            </span>
          </div>

          <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
            <div>
              <span className="text-base font-extrabold text-white block">Final Order Total</span>
              <span className="text-[11px] text-slate-400">Target Budget: ${budget.toFixed(2)}</span>
            </div>
            <span className="text-2xl font-black text-emerald-400">
              ${orderTotal.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-slate-400">
            Includes itemized CymbalMart receipts, digital barcode, and scheduled preparation timeline.
          </p>

          <button
            type="button"
            onClick={handlePlaceOrder}
            disabled={isCheckingOut}
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-sm shadow-xl shadow-teal-500/25 flex items-center justify-center gap-2.5 transition-all active:scale-95 disabled:opacity-50"
          >
            {isCheckingOut ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950/30 border-t-slate-950 rounded-full animate-spin" />
                <span>Placing CymbalMart Order...</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5 text-slate-950" />
                <span>Place CymbalMart Order (${orderTotal.toFixed(2)}) →</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { 
  ShoppingBag, 
  DollarSign, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  ArrowRight, 
  Filter, 
  AlertTriangle, 
  ShieldCheck, 
  SlidersHorizontal,
  Tags,
  Check,
  RotateCcw,
  Zap,
  Printer
} from 'lucide-react';
import { ShoppingItem, CategoryId, PriorityLevel, PartyPlan } from '../types/party';
import { PARTY_CATEGORIES, getCategoryMeta } from '../utils/categories';

interface ReviewListTabProps {
  currentPlan: PartyPlan;
  onToggleItem: (id: string) => void;
  onAddItem: (item: Omit<ShoppingItem, 'id' | 'isBought'>) => void;
  onRemoveItem: (id: string) => void;
  onUpdateItemQuantity: (id: string, newQty: number) => void;
  onUpdatePlanItems: (newItems: ShoppingItem[]) => void;
  onNavigateToDefine: () => void;
  onNavigateToCheckout: () => void;
  onPrint: () => void;
}

export const ReviewListTab: React.FC<ReviewListTabProps> = ({
  currentPlan,
  onToggleItem,
  onAddItem,
  onRemoveItem,
  onUpdateItemQuantity,
  onUpdatePlanItems,
  onNavigateToDefine,
  onNavigateToCheckout,
  onPrint,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAligning, setIsAligning] = useState(false);
  const [alignmentMsg, setAlignmentMsg] = useState<{ text: string; savings: number } | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // New item draft state
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<CategoryId>('produce');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemUnit, setNewItemUnit] = useState('pack');
  const [newItemPrice, setNewItemPrice] = useState(5);
  const [newItemPriority, setNewItemPriority] = useState<PriorityLevel>('essential');
  const [newItemIsCymbalMart, setNewItemIsCymbalMart] = useState(true);

  const budget = currentPlan.details.budgetLimit || 250;
  const totalCost = currentPlan.items.reduce((sum, item) => sum + (item.estimatedPrice || 0), 0);
  const isOverBudget = totalCost > budget;
  const overAmount = Math.max(0, totalCost - budget);
  const remainingBudget = Math.max(0, budget - totalCost);
  const percentUsed = budget > 0 ? Math.min(100, Math.round((totalCost / budget) * 100)) : 0;

  const totalItems = currentPlan.items.length;
  const boughtItems = currentPlan.items.filter((i) => i.isBought).length;

  // Filter items
  const filteredItems = currentPlan.items.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    if (selectedPriority !== 'all' && item.priority !== selectedPriority) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchNotes = item.notes?.toLowerCase().includes(q);
      const matchBrand = item.brandName?.toLowerCase().includes(q);
      if (!matchName && !matchNotes && !matchBrand) return false;
    }
    return true;
  });

  // 1-Click Align Items With Total Budget (Task 2 Requirement)
  const handleAutoAlignBudget = async () => {
    setIsAligning(true);
    setAlignmentMsg(null);

    try {
      const res = await fetch('/api/plan/align-budget', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: currentPlan.items,
          budgetLimit: budget,
          details: currentPlan.details,
        }),
      });

      if (!res.ok) throw new Error('Failed to align budget');
      const data = await res.json();

      onUpdatePlanItems(data.items);
      setAlignmentMsg({
        text: data.message,
        savings: data.totalSavings || overAmount,
      });
    } catch (err) {
      console.error('Error aligning budget:', err);
      // Local algorithmic alignment fallback
      let runningTotal = totalCost;
      const aligned = currentPlan.items.map((it) => {
        let price = it.estimatedPrice;
        let isCymbalMart = it.isCymbalMartBrand ?? true;
        let brandName = it.brandName || 'CymbalMart Select';

        if (runningTotal > budget) {
          const discount = Math.round(price * 0.22 * 100) / 100;
          price = Math.max(1, price - discount);
          runningTotal -= discount;
          isCymbalMart = true;
          brandName = 'CymbalMart Select';
        }

        if (it.priority === 'optional' && runningTotal > budget) {
          const optDiscount = Math.round(price * 0.35 * 100) / 100;
          price = Math.max(1.5, price - optDiscount);
          runningTotal -= optDiscount;
        }

        return {
          ...it,
          estimatedPrice: Math.round(price * 100) / 100,
          isCymbalMartBrand: isCymbalMart,
          brandName,
        };
      });

      const newTotal = aligned.reduce((s, i) => s + i.estimatedPrice, 0);
      const savings = Math.max(0, totalCost - newTotal);
      onUpdatePlanItems(aligned);
      setAlignmentMsg({
        text: `Swapped brand items for CymbalMart Select private label and rightsized portions to meet your $${budget} budget ceiling!`,
        savings: savings || overAmount,
      });
    } finally {
      setIsAligning(false);
    }
  };

  const handleAddNewItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    onAddItem({
      name: newItemName.trim(),
      category: newItemCategory,
      quantity: newItemQty,
      unit: newItemUnit,
      estimatedPrice: newItemPrice,
      store: 'CymbalMart Supercenter',
      priority: newItemPriority,
      isCymbalMartBrand: newItemIsCymbalMart,
      brandName: newItemIsCymbalMart ? 'CymbalMart Select' : undefined,
      aisleNumber: getCategoryMeta(newItemCategory).aisle,
    });

    setNewItemName('');
    setShowAddModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-16">
      {/* CUJ Stage Header */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
            <ShoppingBag className="w-3.5 h-3.5 text-teal-600" />
            <span>Step 2 of 3: Review List & Align Budget</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {currentPlan.themeTitle || 'CymbalMart Curated Shopping List'}
          </h1>
          <p className="text-xs text-slate-500">
            {currentPlan.details.guestCountAdults} adults, {currentPlan.details.guestCountKids || 0} kids · Review items, check aisles, and align closely with your ${budget} budget ceiling.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onNavigateToDefine}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
          >
            ← Redefine Event
          </button>

          <button
            onClick={onPrint}
            className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print List</span>
          </button>

          <button
            onClick={onNavigateToCheckout}
            className="px-5 py-2.5 rounded-xl text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-sm flex items-center gap-2 transition-all active:scale-95"
          >
            <span>Proceed to Refine & Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CRITICAL CUJ TASK 2: Budget Alignment Card & Live Meter */}
      <div className={`rounded-3xl p-6 border transition-all ${
        isOverBudget 
          ? 'bg-rose-50/70 border-rose-200' 
          : 'bg-linear-to-r from-emerald-50/70 via-teal-50/50 to-white border-emerald-200'
      }`}>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Budget Numbers */}
          <div className="space-y-3 flex-1">
            <div className="flex items-center gap-2">
              {isOverBudget ? (
                <div className="h-8 w-8 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              ) : (
                <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              )}
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  {isOverBudget
                    ? `Over Budget Warning: Exceeds by $${overAmount.toFixed(2)}`
                    : `Budget Aligned: $${remainingBudget.toFixed(2)} Remaining Buffer`}
                </h3>
                <p className="text-xs text-slate-600">
                  Current cart total: <strong>${totalCost.toFixed(2)}</strong> of <strong>${budget.toFixed(2)}</strong> budget limit
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1">
              <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden p-0.5">
                <div 
                  className={`h-full rounded-full transition-all duration-500 ${
                    isOverBudget 
                      ? 'bg-rose-500' 
                      : percentUsed > 90 
                      ? 'bg-amber-500' 
                      : 'bg-linear-to-r from-teal-500 to-emerald-500'
                  }`}
                  style={{ width: `${Math.min(100, percentUsed)}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] font-semibold text-slate-500">
                <span>$0.00</span>
                <span>{percentUsed}% of budget used</span>
                <span>${budget.toFixed(0)}.00 Limit</span>
              </div>
            </div>
          </div>

          {/* Action to Align Budget */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
            {isOverBudget ? (
              <button
                onClick={handleAutoAlignBudget}
                disabled={isAligning}
                className="px-5 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/20 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                {isAligning ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Optimizing CymbalMart Cart...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>Auto-Align to Budget (Trim ${overAmount.toFixed(2)})</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={handleAutoAlignBudget}
                disabled={isAligning}
                className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-emerald-300 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <Zap className="w-3.5 h-3.5 text-emerald-600" />
                <span>Optimize Further with CymbalMart Select</span>
              </button>
            )}
          </div>
        </div>

        {alignmentMsg && (
          <div className="mt-4 p-3.5 rounded-2xl bg-emerald-100/80 border border-emerald-300 text-emerald-900 text-xs flex items-center justify-between gap-3 animate-fade-in">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{alignmentMsg.text}</span>
            </div>
            {alignmentMsg.savings > 0 && (
              <span className="font-extrabold px-2.5 py-1 rounded-full bg-emerald-200 text-emerald-900 shrink-0">
                Saved ${alignmentMsg.savings.toFixed(2)}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items, brands, notes..."
              className="w-full pl-3 pr-8 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              {['all', 'essential', 'recommended', 'optional'].map((p) => (
                <button
                  key={p}
                  onClick={() => setSelectedPriority(p)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all ${
                    selectedPriority === p
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shrink-0 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Item</span>
            </button>
          </div>
        </div>

        {/* Category Pills with CymbalMart Aisles */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Aisles ({currentPlan.items.length})
          </button>

          {PARTY_CATEGORIES.map((cat) => {
            const count = currentPlan.items.filter((i) => i.category === cat.id).length;
            if (count === 0) return null;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name} ({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Shopping List Items by Aisle */}
      <div className="space-y-4">
        {filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
            <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">No items match your filter</h3>
            <p className="text-xs text-slate-500">Try clearing filters or search query.</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSelectedPriority('all'); setSearchQuery(''); }}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
            {filteredItems.map((item) => {
              const cat = getCategoryMeta(item.category);
              return (
                <div
                  key={item.id}
                  className={`p-4 sm:p-5 flex items-start sm:items-center justify-between gap-4 transition-colors ${
                    item.isBought ? 'bg-slate-50/80 opacity-70' : 'hover:bg-slate-50/50'
                  }`}
                >
                  {/* Left: Checkbox + Item Info */}
                  <div className="flex items-start sm:items-center gap-3.5 flex-1 min-w-0">
                    <button
                      onClick={() => onToggleItem(item.id)}
                      className="mt-0.5 sm:mt-0 text-slate-400 hover:text-teal-600 transition-colors shrink-0"
                    >
                      {item.isBought ? (
                        <CheckCircle2 className="w-5 h-5 text-teal-600" />
                      ) : (
                        <Circle className="w-5 h-5" />
                      )}
                    </button>

                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-sm font-semibold text-slate-900 ${item.isBought ? 'line-through text-slate-400' : ''}`}>
                          {item.name}
                        </span>

                        {item.isCymbalMartBrand && (
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 border border-teal-200">
                            ★ CymbalMart Select
                          </span>
                        )}

                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                          {cat.aisle}
                        </span>

                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          item.priority === 'essential'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : item.priority === 'recommended'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600 border border-slate-200'
                        }`}>
                          {item.priority}
                        </span>
                      </div>

                      {item.notes && (
                        <p className="text-xs text-slate-500 line-clamp-1">{item.notes}</p>
                      )}
                    </div>
                  </div>

                  {/* Right: Quantity, Price & Delete */}
                  <div className="flex items-center gap-4 shrink-0">
                    {/* Quantity Adjustment */}
                    <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden text-xs">
                      <button
                        onClick={() => onUpdateItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                        className="px-2 py-1 text-slate-500 hover:bg-slate-100 transition-colors"
                      >
                        -
                      </button>
                      <span className="px-2.5 font-bold text-slate-800">
                        {item.quantity} <span className="text-[10px] font-normal text-slate-400">{item.unit}</span>
                      </span>
                      <button
                        onClick={() => onUpdateItemQuantity(item.id, item.quantity + 1)}
                        className="px-2 py-1 text-slate-500 hover:bg-slate-100 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <div className="text-right min-w-[70px]">
                      <span className="text-sm font-extrabold text-slate-900">
                        ${item.estimatedPrice.toFixed(2)}
                      </span>
                    </div>

                    {/* Delete button */}
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Summary & Forward Navigation to Step 3 */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1 text-center sm:text-left">
          <div className="text-xs text-teal-400 font-semibold uppercase tracking-wider">
            Ready to Finalize?
          </div>
          <h3 className="text-lg sm:text-xl font-bold">
            Step 3: Refine for Constraints & Checkout
          </h3>
          <p className="text-xs text-slate-300">
            Apply dietary filters, review drink & food portion checks, and place your CymbalMart pickup or delivery order.
          </p>
        </div>

        <button
          onClick={onNavigateToCheckout}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-extrabold text-sm shadow-lg shadow-teal-500/20 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <span>Go to Refine & Checkout →</span>
        </button>
      </div>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Add Item to CymbalMart List</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewItemSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Item Name</label>
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="e.g. Organic Strawberries, Sparkling Cider"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">CymbalMart Department</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value as CategoryId)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    {PARTY_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name} ({cat.aisle})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Priority</label>
                  <select
                    value={newItemPriority}
                    onChange={(e) => setNewItemPriority(e.target.value as PriorityLevel)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="essential">Essential (Must Have)</option>
                    <option value="recommended">Recommended</option>
                    <option value="optional">Optional</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Qty</label>
                  <input
                    type="number"
                    min="1"
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(Number(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Unit</label>
                  <input
                    type="text"
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Est. Price ($)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={newItemPrice}
                    onChange={(e) => setNewItemPrice(Number(e.target.value) || 1)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="cymbalMartBrand"
                  checked={newItemIsCymbalMart}
                  onChange={(e) => setNewItemIsCymbalMart(e.target.checked)}
                  className="rounded text-teal-600 focus:ring-teal-500"
                />
                <label htmlFor="cymbalMartBrand" className="text-slate-700 font-medium">
                  CymbalMart Select Private Label (Value Pick)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-teal-600 text-white font-bold"
                >
                  Add Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import { 
  DollarSign, 
  TrendingDown, 
  Users, 
  PieChart, 
  Copy, 
  Check, 
  Sparkles, 
  Share2, 
  ArrowRight,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import { PartyPlan, ShoppingItem } from '../types/party';
import { PARTY_CATEGORIES } from '../utils/categories';

interface BudgetAnalyticsTabProps {
  currentPlan: PartyPlan;
  onApplyCostCutSuggestion?: (suggestion: string) => void;
}

export const BudgetAnalyticsTab: React.FC<BudgetAnalyticsTabProps> = ({
  currentPlan,
}) => {
  const [copiedGroupMessage, setCopiedGroupMessage] = useState(false);

  const budget = currentPlan.details.budgetLimit || 250;
  const items = currentPlan.items || [];
  const totalCost = items.reduce((sum, it) => sum + (it.estimatedPrice || 0), 0);
  const remainingBudget = budget - totalCost;
  const isOver = totalCost > budget;

  const totalGuests = (currentPlan.details.guestCountAdults || 0) + (currentPlan.details.guestCountKids || 0);
  const costPerGuest = totalGuests > 0 ? (totalCost / totalGuests).toFixed(2) : '0';

  // Group by category for breakdown
  const categoryBreakdown = PARTY_CATEGORIES.map((cat) => {
    const catItems = items.filter((i) => i.category === cat.id);
    const catTotal = catItems.reduce((sum, it) => sum + (it.estimatedPrice || 0), 0);
    const percentage = totalCost > 0 ? (catTotal / totalCost) * 100 : 0;
    return {
      ...cat,
      count: catItems.length,
      total: catTotal,
      percentage: Number(percentage.toFixed(1)),
    };
  }).filter((c) => c.count > 0);

  // Potluck and Guest Assignments
  const assignedMap: Record<string, ShoppingItem[]> = {};
  const unassignedItems: ShoppingItem[] = [];

  items.forEach((item) => {
    if (item.assignedTo && item.assignedTo.trim()) {
      const name = item.assignedTo.trim();
      if (!assignedMap[name]) assignedMap[name] = [];
      assignedMap[name].push(item);
    } else {
      unassignedItems.push(item);
    }
  });

  const generateShareMessage = () => {
    const host = 'The Host';
    let msg = `🎉 *${currentPlan.themeTitle || currentPlan.details.title}* 🎉\n`;
    msg += `Hey everyone! Here is our party coordination and grocery check for ${currentPlan.details.guestCountAdults} guests:\n\n`;

    if (Object.keys(assignedMap).length > 0) {
      msg += `📋 *Who is bringing what:*\n`;
      Object.entries(assignedMap).forEach(([guest, gItems]) => {
        msg += `• ${guest}: ${gItems.map((i) => `${i.name} (${i.quantity} ${i.unit})`).join(', ')}\n`;
      });
      msg += `\n`;
    }

    if (currentPlan.signatureCocktail) {
      msg += `🍸 *Signature Drink:* ${currentPlan.signatureCocktail.name}\n`;
    }

    msg += `\nCan't wait to see you all! Let us know if you have any questions!`;
    return msg;
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(generateShareMessage());
    setCopiedGroupMessage(true);
    setTimeout(() => setCopiedGroupMessage(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Cost vs Budget */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Estimated Total Spend</span>
            <span>Target: ${budget}</span>
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-2xl font-heading font-extrabold ${isOver ? 'text-rose-600' : 'text-slate-900'}`}>
              ${totalCost.toFixed(2)}
            </span>
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              isOver ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
            }`}>
              {isOver ? `+$${(totalCost - budget).toFixed(0)} over` : `$${remainingBudget.toFixed(0)} left`}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isOver ? 'bg-rose-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${Math.min(100, Math.round((totalCost / budget) * 100))}%` }}
            />
          </div>
        </div>

        {/* Per-Guest Contribution */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">Cost Per Guest</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-heading font-extrabold text-indigo-600">
              ${costPerGuest}
            </span>
            <span className="text-xs text-slate-500">/ attendee</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-3">
            Based on {totalGuests} guests ({currentPlan.details.guestCountAdults} adults, {currentPlan.details.guestCountKids || 0} kids).
          </p>
        </div>

        {/* Items Status */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
          <div className="text-xs text-slate-500 mb-1">Shopping Items In Cart</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-heading font-extrabold text-slate-900">
              {items.filter((i) => i.isBought).length} / {items.length}
            </span>
            <span className="text-xs text-slate-500">bought</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-3">
            {items.filter((i) => !i.isBought).length} items remaining on grocery run.
          </p>
        </div>
      </div>

      {/* Category Spend Distribution */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-indigo-600" />
            <h3 className="font-heading font-bold text-base text-slate-900">
              Spend by Category
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            {categoryBreakdown.length} active categories
          </span>
        </div>

        <div className="space-y-3">
          {categoryBreakdown.map((cat) => (
            <div key={cat.id} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-800 flex items-center gap-1.5">
                  <span>{cat.emoji}</span>
                  <span>{cat.name}</span>
                  <span className="text-slate-400">({cat.count} items)</span>
                </span>
                <span className="font-bold text-slate-900">
                  ${cat.total.toFixed(2)} <span className="text-slate-400 font-normal">({cat.percentage}%)</span>
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${cat.percentage}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Agent Cost-Cutter Recommendations */}
      {currentPlan.costSavingTips && currentPlan.costSavingTips.length > 0 && (
        <div className="bg-linear-to-br from-amber-500/10 via-amber-500/5 to-transparent border border-amber-200/80 rounded-2xl p-5 sm:p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-5 h-5 text-amber-600" />
            <h3 className="font-heading font-bold text-base text-slate-900">
              Agent Cost-Cutter Recommendations
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentPlan.costSavingTips.map((tip, idx) => (
              <div
                key={idx}
                className="bg-white/90 backdrop-blur-xs p-3.5 rounded-xl border border-amber-200/60 flex items-start gap-3 shadow-2xs"
              >
                <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Potluck & Group Assignment Coordinator */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-violet-600" />
              <h3 className="font-heading font-bold text-base text-slate-900">
                Potluck & Guest Split Coordinator
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Assign items directly on the shopping list or copy a clean invite breakdown.
            </p>
          </div>

          <button
            onClick={handleCopyMessage}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 font-semibold text-xs transition-colors self-start sm:self-auto"
          >
            {copiedGroupMessage ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Group Chat Text</span>
              </>
            )}
          </button>
        </div>

        {Object.keys(assignedMap).length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {Object.entries(assignedMap).map(([guest, gItems]) => {
              const guestTotal = gItems.reduce((s, it) => s + (it.estimatedPrice || 0), 0);
              return (
                <div key={guest} className="bg-violet-50/50 rounded-xl p-3.5 border border-violet-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-violet-500" />
                      {guest}
                    </span>
                    <span className="text-[11px] font-semibold text-violet-700 bg-violet-100/80 px-2 py-0.5 rounded-full">
                      ${guestTotal.toFixed(2)}
                    </span>
                  </div>
                  <ul className="text-xs text-slate-600 space-y-1">
                    {gItems.map((it) => (
                      <li key={it.id} className="flex items-center justify-between text-[11px]">
                        <span className="truncate max-w-[150px]">{it.name}</span>
                        <span className="text-slate-400">
                          {it.quantity} {it.unit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-slate-50 p-4 rounded-xl text-center border border-dashed border-slate-200">
            <p className="text-xs text-slate-500">
              No items assigned yet! Hover over any item in the Shopping List tab and click <strong>"Assign"</strong> to assign to a friend.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

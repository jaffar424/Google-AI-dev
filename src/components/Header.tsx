import React from 'react';
import { 
  Sparkles, 
  Plus, 
  Printer, 
  Share2, 
  DollarSign, 
  Users, 
  CheckCircle2, 
  PartyPopper,
  ShoppingBag,
  Bot
} from 'lucide-react';
import { PartyPlan } from '../types/party';

interface HeaderProps {
  currentPlan: PartyPlan;
  onOpenNewPartyModal: () => void;
  onToggleAIAssistant: () => void;
  isAIAssistantOpen: boolean;
  onPrint: () => void;
  onShare: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPlan,
  onOpenNewPartyModal,
  onToggleAIAssistant,
  isAIAssistantOpen,
  onPrint,
  onShare,
  activeTab,
  setActiveTab,
}) => {
  const totalItems = currentPlan.items.length;
  const boughtItems = currentPlan.items.filter((i) => i.isBought).length;
  const percentBought = totalItems > 0 ? Math.round((boughtItems / totalItems) * 100) : 0;
  
  const totalCost = currentPlan.items.reduce((sum, it) => sum + (it.estimatedPrice || 0), 0);
  const budget = currentPlan.details.budgetLimit || 250;
  const totalGuests = (currentPlan.details.guestCountAdults || 0) + (currentPlan.details.guestCountKids || 0);
  const costPerGuest = totalGuests > 0 ? (totalCost / totalGuests).toFixed(2) : '0';
  const isOverBudget = totalCost > budget;

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Navbar */}
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-linear-to-tr from-rose-500 via-amber-500 to-violet-600 flex items-center justify-center text-white shadow-md shadow-rose-500/20">
              <PartyPopper className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-xl tracking-tight text-slate-900">
                  Festivity
                </span>
                <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200/60">
                  Shopping Agent
                </span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1 max-w-xs sm:max-w-md">
                {currentPlan.themeTitle || currentPlan.details.title}
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar (Desktop) */}
          <div className="hidden lg:flex items-center gap-6 px-4 py-1.5 bg-slate-50 rounded-xl border border-slate-200/70 text-xs">
            <div className="flex items-center gap-1.5 text-slate-700">
              <Users className="w-4 h-4 text-slate-400" />
              <span>
                <strong className="text-slate-900">{totalGuests}</strong> guests
              </span>
            </div>

            <div className="h-4 w-px bg-slate-200" />

            <div className="flex items-center gap-1.5 text-slate-700">
              <DollarSign className="w-4 h-4 text-emerald-500" />
              <span>
                <strong className={isOverBudget ? 'text-rose-600 font-bold' : 'text-slate-900'}>
                  ${totalCost.toFixed(0)}
                </strong>{' '}
                / ${budget}{' '}
                <span className="text-slate-400">(${costPerGuest}/ea)</span>
              </span>
            </div>

            <div className="h-4 w-px bg-slate-200" />

            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-500" />
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-indigo-500 to-emerald-500 transition-all duration-300"
                    style={{ width: `${percentBought}%` }}
                  />
                </div>
                <span className="font-semibold text-slate-800">{percentBought}%</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleAIAssistant}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all shadow-xs ${
                isAIAssistantOpen
                  ? 'bg-violet-600 text-white shadow-violet-500/25 ring-2 ring-violet-400/40'
                  : 'bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-200'
              }`}
              title="Toggle AI Party Copilot"
            >
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">AI Copilot</span>
            </button>

            <button
              onClick={onPrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200"
              title="Print Grocery List"
            >
              <Printer className="w-4 h-4 text-slate-500" />
              <span className="hidden md:inline">Print</span>
            </button>

            <button
              onClick={onShare}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors border border-slate-200"
              title="Share or Copy List"
            >
              <Share2 className="w-4 h-4 text-slate-500" />
              <span className="hidden md:inline">Share</span>
            </button>

            <button
              onClick={onOpenNewPartyModal}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-linear-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>New Plan</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 scrollbar-none">
          <button
            onClick={() => setActiveTab('shopping')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'shopping'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Shopping List ({totalItems})</span>
          </button>

          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'calculator'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Quantity & Drink Calc</span>
          </button>

          <button
            onClick={() => setActiveTab('budget')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'budget'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Budget & Potluck Split</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'timeline'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Prep Timeline & Run of Show</span>
          </button>
        </div>
      </div>
    </header>
  );
};

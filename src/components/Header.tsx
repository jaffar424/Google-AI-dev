import React from 'react';
import { 
  Sparkles, 
  Plus, 
  Printer, 
  Share2, 
  DollarSign, 
  Users, 
  CheckCircle2, 
  ShoppingBag,
  Bot,
  Store,
  Sliders,
  CalendarDays
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
          {/* CymbalMart Brand */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-linear-to-tr from-teal-600 via-teal-700 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-teal-700/20">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading font-extrabold text-xl tracking-tight text-slate-900">
                  Cymbal<span className="text-teal-600">Mart</span>
                </span>
                <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200/70">
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
              <DollarSign className="w-4 h-4 text-emerald-600" />
              <span>
                <strong className={isOverBudget ? 'text-rose-600 font-bold' : 'text-slate-900'}>
                  ${totalCost.toFixed(0)}
                </strong>{' '}
                / ${budget}{' '}
                <span className="text-slate-400">(${costPerGuest}/guest)</span>
              </span>
            </div>

            <div className="h-4 w-px bg-slate-200" />

            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-600" />
              <div className="flex items-center gap-2">
                <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-teal-500 to-emerald-500 transition-all duration-300"
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
                  ? 'bg-teal-700 text-white shadow-teal-700/25 ring-2 ring-teal-400/40'
                  : 'bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200'
              }`}
              title="Toggle CymbalMart Shopping Agent Chat"
            >
              <Bot className="w-4 h-4" />
              <span className="hidden sm:inline">AI Agent</span>
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
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-linear-to-r from-teal-600 to-indigo-700 hover:from-teal-700 hover:to-indigo-800 text-white shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>New Event</span>
            </button>
          </div>
        </div>

        {/* CUJ Stage Tabs Navigation */}
        <div className="flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 scrollbar-none">
          {/* CUJ Task 1 */}
          <button
            onClick={() => setActiveTab('define')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'define'
                ? 'bg-teal-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            <span>1. Define Event</span>
          </button>

          {/* CUJ Task 2 */}
          <button
            onClick={() => setActiveTab('review')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'review'
                ? 'bg-teal-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>2. Review List ({totalItems})</span>
            {isOverBudget && (
              <span className="h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white" />
            )}
          </button>

          {/* CUJ Task 3 */}
          <button
            onClick={() => setActiveTab('checkout')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'checkout'
                ? 'bg-teal-800 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>3. Refine & Checkout</span>
            {currentPlan.fulfillment?.status === 'placed' && (
              <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.2 rounded-full">Placed</span>
            )}
          </button>

          <div className="h-4 w-px bg-slate-200 mx-1 shrink-0" />

          {/* Supplementary Calculators & Timeline */}
          <button
            onClick={() => setActiveTab('calculator')}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'calculator'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Portion & Drink Calc</span>
          </button>

          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'timeline'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>Prep Timeline & Run of Show</span>
          </button>
        </div>
      </div>
    </header>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Wine, 
  CupSoda, 
  Users, 
  Clock, 
  DollarSign, 
  Check, 
  Share2, 
  Bot,
  PartyPopper,
  Flame,
  Tag
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PartyPlan, ShoppingItem, PartyDetails } from './types/party';
import { createPartyFromTemplate } from './utils/templates';
import { calculatePartyDrinks, calculatePartyFood } from './utils/calculator';
import { Header } from './components/Header';
import { ShoppingListTab } from './components/ShoppingListTab';
import { PartyCalculatorTab } from './components/PartyCalculatorTab';
import { BudgetAnalyticsTab } from './components/BudgetAnalyticsTab';
import { TimelineRunOfShowTab } from './components/TimelineRunOfShowTab';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { NewPartyModal } from './components/NewPartyModal';
import { PrintView } from './components/PrintView';

const STORAGE_KEY = 'festivity_party_plan_v1';

export default function App() {
  const [currentPlan, setCurrentPlan] = useState<PartyPlan>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load saved party plan:', e);
    }
    return createPartyFromTemplate('taco_fiesta');
  });

  const [activeTab, setActiveTab] = useState<string>('shopping');
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [isNewPartyModalOpen, setIsNewPartyModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentPlan));
    } catch (e) {
      console.error('Failed to save party plan:', e);
    }
  }, [currentPlan]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Item Handlers
  const handleToggleItem = (id: string) => {
    setCurrentPlan((prev) => {
      const updated = prev.items.map((item) =>
        item.id === id ? { ...item, isBought: !item.isBought } : item
      );

      // Check if all items bought
      const allBought = updated.every((i) => i.isBought);
      if (allBought && updated.length > 0) {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
        });
        showToast('🎉 All shopping items checked off!');
      }

      return { ...prev, items: updated };
    });
  };

  const handleDeleteItem = (id: string) => {
    setCurrentPlan((prev) => ({
      ...prev,
      items: prev.items.filter((it) => it.id !== id),
    }));
  };

  const handleAddItem = (newItem: Omit<ShoppingItem, 'id' | 'isBought'>) => {
    const item: ShoppingItem = {
      ...newItem,
      id: `item_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      isBought: false,
    };
    setCurrentPlan((prev) => ({
      ...prev,
      items: [item, ...prev.items],
    }));
    showToast(`Added "${item.name}" to shopping list`);
  };

  const handleUpdateItem = (id: string, updates: Partial<ShoppingItem>) => {
    setCurrentPlan((prev) => ({
      ...prev,
      items: prev.items.map((it) => (it.id === id ? { ...it, ...updates } : it)),
    }));
  };

  const handleBulkMark = (bought: boolean) => {
    setCurrentPlan((prev) => ({
      ...prev,
      items: prev.items.map((it) => ({ ...it, isBought: bought })),
    }));
    showToast(bought ? 'Marked all items as purchased!' : 'Reset all checkboxes.');
  };

  // Quantity Recalibration & Sync
  const handleUpdatePlanDetails = (details: PartyDetails) => {
    const drinkCalc = calculatePartyDrinks(details);
    const foodCalc = calculatePartyFood(details);
    setCurrentPlan((prev) => ({
      ...prev,
      details,
      drinkCalc,
      foodCalc,
    }));
  };

  const handleSyncCalculatedQuantities = () => {
    const { drinkCalc, foodCalc } = currentPlan;
    setCurrentPlan((prev) => {
      const updatedItems = prev.items.map((item) => {
        const nameLower = item.name.toLowerCase();

        // Sync Ice
        if (nameLower.includes('ice') && item.category === 'ice') {
          return {
            ...item,
            quantity: drinkCalc.iceLbs,
            unit: 'lbs',
            estimatedPrice: Math.ceil(drinkCalc.iceLbs * 0.35),
          };
        }

        // Sync Beer
        if (
          (nameLower.includes('beer') || nameLower.includes('ipa') || nameLower.includes('lager')) &&
          item.category === 'alcohol'
        ) {
          return {
            ...item,
            quantity: drinkCalc.beerBottles,
            unit: 'bottles/cans',
            estimatedPrice: Math.ceil(drinkCalc.beerBottles * 1.25),
          };
        }

        // Sync Wine
        if (nameLower.includes('wine') && item.category === 'alcohol') {
          return {
            ...item,
            quantity: Math.max(1, Math.round(drinkCalc.wineBottles / 2)),
            unit: 'bottles',
            estimatedPrice: Math.max(1, Math.round(drinkCalc.wineBottles / 2)) * 14,
          };
        }

        // Sync Main Meat / Protein
        if (
          (nameLower.includes('pork') ||
            nameLower.includes('beef') ||
            nameLower.includes('chicken') ||
            nameLower.includes('patty') ||
            nameLower.includes('patties')) &&
          item.category === 'proteins'
        ) {
          const scaledLbs = Math.max(2, Math.round(foodCalc.proteinLbs * 0.6));
          return {
            ...item,
            quantity: scaledLbs,
            unit: 'lbs',
            estimatedPrice: scaledLbs * 4.5,
          };
        }

        return item;
      });

      return {
        ...prev,
        items: updatedItems,
      };
    });

    showToast('Recalculated & updated grocery quantities!');
  };

  // AI Assistant Integrations
  const handleApplyAddedItems = (newItems: ShoppingItem[]) => {
    setCurrentPlan((prev) => ({
      ...prev,
      items: [...newItems, ...prev.items],
    }));
    showToast(`Added ${newItems.length} items from Festivity Copilot!`);
  };

  const handleApplyRemovedItems = (itemIds: string[]) => {
    setCurrentPlan((prev) => ({
      ...prev,
      items: prev.items.filter((it) => !itemIds.includes(it.id)),
    }));
    showToast(`Removed items to cut costs.`);
  };

  // Timeline Handlers
  const handleToggleTask = (phaseIndex: number, taskId: string) => {
    setCurrentPlan((prev) => {
      const newTimeline = prev.timeline.map((phase, pIdx) => {
        if (pIdx !== phaseIndex) return phase;
        return {
          ...phase,
          tasks: phase.tasks.map((task) =>
            task.id === taskId ? { ...task, completed: !task.completed } : task
          ),
        };
      });
      return { ...prev, timeline: newTimeline };
    });
  };

  const handleAddTask = (phaseIndex: number, taskName: string, category: string) => {
    setCurrentPlan((prev) => {
      const newTimeline = prev.timeline.map((phase, pIdx) => {
        if (pIdx !== phaseIndex) return phase;
        return {
          ...phase,
          tasks: [
            ...phase.tasks,
            {
              id: `task_${Date.now()}`,
              task: taskName,
              completed: false,
              category: (category as any) || 'Shopping',
            },
          ],
        };
      });
      return { ...prev, timeline: newTimeline };
    });
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    const text = `🎉 Planning "${currentPlan.themeTitle || currentPlan.details.title}" with Festivity Party Shopping Agent! ${currentPlan.items.length} shopping items organized.`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast('Party summary copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        currentPlan={currentPlan}
        onOpenNewPartyModal={() => setIsNewPartyModalOpen(true)}
        onToggleAIAssistant={() => setIsAIAssistantOpen(!isAIAssistantOpen)}
        isAIAssistantOpen={isAIAssistantOpen}
        onPrint={handlePrint}
        onShare={handleShare}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        {/* Themed Hero Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs relative overflow-hidden">
          {/* Subtle decorative background gradient */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-bl from-rose-100/40 via-amber-100/30 to-transparent rounded-full blur-2xl pointer-events-none -mr-20 -mt-20" />

          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-slate-900 text-white text-xs font-bold tracking-wide">
                  {currentPlan.details.eventType || 'Dinner Party'}
                </span>
                {currentPlan.vibeKeywords &&
                  currentPlan.vibeKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200"
                    >
                      {kw}
                    </span>
                  ))}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsAIAssistantOpen(true)}
                  className="px-3 py-1.5 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 text-xs font-bold flex items-center gap-1.5 transition-colors border border-violet-200/60"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Ask Copilot to Customize</span>
                </button>
              </div>
            </div>

            <div>
              <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                {currentPlan.themeTitle || currentPlan.details.title}
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-3xl leading-relaxed">
                {currentPlan.themeDescription}
              </p>
            </div>

            {/* Signature Drinks Spotlight */}
            {(currentPlan.signatureCocktail || currentPlan.signatureMocktail) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {currentPlan.signatureCocktail && (
                  <div className="p-3.5 rounded-2xl bg-linear-to-br from-rose-50/70 to-pink-50/40 border border-rose-200/60 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-rose-100 text-rose-700 shrink-0">
                      <Wine className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700">
                          Signature Cocktail
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                        {currentPlan.signatureCocktail.name}
                      </h4>
                      <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                        {currentPlan.signatureCocktail.description}
                      </p>
                    </div>
                  </div>
                )}

                {currentPlan.signatureMocktail && (
                  <div className="p-3.5 rounded-2xl bg-linear-to-br from-cyan-50/70 to-blue-50/40 border border-cyan-200/60 flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-cyan-100 text-cyan-700 shrink-0">
                      <CupSoda className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-700">
                          Zero-Proof Signature
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 truncate mt-0.5">
                        {currentPlan.signatureMocktail.name}
                      </h4>
                      <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5">
                        {currentPlan.signatureMocktail.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Tab Content Display */}
        {activeTab === 'shopping' && (
          <ShoppingListTab
            items={currentPlan.items}
            onToggleItem={handleToggleItem}
            onDeleteItem={handleDeleteItem}
            onAddItem={handleAddItem}
            onUpdateItem={handleUpdateItem}
            onBulkMark={handleBulkMark}
          />
        )}

        {activeTab === 'calculator' && (
          <PartyCalculatorTab
            currentPlan={currentPlan}
            onUpdatePlanDetails={handleUpdatePlanDetails}
            onSyncCalculatedQuantitiesToItems={handleSyncCalculatedQuantities}
          />
        )}

        {activeTab === 'budget' && (
          <BudgetAnalyticsTab currentPlan={currentPlan} />
        )}

        {activeTab === 'timeline' && (
          <TimelineRunOfShowTab
            currentPlan={currentPlan}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
          />
        )}
      </main>

      {/* AI Assistant Copilot Drawer */}
      <AIAssistantDrawer
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        currentPlan={currentPlan}
        onApplyAddedItems={handleApplyAddedItems}
        onApplyRemovedItems={handleApplyRemovedItems}
      />

      {/* New Party Modal */}
      <NewPartyModal
        isOpen={isNewPartyModalOpen}
        onClose={() => setIsNewPartyModalOpen(false)}
        onPlanCreated={(plan) => {
          setCurrentPlan(plan);
          setActiveTab('shopping');
          showToast(`Loaded ${plan.themeTitle || plan.details.title}!`);
        }}
      />

      {/* Printable View (Hidden in browser, active when printing) */}
      <PrintView currentPlan={currentPlan} />
    </div>
  );
}

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
  Store,
  Sliders,
  ShoppingBag,
  ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { PartyPlan, ShoppingItem, PartyDetails, FulfillmentDetails } from './types/party';
import { createPartyFromTemplate } from './utils/templates';
import { calculatePartyDrinks, calculatePartyFood } from './utils/calculator';
import { Header } from './components/Header';
import { DefineEventTab } from './components/DefineEventTab';
import { ReviewListTab } from './components/ReviewListTab';
import { RefineCheckoutTab } from './components/RefineCheckoutTab';
import { PartyCalculatorTab } from './components/PartyCalculatorTab';
import { TimelineRunOfShowTab } from './components/TimelineRunOfShowTab';
import { AIAssistantDrawer } from './components/AIAssistantDrawer';
import { NewPartyModal } from './components/NewPartyModal';
import { PrintView } from './components/PrintView';

const STORAGE_KEY = 'cymbalmart_tropical_birthday_v1';

export default function App() {
  const [currentPlan, setCurrentPlan] = useState<PartyPlan>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load saved party plan:', e);
    }
    return createPartyFromTemplate('tropical_birthday');
  });

  // Default active tab to review if plan exists, or define if host wants fresh start
  const [activeTab, setActiveTab] = useState<string>('review');
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

      const allBought = updated.every((i) => i.isBought);
      if (allBought && updated.length > 0) {
        confetti({
          particleCount: 80,
          spread: 80,
          origin: { y: 0.6 },
        });
        showToast('🎉 All CymbalMart items in cart!');
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
    showToast(`Added "${item.name}" to cart`);
  };

  const handleUpdateItemQuantity = (id: string, newQty: number) => {
    setCurrentPlan((prev) => ({
      ...prev,
      items: prev.items.map((it) => {
        if (it.id !== id) return it;
        const singlePrice = it.quantity > 0 ? it.estimatedPrice / it.quantity : it.estimatedPrice;
        return {
          ...it,
          quantity: newQty,
          estimatedPrice: Math.round(singlePrice * newQty * 100) / 100,
        };
      }),
    }));
  };

  const handleUpdatePlanItems = (newItems: ShoppingItem[]) => {
    setCurrentPlan((prev) => ({
      ...prev,
      items: newItems,
    }));
  };

  const handleUpdateFulfillment = (fulfillment: FulfillmentDetails) => {
    setCurrentPlan((prev) => ({
      ...prev,
      fulfillment,
    }));
    showToast('Order details updated!');
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
            estimatedPrice: Math.ceil(drinkCalc.iceLbs * 0.3),
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
            estimatedPrice: Math.ceil(drinkCalc.beerBottles * 1.15),
          };
        }

        // Sync Wine
        if (nameLower.includes('wine') && item.category === 'alcohol') {
          return {
            ...item,
            quantity: Math.max(1, Math.round(drinkCalc.wineBottles / 2)),
            unit: 'bottles',
            estimatedPrice: Math.max(1, Math.round(drinkCalc.wineBottles / 2)) * 13,
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
            estimatedPrice: scaledLbs * 4.25,
          };
        }

        return item;
      });

      return {
        ...prev,
        items: updatedItems,
      };
    });

    showToast('Recalculated quantities for guest count!');
  };

  // AI Assistant Integrations
  const handleApplyAddedItems = (newItems: ShoppingItem[]) => {
    setCurrentPlan((prev) => ({
      ...prev,
      items: [...newItems, ...prev.items],
    }));
    showToast(`Added ${newItems.length} items from CymbalMart Copilot!`);
  };

  const handleApplyRemovedItems = (itemIds: string[]) => {
    setCurrentPlan((prev) => ({
      ...prev,
      items: prev.items.filter((it) => !itemIds.includes(it.id)),
    }));
    showToast(`Trimmed items from cart.`);
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
    const text = `🛒 CymbalMart Shopping Agent: "${currentPlan.themeTitle || currentPlan.details.title}" with ${currentPlan.items.length} curated grocery items. Budget: $${currentPlan.details.budgetLimit}.`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      showToast('Party plan & shopping link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-teal-400 stroke-[3]" />
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

      {/* CUJ Stepper Tracker Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span className="hidden sm:inline">Critical User Journey:</span>
            
            <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-center sm:justify-start sm:ml-4">
              <button
                onClick={() => setActiveTab('define')}
                className={`flex items-center gap-1.5 transition-colors ${
                  activeTab === 'define'
                    ? 'text-teal-700 font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  activeTab === 'define' ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-700'
                }`}>1</span>
                <span>Define Event</span>
              </button>

              <span className="text-slate-300">→</span>

              <button
                onClick={() => setActiveTab('review')}
                className={`flex items-center gap-1.5 transition-colors ${
                  activeTab === 'review'
                    ? 'text-teal-700 font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  activeTab === 'review' ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-700'
                }`}>2</span>
                <span>Review List & Align Budget</span>
              </button>

              <span className="text-slate-300">→</span>

              <button
                onClick={() => setActiveTab('checkout')}
                className={`flex items-center gap-1.5 transition-colors ${
                  activeTab === 'checkout'
                    ? 'text-teal-700 font-extrabold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                  activeTab === 'checkout' ? 'bg-teal-700 text-white' : 'bg-slate-200 text-slate-700'
                }`}>3</span>
                <span>Refine & Checkout</span>
              </button>
            </div>

            <div className="hidden md:flex items-center gap-2 text-teal-800 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-200">
              <Store className="w-3.5 h-3.5 text-teal-600" />
              <span>CymbalMart Curated List</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Page Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full space-y-6">
        {/* Step 1: Define Event */}
        {activeTab === 'define' && (
          <DefineEventTab
            currentPlan={currentPlan}
            onPlanGenerated={(newPlan) => {
              setCurrentPlan(newPlan);
              showToast(`Created "${newPlan.themeTitle || newPlan.details.title}"!`);
            }}
            onNavigateToReview={() => setActiveTab('review')}
          />
        )}

        {/* Step 2: Review List */}
        {activeTab === 'review' && (
          <ReviewListTab
            currentPlan={currentPlan}
            onToggleItem={handleToggleItem}
            onAddItem={handleAddItem}
            onRemoveItem={handleDeleteItem}
            onUpdateItemQuantity={handleUpdateItemQuantity}
            onUpdatePlanItems={handleUpdatePlanItems}
            onNavigateToDefine={() => setActiveTab('define')}
            onNavigateToCheckout={() => setActiveTab('checkout')}
            onPrint={handlePrint}
          />
        )}

        {/* Step 3: Refine & Checkout */}
        {activeTab === 'checkout' && (
          <RefineCheckoutTab
            currentPlan={currentPlan}
            onUpdatePlanItems={handleUpdatePlanItems}
            onUpdateFulfillment={handleUpdateFulfillment}
            onNavigateToReview={() => setActiveTab('review')}
            onNavigateToDefine={() => setActiveTab('define')}
            onPrint={handlePrint}
            onShare={handleShare}
          />
        )}

        {/* Supplementary Utility Tab: Calculator */}
        {activeTab === 'calculator' && (
          <PartyCalculatorTab
            currentPlan={currentPlan}
            onUpdatePlanDetails={handleUpdatePlanDetails}
            onSyncCalculatedQuantitiesToItems={handleSyncCalculatedQuantities}
          />
        )}

        {/* Supplementary Utility Tab: Timeline */}
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
          setActiveTab('review');
          showToast(`Loaded ${plan.themeTitle || plan.details.title}!`);
        }}
      />

      {/* Printable View (Hidden in browser, active when printing) */}
      <PrintView currentPlan={currentPlan} />
    </div>
  );
}

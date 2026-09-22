import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  Plus, 
  DollarSign, 
  ChefHat, 
  Wine, 
  ArrowRight,
  Check,
  ShoppingBag,
  Loader2
} from 'lucide-react';
import { PartyPlan, ShoppingItem, ChatMessage } from '../types/party';

interface AIAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentPlan: PartyPlan;
  onApplyAddedItems: (items: ShoppingItem[]) => void;
  onApplyRemovedItems: (itemIds: string[]) => void;
}

export const AIAssistantDrawer: React.FC<AIAssistantDrawerProps> = ({
  isOpen,
  onClose,
  currentPlan,
  onApplyAddedItems,
  onApplyRemovedItems,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'agent',
      text: `Hello! I'm Festivity, your Party Planner Shopping Agent. I'm actively reviewing your **${currentPlan.themeTitle || currentPlan.details.title}** plan.

Ask me to:
• Suggest signature cocktail or mocktail batch recipes
• Find swaps to cut $30-$50 from your budget
• Recommend zero-cook Trader Joe's or Costco appetizers
• Add specific ingredients or convert recipes into shopping items!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedPrompts: [
        'How can I cut $35 from this list?',
        'Batch cocktail recipe for 16 guests',
        'Add gluten-free finger food items',
        'Recommend store-bought Costco appetizers',
      ],
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeMode, setActiveMode] = useState<'chat' | 'recipe'>('chat');

  // Recipe to list inputs
  const [recipeText, setRecipeText] = useState('');
  const [recipeServings, setRecipeServings] = useState(currentPlan.details.guestCountAdults || 12);
  const [isConvertingRecipe, setIsConvertingRecipe] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user_${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          history: messages.slice(-6),
          currentPlan,
        }),
      });

      const data = await response.json();

      const agentMsg: ChatMessage = {
        id: `agent_${Date.now()}`,
        sender: 'agent',
        text: data.text || 'I analyzed your request. Here are my recommendations!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedPrompts: data.suggestedPrompts || [],
        itemModifications: data.itemModifications,
      };

      setMessages((prev) => [...prev, agentMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `agent_err_${Date.now()}`,
        sender: 'agent',
        text: "I ran into a momentary connection hiccup, but you can adjust any item on the list directly or ask me again.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConvertRecipe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipeText.trim() || isConvertingRecipe) return;

    setIsConvertingRecipe(true);
    try {
      const response = await fetch('/api/recipe-to-list', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipeText: recipeText.trim(),
          servings: recipeServings,
        }),
      });

      const data = await response.json();
      if (data.items && data.items.length > 0) {
        onApplyAddedItems(data.items);
        const confirmationMsg: ChatMessage = {
          id: `recipe_added_${Date.now()}`,
          sender: 'agent',
          text: `Added **${data.items.length} ingredients** for "${recipeText}" (scaled for ${recipeServings} guests) directly into your shopping list!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          itemModifications: {
            added: data.items,
          },
        };
        setMessages((prev) => [...prev, confirmationMsg]);
        setActiveMode('chat');
        setRecipeText('');
      }
    } catch (err) {
      console.error('Recipe conversion error:', err);
    } finally {
      setIsConvertingRecipe(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[450px] bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-250">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200/80 bg-slate-900 text-white flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-linear-to-tr from-violet-500 to-amber-500 flex items-center justify-center text-white shadow-xs">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-sm">Festivity Shopping Copilot</h3>
            <span className="text-[10px] text-amber-300 font-medium">
              Powered by Gemini 3.8
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Subtab Toggle (Chat vs Recipe to List) */}
      <div className="flex border-b border-slate-200 text-xs bg-slate-50 p-1">
        <button
          onClick={() => setActiveMode('chat')}
          className={`flex-1 py-1.5 rounded-md font-semibold transition-all flex items-center justify-center gap-1.5 ${
            activeMode === 'chat' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          <Bot className="w-3.5 h-3.5 text-violet-600" />
          <span>Agent Assistant</span>
        </button>
        <button
          onClick={() => setActiveMode('recipe')}
          className={`flex-1 py-1.5 rounded-md font-semibold transition-all flex items-center justify-center gap-1.5 ${
            activeMode === 'recipe' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          <ChefHat className="w-3.5 h-3.5 text-amber-600" />
          <span>Recipe to List</span>
        </button>
      </div>

      {activeMode === 'chat' ? (
        <>
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-slate-900 text-white rounded-br-xs'
                      : 'bg-slate-100 text-slate-800 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* If the agent proposed item additions */}
                  {msg.itemModifications?.added && msg.itemModifications.added.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-slate-200/80 bg-white/80 p-2.5 rounded-xl text-slate-800 space-y-2">
                      <div className="flex items-center justify-between text-[11px] font-bold text-indigo-900">
                        <span>Items to Add ({msg.itemModifications.added.length})</span>
                        <span>
                          ≈ $
                          {msg.itemModifications.added
                            .reduce((s, i) => s + (i.estimatedPrice || 0), 0)
                            .toFixed(2)}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-600 space-y-1">
                        {msg.itemModifications.added.map((it, idx) => (
                          <div key={idx} className="flex justify-between">
                            <span>
                              • {it.name} ({it.quantity} {it.unit})
                            </span>
                            <span className="font-semibold text-slate-700">${it.estimatedPrice}</span>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => onApplyAddedItems(msg.itemModifications!.added!)}
                        className="w-full mt-1 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add All to Shopping List</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Suggested Follow-up Chips */}
                {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {msg.suggestedPrompts.map((prompt, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => handleSendMessage(prompt)}
                        className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/70 transition-colors text-left"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                )}

                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl w-fit">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
                <span>Festivity is planning...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t border-slate-200 bg-white">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask Festivity or request an item..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="submit"
                disabled={!inputMessage.trim() || isLoading}
                className="p-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl transition-colors shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </>
      ) : (
        /* RECIPE TO SHOPPING LIST CONVERTER */
        <div className="flex-1 p-5 space-y-4 overflow-y-auto">
          <div>
            <h4 className="font-heading font-bold text-sm text-slate-900">
              Recipe to Grocery List Converter
            </h4>
            <p className="text-xs text-slate-500 mt-1">
              Paste any party dish, cocktail, or recipe. Gemini will scale ingredients for your guest count and add them to your shopping list with store tags!
            </p>
          </div>

          <form onSubmit={handleConvertRecipe} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Dish Name or Recipe Text
              </label>
              <textarea
                rows={4}
                required
                placeholder="e.g. Classic Mexican Street Corn Dip (Elote) with cotija cheese, roasted corn, lime, cilantro, and chili powder"
                value={recipeText}
                onChange={(e) => setRecipeText(e.target.value)}
                className="w-full p-3 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Scale for Guests
              </label>
              <input
                type="number"
                min="2"
                max="100"
                value={recipeServings}
                onChange={(e) => setRecipeServings(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <button
              type="submit"
              disabled={isConvertingRecipe || !recipeText.trim()}
              className="w-full py-2.5 bg-linear-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              {isConvertingRecipe ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Converting & Scaling Ingredients...</span>
                </>
              ) : (
                <>
                  <ChefHat className="w-4 h-4" />
                  <span>Convert & Add to Shopping List</span>
                </>
              )}
            </button>
          </form>

          {/* Fast Presets */}
          <div className="pt-4 border-t border-slate-100">
            <p className="text-xs font-bold text-slate-600 mb-2">Popular Party Additions:</p>
            <div className="space-y-1.5">
              {[
                'Aperol Spritz Batch (Aperol, Prosecco, Soda, Oranges)',
                'Caprese Skewers with Balsamic Glaze',
                'Warm Artichoke & Spinach Dip with Pita Chips',
                'Mini Pulled Pork Sliders with Pickles',
              ].map((rec, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setRecipeText(rec)}
                  className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-xs text-slate-700 flex items-center justify-between group"
                >
                  <span className="truncate">{rec}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-700" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

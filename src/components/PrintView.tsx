import React from 'react';
import { PartyPlan } from '../types/party';
import { STORES_LIST } from '../utils/categories';

interface PrintViewProps {
  currentPlan: PartyPlan;
}

export const PrintView: React.FC<PrintViewProps> = ({ currentPlan }) => {
  const items = currentPlan.items || [];
  const totalCost = items.reduce((sum, it) => sum + (it.estimatedPrice || 0), 0);

  return (
    <div className="hidden print:block p-8 bg-white text-black font-sans">
      {/* Print Header */}
      <div className="border-b-2 border-black pb-4 mb-6">
        <h1 className="text-2xl font-black uppercase tracking-tight">
          {currentPlan.themeTitle || currentPlan.details.title} — Party Grocery List
        </h1>
        <div className="flex justify-between text-xs mt-2 font-medium">
          <span>Guests: {currentPlan.details.guestCountAdults} Adults, {currentPlan.details.guestCountKids || 0} Kids</span>
          <span>Target Budget: ${currentPlan.details.budgetLimit} | Est Total: ${totalCost.toFixed(2)}</span>
          <span>Printed on {new Date().toLocaleDateString()}</span>
        </div>
        {currentPlan.signatureCocktail && (
          <div className="text-xs mt-2 italic bg-slate-100 p-2 rounded">
            <strong>Signature Cocktail:</strong> {currentPlan.signatureCocktail.name} ({currentPlan.signatureCocktail.description})
          </div>
        )}
      </div>

      {/* Store Sections */}
      <div className="space-y-6">
        {STORES_LIST.map((store) => {
          const storeItems = items.filter((i) => i.store === store);
          if (storeItems.length === 0) return null;

          return (
            <div key={store} className="break-inside-avoid">
              <h2 className="text-sm font-bold uppercase tracking-wider bg-slate-200 px-2 py-1 mb-2 border-b border-black">
                📍 {store} ({storeItems.length} items)
              </h2>
              <table className="w-full text-xs text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-300">
                    <th className="w-6 py-1">✓</th>
                    <th className="py-1">Item</th>
                    <th className="py-1 w-28">Quantity</th>
                    <th className="py-1 w-20 text-right">Est. Price</th>
                    <th className="py-1">Notes / Assignee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {storeItems.map((item) => (
                    <tr key={item.id} className="py-1">
                      <td className="py-1">
                        <div className="w-3.5 h-3.5 border border-black rounded-xs"></div>
                      </td>
                      <td className="py-1 font-semibold">{item.name}</td>
                      <td className="py-1">{item.quantity} {item.unit}</td>
                      <td className="py-1 text-right">${(item.estimatedPrice || 0).toFixed(2)}</td>
                      <td className="py-1 text-slate-600 text-[11px]">
                        {item.assignedTo ? `[Brought by ${item.assignedTo}] ` : ''}
                        {item.notes || ''}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>

      {/* Drink Benchmarks Summary Box */}
      <div className="mt-8 pt-4 border-t-2 border-black break-inside-avoid">
        <h3 className="text-xs font-bold uppercase mb-2">Bartender & Ice Reference:</h3>
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div>Beer: <strong>{currentPlan.drinkCalc.beerBottles} bottles/cans</strong></div>
          <div>Wine: <strong>{currentPlan.drinkCalc.wineBottles} bottles (750ml)</strong></div>
          <div>Liquor: <strong>{currentPlan.drinkCalc.liquorBottles750ml} bottles (750ml)</strong></div>
          <div>Ice: <strong>{currentPlan.drinkCalc.iceLbs} lbs total</strong></div>
        </div>
      </div>
    </div>
  );
};

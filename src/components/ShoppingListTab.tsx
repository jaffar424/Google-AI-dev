import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Check, 
  Trash2, 
  Store, 
  UserCheck, 
  DollarSign, 
  Sparkles,
  ShoppingBag,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Tag,
  MapPin,
  CheckCheck,
  RotateCcw
} from 'lucide-react';
import { ShoppingItem, CategoryId, StoreType, PriorityLevel } from '../types/party';
import { PARTY_CATEGORIES, STORES_LIST, STORE_COLORS, getCategoryMeta } from '../utils/categories';

interface ShoppingListTabProps {
  items: ShoppingItem[];
  onToggleItem: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onAddItem: (item: Omit<ShoppingItem, 'id' | 'isBought'>) => void;
  onUpdateItem: (id: string, updates: Partial<ShoppingItem>) => void;
  onBulkMark: (bought: boolean) => void;
}

export const ShoppingListTab: React.FC<ShoppingListTabProps> = ({
  items,
  onToggleItem,
  onDeleteItem,
  onAddItem,
  onUpdateItem,
  onBulkMark,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStore, setSelectedStore] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unbought' | 'bought'>('all');
  const [viewMode, setViewMode] = useState<'category' | 'store' | 'compact'>('category');
  const [showAddForm, setShowAddForm] = useState(false);
  const [assigneeModalItem, setAssigneeModalItem] = useState<ShoppingItem | null>(null);
  const [assigneeName, setAssigneeName] = useState('');

  // Form state for adding an item
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<CategoryId>('pantry_snacks');
  const [newItemStore, setNewItemStore] = useState<StoreType>('Local Supermarket');
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [newItemUnit, setNewItemUnit] = useState('units');
  const [newItemPrice, setNewItemPrice] = useState(5);
  const [newItemPriority, setNewItemPriority] = useState<PriorityLevel>('essential');
  const [newItemNotes, setNewItemNotes] = useState('');

  // Filtering
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.notes && item.notes.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.assignedTo && item.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStore = selectedStore === 'all' || item.store === selectedStore;
      const matchesStatus = 
        statusFilter === 'all' || 
        (statusFilter === 'unbought' && !item.isBought) || 
        (statusFilter === 'bought' && item.isBought);

      return matchesSearch && matchesStore && matchesStatus;
    });
  }, [items, searchQuery, selectedStore, statusFilter]);

  // Store Route Optimization Summary
  const storeCounts = useMemo(() => {
    const counts: Record<string, { total: number; unbought: number; estimatedCost: number }> = {};
    items.forEach((item) => {
      if (!counts[item.store]) {
        counts[item.store] = { total: 0, unbought: 0, estimatedCost: 0 };
      }
      counts[item.store].total += 1;
      if (!item.isBought) counts[item.store].unbought += 1;
      counts[item.store].estimatedCost += item.estimatedPrice || 0;
    });
    return counts;
  }, [items]);

  const handleCreateItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;

    onAddItem({
      name: newItemName.trim(),
      category: newItemCategory,
      store: newItemStore,
      quantity: Number(newItemQuantity) || 1,
      unit: newItemUnit.trim() || 'units',
      estimatedPrice: Number(newItemPrice) || 0,
      priority: newItemPriority,
      notes: newItemNotes.trim() || undefined,
    });

    setNewItemName('');
    setNewItemNotes('');
    setShowAddForm(false);
  };

  const handleSaveAssignee = () => {
    if (assigneeModalItem) {
      onUpdateItem(assigneeModalItem.id, {
        assignedTo: assigneeName.trim() || undefined,
      });
      setAssigneeModalItem(null);
      setAssigneeName('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: Store Shopping Route & Quick Overview */}
      <div className="bg-linear-to-r from-slate-900 via-slate-800 to-indigo-950 rounded-2xl p-4 sm:p-5 text-white shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-amber-400" />
              <h2 className="text-sm font-bold uppercase tracking-wider text-amber-300">
                Recommended Shopping Route
              </h2>
            </div>
            <p className="text-xs text-slate-300">
              Optimal store run for efficiency: bulk items at warehouse clubs first, specialty goods next, perishables last.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {Object.entries(storeCounts)
              .filter(([_, stats]) => stats.total > 0)
              .map(([store, stats]) => (
                <button
                  key={store}
                  onClick={() => setSelectedStore(selectedStore === store ? 'all' : store)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                    selectedStore === store
                      ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-xs'
                      : 'bg-white/10 hover:bg-white/15 text-white border-white/10'
                  }`}
                >
                  <Store className="w-3.5 h-3.5" />
                  <span>{store}</span>
                  <span className="px-1.5 py-0.2 rounded-full bg-black/20 text-[10px]">
                    {stats.unbought > 0 ? `${stats.unbought} left` : 'Done'}
                  </span>
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Control Bar: Search, Filters, View Modes, Add Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search groceries, ingredients, or assignees..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status filter */}
          <div className="flex items-center rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-xs">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                statusFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('unbought')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                statusFilter === 'unbought' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              To Buy
            </button>
            <button
              onClick={() => setStatusFilter('bought')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                statusFilter === 'bought' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              Bought
            </button>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center rounded-lg bg-slate-100 p-0.5 border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('category')}
              className={`px-2 py-1 rounded-md font-medium transition-all ${
                viewMode === 'category' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
              title="Group by category"
            >
              Categories
            </button>
            <button
              onClick={() => setViewMode('store')}
              className={`px-2 py-1 rounded-md font-medium transition-all ${
                viewMode === 'store' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
              title="Group by store"
            >
              Stores
            </button>
            <button
              onClick={() => setViewMode('compact')}
              className={`px-2 py-1 rounded-md font-medium transition-all ${
                viewMode === 'compact' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
              title="Aisle Runner Mode"
            >
              Checklist
            </button>
          </div>

          {/* Add Item Button */}
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Item</span>
          </button>
        </div>
      </div>

      {/* Quick Add Form Drawer */}
      {showAddForm && (
        <form
          onSubmit={handleCreateItem}
          className="bg-indigo-50/50 border border-indigo-200 rounded-2xl p-4 sm:p-5 shadow-xs space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-indigo-950 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Add Custom Grocery or Supply Item
            </h3>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="text-xs text-slate-400 hover:text-slate-600"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-slate-700 mb-1">Item Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Fresh Mint Leaves for mojitos"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={newItemCategory}
                onChange={(e) => setNewItemCategory(e.target.value as CategoryId)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
              >
                {PARTY_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.emoji} {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Store</label>
              <select
                value={newItemStore}
                onChange={(e) => setNewItemStore(e.target.value as StoreType)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
              >
                {STORES_LIST.map((store) => (
                  <option key={store} value={store}>
                    {store}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Quantity & Unit</label>
              <div className="flex gap-1.5">
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={newItemQuantity}
                  onChange={(e) => setNewItemQuantity(Number(e.target.value))}
                  className="w-20 px-2 py-2 bg-white border border-slate-300 rounded-lg text-xs text-center"
                />
                <input
                  type="text"
                  placeholder="unit (lbs, bags)"
                  value={newItemUnit}
                  onChange={(e) => setNewItemUnit(e.target.value)}
                  className="flex-1 px-2.5 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Est. Price ($)</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={newItemPrice}
                onChange={(e) => setNewItemPrice(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Priority</label>
              <select
                value={newItemPriority}
                onChange={(e) => setNewItemPriority(e.target.value as PriorityLevel)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
              >
                <option value="essential">Essential (Must Have)</option>
                <option value="recommended">Recommended</option>
                <option value="optional">Optional / Nice-to-Have</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Prep Note / Brand</label>
              <input
                type="text"
                placeholder="e.g. Unsalted, store cold"
                value={newItemNotes}
                onChange={(e) => setNewItemNotes(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs shadow-xs"
            >
              Save Item to List
            </button>
          </div>
        </form>
      )}

      {/* Bulk Action Controls */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong>{filteredItems.length}</strong> of {items.length} items
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onBulkMark(true)}
            className="hover:text-indigo-600 transition-colors flex items-center gap-1 font-medium"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark All Bought</span>
          </button>
          <span>•</span>
          <button
            onClick={() => onBulkMark(false)}
            className="hover:text-indigo-600 transition-colors flex items-center gap-1 font-medium"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Checks</span>
          </button>
        </div>
      </div>

      {/* ITEMS LIST RENDERING */}
      {filteredItems.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs">
          <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-heading font-bold text-slate-800 text-base">No items match your filter</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try clearing your search query or store filter, or click "Add Item" to add ingredients manually.
          </p>
        </div>
      ) : viewMode === 'compact' ? (
        /* COMPACT AISLE RUNNER VIEW */
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs divide-y divide-slate-100">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onToggleItem(item.id)}
              className={`p-3.5 flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                item.isBought ? 'bg-slate-50/80 text-slate-400' : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
                    item.isBought
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-slate-300 bg-white hover:border-indigo-500'
                  }`}
                >
                  {item.isBought && <Check className="w-4 h-4 stroke-[3]" />}
                </div>

                <div className="min-w-0">
                  <p className={`text-sm font-semibold truncate ${item.isBought ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                    {item.name}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span>
                      {item.quantity} {item.unit}
                    </span>
                    <span>•</span>
                    <span className="font-medium text-slate-700">{item.store}</span>
                    {item.assignedTo && (
                      <>
                        <span>•</span>
                        <span className="text-indigo-600 font-semibold">Brought by {item.assignedTo}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-slate-800">
                  ${(item.estimatedPrice || 0).toFixed(2)}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : viewMode === 'store' ? (
        /* GROUPED BY STORE VIEW */
        <div className="space-y-6">
          {STORES_LIST.map((store) => {
            const storeItems = filteredItems.filter((i) => i.store === store);
            if (storeItems.length === 0) return null;

            const storeSubtotal = storeItems.reduce((acc, it) => acc + (it.estimatedPrice || 0), 0);
            const storeBought = storeItems.filter((i) => i.isBought).length;

            return (
              <div key={store} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-200/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-indigo-600" />
                    <h3 className="font-heading font-bold text-slate-900 text-sm">{store}</h3>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
                      {storeItems.length} items
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">
                    Est. Subtotal: <strong className="text-slate-900">${storeSubtotal.toFixed(2)}</strong> ({storeBought}/{storeItems.length} in cart)
                  </div>
                </div>

                <div className="divide-y divide-slate-100">
                  {storeItems.map((item) => (
                    <ItemRow
                      key={item.id}
                      item={item}
                      onToggle={() => onToggleItem(item.id)}
                      onDelete={() => onDeleteItem(item.id)}
                      onUpdate={(updates) => onUpdateItem(item.id, updates)}
                      onOpenAssignee={() => {
                        setAssigneeModalItem(item);
                        setAssigneeName(item.assignedTo || '');
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* GROUPED BY CATEGORY VIEW (Default) */
        <div className="space-y-6">
          {PARTY_CATEGORIES.map((cat) => {
            const catItems = filteredItems.filter((i) => i.category === cat.id);
            if (catItems.length === 0) return null;

            const catSubtotal = catItems.reduce((acc, it) => acc + (it.estimatedPrice || 0), 0);
            const catBought = catItems.filter((i) => i.isBought).length;

            return (
              <div key={cat.id} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-200/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{cat.emoji}</span>
                    <h3 className="font-heading font-bold text-slate-900 text-sm">{cat.name}</h3>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-semibold">
                      {catItems.length}
                    </span>
                  </div>
                  <div className="text-xs text-slate-600">
                    Subtotal: <strong className="text-slate-900">${catSubtotal.toFixed(2)}</strong> ({catBought}/{catItems.length} bought)
                  </div>
                </div>

                <div className="divide-y divide-slate-100">
                  {catItems.map((item) => (
                    <ItemRow
                      key={item.id}
                      item={item}
                      onToggle={() => onToggleItem(item.id)}
                      onDelete={() => onDeleteItem(item.id)}
                      onUpdate={(updates) => onUpdateItem(item.id, updates)}
                      onOpenAssignee={() => {
                        setAssigneeModalItem(item);
                        setAssigneeName(item.assignedTo || '');
                      }}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Guest Assignee Modal */}
      {assigneeModalItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <h3 className="font-heading font-bold text-base text-slate-900">
              Assign Item to Guest / Co-host
            </h3>
            <p className="text-xs text-slate-500">
              Who is picking up or bringing <strong className="text-slate-800">{assigneeModalItem.name}</strong>?
            </p>
            <input
              type="text"
              autoFocus
              placeholder="e.g. Maria, Dave, Uncle Dan"
              value={assigneeName}
              onChange={(e) => setAssigneeName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => {
                  setAssigneeModalItem(null);
                  setAssigneeName('');
                }}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveAssignee}
                className="px-4 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg"
              >
                Save Assignment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Item Row Component
interface ItemRowProps {
  item: ShoppingItem;
  onToggle: () => void;
  onDelete: () => void;
  onUpdate: (updates: Partial<ShoppingItem>) => void;
  onOpenAssignee: () => void;
}

const ItemRow: React.FC<ItemRowProps> = ({
  item,
  onToggle,
  onDelete,
  onUpdate,
  onOpenAssignee,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editPrice, setEditPrice] = useState(item.estimatedPrice);
  const [editQuantity, setEditQuantity] = useState(item.quantity);

  const storeStyle = STORE_COLORS[item.store] || STORE_COLORS['Local Supermarket'];

  return (
    <div
      className={`px-4 py-3 flex items-center justify-between gap-3 group transition-colors ${
        item.isBought ? 'bg-slate-50/70' : 'hover:bg-slate-50/50'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        {/* Checkbox */}
        <button
          onClick={onToggle}
          className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 transition-all ${
            item.isBought
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-slate-300 bg-white hover:border-indigo-500'
          }`}
          title={item.isBought ? 'Mark unbought' : 'Mark bought'}
        >
          {item.isBought && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Item Info */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-sm font-semibold truncate ${
                item.isBought ? 'line-through text-slate-400' : 'text-slate-800'
              }`}
            >
              {item.name}
            </span>

            {/* Priority Tag */}
            {item.priority === 'essential' && (
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-red-100 text-red-700 border border-red-200/60">
                Must Have
              </span>
            )}
            {item.priority === 'optional' && (
              <span className="text-[10px] uppercase font-medium tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                Optional
              </span>
            )}

            {/* Store Tag */}
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${storeStyle.bg} ${storeStyle.text} ${storeStyle.border}`}>
              {item.store}
            </span>

            {/* Assignee Tag */}
            {item.assignedTo ? (
              <button
                onClick={onOpenAssignee}
                className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-violet-100 text-violet-700 border border-violet-200 flex items-center gap-1 hover:bg-violet-200"
              >
                <UserCheck className="w-3 h-3" />
                <span>{item.assignedTo}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAssignee}
                className="text-[11px] text-slate-400 hover:text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                title="Assign to guest"
              >
                <UserCheck className="w-3 h-3" />
                <span>Assign</span>
              </button>
            )}
          </div>

          {/* Notes & Quantities */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 flex-wrap">
            <span className="font-medium text-slate-700">
              {item.quantity} {item.unit}
            </span>
            {item.notes && (
              <>
                <span>•</span>
                <span className="text-slate-500 italic line-clamp-1">{item.notes}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Right: Price & Actions */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right">
          <span className={`text-xs font-bold ${item.isBought ? 'text-slate-400' : 'text-slate-900'}`}>
            ${(item.estimatedPrice || 0).toFixed(2)}
          </span>
        </div>

        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-1 rounded-md transition-all"
          title="Remove item"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

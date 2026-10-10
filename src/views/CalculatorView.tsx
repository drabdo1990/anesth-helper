import React, { useState, useMemo } from 'react';
import { DRUG_FORMULARY } from '../constants/drugFormulary';
import { DrugCard } from '../components/DrugCard';
import { DrugCategory } from '../types/anesthesia';
import { Search, Filter, Sparkles } from 'lucide-react';

export const CalculatorView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = ['All', 'Induction', 'NMBA', 'Reversal', 'Vasopressor', 'Emergency'];

  const filteredDrugs = useMemo(() => {
    return DRUG_FORMULARY.filter((drug) => {
      const matchesCategory =
        selectedCategory === 'All' || drug.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        query === '' ||
        drug.name.toLowerCase().includes(query) ||
        (drug.genericName && drug.genericName.toLowerCase().includes(query)) ||
        (drug.subcategory && drug.subcategory.toLowerCase().includes(query));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-4 pb-24">
      {/* Search and Category Filter Bar */}
      <div className="space-y-2">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search drug (e.g., Propofol, Rocuronium, Sugammadex)..."
            className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-2 py-1"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Filter Chips (Glove-Friendly Touch Targets) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all select-none touch-target flex items-center justify-center ${
                  isSelected
                    ? 'bg-cyan-500 text-slate-950 shadow-glow-cyan font-bold'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {cat === 'All' ? 'All Drugs' : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Drugs Grid */}
      {filteredDrugs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredDrugs.map((drug) => (
            <DrugCard key={drug.id} drug={drug} />
          ))}
        </div>
      ) : (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center flex flex-col items-center justify-center gap-2">
          <Filter className="w-8 h-8 text-slate-600" />
          <p className="text-slate-300 font-semibold text-sm">No matching drugs found</p>
          <p className="text-slate-500 text-xs">Try clearing the search filter or switching categories.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="mt-2 px-3 py-1.5 bg-slate-800 text-cyan-400 rounded-lg text-xs font-semibold hover:bg-slate-700"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

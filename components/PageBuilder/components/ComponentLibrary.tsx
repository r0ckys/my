import React, { useState } from 'react';
import { sectionCategories, SectionCategory, SectionVariant, variantToSectionType } from './SectionVariants';

interface ComponentLibraryProps {
  onAddSection: (variantId: string, sectionType: string, settings: Record<string, any>, variantName: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const CategoryIcons: Record<string, JSX.Element> = {
  'layout': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2"/><line x1="3" y1="9" x2="21" y2="9" strokeWidth="2"/></svg>,
  'star': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" strokeWidth="2"/></svg>,
  'type': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="4,7 4,4 20,4 20,7" strokeWidth="2"/><line x1="9" y1="20" x2="15" y2="20" strokeWidth="2"/><line x1="12" y1="4" x2="12" y2="20" strokeWidth="2"/></svg>,
  'image': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2"/><circle cx="8.5" cy="8.5" r="1.5" strokeWidth="2"/><polyline points="21,15 16,10 5,21" strokeWidth="2"/></svg>,
  'grid': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" strokeWidth="2"/><rect x="14" y="3" width="7" height="7" strokeWidth="2"/><rect x="14" y="14" width="7" height="7" strokeWidth="2"/><rect x="3" y="14" width="7" height="7" strokeWidth="2"/></svg>,
  'zap': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon points="13,2 3,14 12,14 11,22 21,10 12,10" strokeWidth="2"/></svg>,
  'shield': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeWidth="2"/></svg>,
  'message': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeWidth="2"/></svg>,
  'shopping-bag': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeWidth="2"/><line x1="3" y1="6" x2="21" y2="6" strokeWidth="2"/><path d="M16 10a4 4 0 01-8 0" strokeWidth="2"/></svg>,
  'layers': <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon points="12,2 2,7 12,12 22,7" strokeWidth="2"/><polyline points="2,17 12,22 22,17" strokeWidth="2"/><polyline points="2,12 12,17 22,12" strokeWidth="2"/></svg>,
};

const SearchIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" strokeWidth="2"/><line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2"/></svg>;
const ChevronRight = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="9,18 15,12 9,6" strokeWidth="2"/></svg>;
const PlusIcon = () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" strokeWidth="2"/><line x1="5" y1="12" x2="19" y2="12" strokeWidth="2"/></svg>;

const VariantPreviewCard: React.FC<{ variant: SectionVariant; onAdd: () => void }> = ({ variant, onAdd }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div className="relative group cursor-pointer" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="border border-gray-200 rounded-lg overflow-hidden hover:border-blue-400 hover:shadow-md transition-all">
        <div className="bg-gray-50 h-24 flex items-center justify-center relative overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-xs text-gray-400 text-center px-2">{variant.description}</span>
          </div>
          {isHovered && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity">
              <button onClick={(e) => { e.stopPropagation(); onAdd(); }} className="p-2 bg-white rounded-full shadow-lg hover:bg-blue-50 transition-colors" title="Add section">
                <PlusIcon />
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center justify-between mt-2 px-1">
        <span className="text-xs font-medium text-gray-700 truncate">{variant.name}</span>
        <button onClick={(e) => { e.stopPropagation(); onAdd(); }} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded transition-all" title="Add section">
          <PlusIcon />
        </button>
      </div>
    </div>
  );
};

const CategoryAccordion: React.FC<{
  category: SectionCategory;
  isExpanded: boolean;
  onToggle: () => void;
  onAddVariant: (variant: SectionVariant) => void;
  searchQuery: string;
}> = ({ category, isExpanded, onToggle, onAddVariant, searchQuery }) => {
  const filteredVariants = searchQuery
    ? category.variants.filter(v => v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.description.toLowerCase().includes(searchQuery.toLowerCase()))
    : category.variants;
  if (searchQuery && filteredVariants.length === 0) return null;
  return (
    <div className="border-b border-gray-100 last:border-b-0">
      <button onClick={onToggle} className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-3">
          <span className="text-gray-500">{CategoryIcons[category.icon] || CategoryIcons['layers']}</span>
          <span className="font-medium text-gray-800">{category.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{filteredVariants.length} variant{filteredVariants.length !== 1 ? 's' : ''}</span>
          <span className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}><ChevronRight /></span>
        </div>
      </button>
      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="grid grid-cols-1 gap-3">
            {filteredVariants.map((variant) => <VariantPreviewCard key={variant.id} variant={variant} onAdd={() => onAddVariant(variant)} />)}
          </div>
        </div>
      )}
    </div>
  );
};

export const ComponentLibrary: React.FC<ComponentLibraryProps> = ({ onAddSection, searchQuery, onSearchChange }) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('hero');

  const handleAddVariant = (variant: SectionVariant) => {
    const sectionType = variantToSectionType[variant.id] || 'rich-text';
    onAddSection(variant.id, sectionType, variant.settings, variant.name);
  };

  const toggleCategory = (categoryId: string) => setExpandedCategory(expandedCategory === categoryId ? null : categoryId);

  const filteredCategories = searchQuery
    ? sectionCategories.filter(cat => cat.variants.some(v => v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.description.toLowerCase().includes(searchQuery.toLowerCase())) || cat.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : sectionCategories;

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-3 border-b border-gray-100">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><SearchIcon /></span>
          <input type="text" placeholder="Search components..." value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredCategories.map((category) => (
          <CategoryAccordion key={category.id} category={category} isExpanded={expandedCategory === category.id || !!searchQuery} onToggle={() => toggleCategory(category.id)} onAddVariant={handleAddVariant} searchQuery={searchQuery} />
        ))}
        {filteredCategories.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <p className="text-sm">No components found</p>
            <p className="text-xs mt-1">Try a different search term</p>
          </div>
        )}
        <div className="p-4 border-t border-gray-100">
          <p className="text-xs text-gray-400 text-center">{sectionCategories.reduce((acc, cat) => acc + cat.variants.length, 0)} total components</p>
        </div>
      </div>
    </div>
  );
};

export default ComponentLibrary;

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors,
  type DragStartEvent, type DragEndEvent 
} from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Monitor, Smartphone, Tablet, Save, Loader2, Check, X, Eye, ChevronRight, ChevronDown,
  RotateCcw, ExternalLink, Layout, AlertCircle, CheckCircle2, GripVertical, Trash2, 
  EyeOff, Plus, Settings, Type, Image, Video, Layers, Edit3, Home, ArrowLeft,
  Undo, Redo, PanelRight, Keyboard, MoreHorizontal, Circle, Search, User, ShoppingBag,
  Megaphone, LayoutGrid, Star, ImageIcon, ListIcon, MessageSquare, Mail, FileText
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

// Types
type SectionType = 'announcementBar' | 'header' | 'hero' | 'featuredCollection' | 'productGrid' | 'testimonials' | 'newsletter' | 'footer' | 'utilities' | 'textBlock' | 'imageBlock' | 'bannerBlock' | 'spacerBlock' | 'videoBlock';

interface PlacedSection {
  id: string;
  type: SectionType;
  name: string;
  visible: boolean;
  order: number;
  settings: Record<string, any>;
}

interface PageBuilderProps {
  tenantId: string;
  onSaveSuccess?: (layout: any) => void;
  onError?: (error: Error) => void;
}

// Section definitions
const SECTION_DEFINITIONS: Record<string, { icon: React.ReactNode; label: string; defaultName: string; category: 'header' | 'template' | 'footer' }> = {
  announcementBar: { icon: <Megaphone className="w-4 h-4" />, label: 'Announcement bar', defaultName: 'Announcement bar', category: 'header' },
  header: { icon: <Layout className="w-4 h-4" />, label: 'Header', defaultName: 'Header', category: 'header' },
  hero: { icon: <ImageIcon className="w-4 h-4" />, label: 'Hero', defaultName: 'Hero', category: 'template' },
  featuredCollection: { icon: <LayoutGrid className="w-4 h-4" />, label: 'Featured collection', defaultName: 'Featured collection', category: 'template' },
  productGrid: { icon: <LayoutGrid className="w-4 h-4" />, label: 'Product grid', defaultName: 'Product grid', category: 'template' },
  testimonials: { icon: <Star className="w-4 h-4" />, label: 'Testimonials', defaultName: 'Testimonials', category: 'template' },
  newsletter: { icon: <Mail className="w-4 h-4" />, label: 'Newsletter', defaultName: 'Newsletter', category: 'template' },
  footer: { icon: <Layout className="w-4 h-4" />, label: 'Footer', defaultName: 'Footer', category: 'footer' },
  utilities: { icon: <Settings className="w-4 h-4" />, label: 'Utilities', defaultName: 'Utilities', category: 'footer' },
  textBlock: { icon: <Type className="w-4 h-4" />, label: 'Text', defaultName: 'Text block', category: 'template' },
  imageBlock: { icon: <Image className="w-4 h-4" />, label: 'Image', defaultName: 'Image block', category: 'template' },
  bannerBlock: { icon: <ImageIcon className="w-4 h-4" />, label: 'Banner', defaultName: 'Banner', category: 'template' },
  videoBlock: { icon: <Video className="w-4 h-4" />, label: 'Video', defaultName: 'Video block', category: 'template' },
};

// Sortable Section Item
const SortableSectionItem: React.FC<{
  section: PlacedSection;
  isSelected: boolean;
  onSelect: () => void;
  onToggleExpand: () => void;
  isExpanded: boolean;
}> = ({ section, isSelected, onSelect, onToggleExpand, isExpanded }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const def = SECTION_DEFINITIONS[section.type];
  
  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group ${isDragging ? 'opacity-50' : ''}`}
    >
      <button
        onClick={onSelect}
        className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-100 rounded-lg transition-colors ${isSelected ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
      >
        <span {...attributes} {...listeners} className="cursor-grab hover:bg-gray-200 p-1 rounded">
          {section.type === 'header' || section.type === 'footer' ? (
            <button onClick={(e) => { e.stopPropagation(); onToggleExpand(); }} className="p-0.5">
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          ) : (
            <ChevronRight className="w-3 h-3 opacity-0" />
          )}
        </span>
        <span className="text-gray-400">{def?.icon}</span>
        <span className="flex-1 truncate">{section.name}</span>
        {!section.visible && <EyeOff className="w-3 h-3 text-gray-400" />}
      </button>
    </div>
  );
};

// Add Section Button
const AddSectionButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors w-full"
  >
    <Plus className="w-4 h-4" />
    <span>Add section</span>
  </button>
);

// Section Category
const SectionCategory: React.FC<{
  title: string;
  sections: PlacedSection[];
  selectedId: string | null;
  onSelectSection: (id: string) => void;
  onAddSection: () => void;
  expandedSections: string[];
  onToggleExpand: (id: string) => void;
}> = ({ title, sections, selectedId, onSelectSection, onAddSection, expandedSections, onToggleExpand }) => (
  <div className="border-b border-gray-200 py-3">
    <h3 className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{title}</h3>
    <div className="px-2 space-y-0.5">
      <SortableContext items={sections.map(s => s.id)} strategy={verticalListSortingStrategy}>
        {sections.map((section) => (
          <SortableSectionItem
            key={section.id}
            section={section}
            isSelected={selectedId === section.id}
            onSelect={() => onSelectSection(section.id)}
            onToggleExpand={() => onToggleExpand(section.id)}
            isExpanded={expandedSections.includes(section.id)}
          />
        ))}
      </SortableContext>
      <AddSectionButton onClick={onAddSection} />
    </div>
  </div>
);

// Preview Product Card
const PreviewProductCard: React.FC<{ selected?: boolean }> = ({ selected }) => (
  <div className={`bg-white rounded-lg overflow-hidden ${selected ? 'ring-2 ring-blue-500' : 'border border-gray-200'}`}>
    <div className="aspect-square bg-gray-100 relative">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-3/4 h-3/4 bg-gradient-to-br from-orange-300 to-orange-400 rounded-lg flex items-center justify-center">
          <div className="w-1/2 h-1/2 bg-gradient-to-t from-teal-400 to-teal-300 rounded-md" />
        </div>
      </div>
      {selected && (
        <div className="absolute top-2 left-2">
          <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded flex items-center gap-1">
            <Image className="w-3 h-3" /> Media
          </span>
        </div>
      )}
      {selected && (
        <>
          <button className="absolute top-1/2 -translate-y-1/2 -right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg">
            <Plus className="w-4 h-4" />
          </button>
          <button className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg">
            <Plus className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
    <div className="p-3">
      <p className="text-sm font-medium text-gray-900">Product title</p>
      <p className="text-sm text-gray-600">Tk 19.99</p>
    </div>
  </div>
);

// Store Preview
const StorePreview: React.FC<{
  sections: PlacedSection[];
  selectedId: string | null;
  devicePreview: 'desktop' | 'tablet' | 'mobile';
  tenantId: string;
}> = ({ sections, selectedId, devicePreview, tenantId }) => {
  const headerSections = sections.filter(s => SECTION_DEFINITIONS[s.type]?.category === 'header' && s.visible);
  const templateSections = sections.filter(s => SECTION_DEFINITIONS[s.type]?.category === 'template' && s.visible);
  
  return (
    <div className="bg-gray-100 flex-1 overflow-auto">
      <div className={`mx-auto transition-all duration-300 ${
        devicePreview === 'desktop' ? 'max-w-full' : 
        devicePreview === 'tablet' ? 'max-w-2xl' : 'max-w-sm'
      }`}>
        {/* Announcement Bar */}
        {headerSections.some(s => s.type === 'announcementBar') && (
          <div className="bg-gray-800 text-white text-center py-2 text-sm">
            Welcome to our store
          </div>
        )}
        
        {/* Header */}
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <span className="text-xl font-bold">My Store</span>
              <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
                <a href="#" className="hover:text-gray-900">Home</a>
                <a href="#" className="hover:text-gray-900">Catalog</a>
                <a href="#" className="hover:text-gray-900">Contact</a>
              </nav>
            </div>
            <div className="flex items-center gap-4 text-gray-600">
              <Search className="w-5 h-5" />
              <User className="w-5 h-5" />
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
        </div>
        
        {/* Hero Section */}
        {templateSections.some(s => s.type === 'hero') && (
          <div className="relative h-96 bg-gradient-to-r from-teal-600 to-teal-400 overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white z-10">
                <h1 className="text-4xl font-bold mb-4">Browse our latest products</h1>
                <button className="px-6 py-3 border-2 border-white rounded-md hover:bg-white hover:text-teal-600 transition-colors">
                  Shop all
                </button>
              </div>
            </div>
            {/* Decorative mountains */}
            <svg className="absolute bottom-0 left-0 right-0" viewBox="0 0 1200 200" preserveAspectRatio="none">
              <path d="M0,200 L0,100 Q300,50 600,100 T1200,100 L1200,200 Z" fill="rgba(0,0,0,0.2)" />
            </svg>
          </div>
        )}
        
        {/* Featured Collection / Product Grid */}
        {templateSections.some(s => s.type === 'featuredCollection' || s.type === 'productGrid') && (
          <div className="bg-gray-50 py-12 px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl font-bold mb-8">Products</h2>
              <div className={`grid gap-4 ${
                devicePreview === 'mobile' ? 'grid-cols-2' : 'grid-cols-4'
              }`}>
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <PreviewProductCard key={i} selected={i === 1} />
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Footer */}
        <div className="bg-gray-900 text-white py-12 px-4">
          <div className="max-w-6xl mx-auto grid grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-4">Quick links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Search</li>
                <li>About us</li>
                <li>Contact</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Info</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Shipping</li>
                <li>Returns</li>
                <li>FAQ</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Add Section Modal
const AddSectionModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAdd: (type: SectionType) => void;
  category: 'header' | 'template' | 'footer';
}> = ({ isOpen, onClose, onAdd, category }) => {
  if (!isOpen) return null;
  
  const availableSections = Object.entries(SECTION_DEFINITIONS)
    .filter(([_, def]) => def.category === category)
    .map(([type, def]) => ({ type: type as SectionType, ...def }));
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Add section</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded"><X className="w-5 h-5" /></button>
        </div>
        <div className="space-y-2">
          {availableSections.map((section) => (
            <button
              key={section.type}
              onClick={() => { onAdd(section.type); onClose(); }}
              className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 transition-colors text-left"
            >
              <span className="text-gray-500">{section.icon}</span>
              <span className="font-medium">{section.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// Right Panel
const RightPanel: React.FC<{ selectedSection: PlacedSection | null }> = ({ selectedSection }) => (
  <div className="w-72 bg-white border-l border-gray-200 flex flex-col">
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center gap-3 mb-2">
        <PanelRight className="w-6 h-6 text-gray-400" />
      </div>
      <h3 className="font-semibold text-gray-900">Customize your templates</h3>
      <p className="text-sm text-gray-500 mt-1">Select a section or block in the sidebar to start.</p>
    </div>
    
    <div className="p-4 border-t border-gray-100">
      <h4 className="font-medium text-gray-900 mb-3">Keyboard shortcuts</h4>
      <div className="space-y-2 text-sm">
        {[
          { label: 'Undo', keys: ['CTRL', 'Z'] },
          { label: 'Redo', keys: ['CTRL', 'Y'] },
          { label: 'Save', keys: ['CTRL', 'S'] },
          { label: 'Preview inspector', keys: ['CTRL', 'SHIFT', 'I'] },
          { label: 'See all shortcuts', keys: ['CTRL', '/'] },
        ].map((shortcut) => (
          <div key={shortcut.label} className="flex items-center justify-between">
            <span className="text-gray-600">{shortcut.label}</span>
            <div className="flex items-center gap-1">
              {shortcut.keys.map((key, i) => (
                <React.Fragment key={key}>
                  <kbd className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono">{key}</kbd>
                  {i < shortcut.keys.length - 1 && <span className="text-gray-400 text-xs">+</span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Main PageBuilder Component
export const PageBuilder: React.FC<PageBuilderProps> = ({ tenantId, onSaveSuccess, onError }) => {
  const [sections, setSections] = useState<PlacedSection[]>([
    { id: uuidv4(), type: 'announcementBar', name: 'Announcement bar', visible: true, order: 0, settings: {} },
    { id: uuidv4(), type: 'header', name: 'Header', visible: true, order: 1, settings: {} },
    { id: uuidv4(), type: 'hero', name: 'Hero', visible: true, order: 2, settings: {} },
    { id: uuidv4(), type: 'featuredCollection', name: 'Featured collection', visible: true, order: 3, settings: {} },
    { id: uuidv4(), type: 'footer', name: 'Footer', visible: true, order: 4, settings: {} },
    { id: uuidv4(), type: 'utilities', name: 'Utilities', visible: true, order: 5, settings: {} },
  ]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState<'header' | 'template' | 'footer' | null>(null);
  
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  
  const headerSections = useMemo(() => sections.filter(s => SECTION_DEFINITIONS[s.type]?.category === 'header'), [sections]);
  const templateSections = useMemo(() => sections.filter(s => SECTION_DEFINITIONS[s.type]?.category === 'template'), [sections]);
  const footerSections = useMemo(() => sections.filter(s => SECTION_DEFINITIONS[s.type]?.category === 'footer'), [sections]);
  const selectedSection = useMemo(() => sections.find(s => s.id === selectedSectionId) || null, [sections, selectedSectionId]);
  
  // Fetch layout
  useEffect(() => {
    const fetchLayout = async () => {
      try {
        const response = await fetch(`/api/v1/tenant-data/${tenantId}/store_layout`);
        if (response.ok) {
          const result = await response.json();
          if (result.data?.sections?.length) {
            setSections(result.data.sections);
          }
        }
      } catch (err) {
        console.error('Failed to fetch layout:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLayout();
  }, [tenantId]);
  
  // Save layout
  const handleSave = useCallback(async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/v1/tenant-data/${tenantId}/store_layout`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: { sections, lastUpdated: new Date().toISOString() } }),
      });
      if (!response.ok) throw new Error('Failed to save');
      setHasChanges(false);
      onSaveSuccess?.({ sections });
    } catch (err) {
      onError?.(err instanceof Error ? err : new Error('Save failed'));
    } finally {
      setIsSaving(false);
    }
  }, [sections, tenantId, onSaveSuccess, onError]);
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    
    setSections(prev => {
      const oldIndex = prev.findIndex(s => s.id === active.id);
      const newIndex = prev.findIndex(s => s.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return prev;
      return arrayMove(prev, oldIndex, newIndex).map((s, i) => ({ ...s, order: i }));
    });
    setHasChanges(true);
  };
  
  const handleAddSection = (type: SectionType) => {
    const def = SECTION_DEFINITIONS[type];
    const newSection: PlacedSection = {
      id: uuidv4(),
      type,
      name: def?.defaultName || type,
      visible: true,
      order: sections.length,
      settings: {},
    };
    setSections(prev => [...prev, newSection]);
    setHasChanges(true);
  };
  
  const handleToggleExpand = (id: string) => {
    setExpandedSections(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };
  
  const handlePreview = () => {
    window.open(`https://${tenantId}.allinbangla.com`, '_blank');
  };
  
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="h-screen flex flex-col bg-white">
      {/* Top Bar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-900">Horizon</span>
            <span className="flex items-center gap-1.5 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
              <Circle className="w-2 h-2 fill-current" /> Live
            </span>
          </div>
          <button className="p-1 hover:bg-gray-100 rounded">
            <MoreHorizontal className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Home className="w-4 h-4" />
          <span>Home page</span>
        </div>
        
        <div className="flex items-center gap-2">
          {/* Device Toggles */}
          <div className="flex items-center border border-gray-200 rounded-lg p-1 mr-4">
            {[
              { id: 'desktop', icon: Monitor },
              { id: 'tablet', icon: Tablet },
              { id: 'mobile', icon: Smartphone },
            ].map(({ id, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setDevicePreview(id as any)}
                className={`p-2 rounded-md transition-colors ${devicePreview === id ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Icon className="w-4 h-4" />
              </button>
            ))}
          </div>
          
          {/* Actions */}
          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
            <Undo className="w-4 h-4" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
            <Redo className="w-4 h-4" />
          </button>
          <button
            onClick={handlePreview}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500"
          >
            <Eye className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleSave}
            disabled={!hasChanges || isSaving}
            className={`ml-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              hasChanges ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-200 text-gray-500'
            }`}
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
          </button>
        </div>
      </header>
      
      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          {/* Left Sidebar */}
          <aside className="w-72 bg-white border-r border-gray-200 flex flex-col overflow-y-auto">
            {/* Page Selector */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-500" />
                <span className="font-medium">Home page</span>
              </div>
            </div>
            
            {/* Left Nav Icons */}
            <div className="absolute left-0 top-14 bottom-0 w-12 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-4 gap-2">
              <button className="p-2 bg-white rounded-lg shadow-sm border border-gray-200">
                <FileText className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-white rounded-lg">
                <Settings className="w-5 h-5 text-gray-400" />
              </button>
              <button className="p-2 hover:bg-white rounded-lg">
                <Layers className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            {/* Sections */}
            <div className="ml-12 flex-1 overflow-y-auto">
              <SectionCategory
                title="Header"
                sections={headerSections}
                selectedId={selectedSectionId}
                onSelectSection={setSelectedSectionId}
                onAddSection={() => setAddModalOpen('header')}
                expandedSections={expandedSections}
                onToggleExpand={handleToggleExpand}
              />
              <SectionCategory
                title="Template"
                sections={templateSections}
                selectedId={selectedSectionId}
                onSelectSection={setSelectedSectionId}
                onAddSection={() => setAddModalOpen('template')}
                expandedSections={expandedSections}
                onToggleExpand={handleToggleExpand}
              />
              <SectionCategory
                title="Footer"
                sections={footerSections}
                selectedId={selectedSectionId}
                onSelectSection={setSelectedSectionId}
                onAddSection={() => setAddModalOpen('footer')}
                expandedSections={expandedSections}
                onToggleExpand={handleToggleExpand}
              />
            </div>
          </aside>
          
          {/* Preview */}
          <StorePreview
            sections={sections}
            selectedId={selectedSectionId}
            devicePreview={devicePreview}
            tenantId={tenantId}
          />
          
          {/* Right Panel */}
          <RightPanel selectedSection={selectedSection} />
        </DndContext>
      </div>
      
      {/* Add Section Modal */}
      <AddSectionModal
        isOpen={addModalOpen !== null}
        onClose={() => setAddModalOpen(null)}
        onAdd={handleAddSection}
        category={addModalOpen || 'template'}
      />
    </div>
  );
};

export default PageBuilder;

import React, { useState, useEffect, useCallback } from 'react';
import { DndContext, closestCenter, DragEndEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { v4 as uuidv4 } from 'uuid';

type SectionType = 'announcement-bar' | 'header' | 'hero' | 'featured-collection' | 'rich-text' | 'image-with-text' | 'image-banner' | 'slideshow' | 'video' | 'newsletter' | 'collection-list' | 'product-grid' | 'testimonials' | 'contact-form' | 'map' | 'multicolumn' | 'collapsible-content' | 'custom-liquid' | 'footer' | 'featured-product' | 'blog-posts' | 'brand-list';
type BlockType = 'heading' | 'text' | 'button' | 'image' | 'link' | 'product' | 'collection' | 'video' | 'icon' | 'price' | 'quantity' | 'divider';

interface Block { id: string; type: BlockType; settings: Record<string, any>; }
interface PlacedSection { id: string; type: SectionType; name: string; visible: boolean; settings: Record<string, any>; blocks: Block[]; }
interface PageBuilderProps { tenantId: string; }

const Icons = {
  Monitor: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" strokeWidth="2"/><path d="M8 21h8M12 17v4" strokeWidth="2"/></svg>,
  Smartphone: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="5" y="2" width="14" height="20" rx="2" strokeWidth="2"/><path d="M12 18h.01" strokeWidth="2" strokeLinecap="round"/></svg>,
  Tablet: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2" strokeWidth="2"/><path d="M12 18h.01" strokeWidth="2" strokeLinecap="round"/></svg>,
  Save: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" strokeWidth="2"/><polyline points="17,21 17,13 7,13 7,21" strokeWidth="2"/><polyline points="7,3 7,8 15,8" strokeWidth="2"/></svg>,
  Loader: () => <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>,
  Eye: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" strokeWidth="2"/><circle cx="12" cy="12" r="3" strokeWidth="2"/></svg>,
  EyeOff: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" strokeWidth="2"/><line x1="1" y1="1" x2="23" y2="23" strokeWidth="2"/></svg>,
  ChevronRight: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="9,18 15,12 9,6" strokeWidth="2"/></svg>,
  ChevronDown: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="6,9 12,15 18,9" strokeWidth="2"/></svg>,
  GripVertical: () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><circle cx="9" cy="5" r="1.5"/><circle cx="15" cy="5" r="1.5"/><circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/><circle cx="9" cy="19" r="1.5"/><circle cx="15" cy="19" r="1.5"/></svg>,
  Trash: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="3,6 5,6 21,6" strokeWidth="2"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" strokeWidth="2"/></svg>,
  Plus: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19" strokeWidth="2"/><line x1="5" y1="12" x2="19" y2="12" strokeWidth="2"/></svg>,
  Settings: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" strokeWidth="2"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" strokeWidth="2"/></svg>,
  Home: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" strokeWidth="2"/><polyline points="9,22 9,12 15,12 15,22" strokeWidth="2"/></svg>,
  ArrowLeft: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="19" y1="12" x2="5" y2="12" strokeWidth="2"/><polyline points="12,19 5,12 12,5" strokeWidth="2"/></svg>,
  X: () => <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18" strokeWidth="2"/><line x1="6" y1="6" x2="18" y2="18" strokeWidth="2"/></svg>,
  Search: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8" strokeWidth="2"/><line x1="21" y1="21" x2="16.65" y2="16.65" strokeWidth="2"/></svg>,
  Megaphone: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeWidth="2"/></svg>,
  Layout: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2"/><line x1="3" y1="9" x2="21" y2="9" strokeWidth="2"/></svg>,
  Star: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" strokeWidth="2"/></svg>,
  Grid: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" strokeWidth="2"/><rect x="14" y="3" width="7" height="7" strokeWidth="2"/><rect x="14" y="14" width="7" height="7" strokeWidth="2"/><rect x="3" y="14" width="7" height="7" strokeWidth="2"/></svg>,
  Image: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2"/><circle cx="8.5" cy="8.5" r="1.5" strokeWidth="2"/><polyline points="21,15 16,10 5,21" strokeWidth="2"/></svg>,
  Mail: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeWidth="2"/><polyline points="22,6 12,13 2,6" strokeWidth="2"/></svg>,
  Type: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polyline points="4,7 4,4 20,4 20,7" strokeWidth="2"/><line x1="9" y1="20" x2="15" y2="20" strokeWidth="2"/><line x1="12" y1="4" x2="12" y2="20" strokeWidth="2"/></svg>,
  Video: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon points="23,7 16,12 23,17" strokeWidth="2"/><rect x="1" y="5" width="15" height="14" rx="2" strokeWidth="2"/></svg>,
  Message: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" strokeWidth="2"/></svg>,
  Map: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" strokeWidth="2"/><circle cx="12" cy="10" r="3" strokeWidth="2"/></svg>,
  Layers: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><polygon points="12,2 2,7 12,12 22,7" strokeWidth="2"/><polyline points="2,17 12,22 22,17" strokeWidth="2"/><polyline points="2,12 12,17 22,12" strokeWidth="2"/></svg>,
  Menu: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12" strokeWidth="2"/><line x1="3" y1="6" x2="21" y2="6" strokeWidth="2"/><line x1="3" y1="18" x2="21" y2="18" strokeWidth="2"/></svg>,
  ShoppingBag: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" strokeWidth="2"/><line x1="3" y1="6" x2="21" y2="6" strokeWidth="2"/><path d="M16 10a4 4 0 01-8 0" strokeWidth="2"/></svg>,
  FileText: () => <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeWidth="2"/><polyline points="14,2 14,8 20,8" strokeWidth="2"/><line x1="16" y1="13" x2="8" y2="13" strokeWidth="2"/><line x1="16" y1="17" x2="8" y2="17" strokeWidth="2"/></svg>,
};

const SECTION_DEFINITIONS: Record<SectionType, { icon: JSX.Element; label: string; category: 'header' | 'sections' | 'footer'; description: string; allowedBlocks: BlockType[]; defaultSettings: Record<string, any> }> = {
  'announcement-bar': { icon: <Icons.Megaphone />, label: 'Announcement bar', category: 'header', description: 'Show important announcements', allowedBlocks: ['text', 'link'], defaultSettings: { text: 'Welcome! Free shipping on orders over $50', backgroundColor: '#1a1a2e', textColor: '#ffffff', dismissible: true } },
  'header': { icon: <Icons.Layout />, label: 'Header', category: 'header', description: 'Site header with navigation', allowedBlocks: ['link', 'image'], defaultSettings: { logoText: 'Store', sticky: true, transparent: false, menuStyle: 'horizontal' } },
  'hero': { icon: <Icons.Star />, label: 'Hero banner', category: 'sections', description: 'Full-width hero section', allowedBlocks: ['heading', 'text', 'button', 'image'], defaultSettings: { heading: 'Welcome to Our Store', subheading: 'Discover amazing products', buttonText: 'Shop Now', buttonLink: '/products', imageUrl: '', overlayOpacity: 40, height: 'large', alignment: 'center' } },
  'featured-collection': { icon: <Icons.Grid />, label: 'Featured collection', category: 'sections', description: 'Showcase products from collection', allowedBlocks: ['heading', 'product'], defaultSettings: { heading: 'Featured Products', collectionId: '', productsToShow: 4, columns: 4, showViewAll: true } },
  'rich-text': { icon: <Icons.Type />, label: 'Rich text', category: 'sections', description: 'Custom formatted text content', allowedBlocks: ['heading', 'text', 'button'], defaultSettings: { content: 'Add your content here...', textAlign: 'center', backgroundColor: '#ffffff', maxWidth: '800px' } },
  'image-with-text': { icon: <Icons.Image />, label: 'Image with text', category: 'sections', description: 'Image paired with text content', allowedBlocks: ['heading', 'text', 'button', 'image'], defaultSettings: { heading: 'Section Title', text: 'Pair text with an image to focus on your chosen product, collection, or blog post.', imagePosition: 'left', buttonText: 'Learn More', buttonLink: '' } },
  'image-banner': { icon: <Icons.Image />, label: 'Image banner', category: 'sections', description: 'Full-width image banner', allowedBlocks: ['heading', 'text', 'button'], defaultSettings: { imageUrl: '', heading: '', subheading: '', buttonText: '', buttonLink: '', height: 'medium', overlayOpacity: 30 } },
  'slideshow': { icon: <Icons.Layers />, label: 'Slideshow', category: 'sections', description: 'Image carousel/slideshow', allowedBlocks: ['image'], defaultSettings: { autoplay: true, autoplaySpeed: 5, showArrows: true, showDots: true } },
  'video': { icon: <Icons.Video />, label: 'Video', category: 'sections', description: 'Embed video content', allowedBlocks: ['heading', 'text'], defaultSettings: { videoUrl: '', autoplay: false, muted: true, loop: true, aspectRatio: '16:9', heading: '' } },
  'newsletter': { icon: <Icons.Mail />, label: 'Newsletter', category: 'sections', description: 'Email signup form', allowedBlocks: ['heading', 'text'], defaultSettings: { heading: 'Subscribe to our newsletter', subheading: 'Get the latest updates and offers.', buttonText: 'Subscribe', backgroundColor: '#f8f9fa', successMessage: 'Thanks for subscribing!' } },
  'collection-list': { icon: <Icons.Grid />, label: 'Collection list', category: 'sections', description: 'Display collections', allowedBlocks: ['collection'], defaultSettings: { heading: 'Shop by Category', collections: [], columns: 3, imageRatio: 'square' } },
  'product-grid': { icon: <Icons.ShoppingBag />, label: 'Product grid', category: 'sections', description: 'Grid of products', allowedBlocks: ['product'], defaultSettings: { heading: 'All Products', productsPerRow: 4, rows: 2, showFilters: true, showSort: true } },
  'testimonials': { icon: <Icons.Message />, label: 'Testimonials', category: 'sections', description: 'Customer reviews/testimonials', allowedBlocks: ['text'], defaultSettings: { heading: 'What Our Customers Say', testimonials: [], autoplay: true, showRatings: true } },
  'contact-form': { icon: <Icons.Mail />, label: 'Contact form', category: 'sections', description: 'Contact form section', allowedBlocks: ['heading', 'text'], defaultSettings: { heading: 'Get in Touch', subheading: 'Have a question? Send us a message.', showPhone: true, showAddress: true, formFields: ['name', 'email', 'message'] } },
  'map': { icon: <Icons.Map />, label: 'Map', category: 'sections', description: 'Embed Google map', allowedBlocks: ['heading', 'text'], defaultSettings: { address: '', heading: 'Visit Us', mapHeight: 400, showMarker: true } },
  'multicolumn': { icon: <Icons.Grid />, label: 'Multicolumn', category: 'sections', description: 'Multi-column content', allowedBlocks: ['heading', 'text', 'image', 'button'], defaultSettings: { heading: '', columns: 3, columnContent: [] } },
  'collapsible-content': { icon: <Icons.Menu />, label: 'Collapsible content', category: 'sections', description: 'FAQ/accordion content', allowedBlocks: ['heading', 'text'], defaultSettings: { heading: 'Frequently Asked Questions', items: [], openFirst: true, allowMultiple: false } },
  'custom-liquid': { icon: <Icons.FileText />, label: 'Custom HTML', category: 'sections', description: 'Custom HTML/liquid code', allowedBlocks: [], defaultSettings: { html: '' } },
  'footer': { icon: <Icons.Layout />, label: 'Footer', category: 'footer', description: 'Site footer', allowedBlocks: ['link', 'text', 'image'], defaultSettings: { showNewsletter: true, showSocial: true, showPaymentIcons: true, copyrightText: '© 2024 Store. All rights reserved.', columns: 4 } },
  'featured-product': { icon: <Icons.Star />, label: 'Featured product', category: 'sections', description: 'Highlight a single product', allowedBlocks: ['heading', 'text', 'button', 'price'], defaultSettings: { productId: '', showQuantity: true, showVariants: true, mediaSize: 'medium' } },
  'blog-posts': { icon: <Icons.FileText />, label: 'Blog posts', category: 'sections', description: 'Display blog posts', allowedBlocks: ['heading'], defaultSettings: { heading: 'Latest Posts', postsToShow: 3, showDate: true, showAuthor: true, showExcerpt: true } },
  'brand-list': { icon: <Icons.Grid />, label: 'Brand list', category: 'sections', description: 'Logo carousel/grid', allowedBlocks: ['image'], defaultSettings: { heading: 'Our Partners', logos: [], columns: 6, grayscale: true } }
};

const BLOCK_DEFINITIONS: Record<BlockType, { icon: JSX.Element; label: string; defaultSettings: Record<string, any> }> = {
  'heading': { icon: <Icons.Type />, label: 'Heading', defaultSettings: { text: 'Heading', size: 'h2' } },
  'text': { icon: <Icons.Type />, label: 'Text', defaultSettings: { text: 'Add your text here', size: 'base' } },
  'button': { icon: <Icons.Plus />, label: 'Button', defaultSettings: { text: 'Click me', link: '', style: 'primary' } },
  'image': { icon: <Icons.Image />, label: 'Image', defaultSettings: { src: '', alt: '', width: 'full' } },
  'link': { icon: <Icons.Plus />, label: 'Link', defaultSettings: { text: 'Link', url: '', newTab: false } },
  'product': { icon: <Icons.ShoppingBag />, label: 'Product', defaultSettings: { productId: '' } },
  'collection': { icon: <Icons.Grid />, label: 'Collection', defaultSettings: { collectionId: '', imageUrl: '', title: '' } },
  'video': { icon: <Icons.Video />, label: 'Video', defaultSettings: { url: '', autoplay: false } },
  'icon': { icon: <Icons.Star />, label: 'Icon', defaultSettings: { name: 'star', size: 24 } },
  'price': { icon: <Icons.ShoppingBag />, label: 'Price', defaultSettings: { showCompare: true, size: 'large' } },
  'quantity': { icon: <Icons.Plus />, label: 'Quantity selector', defaultSettings: { min: 1, max: 99 } },
  'divider': { icon: <Icons.Menu />, label: 'Divider', defaultSettings: { style: 'line', spacing: 'medium' } }
};

const SortableSectionItem: React.FC<{ section: PlacedSection; isSelected: boolean; isExpanded: boolean; selectedBlockId: string | null; onSelect: () => void; onToggleExpand: () => void; onToggleVisibility: () => void; onDelete: () => void; onSelectBlock: (blockId: string) => void; onAddBlock: () => void }> = ({ section, isSelected, isExpanded, selectedBlockId, onSelect, onToggleExpand, onToggleVisibility, onDelete, onSelectBlock, onAddBlock }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  const def = SECTION_DEFINITIONS[section.type];
  return (
    <div ref={setNodeRef} style={style} className="group">
      <div className={`flex items-center gap-1 px-2 py-1.5 rounded-lg cursor-pointer transition-all ${isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'} ${!section.visible ? 'opacity-50' : ''}`} onClick={onSelect}>
        <button {...attributes} {...listeners} className="p-1 text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"><Icons.GripVertical /></button>
        <button onClick={(e) => { e.stopPropagation(); onToggleExpand(); }} className="p-0.5 text-gray-500 hover:text-gray-700">{isExpanded ? <Icons.ChevronDown /> : <Icons.ChevronRight />}</button>
        <span className="text-gray-500">{def?.icon}</span>
        <span className="flex-1 text-sm font-medium text-gray-700 truncate">{section.name}</span>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={(e) => { e.stopPropagation(); onToggleVisibility(); }} className="p-1 text-gray-400 hover:text-gray-600" title={section.visible ? 'Hide' : 'Show'}>{section.visible ? <Icons.Eye /> : <Icons.EyeOff />}</button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(); }} className="p-1 text-gray-400 hover:text-red-500" title="Delete"><Icons.Trash /></button>
        </div>
      </div>
      {isExpanded && section.blocks.length > 0 && (
        <div className="ml-8 mt-1 space-y-0.5 border-l-2 border-gray-100 pl-2">
          {section.blocks.map(block => (
            <div key={block.id} onClick={(e) => { e.stopPropagation(); onSelectBlock(block.id); }} className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer text-sm ${selectedBlockId === block.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}>
              {BLOCK_DEFINITIONS[block.type]?.icon}<span>{BLOCK_DEFINITIONS[block.type]?.label}</span>
            </div>
          ))}
        </div>
      )}
      {isExpanded && def?.allowedBlocks && def.allowedBlocks.length > 0 && (
        <button onClick={(e) => { e.stopPropagation(); onAddBlock(); }} className="ml-8 mt-1 flex items-center gap-1 px-2 py-1 text-xs text-blue-600 hover:bg-blue-50 rounded"><Icons.Plus /><span>Add block</span></button>
      )}
    </div>
  );
};

const StorePreview: React.FC<{ sections: PlacedSection[]; selectedSectionId: string | null; devicePreview: 'desktop' | 'tablet' | 'mobile'; onSelectSection: (id: string) => void }> = ({ sections, selectedSectionId, devicePreview, onSelectSection }) => {
  const deviceWidths = { desktop: '100%', tablet: '768px', mobile: '375px' };
  const visibleSections = sections.filter(s => s.visible);
  
  const renderSection = (section: PlacedSection) => {
    const isSelected = selectedSectionId === section.id;
    const baseClass = `relative transition-all cursor-pointer ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:ring-2 hover:ring-blue-200'}`;
    
    switch (section.type) {
      case 'announcement-bar':
        return <div className={`${baseClass} py-2 px-4 text-center text-sm`} style={{ backgroundColor: section.settings.backgroundColor, color: section.settings.textColor }}>{section.settings.text}</div>;
      case 'header':
        return <div className={`${baseClass} flex items-center justify-between px-6 py-4 bg-white border-b`}><div className="text-xl font-bold">{section.settings.logoText}</div><div className="flex gap-6"><span className="text-gray-600 hover:text-gray-900">Shop</span><span className="text-gray-600 hover:text-gray-900">About</span><span className="text-gray-600 hover:text-gray-900">Contact</span></div><div className="flex gap-4"><Icons.Search /><Icons.ShoppingBag /></div></div>;
      case 'hero':
        return <div className={`${baseClass} relative ${section.settings.height === 'large' ? 'min-h-[500px]' : section.settings.height === 'medium' ? 'min-h-[400px]' : 'min-h-[300px]'} flex items-center justify-center bg-gradient-to-r from-gray-800 to-gray-900 text-white`}><div className={`text-center px-8 ${section.settings.alignment === 'left' ? 'text-left' : section.settings.alignment === 'right' ? 'text-right' : 'text-center'}`}><h1 className="text-4xl font-bold mb-4">{section.settings.heading}</h1><p className="text-xl text-gray-300 mb-6">{section.settings.subheading}</p>{section.settings.buttonText && <button className="px-6 py-3 bg-white text-gray-900 rounded-lg font-medium hover:bg-gray-100">{section.settings.buttonText}</button>}</div></div>;
      case 'featured-collection':
        return <div className={`${baseClass} py-12 px-6`}><h2 className="text-2xl font-bold text-center mb-8">{section.settings.heading}</h2><div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${section.settings.columns}, 1fr)` }}>{[1, 2, 3, 4].slice(0, section.settings.productsToShow).map(i => <div key={i} className="bg-gray-100 rounded-lg p-4"><div className="bg-gray-200 aspect-square rounded-lg mb-3" /><div className="h-4 bg-gray-200 rounded w-3/4 mb-2" /><div className="h-4 bg-gray-200 rounded w-1/2" /></div>)}</div></div>;
      case 'rich-text':
        return <div className={`${baseClass} py-12 px-6`} style={{ backgroundColor: section.settings.backgroundColor, textAlign: section.settings.textAlign as any }}><div className="max-w-3xl mx-auto prose">{section.settings.content}</div></div>;
      case 'newsletter':
        return <div className={`${baseClass} py-12 px-6 text-center`} style={{ backgroundColor: section.settings.backgroundColor }}><h2 className="text-2xl font-bold mb-2">{section.settings.heading}</h2><p className="text-gray-600 mb-6">{section.settings.subheading}</p><div className="flex max-w-md mx-auto"><input className="flex-1 px-4 py-2 border rounded-l-lg" placeholder="Enter your email" /><button className="px-6 py-2 bg-gray-900 text-white rounded-r-lg">{section.settings.buttonText}</button></div></div>;
      case 'footer':
        return <div className={`${baseClass} py-12 px-6 bg-gray-900 text-white`}><div className="grid grid-cols-4 gap-8 mb-8">{[1, 2, 3, 4].map(i => <div key={i}><div className="h-4 bg-gray-700 rounded w-1/2 mb-4" /><div className="space-y-2">{[1, 2, 3].map(j => <div key={j} className="h-3 bg-gray-700 rounded w-3/4" />)}</div></div>)}</div><div className="text-center text-gray-400 text-sm pt-8 border-t border-gray-800">{section.settings.copyrightText}</div></div>;
      case 'image-with-text':
        return <div className={`${baseClass} py-12 px-6`}><div className={`flex gap-8 items-center ${section.settings.imagePosition === 'right' ? 'flex-row-reverse' : ''}`}><div className="flex-1 bg-gray-200 aspect-video rounded-lg" /><div className="flex-1"><h2 className="text-2xl font-bold mb-4">{section.settings.heading}</h2><p className="text-gray-600 mb-4">{section.settings.text}</p>{section.settings.buttonText && <button className="px-4 py-2 border border-gray-900 rounded-lg">{section.settings.buttonText}</button>}</div></div></div>;
      case 'testimonials':
        return <div className={`${baseClass} py-12 px-6 bg-gray-50`}><h2 className="text-2xl font-bold text-center mb-8">{section.settings.heading}</h2><div className="grid grid-cols-3 gap-6">{[1, 2, 3].map(i => <div key={i} className="bg-white p-6 rounded-lg shadow-sm"><div className="flex gap-1 text-yellow-400 mb-4">{[1, 2, 3, 4, 5].map(s => <Icons.Star key={s} />)}</div><p className="text-gray-600 mb-4">"Amazing product! Highly recommended."</p><div className="flex items-center gap-3"><div className="w-10 h-10 bg-gray-200 rounded-full" /><div><div className="font-medium">Customer</div><div className="text-sm text-gray-500">Verified Buyer</div></div></div></div>)}</div></div>;
      case 'collection-list':
        return <div className={`${baseClass} py-12 px-6`}><h2 className="text-2xl font-bold text-center mb-8">{section.settings.heading}</h2><div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${section.settings.columns}, 1fr)` }}>{[1, 2, 3].map(i => <div key={i} className="relative group"><div className="bg-gray-200 aspect-square rounded-lg" /><div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg"><span className="text-white font-bold text-xl">Collection {i}</span></div></div>)}</div></div>;
      default:
        return <div className={`${baseClass} py-12 px-6 bg-gray-50 text-center`}><div className="text-gray-400">{SECTION_DEFINITIONS[section.type]?.icon}</div><p className="text-gray-500 mt-2">{section.name}</p></div>;
    }
  };
  
  return (
    <main className="flex-1 bg-gray-100 overflow-auto p-6">
      <div className="mx-auto bg-white shadow-lg rounded-lg overflow-hidden transition-all" style={{ maxWidth: deviceWidths[devicePreview], minHeight: 'calc(100vh - 120px)' }}>
        {visibleSections.map(section => <div key={section.id} onClick={() => onSelectSection(section.id)}>{renderSection(section)}</div>)}
        {visibleSections.length === 0 && <div className="flex flex-col items-center justify-center h-96 text-gray-400"><Icons.Layers /><p className="mt-4">Add sections to build your page</p></div>}
      </div>
    </main>
  );
};

const SectionSettings: React.FC<{ section: PlacedSection; onUpdate: (settings: Record<string, any>) => void }> = ({ section, onUpdate }) => {
  const Field = ({ label, name, type = 'text', options }: { label: string; name: string; type?: string; options?: { value: string; label: string }[] }) => {
    const value = section.settings[name];
    const handleChange = (newVal: any) => onUpdate({ ...section.settings, [name]: newVal });
    if (type === 'select' && options) return <div><label className="text-sm text-gray-700 block mb-1">{label}</label><select value={value} onChange={(e) => handleChange(e.target.value)} className="w-full px-3 py-2 text-sm border rounded-lg">{options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}</select></div>;
    if (type === 'checkbox') return <label className="flex items-center gap-2 text-sm text-gray-700"><input type="checkbox" checked={Boolean(value)} onChange={(e) => handleChange(e.target.checked)} className="rounded" />{label}</label>;
    if (type === 'color') return <div><label className="text-sm text-gray-700 block mb-1">{label}</label><input type="color" value={value} onChange={(e) => handleChange(e.target.value)} className="w-full h-10 rounded-lg cursor-pointer" /></div>;
    if (type === 'range') return <div><label className="text-sm text-gray-700 block mb-1">{label}: {value}</label><input type="range" min="0" max="100" value={value} onChange={(e) => handleChange(parseInt(e.target.value))} className="w-full" /></div>;
    if (type === 'textarea') return <div><label className="text-sm text-gray-700 block mb-1">{label}</label><textarea value={value} onChange={(e) => handleChange(e.target.value)} rows={4} className="w-full px-3 py-2 text-sm border rounded-lg resize-none" /></div>;
    return <div><label className="text-sm text-gray-700 block mb-1">{label}</label><input type={type} value={value || ''} onChange={(e) => handleChange(e.target.value)} className="w-full px-3 py-2 text-sm border rounded-lg" /></div>;
  };
  
  const renderFields = () => {
    switch (section.type) {
      case 'announcement-bar': return <><Field label="Text" name="text" /><Field label="Background Color" name="backgroundColor" type="color" /><Field label="Text Color" name="textColor" type="color" /><Field label="Dismissible" name="dismissible" type="checkbox" /></>;
      case 'header': return <><Field label="Logo Text" name="logoText" /><Field label="Sticky Header" name="sticky" type="checkbox" /><Field label="Transparent" name="transparent" type="checkbox" /><Field label="Menu Style" name="menuStyle" type="select" options={[{ value: 'horizontal', label: 'Horizontal' }, { value: 'dropdown', label: 'Dropdown' }]} /></>;
      case 'hero': return <><Field label="Heading" name="heading" /><Field label="Subheading" name="subheading" /><Field label="Button Text" name="buttonText" /><Field label="Button Link" name="buttonLink" /><Field label="Height" name="height" type="select" options={[{ value: 'small', label: 'Small' }, { value: 'medium', label: 'Medium' }, { value: 'large', label: 'Large' }]} /><Field label="Overlay Opacity" name="overlayOpacity" type="range" /><Field label="Alignment" name="alignment" type="select" options={[{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }]} /></>;
      case 'featured-collection': return <><Field label="Heading" name="heading" /><Field label="Products to Show" name="productsToShow" type="select" options={[{ value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }, { value: '6', label: '6' }]} /><Field label="Columns" name="columns" type="select" options={[{ value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }]} /><Field label="Show View All" name="showViewAll" type="checkbox" /></>;
      case 'rich-text': return <><Field label="Content" name="content" type="textarea" /><Field label="Text Align" name="textAlign" type="select" options={[{ value: 'left', label: 'Left' }, { value: 'center', label: 'Center' }, { value: 'right', label: 'Right' }]} /><Field label="Background Color" name="backgroundColor" type="color" /></>;
      case 'newsletter': return <><Field label="Heading" name="heading" /><Field label="Subheading" name="subheading" /><Field label="Button Text" name="buttonText" /><Field label="Background Color" name="backgroundColor" type="color" /></>;
      case 'footer': return <><Field label="Copyright Text" name="copyrightText" /><Field label="Show Newsletter" name="showNewsletter" type="checkbox" /><Field label="Show Social Links" name="showSocial" type="checkbox" /><Field label="Show Payment Icons" name="showPaymentIcons" type="checkbox" /></>;
      case 'image-with-text': return <><Field label="Heading" name="heading" /><Field label="Text" name="text" type="textarea" /><Field label="Image Position" name="imagePosition" type="select" options={[{ value: 'left', label: 'Left' }, { value: 'right', label: 'Right' }]} /><Field label="Button Text" name="buttonText" /></>;
      case 'testimonials': return <><Field label="Heading" name="heading" /><Field label="Autoplay" name="autoplay" type="checkbox" /><Field label="Show Ratings" name="showRatings" type="checkbox" /></>;
      case 'collection-list': return <><Field label="Heading" name="heading" /><Field label="Columns" name="columns" type="select" options={[{ value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }]} /></>;
      default: return Object.keys(section.settings).map(key => <Field key={key} label={key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())} name={key} />);
    }
  };
  return <div className="space-y-4">{renderFields()}</div>;
};

const AddSectionModal: React.FC<{ isOpen: boolean; onClose: () => void; onAdd: (type: SectionType) => void; category: 'header' | 'sections' | 'footer' }> = ({ isOpen, onClose, onAdd, category }) => {
  const [search, setSearch] = useState('');
  if (!isOpen) return null;
  const filteredSections = (Object.entries(SECTION_DEFINITIONS) as [SectionType, typeof SECTION_DEFINITIONS[SectionType]][]).filter(([type, def]) => (category === 'sections' ? def.category === 'sections' : def.category === category) && (def.label.toLowerCase().includes(search.toLowerCase()) || def.description.toLowerCase().includes(search.toLowerCase())));
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-[600px] max-h-[80vh] flex flex-col">
        <div className="p-4 border-b flex items-center justify-between"><h2 className="text-lg font-semibold">Add section</h2><button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><Icons.X /></button></div>
        <div className="p-4 border-b"><div className="relative"><Icons.Search /><input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search sections..." className="w-full pl-10 pr-4 py-2 border rounded-lg" style={{ paddingLeft: '2.5rem' }} /></div></div>
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-2 gap-3">
          {filteredSections.map(([type, def]) => (
            <button key={type} onClick={() => { onAdd(type); onClose(); }} className="flex items-start gap-3 p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 text-left transition-all">
              <div className="p-2 bg-gray-100 rounded-lg text-gray-600">{def.icon}</div>
              <div><div className="font-medium text-gray-900">{def.label}</div><div className="text-sm text-gray-500">{def.description}</div></div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const AddBlockModal: React.FC<{ isOpen: boolean; onClose: () => void; onAdd: (type: BlockType) => void; allowedBlocks: BlockType[] }> = ({ isOpen, onClose, onAdd, allowedBlocks }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl w-[400px]">
        <div className="p-4 border-b flex items-center justify-between"><h2 className="text-lg font-semibold">Add block</h2><button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg"><Icons.X /></button></div>
        <div className="p-4 grid grid-cols-2 gap-2">
          {allowedBlocks.map(type => {
            const def = BLOCK_DEFINITIONS[type];
            return <button key={type} onClick={() => { onAdd(type); onClose(); }} className="flex items-center gap-2 p-3 border rounded-lg hover:border-blue-500 hover:bg-blue-50 text-left transition-all">{def.icon}<span className="text-sm font-medium">{def.label}</span></button>;
          })}
        </div>
      </div>
    </div>
  );
};

const PageBuilder: React.FC<PageBuilderProps> = ({ tenantId }) => {
  const [sections, setSections] = useState<PlacedSection[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [devicePreview, setDevicePreview] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [addSectionModal, setAddSectionModal] = useState<'header' | 'sections' | 'footer' | null>(null);
  const [addBlockSectionId, setAddBlockSectionId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));
  const selectedSection = sections.find(s => s.id === selectedSectionId);
  const selectedBlock = selectedSection?.blocks.find(b => b.id === selectedBlockId);

  useEffect(() => {
    const fetchLayout = async () => {
      try {
        const res = await fetch('/api/v1/tenant-data/' + tenantId + '/store_layout');
        if (res.ok) {
          const data = await res.json();
          if (data?.sections) setSections(data.sections);
          else setSections([
            { id: uuidv4(), type: 'announcement-bar', name: 'Announcement bar', visible: true, settings: SECTION_DEFINITIONS['announcement-bar'].defaultSettings, blocks: [] },
            { id: uuidv4(), type: 'header', name: 'Header', visible: true, settings: SECTION_DEFINITIONS['header'].defaultSettings, blocks: [] },
            { id: uuidv4(), type: 'hero', name: 'Hero banner', visible: true, settings: SECTION_DEFINITIONS['hero'].defaultSettings, blocks: [] },
            { id: uuidv4(), type: 'featured-collection', name: 'Featured collection', visible: true, settings: SECTION_DEFINITIONS['featured-collection'].defaultSettings, blocks: [] },
            { id: uuidv4(), type: 'newsletter', name: 'Newsletter', visible: true, settings: SECTION_DEFINITIONS['newsletter'].defaultSettings, blocks: [] },
            { id: uuidv4(), type: 'footer', name: 'Footer', visible: true, settings: SECTION_DEFINITIONS['footer'].defaultSettings, blocks: [] }
          ]);
        }
      } catch (e) { console.error('Failed to fetch layout:', e); }
      setIsLoading(false);
    };
    fetchLayout();
  }, [tenantId]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); if (hasChanges) handleSave(); } };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasChanges]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await fetch('/api/v1/tenant-data/' + tenantId + '/store_layout', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ sections }) });
      setHasChanges(false);
    } catch (e) { console.error('Failed to save:', e); }
    setIsSaving(false);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSections(prev => { const oldIdx = prev.findIndex(s => s.id === active.id); const newIdx = prev.findIndex(s => s.id === over.id); return arrayMove(prev, oldIdx, newIdx); });
      setHasChanges(true);
    }
  };

  const handleAddSection = (type: SectionType) => {
    const def = SECTION_DEFINITIONS[type];
    const newSection: PlacedSection = { id: uuidv4(), type, name: def.label, visible: true, settings: { ...def.defaultSettings }, blocks: [] };
    setSections(prev => {
      if (def.category === 'header') { const headerIdx = prev.findIndex(s => SECTION_DEFINITIONS[s.type].category !== 'header'); return [...prev.slice(0, headerIdx >= 0 ? headerIdx : prev.length), newSection, ...prev.slice(headerIdx >= 0 ? headerIdx : prev.length)]; }
      if (def.category === 'footer') return [...prev, newSection];
      const footerIdx = prev.findIndex(s => SECTION_DEFINITIONS[s.type].category === 'footer');
      return [...prev.slice(0, footerIdx >= 0 ? footerIdx : prev.length), newSection, ...prev.slice(footerIdx >= 0 ? footerIdx : prev.length)];
    });
    setHasChanges(true);
    setSelectedSectionId(newSection.id);
  };

  const handleDeleteSection = (id: string) => { setSections(prev => prev.filter(s => s.id !== id)); setHasChanges(true); if (selectedSectionId === id) { setSelectedSectionId(null); setSelectedBlockId(null); } };
  const handleToggleVisibility = (id: string) => { setSections(prev => prev.map(s => s.id === id ? { ...s, visible: !s.visible } : s)); setHasChanges(true); };
  const handleToggleExpand = (id: string) => setExpandedSections(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  const handleUpdateSectionSettings = (settings: Record<string, any>) => { setSections(prev => prev.map(s => s.id === selectedSectionId ? { ...s, settings } : s)); setHasChanges(true); };
  const handleAddBlock = (type: BlockType) => {
    if (!addBlockSectionId) return;
    const newBlock: Block = { id: uuidv4(), type, settings: { ...BLOCK_DEFINITIONS[type].defaultSettings } };
    setSections(prev => prev.map(s => s.id === addBlockSectionId ? { ...s, blocks: [...s.blocks, newBlock] } : s));
    setHasChanges(true);
    setAddBlockSectionId(null);
  };
  const handlePreview = () => window.open('/store/' + tenantId, '_blank');

  const headerSections = sections.filter(s => SECTION_DEFINITIONS[s.type]?.category === 'header');
  const mainSections = sections.filter(s => SECTION_DEFINITIONS[s.type]?.category === 'sections');
  const footerSections = sections.filter(s => SECTION_DEFINITIONS[s.type]?.category === 'footer');

  const renderSectionGroup = (title: string, sectionList: PlacedSection[], category: 'header' | 'sections' | 'footer') => (
    <div className="border-b border-gray-100">
      <div className="px-3 py-2"><h3 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">{title}</h3></div>
      <div className="px-2 pb-2 space-y-0.5">
        <SortableContext items={sectionList.map(s => s.id)} strategy={verticalListSortingStrategy}>
          {sectionList.map((section) => <SortableSectionItem key={section.id} section={section} isSelected={selectedSectionId === section.id} isExpanded={expandedSections.includes(section.id)} selectedBlockId={selectedSectionId === section.id ? selectedBlockId : null} onSelect={() => { setSelectedSectionId(section.id); setSelectedBlockId(null); }} onToggleExpand={() => handleToggleExpand(section.id)} onToggleVisibility={() => handleToggleVisibility(section.id)} onDelete={() => handleDeleteSection(section.id)} onSelectBlock={(blockId) => { setSelectedSectionId(section.id); setSelectedBlockId(blockId); }} onAddBlock={() => setAddBlockSectionId(section.id)} />)}
        </SortableContext>
        <button onClick={() => setAddSectionModal(category)} className="flex items-center gap-2 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-lg w-full"><Icons.Plus /><span>Add section</span></button>
      </div>
    </div>
  );

  if (isLoading) return <div className="h-screen flex items-center justify-center"><Icons.Loader /><span className="ml-2">Loading...</span></div>;

  return (
    <div className="h-screen flex flex-col bg-white">
      <header className="h-14 bg-white border-b flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg" title="Back"><Icons.ArrowLeft /></button>
          <div className="flex items-center gap-2"><span className="font-semibold text-gray-900">Store Builder</span><span className="flex items-center gap-1.5 px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">● Live</span>{hasChanges && <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-xs font-medium rounded-full">Unsaved changes</span>}</div>
        </div>
        <div className="flex items-center gap-1 text-sm text-gray-600"><Icons.Home /><span>Home page</span></div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border rounded-lg p-1 mr-2">{[{ id: 'desktop', Icon: Icons.Monitor }, { id: 'tablet', Icon: Icons.Tablet }, { id: 'mobile', Icon: Icons.Smartphone }].map(({ id, Icon }) => <button key={id} onClick={() => setDevicePreview(id as any)} className={`p-2 rounded-md transition ${devicePreview === id ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}><Icon /></button>)}</div>
          <button onClick={handlePreview} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500" title="Preview"><Icons.Eye /></button>
          <button onClick={handleSave} disabled={!hasChanges || isSaving} className={`ml-2 px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition ${hasChanges ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}>{isSaving ? <><Icons.Loader /> Saving...</> : <><Icons.Save /> Save</>}</button>
        </div>
      </header>
      <div className="flex-1 flex overflow-hidden">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <aside className="w-64 bg-white border-r flex flex-col h-full overflow-hidden">
            <div className="p-3 border-b"><button className="w-full flex items-center gap-2 px-3 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition"><Icons.Home /><span className="text-sm font-medium text-gray-700 flex-1 text-left">Home page</span><Icons.ChevronDown /></button></div>
            <div className="flex-1 overflow-y-auto">{renderSectionGroup('Header', headerSections, 'header')}{renderSectionGroup('Template', mainSections, 'sections')}{renderSectionGroup('Footer', footerSections, 'footer')}</div>
            <div className="p-3 border-t"><button className="w-full flex items-center gap-2 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"><Icons.Settings /><span className="text-sm">Theme settings</span></button></div>
          </aside>
          <StorePreview sections={sections} selectedSectionId={selectedSectionId} devicePreview={devicePreview} onSelectSection={(id) => { setSelectedSectionId(id); setSelectedBlockId(null); }} />
          <aside className="w-72 bg-white border-l flex flex-col h-full">
            {selectedSection ? (
              <>
                <div className="p-4 border-b">{selectedBlockId && <button onClick={() => setSelectedBlockId(null)} className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-3 transition"><Icons.ArrowLeft /><span>Back to section</span></button>}<div className="flex items-center gap-2">{SECTION_DEFINITIONS[selectedSection.type]?.icon}<h3 className="font-semibold text-gray-900">{selectedBlockId ? BLOCK_DEFINITIONS[selectedBlock?.type || 'text']?.label : selectedSection.name}</h3></div><p className="text-sm text-gray-500 mt-1">{SECTION_DEFINITIONS[selectedSection.type]?.description}</p></div>
                <div className="flex-1 overflow-y-auto p-4">{selectedBlockId && selectedBlock ? <div className="space-y-3">{Object.entries(selectedBlock.settings).map(([k, v]) => <div key={k}><label className="text-sm text-gray-700 block mb-1 capitalize">{k.replace(/([A-Z])/g, ' $1')}</label><input type="text" value={String(v)} onChange={(e) => { const newSettings = { ...selectedBlock.settings, [k]: e.target.value }; setSections(prev => prev.map(s => { if (s.id !== selectedSectionId) return s; return { ...s, blocks: s.blocks.map(b => b.id === selectedBlockId ? { ...b, settings: newSettings } : b) }; })); setHasChanges(true); }} className="w-full px-3 py-2 text-sm border rounded-lg" /></div>)}</div> : <SectionSettings section={selectedSection} onUpdate={handleUpdateSectionSettings} />}</div>
              </>
            ) : <div className="p-4"><div className="flex items-center gap-3 mb-2 text-gray-400"><Icons.Settings /></div><h3 className="font-semibold text-gray-900">Customize your store</h3><p className="text-sm text-gray-500 mt-1">Select a section from the left panel to customize it.</p></div>}
          </aside>
        </DndContext>
      </div>
      <AddSectionModal isOpen={addSectionModal !== null} onClose={() => setAddSectionModal(null)} onAdd={handleAddSection} category={addSectionModal || 'sections'} />
      <AddBlockModal isOpen={addBlockSectionId !== null} onClose={() => setAddBlockSectionId(null)} onAdd={handleAddBlock} allowedBlocks={addBlockSectionId ? SECTION_DEFINITIONS[sections.find(s => s.id === addBlockSectionId)?.type || 'hero']?.allowedBlocks || [] : []} />
    </div>
  );
};

export { PageBuilder };
export default PageBuilder;

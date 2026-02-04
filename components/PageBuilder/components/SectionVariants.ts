/**
 * Section Variants Configuration
 */

export interface SectionVariant {
  id: string;
  name: string;
  description: string;
  settings: Record<string, any>;
}

export interface SectionCategory {
  id: string;
  name: string;
  icon: string;
  variants: SectionVariant[];
}

export const heroVariants: SectionVariant[] = [
  { id: 'hero-fullwidth', name: 'Full Width Hero', description: 'Large full-width hero with overlay text', settings: { height: 'large', alignment: 'center', overlayOpacity: 40 } },
  { id: 'hero-split', name: 'Split Hero', description: 'Image on one side, text on the other', settings: { height: 'medium', alignment: 'left' } },
  { id: 'hero-minimal', name: 'Minimal Hero', description: 'Clean minimal design', settings: { height: 'small', alignment: 'center', overlayOpacity: 10 } },
  { id: 'hero-video', name: 'Video Background', description: 'Hero with video background', settings: { height: 'large', useVideo: true } }
];

export const categoryVariants: SectionVariant[] = [
  { id: 'categories-grid', name: 'Grid Layout', description: 'Categories in a clean grid', settings: { style: 'grid', columns: 4 } },
  { id: 'categories-carousel', name: 'Carousel', description: 'Scrollable category carousel', settings: { style: 'carousel', columns: 6 } },
  { id: 'categories-featured', name: 'Featured Categories', description: 'Large featured category cards', settings: { style: 'featured', columns: 3 } },
  { id: 'categories-list', name: 'List View', description: 'Vertical list of categories', settings: { style: 'list', columns: 1 } },
  { id: 'categories-icons', name: 'Icon Grid', description: 'Categories with icons', settings: { style: 'icons', columns: 6 } },
  { id: 'categories-banner', name: 'Banner Style', description: 'Categories as horizontal banners', settings: { style: 'banner', columns: 2 } }
];

export const specialOffersVariants: SectionVariant[] = [
  { id: 'flash-sale-countdown', name: 'Flash Sale with Countdown', description: 'Products with countdown timer', settings: { showCountdown: true, style: 'cards' } },
  { id: 'flash-sale-banner', name: 'Sale Banner', description: 'Full-width promotional banner', settings: { showCountdown: false, style: 'banner' } },
  { id: 'deal-of-day', name: 'Deal of the Day', description: 'Single featured deal', settings: { showCountdown: true, productsToShow: 1 } },
  { id: 'multi-deals', name: 'Multiple Deals', description: 'Grid of deal products', settings: { showCountdown: true, productsToShow: 4 } },
  { id: 'bundle-offer', name: 'Bundle Offer', description: 'Product bundle deals', settings: { showCountdown: false, style: 'bundle' } }
];

export const trustBadgesVariants: SectionVariant[] = [
  { id: 'trust-icons-row', name: 'Icon Row', description: 'Horizontal row of trust icons', settings: { layout: 'row' } },
  { id: 'trust-cards', name: 'Card Grid', description: 'Trust badges in card format', settings: { layout: 'cards', columns: 4 } },
  { id: 'trust-centered', name: 'Centered Badges', description: 'Centered trust indicators', settings: { layout: 'centered' } }
];

export const reviewsVariants: SectionVariant[] = [
  { id: 'testimonials-carousel', name: 'Testimonial Carousel', description: 'Rotating customer testimonials', settings: { autoplay: true, showRatings: true } },
  { id: 'reviews-grid', name: 'Reviews Grid', description: 'Grid of customer reviews', settings: { columns: 3 } },
  { id: 'reviews-featured', name: 'Featured Review', description: 'Single highlighted review', settings: { style: 'featured' } }
];

export const brandShowcaseVariants: SectionVariant[] = [
  { id: 'brands-logo-grid', name: 'Logo Grid', description: 'Grid of brand logos', settings: { style: 'grid', columns: 6, grayscale: true } },
  { id: 'brands-carousel', name: 'Logo Carousel', description: 'Scrolling brand logos', settings: { style: 'carousel', columns: 8 } },
  { id: 'brands-featured', name: 'Featured Brands', description: 'Large brand showcases', settings: { style: 'featured', columns: 4 } }
];

export const staticBannerVariants: SectionVariant[] = [
  { id: 'banner-sale', name: 'Sale Banner', description: 'Promotional sale banner', settings: { height: 'medium', overlayOpacity: 30 } },
  { id: 'banner-info', name: 'Info Banner', description: 'Informational banner', settings: { height: 'small', overlayOpacity: 20 } },
  { id: 'banner-cta', name: 'Call to Action', description: 'CTA focused banner', settings: { height: 'medium', overlayOpacity: 40 } },
  { id: 'banner-announcement', name: 'Announcement Bar', description: 'Top announcement strip', settings: { height: 'small' } }
];

export const productGridVariants: SectionVariant[] = [
  { id: 'products-grid-4col', name: '4 Column Grid', description: 'Standard 4-column product grid', settings: { columns: 4, productsToShow: 8, filterType: 'all' } },
  { id: 'products-grid-3col', name: '3 Column Grid', description: 'Larger 3-column product cards', settings: { columns: 3, productsToShow: 6, filterType: 'all' } },
  { id: 'products-featured', name: 'Featured Products', description: 'Featured products only', settings: { columns: 4, productsToShow: 4, filterType: 'featured' } },
  { id: 'products-bestsellers', name: 'Best Sellers', description: 'Top selling products', settings: { columns: 4, productsToShow: 8, filterType: 'bestseller' } }
];

export const footerVariants: SectionVariant[] = [
  { id: 'footer-full', name: 'Full Footer', description: 'Multi-column footer with all sections', settings: { columns: 4, showNewsletter: true, showSocial: true } },
  { id: 'footer-simple', name: 'Simple Footer', description: 'Minimal footer with essentials', settings: { columns: 2, showNewsletter: false, showSocial: true } }
];

export const navigationVariants: SectionVariant[] = [
  { id: 'nav-transparent', name: 'Transparent Header', description: 'Transparent header over hero', settings: { transparent: true, sticky: true } },
  { id: 'nav-solid', name: 'Solid Header', description: 'Standard solid header', settings: { transparent: false, sticky: false } },
  { id: 'nav-sticky', name: 'Sticky Header', description: 'Always visible sticky header', settings: { transparent: false, sticky: true } },
  { id: 'nav-mega', name: 'Mega Menu Header', description: 'Header with mega menu', settings: { transparent: false, sticky: true, menuStyle: 'mega' } }
];

export const customSectionVariants: SectionVariant[] = [
  { id: 'custom-richtext', name: 'Rich Text Block', description: 'Custom formatted text content', settings: { textAlign: 'center', backgroundColor: '#ffffff' } },
  { id: 'custom-html', name: 'Custom HTML', description: 'Custom HTML code block', settings: { html: '' } }
];

export const headingsVariants: SectionVariant[] = [
  { id: 'heading-simple', name: 'Simple Heading', description: 'Basic section heading', settings: { textAlign: 'center', size: 'large' } }
];

export const sectionCategories: SectionCategory[] = [
  { id: 'navigation', name: 'Navigation', icon: 'layout', variants: navigationVariants },
  { id: 'hero', name: 'Hero Sections', icon: 'star', variants: heroVariants },
  { id: 'headings', name: 'Headings', icon: 'type', variants: headingsVariants },
  { id: 'banners', name: 'Static Banners', icon: 'image', variants: staticBannerVariants },
  { id: 'categories', name: 'Category Sections', icon: 'grid', variants: categoryVariants },
  { id: 'offers', name: 'Special Offers', icon: 'zap', variants: specialOffersVariants },
  { id: 'trust', name: 'Trust Badges', icon: 'shield', variants: trustBadgesVariants },
  { id: 'reviews', name: 'Reviews', icon: 'message', variants: reviewsVariants },
  { id: 'brands', name: 'Brand Showcase', icon: 'shopping-bag', variants: brandShowcaseVariants },
  { id: 'products', name: 'Product Grids', icon: 'grid', variants: productGridVariants },
  { id: 'custom', name: 'Custom Section', icon: 'layers', variants: customSectionVariants },
  { id: 'footer', name: 'Footers', icon: 'layout', variants: footerVariants }
];

export const variantToSectionType: Record<string, string> = {
  'hero-fullwidth': 'hero', 'hero-split': 'hero', 'hero-minimal': 'hero', 'hero-video': 'hero',
  'categories-grid': 'categories', 'categories-carousel': 'categories', 'categories-featured': 'categories', 'categories-list': 'categories', 'categories-icons': 'categories', 'categories-banner': 'categories',
  'flash-sale-countdown': 'flash-sale', 'flash-sale-banner': 'flash-sale', 'deal-of-day': 'flash-sale', 'multi-deals': 'flash-sale', 'bundle-offer': 'flash-sale',
  'trust-icons-row': 'multicolumn', 'trust-cards': 'multicolumn', 'trust-centered': 'multicolumn',
  'testimonials-carousel': 'testimonials', 'reviews-grid': 'testimonials', 'reviews-featured': 'testimonials',
  'brands-logo-grid': 'brands', 'brands-carousel': 'brands', 'brands-featured': 'brands',
  'banner-sale': 'image-banner', 'banner-info': 'image-banner', 'banner-cta': 'image-banner', 'banner-announcement': 'announcement-bar',
  'products-grid-4col': 'product-grid', 'products-grid-3col': 'product-grid', 'products-featured': 'product-grid', 'products-bestsellers': 'product-grid',
  'footer-full': 'footer', 'footer-simple': 'footer',
  'nav-transparent': 'header', 'nav-solid': 'header', 'nav-sticky': 'header', 'nav-mega': 'header',
  'custom-richtext': 'rich-text', 'custom-html': 'custom-html', 'heading-simple': 'rich-text'
};

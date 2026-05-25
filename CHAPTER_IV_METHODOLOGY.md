# Chapter IV: METHODOLOGY

## 1. Software Development Methodology

The Community Sellers Hub employs an Agile Development Model with incremental feature delivery across 19 database migrations spanning 5 weeks of active development. Development is characterized by short iterative cycles focusing on progressive feature enhancement: initial database schema and UI foundation (April 22-24), followed by backend integration (April 29-30), core feature implementation (May 4-8), performance optimization (May 12-13), and final refinements (May 20-24). Version control through Git with feature branch integration enables parallel development and systematic code review prior to main branch deployment.

The Agile approach is evidenced by continuous feature refinement without complete system reconstruction. Frontend components are developed using React Server Components and Client Components with Next.js App Router. Database schemas evolve through versioned migrations rather than destructive resets, allowing existing deployments to upgrade seamlessly. This methodology prioritizes delivering functional product discovery, user authentication, and seller management features first, with advanced analytics and recommendation systems deferred for future iterations.

## 2. Planning Phase

### 2.1 Feasibility Study

**Feasibility Analysis**

- Next.js 15.3.2 with TypeScript 5.8.2 provides type-safe full-stack development without external backend server configuration
- PostgreSQL via Supabase eliminates database administration overhead with managed backups and automatic scaling
- Supabase Auth handles OAuth2 integration (Google, GitHub) without implementing credential management
- Row-Level Security (RLS) policies enforce database-level access control, reducing application authorization complexity
- Image storage via Supabase Storage buckets eliminates filesystem management concerns
- Vercel deployment automates CI/CD pipeline and provides edge function optimization
- Full-text search using PostgreSQL trigram similarity and tsvector functionality enables efficient semantic search without external search engines

**Project Cost**

- Vercel hosting: Free tier (development) or $20/month (production)
- Supabase database: Free tier (development) or $25/month (production growth tier)
- Domain registration: $10-15/year
- GitHub repository: Free tier

**Work Breakdown Structure**

- Phase 1 (April 22-24): Next.js 15 conversion, Tailwind setup, Header/Sidebar components, notification bell, skeleton loaders
- Phase 2 (April 29-30): Supabase client setup, Google OAuth implementation, real data integration across pages, account page creation, product CRUD operations, image upload to storage, buyer-seller onboarding flow
- Phase 3 (May 4-8): Draft product status, product editing/deletion refinement, like count functionality, Pinterest-style product modal with related products, category filtering with Browse More, seller profile pages, contact options dropdown, product like notifications, location autocomplete, avatar upload, favorites section in account page
- Phase 4 (May 12-13): Mobile spacing optimization for Pinterest-like layout, comprehensive UI animations, messaging preference system, performance optimization with lazy loading and min-heights
- Phase 5 (May 20-24): Search autocomplete API with RPC scoring, fullscreen product image viewer, owner-specific product modals, Instagram/TikTok integration, mobile search input, back-stack navigation for product browsing, auto-save for profile changes, search result clearing behavior

**Risk Management**

- Image Upload Failures: handleAvatarUpload function implements error handling and retry logic; fallback to placeholder avatars if upload fails
- Database Query Timeouts: Search implementation includes RPC function with ILIKE fallback if performance degrades; indexed tsvector columns prevent sequential scans
- Authentication Session Loss: Supabase SSR session management prevents token expiration during user browsing; automatic session refresh on page reload

## 3. Requirement Phase

### 3.1 Requirements Specification

**User Requirements**

- Browse products by category, trending status, and featured items
- Search for products and sellers using keyword search with autocomplete suggestions
- View detailed product information including images, price, stock status, and seller contact information
- Save favorite products and access favorites list from account page
- Contact sellers via WhatsApp, Messenger, Instagram, or TikTok links
- Create user account and manage profile with avatar, username, and bio
- Create seller account and complete onboarding workflow
- View seller profiles with storefront location and available contact methods

**Functional Requirements**

- OAuth2 authentication via Google and GitHub with automatic profile creation
- Product creation, editing, deletion by seller users (CRUD operations)
- Product image upload to Supabase Storage with public URL generation
- Category-based product filtering with product count per category
- Full-text search across product titles and seller usernames via PostgreSQL tsvector
- Search autocomplete suggestions returning products and sellers as user types
- Product favoriting with persistent storage and like count tracking
- User profile editing with auto-save functionality (1.5-second debounce)
- Seller profile with location input, geographic coordinates, and contact links
- Profile avatar upload with database persistence
- Trending products display sorted by view count
- Featured products display selected via is_featured flag
- Product modal with image carousel and seller information
- Notification bell with unread count (UI component present)
- Product tags with tag extraction from search results
- Trust tier system with tier levels (New, Rising, Verified, Elite)
- Stock quantity tracking and availability status (available, low, sold_out)
- View count and like count metrics on products
- Masonry grid layout with varying tile sizes (1x1, 1x2, 2x2)
- Location-based seller display with latitude/longitude storage

**Non-Functional Requirements**

- Full responsive design from 320px (mobile) to 2560px (desktop) screen widths
- Image lazy loading and progressive loading via Next.js Image optimization
- Auto-save on account settings with visual feedback (saving/saved states)
- Touch-friendly UI with 44px minimum tap target sizes
- API response time target of 200ms for 95th percentile of requests
- Database query completion within 100ms for standard searches
- Masonry grid layout without layout shift during image loading
- Data persistence in PostgreSQL with referential integrity via foreign keys
- Cascading deletes to prevent orphaned product records when seller deleted

**Software Requirements**

- Next.js 15.3.2 (React framework with App Router and server components)
- React 19.0.0 (UI library)
- TypeScript 5.8.2 (static type checking)
- Tailwind CSS 4.1.14 (utility-first styling)
- Supabase (PostgreSQL database, OAuth authentication, object storage)
- lucide-react 0.546.0 (SVG icon library)
- motion 12.23.24 (animation library)
- @supabase/ssr and @supabase/supabase-js (client libraries)
- VS Code (integrated development environment)
- GitHub (version control)
- Vercel (deployment and hosting)
- Node.js and npm (development environment)

**Hardware Requirements**

Developer Machine

- Processor: Multi-core CPU (Intel i5+, AMD Ryzen 5+, or Apple Silicon M1+)
- RAM: Minimum 8 GB (recommended 16 GB)
- Storage: 10 GB free SSD space for node_modules and build artifacts
- Display: 1920x1080 or higher resolution
- Network: 5+ Mbps internet connection for npm package downloads

Client Hardware

- Processor: Modern mobile or desktop processor (ARM or x86 from 2015+)
- RAM: Minimum 2 GB available for browser
- Storage: 100 MB free space for app cache
- Display: 320px minimum width (mobile responsive)
- Network: 4G LTE or WiFi (1+ Mbps minimum for basic browsing)
- Operating System: iOS 12+, Android 8+, or modern desktop OS

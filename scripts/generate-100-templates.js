const fs = require('fs');

// Helper to center an element horizontally
function centerEl(w, canvasW) {
    return Math.round((canvasW - w) / 2);
}

// 14 Category Collections to build 115+ meticulously aligned templates
const categoriesConfig = [
    // 1. YouTube Banners (10 templates) - 1200x675
    {
        cat: 'youtube',
        subcat: 'youtube',
        dims: [1200, 675],
        items: [
            { id: 'yt-01', name: 'Cyber Gaming & Esports Hub', bg: '#08090f', accent: '#d4ff00', subColor: '#38bdf8', tag: 'OFFICIAL ESPOORTS CHANNEL', h1: 'NEON PROTOCOL', sub: 'Daily Live Streams • Tournaments • Pro Strats' },
            { id: 'yt-02', name: 'Future Tech & Hardware Unboxing', bg: '#0f172a', accent: '#38bdf8', subColor: '#94a3b8', tag: 'IN-DEPTH TECH REVIEWS', h1: 'BYTE & SILICON', sub: 'New Episodes Every Tuesday & Friday at 6 PM EST' },
            { id: 'yt-03', name: 'Crypto & Market Alpha Channel', bg: '#0b1329', accent: '#f59e0b', subColor: '#cbd5e1', tag: 'MACRO FINANCE & CRYPTO', h1: 'THE BULL MARKET SHOW', sub: 'Smart Money Flows • Portfolio Strategies • Daily Brief' },
            { id: 'yt-04', name: 'Minimalist Architecture & Design', bg: '#18181b', accent: '#f43f5e', subColor: '#a1a1aa', tag: 'ARCHITECTURE & SPATIAL DESIGN', h1: 'MONOCHROME LIVING', sub: 'Interior Tours • Sustainable Materials • City Walks' },
            { id: 'yt-05', name: 'Heavy Metal & Synthwave Beats', bg: '#110726', accent: '#e879f9', subColor: '#c084fc', tag: 'ORIGINAL MUSIC PRODUCTION', h1: 'MIDNIGHT FREQUENCY', sub: 'Royalty-Free Beats • Mixing Tutorials • Studio Sessions' },
            { id: 'yt-06', name: 'Ultimate Fitness & Shred Coaching', bg: '#1c1917', accent: '#ff5500', subColor: '#e7e5e4', tag: 'ELITE BODY TRANSFORMATION', h1: 'IRON TEMPLE TV', sub: 'Science-Based Workouts • Nutrition Guides • Motivation' },
            { id: 'yt-07', name: 'Culinary Masterclasses & Recipes', bg: '#1c1008', accent: '#fb923c', subColor: '#fed7aa', tag: 'CHEF SECRETS & STREET FOOD', h1: 'THE ARTISAN KITCHEN', sub: 'Authentic Global Dishes Prepared From Scratch' },
            { id: 'yt-08', name: 'Global Travel & Backpacker Expeditions', bg: '#042f2e', accent: '#2dd4bf', subColor: '#99f6e4', tag: 'OFF THE BEATEN TRACK', h1: 'WANDERLUST ODYSSEY', sub: 'Exploring 70+ Countries On A Budget' },
            { id: 'yt-09', name: 'Science, Space & Futurism Channel', bg: '#050814', accent: '#818cf8', subColor: '#c7d2fe', tag: 'COSMOLOGY & DEEP SCIENCE', h1: 'THE QUANTUM HORIZON', sub: 'Astrophysics Explained Simply With 3D Visuals' },
            { id: 'yt-10', name: 'True Crime & Cold Cases Podcast', bg: '#180509', accent: '#ef4444', subColor: '#fca5a5', tag: 'INVESTIGATIVE CRIME PODCAST', h1: 'UNSOLVED IN THE SHADOWS', sub: 'Documentaries • Case Files • Forensic Breakdowns' }
        ]
    },

    // 2. YouTube Thumbnails (10 templates) - 1280x720
    {
        cat: 'youtube',
        subcat: 'thumbnail',
        dims: [1280, 720],
        items: [
            { id: 'th-01', name: '10X Growth Secret Thumbnail', bg: '#000000', accent: '#d4ff00', subColor: '#f1f5f9', tag: 'PROVEN BLUEPRINT', h1: 'HOW I GREW 10X', sub: 'Stop Wasting Time on Wrong Strategies' },
            { id: 'th-02', name: 'Top 5 Coding Mistakes Thumbnail', bg: '#090d16', accent: '#ff3366', subColor: '#38bdf8', tag: 'AVOID THESE DISASTERS', h1: 'DON\'T DO THIS IN 2026', sub: 'Beginner to Senior Developer Mistakes Exposed' },
            { id: 'th-03', name: 'Insane Hardware Setup Tour', bg: '#0a0a0c', accent: '#a855f7', subColor: '#cbd5e1', tag: 'ULTIMATE WORKSPACE', h1: '$15,000 DREAM DESK', sub: 'Custom Watercooled PC + Minimalist Audio Gear' },
            { id: 'th-04', name: 'Before vs After Body Challenge', bg: '#180800', accent: '#ff6a00', subColor: '#ffedd5', tag: '90-DAY RESULTS', h1: 'MY CRAZY SHRED', sub: 'No Supplements • Calorie Deficit Plan Revealed' },
            { id: 'th-05', name: 'Full AI App Tutorial 2026', bg: '#080e1a', accent: '#00f2fe', subColor: '#e2e8f0', tag: 'COMPLETE CRASH COURSE', h1: 'BUILD AN AI SAAS IN 1 HOUR', sub: 'Zero Code to Production Deployment Step-by-Step' },
            { id: 'th-06', name: 'Millionaire Secrets Revealed', bg: '#0f172a', accent: '#ffd700', subColor: '#f8fafc', tag: 'RAW TRUTH INTERVIEW', h1: 'HE MADE $50M IN 3 YEARS', sub: 'The Uncomfortable Reality of Building a Monopoly' },
            { id: 'th-07', name: 'Best Camera Under $1,000', bg: '#141416', accent: '#22c55e', subColor: '#cbd5e1', tag: 'HONEST GEAR REVIEW', h1: 'BETTER THAN SONY?', sub: 'Blind Autofocus & Low-Light Studio Tests' },
            { id: 'th-08', name: 'Extreme Street Food Tasting', bg: '#1a0b00', accent: '#ff9900', subColor: '#ffeedd', tag: 'MIDNIGHT FOOD CRAWL', h1: 'TOKYO STREET FEAST', sub: 'Tasting 12 Legendary Underground Ramen Bowls' },
            { id: 'th-09', name: 'Cryptocurrency Crash Prediction', bg: '#1a0005', accent: '#ff1744', subColor: '#ffebee', tag: 'URGENT MARKET UPDATE', h1: 'ARE WE DUMPING TO ZERO?', sub: 'Liquidations, Halving Cycles & On-Chain Indicators' },
            { id: 'th-10', name: 'Productivity Morning Routine', bg: '#0d131f', accent: '#06b6d4', subColor: '#e0f2fe', tag: 'DEEP WORK SYSTEM', h1: 'WAKE UP AT 5:00 AM', sub: 'How I 3X My Output Without Burnout' }
        ]
    },

    // 3. Instagram Square Posts (12 templates) - 1080x1080
    {
        cat: 'instagram',
        subcat: 'feed',
        dims: [1080, 1080],
        items: [
            { id: 'ig-01', name: 'Gourmet Artisan Burger Special', bg: '#140c06', accent: '#f97316', subColor: '#ffedd5', tag: 'WEEKEND SPECIALTY BURGER', h1: 'SMOKED BRISKET STACK', sub: 'Aged Cheddar, Crispy Shallots & Truffle Mayo' },
            { id: 'ig-02', name: 'Summer High-Street Fashion Drop', bg: '#09090b', accent: '#f43f5e', subColor: '#e4e4e7', tag: 'LIMITED EDITION COLLECTION', h1: 'THE SILK & LINEN DROP', sub: 'Effortless silhouettes for warm summer evenings' },
            { id: 'ig-03', name: 'Flash Sale 50% Off Everything', bg: '#0c0a09', accent: '#d4ff00', subColor: '#f5f5f4', tag: '48-HOUR FLASH DISCOUNT', h1: 'UP TO 50% OFF ENTIRE STORE', sub: 'Use Code FLASH50 at checkout before midnight' },
            { id: 'ig-04', name: 'Luxury Penthouse Real Estate', bg: '#0b1120', accent: '#38bdf8', subColor: '#cbd5e1', tag: 'EXCLUSIVE LISTING • SKYLINE RESIDENCE', h1: 'PANORAMIC 4-BED DUPLEX', sub: 'Private pool, concierge service & 360-degree views' },
            { id: 'ig-05', name: 'Strength & Conditioning Membership', bg: '#171717', accent: '#ef4444', subColor: '#fafafa', tag: 'ANNUAL MEMBERSHIP PROMO', h1: 'TRANSFORM YOUR PHYSIQUE', sub: 'Unlimited classes, 1-on-1 coaching & recovery suite' },
            { id: 'ig-06', name: 'Holistic Spa & Body Sanctuary', bg: '#0f172a', accent: '#a78bfa', subColor: '#ddd6fe', tag: 'RESTORE & REJUVENATE', h1: 'AROMATHERAPY RETREAT', sub: 'Hot stone massages, infrared sauna & organic teas' },
            { id: 'ig-07', name: 'Modern Digital Agency Pitch', bg: '#030712', accent: '#60a5fa', subColor: '#93c5fd', tag: 'PERFORMANCE MARKETING', h1: 'SCALE YOUR REVENUE 3X', sub: 'High-converting ad funnels & brand design sprints' },
            { id: 'ig-08', name: 'Live Tech Webinar & Workshop', bg: '#090d16', accent: '#00f5a0', subColor: '#e2e8f0', tag: 'FREE INTERACTIVE MASTERCLASS', h1: 'MASTERING SYSTEM DESIGN', sub: 'Building resilient microservices for 1M+ users' },
            { id: 'ig-09', name: 'Artisan Coffee Roasters Promo', bg: '#1c130d', accent: '#eab308', subColor: '#fef08a', tag: 'FRESHLY ROASTED SINGLE ORIGIN', h1: 'ETHIOPIAN YIRGACHEFFE', sub: 'Floral jasmine notes with bright citrus finish' },
            { id: 'ig-10', name: 'Luxury Diamond Jewelry Showcase', bg: '#050505', accent: '#ffd700', subColor: '#ffffff', tag: 'HANDCRAFTED HERITAGE PIECES', h1: 'ETERNAL DIAMOND SOLITAIRE', sub: 'Ethically sourced stones set in 18k solid gold' },
            { id: 'ig-11', name: 'Cyber Monday Early Access Drop', bg: '#0d021f', accent: '#d946ef', subColor: '#f5d0fe', tag: 'VIP EXCLUSIVE ACCESS', h1: 'CYBER WEEK IS HERE', sub: 'Early doorbuster savings on all flagship electronics' },
            { id: 'ig-12', name: 'Creative Typography Mindset Quote', bg: '#0f172a', accent: '#34d399', subColor: '#f1f5f9', tag: 'DAILY THOUGHT ARCHIVE', h1: 'DISCIPLINE OUTWEIGHS TALENT', sub: 'Consistency every single day creates inevitable mastery' }
        ]
    },

    // 4. Instagram Stories & Reels (10 templates) - 1080x1920
    {
        cat: 'instagram',
        subcat: 'story',
        dims: [1080, 1920],
        items: [
            { id: 'st-01', name: 'Story Flash Deal 24 Hours Only', bg: '#0a0a0f', accent: '#ff0055', subColor: '#f8fafc', tag: 'ONLY 24 HOURS REMAINING', h1: 'MIDNIGHT FLASH SALE', sub: 'Tap Link in Bio for 60% Off Sitewide Before Sold Out' },
            { id: 'st-02', name: 'New Podcast Episode Announcement', bg: '#090d1a', accent: '#00e5ff', subColor: '#cbd5e1', tag: 'NOW STREAMING EVERYWHERE', h1: 'EPISODE 48 IS OUT', sub: 'Navigating Venture Capital with Founder Alex Rivera' },
            { id: 'st-03', name: 'Weekly Fitness Challenge Tracker', bg: '#121212', accent: '#76ff03', subColor: '#f5f5f5', tag: '7-DAY CORE CHALLENGE', h1: 'SWEAT & PERSIST', sub: '15 Minutes Every Morning • Drop Your Time in Comments' },
            { id: 'st-04', name: 'New Blog Post & Case Study Alert', bg: '#0f172a', accent: '#fbbf24', subColor: '#e2e8f0', tag: 'FRESH INSIGHT ON THE BLOG', h1: 'HOW WE CUT CLOUD COSTS 45%', sub: 'Detailed infrastructure audit and Kubernetes teardown' },
            { id: 'st-05', name: 'Live AMA Ask Me Anything Session', bg: '#1e0524', accent: '#f43f5e', subColor: '#fce7f3', tag: 'GOING LIVE THIS THURSDAY', h1: 'ASK ME ANYTHING', sub: 'Ask questions on freelance pricing and portfolio building' },
            { id: 'st-06', name: 'Luxury Unboxing & Lookbook', bg: '#050505', accent: '#e2e8f0', subColor: '#94a3b8', tag: 'THE ARCHIVAL SERIES', h1: 'AUTUMN COAT LOOKBOOK', sub: 'Tailored oversized cashmere overcoats styled 4 ways' },
            { id: 'st-07', name: 'Weekend Brunch Table Booking', bg: '#1c1208', accent: '#f97316', subColor: '#ffedd5', tag: 'WEEKEND TABLE RESERVATIONS', h1: 'BOTTOMLESS MIMOSA BRUNCH', sub: 'Avocado Tartines, Brioche French Toast & Live DJ' },
            { id: 'st-08', name: 'Concert Tickets Early Bird Drop', bg: '#030014', accent: '#c084fc', subColor: '#e9d5ff', tag: 'WORLD TOUR 2026', h1: 'GENERAL ONSALE OPENS NOW', sub: 'Secure VIP Pit Tickets Before Tier 1 Sells Out' },
            { id: 'st-09', name: 'Motivational Monday Story', bg: '#02120e', accent: '#10b981', subColor: '#a7f3d0', tag: 'START YOUR WEEK FOCUSED', h1: 'YOUR FUTURE NEEDS YOU NOW', sub: 'Small daily steps compound into life-changing leaps' },
            { id: 'st-10', name: 'Client Feedback & 5-Star Review', bg: '#0f172a', accent: '#ffd700', subColor: '#ffffff', tag: 'VERIFIED CUSTOMER REVIEW', h1: '★ ★ ★ ★ ★ "GAME CHANGER"', sub: '"The cleanest software we have ever implemented at scale."' }
        ]
    },

    // 5. Corporate, Startup & Business Posters (10 templates) - 800x1000
    {
        cat: 'business',
        subcat: 'business',
        dims: [800, 1000],
        items: [
            { id: 'biz-01', name: 'Corporate Growth & Consulting', bg: '#090d16', accent: '#3b82f6', subColor: '#93c5fd', tag: 'STRATEGIC MANAGEMENT ADVISORY', h1: 'ACCELERATE ENTERPRISE GROWTH', sub: 'We help Fortune 500 leadership navigate digital transformation' },
            { id: 'biz-02', name: 'Cloud Infrastructure & DevOps', bg: '#060a12', accent: '#00f5a0', subColor: '#94a3b8', tag: 'ENTERPRISE SERVERLESS COMPUTING', h1: 'HYPERSCALE CLOUD PLATFORM', sub: '99.999% uptime with automated zero-downtime CI/CD pipelines' },
            { id: 'biz-03', name: 'Legal & Corporate Attorneys', bg: '#121217', accent: '#e2b36f', subColor: '#d4d4d8', tag: 'COMMERCIAL LITIGATION & M&A', h1: 'PROTECTING CORPORATE CAPITAL', sub: 'Over 30 years of premier legal counsel and risk management' },
            { id: 'biz-04', name: 'Accounting & Tax Advisory Firm', bg: '#0c1322', accent: '#38bdf8', subColor: '#cbd5e1', tag: 'CERTIFIED AUDITORS & ADVISORS', h1: 'MAXIMIZE WEALTH & COMPLIANCE', sub: 'Strategic tax restructuring, payroll and annual financial audits' },
            { id: 'biz-05', name: 'Executive Search & Recruitment', bg: '#17171a', accent: '#ff4d4d', subColor: '#e4e4e7', tag: 'GLOBAL TALENT ACQUISITION', h1: 'HIRING WORLD-CLASS LEADERS', sub: 'Connecting premier tech ventures with proven C-Suite executives' },
            { id: 'biz-06', name: 'Co-Working & Private Offices', bg: '#0d1117', accent: '#f59e0b', subColor: '#cbd5e1', tag: 'FLEXIBLE WORKSPACE SUITES', h1: 'WHERE FOUNDERS BUILD THE FUTURE', sub: 'High-speed fiber, meeting rooms, podcast booths & event spaces' },
            { id: 'biz-07', name: 'Cybersecurity Threat Intelligence', bg: '#050811', accent: '#00ffc4', subColor: '#818cf8', tag: 'ZERO-TRUST SECURITY ARCHITECTURE', h1: 'SHIELD YOUR MISSION-CRITICAL DATA', sub: 'Proactive penetration testing, ransomware defense and SOC monitoring' },
            { id: 'biz-08', name: 'Venture Capital & Seed Funding', bg: '#140c1c', accent: '#c084fc', subColor: '#e9d5ff', tag: 'SEED & SERIES-A PARTNERS', h1: 'BACKING VISIONARY FOUNDERS', sub: '$50M dedicated fund for AI, climate tech and developer tooling' },
            { id: 'biz-09', name: 'Logistics & Global Freight Network', bg: '#0b162c', accent: '#38bdf8', subColor: '#bfdbfe', tag: 'AIR, OCEAN & RAIL TRANSPORT', h1: 'SEAMLESS SUPPLY CHAIN CARGO', sub: 'End-to-end customs clearance with real-time IoT tracking' },
            { id: 'biz-10', name: 'Renewable Clean Energy Systems', bg: '#051914', accent: '#10b981', subColor: '#6ee7b7', tag: 'COMMERCIAL SOLAR & BATTERY', h1: 'ZERO-EMISSIONS POWER GRIDS', sub: 'Cut energy overhead by 60% with commercial micro-grid setups' }
        ]
    },

    // 6. Restaurant, Food & Cafe Posters (8 templates) - 800x1000
    {
        cat: 'food',
        subcat: 'restaurant',
        dims: [800, 1000],
        items: [
            { id: 'fd-01', name: 'Wood-Fired Neapolitan Pizza', bg: '#170903', accent: '#ff5500', subColor: '#fed7aa', tag: 'AUTHENTIC ITALIAN PIZZERIA', h1: 'NATURALLY FERMENTED PIZZA', sub: 'San Marzano tomatoes, buffalo mozzarella & 48h sourdough crust' },
            { id: 'fd-02', name: 'Artisan Sourdough Bakery Cafe', bg: '#1c130d', accent: '#eab308', subColor: '#fef08a', tag: 'BAKED FRESH DAILY AT 5:00 AM', h1: 'CRUSTY CRUNCHY ARTISAN LOAVES', sub: 'Stoneground wild grains, flaky croissants & seasonal fruit tarts' },
            { id: 'fd-03', name: 'Tokyo Sushi & Omakase Counter', bg: '#08080a', accent: '#ef4444', subColor: '#e4e4e7', tag: 'DAILY TOYOSU FISH MARKET SOURCING', h1: '16-COURSE OMAKASE EXPERIENCE', sub: 'Edomae sushi crafted by Master Chef Kenji Sato' },
            { id: 'fd-04', name: 'Prime Dry-Aged Steakhouse', bg: '#180707', accent: '#ff3366', subColor: '#fecdd3', tag: '45-DAY DRY AGED PRIME CUTS', h1: 'THE TOMAHAWK SPECIAL', sub: 'Charcoal grilled over hickory wood with bone marrow butter' },
            { id: 'fd-05', name: 'Organic Salad & Smoothie Bar', bg: '#051912', accent: '#22c55e', subColor: '#bbf7d0', tag: '100% FARM TO BOWL VEGAN', h1: 'CLEAN FUEL NOURISHMENT', sub: 'Cold-pressed superfood juices, grain bowls & acai bowls' },
            { id: 'fd-06', name: 'Craft Brewery & Taproom Night', bg: '#130c05', accent: '#f59e0b', subColor: '#fde68a', tag: '24 ROTATING TAPS ON POUR', h1: 'HAZY IPAS & SOUR ALES', sub: 'Live acoustic music, smoked BBQ brisket and trivia night' },
            { id: 'fd-07', name: 'Authentic Mexican Street Tacos', bg: '#170802', accent: '#ea580c', subColor: '#fed7aa', tag: 'HOMEMADE CORN TORTILLAS', h1: 'BIRRIA & AL PASTOR TACOS', sub: 'Slow-braised beef with rich dipping consomme & cilantro lime' },
            { id: 'fd-08', name: 'Dessert Parlor & Belgian Waffles', bg: '#1a0d18', accent: '#ec4899', subColor: '#fbcfe8', tag: 'HANDMADE GELATO & SWEETS', h1: 'WARM BELGIAN WAFFLE STACKS', sub: 'Nutella drizzle, caramelized bananas & Madagascar vanilla cream' }
        ]
    },

    // 7. Fitness, Gym, Sports & Wellness (8 templates) - 800x1000
    {
        cat: 'fitness',
        subcat: 'gym',
        dims: [800, 1000],
        items: [
            { id: 'fit-01', name: '30-Day Total Body Shred Bootcamp', bg: '#0f0f12', accent: '#d4ff00', subColor: '#f4f4f5', tag: 'HIGH INTENSITY INTERVAL TRAINING', h1: 'MELT FAT & BUILD LEAN MUSCLE', sub: 'Daily 45-minute metabolic conditioning with heart-rate tracking' },
            { id: 'fit-02', name: 'Olympic Weightlifting & Powerlifting', bg: '#121214', accent: '#ef4444', subColor: '#e4e4e7', tag: 'BARBELL CLUB & COACHING', h1: 'SQUAT • BENCH • DEADLIFT', sub: 'Form optimization and linear progression programs for all levels' },
            { id: 'fit-03', name: 'Yoga Sanctuary & Sound Meditation', bg: '#091316', accent: '#2dd4bf', subColor: '#ccfbf1', tag: 'VINYASA, YIN & BREATHWORK', h1: 'FIND STILLNESS IN CHAOS', sub: 'Heated studio, crystal sound bath journeys & weekend workshops' },
            { id: 'fit-04', name: 'Boxing & Kickboxing Fight Club', bg: '#140808', accent: '#ff2a2a', subColor: '#fee2e2', tag: 'CHAMPIONSHIP CONDITIONING', h1: 'FIGHT-READY FITNESS', sub: 'Heavy bag rounds, speed work, footwork drills & sparring' },
            { id: 'fit-05', name: 'Reformer Pilates Studio Promo', bg: '#141118', accent: '#e879f9', subColor: '#fae8ff', tag: 'CORE CENTRIC RESISTANCE', h1: 'LENGTHEN, STRENGTHEN & ALIGN', sub: 'State-of-the-art Allegro 2 reformers with expert instructors' },
            { id: 'fit-06', name: 'City Marathon & 10K Fun Run', bg: '#08121d', accent: '#38bdf8', subColor: '#bae6fd', tag: 'ANNUAL CHARITY RUN 2026', h1: 'RUN FOR THE GLORY', sub: 'Timed bibs, finisher medals, hydration stations & live music' },
            { id: 'fit-07', name: 'VIP 1-on-1 Personal Training', bg: '#0c0f17', accent: '#fbbf24', subColor: '#fef3c7', tag: 'BESPOKE FITNESS ARCHITECTURE', h1: 'INDIVIDUALIZED COACHING', sub: 'Custom meal plans, bi-weekly DEXA scans & continuous accountability' },
            { id: 'fit-08', name: 'Brazilian Jiu-Jitsu & Self Defense', bg: '#080808', accent: '#a3e635', subColor: '#ecfccb', tag: 'GI & NO-GI MARTIAL ARTS', h1: 'MASTER THE GENTLE ART', sub: 'World champion black belt instructors for adults and kids' }
        ]
    },

    // 8. Real Estate & Property Posters (8 templates) - 800x1000
    {
        cat: 'business',
        subcat: 'real-estate',
        dims: [800, 1000],
        items: [
            { id: 're-01', name: 'Modern Minimalist Villa For Sale', bg: '#090e17', accent: '#38bdf8', subColor: '#cbd5e1', tag: 'ARCHITECTURAL RESIDENCE • BEVERLY HILLS', h1: 'CANTILEVER GLASS VILLA', sub: '5 Beds, 7 Baths, Infinity Pool, 8-Car Garage & Smart Home' },
            { id: 're-02', name: 'Luxury High-Rise Penthouse Living', bg: '#08080a', accent: '#e2b36f', subColor: '#e4e4e7', tag: 'TRIBECA SKYLINE PENTHOUSE', h1: 'ABOVE THE CLOUDS', sub: 'Private rooftop terrace, private elevator foyer & floor-to-ceiling glass' },
            { id: 're-03', name: 'Suburban Family Home Open House', bg: '#0d131a', accent: '#10b981', subColor: '#d1fae5', tag: 'THIS SUNDAY 2:00 PM - 5:00 PM', h1: 'OPEN HOUSE INSPECTION', sub: 'Turnkey 4-bedroom home near top rated schools & parks' },
            { id: 're-04', name: 'Prime Commercial Office Space', bg: '#0f172a', accent: '#f59e0b', subColor: '#fef3c7', tag: 'FINANCIAL DISTRICT LEASING', h1: 'GRADE-A CORPORATE TOWER', sub: '25,000 sq ft contiguous floorplates with LEED Gold certification' },
            { id: 're-05', name: 'Beachfront Tropical Vacation Home', bg: '#03141a', accent: '#06b6d4', subColor: '#cffafe', tag: 'TURKS & CAICOS DIRECT SHORE', h1: 'PRIVATE OCEANFRONT RETREAT', sub: 'Step directly onto turquoise waters and powder white sand' },
            { id: 're-06', name: 'Industrial Loft & Creative Studio', bg: '#18181b', accent: '#ef4444', subColor: '#f4f4f5', tag: 'DOWNTOWN ARTS DISTRICT', h1: 'AUTHENTIC BRICK & BEAM LOFT', sub: '14-foot ceilings, oversized factory casement windows & polished concrete' },
            { id: 're-07', name: 'Property Management & Rent Guarantee', bg: '#081224', accent: '#60a5fa', subColor: '#bfdbfe', tag: 'FOR PROPERTY INVESTORS', h1: 'STRESS-FREE RENTAL YIELDS', sub: 'Full tenant screening, maintenance handling & guaranteed monthly payout' },
            { id: 're-08', name: 'Pre-Construction VIP Condo Launch', bg: '#11071c', accent: '#d946ef', subColor: '#fae8ff', tag: 'PLATINUM VIP BROKER EVENT', h1: 'PRE-CONSTRUCTION CONDOS', sub: 'Initial pricing from $499K with extended 10% deposit structure' }
        ]
    },

    // 9. Education, Courses & Webinars (8 templates) - 800x1000
    {
        cat: 'business',
        subcat: 'education',
        dims: [800, 1000],
        items: [
            { id: 'edu-01', name: 'Full-Stack Software Engineering', bg: '#080d1a', accent: '#00f5a0', subColor: '#93c5fd', tag: '12-WEEK IMMERSIVE BOOTCAMP', h1: 'BECOME A SENIOR DEVELOPER', sub: 'React, Node, TypeScript, Docker, PostgreSQL & System Architecture' },
            { id: 'edu-02', name: 'AI & Large Language Models Masterclass', bg: '#0d071c', accent: '#c084fc', subColor: '#e9d5ff', tag: 'ENTERPRISE GENERATIVE AI', h1: 'BUILDING PRODUCTION LLM APPS', sub: 'RAG pipelines, vector embeddings, fine-tuning & agentic orchestration' },
            { id: 'edu-03', name: 'IELTS & Global English Mastery', bg: '#0f172a', accent: '#38bdf8', subColor: '#e2e8f0', tag: 'TARGET BAND 8.0+ GUARANTEE', h1: 'IELTS EXAM PREPARATION', sub: 'Mock speaking exams, essay grading & high-yield grammar modules' },
            { id: 'edu-04', name: 'University Admissions & Scholarship', bg: '#140c06', accent: '#f59e0b', subColor: '#fef3c7', tag: 'IVY LEAGUE & TOP 50 COUNSELING', h1: 'CRACK YOUR ADMISSION ESSAY', sub: 'Former admissions officers mentor your portfolio & scholarship forms' },
            { id: 'edu-05', name: 'Kids Coding & Robotics Academy', bg: '#041d1a', accent: '#2dd4bf', subColor: '#ccfbf1', tag: 'AGES 8 TO 16 YEARS OLD', h1: 'ROBOTICS & GAME DESIGN', sub: 'Build motorized robots and program custom 3D games in Python' },
            { id: 'edu-06', name: 'Professional UI/UX Product Design', bg: '#141416', accent: '#ff3366', subColor: '#f4f4f5', tag: 'DESIGN SYSTEM ACCELERATOR', h1: 'MASTER FIGMA TO CODE', sub: 'Typography, auto-layout, design tokens & design sprints' },
            { id: 'edu-07', name: 'Data Science & Machine Learning Career', bg: '#090e18', accent: '#3b82f6', subColor: '#cbd5e1', tag: 'HANDS-ON APPLIED DATA SCIENCE', h1: 'FROM DATA TO INSIGHTS', sub: 'Pandas, Scikit-learn, Neural Networks, PyTorch & Tableau Dashboards' },
            { id: 'edu-08', name: 'High-School STEM Olympiad Prep', bg: '#081711', accent: '#a3e635', subColor: '#dcfce7', tag: 'MATH & PHYSICS COMPETITION', h1: 'NATIONAL MEDAL INTENSIVE', sub: 'Advanced calculus, combinatorics & mechanics problem solving' }
        ]
    },

    // 10. Beauty, Fashion & Salon Posters (6 templates) - 800x1000
    {
        cat: 'fashion',
        subcat: 'fashion',
        dims: [800, 1000],
        items: [
            { id: 'fsh-01', name: 'Autumn Minimalist Haute Couture', bg: '#0a0a0c', accent: '#f43f5e', subColor: '#e4e4e7', tag: 'PARIS FASHION WEEK EDIT', h1: 'THE SCULPTURAL JACKET', sub: 'Architectural cuts, double-faced wool & brushed silver closures' },
            { id: 'fsh-02', name: 'Bridal Makeup & Hair Couture', bg: '#1c1016', accent: '#fda4af', subColor: '#ffe4e6', tag: 'BRIDAL BEAUTY STUDIO', h1: 'TIMELESS BRIDAL GLOW', sub: 'Airbrush makeup, bespoke hair styling & luxury bridal party packages' },
            { id: 'fsh-03', name: 'Organic Clinical Dermatology Clinic', bg: '#081418', accent: '#38bdf8', subColor: '#e0f2fe', tag: 'SCIENCE-BACKED SKIN THERAPY', h1: 'HYDRA-FACIAL & LASER RESURFACING', sub: 'Target hyperpigmentation, collagen loss and acne scarring' },
            { id: 'fsh-04', name: 'Artisan Perfume & Fragrance House', bg: '#120b17', accent: '#e879f9', subColor: '#fae8ff', tag: 'NICHE FRAGRANCE CREATION', h1: 'SMOKED OUD & AMBER NOIR', sub: 'Concentrated pure parfum extracts aged in French oak barrels' },
            { id: 'fsh-05', name: 'Traditional Gentlemen\'s Barbershop', bg: '#141414', accent: '#eab308', subColor: '#fef08a', tag: 'CLASSIC CUTS & HOT TOWEL SHAVES', h1: 'THE GENTLEMAN\'S LOUNGE', sub: 'Straight razor hot lather shave, beard sculpting & whiskey on arrival' },
            { id: 'fsh-06', name: 'Lash Extensions & Microblading', bg: '#1a0b12', accent: '#fb7185', subColor: '#ffe4e6', tag: 'PREMIER LASH & BROW ATELIER', h1: 'VOLUME LASHES & POWDER BROWS', sub: 'Custom mapping suited to your face structure for wake-up ready glamour' }
        ]
    },

    // 11. Medical, Healthcare & Dental (6 templates) - 800x1000
    {
        cat: 'business',
        subcat: 'healthcare',
        dims: [800, 1000],
        items: [
            { id: 'med-01', name: 'Cosmetic Dentistry & Smile Design', bg: '#071524', accent: '#38bdf8', subColor: '#e0f2fe', tag: 'DIGITAL SMILE ARCHITECTURE', h1: 'PORCELAIN VENEERS & WHITENING', sub: 'Transform your confidence with painless laser dentistry' },
            { id: 'med-02', name: 'Multispeciality Medical Hospital', bg: '#04191c', accent: '#2dd4bf', subColor: '#ccfbf1', tag: '24/7 EMERGENCY & TRAUMA CARE', h1: 'WORLD-CLASS PATIENT CARE', sub: 'Cardiology, Orthopedics, Oncology & Robotic Minimally Invasive Surgery' },
            { id: 'med-03', name: 'Eye Clinic & Robotic Lasik Surgery', bg: '#080d1a', accent: '#60a5fa', subColor: '#dbeafe', tag: 'BLADE-FREE VISION CORRECTION', h1: 'SAY GOODBYE TO GLASSES', sub: '10-minute outpatient procedure with 20/20 vision recovery' },
            { id: 'med-04', name: 'Pediatric Care & Child Wellness', bg: '#081711', accent: '#4ade80', subColor: '#dcfce7', tag: 'CARING PEDIATRIC SPECIALISTS', h1: 'GENTLE CARE FOR YOUR LITTLE ONES', sub: 'Newborn checkups, vaccinations, developmental milestones & nutrition' },
            { id: 'med-05', name: 'Mental Health & Psychology Center', bg: '#120f1c', accent: '#c084fc', subColor: '#fae8ff', tag: 'LICENSED THERAPY & PSYCHIATRY', h1: 'COMPASSIONATE MENTAL HEALTH', sub: 'Confidential 1-on-1 sessions for anxiety, depression, burnout & relationships' },
            { id: 'med-06', name: 'Physical Therapy & Sports Rehab', bg: '#141416', accent: '#f59e0b', subColor: '#fef3c7', tag: 'ORTHOPEDIC REHABILITATION', h1: 'RECOVER FASTER • MOVE BETTER', sub: 'Dry needling, joint mobilization, spine alignment and sports return' }
        ]
    },

    // 12. Music, Festivals & Nightlife (6 templates) - 800x1000
    {
        cat: 'events',
        subcat: 'events',
        dims: [800, 1000],
        items: [
            { id: 'ev-01', name: 'Electronic Music Festival 2026', bg: '#030014', accent: '#d946ef', subColor: '#f5d0fe', tag: '3 DAYS • 4 STAGES • 100+ DJS', h1: 'CYBER SONIC FESTIVAL', sub: 'Massive laser show, Funktion-One sound & international headliners' },
            { id: 'ev-02', name: 'Live Jazz & Wine Evening', bg: '#170c06', accent: '#f59e0b', subColor: '#fde68a', tag: 'SMOKY JAZZ & VINTAGE BOURBON', h1: 'THE BLUE NOTE QUARTET', sub: 'Live double bass, trumpet improvisations and paired cheese boards' },
            { id: 'ev-03', name: 'Indie Rock & Acoustic Rooftop', bg: '#0e121a', accent: '#38bdf8', subColor: '#bae6fd', tag: 'SUNSET ROOFTOP SESSIONS', h1: 'THE SUMMER ECHOES TOUR', sub: 'Acoustic ballads under the stars with craft cocktails and fire pits' },
            { id: 'ev-04', name: 'Standup Comedy & Open Mic Night', bg: '#140808', accent: '#ef4444', subColor: '#fee2e2', tag: 'ADULT COMEDY SPECIAL', h1: 'LAUGHTER UNFILTERED', sub: 'Featuring national touring comedians from Netflix & Comedy Central' },
            { id: 'ev-05', name: 'New Year Eve Grand Masquerade', bg: '#0c0714', accent: '#ffd700', subColor: '#ffffff', tag: 'DECEMBER 31ST • BLACK TIE', h1: 'THE MIDNIGHT BALL', sub: 'Champagne toast at midnight, 5-course gala dinner and live orchestra' },
            { id: 'ev-06', name: 'Art Gallery Opening & Vernissage', bg: '#0a0a0c', accent: '#e2e8f0', subColor: '#94a3b8', tag: 'CONTEMPORARY SCULPTURE EXHIBIT', h1: 'FORMS OF SILENCE', sub: 'Opening night reception with participating international artists' }
        ]
    },

    // 13. Travel, Tourism & Hospitality (5 templates) - 800x1000
    {
        cat: 'business',
        subcat: 'travel',
        dims: [800, 1000],
        items: [
            { id: 'tr-01', name: 'Bali Tropical Luxury Resort Tour', bg: '#031411', accent: '#10b981', subColor: '#6ee7b7', tag: 'ALL-INCLUSIVE BALI ESCAPE', h1: '7 NIGHTS IN PARADISE', sub: 'Private jungle villa, daily floating breakfasts & airport helicopter transfer' },
            { id: 'tr-02', name: 'Swiss Alps Ski & Snowboard Package', bg: '#0a101d', accent: '#38bdf8', subColor: '#e0f2fe', tag: 'ZERMATT & MATTERHORN SLOPES', h1: 'ALPINE WINTER EXPEDITION', sub: 'First-tracks ski pass, luxury ski-in chalet & thermal hot spring access' },
            { id: 'tr-03', name: 'African Safari & Wildlife Tour', bg: '#1c1006', accent: '#f59e0b', subColor: '#fed7aa', tag: 'SERENGETI GREAT MIGRATION', h1: 'THE BIG FIVE SAFARI', sub: 'Open-top 4x4 game drives, luxury glamping tents & Maasai guided walks' },
            { id: 'tr-04', name: 'Northern Lights Arctic Adventure', bg: '#020e17', accent: '#00f5d4', subColor: '#bbf7d0', tag: 'LAPLAND AURORA BOREALIS', h1: 'SLEEP UNDER THE AURORA', sub: 'Glass ceiling igloos, husky dog sledding & snowmobile expeditions' },
            { id: 'tr-05', name: 'Mediterranean Yacht Island Hop', bg: '#041624', accent: '#0284c7', subColor: '#bae6fd', tag: 'GREEK ISLANDS CHARTER', h1: 'SANTORINI & MYKONOS CRUISE', sub: 'Private catamaran, secluded swimming coves & cliffside sunset dinners' }
        ]
    },

    // 14. Flash Sales, Ecommerce & Retail (6 templates) - 1080x1080
    {
        cat: 'sale',
        subcat: 'sale',
        dims: [1080, 1080],
        items: [
            { id: 'sl-01', name: 'Black Friday Super Doorbuster', bg: '#050505', accent: '#ff0033', subColor: '#f5f5f5', tag: 'ANNUAL SHOPPING EXTRAVAGANZA', h1: 'BLACK FRIDAY BLOWOUT', sub: 'Massive markdowns across all categories. Doors open 6:00 AM.' },
            { id: 'sl-02', name: 'Mega Mid-Season Warehouse Clearance', bg: '#0a0d14', accent: '#d4ff00', subColor: '#cbd5e1', tag: 'CLEARING OLD INVENTORY', h1: 'UP TO 70% CLEARANCE', sub: 'Everything must go. Over 5,000 items discounted to bare minimums.' },
            { id: 'sl-03', name: 'Buy One Get One Free Weekend', bg: '#140c06', accent: '#f97316', subColor: '#ffedd5', tag: 'THIS SATURDAY & SUNDAY ONLY', h1: 'BUY 1 GET 1 FREE', sub: 'Mix and match any two items and the lower priced one is on us' },
            { id: 'sl-04', name: 'New Tech Gadget Launch Offer', bg: '#080812', accent: '#818cf8', subColor: '#c7d2fe', tag: 'PRE-ORDER INCENTIVE', h1: 'THE NEXT GEN EARBUDS', sub: 'Pre-order today and receive a complimentary wireless charging pad' },
            { id: 'sl-05', name: 'Free Worldwide Shipping Weekend', bg: '#081711', accent: '#10b981', subColor: '#d1fae5', tag: 'NO MINIMUM CART VALUE', h1: 'FREE GLOBAL EXPRESS SHIPPING', sub: 'We cover all duties, taxes and DHL express shipping this weekend' },
            { id: 'sl-06', name: 'VIP Exclusive Loyalty Member Night', bg: '#120517', accent: '#d946ef', subColor: '#fae8ff', tag: 'EXCLUSIVE TO GOLD & PLATINUM', h1: 'PRIVATE REWARDS NIGHT', sub: 'Triple points on every purchase, free gift bag & champagne reception' }
        ]
    }
];

// Mathematical element layout builder with flawless alignment
function buildAlignedTemplate(item, W, H, cat, subcat) {
    const isSquare = (W === H);
    const isStory = (H > W * 1.5);
    const isBanner = (W > H * 1.5);

    // Padding & Content Width
    let padX = Math.round(W * 0.08);
    let contentW = W - padX * 2;
    let elements = [];

    // Base background shape
    elements.push({
        type: 'shape',
        shape: 'rectangle',
        x: 0,
        y: 0,
        width: W,
        height: H,
        backgroundColor: item.bg,
        borderColor: 'transparent',
        borderWidth: 0
    });

    // Decorative geometric background card / accent shapes
    if (isBanner) {
        // Landscape YouTube banner / thumbnail layout
        const circleSize = Math.round(H * 0.65);
        const circleX = W - circleSize - Math.round(W * 0.05);
        const circleY = Math.round((H - circleSize) / 2);

        // Accent circle on right side
        elements.push({
            type: 'shape',
            shape: 'circle',
            x: circleX,
            y: circleY,
            width: circleSize,
            height: circleSize,
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderColor: item.accent,
            borderWidth: 2
        });

        // Left-aligned Content with safe spacing from right accent
        const startX = Math.round(W * 0.08);
        const textW = circleX - startX - 30;

        // Kicker / Category Badge
        elements.push({
            type: 'text',
            text: item.tag,
            fontSize: Math.round(H * 0.035),
            fontWeight: '800',
            fontFamily: 'JetBrains Mono',
            color: item.accent,
            textAlign: 'left',
            x: startX,
            y: Math.round(H * 0.22),
            width: textW,
            height: Math.round(H * 0.06)
        });

        // Main Headline
        elements.push({
            type: 'text',
            text: item.h1,
            fontSize: Math.round(H * 0.095),
            fontWeight: '900',
            fontFamily: 'Montserrat',
            color: '#ffffff',
            textAlign: 'left',
            x: startX,
            y: Math.round(H * 0.32),
            width: textW,
            height: Math.round(H * 0.14)
        });

        // Subtitle / Tagline
        elements.push({
            type: 'text',
            text: item.sub,
            fontSize: Math.round(H * 0.045),
            fontWeight: '600',
            fontFamily: 'Inter',
            color: item.subColor,
            textAlign: 'left',
            x: startX,
            y: Math.round(H * 0.48),
            width: textW,
            height: Math.round(H * 0.08)
        });

        // Bottom Contact / Social Bar
        elements.push({
            type: 'text',
            text: '🌐 {{WEBSITE}}  •  📞 {{PHONE}}  •  {{BUSINESS_NAME}}',
            fontSize: Math.round(H * 0.032),
            fontWeight: '700',
            fontFamily: 'JetBrains Mono',
            color: '#ffffff',
            textAlign: 'left',
            x: startX,
            y: Math.round(H * 0.68),
            width: textW,
            height: Math.round(H * 0.06)
        });

    } else if (isStory) {
        // Vertical Story / Reel Layout (1080x1920)
        // Top Brand Header
        elements.push({
            type: 'text',
            text: '✦ {{BUSINESS_NAME}} ✦',
            fontSize: 28,
            fontWeight: '800',
            fontFamily: 'JetBrains Mono',
            color: item.accent,
            textAlign: 'center',
            x: centerEl(800, W),
            y: 180,
            width: 800,
            height: 40
        });

        // Decorative Card Frame
        elements.push({
            type: 'shape',
            shape: 'rounded-rect',
            x: centerEl(920, W),
            y: 320,
            width: 920,
            height: 1100,
            backgroundColor: 'rgba(255, 255, 255, 0.03)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 2,
            borderRadius: 28
        });

        // Tagline Pill
        elements.push({
            type: 'text',
            text: item.tag,
            fontSize: 24,
            fontWeight: '800',
            fontFamily: 'JetBrains Mono',
            color: item.accent,
            textAlign: 'center',
            x: centerEl(840, W),
            y: 420,
            width: 840,
            height: 50
        });

        // Huge Centered Story Headline
        elements.push({
            type: 'text',
            text: item.h1,
            fontSize: 68,
            fontWeight: '900',
            fontFamily: 'Montserrat',
            color: '#ffffff',
            textAlign: 'center',
            x: centerEl(840, W),
            y: 530,
            width: 840,
            height: 160
        });

        // Supporting Subtext
        elements.push({
            type: 'text',
            text: item.sub,
            fontSize: 32,
            fontWeight: '600',
            fontFamily: 'Inter',
            color: item.subColor,
            textAlign: 'center',
            x: centerEl(800, W),
            y: 740,
            width: 800,
            height: 100
        });

        // Swipe up pill / Call to Action
        elements.push({
            type: 'shape',
            shape: 'rounded-rect',
            x: centerEl(480, W),
            y: 1120,
            width: 480,
            height: 74,
            backgroundColor: item.accent,
            borderColor: 'transparent',
            borderWidth: 0,
            borderRadius: 37
        });

        elements.push({
            type: 'text',
            text: 'TAP TO EXPLORE NOW →',
            fontSize: 22,
            fontWeight: '900',
            fontFamily: 'Montserrat',
            color: '#000000',
            textAlign: 'center',
            x: centerEl(480, W),
            y: 1135,
            width: 480,
            height: 44
        });

        // Bottom Footer
        elements.push({
            type: 'text',
            text: '{{WEBSITE}}  |  {{PHONE}}',
            fontSize: 22,
            fontWeight: '700',
            fontFamily: 'JetBrains Mono',
            color: 'rgba(255, 255, 255, 0.7)',
            textAlign: 'center',
            x: centerEl(800, W),
            y: 1720,
            width: 800,
            height: 40
        });

    } else if (isSquare) {
        // 1:1 Square Feed Layout (1080x1080)
        // Centralized balanced layout
        // Subtle background grid box
        elements.push({
            type: 'shape',
            shape: 'rounded-rect',
            x: centerEl(960, W),
            y: centerEl(960, H),
            width: 960,
            height: 960,
            backgroundColor: 'transparent',
            borderColor: 'rgba(255, 255, 255, 0.08)',
            borderWidth: 2,
            borderRadius: 24
        });

        // Category Tag
        elements.push({
            type: 'text',
            text: `★ ${item.tag} ★`,
            fontSize: 20,
            fontWeight: '800',
            fontFamily: 'JetBrains Mono',
            color: item.accent,
            textAlign: 'center',
            x: centerEl(880, W),
            y: 130,
            width: 880,
            height: 35
        });

        // Main Headline (Balanced in center)
        elements.push({
            type: 'text',
            text: item.h1,
            fontSize: 54,
            fontWeight: '900',
            fontFamily: 'Montserrat',
            color: '#ffffff',
            textAlign: 'center',
            x: centerEl(880, W),
            y: 220,
            width: 880,
            height: 130
        });

        // Accent Divider line
        elements.push({
            type: 'shape',
            shape: 'rectangle',
            x: centerEl(140, W),
            y: 380,
            width: 140,
            height: 4,
            backgroundColor: item.accent,
            borderColor: 'transparent',
            borderWidth: 0
        });

        // Subtitle Text
        elements.push({
            type: 'text',
            text: item.sub,
            fontSize: 24,
            fontWeight: '600',
            fontFamily: 'Inter',
            color: item.subColor,
            textAlign: 'center',
            x: centerEl(820, W),
            y: 420,
            width: 820,
            height: 80
        });

        // Dynamic Business Brand & Offer details
        elements.push({
            type: 'shape',
            shape: 'rounded-rect',
            x: centerEl(680, W),
            y: 540,
            width: 680,
            height: 130,
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            borderColor: 'rgba(255, 255, 255, 0.12)',
            borderWidth: 1.5,
            borderRadius: 16
        });

        elements.push({
            type: 'text',
            text: '{{BUSINESS_NAME}}',
            fontSize: 30,
            fontWeight: '800',
            fontFamily: 'Montserrat',
            color: '#ffffff',
            textAlign: 'center',
            x: centerEl(640, W),
            y: 560,
            width: 640,
            height: 45
        });

        elements.push({
            type: 'text',
            text: '{{TAGLINE}}',
            fontSize: 18,
            fontWeight: '500',
            fontFamily: 'Inter',
            color: 'rgba(255, 255, 255, 0.75)',
            textAlign: 'center',
            x: centerEl(640, W),
            y: 615,
            width: 640,
            height: 30
        });

        // Bottom CTA Button
        elements.push({
            type: 'shape',
            shape: 'rounded-rect',
            x: centerEl(420, W),
            y: 750,
            width: 420,
            height: 60,
            backgroundColor: item.accent,
            borderColor: 'transparent',
            borderWidth: 0,
            borderRadius: 30
        });

        elements.push({
            type: 'text',
            text: 'CLAIM OFFER NOW',
            fontSize: 18,
            fontWeight: '900',
            fontFamily: 'Montserrat',
            color: '#000000',
            textAlign: 'center',
            x: centerEl(420, W),
            y: 765,
            width: 420,
            height: 30
        });

        // Bottom Contact & Website
        elements.push({
            type: 'text',
            text: '📞 {{PHONE}}  |  🌐 {{WEBSITE}}',
            fontSize: 18,
            fontWeight: '700',
            fontFamily: 'JetBrains Mono',
            color: 'rgba(255, 255, 255, 0.8)',
            textAlign: 'center',
            x: centerEl(840, W),
            y: 890,
            width: 840,
            height: 35
        });

    } else {
        // Standard Portrait Poster / Flyer Layout (800x1000)
        // Top Kicker Badge
        elements.push({
            type: 'text',
            text: `✦ ${item.tag} ✦`,
            fontSize: 16,
            fontWeight: '800',
            fontFamily: 'JetBrains Mono',
            color: item.accent,
            textAlign: 'center',
            x: centerEl(680, W),
            y: 70,
            width: 680,
            height: 30
        });

        // Large Editorial Headline
        elements.push({
            type: 'text',
            text: item.h1,
            fontSize: 44,
            fontWeight: '900',
            fontFamily: 'Montserrat',
            color: '#ffffff',
            textAlign: 'center',
            x: centerEl(700, W),
            y: 120,
            width: 700,
            height: 110
        });

        // Thin Separator
        elements.push({
            type: 'shape',
            shape: 'rectangle',
            x: centerEl(100, W),
            y: 250,
            width: 100,
            height: 3,
            backgroundColor: item.accent,
            borderColor: 'transparent',
            borderWidth: 0
        });

        // Tagline / Description
        elements.push({
            type: 'text',
            text: item.sub,
            fontSize: 19,
            fontWeight: '500',
            fontFamily: 'Inter',
            color: item.subColor,
            textAlign: 'center',
            x: centerEl(660, W),
            y: 280,
            width: 660,
            height: 70
        });

        // Central Feature Highlight Card
        elements.push({
            type: 'shape',
            shape: 'rounded-rect',
            x: centerEl(680, W),
            y: 380,
            width: 680,
            height: 240,
            backgroundColor: 'rgba(255, 255, 255, 0.04)',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1.5,
            borderRadius: 18
        });

        elements.push({
            type: 'text',
            text: '{{BUSINESS_NAME}}',
            fontSize: 28,
            fontWeight: '800',
            fontFamily: 'Montserrat',
            color: '#ffffff',
            textAlign: 'center',
            x: centerEl(640, W),
            y: 410,
            width: 640,
            height: 40
        });

        elements.push({
            type: 'text',
            text: '{{TAGLINE}}',
            fontSize: 16,
            fontWeight: '500',
            fontFamily: 'Inter',
            color: 'rgba(255, 255, 255, 0.7)',
            textAlign: 'center',
            x: centerEl(640, W),
            y: 460,
            width: 640,
            height: 30
        });

        elements.push({
            type: 'text',
            text: '📍 {{ADDRESS}}',
            fontSize: 15,
            fontWeight: '600',
            fontFamily: 'Inter',
            color: item.accent,
            textAlign: 'center',
            x: centerEl(640, W),
            y: 510,
            width: 640,
            height: 30
        });

        elements.push({
            type: 'text',
            text: '⭐ 100% SATISFACTION GUARANTEED • CERTIFIED EXPERTS ⭐',
            fontSize: 12,
            fontWeight: '700',
            fontFamily: 'JetBrains Mono',
            color: 'rgba(255, 255, 255, 0.5)',
            textAlign: 'center',
            x: centerEl(640, W),
            y: 560,
            width: 640,
            height: 25
        });

        // Call to action button
        elements.push({
            type: 'shape',
            shape: 'rounded-rect',
            x: centerEl(360, W),
            y: 670,
            width: 360,
            height: 54,
            backgroundColor: item.accent,
            borderColor: 'transparent',
            borderWidth: 0,
            borderRadius: 27
        });

        elements.push({
            type: 'text',
            text: 'BOOK YOUR APPOINTMENT',
            fontSize: 15,
            fontWeight: '900',
            fontFamily: 'Montserrat',
            color: '#000000',
            textAlign: 'center',
            x: centerEl(360, W),
            y: 685,
            width: 360,
            height: 25
        });

        // Bottom Contact Info Box
        elements.push({
            type: 'shape',
            shape: 'rounded-rect',
            x: centerEl(680, W),
            y: 770,
            width: 680,
            height: 120,
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
            borderColor: 'rgba(255, 255, 255, 0.08)',
            borderWidth: 1,
            borderRadius: 14
        });

        elements.push({
            type: 'text',
            text: '📞 DIRECT INQUIRIES: {{PHONE}}',
            fontSize: 17,
            fontWeight: '800',
            fontFamily: 'JetBrains Mono',
            color: '#ffffff',
            textAlign: 'center',
            x: centerEl(640, W),
            y: 795,
            width: 640,
            height: 30
        });

        elements.push({
            type: 'text',
            text: '🌐 VISIT US ONLINE: {{WEBSITE}}',
            fontSize: 15,
            fontWeight: '600',
            fontFamily: 'JetBrains Mono',
            color: item.accent,
            textAlign: 'center',
            x: centerEl(640, W),
            y: 835,
            width: 640,
            height: 30
        });
    }

    return {
        id: item.id,
        name: item.name,
        category: cat,
        business_type: item.subcat || subcat || cat,
        bgColor: item.bg,
        textColor: '#ffffff',
        width: W,
        height: H,
        elements: elements
    };
}

// Generate all 115+ templates
let fullCatalog = [];
categoriesConfig.forEach(group => {
    const [W, H] = group.dims;
    group.items.forEach(item => {
        fullCatalog.push(buildAlignedTemplate(item, W, H, group.cat, group.subcat));
    });
});

console.log('Total templates generated:', fullCatalog.length);

const path = require('path');

// Write to templates.json
const jsonPath = path.resolve(__dirname, '..', 'templates.json');
fs.writeFileSync(jsonPath, JSON.stringify(fullCatalog, null, 2), 'utf8');
console.log('Successfully written templates.json!');

// Also sync into supabase-config.js FALLBACK_TEMPLATES
const supaPath = path.resolve(__dirname, '..', 'supabase-config.js');
if (fs.existsSync(supaPath)) {
    let supaCode = fs.readFileSync(supaPath, 'utf8');
    const startMarker = 'const FALLBACK_TEMPLATES = [';
    const endMarker = 'window.LOCAL_FALLBACK_TEMPLATES = FALLBACK_TEMPLATES;';
    
    if (supaCode.includes(startMarker)) {
        const startIndex = supaCode.indexOf(startMarker);
        const endIndex = supaCode.indexOf(endMarker);
        if (endIndex > -1) {
            const newCode = supaCode.substring(0, startIndex) + 
                'const FALLBACK_TEMPLATES = ' + JSON.stringify(fullCatalog, null, 2) + ';\n' + 
                supaCode.substring(endIndex);
            fs.writeFileSync(supaPath, newCode, 'utf8');
            console.log('Successfully updated supabase-config.js FALLBACK_TEMPLATES!');
        }
    }
}

export interface IndustryRankingFactor {
  title: string;
  description: string;
}

export interface IndustryActionStep {
  title: string;
  description: string;
  impact: string;
}

export interface IndustryFAQ {
  question: string;
  answer: string;
}

export interface Industry {
  slug: string;
  name: string;
  singularName: string;
  metaTitle: string;
  metaDescription: string;
  heroSubtitle: string;
  schemaType: string;
  sampleQueries: string[];
  rankingFactors: IndustryRankingFactor[];
  actionSteps: IndustryActionStep[];
  faq: IndustryFAQ[];
}

export const industries: Industry[] = [
  {
    slug: "plumbers",
    name: "Plumbing Contractors & Plumbers",
    singularName: "Plumber",
    metaTitle: "AI SEO for Plumbers: How to Get Recommended by ChatGPT & Perplexity",
    metaDescription:
      "Actionable guide to optimizing your plumbing business for ChatGPT, Claude, Gemini, and Perplexity recommendations. Boost your local AI visibility score today.",
    heroSubtitle:
      "When homeowners ask ChatGPT “who is the best emergency plumber near me?”, make sure your plumbing company is the #1 recommendation.",
    schemaType: "Plumber",
    sampleQueries: [
      "Who is the most reliable emergency plumber in {city} for a burst pipe?",
      "Which plumbing company offers 24/7 leak detection and drain cleaning in {city}?",
      "Average cost of a tankless water heater installation and recommended plumbers in {city}",
      "Top-rated commercial plumbers for restaurant drainage in {city}",
    ],
    rankingFactors: [
      {
        title: "24/7 Availability & Emergency Signals",
        description:
          "AI engines prioritize plumbers with explicit emergency hours, fast response claims, and consistent licensing across all directories.",
      },
      {
        title: "Service-Specific Review Mentions",
        description:
          "Reviews explicitly mentioning services (e.g., 'fixed our slab leak', 'cleared main sewer line') build strong semantic associations in LLMs.",
      },
      {
        title: "Local Schema Markup (Plumber)",
        description:
          "Direct JSON-LD schema with service areas, emergency hours, and phone numbers gives AI crawlers verifiable facts.",
      },
    ],
    actionSteps: [
      {
        title: "Add Plumber Schema Markup",
        description: "Embed JSON-LD with opening hours, emergency status, and service areas.",
        impact: "+15% AI Citations",
      },
      {
        title: "Publish an Emergency Plumbing FAQ",
        description: "Answer real local questions regarding pricing, response times, and permits.",
        impact: "+20% Query Matching",
      },
      {
        title: "Standardize Google Business & Yelp Profiles",
        description: "Align NAP (Name, Address, Phone) data perfectly to eliminate AI ambiguity.",
        impact: "+10% Trust Factor",
      },
    ],
    faq: [
      {
        question: "Why doesn't ChatGPT recommend my plumbing company?",
        answer:
          "ChatGPT recommends businesses with strong, verified digital signals. If your site lacks structured schema, answers to common pricing questions, or consistent directory listings, the AI defaults to competitors.",
      },
      {
        question: "How can plumbers measure their AI visibility?",
        answer:
          "You can run an automated scan with GetInTheAnswer. We test 10 realistic plumbing queries across ChatGPT, Claude, Gemini, and Perplexity and benchmark you against local competitors.",
      },
    ],
  },
  {
    slug: "dentists",
    name: "Dental Clinics & Orthodontists",
    singularName: "Dentist",
    metaTitle: "AI SEO for Dentists: Getting Recommended by ChatGPT & Claude",
    metaDescription:
      "Learn how dental practices, cosmetic dentists, and orthodontists can dominate ChatGPT, Claude, and Perplexity local search recommendations.",
    heroSubtitle:
      "When patients ask AI assistants for dental implant specialists or top-rated dentists in your city, win the recommendation.",
    schemaType: "Dentist",
    sampleQueries: [
      "Best cosmetic dentist for porcelain veneers in {city}",
      "Where can I find an emergency pediatric dentist open on weekends in {city}?",
      "Cost of Invisalign vs braces and top orthodontists in {city}",
      "Gentle dental clinic with great sedation dentistry reviews in {city}",
    ],
    rankingFactors: [
      {
        title: "Doctor Credentials & Specialties",
        description:
          "AI models look for DDS/DMD certifications, board associations, and clear descriptions of cosmetic or orthodontic specialties.",
      },
      {
        title: "Insurance & Financing Clarity",
        description:
          "Patients frequently ask AI about accepted insurances and payment plans; having this indexed makes your practice quotable.",
      },
      {
        title: "Patient Experience & Gentle Care Signals",
        description:
          "Mentions of painless procedures, friendly staff, and clean modern facilities in reviews are heavily cited by AI engines.",
      },
    ],
    actionSteps: [
      {
        title: "Deploy Dentist Schema with MedicalSpecialty",
        description: "Tag your practice with Dentist, Orthodontics, or Pediatric Dentistry schema.",
        impact: "+18% AI Relevance",
      },
      {
        title: "Create Treatment & Pricing Guides",
        description: "Provide transparent price ranges and procedure walkthroughs on your site.",
        impact: "+25% AI Citations",
      },
      {
        title: "Encourage Specialty-Focused Reviews",
        description: "Prompt patients to mention specific treatments like Invisalign or dental implants.",
        impact: "+15% Recommendation Rate",
      },
    ],
    faq: [
      {
        question: "Do AI engines read dentist reviews before recommending them?",
        answer:
          "Yes. Perplexity and ChatGPT search models extract review summaries to justify recommendations, citing phrases like 'highly rated for cosmetic care' or 'patients praise their painless technique'.",
      },
      {
        question: "What is the best schema type for dental practices?",
        answer:
          "Use Schema.org/Dentist, and specify medicalSpecialty (e.g., Orthodontic, Cosmetic, Pediatric) alongside your accepted insurance providers and doctors.",
      },
    ],
  },
  {
    slug: "lawyers",
    name: "Law Firms & Attorneys",
    singularName: "Lawyer",
    metaTitle: "AI SEO for Law Firms: Dominate ChatGPT & AI Search Recommendations",
    metaDescription:
      "How personal injury, family, criminal defense, and business lawyers can get cited and recommended by generative AI engines.",
    heroSubtitle:
      "When prospective clients ask ChatGPT for legal representation, ensure your law firm is named as the trusted authority.",
    schemaType: "Attorney",
    sampleQueries: [
      "Top personal injury lawyer in {city} with a proven track record",
      "Best family law attorney for contested divorce in {city}",
      "Experienced criminal defense lawyer for DUI cases in {city}",
      "Corporate business litigation attorney near me in {city}",
    ],
    rankingFactors: [
      {
        title: "Case Results & Settlement Transparency",
        description:
          "Verified settlement figures and case outcomes establish strong authority signals that LLMs reference when recommending counsel.",
      },
      {
        title: "State Bar & Practice Area Verification",
        description:
          "Consistent attorney licensing, bar association memberships, and recognized legal directories (Avvo, Justia, Martindale).",
      },
      {
        title: "Direct Answers to Legal FAQ",
        description:
          "Websites with comprehensive answers to statute of limitations, fee structures, and legal procedures get cited as authoritative sources.",
      },
    ],
    actionSteps: [
      {
        title: "Implement LegalService & Attorney Schema",
        description: "Add schema data detailing practice areas, attorney names, and jurisdictions.",
        impact: "+20% Authority Score",
      },
      {
        title: "Build Practice Area FAQ Hubs",
        description: "Answer high-intent client questions (e.g. 'What to do after a car accident in {city}').",
        impact: "+30% AI Answer Inclusions",
      },
      {
        title: "Unify Legal Directory Profiles",
        description: "Synchronize Avvo, Justia, Google Business, and website attorney bios.",
        impact: "+15% Verification Confidence",
      },
    ],
    faq: [
      {
        question: "Can an AI give legal recommendations?",
        answer:
          "AI assistants often disclaim legal advice but regularly provide curated lists of reputable law firms and attorneys when asked for local recommendations.",
      },
      {
        question: "How does GEO differ from traditional legal SEO?",
        answer:
          "While traditional SEO focuses on keyword stuffing and backlinks for blue links, GEO focuses on establishing entity authority, structured practice details, and machine-readable case evidence.",
      },
    ],
  },
  {
    slug: "real-estate-agents",
    name: "Real Estate Agents & Brokerages",
    singularName: "Real Estate Agent",
    metaTitle: "AI SEO for Real Estate Agents: ChatGPT & Perplexity Optimization",
    metaDescription:
      "Discover how real estate agents and brokerages can rank in AI recommendations when buyers and sellers search in their city or neighborhood.",
    heroSubtitle:
      "When buyers and sellers ask AI assistants for the top real estate agent in your area, be the name they trust.",
    schemaType: "RealEstateAgent",
    sampleQueries: [
      "Who is the best real estate agent to sell a luxury home in {city}?",
      "Top-rated buyer's agent specializing in historic neighborhoods in {city}",
      "Recommended real estate brokerage for first-time home buyers in {city}",
      "Which realtor has the most verified sales in {city} this year?",
    ],
    rankingFactors: [
      {
        title: "Neighborhood & Hyperlocal Authority",
        description:
          "AI models prioritize agents who demonstrate deep expertise in specific subdivisions, school districts, and zip codes.",
      },
      {
        title: "Transaction History & Client Testimonials",
        description:
          "Reviews detailing successful sales above asking price or smooth negotiation experiences feed AI recommendation logic.",
      },
      {
        title: "Zillow, Realtor.com & Google Profile Sync",
        description:
          "Consistency between major MLS portals and your personal website confirms active listing status.",
      },
    ],
    actionSteps: [
      {
        title: "Add RealEstateAgent Schema with areaServed",
        description: "Specify exact neighborhoods, cities, and zip codes in your structured data.",
        impact: "+22% Local Relevance",
      },
      {
        title: "Publish Neighborhood Market Reports",
        description: "Create quarterly market stats and buyer guides that AI models can quote.",
        impact: "+25% Source Citations",
      },
      {
        title: "Gather Hyperlocal Reviews",
        description: "Ask clients to name the exact community or neighborhood in their review.",
        impact: "+18% Query Matching",
      },
    ],
    faq: [
      {
        question: "How do AI models know which real estate agents are active?",
        answer:
          "AI search engines crawl public MLS data, Zillow/Realtor profile mentions, local press, and updated market commentary on your website.",
      },
      {
        question: "Why should realtors optimize for GEO now?",
        answer:
          "High-net-worth buyers and relocating families increasingly use AI to research agents before reaching out. Optimizing now gives you a first-mover advantage in your market.",
      },
    ],
  },
  {
    slug: "restaurants",
    name: "Restaurants, Bistros & Cafes",
    singularName: "Restaurant",
    metaTitle: "AI SEO for Restaurants: How to Get Recommended by ChatGPT & Gemini",
    metaDescription:
      "Get your restaurant recommended when diners ask ChatGPT, Claude, and Gemini for the best dining, brunch, or romantic spots in town.",
    heroSubtitle:
      "When foodies ask AI “where should we go for dinner tonight?”, get your restaurant served in the top 3 recommendations.",
    schemaType: "Restaurant",
    sampleQueries: [
      "Best romantic Italian restaurant with outdoor seating in {city}",
      "Where can I find authentic gluten-free pizza in {city}?",
      "Top-rated brunch spots with craft cocktails in {city}",
      "Kid-friendly restaurants with private dining rooms in {city}",
    ],
    rankingFactors: [
      {
        title: "Cuisine & Dietary Tag Consistency",
        description:
          "Clear menu tags (vegan, gluten-free, halal, farm-to-table) make your restaurant appear for specific dietary queries.",
      },
      {
        title: "Menu Item Mentions in Reviews",
        description:
          "AI models extract signature dishes (e.g. 'their truffle pasta is incredible') to recommend specific cravings.",
      },
      {
        title: "Schema.org/Restaurant with Menu Link",
        description:
          "Structured data linking directly to machine-readable menu items, reservations, and price ranges.",
      },
    ],
    actionSteps: [
      {
        title: "Add Restaurant Schema with hasMenu & servesCuisine",
        description: "Structure your menu items, opening hours, and cuisine classifications.",
        impact: "+30% Dietary Query Match",
      },
      {
        title: "Connect OpenTable / Resy / Google Reserve",
        description: "Allow AI agents to identify direct booking capability.",
        impact: "+15% Conversion Rate",
      },
      {
        title: "Highlight Signature Dishes on Your Site",
        description: "Create dedicated sections for must-try dishes and customer favorites.",
        impact: "+20% AI Recommendation Rate",
      },
    ],
    faq: [
      {
        question: "How does ChatGPT choose which restaurants to suggest?",
        answer:
          "ChatGPT synthesizes recommendations from food blogs, TripAdvisor, Google Reviews, Yelp, and your website's structured menu information.",
      },
      {
        question: "What is the biggest mistake restaurants make with AI visibility?",
        answer:
          "Uploading menus only as non-searchable PDF files or images. AI engines need plain text and structured schema to parse your culinary offerings.",
      },
    ],
  },
  {
    slug: "hvac-contractors",
    name: "HVAC Contractors & AC Repair",
    singularName: "HVAC Contractor",
    metaTitle: "AI SEO for HVAC Contractors: ChatGPT & Perplexity Visibility",
    metaDescription:
      "Master generative engine optimization for heating, ventilation, and air conditioning companies. Get recommended for emergency AC and furnace repair.",
    heroSubtitle:
      "When homeowners face a broken air conditioner or furnace, ensure AI assistants name your HVAC business first.",
    schemaType: "HVACBusiness",
    sampleQueries: [
      "Who offers 24/7 emergency AC repair near me in {city}?",
      "Average cost of central heat pump installation and top HVAC contractors in {city}",
      "Best commercial refrigeration and heating maintenance company in {city}",
      "Reliable ductless mini-split installers in {city}",
    ],
    rankingFactors: [
      {
        title: "Brand Authorization & Certifications",
        description:
          "NATE certification, Carrier/Trane/Lennox factory authorization signals give AI confidence in technical proficiency.",
      },
      {
        title: "Seasonal Query Responsiveness",
        description:
          "Web content addressing seasonal spikes (summer AC breakdowns, winter furnace tune-ups) gets quoted during peak demand.",
      },
      {
        title: "HVACBusiness Schema with Emergency Details",
        description:
          "Explicit service areas, financing availability, and warranty terms structured for search bots.",
      },
    ],
    actionSteps: [
      {
        title: "Deploy HVACBusiness Structured Data",
        description: "Add schema covering furnace repair, AC maintenance, heat pumps, and ductwork.",
        impact: "+18% AI Accuracy",
      },
      {
        title: "Publish Seasonal Maintenance Guides",
        description: "Provide DIY troubleshooting vs when to call a pro to establish authority.",
        impact: "+22% Search Quotations",
      },
      {
        title: "Streamline Directory Information",
        description: "Keep hours, licensing, and emergency service terms aligned across all platforms.",
        impact: "+12% Trust Ranking",
      },
    ],
    faq: [
      {
        question: "Can AI help generate leads for HVAC companies?",
        answer:
          "Yes. More homeowners now ask AI assistants for immediate contractor recommendations rather than wading through sponsored search ads.",
      },
      {
        question: "How often should an HVAC business test its AI visibility?",
        answer:
          "We recommend weekly tracking, especially before summer and winter peaks when consumer query volumes surge.",
      },
    ],
  },
  {
    slug: "roofers",
    name: "Roofing Contractors",
    singularName: "Roofer",
    metaTitle: "AI SEO for Roofers: Get Recommended by ChatGPT & Perplexity",
    metaDescription:
      "How roofing contractors get named when homeowners ask ChatGPT, Claude, Gemini and Perplexity for a roofer. Free AI visibility scan.",
    heroSubtitle:
      "After a storm, homeowners now ask an AI who to call before they ask a neighbour. Make sure your name is the one it gives.",
    schemaType: "RoofingContractor",
    sampleQueries: [
      "Who is the best roofing contractor in {city} for storm damage repair?",
      "Which roofers in {city} handle insurance claims for hail damage?",
      "Cost to replace an asphalt shingle roof in {city} and who to hire",
      "Top-rated commercial flat roof contractors in {city}",
    ],
    rankingFactors: [
      {
        title: "Storm and Insurance Language",
        description:
          "Engines strongly favour roofers whose sites explain insurance claim handling, because that is the phrasing homeowners use when they ask.",
      },
      {
        title: "Licence and Manufacturer Certification",
        description:
          "GAF, Owens Corning or CertainTeed certification stated on the site gives an engine a verifiable fact to repeat.",
      },
      {
        title: "Service Area Precision",
        description:
          "Roofing is radius-bound. Naming the suburbs you cover, not just the metro, is what puts you in a suburb-level answer.",
      },
    ],
    actionSteps: [
      {
        title: "Publish a storm response page",
        description: "One page per common event: hail, wind, leak. These match the exact questions asked after weather.",
        impact: "+20% AI Citations",
      },
      {
        title: "Add RoofingContractor schema",
        description: "JSON-LD with service area, certifications and emergency availability.",
        impact: "+15% AI Citations",
      },
      {
        title: "Document three recent jobs",
        description: "Address-level detail — neighbourhood, roof type, outcome — gives engines something specific to cite.",
        impact: "+10% Visibility",
      },
    ],
    faq: [
      {
        question: "Why doesn't ChatGPT recommend my roofing company?",
        answer:
          "Most roofing sites describe services without ever stating where they work, what they are certified in, or how they handle insurance. An engine needs verifiable specifics to name you over a competitor who states them plainly.",
      },
      {
        question: "Does storm season change AI recommendations?",
        answer:
          "Yes. Engines with live retrieval reflect what has been published recently, so contractors posting storm response content during an active season appear far more often than those who do not.",
      },
    ],
  },
  {
    slug: "electricians",
    name: "Electricians & Electrical Contractors",
    singularName: "Electrician",
    metaTitle: "AI SEO for Electricians: Get Recommended by ChatGPT & Perplexity",
    metaDescription:
      "How electrical contractors get named when homeowners ask ChatGPT, Claude, Gemini and Perplexity for an electrician. Free AI visibility scan.",
    heroSubtitle:
      "When someone asks an AI who can install their EV charger or fix a dead circuit, your name should be in the answer.",
    schemaType: "Electrician",
    sampleQueries: [
      "Who is the best licensed electrician in {city} for an emergency callout?",
      "Which electricians in {city} install EV chargers and home batteries?",
      "Cost to rewire a house in {city} and recommended electrical contractors",
      "Top commercial electrical contractors in {city} for office fit-outs",
    ],
    rankingFactors: [
      {
        title: "Licence Number Stated Publicly",
        description:
          "An engine can verify a stated licence number. An unverifiable claim of being licensed carries far less weight.",
      },
      {
        title: "Modern Service Coverage",
        description:
          "EV charging, panel upgrades and battery storage are what people ask AI about. Sites that only list 'electrical services' never match those questions.",
      },
      {
        title: "Emergency Availability",
        description:
          "Explicit 24/7 hours, with a real response time, is one of the strongest signals in an urgent-intent answer.",
      },
    ],
    actionSteps: [
      {
        title: "Name every modern service explicitly",
        description: "EV charger install, panel upgrade, whole-home surge, battery storage — one section each.",
        impact: "+20% AI Citations",
      },
      {
        title: "Add Electrician schema with licence",
        description: "JSON-LD carrying licence number, service area and hours.",
        impact: "+15% AI Citations",
      },
      {
        title: "Answer the pricing questions",
        description: "Publish honest ranges for the five jobs people ask about most. Engines cite pages that answer directly.",
        impact: "+12% Visibility",
      },
    ],
    faq: [
      {
        question: "Why does ChatGPT recommend my competitor instead?",
        answer:
          "Usually because their site answers a question yours does not. Engines pick the source that addresses the query directly, and most electrician sites are service lists rather than answers.",
      },
      {
        question: "Do I need to be on Yelp to be recommended?",
        answer:
          "It helps, but it is not the deciding factor. Engines cite whatever the web says about you consistently — your own site, directories and local coverage together.",
      },
    ],
  },
  {
    slug: "med-spas",
    name: "Med Spas & Aesthetic Clinics",
    singularName: "Med Spa",
    metaTitle: "AI SEO for Med Spas: Get Recommended by ChatGPT & Perplexity",
    metaDescription:
      "How med spas and aesthetic clinics get named when patients ask ChatGPT, Claude, Gemini and Perplexity where to go. Free AI visibility scan.",
    heroSubtitle:
      "Patients research injectables through AI before they ever book a consult. Be the clinic it names.",
    schemaType: "MedicalBusiness",
    sampleQueries: [
      "Best med spa in {city} for Botox and dermal fillers",
      "Which clinics in {city} offer laser skin resurfacing with a board-certified provider?",
      "Cost of CoolSculpting in {city} and which med spa to choose",
      "Top-rated medical aesthetics clinics in {city} for first-time patients",
    ],
    rankingFactors: [
      {
        title: "Named Practitioners with Credentials",
        description:
          "Aesthetic queries are trust queries. A named, credentialled injector on the page is what an engine repeats.",
      },
      {
        title: "Device and Brand Specificity",
        description:
          "Patients ask by brand — Botox, Dysport, Morpheus8, CoolSculpting. Sites that name devices match those questions; sites that say 'skin treatments' do not.",
      },
      {
        title: "Safety and Consultation Content",
        description:
          "Engines are conservative on medical topics and prefer sources that discuss suitability, risks and aftercare.",
      },
    ],
    actionSteps: [
      {
        title: "Build a page per treatment brand",
        description: "One page each for the named treatments you actually offer, with pricing ranges.",
        impact: "+22% AI Citations",
      },
      {
        title: "Publish provider credentials",
        description: "Full name, qualification and training for each injector, in text rather than an image.",
        impact: "+18% AI Citations",
      },
      {
        title: "Add MedicalBusiness schema",
        description: "JSON-LD with specialties, provider names and location.",
        impact: "+12% Visibility",
      },
    ],
    faq: [
      {
        question: "Why are AI engines cautious about recommending med spas?",
        answer:
          "Aesthetic medicine is a health topic, so engines weight demonstrable credentials and safety information heavily. Clinics that publish practitioner qualifications and honest risk information are named far more readily.",
      },
      {
        question: "Do treatment prices need to be public?",
        answer:
          "Publishing ranges helps considerably. A large share of AI queries include cost, and a page that answers it is the one an engine can cite.",
      },
    ],
  },
  {
    slug: "chiropractors",
    name: "Chiropractors",
    singularName: "Chiropractor",
    metaTitle: "AI SEO for Chiropractors: Get Recommended by ChatGPT & Perplexity",
    metaDescription:
      "How chiropractic clinics get named when patients ask ChatGPT, Claude, Gemini and Perplexity for a chiropractor. Free AI visibility scan.",
    heroSubtitle:
      "People describe their pain to an AI before they book anything. Make sure it points them to your clinic.",
    schemaType: "Chiropractic",
    sampleQueries: [
      "Best chiropractor in {city} for lower back pain and sciatica",
      "Which chiropractors in {city} treat sports injuries and accept insurance?",
      "Cost of a chiropractic adjustment in {city} and who to see",
      "Top-rated prenatal chiropractors in {city}",
    ],
    rankingFactors: [
      {
        title: "Condition-Led Content",
        description:
          "Patients ask by symptom, not by service. Pages built around sciatica, whiplash or disc pain match those questions; a generic services page does not.",
      },
      {
        title: "Insurance and Technique Clarity",
        description:
          "Stating which insurers you take and which techniques you practise gives an engine concrete, matchable facts.",
      },
      {
        title: "Practitioner Credentials",
        description:
          "As a health topic, engines weight named, qualified practitioners heavily.",
      },
    ],
    actionSteps: [
      {
        title: "Write one page per condition",
        description: "Sciatica, lower back pain, neck pain, headaches, sports injury. Symptoms in, treatment out.",
        impact: "+22% AI Citations",
      },
      {
        title: "List accepted insurers by name",
        description: "A large share of queries include insurance. Naming carriers makes you the answer.",
        impact: "+15% AI Citations",
      },
      {
        title: "Add Chiropractic schema",
        description: "JSON-LD with practitioner, specialties, hours and location.",
        impact: "+12% Visibility",
      },
    ],
    faq: [
      {
        question: "Why doesn't ChatGPT name my chiropractic clinic?",
        answer:
          "Most clinic sites are organised around treatments while patients ask about symptoms. Without content matching the way the question is phrased, the engine cites a clinic whose pages do.",
      },
      {
        question: "Does patient review volume matter?",
        answer:
          "It contributes, but consistency across the web matters more. Engines look for the same clinic name, address and specialties appearing reliably in multiple places.",
      },
    ],
  },
  {
    slug: "pest-control",
    name: "Pest Control Companies",
    singularName: "Pest Control Company",
    metaTitle: "AI SEO for Pest Control: Get Recommended by ChatGPT & Perplexity",
    metaDescription:
      "How pest control companies get named when homeowners ask ChatGPT, Claude, Gemini and Perplexity who to call. Free AI visibility scan.",
    heroSubtitle:
      "Termites, roaches, rodents — people ask an AI what to do before they call anyone. Be the company it suggests.",
    schemaType: "LocalBusiness",
    sampleQueries: [
      "Best pest control company in {city} for a termite infestation",
      "Who handles emergency rodent removal in {city}?",
      "Cost of monthly pest control in {city} and which company to use",
      "Which pest control companies in {city} use pet-safe treatments?",
    ],
    rankingFactors: [
      {
        title: "Pest-Specific Pages",
        description:
          "Queries name the pest. A company with a termite page wins the termite question; a company with a 'services' page wins nothing.",
      },
      {
        title: "Treatment Safety Details",
        description:
          "Pet-safe and child-safe treatment information matches a very common phrasing and is easy for an engine to quote.",
      },
      {
        title: "Licensing and Guarantee Terms",
        description:
          "State licence numbers and a written guarantee give engines verifiable specifics.",
      },
    ],
    actionSteps: [
      {
        title: "Build a page for each pest you treat",
        description: "Termites, bed bugs, roaches, rodents, mosquitoes, wasps. One page each.",
        impact: "+22% AI Citations",
      },
      {
        title: "Publish your treatment safety policy",
        description: "What you use, why, and how it affects pets and children.",
        impact: "+15% AI Citations",
      },
      {
        title: "Add LocalBusiness schema",
        description: "JSON-LD with service area, licence and emergency availability.",
        impact: "+10% Visibility",
      },
    ],
    faq: [
      {
        question: "Why do AI engines recommend national chains over my company?",
        answer:
          "Chains publish detailed pest-specific content at scale, which matches how the questions are asked. A local company with genuinely local, pest-specific pages competes well — most simply do not have them.",
      },
      {
        question: "Does seasonality affect AI recommendations?",
        answer:
          "Yes. Engines with live retrieval favour recently published, seasonally relevant content, so companies publishing ahead of each pest season appear more often.",
      },
    ],
  },
  {
    slug: "auto-repair",
    name: "Auto Repair Shops",
    singularName: "Auto Repair Shop",
    metaTitle: "AI SEO for Auto Repair Shops: Get Recommended by ChatGPT & Perplexity",
    metaDescription:
      "How independent auto repair shops get named when drivers ask ChatGPT, Claude, Gemini and Perplexity where to take their car. Free AI visibility scan.",
    heroSubtitle:
      "Drivers describe a noise to an AI and ask who can fix it. Your shop should be the answer.",
    schemaType: "AutoRepair",
    sampleQueries: [
      "Best independent auto repair shop in {city} for European cars",
      "Who does honest transmission repair in {city}?",
      "Cost of a brake job in {city} and which shop to trust",
      "Which auto shops in {city} are certified for hybrid and EV service?",
    ],
    rankingFactors: [
      {
        title: "Make and Specialty Clarity",
        description:
          "Queries name a make. A shop that states it specialises in BMW, Subaru or hybrid drivetrains matches those questions directly.",
      },
      {
        title: "Certification Signals",
        description:
          "ASE certification, dealer-level diagnostic equipment and manufacturer training are concrete facts an engine can repeat.",
      },
      {
        title: "Transparent Pricing and Warranty",
        description:
          "Published pricing ranges and a stated parts-and-labour warranty answer the trust half of the question.",
      },
    ],
    actionSteps: [
      {
        title: "State the makes you specialise in",
        description: "Name them explicitly on the homepage and in a page each for your top three.",
        impact: "+20% AI Citations",
      },
      {
        title: "Publish common repair pricing",
        description: "Brakes, timing belt, diagnostics, transmission. Ranges are enough.",
        impact: "+15% AI Citations",
      },
      {
        title: "Add AutoRepair schema",
        description: "JSON-LD with certifications, hours, service area and warranty terms.",
        impact: "+12% Visibility",
      },
    ],
    faq: [
      {
        question: "Why does the AI recommend the dealership instead of my shop?",
        answer:
          "Dealerships publish far more structured, specific content. An independent shop that states its specialties, certifications and pricing plainly is frequently named ahead of them, because those are the facts the question actually asks about.",
      },
      {
        question: "Do I need reviews on every platform?",
        answer:
          "No. Consistency matters more than breadth. The same shop name, address and specialties appearing reliably wherever you do appear is what engines rely on.",
      },
    ],
  },
];

export function getIndustry(slug: string): Industry | undefined {
  return industries.find((industry) => industry.slug === slug);
}

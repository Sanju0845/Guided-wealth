import { Service, Testimonial, FAQ, PricingPlan } from './types';

export const SERVICES: Service[] = [
  {
    id: 'wealth-management',
    title: 'Personal Wealth Management',
    icon: 'https://cdn-icons-png.flaticon.com/128/12888/12888650.png',
    description: 'Bespoke strategies to grow and preserve your capital through personalized asset allocation and risk management. We analyze your entire financial ecosystem to ensure every rupee is working towards your specific long-term objectives.',
    features: [
      'Detailed financial plan analysis and gap identification',
      'Asset placement review for tax efficiency',
      'Portfolio layout optimization and rebalancing',
      'Cash flow management and liquidity planning',
      'Regular performance reporting and strategy pivots'
    ],
    painPoints: [
      { title: 'Low Growth in the Portfolio', description: 'Is your wealth working hard but results are slow? Does the portfolio feel stagnant or unbalanced? Asset allocation can influence decision-making, wealth presence and overall financial flow.' },
      { title: 'Financial Growth Feels Stagnant', description: 'Does it feel like your wealth is stuck? You can write: slow wealth growth, difficulty attracting new assets, constant operational challenges. The spatial organisation of a portfolio can influence decision-making and overall business flow.' },
      { title: 'Family Conflicts or Poor Communication', description: 'Does your family environment feel tense or uncoordinated? Frequent misunderstandings among members, lack of collaboration, uncomfortable financial atmosphere. Portfolio layout and asset orientation can influence interaction patterns and team dynamics.' }
    ],
    analysisPoints: [
      'portfolio entrance orientation',
      'asset seating arrangement',
      'client reception area',
      'leadership desk placement',
      'meeting room positioning',
      'overall spatial balance'
    ],
    price: '₹999 (Standard Plan)',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'retirement-planning',
    title: 'Retirement Planning',
    icon: 'https://cdn-icons-png.flaticon.com/128/1936/1936068.png',
    description: 'Secure your future with comprehensive retirement solutions tailored to your lifestyle goals and financial aspirations. We help you build a corpus that outlasts your needs while maintaining your desired standard of living.',
    features: [
      'Lifestyle goal visualization and cost estimation',
      'Corpus requirement calculation with inflation indexing',
      'Pension and annuity strategy selection',
      'Post-retirement withdrawal strategy',
      'Healthcare cost planning and long-term care'
    ],
    painPoints: [
      { title: 'Uncertain Future Income', description: 'Worried about your lifestyle post-retirement? We help you visualize and secure a steady income stream that matches your aspirations.' },
      { title: 'Inflation Erosion', description: 'Is your savings losing value over time? Our inflation-indexed calculations ensure your corpus remains robust against rising costs.' }
    ],
    analysisPoints: [
      'lifestyle goal alignment',
      'inflation impact assessment',
      'pension strategy review',
      'healthcare cost projection'
    ],
    price: '₹999',
    image: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'investment-strategy',
    title: 'Investment Strategy',
    icon: 'https://cdn-icons-png.flaticon.com/128/17597/17597732.png',
    description: 'Data-driven investment advice focusing on long-term growth, diversification, and market opportunities. Our evidence-based approach removes emotion from investing and focuses on disciplined execution.',
    features: [
      'Evidence-based approach to market participation',
      'Multi-asset class diversification (Equity, Debt, Gold)',
      'Cost-efficient portfolio construction',
      'Risk profiling and tolerance assessment',
      'Systematic Investment Plan (SIP) optimization'
    ],
    painPoints: [
      { title: 'Chasing Market Trends', description: 'Are you constantly switching investments based on news? We help you build a disciplined, evidence-based strategy.' },
      { title: 'Lack of Diversification', description: 'Is your wealth concentrated in too few assets? We ensure a robust, multi-asset allocation for stability.' }
    ],
    analysisPoints: [
      'risk profile assessment',
      'asset class correlation',
      'cost efficiency audit',
      'rebalancing frequency'
    ],
    price: '₹999',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'tax-optimization',
    title: 'Tax Optimization',
    icon: 'https://cdn-icons-png.flaticon.com/128/4749/4749988.png',
    description: 'Strategic tax planning to minimize liabilities and maximize your after-tax returns. We look beyond basic deductions to find structural efficiencies in your income and investment streams.',
    features: [
      'Income tax structuring for professionals and business owners',
      'Deduction identification under all available sections',
      'Proactive year-round planning to avoid last-minute rushes',
      'Capital gains tax management and harvesting',
      'TDS and advance tax compliance guidance'
    ],
    painPoints: [
      { title: 'High Tax Outgo', description: 'Paying more tax than necessary? We identify structural efficiencies to maximize your take-home income.' },
      { title: 'Last-Minute Tax Rush', description: 'Scrambling for deductions in March? Our proactive year-round planning removes the stress.' }
    ],
    analysisPoints: [
      'income structure review',
      'deduction eligibility',
      'capital gains harvesting',
      'compliance check'
    ],
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'estate-planning',
    title: 'Estate Planning',
    icon: 'https://cdn-icons-png.flaticon.com/128/15636/15636935.png',
    description: 'Ensuring your legacy is preserved and passed on according to your wishes with minimal friction. We help you navigate the complexities of succession to protect your family\'s future.',
    features: [
      'Will and Trust creation assistance',
      'Estate tax minimization and probate planning',
      'Legacy preservation and family governance',
      'Nomination and joint-holding audit',
      'Digital asset succession planning'
    ],
    painPoints: [
      { title: 'Succession Confusion', description: 'Unsure how your assets will be distributed? We provide clarity and legal structure for your legacy.' },
      { title: 'Probate Delays', description: 'Worried about legal hurdles for your family? Our planning minimizes friction and ensures smooth transfer.' }
    ],
    analysisPoints: [
      'will & trust review',
      'nomination audit',
      'legacy preservation',
      'digital asset planning'
    ],
    image: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'insurance-advisory',
    title: 'Insurance Advisory',
    icon: 'https://cdn-icons-png.flaticon.com/128/1962/1962589.png',
    description: 'Comprehensive risk assessment and insurance solutions to protect what matters most. We ensure you are neither under-insured nor paying for unnecessary coverage.',
    features: [
      'Coverage audit of existing policies',
      'Risk gap identification for life and health',
      'Value-for-money optimization and claim support',
      'Critical illness and disability protection',
      'Liability insurance for professionals'
    ],
    painPoints: [
      { title: 'Under-Insured Risk', description: 'Is your family truly protected? We identify gaps in your coverage to ensure complete peace of mind.' },
      { title: 'Over-Priced Premiums', description: 'Paying too much for too little? We optimize your policies for maximum value and protection.' }
    ],
    analysisPoints: [
      'coverage gap analysis',
      'premium optimization',
      'claim support review',
      'liability assessment'
    ],
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'debt-management',
    title: 'Debt Management',
    icon: 'https://cdn-icons-png.flaticon.com/128/4334/4334503.png',
    description: 'Efficient strategies to manage and reduce debt while maintaining your financial health. We help you transition from being a borrower to becoming a wealth creator.',
    features: [
      'Debt prioritization and consolidation strategy',
      'Interest rate optimization and refinancing advice',
      'Cash flow improvement and budgeting',
      'Credit score enhancement guidance',
      'EMI management and prepayment planning'
    ],
    painPoints: [
      { title: 'High Interest Burden', description: 'Struggling with expensive loans? We help you refinance and prioritize debt for faster freedom.' },
      { title: 'Cash Flow Crunch', description: 'EMIs eating up your income? Our budgeting strategies restore your financial breathing room.' }
    ],
    analysisPoints: [
      'debt-to-income ratio',
      'interest rate audit',
      'refinancing potential',
      'credit score review'
    ],
    image: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'education-funding',
    title: 'Education Funding',
    icon: 'https://cdn-icons-png.flaticon.com/128/3074/3074058.png',
    description: 'Planning for the future of your children with dedicated education savings strategies. We account for rising global education costs to ensure your child\'s dreams are never limited by finances.',
    features: [
      'Future cost estimation for domestic and international studies',
      'Savings vehicle selection (Sukanya Samriddhi, MFs, etc.)',
      'Inflation-adjusted goal setting and tracking',
      'Education loan vs. self-funding analysis',
      'Contingency planning for education corpus'
    ],
    painPoints: [
      { title: 'Rising Education Costs', description: 'Worried about global inflation in tuition? We build robust corpuses to match future requirements.' },
      { title: 'Limited Funding Options', description: 'Unsure where to save for your child? We identify the most tax-efficient and high-growth vehicles.' }
    ],
    analysisPoints: [
      'global cost projection',
      'savings vehicle audit',
      'inflation indexing',
      'loan vs. self-fund'
    ],
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'real-estate-consulting',
    title: 'Real Estate Consulting',
    icon: 'https://cdn-icons-png.flaticon.com/128/2400/2400446.png',
    description: 'Expert advice on real estate investments and property portfolio management. We help you evaluate property as a financial asset rather than just an emotional purchase.',
    features: [
      'Property acquisition analysis and due diligence',
      'Rental yield estimation and ROI tracking',
      'Market trend evaluation and location analysis',
      'Real estate vs. financial asset allocation',
      'REITs and fractional ownership evaluation'
    ],
    painPoints: [
      { title: 'Low Rental Yields', description: 'Is your property underperforming? We evaluate your real estate assets for better ROI and yields.' },
      { title: 'Illiquid Asset Concentration', description: 'Too much wealth locked in property? We help balance your portfolio for better liquidity.' }
    ],
    analysisPoints: [
      'rental yield audit',
      'market trend analysis',
      'asset allocation balance',
      'due diligence check'
    ],
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'mutual-fund-education',
    title: 'Mutual Fund & Stock Education',
    icon: 'https://cdn-icons-png.flaticon.com/128/3130/3130453.png',
    description: 'Comprehensive education on mutual funds, stocks, and investment vehicles to help you make informed decisions. We demystify complex financial instruments so you can invest with confidence and understanding.',
    features: [
      'Fundamental analysis of stocks and companies',
      'Mutual fund types, selection criteria, and portfolio matching',
      'Risk assessment and diversification strategies',
      'Market timing vs. time in market education',
      'Hands-on portfolio building with guided practice'
    ],
    painPoints: [
      { title: 'Confusion About Where to Invest', description: 'Overwhelmed by too many investment options? We simplify stocks, mutual funds, and ETFs into clear, actionable knowledge.' },
      { title: 'Fear of Losing Money', description: 'Scared to start investing due to market volatility? Our education builds confidence through risk understanding and management techniques.' }
    ],
    analysisPoints: [
      'investment knowledge assessment',
      'risk tolerance evaluation',
      'portfolio matching suitability',
      'learning path customization'
    ],
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'nri-financial-services',
    title: 'NRI Financial Services',
    icon: 'https://cdn-icons-png.flaticon.com/128/1570/1570888.png',
    description: 'Specialized financial planning for Non-Resident Indians to manage investments, taxes, and wealth in India. We navigate the complexities of cross-border finance to optimize your India portfolio.',
    features: [
      'NRE/NRO account optimization and tax implications',
      'India investment opportunities (FDs, MFs, Stocks, Real Estate)',
      'Repatriation planning and foreign exchange strategy',
      'Double taxation avoidance agreement (DTAA) benefits',
      'FEMA compliance and regulatory guidance'
    ],
    painPoints: [
      { title: 'Complex Cross-Border Taxation', description: 'Confused about taxes in two countries? We optimize your structure using DTAA benefits and compliance strategies.' },
      { title: 'Limited India Market Access', description: 'Finding it hard to invest in India from abroad? We open doors to the best India investment opportunities suitable for NRIs.' }
    ],
    analysisPoints: [
      'residential status assessment',
      'India portfolio review',
      'repatriation feasibility',
      'tax optimization analysis'
    ],
    image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'emergency-fund-planning',
    title: 'Emergency Fund & Savings Planning',
    icon: 'https://cdn-icons-png.flaticon.com/128/4334/4334686.png',
    description: 'Build a robust financial safety net with structured emergency fund planning and disciplined savings strategies. We help you prepare for life\'s unexpected moments without derailing your long-term goals.',
    features: [
      'Emergency corpus calculation based on monthly expenses',
      'Liquid asset allocation for immediate accessibility',
      'Automated savings discipline and habit formation',
      'Separate goal-based savings buckets creation',
      'Protection against lifestyle inflation and spending leaks'
    ],
    painPoints: [
      { title: 'No Financial Safety Net', description: 'One unexpected expense away from crisis? We build a buffer that lets you handle emergencies without touching investments or going into debt.' },
      { title: 'Inconsistent Savings Habit', description: 'Struggling to save consistently despite earning well? Our automated systems and behavioral frameworks make saving effortless and automatic.' }
    ],
    analysisPoints: [
      'monthly expense audit',
      'emergency corpus gap',
      'liquidity assessment',
      'savings automation setup',
      'spending pattern review'
    ],
    price: '₹999',
    image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'unlisted-preipo-strategy',
    title: 'Unlisted & Pre-IPO Investment Strategy',
    icon: 'https://cdn-icons-png.flaticon.com/128/3135/3135706.png',
    description: 'Access high-growth opportunities before they hit public markets. We help accredited investors navigate the unlisted space with due diligence, valuation analysis, and exit strategy planning for pre-IPO and private equity investments.',
    features: [
      'Pre-IPO company screening and valuation analysis',
      'Unlisted equity and private placement opportunities',
      'ESOP monetization and secondary market access',
      'Portfolio allocation for illiquid assets',
      'Exit strategy planning and timeline optimization'
    ],
    painPoints: [
      { title: 'Limited Access to Growth Companies', description: 'Missing out on multi-bagger opportunities before IPO? We open doors to curated pre-IPO and unlisted investment opportunities.' },
      { title: 'Valuation Uncertainty', description: 'Confused about fair pricing in private markets? Our rigorous valuation framework ensures you do not overpay for future potential.' }
    ],
    analysisPoints: [
      'company fundamentals review',
      'market opportunity assessment',
      'valuation multiple analysis',
      'liquidity timeline planning',
      'portfolio fit evaluation'
    ],
    price: '₹2999',
    image: 'https://images.unsplash.com/photo-1611974765270-ca12586343fc?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'financial-literacy-workshops',
    title: 'Financial Literacy Workshops',
    icon: 'https://cdn-icons-png.flaticon.com/128/18633/18633825.png',
    description: 'Interactive group workshops and seminars for individuals, corporates, and communities to build financial awareness. Perfect for teams, families, or organizations seeking collective financial empowerment.',
    features: [
      'Customized workshops for corporates and employee groups',
      'Family financial planning sessions and wealth discussions',
      'Investment basics and wealth creation fundamentals',
      'Retirement planning and goal-based investing modules',
      'Q&A sessions and personalized guidance within groups'
    ],
    painPoints: [
      { title: 'Low Financial Awareness in Teams', description: 'Employees struggling with personal finance? Our corporate workshops boost productivity by reducing financial stress.' },
      { title: 'Family Money Conflicts', description: 'Different financial priorities causing friction? Our family workshops align goals and create shared financial vision.' }
    ],
    analysisPoints: [
      'audience profiling and needs',
      'customized content design',
      'interactive module planning',
      'follow-up support structure'
    ],
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'lending-strategy',
    title: 'Lending Strategy & Bank Selection',
    icon: 'https://cdn-icons-png.flaticon.com/128/3135/3135706.png',
    description: 'Expert guidance on choosing the right banks and lending products with complete documentation support. We help you navigate loan options, interest rates, and banking relationships to secure the best financing for your needs.',
    features: [
      'Bank comparison and selection based on your profile',
      'Loan product analysis (home, personal, business loans)',
      'Interest rate negotiation and terms optimization',
      'Complete documentation preparation and filing',
      'Credit profile enhancement for better loan terms'
    ],
    painPoints: [
      { title: 'Confusing Bank Options', description: 'Overwhelmed by countless banks and loan products? We simplify the selection process and match you with the best banking partner for your specific needs.' },
      { title: 'Documentation Hassles', description: 'Tired of complex paperwork and repeated bank visits? We handle all documentation preparation and guide you through the entire process seamlessly.' }
    ],
    analysisPoints: [
      'credit score review',
      'income eligibility assessment',
      'bank comparison analysis',
      'documentation checklist',
      'loan terms optimization'
    ],
    price: '₹999',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'ai-portfolio-reports',
    title: 'AI Driven Portfolio Reports',
    icon: 'https://cdn-icons-png.flaticon.com/128/2103/2103633.png',
    description: 'Get intelligent, personalized portfolio analysis reports powered by AI. Our advanced analytics provide deep insights into your investments, performance tracking, and tailored recommendations specifically crafted for your financial goals and risk profile.',
    features: [
      'AI-powered portfolio performance analysis and insights',
      'Personalized investment recommendations based on your goals',
      'Risk assessment and asset allocation optimization',
      'Visual dashboards with trend analysis and forecasting',
      'Automated report generation tailored to your preferences'
    ],
    painPoints: [
      { title: 'Complex Portfolio Data', description: 'Struggling to understand your investment performance? Our AI simplifies complex data into clear, actionable insights you can actually use.' },
      { title: 'Lack of Personalized Guidance', description: 'Generic reports not addressing your needs? Our AI tailors every analysis specifically to your unique financial situation and goals.' }
    ],
    analysisPoints: [
      'portfolio data aggregation',
      'AI model analysis and insights',
      'performance benchmarking',
      'risk profiling and recommendations',
      'customized report generation'
    ],
    price: '₹1,499',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: '1',
    name: 'Rohit Verma',
    role: 'Software Engineer',
    content: "Before working with Guided Wealthy, I had investments but no clear direction. Now I have a structured financial plan and complete clarity about my goals."
  },
  {
    id: '2',
    name: 'Neha Agarwal',
    role: 'Marketing Professional',
    content: "The biggest benefit was simplicity. Everything was explained in a way I could actually understand and follow confidently."
  },
  {
    id: '3',
    name: 'Suresh Reddy',
    role: 'Business Owner',
    content: "Guided Wealthy helped me streamline both my personal and business finances. The clarity I have today is something I lacked for years."
  },
  {
    id: '4',
    name: 'Pooja Mehta',
    role: 'Chartered Accountant',
    content: "I appreciated the honest and practical approach. There was no unnecessary product pushing—just clear, well-thought-out advice."
  },
  {
    id: '5',
    name: 'Karan Malhotra',
    role: 'Entrepreneur',
    content: "My financial decisions are now more disciplined and goal-oriented. The structured guidance made a huge difference."
  },
  {
    id: '6',
    name: 'Anjali Singh',
    role: 'HR Manager',
    content: "I used to delay financial planning, but Guided Wealthy made the entire process simple and stress-free."
  },
  {
    id: '7',
    name: 'Vikash Gupta',
    role: 'IT Consultant',
    content: "The portfolio review and restructuring helped me align my investments with my long-term goals. Highly valuable experience."
  },
  {
    id: '8',
    name: 'Deepika Nair',
    role: 'Doctor',
    content: "As a busy professional, I needed someone reliable. Guided Wealthy provided exactly that—clear guidance and ongoing support."
  },
  {
    id: '9',
    name: 'Manish Jain',
    role: 'Trader',
    content: "What I liked most was the focus on discipline and long-term thinking rather than chasing quick returns."
  },
  {
    id: '10',
    name: 'Sneha Kulkarni',
    role: 'Teacher',
    content: "I finally feel confident about my financial future. The planning process gave me peace of mind and clarity."
  }
];

export const FAQS: FAQ[] = [
  {
    question: "What is the first step in financial planning?",
    answer: "The first step is a comprehensive discovery meeting where we dive deep into your current financial landscape. We analyze your income, expenses, existing assets, and liabilities to create a baseline. This allows us to understand your core values and long-term aspirations before crafting a personalized roadmap."
  },
  {
    question: "Do I need a lot of money to start?",
    answer: "Absolutely not. Financial planning is about the process and discipline, not just the starting amount. Whether you are just starting your career or managing a large estate, the principles of compounding and risk management apply. The earlier you start, the more time your capital has to grow through disciplined habits."
  },
  {
    question: "How often should I review my plan?",
    answer: "We recommend a formal, comprehensive review at least once a year to ensure your strategy remains aligned with your evolving life goals. However, we also suggest immediate reviews whenever a major life event occurs—such as a career change, marriage, or a significant market shift—to make necessary tactical adjustments."
  },
  {
    question: "Are my investments safe?",
    answer: "While all market-linked investments carry inherent risks, our focus is on robust diversification and evidence-based risk management to protect your capital. We don't chase speculative returns; instead, we build resilient portfolios designed to weather market cycles while staying focused on your long-term financial security."
  },
  {
    question: "What makes Guided Wealthy different?",
    answer: "Unlike traditional firms that focus on pushing specific financial products, we focus on personalized architecture and long-term behavioral habits. Our approach is transparent, client-first, and educational. We simplify the complex world of finance into actionable steps that give you complete clarity and peace of mind."
  }
];

export const PRICING_PLANS: PricingPlan[] = [
  {
    name: 'Basic Plan',
    price: '₹499',
    period: '/ Session',
    features: ['Financial Health Check', 'Basic Goal Setting', '20-Min Consultation']
  },
  {
    name: 'Standard Plan',
    price: '₹999',
    period: '/ Month',
    popular: true,
    features: ['Comprehensive Strategy', 'Monthly Reviews', 'Priority Support', 'Tax Optimization']
  },
  {
    name: 'Premium Plan',
    price: '₹2999',
    period: '/ Quarter',
    features: ['Full Portfolio Management', 'Estate Planning', '24/7 Concierge Support', 'Family Wealth Strategy']
  }
];

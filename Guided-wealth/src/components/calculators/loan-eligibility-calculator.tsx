import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp, DollarSign, UserCheck, Briefcase, Building, ShieldCheck, Sliders, Info } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

export default function LoanEligibilityCalculator() {
  // Income & Expenses Inputs
  const [monthlyIncome, setMonthlyIncome] = useState<number>(80000);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(30000);
  const [existingEmis, setExistingEmis] = useState<number>(15000);

  // Loan Details Inputs
  const [interestRate, setInterestRate] = useState<number>(10);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(5);

  // Type & Employment
  const [loanType, setLoanType] = useState<string>('personal'); // personal, home, business
  const [employmentType, setEmploymentType] = useState<string>('salaried'); // salaried, self_employed, business_owner
  const [creditScore, setCreditScore] = useState<number>(750);

  // Advanced Inputs
  const [showAdvanced, setShowAdvanced] = useState<boolean>(true);
  const [age, setAge] = useState<number>(35);
  const [annualBonus, setAnnualBonus] = useState<number>(100000);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Computed Outputs
  const [eligibleLoanAmount, setEligibleLoanAmount] = useState<number>(0);
  const [maxMonthlyEmi, setMaxMonthlyEmi] = useState<number>(0);
  const [dtiRatio, setDtiRatio] = useState<number>(0);
  const [annualInterestPayment, setAnnualInterestPayment] = useState<number>(0);
  const [totalInterestPayment, setTotalInterestPayment] = useState<number>(0);

  useEffect(() => {
    // Total effective net monthly income including bonus prorated monthly
    const effectiveMonthlyIncome = monthlyIncome + annualBonus / 12;

    // FOIR (Fixed Obligation to Income Ratio) limit
    let foirPct = 0.5; // default 50%
    if (loanType === 'home') {
      foirPct = effectiveMonthlyIncome >= 100000 ? 0.6 : 0.55;
    } else if (loanType === 'personal') {
      foirPct = effectiveMonthlyIncome >= 80000 ? 0.55 : 0.5;
    } else {
      foirPct = 0.5;
    }

    // Credit score bonus/penalty multiplier
    let cibilFactor = 1.0;
    if (creditScore >= 750) cibilFactor = 1.0;
    else if (creditScore >= 700) cibilFactor = 0.9;
    else if (creditScore >= 650) cibilFactor = 0.75;
    else cibilFactor = 0.5;

    const maxAllowableEmi = Math.max(0, effectiveMonthlyIncome * foirPct);
    const availableEmiForNewLoan = Math.max(0, (maxAllowableEmi - existingEmis) * cibilFactor);

    const n = Math.max(1, loanTenureYears * 12);
    const r = interestRate / (12 * 100);

    let maxLoan = 0;
    if (availableEmiForNewLoan > 0 && r > 0) {
      const factor = Math.pow(1 + r, n);
      maxLoan = Math.round((availableEmiForNewLoan * (factor - 1)) / (r * factor));
    } else if (availableEmiForNewLoan > 0) {
      maxLoan = Math.round(availableEmiForNewLoan * n);
    }

    const currentDti = effectiveMonthlyIncome > 0 ? (existingEmis / effectiveMonthlyIncome) * 100 : 0;
    const annInterest = Math.round(maxLoan * (interestRate / 100));
    const totInterest = Math.round(availableEmiForNewLoan * n - maxLoan);

    setEligibleLoanAmount(maxLoan);
    setMaxMonthlyEmi(Math.round(availableEmiForNewLoan));
    setDtiRatio(currentDti);
    setAnnualInterestPayment(annInterest);
    setTotalInterestPayment(Math.max(0, totInterest));
  }, [
    monthlyIncome,
    monthlyExpenses,
    existingEmis,
    interestRate,
    loanTenureYears,
    loanType,
    employmentType,
    creditScore,
    age,
    annualBonus,
  ]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'How do banks determine loan eligibility?',
      a: 'Banks assess loan eligibility based on your monthly net income, existing EMI obligations, age, employment type, credit score, and property value (for home loans). The key ratio is FOIR (Fixed Obligation to Income Ratio), which should not exceed 50-60% of net monthly income including the proposed new EMI.',
    },
    {
      q: 'How much home loan can I get on Rs 1 lakh salary?',
      a: 'With a ₹1 Lakh monthly net salary and no existing EMIs, banks may offer a home loan with EMI up to ₹50,000-60,000 (50-60% of income). At 8.5% interest for 20 years, this translates to a loan of approximately ₹55-65 Lakh. Having a working co-applicant can increase eligibility up to ₹80-90 Lakh.',
    },
    {
      q: 'Does CIBIL credit score affect loan eligibility?',
      a: 'Yes, significantly. A CIBIL score above 750 qualifies you for the lowest interest rates and highest loan amounts. Scores between 650-750 may result in higher interest rates or lower approved loan amounts. Below 650, loan approval is unlikely from mainstream banks.',
    },
    {
      q: 'How can I increase my loan eligibility?',
      a: 'You can increase loan eligibility by: 1) Adding a earning co-applicant (spouse/parent), 2) Closing existing credit card debts or small personal loans, 3) Choosing a longer loan tenure, 4) Including regular variable bonuses/incentives in income proof.',
    },
  ];
  const getSliderStyle = (value: number, min: number | string, max: number | string) => {
    const minNum = typeof min === 'string' ? parseFloat(min) : min;
    const maxNum = typeof max === 'string' ? parseFloat(max) : max;
    const percentage = Math.min(100, Math.max(0, ((value - minNum) / (maxNum - minNum)) * 100));
    return {
      background: `linear-gradient(to right, #3b82f6 ${percentage}%, #e2e8f0 ${percentage}%)`
    };
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      {/* Header Banner */}
      <div className="bg-white pt-32 pb-10 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Loan Eligibility Calculator</h1>
        <p className="text-slate-600 text-base">
          Estimate how much loan you may qualify for based on your income, obligations, and financial profile.
        </p>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mt-12">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-[#113262]" /> Income & Expenses
              </h2>

              {/* Monthly Income & Expenses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Monthly Income (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium">₹</span>
                      <input
                        type="number"
                        value={monthlyIncome}
                        onChange={(e) => setMonthlyIncome(Math.max(0, Number(e.target.value)))}
                      />
                    </div>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="1500000"
                    step="5000"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}

                    style={getSliderStyle(monthlyIncome, "10000", "1500000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Monthly Expenses (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium">₹</span>
                      <input
                        type="number"
                        value={monthlyExpenses}
                        onChange={(e) => setMonthlyExpenses(Math.max(0, Number(e.target.value)))}
                      />
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000000"
                    step="5000"
                    value={monthlyExpenses}
                    onChange={(e) => setMonthlyExpenses(Number(e.target.value))}

                    style={getSliderStyle(monthlyExpenses, "0", "1000000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>
              </div>

              {/* Existing EMIs */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-700">Existing Monthly EMIs (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium">₹</span>
                    <CurrencyInput
                    value={existingEmis}
                    onValueChange={(val) => setExistingEmis(val)}
                  />
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="500000"
                  step="2500"
                  value={existingEmis}
                  onChange={(e) => setExistingEmis(Number(e.target.value))}

                  style={getSliderStyle(existingEmis, "0", "500000")}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                />
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#113262]" /> Loan Details
              </h2>

              {/* Interest Rate & Tenure */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Expected Interest Rate (% p.a.)</label>
                    <span className="font-bold text-slate-900 text-sm bg-slate-100 px-2.5 py-1 rounded-md">{interestRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="24"
                    step="0.5"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}

                    style={getSliderStyle(interestRate, "4", "24")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Loan Tenure (Years)</label>
                    <span className="font-bold text-slate-900 text-sm bg-slate-100 px-2.5 py-1 rounded-md">{loanTenureYears} Years</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={loanTenureYears}
                    onChange={(e) => setLoanTenureYears(Number(e.target.value))}

                    style={getSliderStyle(loanTenureYears, "1", "30")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>
              </div>

              {/* Loan Type & Employment */}
              <div className="mb-6 pt-4 border-t border-slate-100">
                <label className="block text-sm font-medium text-slate-700 mb-2">Loan Type</label>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {[
                    { id: 'personal', name: 'Personal Loan', desc: 'No collateral needed' },
                    { id: 'home', name: 'Home Loan', desc: 'Property as collateral' },
                    { id: 'business', name: 'Business Loan', desc: 'For business expansion' },
                  ].map((lt) => (
                    <button
                      key={lt.id}
                      type="button"
                      onClick={() => setLoanType(lt.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${loanType === lt.id
                          ? 'border-[#113262] bg-sky-50/50 text-[#113262] font-semibold ring-2 ring-[#113262]/10'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                    >
                      <div className="text-sm font-bold">{lt.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{lt.desc}</div>
                    </button>
                  ))}
                </div>

                <label className="block text-sm font-medium text-slate-700 mb-2">Employment Type</label>
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { id: 'salaried', name: 'Salaried', desc: 'Regular fixed income' },
                    { id: 'self_employed', name: 'Self-Employed', desc: 'Professional practice' },
                    { id: 'business_owner', name: 'Business Owner', desc: 'Owns a business' },
                  ].map((emp) => (
                    <button
                      key={emp.id}
                      type="button"
                      onClick={() => setEmploymentType(emp.id)}
                      className={`p-3 rounded-xl border text-left transition-all ${employmentType === emp.id
                          ? 'border-[#113262] bg-sky-50/50 text-[#113262] font-semibold ring-2 ring-[#113262]/10'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                    >
                      <div className="text-sm font-bold">{emp.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{emp.desc}</div>
                    </button>
                  ))}
                </div>

                {/* Credit Score */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">CIBIL Credit Score</label>
                    <span className="font-bold text-[#113262] text-sm bg-sky-50 px-2.5 py-1 rounded-md">{creditScore}</span>
                  </div>
                  <input
                    type="range"
                    min="300"
                    max="900"
                    step="10"
                    value={creditScore}
                    onChange={(e) => setCreditScore(Number(e.target.value))}

                    style={getSliderStyle(creditScore, "300", "900")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>300 (Poor)</span>
                    <span>900 (Excellent)</span>
                  </div>
                </div>
              </div>

              {/* Collapsible Advanced Settings */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center justify-between w-full text-sm font-bold text-slate-800 hover:text-[#113262] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#113262]" /> Age & Additional Income
                  </span>
                  {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showAdvanced && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-medium text-slate-700">Age (Years)</label>
                        <span className="font-bold text-slate-900 text-xs">{age} Years</span>
                      </div>
                      <input
                        type="range"
                        min="21"
                        max="70"
                        step="1"
                        value={age}
                        onChange={(e) => setAge(Number(e.target.value))}

                        style={getSliderStyle(age, "21", "70")}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-medium text-slate-700">Annual Bonus/Additional Income (₹)</label>
                        <span className="font-bold text-slate-900 text-xs">{formatCurrency(annualBonus)}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="5000000"
                        step="50000"
                        value={annualBonus}
                        onChange={(e) => setAnnualBonus(Number(e.target.value))}

                        style={getSliderStyle(annualBonus, "0", "5000000")}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Dark Navy Sticky Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="bg-[#1e2a4f] text-white rounded-2xl p-6 shadow-xl border border-slate-800">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold">Loan Eligibility</h3>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Loan Eligibility Summary',
                        text: `Estimated Loan Eligibility: ${formatCurrency(eligibleLoanAmount)} with a maximum monthly EMI capacity of ${formatCurrency(maxMonthlyEmi)}.`,
                        url: window.location.href,
                      }).catch(() => { });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }
                  }}
                  className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                  title="Share"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Highlight Hero Output */}
              <div className="mb-6 p-4 rounded-xl bg-slate-800/80 border border-slate-600/50">
                <div className="text-xs text-slate-400 mb-1 font-medium">Eligible Loan Amount</div>
                <div className="text-3xl font-extrabold text-white">{formatCurrency(eligibleLoanAmount)}</div>
                <div className="text-xs text-emerald-400 mt-1 font-medium">
                  Max Monthly EMI: {formatCurrency(maxMonthlyEmi)}
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-3.5 text-sm border-t border-slate-800 pt-4">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Maximum Monthly EMI</span>
                  <span className="font-semibold text-white">{formatCurrency(maxMonthlyEmi)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Current Debt-to-Income Ratio</span>
                  <span className="font-semibold text-emerald-400">{dtiRatio.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Annual Interest Payment</span>
                  <span className="font-semibold text-white">{formatCurrency(annualInterestPayment)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300 pt-3 border-t border-slate-800">
                  <span className="font-bold text-white">Total Interest Payment</span>
                  <span className="font-bold text-[#EAB308] text-base">{formatCurrency(totalInterestPayment)}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <button
                  onClick={() => window.scrollTo({ top: 1000, behavior: 'smooth' })}
                  className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2"
                >
                  Invest now →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Informational SEO Content & Guide */}
        <div className="max-w-4xl space-y-12 text-slate-700 leading-relaxed mt-12">
          <h2 className="text-xl font-bold text-[#113262] mb-4">Check Your Loan Eligibility</h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6">
            Enter your monthly income, existing EMIs, desired loan tenure, and expected interest rate. The calculator estimates the maximum loan amount you are eligible for, based on standard banking norms. It considers FOIR limits and shows how adding a co-applicant or reducing existing obligations can improve eligibility.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-700 border-t border-slate-100 pt-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Key Components</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li><strong>Monthly Income:</strong> Net take-home salary or profit.</li>
                <li><strong>Existing EMIs:</strong> Total monthly debt repayments.</li>
                <li><strong>Loan Tenure:</strong> Desired borrowing duration.</li>
                <li><strong>Interest Rate:</strong> Expected annual interest rate.</li>
                <li><strong>CIBIL Score:</strong> Credit profile rating (300-900).</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">How It Works</h3>
              <p className="mb-2">Uses banking FOIR norms:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li><strong>Net Disposable Income:</strong> Net Income × FOIR %</li>
                <li><strong>Available EMI:</strong> Net Disposable Income - Existing EMIs</li>
                <li><strong>Max Loan Amount:</strong> Present value of Available EMI over Tenure.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mt-12">
          <h2 className="text-xl font-bold text-[#113262] mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex justify-between items-center p-4 text-left font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-5 h-5 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="p-4 pt-0 text-sm text-slate-600 border-t border-slate-100 bg-slate-50/50 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

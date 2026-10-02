import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp, Home, Building, Sliders, Info } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

export default function HomeLoanEmi() {
  // Inputs
  const [homeLoanAmount, setHomeLoanAmount] = useState<number>(1000000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(20);
  const [propertyType, setPropertyType] = useState<string>('residential'); // residential, commercial

  // Advanced Inputs
  const [showAdvanced, setShowAdvanced] = useState<boolean>(true);
  const [propertyValue, setPropertyValue] = useState<number>(2000000);
  const [alreadyRepaidYears, setAlreadyRepaidYears] = useState<number>(1);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Computed Outputs
  const [monthlyEmi, setMonthlyEmi] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [principalRepaid, setPrincipalRepaid] = useState<number>(0);
  const [interestPaid, setInterestPaid] = useState<number>(0);
  const [outstandingAmount, setOutstandingAmount] = useState<number>(0);
  const [ltvRatio, setLtvRatio] = useState<number>(0);

  useEffect(() => {
    const P = Math.max(0, homeLoanAmount);
    const n = Math.max(1, loanTenureYears * 12);
    const r = interestRate / (12 * 100);

    let emi = 0;
    let totInterest = 0;

    if (P > 0 && r > 0) {
      const factor = Math.pow(1 + r, n);
      emi = Math.round((P * r * factor) / (factor - 1));
      totInterest = Math.round(emi * n - P);
    } else if (P > 0) {
      emi = Math.round(P / n);
      totInterest = 0;
    }

    const totAmt = P + totInterest;

    // Repayment amortization calculation up to alreadyRepaidYears
    const repaidMonths = Math.min(n, alreadyRepaidYears * 12);
    let remPrincipal = P;
    let cumInterest = 0;
    let cumPrincipal = 0;

    let tempBalance = P;
    for (let i = 1; i <= repaidMonths; i++) {
      const mInterest = tempBalance * r;
      const mPrincipal = emi - mInterest;
      cumInterest += mInterest;
      cumPrincipal += mPrincipal;
      tempBalance = Math.max(0, tempBalance - mPrincipal);
    }

    remPrincipal = Math.round(tempBalance);
    cumInterest = Math.round(cumInterest);
    cumPrincipal = Math.round(cumPrincipal);

    const ltv = propertyValue > 0 ? (homeLoanAmount / propertyValue) * 100 : 0;

    setMonthlyEmi(emi);
    setTotalInterest(totInterest);
    setTotalAmount(totAmt);
    setPrincipalRepaid(cumPrincipal);
    setInterestPaid(cumInterest);
    setOutstandingAmount(remPrincipal);
    setLtvRatio(ltv);
  }, [homeLoanAmount, interestRate, loanTenureYears, propertyValue, alreadyRepaidYears]);

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
      q: 'What are the current home loan interest rates in India?',
      a: 'Home loan interest rates in India typically range from 8.25% to 9.50% (as of 2024-2025), depending on your lender, loan amount, and credit score (CIBIL > 750). SBI, HDFC Bank, ICICI Bank, and Bank of Baroda offer competitive rates linked to RBI Repo Rate.',
    },
    {
      q: 'What tax benefits are available on home loans?',
      a: 'Section 24(b): Up to ₹2 Lakh per fiscal year for interest paid on self-occupied property. Section 80C: Up to ₹1.5 Lakh for principal repayment. Section 80EEA: Additional ₹1.5 Lakh interest deduction for first-time affordable housing buyers (if applicable).',
    },
    {
      q: 'Can I prepay my home loan early?',
      a: 'Yes, RBI mandates zero prepayment penalty on floating rate home loans for individual borrowers. Making partial prepayments in the initial 5 years drastically cuts your interest burden and reduces loan tenure by several years.',
    },
    {
      q: 'What is Loan-to-Value (LTV) ratio in home loans?',
      a: 'LTV is the ratio of the loan amount to the appraised value of the property. For loans up to ₹30 Lakh, RBI allows LTV up to 90%. For ₹30 Lakh - ₹75 Lakh, LTV is up to 80%. For loans above ₹75 Lakh, max LTV is 75%.',
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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Home Loan EMI Calculator</h1>
        <p className="text-slate-600 text-base">
          Plan your home loan EMI and understand the total cost of ownership under Indian tax rules.
        </p>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mt-12">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Home className="w-5 h-5 text-[#113262]" /> Loan Details
              </h2>

              {/* Home Loan Amount Slider */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-700">Home Loan Amount (₹)</label>
                  <div className="relative">
                    <CurrencyInput
                    value={homeLoanAmount}
                    onValueChange={(val) => setHomeLoanAmount(val)}
                  />
                  </div>
                </div>
                <input
                  type="range"
                  min="100000"
                  max="100000000"
                  step="100000"
                  value={homeLoanAmount}
                  onChange={(e) => setHomeLoanAmount(Number(e.target.value))}

                  style={getSliderStyle(homeLoanAmount, "100000", "100000000")}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>₹1,00,000</span>
                  <span>₹10,00,00,000</span>
                </div>
              </div>

              {/* Interest Rate & Loan Tenure */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Interest Rate (% p.a.)</label>
                    <span className="font-bold text-slate-900 text-sm bg-slate-100 px-2.5 py-1 rounded-md">{interestRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="20"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}

                    style={getSliderStyle(interestRate, "4", "20")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>4%</span>
                    <span>20%</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Loan Tenure</label>
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
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>1 year</span>
                    <span>30 years</span>
                  </div>
                </div>
              </div>

              {/* Property Type Selection */}
              <div className="mb-6 pt-4 border-t border-slate-100">
                <label className="block text-sm font-medium text-slate-700 mb-2">Property Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPropertyType('residential')}
                    className={`p-3.5 rounded-xl border text-center transition-all ${propertyType === 'residential'
                        ? 'border-[#113262] bg-sky-50/50 text-[#113262] font-semibold ring-2 ring-[#113262]/10'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                  >
                    <div className="text-sm font-bold flex items-center justify-center gap-1.5">
                      <Home className="w-4 h-4 text-[#113262]" /> Residential
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">For personal living</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPropertyType('commercial')}
                    className={`p-3.5 rounded-xl border text-center transition-all ${propertyType === 'commercial'
                        ? 'border-[#113262] bg-sky-50/50 text-[#113262] font-semibold ring-2 ring-[#113262]/10'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                  >
                    <div className="text-sm font-bold flex items-center justify-center gap-1.5">
                      <Building className="w-4 h-4 text-[#113262]" /> Commercial
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">For business use</div>
                  </button>
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
                    <Sliders className="w-4 h-4 text-[#113262]" /> Property Value & Amortization Progress
                  </span>
                  {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showAdvanced && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-medium text-slate-700">Property Value (₹)</label>
                        <span className="font-bold text-slate-900 text-xs">{formatCurrency(propertyValue)}</span>
                      </div>
                      <input
                        type="range"
                        min="1000000"
                        max="150000000"
                        step="500000"
                        value={propertyValue}
                        onChange={(e) => setPropertyValue(Number(e.target.value))}

                        style={getSliderStyle(propertyValue, "1000000", "150000000")}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-medium text-slate-700">Already Repaid (Years)</label>
                        <span className="font-bold text-slate-900 text-xs">{alreadyRepaidYears} Years</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max={loanTenureYears}
                        step="1"
                        value={alreadyRepaidYears}
                        onChange={(e) => setAlreadyRepaidYears(Number(e.target.value))}

                        style={getSliderStyle(alreadyRepaidYears, "0", loanTenureYears)}
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
                <h3 className="text-lg font-bold">Home Loan EMI</h3>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Home Loan EMI Summary',
                        text: `Monthly EMI: ${formatCurrency(monthlyEmi)} for a loan of ${formatCurrency(homeLoanAmount)} at ${interestRate}% for ${loanTenureYears} years.`,
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
                <div className="text-xs text-slate-400 mb-1 font-medium">Monthly EMI</div>
                <div className="text-3xl font-extrabold text-white">{formatCurrency(monthlyEmi)}</div>
                <div className="text-xs text-emerald-400 mt-1 font-medium">
                  Total Repayment: {formatCurrency(totalAmount)}
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-3.5 text-sm border-t border-slate-800 pt-4">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Principal Amount</span>
                  <span className="font-semibold text-white">{formatCurrency(homeLoanAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Total Interest</span>
                  <span className="font-semibold text-rose-400">{formatCurrency(totalInterest)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Total Amount</span>
                  <span className="font-semibold text-[#EAB308]">{formatCurrency(totalAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Principal Repaid</span>
                  <span className="font-semibold text-emerald-400">{formatCurrency(principalRepaid)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Interest Paid</span>
                  <span className="font-semibold text-white">{formatCurrency(interestPaid)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Outstanding Amount</span>
                  <span className="font-semibold text-sky-400">{formatCurrency(outstandingAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300 pt-3 border-t border-slate-800">
                  <span className="font-bold text-white">Loan-to-Value (LTV) Ratio</span>
                  <span className="font-bold text-emerald-400 text-base">{ltvRatio.toFixed(2)}%</span>
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

        {/* Extensive Informational Guide */}
        <div className="max-w-4xl space-y-12 text-slate-700 leading-relaxed mt-12">
          <div>
            <h2 className="text-xl font-bold text-[#113262] mb-4">Understanding Home Loans</h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Navigate the path to homeownership with our comprehensive guide and calculator.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-700 border-t border-slate-100 pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">What is a Home Loan?</h3>
                <p className="text-slate-600 leading-relaxed">
                  A home loan is a financial instrument designed to help individuals purchase or construct a property, with the property serving as collateral. The loan amount (75-90% of property value) is repaid in EMIs over 15-30 years.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Benefits of Home Financing</h3>
                <p className="text-slate-600 leading-relaxed">
                  Tax benefits under Sec 24(b) and Sec 80C, equity building, inflation protection, wealth creation through property appreciation, and disciplined long-term saving.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Home Loan Eligibility Criteria</h3>
                <p className="text-slate-600 leading-relaxed">
                  Age (21-65 years), income stability, credit score (750+), property assessment valuation, debt-to-income ratio.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Application Process Guide</h3>
                <p className="text-slate-600 leading-relaxed">
                  1. Application & Proofs → 2. Technical Property Evaluation → 3. Sanction Letter & Legal Documentation → 4. Disbursement.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Home Loan Prepayment Strategy</h3>
                <p className="text-slate-600 leading-relaxed">
                  Prepaying even small amounts in the early years (when interest is highest) dramatically reduces total interest and tenure. Prepaying ₹5 Lakh on a ₹50 Lakh loan in Year 3 saves up to ₹8-10 Lakh in interest.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Planning Card */}
        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mt-12">
          <h2 className="text-xl font-bold text-[#113262] mb-4">Planning Your Home Purchase</h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Enter the property value, down payment, interest rate, and tenure. The calculator shows your monthly EMI, total interest over the loan life, and amortization breakdown. It helps compare different tenure options and understand the true cost of home ownership.
          </p>
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

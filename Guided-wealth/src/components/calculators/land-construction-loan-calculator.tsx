import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp, HardHat, Calendar, Percent, Sliders, Info } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

export default function LandConstructionLoanCalculator() {
  // Inputs
  const [landCost, setLandCost] = useState<number>(500000);
  const [constructionCost, setConstructionCost] = useState<number>(1000000);
  const [downPaymentPct, setDownPaymentPct] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [constructionMonths, setConstructionMonths] = useState<number>(12);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(20);

  // Advanced Inputs
  const [showAdvanced, setShowAdvanced] = useState<boolean>(true);
  const [yearsRepaid, setYearsRepaid] = useState<number>(1);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Computed Outputs
  const [totalProjectCost, setTotalProjectCost] = useState<number>(0);
  const [downPaymentAmount, setDownPaymentAmount] = useState<number>(0);
  const [loanPrincipal, setLoanPrincipal] = useState<number>(0);
  const [preEmiInterest, setPreEmiInterest] = useState<number>(0);
  const [monthlyEmi, setMonthlyEmi] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalAmountPayable, setTotalAmountPayable] = useState<number>(0);
  const [principalRepaid, setPrincipalRepaid] = useState<number>(0);
  const [interestPaid, setInterestPaid] = useState<number>(0);
  const [outstandingAmount, setOutstandingAmount] = useState<number>(0);

  useEffect(() => {
    const projCost = landCost + constructionCost;
    const downAmt = Math.round(projCost * (downPaymentPct / 100));
    const P = Math.max(0, projCost - downAmt);

    // Pre-EMI Interest during construction period (Simple interest accrued)
    const preEmi = Math.round(P * (interestRate / 100) * (constructionMonths / 12));

    const n = Math.max(1, loanTenureYears * 12);
    const r = interestRate / (12 * 100);

    let emi = 0;
    let fullEmiInterest = 0;

    if (P > 0 && r > 0) {
      const factor = Math.pow(1 + r, n);
      emi = Math.round((P * r * factor) / (factor - 1));
      fullEmiInterest = Math.round(emi * n - P);
    } else if (P > 0) {
      emi = Math.round(P / n);
      fullEmiInterest = 0;
    }

    const totInterest = preEmi + fullEmiInterest;
    const totPayable = P + totInterest;

    // Repayment progress after full EMI starts
    const repaidMonths = Math.min(n, yearsRepaid * 12);
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

    setTotalProjectCost(projCost);
    setDownPaymentAmount(downAmt);
    setLoanPrincipal(P);
    setPreEmiInterest(preEmi);
    setMonthlyEmi(emi);
    setTotalInterest(totInterest);
    setTotalAmountPayable(totPayable);
    setPrincipalRepaid(cumPrincipal);
    setInterestPaid(cumInterest);
    setOutstandingAmount(remPrincipal);
  }, [landCost, constructionCost, downPaymentPct, interestRate, constructionMonths, loanTenureYears, yearsRepaid]);

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
      q: 'How does a land and construction loan work?',
      a: 'This loan finances both the purchase of a plot and subsequent construction. Funds are disbursed in stages: first for land purchase, then in tranches as construction progresses. During construction, you pay only pre-EMI interest on disbursed amounts. Full EMI begins after construction completion.',
    },
    {
      q: 'What is the interest rate for construction loans?',
      a: 'Construction loan rates are similar to home loan rates (8.25-9.50%) since the land and building serve as collateral. However, during the construction phase, you pay only simple pre-EMI interest.',
    },
    {
      q: 'Can I claim tax benefits on a construction loan?',
      a: 'Tax benefits under Section 24(b) and Section 80C are available only AFTER construction is completed. The pre-construction interest paid during construction can be claimed in 5 equal annual installments starting from the year of completion.',
    },
    {
      q: 'What is the maximum timeline for construction?',
      a: 'Banks require construction to be completed within 3 years from the first loan disbursement to qualify for home loan tax benefits under Section 24(b).',
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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Land Construction Loan Calculator</h1>
        <p className="text-slate-600 text-base">
          Calculate your land purchase and construction loan EMI, pre-EMI interest, and total project costs.
        </p>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mt-12">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <HardHat className="w-5 h-5 text-[#113262]" /> Project Costs
              </h2>

              {/* Land Cost & Construction Cost */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Land Cost (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium">₹</span>
                      <CurrencyInput
                    value={landCost}
                    onValueChange={(val) => setLandCost(val)}
                  />
                    </div>
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="50000000"
                    step="100000"
                    value={landCost}
                    onChange={(e) => setLandCost(Number(e.target.value))}

                    style={getSliderStyle(landCost, "100000", "50000000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Construction Cost (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium">₹</span>
                      <CurrencyInput
                    value={constructionCost}
                    onValueChange={(val) => setConstructionCost(val)}
                  />
                    </div>
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="100000000"
                    step="100000"
                    value={constructionCost}
                    onChange={(e) => setConstructionCost(Number(e.target.value))}

                    style={getSliderStyle(constructionCost, "100000", "100000000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                <Percent className="w-5 h-5 text-[#113262]" /> Loan Terms
              </h2>

              {/* Down Payment & Interest Rate */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Down Payment (%)</label>
                    <span className="font-bold text-slate-900 text-sm bg-slate-100 px-2.5 py-1 rounded-md">{downPaymentPct}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    step="5"
                    value={downPaymentPct}
                    onChange={(e) => setDownPaymentPct(Number(e.target.value))}

                    style={getSliderStyle(downPaymentPct, "10", "50")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Interest Rate (% p.a.)</label>
                    <span className="font-bold text-slate-900 text-sm bg-slate-100 px-2.5 py-1 rounded-md">{interestRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="16"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}

                    style={getSliderStyle(interestRate, "4", "16")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#113262]" /> Timeline
              </h2>

              {/* Construction Period & Loan Tenure */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Construction Period (Months)</label>
                    <span className="font-bold text-[#113262] text-sm bg-sky-50 px-2.5 py-1 rounded-md">{constructionMonths} Months</span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="36"
                    step="6"
                    value={constructionMonths}
                    onChange={(e) => setConstructionMonths(Number(e.target.value))}

                    style={getSliderStyle(constructionMonths, "6", "36")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>6 months</span>
                    <span>36 months</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Loan Tenure (Years)</label>
                    <span className="font-bold text-slate-900 text-sm bg-slate-100 px-2.5 py-1 rounded-md">{loanTenureYears} Years</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="30"
                    step="1"
                    value={loanTenureYears}
                    onChange={(e) => setLoanTenureYears(Number(e.target.value))}

                    style={getSliderStyle(loanTenureYears, "5", "30")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>5 years</span>
                    <span>30 years</span>
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
                    <Sliders className="w-4 h-4 text-[#113262]" /> Years Repaid Progress
                  </span>
                  {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showAdvanced && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-medium text-slate-700">Years Repaid (Already Repaid)</label>
                      <span className="font-bold text-slate-900 text-xs">{yearsRepaid} Years</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={loanTenureYears}
                      step="1"
                      value={yearsRepaid}
                      onChange={(e) => setYearsRepaid(Number(e.target.value))}

                      style={getSliderStyle(yearsRepaid, "0", loanTenureYears)}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Dark Navy Sticky Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="bg-[#1e2a4f] text-white rounded-2xl p-6 shadow-xl border border-slate-800">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold">Monthly Payment</h3>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Land Construction Loan EMI Summary',
                        text: `Monthly EMI: ${formatCurrency(monthlyEmi)} for a project cost of ${formatCurrency(totalProjectCost)}. Pre-EMI interest: ${formatCurrency(preEmiInterest)}.`,
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
                <div className="text-xs text-slate-400 mb-1 font-medium">Monthly EMI after construction</div>
                <div className="text-3xl font-extrabold text-white">{formatCurrency(monthlyEmi)}</div>
                <div className="text-xs text-emerald-400 mt-1 font-medium">
                  Total Project Cost: {formatCurrency(totalProjectCost)}
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-3.5 text-sm border-t border-slate-800 pt-4">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Total Project Cost</span>
                  <span className="font-semibold text-white">{formatCurrency(totalProjectCost)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Down Payment</span>
                  <span className="font-semibold text-emerald-400">{formatCurrency(downPaymentAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Pre-EMI Interest</span>
                  <span className="font-semibold text-[#EAB308]">{formatCurrency(preEmiInterest)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Outstanding Amount</span>
                  <span className="font-semibold text-sky-400">{formatCurrency(outstandingAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Principal Repaid</span>
                  <span className="font-semibold text-emerald-400">{formatCurrency(principalRepaid)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300 pt-3 border-t border-slate-800">
                  <span className="font-bold text-white">Total Interest</span>
                  <span className="font-bold text-[#EAB308] text-base">{formatCurrency(totalInterest)}</span>
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
            <h2 className="text-xl font-bold text-[#113262] mb-4">What is a Land Construction Loan?</h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Build your dream home from the ground up with our comprehensive guide to land and construction financing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-700 border-t border-slate-100 pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Understanding Land Construction Loans</h3>
                <p className="text-slate-600 leading-relaxed">
                  A land construction loan combines the purchase of a plot with construction funding. This dual-purpose loan finances up to 80% of the total project cost in stages.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Key Features and Benefits</h3>
                <p className="text-slate-600 leading-relaxed">
                  Single application for plot and building, stage-wise disbursement, tax benefits on pre-construction interest, flexible pre-EMI payments, and extended tenures up to 30 years.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Loan Components</h3>
                <p className="text-slate-600 leading-relaxed">
                  Land Purchase (Plot cost, registration, legal fees) and Construction Funding (Foundation, structure, interiors, external works, architect fees).
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Disbursement Process</h3>
                <p className="text-slate-600 leading-relaxed">
                  1. Initial Stage (Land purchase) → 2. Foundation Stage → 3. Construction Phases → 4. Final Stage & Completion Certificate.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Using Axiom's Land Construction Calculator</h3>
                <p className="text-slate-600 leading-relaxed">
                  Computes pre-EMI interest during construction, post-construction monthly EMI, and total interest burden across project stages.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Planning Card */}
        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mt-12">
          <h2 className="text-xl font-bold text-[#113262] mb-4">Planning Your Construction Finance</h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Enter the total project cost (land + construction), expected disbursement schedule, interest rate, and tenure. The calculator shows the pre-EMI interest during construction, full EMI after completion, and total cost of the project including financing.
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

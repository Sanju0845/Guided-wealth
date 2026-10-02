import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp, Heart, Percent, Calendar, Sliders, Info } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

export default function MarriageLoanCalculator() {
  // Expense Inputs
  const [venueCost, setVenueCost] = useState<number>(50000);
  const [cateringCost, setCateringCost] = useState<number>(30000);
  const [apparelCost, setApparelCost] = useState<number>(40000);
  const [otherCost, setOtherCost] = useState<number>(30000);

  // Loan Terms Inputs
  const [downPaymentPct, setDownPaymentPct] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(10.5);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(3);
  const [processingFeePct, setProcessingFeePct] = useState<number>(1);

  // Advanced Inputs
  const [showAdvanced, setShowAdvanced] = useState<boolean>(true);
  const [yearsRepaid, setYearsRepaid] = useState<number>(1);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Computed Outputs
  const [totalWeddingCost, setTotalWeddingCost] = useState<number>(0);
  const [downPaymentAmount, setDownPaymentAmount] = useState<number>(0);
  const [principalLoanAmount, setPrincipalLoanAmount] = useState<number>(0);
  const [processingFeeAmount, setProcessingFeeAmount] = useState<number>(0);
  const [monthlyEmi, setMonthlyEmi] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalRepayment, setTotalRepayment] = useState<number>(0);
  const [principalRepaid, setPrincipalRepaid] = useState<number>(0);
  const [interestPaid, setInterestPaid] = useState<number>(0);
  const [outstandingAmount, setOutstandingAmount] = useState<number>(0);

  useEffect(() => {
    const totCost = venueCost + cateringCost + apparelCost + otherCost;
    const downAmt = Math.round(totCost * (downPaymentPct / 100));
    const P = Math.max(0, totCost - downAmt);
    const procFee = Math.round(P * (processingFeePct / 100));

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

    const totRepay = P + totInterest + procFee;

    // Repayment progress after yearsRepaid
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

    setTotalWeddingCost(totCost);
    setDownPaymentAmount(downAmt);
    setPrincipalLoanAmount(P);
    setProcessingFeeAmount(procFee);
    setMonthlyEmi(emi);
    setTotalInterest(totInterest);
    setTotalRepayment(totRepay);
    setPrincipalRepaid(cumPrincipal);
    setInterestPaid(cumInterest);
    setOutstandingAmount(remPrincipal);
  }, [
    venueCost,
    cateringCost,
    apparelCost,
    otherCost,
    downPaymentPct,
    interestRate,
    loanTenureYears,
    processingFeePct,
    yearsRepaid,
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
      q: 'What is a marriage loan?',
      a: 'A marriage loan is an unsecured personal loan taken to fund wedding expenses including venue, catering, jewelry, and ceremonies. Interest rates range from 10-16%, with loan amounts typically from ₹1 Lakh to ₹25 Lakh and tenures of 1-5 years.',
    },
    {
      q: 'Should I take a loan for a wedding?',
      a: 'Financial planners recommend avoiding large wedding loans as they fund a depreciating event. If necessary, borrow only the minimum required, opt for the shortest affordable tenure (2-3 years), and consider gold loans or SIP savings as cheaper alternatives.',
    },
    {
      q: 'How can I reduce my marriage loan cost?',
      a: 'Compare rates across banks/NBFCs, maintain a CIBIL score above 750 for lower interest, make a larger down payment, choose a shorter tenure, or prepay the loan early when bonuses arrive.',
    },
    {
      q: 'What documents are required for a marriage loan?',
      a: 'Identity proof, address proof, last 3 months salary slips, 6 months bank statements, and wedding invitation/vendor quotes (if requested by lender).',
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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Marriage Loan Calculator</h1>
        <p className="text-slate-600 text-base">
          Plan your wedding expenses, calculate monthly EMI, and compare financing options.
        </p>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mt-12">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Heart className="w-5 h-5 text-[#113262]" /> Wedding Expenses
              </h2>

              {/* Venue & Catering */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Venue & Decoration (₹)</label>
                    <div className="relative">
                      <CurrencyInput
                    value={venueCost}
                    onValueChange={(val) => setVenueCost(val)}
                  />
                    </div>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="1000000"
                    step="10000"
                    value={venueCost}
                    onChange={(e) => setVenueCost(Number(e.target.value))}

                    style={getSliderStyle(venueCost, "10000", "1000000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Catering & Food (₹)</label>
                    <div className="relative">
                      <CurrencyInput
                    value={cateringCost}
                    onValueChange={(val) => setCateringCost(val)}
                  />
                    </div>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="1000000"
                    step="10000"
                    value={cateringCost}
                    onChange={(e) => setCateringCost(Number(e.target.value))}

                    style={getSliderStyle(cateringCost, "10000", "1000000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>
              </div>

              {/* Apparel & Other */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Apparel & Jewelry (₹)</label>
                    <div className="relative">
                      <CurrencyInput
                    value={apparelCost}
                    onValueChange={(val) => setApparelCost(val)}
                  />
                    </div>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="1000000"
                    step="10000"
                    value={apparelCost}
                    onChange={(e) => setApparelCost(Number(e.target.value))}

                    style={getSliderStyle(apparelCost, "10000", "1000000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Other Expenses (Photos, Music) (₹)</label>
                    <div className="relative">
                      <CurrencyInput
                    value={otherCost}
                    onValueChange={(val) => setOtherCost(val)}
                  />
                    </div>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="1000000"
                    step="5000"
                    value={otherCost}
                    onChange={(e) => setOtherCost(Number(e.target.value))}

                    style={getSliderStyle(otherCost, "5000", "1000000")}
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
                    min="0"
                    max="50"
                    step="5"
                    value={downPaymentPct}
                    onChange={(e) => setDownPaymentPct(Number(e.target.value))}

                    style={getSliderStyle(downPaymentPct, "0", "50")}
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
                    min="8"
                    max="24"
                    step="0.5"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}

                    style={getSliderStyle(interestRate, "8", "24")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>
              </div>

              {/* Loan Tenure & Processing Fee */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Loan Tenure (Years)</label>
                    <span className="font-bold text-slate-900 text-sm bg-slate-100 px-2.5 py-1 rounded-md">{loanTenureYears} Years</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    step="1"
                    value={loanTenureYears}
                    onChange={(e) => setLoanTenureYears(Number(e.target.value))}

                    style={getSliderStyle(loanTenureYears, "1", "5")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>1 year</span>
                    <span>5 years</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Processing Fee (%)</label>
                    <span className="font-bold text-slate-900 text-sm bg-slate-100 px-2.5 py-1 rounded-md">{processingFeePct}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.25"
                    value={processingFeePct}
                    onChange={(e) => setProcessingFeePct(Number(e.target.value))}

                    style={getSliderStyle(processingFeePct, "0", "5")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
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
                        title: 'Marriage Loan Summary',
                        text: `Monthly EMI: ${formatCurrency(monthlyEmi)} for wedding expenses of ${formatCurrency(totalWeddingCost)}. Total Interest: ${formatCurrency(totalInterest)}.`,
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
                  Total Wedding Cost: {formatCurrency(totalWeddingCost)}
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-3.5 text-sm border-t border-slate-800 pt-4">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Total Wedding Cost</span>
                  <span className="font-semibold text-white">{formatCurrency(totalWeddingCost)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Down Payment</span>
                  <span className="font-semibold text-emerald-400">{formatCurrency(downPaymentAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Processing Fee</span>
                  <span className="font-semibold text-white">{formatCurrency(processingFeeAmount)}</span>
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
            <h2 className="text-xl font-bold text-[#113262] mb-4">What is a Marriage Loan?</h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Plan your dream wedding with our comprehensive guide to marriage financing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-700 border-t border-slate-100 pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Understanding Marriage Loans</h3>
                <p className="text-slate-600 leading-relaxed">
                  A marriage loan is a specialized personal loan designed to cover wedding expenses, offering ₹1 Lakh to ₹25 Lakhs with 12 to 60 months tenure based on creditworthiness.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Wedding Expenses Covered</h3>
                <p className="text-slate-600 leading-relaxed">
                  Venue & catering, wedding attire & jewelry, event services (photography, music, decor), and honeymoon/guest arrangements.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Key Benefits</h3>
                <p className="text-slate-600 leading-relaxed">
                  Faster approval, no collateral requirement, freedom to allocate funds, predictable monthly EMIs, and instant digital disbursement.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Eligibility & Application Steps</h3>
                <p className="text-slate-600 leading-relaxed">
                  Age 21-58, net monthly income ₹20,000+, 700+ CIBIL score. 1. Budget & Eligibility → 2. Document Submission → 3. Verification → 4. Disbursement.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Using Axiom's Marriage Loan Calculator</h3>
                <p className="text-slate-600 leading-relaxed">
                  Estimates total wedding costs across categories, net loan after down payment, monthly EMI, and total interest cost.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Planning Card */}
        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mt-12">
          <h2 className="text-xl font-bold text-[#113262] mb-4">Wedding Financing Options</h2>
          <p className="text-slate-600 text-base leading-relaxed">
            This calculator helps you estimate the EMI and total cost of financing your wedding. Enter the loan amount, interest rate, and tenure to see your monthly obligation. It also compares the cost of a personal loan versus a gold loan for the same amount, helping you choose the cheaper option.
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

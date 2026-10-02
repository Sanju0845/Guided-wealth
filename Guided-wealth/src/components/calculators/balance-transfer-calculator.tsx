import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp, RefreshCw, Percent, Calendar, Sliders, Info } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

export default function BalanceTransferCalculator() {
  // Current Loan Inputs
  const [outstandingAmount, setOutstandingAmount] = useState<number>(1000000);
  const [currentEmi, setCurrentEmi] = useState<number>(10500);
  const [currentInterestRate, setCurrentInterestRate] = useState<number>(9.5);
  const [remainingTenureYears, setRemainingTenureYears] = useState<number>(15);

  // New Loan Inputs
  const [newInterestRate, setNewInterestRate] = useState<number>(8.0);
  const [newLoanTenureYears, setNewLoanTenureYears] = useState<number>(15);

  // Advanced Inputs
  const [showAdvanced, setShowAdvanced] = useState<boolean>(true);
  const [processingFeePct, setProcessingFeePct] = useState<number>(1);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Computed Outputs
  const [newMonthlyEmi, setNewMonthlyEmi] = useState<number>(0);
  const [monthlySavings, setMonthlySavings] = useState<number>(0);
  const [processingFeeAmount, setProcessingFeeAmount] = useState<number>(0);
  const [breakevenMonths, setBreakevenMonths] = useState<number>(0);
  const [totalInterestOld, setTotalInterestOld] = useState<number>(0);
  const [totalInterestNew, setTotalInterestNew] = useState<number>(0);
  const [netInterestSavings, setNetInterestSavings] = useState<number>(0);

  useEffect(() => {
    const P = Math.max(0, outstandingAmount);
    const nOld = Math.max(1, remainingTenureYears * 12);
    const totIntOld = Math.max(0, Math.round(currentEmi * nOld - P));

    const nNew = Math.max(1, newLoanTenureYears * 12);
    const rNew = newInterestRate / (12 * 100);

    let newEmi = 0;
    let totIntNew = 0;

    if (P > 0 && rNew > 0) {
      const factorNew = Math.pow(1 + rNew, nNew);
      newEmi = Math.round((P * rNew * factorNew) / (factorNew - 1));
      totIntNew = Math.round(newEmi * nNew - P);
    } else if (P > 0) {
      newEmi = Math.round(P / nNew);
      totIntNew = 0;
    }

    const feeAmt = Math.round(P * (processingFeePct / 100));
    const mSavings = currentEmi - newEmi;
    const breakeven = mSavings > 0 ? Math.ceil(feeAmt / mSavings) : 0;
    const netSavings = totIntOld - totIntNew - feeAmt;

    setNewMonthlyEmi(newEmi);
    setMonthlySavings(mSavings);
    setProcessingFeeAmount(feeAmt);
    setBreakevenMonths(breakeven);
    setTotalInterestOld(totIntOld);
    setTotalInterestNew(totIntNew);
    setNetInterestSavings(netSavings);
  }, [
    outstandingAmount,
    currentEmi,
    currentInterestRate,
    remainingTenureYears,
    newInterestRate,
    newLoanTenureYears,
    processingFeePct,
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
      q: 'What is a loan balance transfer?',
      a: 'A loan balance transfer involves moving your existing loan (home loan, personal loan, or credit card balance) from your current bank to another lender offering a lower interest rate. The new lender pays off your old loan, and you continue repayment at lower rates, saving significantly on total interest.',
    },
    {
      q: 'When does a balance transfer make sense?',
      a: 'A balance transfer is worthwhile if the interest rate difference is at least 0.5-1%, the remaining loan tenure is long enough (5+ years for home loans), and the total interest savings outweigh transfer costs (processing fee, legal fees, valuation charges).',
    },
    {
      q: 'What are the charges for a loan balance transfer?',
      a: 'The new lender charges a processing fee (0.25-1% of loan amount), legal and valuation fees, and stamp duty on the new agreement. Floating rate home loans carry zero prepayment penalty from the existing lender under RBI norms.',
    },
    {
      q: 'Can I top up my loan during balance transfer?',
      a: 'Yes! Most banks offer top-up loans along with balance transfers at attractive interest rates, giving you extra liquidity for home renovation, debt consolidation, or personal needs.',
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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Balance Transfer Calculator</h1>
        <p className="text-slate-600 text-base">
          Calculate your net interest savings, monthly EMI reduction, and break-even timeline when transferring your loan.
        </p>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mt-12">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-[#113262]" /> Current Loan Details
              </h2>

              {/* Outstanding Amount & Current EMI */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Outstanding Amount (₹)</label>
                    <div className="relative">
                      <CurrencyInput
                    value={outstandingAmount}
                    onValueChange={(val) => setOutstandingAmount(val)}
                  />
                    </div>
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="100000000"
                    step="100000"
                    value={outstandingAmount}
                    onChange={(e) => setOutstandingAmount(Number(e.target.value))}

                    style={getSliderStyle(outstandingAmount, "100000", "100000000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Current EMI (₹)</label>
                    <div className="relative">
                      <CurrencyInput
                    value={currentEmi}
                    onValueChange={(val) => setCurrentEmi(val)}
                  />
                    </div>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="500000"
                    step="1000"
                    value={currentEmi}
                    onChange={(e) => setCurrentEmi(Number(e.target.value))}

                    style={getSliderStyle(currentEmi, "1000", "500000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>
              </div>

              {/* Current Interest Rate & Remaining Tenure */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Current Interest Rate (% p.a.)</label>
                    <span className="font-bold text-slate-900 text-sm bg-slate-100 px-2.5 py-1 rounded-md">{currentInterestRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="24"
                    step="0.1"
                    value={currentInterestRate}
                    onChange={(e) => setCurrentInterestRate(Number(e.target.value))}

                    style={getSliderStyle(currentInterestRate, "4", "24")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Remaining Tenure (Years)</label>
                    <span className="font-bold text-slate-900 text-sm bg-slate-100 px-2.5 py-1 rounded-md">{remainingTenureYears} Years</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={remainingTenureYears}
                    onChange={(e) => setRemainingTenureYears(Number(e.target.value))}

                    style={getSliderStyle(remainingTenureYears, "1", "30")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                <Percent className="w-5 h-5 text-[#113262]" /> New Loan Details
              </h2>

              {/* New Interest Rate & New Loan Tenure */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">New Interest Rate (% p.a.)</label>
                    <span className="font-bold text-[#113262] text-sm bg-sky-50 px-2.5 py-1 rounded-md">{newInterestRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="24"
                    step="0.1"
                    value={newInterestRate}
                    onChange={(e) => setNewInterestRate(Number(e.target.value))}

                    style={getSliderStyle(newInterestRate, "4", "24")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">New Loan Tenure (Years)</label>
                    <span className="font-bold text-slate-900 text-sm bg-slate-100 px-2.5 py-1 rounded-md">{newLoanTenureYears} Years</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={newLoanTenureYears}
                    onChange={(e) => setNewLoanTenureYears(Number(e.target.value))}

                    style={getSliderStyle(newLoanTenureYears, "1", "30")}
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
                    <Sliders className="w-4 h-4 text-[#113262]" /> Processing Fee Settings
                  </span>
                  {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showAdvanced && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-medium text-slate-700">Processing Fee (%)</label>
                      <span className="font-bold text-slate-900 text-xs">{processingFeePct}%</span>
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
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Dark Navy Sticky Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="bg-[#1e2a4f] text-white rounded-2xl p-6 shadow-xl border border-slate-800">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold">Balance Transfer Benefits</h3>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Balance Transfer Summary',
                        text: `New Monthly EMI: ${formatCurrency(newMonthlyEmi)} (Savings: ${formatCurrency(monthlySavings)}/month). Net Interest Savings: ${formatCurrency(netInterestSavings)}.`,
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
                <div className="text-xs text-slate-400 mb-1 font-medium">New Monthly EMI</div>
                <div className="text-3xl font-extrabold text-white">{formatCurrency(newMonthlyEmi)}</div>
                <div className="text-xs text-emerald-400 mt-1 font-medium flex items-center gap-1">
                  <span>Save {formatCurrency(monthlySavings)} / month</span>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-3.5 text-sm border-t border-slate-800 pt-4">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Monthly Savings</span>
                  <span className="font-semibold text-emerald-400">{formatCurrency(monthlySavings)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Processing Fee</span>
                  <span className="font-semibold text-white">{formatCurrency(processingFeeAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Break-even Period</span>
                  <span className="font-semibold text-sky-400">{breakevenMonths} months</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Total Interest (Old Loan)</span>
                  <span className="font-semibold text-rose-400">{formatCurrency(totalInterestOld)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Total Interest (New Loan)</span>
                  <span className="font-semibold text-white">{formatCurrency(totalInterestNew)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300 pt-3 border-t border-slate-800">
                  <span className="font-bold text-white">Interest Savings</span>
                  <span className="font-bold text-[#EAB308] text-base">{formatCurrency(netInterestSavings)}</span>
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
          <h2 className="text-xl font-bold text-[#113262] mb-4">How This Calculator Works</h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6">
            Enter your current loan outstanding, current interest rate, remaining tenure, and the new lender offered rate. The calculator compares total interest under both scenarios, shows monthly EMI savings, and calculates the break-even period after accounting for transfer costs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-700 border-t border-slate-100 pt-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Key Components</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li><strong>Current Balance:</strong> Unpaid loan principal.</li>
                <li><strong>Current Interest Rate:</strong> Rate charged by existing lender.</li>
                <li><strong>New Interest Rate:</strong> Lower rate offered by new bank.</li>
                <li><strong>Processing Fee:</strong> One-time transfer charges.</li>
                <li><strong>Break-Even Period:</strong> Months to recover transfer costs.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">How It Works</h3>
              <p className="mb-2">The calculator considers various factors to determine net savings:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li><strong>Old Interest:</strong> (Current EMI × Remaining Months) - Balance</li>
                <li><strong>New Interest:</strong> (New EMI × New Months) - Balance</li>
                <li><strong>Net Savings:</strong> Old Interest - New Interest - Processing Fee</li>
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

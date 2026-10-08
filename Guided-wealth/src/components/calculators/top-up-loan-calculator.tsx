import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp, PlusCircle, CreditCard, Percent, Calendar, Info } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

export default function TopUpLoanCalculator() {
  // Existing Loan Inputs
  const [currentLoanAmount, setCurrentLoanAmount] = useState<number>(1000000);
  const [currentEmi, setCurrentEmi] = useState<number>(12000);
  const [remainingTenureYears, setRemainingTenureYears] = useState<number>(5);
  const [currentInterestRate, setCurrentInterestRate] = useState<number>(8.5);

  // Top-Up Loan Inputs
  const [topUpAmount, setTopUpAmount] = useState<number>(500000);
  const [newInterestRate, setNewInterestRate] = useState<number>(9);
  const [newLoanTenureYears, setNewLoanTenureYears] = useState<number>(10);
  const [processingFeePct, setProcessingFeePct] = useState<number>(1);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Computed Outputs
  const [outstandingPrincipal, setOutstandingPrincipal] = useState<number>(0);
  const [newLoanAmount, setNewLoanAmount] = useState<number>(0);
  const [newMonthlyEmi, setNewMonthlyEmi] = useState<number>(0);
  const [processingFeeAmount, setProcessingFeeAmount] = useState<number>(0);
  const [emiDifference, setEmiDifference] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);

  useEffect(() => {
    // Outstanding principal calculation from remaining EMIs
    const nCurr = Math.max(1, remainingTenureYears * 12);
    const rCurr = currentInterestRate / (12 * 100);

    let outP = 0;
    if (currentEmi > 0 && rCurr > 0) {
      const factor = Math.pow(1 + rCurr, nCurr);
      outP = Math.round((currentEmi * (factor - 1)) / (rCurr * factor));
    } else if (currentEmi > 0) {
      outP = Math.round(currentEmi * nCurr);
    }

    const combinedLoan = outP + topUpAmount;
    const feeAmt = Math.round(topUpAmount * (processingFeePct / 100));

    const nNew = Math.max(1, newLoanTenureYears * 12);
    const rNew = newInterestRate / (12 * 100);

    let newEmi = 0;
    let totInt = 0;

    if (combinedLoan > 0 && rNew > 0) {
      const factorNew = Math.pow(1 + rNew, nNew);
      newEmi = Math.round((combinedLoan * rNew * factorNew) / (factorNew - 1));
      totInt = Math.round(newEmi * nNew - combinedLoan);
    } else if (combinedLoan > 0) {
      newEmi = Math.round(combinedLoan / nNew);
      totInt = 0;
    }

    const emiDiff = newEmi - currentEmi;

    setOutstandingPrincipal(outP);
    setNewLoanAmount(combinedLoan);
    setNewMonthlyEmi(newEmi);
    setProcessingFeeAmount(feeAmt);
    setEmiDifference(emiDiff);
    setTotalInterest(totInt);
  }, [
    currentLoanAmount,
    currentEmi,
    remainingTenureYears,
    currentInterestRate,
    topUpAmount,
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
      q: 'What is a top-up loan?',
      a: 'A top-up loan is an additional loan offered by your existing home loan lender on top of your current home loan balance. It carries a lower interest rate (8.5-10.5%) than personal loans because your property acts as collateral. Top-up amounts depend on your property equity, outstanding loan, and repayment track record.',
    },
    {
      q: 'When should I take a top-up loan?',
      a: 'A top-up loan is ideal when you need funds for any legitimate purpose (home renovation, medical emergency, higher education, business funding) and want a lower interest rate and longer tenure than a personal loan. It works best when you have significant equity in your property.',
    },
    {
      q: 'How much top-up loan can I get?',
      a: 'The combined outstanding (existing home loan + top-up) should not exceed 70-80% of the current market value of your property. For example, if your property is worth ₹1 Crore and your outstanding home loan is ₹40 Lakh, you may be eligible for a top-up of ₹30-40 Lakh, subject to your income and repayment capacity.',
    },
    {
      q: 'Are top-up loans tax deductible?',
      a: 'Yes, if the top-up loan is used strictly for home renovation or repair, the interest paid (up to ₹30,000 per year) can be claimed as a tax deduction under Section 24(b). If used for construction/purchase of a new house, standard home loan tax benefits apply.',
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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Top-Up Loan Calculator</h1>
        <p className="text-slate-600 text-base">
          Calculate how much extra you can borrow on your existing loan and compute your new merged EMI.
        </p>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mt-12">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#113262]" /> Existing Loan Details
              </h2>

              {/* Current Loan Amount & Current EMI */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Current Loan Amount (₹)</label>
                    <div className="relative">
                      <CurrencyInput
                    value={currentLoanAmount}
                    onValueChange={(val) => setCurrentLoanAmount(val)}
                  />
                    </div>
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="100000000"
                    step="100000"
                    value={currentLoanAmount}
                    onChange={(e) => setCurrentLoanAmount(Number(e.target.value))}

                    style={getSliderStyle(currentLoanAmount, "100000", "100000000")}
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

              {/* Remaining Tenure & Current Interest Rate */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Current Interest Rate (% p.a.)</label>
                    <span className="font-bold text-slate-900 text-sm bg-slate-100 px-2.5 py-1 rounded-md">{currentInterestRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="20"
                    step="0.1"
                    value={currentInterestRate}
                    onChange={(e) => setCurrentInterestRate(Number(e.target.value))}

                    style={getSliderStyle(currentInterestRate, "4", "20")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                <PlusCircle className="w-5 h-5 text-[#113262]" /> Top-Up Loan Details
              </h2>

              {/* Top Up Amount & New Interest Rate */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Top-Up Amount (₹)</label>
                    <div className="relative">
                      <CurrencyInput
                    value={topUpAmount}
                    onValueChange={(val) => setTopUpAmount(val)}
                  />
                    </div>
                  </div>
                  <input
                    type="range"
                    min="50000"
                    max="50000000"
                    step="50000"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(Number(e.target.value))}

                    style={getSliderStyle(topUpAmount, "50000", "50000000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">New Interest Rate (% p.a.)</label>
                    <span className="font-bold text-slate-900 text-sm bg-slate-100 px-2.5 py-1 rounded-md">{newInterestRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="20"
                    step="0.1"
                    value={newInterestRate}
                    onChange={(e) => setNewInterestRate(Number(e.target.value))}

                    style={getSliderStyle(newInterestRate, "4", "20")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>
              </div>

              {/* New Loan Tenure & Processing Fee */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
            </div>
          </div>

          {/* Right Column: Dark Navy Sticky Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="bg-[#1e2a4f] text-white rounded-2xl p-6 shadow-xl border border-slate-800">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold">New Monthly Payment</h3>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Top-Up Loan Summary',
                        text: `New Monthly EMI: ${formatCurrency(newMonthlyEmi)} for combined loan of ${formatCurrency(newLoanAmount)} (Top-Up: ${formatCurrency(topUpAmount)}).`,
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
                <div className="text-xs text-emerald-400 mt-1 font-medium">
                  {emiDifference >= 0 ? '+' : ''}{formatCurrency(emiDifference)} vs current EMI
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-3.5 text-sm border-t border-slate-800 pt-4">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Outstanding Principal</span>
                  <span className="font-semibold text-white">{formatCurrency(outstandingPrincipal)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Top-Up Amount</span>
                  <span className="font-semibold text-emerald-400">{formatCurrency(topUpAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>New Loan Amount</span>
                  <span className="font-semibold text-white">{formatCurrency(newLoanAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Processing Fee</span>
                  <span className="font-semibold text-white">{formatCurrency(processingFeeAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>EMI Difference</span>
                  <span className={`font-semibold ${emiDifference >= 0 ? 'text-[#EAB308]' : 'text-emerald-400'}`}>
                    {emiDifference >= 0 ? '+' : ''}{formatCurrency(emiDifference)}
                  </span>
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

        {/* Informational SEO Content & Guide */}
        <div className="max-w-4xl space-y-12 text-slate-700 leading-relaxed mt-12">
          <h2 className="text-xl font-bold text-[#113262] mb-4">Is a Top-Up Loan Right for You?</h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6">
            This calculator compares the cost of a top-up loan versus a personal loan for the same amount. Enter the desired top-up amount, your existing home loan details, and current property value. It shows the EMI differences, total interest saved, and whether you meet eligibility criteria for a top-up loan.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-700 border-t border-slate-100 pt-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Key Components</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li><strong>Existing Loan Amount:</strong> Original loan balance.</li>
                <li><strong>Outstanding Principal:</strong> Unpaid loan principal.</li>
                <li><strong>Top-Up Amount:</strong> Additional funds required.</li>
                <li><strong>New Monthly EMI:</strong> Revised single EMI.</li>
                <li><strong>EMI Difference:</strong> Additional monthly obligation.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">How It Works</h3>
              <p className="mb-2">Combines old balance & top-up:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li><strong>New Principal:</strong> Outstanding Principal + Top-Up Amount</li>
                <li><strong>Merged EMI:</strong> Calculated at new rate & tenure</li>
                <li><strong>Net Cost:</strong> Total interest across new loan tenure.</li>
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

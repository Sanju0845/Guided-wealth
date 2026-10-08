import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp, UserCheck, Percent, Calendar, Sliders, Info } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

export default function PersonalLoanEmi() {
  // Inputs
  const [loanAmount, setLoanAmount] = useState<number>(100000);
  const [interestRate, setInterestRate] = useState<number>(12);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(5);

  // Advanced Inputs
  const [showAdvanced, setShowAdvanced] = useState<boolean>(true);
  const [repaidYears, setRepaidYears] = useState<number>(1);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Computed Outputs
  const [monthlyEmi, setMonthlyEmi] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalLoanAmount, setTotalLoanAmount] = useState<number>(0);
  const [principalRepaid, setPrincipalRepaid] = useState<number>(0);
  const [interestPaid, setInterestPaid] = useState<number>(0);
  const [outstandingLoanAmount, setOutstandingLoanAmount] = useState<number>(0);

  useEffect(() => {
    const P = Math.max(0, loanAmount);
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

    const totalPayable = P + totInterest;

    // Repayment progress calculation up to repaidYears
    const repaidMonths = Math.min(n, repaidYears * 12);
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

    setMonthlyEmi(emi);
    setTotalInterest(totInterest);
    setTotalLoanAmount(totalPayable);
    setPrincipalRepaid(cumPrincipal);
    setInterestPaid(cumInterest);
    setOutstandingLoanAmount(remPrincipal);
  }, [loanAmount, interestRate, loanTenureYears, repaidYears]);

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
      q: 'What are personal loan interest rates in India?',
      a: 'Personal loan interest rates range from 10-24% depending on the lender, your credit score, income, and employment type. Banks offer 10-16%, while NBFCs and fintech lenders charge 14-24%. Pre-approved personal loans from your existing bank often have the best rates. Always compare at least 3-4 offers before borrowing.',
    },
    {
      q: 'How much personal loan can I get?',
      a: 'Banks typically offer personal loans up to 10-15 times your monthly net salary, subject to your credit score and existing obligations. For salaried individuals, the maximum is usually ₹25-40 Lakh. Self-employed individuals may get lower amounts with additional documentation requirements.',
    },
    {
      q: 'Are personal loans tax-deductible?',
      a: 'Personal loans used for home renovation qualify for Section 24(b) interest deduction. Loans used for business purposes can be claimed as a business expense. For other purposes (wedding, travel, medical), personal loan interest is not tax-deductible. The principal repayment is never deductible.',
    },
    {
      q: 'What processing fees are charged on personal loans?',
      a: 'Most banks charge a non-refundable processing fee of 1% to 3% of the loan amount plus GST. Some banks waive processing fees during festive promotional periods.',
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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Personal Loan EMI Calculator</h1>
        <p className="text-slate-600 text-base">
          Calculate your monthly EMI, total interest payments, and repayment progress for personal loans.
        </p>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mt-12">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#113262]" /> Loan Details
              </h2>

              {/* Loan Amount Slider */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-700">Loan Amount (₹)</label>
                  <div className="relative">
                    <CurrencyInput
                    value={loanAmount}
                    onValueChange={(val) => setLoanAmount(val)}
                  />
                  </div>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="4000000"
                  step="25000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}

                  style={getSliderStyle(loanAmount, "10000", "4000000")}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>₹10,000</span>
                  <span>₹40,00,000</span>
                </div>
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                <Percent className="w-5 h-5 text-[#113262]" /> Interest & Tenure
              </h2>

              {/* Interest Rate & Loan Tenure */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Interest Rate (% p.a.)</label>
                    <span className="font-bold text-slate-900 text-sm bg-slate-100 px-2.5 py-1 rounded-md">{interestRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="36"
                    step="0.5"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}

                    style={getSliderStyle(interestRate, "6", "36")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>6%</span>
                    <span>36%</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Loan Tenure (Years)</label>
                    <span className="font-bold text-slate-900 text-sm bg-slate-100 px-2.5 py-1 rounded-md">{loanTenureYears} Years</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={loanTenureYears}
                    onChange={(e) => setLoanTenureYears(Number(e.target.value))}

                    style={getSliderStyle(loanTenureYears, "1", "10")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>1 year</span>
                    <span>10 years</span>
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
                    <Sliders className="w-4 h-4 text-[#113262]" /> Repayment Progress (Already Repaid)
                  </span>
                  {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showAdvanced && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-medium text-slate-700">Repayment Years (Already Repaid)</label>
                      <span className="font-bold text-slate-900 text-xs">{repaidYears} Years</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max={loanTenureYears}
                      step="1"
                      value={repaidYears}
                      onChange={(e) => setRepaidYears(Number(e.target.value))}

                      style={getSliderStyle(repaidYears, "0", loanTenureYears)}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                      <span>0 years</span>
                      <span>{loanTenureYears} years</span>
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
                <h3 className="text-lg font-bold">Personal Loan EMI</h3>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Personal Loan EMI Summary',
                        text: `Monthly EMI: ${formatCurrency(monthlyEmi)} for a personal loan of ${formatCurrency(loanAmount)} at ${interestRate}% for ${loanTenureYears} years.`,
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
                  Total Payable: {formatCurrency(totalLoanAmount)}
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-3.5 text-sm border-t border-slate-800 pt-4">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Total Loan Amount</span>
                  <span className="font-semibold text-white">{formatCurrency(totalLoanAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Outstanding Loan Amount</span>
                  <span className="font-semibold text-sky-400">{formatCurrency(outstandingLoanAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Principal Repaid</span>
                  <span className="font-semibold text-emerald-400">{formatCurrency(principalRepaid)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Interest Paid</span>
                  <span className="font-semibold text-rose-400">{formatCurrency(interestPaid)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300 pt-3 border-t border-slate-800">
                  <span className="font-bold text-white">Total Interest Cost</span>
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
            <h2 className="text-xl font-bold text-[#113262] mb-4">What is a Personal Loan?</h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Understand personal loans better with our comprehensive guide and calculator.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-700 border-t border-slate-100 pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Understanding Personal Loans</h3>
                <p className="text-slate-600 leading-relaxed">
                  A personal loan is an unsecured collateral-free loan approved based on your creditworthiness, income stability, and repayment capacity. Loan amounts range from ₹50,000 to ₹40 Lakhs with 12 to 60 months tenure.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Why Choose a Personal Loan?</h3>
                <p className="text-slate-600 leading-relaxed">
                  Quick processing, no collateral required, flexible end-use (debt consolidation, medical, travel, wedding), predictable monthly EMIs, and minimal paperwork.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Personal Loan Eligibility</h3>
                <p className="text-slate-600 leading-relaxed">
                  Age (21-58 years), net income (minimum ₹25,000/month), stable job, CIBIL score 750+, and minimum 1-3 years work experience.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Loan Application Steps</h3>
                <p className="text-slate-600 leading-relaxed">
                  1. Check credit score & calculate affordable EMI → 2. Submit application & documents → 3. Verification & credit assessment → 4. Sanction & disbursement.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Using Axiom's Personal Loan Calculator</h3>
                <p className="text-slate-600 leading-relaxed">
                  Provides instant EMI estimates, full repayment schedule overview, total cost comparison, and outstanding balance tracking.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Planning Card */}
        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mt-12">
          <h2 className="text-xl font-bold text-[#113262] mb-4">Understanding Personal Loan Costs</h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Enter the loan amount, interest rate, and tenure. The calculator shows your monthly EMI, total interest, and a repayment schedule. It helps you understand the true cost of borrowing and compare different tenure options. Remember to factor in processing fees (1-3% of loan amount) when comparing offers.
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

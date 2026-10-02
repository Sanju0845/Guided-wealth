import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp, GraduationCap, Percent, Calendar, Sliders, Info } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

export default function EducationLoanEmi() {
  // Inputs
  const [loanAmount, setLoanAmount] = useState<number>(1000000);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(6);
  const [moratoriumYears, setMoratoriumYears] = useState<number>(1);

  // Advanced Inputs
  const [showAdvanced, setShowAdvanced] = useState<boolean>(true);
  const [repaidYears, setRepaidYears] = useState<number>(1);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Computed Outputs
  const [moratoriumInterest, setMoratoriumInterest] = useState<number>(0);
  const [effectivePrincipal, setEffectivePrincipal] = useState<number>(0);
  const [monthlyEmi, setMonthlyEmi] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalLoanAmount, setTotalLoanAmount] = useState<number>(0);
  const [principalRepaid, setPrincipalRepaid] = useState<number>(0);
  const [interestPaid, setInterestPaid] = useState<number>(0);
  const [outstandingAmount, setOutstandingAmount] = useState<number>(0);

  useEffect(() => {
    const P = Math.max(0, loanAmount);
    const moratInterest = Math.round(P * (interestRate / 100) * moratoriumYears);
    const effP = P + moratInterest;

    const n = Math.max(1, loanTenureYears * 12);
    const r = interestRate / (12 * 100);

    let emi = 0;
    let totInterestRepayment = 0;

    if (effP > 0 && r > 0) {
      const factor = Math.pow(1 + r, n);
      emi = Math.round((effP * r * factor) / (factor - 1));
      totInterestRepayment = Math.round(emi * n - effP);
    } else if (effP > 0) {
      emi = Math.round(effP / n);
      totInterestRepayment = 0;
    }

    const totalPayable = emi * n;

    // Repayment progress after moratorium
    const repaidMonths = Math.min(n, repaidYears * 12);
    let remPrincipal = effP;
    let cumInterest = 0;
    let cumPrincipal = 0;

    let tempBalance = effP;
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

    setMoratoriumInterest(moratInterest);
    setEffectivePrincipal(effP);
    setMonthlyEmi(emi);
    setTotalInterest(totInterestRepayment + moratInterest);
    setTotalLoanAmount(totalPayable);
    setPrincipalRepaid(cumPrincipal);
    setInterestPaid(cumInterest);
    setOutstandingAmount(remPrincipal);
  }, [loanAmount, interestRate, loanTenureYears, moratoriumYears, repaidYears]);

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
      q: 'What are the current education loan interest rates in India?',
      a: 'Education loan interest rates range from 8-12% for domestic studies and 10-14% for overseas education. Public sector banks (SBI, Bank of Baroda) offer lower rates (8.5-10.5%). Collateral-free loans up to ₹7.5 Lakh carry slightly higher rates.',
    },
    {
      q: 'Can I get tax benefit on education loan under Section 80E?',
      a: 'Yes, Section 80E provides deduction on the entire interest paid on an education loan with no upper financial cap. This deduction is available for up to 8 consecutive financial years starting from the year repayment begins.',
    },
    {
      q: 'What is the moratorium period in education loans?',
      a: 'The moratorium period (course duration plus 6 to 12 months grace period) allows students to defer EMI payments until they complete their course or get employed. However, simple interest accrues during this period and gets added to the loan principal.',
    },
    {
      q: 'Is collateral required for education loans?',
      a: 'Under the Central Scheme for Interest Subsidy, education loans up to ₹4 Lakh to ₹7.5 Lakh do not require collateral or third-party guarantee. Loans above ₹7.5 Lakh typically require tangible collateral (property, FD, land).',
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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Education Loan EMI Calculator</h1>
        <p className="text-slate-600 text-base">
          Calculate your education loan EMI with moratorium period and Section 80E tax savings.
        </p>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mt-12">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#113262]" /> Loan Details
              </h2>

              {/* Education Loan Amount */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-700">Education Loan Amount (₹)</label>
                  <div className="relative">
                    <CurrencyInput
                    value={loanAmount}
                    onValueChange={(val) => setLoanAmount(val)}
                  />
                  </div>
                </div>
                <input
                  type="range"
                  min="100000"
                  max="10000000"
                  step="50000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}

                  style={getSliderStyle(loanAmount, "100000", "10000000")}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>₹1,00,000</span>
                  <span>₹1,00,00,000</span>
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
                    min="4"
                    max="16"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}

                    style={getSliderStyle(interestRate, "4", "16")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>4%</span>
                    <span>16%</span>
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
                    max="15"
                    step="1"
                    value={loanTenureYears}
                    onChange={(e) => setLoanTenureYears(Number(e.target.value))}

                    style={getSliderStyle(loanTenureYears, "1", "15")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>1 year</span>
                    <span>15 years</span>
                  </div>
                </div>
              </div>

              {/* Moratorium Period Slider */}
              <div className="mb-6 pt-4 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#113262]" /> Moratorium Period
                </h3>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-700">Moratorium Period (Years)</label>
                  <span className="font-bold text-[#113262] text-sm bg-sky-50 px-2.5 py-1 rounded-md">{moratoriumYears} Years</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.5"
                  value={moratoriumYears}
                  onChange={(e) => setMoratoriumYears(Number(e.target.value))}

                  style={getSliderStyle(moratoriumYears, "0", "5")}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>0 years</span>
                  <span>5 years</span>
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
                    <Sliders className="w-4 h-4 text-[#113262]" /> Repayment Progress
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
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Dark Navy Sticky Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="bg-[#1e2a4f] text-white rounded-2xl p-6 shadow-xl border border-slate-800">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold">Education Loan EMI</h3>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Education Loan EMI Summary',
                        text: `Monthly EMI: ${formatCurrency(monthlyEmi)} for an education loan of ${formatCurrency(loanAmount)} with ${moratoriumYears} yrs moratorium.`,
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
                <div className="text-xs text-slate-400 mb-1 font-medium">Monthly EMI after moratorium</div>
                <div className="text-3xl font-extrabold text-white">{formatCurrency(monthlyEmi)}</div>
                <div className="text-xs text-emerald-400 mt-1 font-medium">
                  Total Loan Amount: {formatCurrency(totalLoanAmount)}
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-3.5 text-sm border-t border-slate-800 pt-4">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Total Loan Amount</span>
                  <span className="font-semibold text-white">{formatCurrency(totalLoanAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Outstanding Amount</span>
                  <span className="font-semibold text-sky-400">{formatCurrency(outstandingAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Principal Repaid</span>
                  <span className="font-semibold text-emerald-400">{formatCurrency(principalRepaid)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Interest Paid</span>
                  <span className="font-semibold text-white">{formatCurrency(interestPaid)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300 pt-3 border-t border-slate-800">
                  <span className="font-bold text-white">Moratorium Interest</span>
                  <span className="font-bold text-[#EAB308] text-base">{formatCurrency(moratoriumInterest)}</span>
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
            <h2 className="text-xl font-bold text-[#113262] mb-4">What is an Education Loan?</h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Invest in your future with our comprehensive guide to education financing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-700 border-t border-slate-100 pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Understanding Education Loans</h3>
                <p className="text-slate-600 leading-relaxed">
                  An education loan is a specialized financial product designed to fund academic pursuits, covering tuition fees, books, accommodation, and living expenses for domestic and international courses.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Benefits of Education Loans</h3>
                <p className="text-slate-600 leading-relaxed">
                  Section 80E tax deduction on entire interest paid, moratorium period flexibility, collateral-free loans up to ₹7.5 Lakh, and extended repayment terms up to 15 years.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Eligibility and Requirements</h3>
                <p className="text-slate-600 leading-relaxed">
                  Admission in recognized institute, strong academic record, parent/guardian co-applicant, and income proof.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Application Process</h3>
                <p className="text-slate-600 leading-relaxed">
                  1. Course research & admission confirmation → 2. Document submission (academic, identity, income) → 3. Bank processing & sanction letter → 4. Direct disbursement to institution.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Using Axiom's Education Loan Calculator</h3>
                <p className="text-slate-600 leading-relaxed">
                  Computes post-moratorium EMI, interest accrual during study years, and estimates Section 80E tax savings.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Planning Card */}
        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mt-12">
          <h2 className="text-xl font-bold text-[#113262] mb-4">Planning Your Education Financing</h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Enter the loan amount, interest rate, moratorium period, and repayment tenure. The calculator shows your monthly EMI after the moratorium, total interest payable, and the effective cost of education including financing. It also estimates the Section 80E tax benefit you can claim annually.
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

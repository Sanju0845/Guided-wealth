import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp, Wrench, Percent, Calendar, Sliders, Info } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

export default function HomeExtensionRenovation() {
  // Inputs
  const [renovationCost, setRenovationCost] = useState<number>(500000);
  const [downPaymentPct, setDownPaymentPct] = useState<number>(10);
  const [interestRate, setInterestRate] = useState<number>(7.5);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(5);

  // Advanced Inputs
  const [showAdvanced, setShowAdvanced] = useState<boolean>(true);
  const [yearsRepaid, setYearsRepaid] = useState<number>(1);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Computed Outputs
  const [downPaymentAmount, setDownPaymentAmount] = useState<number>(0);
  const [principalLoanAmount, setPrincipalLoanAmount] = useState<number>(0);
  const [monthlyEmi, setMonthlyEmi] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalRepayment, setTotalRepayment] = useState<number>(0);
  const [principalRepaid, setPrincipalRepaid] = useState<number>(0);
  const [interestPaid, setInterestPaid] = useState<number>(0);
  const [outstandingAmount, setOutstandingAmount] = useState<number>(0);

  useEffect(() => {
    const downAmt = Math.round(renovationCost * (downPaymentPct / 100));
    const P = Math.max(0, renovationCost - downAmt);

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

    const totRepay = P + totInterest;

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

    setDownPaymentAmount(downAmt);
    setPrincipalLoanAmount(P);
    setMonthlyEmi(emi);
    setTotalInterest(totInterest);
    setTotalRepayment(totRepay);
    setPrincipalRepaid(cumPrincipal);
    setInterestPaid(cumInterest);
    setOutstandingAmount(remPrincipal);
  }, [renovationCost, downPaymentPct, interestRate, loanTenureYears, yearsRepaid]);

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
      q: 'What is a home extension or renovation loan?',
      a: 'A home renovation loan finances modifications, repairs, or extensions to your existing property. It can be taken as a home loan top-up, a personal loan, or a dedicated renovation loan from banks. Interest rates range from 7.5-12% depending on the loan type and collateral.',
    },
    {
      q: 'Can I get tax benefits on a renovation loan?',
      a: 'If the renovation loan is taken as a home loan top-up or a separate loan against property, the interest paid (up to ₹30,000 per year under Section 24b for renovation) may be deductible under the old tax regime. Consult your tax advisor for exact eligibility.',
    },
    {
      q: 'How much can I borrow for home renovation?',
      a: 'Home loan top-ups allow up to 70-80% of the increased property value. Dedicated renovation loans range from ₹1 Lakh to ₹25 Lakh. The amount depends on your existing home loan outstanding balance, property market value, income, and credit score.',
    },
    {
      q: 'What renovation works are covered under renovation loans?',
      a: 'Structural modifications, room extensions, roofing repairs, interior remodeling (kitchen, bathroom, flooring), exterior painting, plumbing, electrical rewiring, and waterproofing are covered.',
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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Home Renovation Loan Calculator</h1>
        <p className="text-slate-600 text-base">
          Calculate your renovation loan EMI, down payment, and total financing costs.
        </p>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mt-12">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-[#113262]" /> Renovation Details
              </h2>

              {/* Renovation Cost & Down Payment */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Renovation Cost (₹)</label>
                    <div className="relative">
                      <CurrencyInput
                    value={renovationCost}
                    onValueChange={(val) => setRenovationCost(val)}
                  />
                    </div>
                  </div>
                  <input
                    type="range"
                    min="50000"
                    max="5000000"
                    step="25000"
                    value={renovationCost}
                    onChange={(e) => setRenovationCost(Number(e.target.value))}

                    style={getSliderStyle(renovationCost, "50000", "5000000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>₹50,000</span>
                    <span>₹50,00,000</span>
                  </div>
                </div>

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
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>0%</span>
                    <span>50%</span>
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-[#113262]" /> Loan Terms
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
                    min="5"
                    max="16"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}

                    style={getSliderStyle(interestRate, "5", "16")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>5%</span>
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
                        title: 'Home Renovation Loan EMI Summary',
                        text: `Monthly EMI: ${formatCurrency(monthlyEmi)} for a renovation loan of ${formatCurrency(principalLoanAmount)} at ${interestRate}% for ${loanTenureYears} years.`,
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
                  Total Repayment: {formatCurrency(totalRepayment)}
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-3.5 text-sm border-t border-slate-800 pt-4">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Total Loan Amount</span>
                  <span className="font-semibold text-white">{formatCurrency(principalLoanAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Down Payment</span>
                  <span className="font-semibold text-emerald-400">{formatCurrency(downPaymentAmount)}</span>
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
            <h2 className="text-xl font-bold text-[#113262] mb-4">What is a Home Renovation Loan?</h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Transform your living space with our comprehensive guide to home renovation financing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-700 border-t border-slate-100 pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Understanding Home Renovation Loans</h3>
                <p className="text-slate-600 leading-relaxed">
                  A home renovation loan funds home improvements, repairs, and structural modifications to enhance property value without depleting your savings.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Benefits of Renovation Financing</h3>
                <p className="text-slate-600 leading-relaxed">
                  Enhances property market value, potential tax benefits under Section 24b (up to ₹30,000), flexible usage across contractors, and lower interest rates than personal credit.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Eligible Renovation Projects</h3>
                <p className="text-slate-600 leading-relaxed">
                  Structural modifications, room extensions, kitchen remodeling, bathroom upgrades, facade improvement, external painting, and waterproofing repairs.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Loan Requirements & Process</h3>
                <p className="text-slate-600 leading-relaxed">
                  Property ownership title, income stability, renovation cost estimates, contractor agreements, and stage-wise fund release.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Using Axiom's Renovation Loan Calculator</h3>
                <p className="text-slate-600 leading-relaxed">
                  Estimates net loan after down payment, monthly EMI, total interest cost, and outstanding balance tracking.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Planning Card */}
        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mt-12">
          <h2 className="text-xl font-bold text-[#113262] mb-4">Financing Your Home Renovation</h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Enter the renovation cost, down payment percentage, interest rate, and tenure. The calculator shows your monthly EMI, total interest, and effective cost of financing your renovation project through home loan top-up or renovation loans.
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

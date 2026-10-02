import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp, Calculator, Building, Car, UserCheck, Sliders, Info } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

export default function Emi() {
  // Inputs
  const [loanAmount, setLoanAmount] = useState<number>(1000000);
  const [interestRate, setInterestRate] = useState<number>(8);
  const [loanTenureYears, setLoanTenureYears] = useState<number>(12);
  const [loanType, setLoanType] = useState<string>('home'); // home, car, personal

  // Advanced Inputs
  const [showAdvanced, setShowAdvanced] = useState<boolean>(true);
  const [alreadyRepaidYears, setAlreadyRepaidYears] = useState<number>(1);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Calculated Outputs
  const [monthlyEmi, setMonthlyEmi] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [principalRepaid, setPrincipalRepaid] = useState<number>(0);
  const [interestPaid, setInterestPaid] = useState<number>(0);
  const [outstandingAmount, setOutstandingAmount] = useState<number>(0);

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

    setMonthlyEmi(emi);
    setTotalInterest(totInterest);
    setTotalAmount(totAmt);
    setPrincipalRepaid(cumPrincipal);
    setInterestPaid(cumInterest);
    setOutstandingAmount(remPrincipal);
  }, [loanAmount, interestRate, loanTenureYears, alreadyRepaidYears]);

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
      q: 'How is EMI calculated?',
      a: 'EMI = [P x R x (1+R)^N] / [(1+R)^N - 1], where P is the principal loan amount, R is the monthly interest rate (annual rate / 12 / 100), and N is the tenure in months. In early years, a larger portion of EMI goes toward interest; later, more goes toward principal repayment.',
    },
    {
      q: 'How can I reduce my EMI?',
      a: 'Choose a longer tenure (increases total interest but reduces monthly burden), make a larger down payment, negotiate a lower interest rate (compare across lenders), or opt for balance transfer if rates drop.',
    },
    {
      q: 'What happens if I miss an EMI payment?',
      a: 'A missed EMI attracts a late payment fee (typically 2-3% of EMI), negatively impacts your CIBIL credit score (stays on record for 7 years), and incurs penal interest. 3 consecutive missed EMIs can lead to default categorization.',
    },
    {
      q: 'Is fixed rate or floating rate EMI better?',
      a: 'Floating rate loans are usually 1-2.5% cheaper than fixed rates and carry zero prepayment penalty under RBI guidelines for retail borrowers.',
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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">EMI Calculator</h1>
        <p className="text-slate-600 text-base">
          Estimate your monthly loan payments, total interest cost, and amortization breakdown.
        </p>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mt-12">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#113262]" /> Loan Details
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
                  max="10000000"
                  step="50000"
                  value={loanAmount}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}

                  style={getSliderStyle(loanAmount, "10000", "10000000")}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>₹10,000</span>
                  <span>₹1,00,00,000</span>
                </div>
              </div>

              {/* Loan Terms: Interest & Tenure */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Interest Rate (% p.a.)</label>
                    <span className="font-bold text-slate-900 text-sm bg-slate-100 px-2.5 py-1 rounded-md">{interestRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="30"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}

                    style={getSliderStyle(interestRate, "4", "30")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>4%</span>
                    <span>30%</span>
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

              {/* Loan Type Tabs */}
              <div className="mb-6 pt-4 border-t border-slate-100">
                <label className="block text-sm font-medium text-slate-700 mb-2">Loan Type</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setLoanType('home');
                      setInterestRate(8.5);
                      setLoanTenureYears(20);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${loanType === 'home'
                        ? 'border-[#113262] bg-sky-50/50 text-[#113262] font-semibold ring-2 ring-[#113262]/10'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                  >
                    <div className="text-sm font-bold flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-[#113262]" /> Home Loan
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">For real estate</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLoanType('car');
                      setInterestRate(9.0);
                      setLoanTenureYears(5);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${loanType === 'car'
                        ? 'border-[#113262] bg-sky-50/50 text-[#113262] font-semibold ring-2 ring-[#113262]/10'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                  >
                    <div className="text-sm font-bold flex items-center gap-1.5">
                      <Car className="w-4 h-4 text-[#113262]" /> Car Loan
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">For vehicles</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setLoanType('personal');
                      setInterestRate(12.0);
                      setLoanTenureYears(3);
                    }}
                    className={`p-3 rounded-xl border text-left transition-all ${loanType === 'personal'
                        ? 'border-[#113262] bg-sky-50/50 text-[#113262] font-semibold ring-2 ring-[#113262]/10'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                  >
                    <div className="text-sm font-bold flex items-center gap-1.5">
                      <UserCheck className="w-4 h-4 text-[#113262]" /> Personal Loan
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">For other needs</div>
                  </button>
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center justify-between w-full text-sm font-bold text-slate-800 hover:text-[#113262] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#113262]" /> Already Repaid Progress
                  </span>
                  {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showAdvanced && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
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
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Dark Navy Sticky Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="bg-[#1e2a4f] text-white rounded-2xl p-6 shadow-xl border border-slate-800">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold">EMI Details</h3>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'EMI Calculation Details',
                        text: `Monthly EMI: ${formatCurrency(monthlyEmi)} for a loan of ${formatCurrency(loanAmount)} at ${interestRate}% for ${loanTenureYears} years.`,
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
                  <span className="font-semibold text-white">{formatCurrency(loanAmount)}</span>
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
                <div className="flex justify-between items-center text-slate-300 pt-3 border-t border-slate-800">
                  <span className="font-bold text-white">Outstanding Amount</span>
                  <span className="font-bold text-sky-400 text-base">{formatCurrency(outstandingAmount)}</span>
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
            <h2 className="text-xl font-bold text-[#113262] mb-4">What is EMI (Equated Monthly Installment)?</h2>
            <p className="text-slate-600 text-base leading-relaxed">
              Master the concept of EMIs and make informed financial decisions with our comprehensive guide and calculator.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-700 border-t border-slate-100 pt-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Understanding EMI</h3>
                <p className="text-slate-600 leading-relaxed">
                  An Equated Monthly Installment (EMI) represents a structured approach to loan repayment where borrowers make fixed monthly payments until their loan is fully settled. This system combines principal and interest components.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Advantages of EMI Financing</h3>
                <p className="text-slate-600 leading-relaxed">
                  Makes large purchases manageable, provides structured debt reduction, builds credit history through timely payments, and offers flexibility in selecting tenure.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Understanding EMI Calculation</h3>
                <p className="text-slate-600 leading-relaxed">
                  Formula: EMI = P × r × (1 + r)ⁿ / [(1 + r)ⁿ - 1], where P = Principal, r = Monthly interest rate, n = Total months.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Types of EMI Calculators</h3>
                <p className="text-slate-600 leading-relaxed">
                  Home Loan Calculator for mortgages, Car Loan Calculator for auto loans, Personal Loan Calculator for unsecured credit.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Using Axiom's EMI Calculator</h3>
                <p className="text-slate-600 leading-relaxed">
                  Provides instant computation, flexible sliders, detailed interest/principal breakdown, and outstanding loan tracking.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Planning Card */}
        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mt-12">
          <h2 className="text-xl font-bold text-[#113262] mb-4">Understanding EMI Payments</h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-4">
            This calculator computes your Equated Monthly Installment for any loan amount, interest rate, and tenure. It generates an amortization schedule showing the principal and interest split for each month, helping you understand how your loan balance reduces over time.
          </p>
          <h3 className="font-semibold text-slate-900 mb-2">Tips for Managing EMI Burden</h3>
          <p className="text-slate-600 text-sm leading-relaxed">
            Keep your total EMI burden below 40% of your net monthly income. Make small annual prepayments to cut tenure by 3-4 years.
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

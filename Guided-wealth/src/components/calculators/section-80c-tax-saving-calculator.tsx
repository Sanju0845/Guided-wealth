import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp, ShieldCheck, DollarSign, Sliders, TrendingUp } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

export default function Section80CTaxSavingCalculator() {
  // Input States - Tax Bracket
  const [taxBracketPercent, setTaxBracketPercent] = useState<number>(30); // 5, 20, 30

  // 80C Investments Grid
  const [epfContribution, setEpfContribution] = useState<number>(21600);
  const [ppfInvestment, setPpfInvestment] = useState<number>(50000);
  const [elssMutualFunds, setElssMutualFunds] = useState<number>(50000);
  const [lifeInsurancePremium, setLifeInsurancePremium] = useState<number>(0);

  // More 80C Investments
  const [showMore80C, setShowMore80C] = useState<boolean>(true);
  const [nscInvestment, setNscInvestment] = useState<number>(0);
  const [taxSavingFd, setTaxSavingFd] = useState<number>(0);
  const [sukanyaSamriddhi, setSukanyaSamriddhi] = useState<number>(0);
  const [homeLoanPrincipal, setHomeLoanPrincipal] = useState<number>(0);
  const [tuitionFees, setTuitionFees] = useState<number>(0);

  // Computed Outputs
  const [total80CInvestment, setTotal80CInvestment] = useState<number>(0);
  const [eligibleDeduction, setEligibleDeduction] = useState<number>(0);
  const [remainingLimit, setRemainingLimit] = useState<number>(0);
  const [utilizedPercent, setUtilizedPercent] = useState<number>(0);
  const [taxSavedIncCess, setTaxSavedIncCess] = useState<number>(0);

  useEffect(() => {
    const total =
      epfContribution +
      ppfInvestment +
      elssMutualFunds +
      lifeInsurancePremium +
      nscInvestment +
      taxSavingFd +
      sukanyaSamriddhi +
      homeLoanPrincipal +
      tuitionFees;

    const maxLimit = 150000;
    const eligible = Math.min(total, maxLimit);
    const remaining = Math.max(0, maxLimit - eligible);
    const pct = (eligible / maxLimit) * 100;

    // Tax saved = deduction * bracket% * 1.04 (4% Cess)
    const saved = Math.round(eligible * (taxBracketPercent / 100) * 1.04);

    setTotal80CInvestment(total);
    setEligibleDeduction(eligible);
    setRemainingLimit(remaining);
    setUtilizedPercent(pct);
    setTaxSavedIncCess(saved);
  }, [
    taxBracketPercent,
    epfContribution,
    ppfInvestment,
    elssMutualFunds,
    lifeInsurancePremium,
    nscInvestment,
    taxSavingFd,
    sukanyaSamriddhi,
    homeLoanPrincipal,
    tuitionFees,
  ]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };
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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Section 80C Tax Saving Calculator</h1>
        <p className="text-slate-600 text-base">
          Maximize your tax savings under Section 80C up to ₹1.5 Lakh per financial year
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Grid */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Inputs Column */}
          <div className="flex-1 space-y-6">
            {/* Tax Bracket Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-600" /> Your Tax Bracket
              </h2>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { rate: 5, label: '5% Tax Slab' },
                  { rate: 20, label: '20% Tax Slab' },
                  { rate: 30, label: '30% Tax Slab (Above 10L)' },
                ].map((item) => (
                  <button
                    key={item.rate}
                    onClick={() => setTaxBracketPercent(item.rate)}
                    className={`py-3 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all border text-center ${taxBracketPercent === item.rate
                        ? 'bg-[#1e2a4f] text-white border-[#113262] shadow-md'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Primary 80C Investments */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" /> 80C Investments
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">EPF Contribution (Employee)</label>
                    <input
                      type="number"
                      min="0"
                      max="150000"
                      step="1000"
                      value={epfContribution}
                      onChange={(e) => setEpfContribution(Math.max(0, Number(e.target.value)))}
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="150000"
                    step="1000"
                    value={epfContribution}
                    onChange={(e) => setEpfContribution(Number(e.target.value))}

                    style={getSliderStyle(epfContribution, "0", "150000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">PPF Investment</label>
                    <input
                      type="number"
                      min="0"
                      max="150000"
                      step="5000"
                      value={ppfInvestment}
                      onChange={(e) => setPpfInvestment(Math.max(0, Number(e.target.value)))}
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="150000"
                    step="5000"
                    value={ppfInvestment}
                    onChange={(e) => setPpfInvestment(Number(e.target.value))}

                    style={getSliderStyle(ppfInvestment, "0", "150000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">ELSS Mutual Funds</label>
                    <CurrencyInput
                    value={elssMutualFunds}
                    onValueChange={(val) => setElssMutualFunds(val)}
                  />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="150000"
                    step="5000"
                    value={elssMutualFunds}
                    onChange={(e) => setElssMutualFunds(Number(e.target.value))}

                    style={getSliderStyle(elssMutualFunds, "0", "150000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Life Insurance Premium</label>
                    <CurrencyInput
                    value={lifeInsurancePremium}
                    onValueChange={(val) => setLifeInsurancePremium(val)}
                  />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="150000"
                    step="5000"
                    value={lifeInsurancePremium}
                    onChange={(e) => setLifeInsurancePremium(Number(e.target.value))}

                    style={getSliderStyle(lifeInsurancePremium, "0", "150000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>
              </div>
            </div>

            {/* More 80C Investments Accordion */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <button
                onClick={() => setShowMore80C(!showMore80C)}
                className="w-full p-6 flex justify-between items-center font-bold text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <span className="flex items-center gap-2 text-base">
                  <Sliders className="w-5 h-5 text-blue-600" /> More 80C Investments (NSC, FD, SSY, Tuition, Home Loan)
                </span>
                {showMore80C ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
              </button>

              {showMore80C && (
                <div className="p-6 pt-0 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-slate-700">NSC Investment</label>
                      <input
                        type="number"
                        min="0"
                        max="150000"
                        step="5000"
                        value={nscInvestment}
                        onChange={(e) => setNscInvestment(Math.max(0, Number(e.target.value)))}
                      />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="150000"
                      step="5000"
                      value={nscInvestment}
                      onChange={(e) => setNscInvestment(Number(e.target.value))}

                      style={getSliderStyle(nscInvestment, "0", "150000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-slate-700">Tax Saving FD (5yr)</label>
                      <CurrencyInput
                    value={taxSavingFd}
                    onValueChange={(val) => setTaxSavingFd(val)}
                  />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="150000"
                      step="5000"
                      value={taxSavingFd}
                      onChange={(e) => setTaxSavingFd(Number(e.target.value))}

                      style={getSliderStyle(taxSavingFd, "0", "150000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-slate-700">Sukanya Samriddhi Yojana</label>
                      <CurrencyInput
                    value={sukanyaSamriddhi}
                    onValueChange={(val) => setSukanyaSamriddhi(val)}
                  />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="150000"
                      step="5000"
                      value={sukanyaSamriddhi}
                      onChange={(e) => setSukanyaSamriddhi(Number(e.target.value))}

                      style={getSliderStyle(sukanyaSamriddhi, "0", "150000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-slate-700">Home Loan Principal Repayment</label>
                      <CurrencyInput
                    value={homeLoanPrincipal}
                    onValueChange={(val) => setHomeLoanPrincipal(val)}
                  />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="150000"
                      step="5000"
                      value={homeLoanPrincipal}
                      onChange={(e) => setHomeLoanPrincipal(Number(e.target.value))}

                      style={getSliderStyle(homeLoanPrincipal, "0", "150000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-slate-700">Tuition Fees (max 2 children)</label>
                      <CurrencyInput
                    value={tuitionFees}
                    onValueChange={(val) => setTuitionFees(val)}
                  />
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="150000"
                      step="5000"
                      value={tuitionFees}
                      onChange={(e) => setTuitionFees(Number(e.target.value))}

                      style={getSliderStyle(tuitionFees, "0", "150000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Summary Card */}
          <div className="w-full lg:w-[380px]">
            <div className="bg-[#1e2a4f] rounded-2xl shadow-xl p-6 md:p-8 text-white sticky top-28 border border-slate-600/50">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-bold tracking-tight">80C Tax Savings</h2>
                <button className="text-slate-400 hover:text-white transition-colors p-1" title="Share">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-8 bg-slate-800/80 p-5 rounded-2xl border border-slate-600">
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">
                  {formatCurrency(taxSavedIncCess)}
                </div>
                <div className="text-slate-300 text-xs font-medium uppercase tracking-wider">Tax Saved (incl. 4% cess)</div>
              </div>

              <div className="space-y-4 border-t border-slate-600/60 pt-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Total 80C Investment</span>
                  <span className="font-semibold text-white">{formatCurrency(total80CInvestment)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Eligible Deduction</span>
                  <span className="font-semibold text-emerald-400">{formatCurrency(eligibleDeduction)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Remaining 80C Limit</span>
                  <span className="font-semibold text-amber-400">{formatCurrency(remainingLimit)}</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-3 border-t border-slate-600/40">
                  <span className="text-slate-300">80C Utilized</span>
                  <span className="font-semibold text-white">{utilizedPercent.toFixed(1)}%</span>
                </div>
              </div>

              <button className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2">
                Maximize Your Tax Savings <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Informational SEO & FAQs Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-slate-200">
          <div className="md:col-span-2 space-y-8 text-slate-700 text-sm md:text-base leading-relaxed">
            <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Section 80C Tax Saving Calculator</h2>
              <p className="text-slate-600 mb-4">
                Section 80C of the Income Tax Act is one of the most widely used provisions for tax saving in India. It allows individuals and HUFs to claim deductions of up to Rs 1,50,000 per financial year on specified investments and expenditures, effectively reducing taxable income and overall tax liability.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Eligible Investments Under Section 80C</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600 mb-6">
                <li>Employee Provident Fund (EPF) – Employer's contribution</li>
                <li>Public Provident Fund (PPF) – Up to Rs 1.5 Lakh per year</li>
                <li>ELSS Mutual Funds – Equity Linked Savings Scheme with 3-year lock-in</li>
                <li>Life Insurance Premium – On policies for self, spouse, or children</li>
                <li>National Savings Certificate (NSC)</li>
                <li>Tax Saving Fixed Deposit – 5-year tenure with banks</li>
                <li>Sukanya Samriddhi Yojana – For girl child education and marriage</li>
                <li>Home Loan Principal Repayment</li>
                <li>Tuition Fees – For up to 2 children at recognized institutions</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Key Points to Remember</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600 mb-6">
                <li>The overall limit under Section 80C is Rs 1,50,000 per financial year</li>
                <li>This deduction is available only under the Old Tax Regime</li>
                <li>The New Tax Regime does not allow Section 80C deductions</li>
                <li>Multiple investments can be combined to reach the Rs 1.5 Lakh limit</li>
                <li>EPF contribution by the employer is not counted under 80C</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Tax Saving by Bracket</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600 mb-6">
                <li><strong>5% bracket:</strong> Maximum tax saving of Rs 7,800 + cess</li>
                <li><strong>20% bracket:</strong> Maximum tax saving of Rs 31,200 + cess</li>
                <li><strong>30% bracket:</strong> Maximum tax saving of Rs 46,800 + cess</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Best 80C Investment Options</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600 mb-6">
                <li><strong>ELSS:</strong> Best for wealth creation (shortest lock-in of 3 years, market-linked returns)</li>
                <li><strong>PPF:</strong> Best for risk-averse investors (guaranteed returns, 15-year tenure)</li>
                <li><strong>EPF:</strong> Automatic savings with employer contribution</li>
                <li><strong>Tax Saving FD:</strong> Safe option with fixed returns and 5-year lock-in</li>
                <li><strong>SSY:</strong> Highest interest rate among government schemes</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Using the Section 80C Calculator</h3>
              <p className="text-slate-600">
                Enter your investments across different 80C-eligible instruments and select your tax bracket to calculate the total tax savings. The calculator shows your eligible deduction (capped at Rs 1.5 Lakh), tax saved, and how much of the 80C limit you have utilized.
              </p>
            </section>

            <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-2xl font-bold text-[#113262]">Frequently Asked Questions</h2>

              <div className="border-b border-slate-100 pb-5">
                <h3 className="font-bold text-slate-900 mb-2">What are the best 80C investment options?</h3>
                <p className="text-slate-600 text-base">
                  ELSS mutual funds (3-year lock-in, market-linked), PPF (15-year lock-in, 7.1% guaranteed), EPF/VPF (interest corpus, 8.25%), NPS (80CCD(1) within 80C limit), SCSS (for senior citizens, 8.2%), NSC (5-year, 7.7%), life insurance premiums, home loan principal repayment, and children's tuition fees. ELSS offers the best balance of returns and liquidity.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-2">Is Section 80C available under the New Tax Regime?</h3>
                <p className="text-slate-600 text-base">
                  No. Section 80C deductions are not available under the New Tax Regime. If you choose the new regime, you cannot claim tax benefits for PPF, ELSS, EPF, life insurance, or home loan principal. Compare both regimes to see if the lower rates of the new regime outweigh your 80C tax savings.
                </p>
              </div>
            </section>
          </div>

          {/* Right Column: SEO Card */}
          <div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-lg">Optimising Your 80C Investments</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                This calculator shows how much tax you can save by investing the full Rs 1.5 lakh under Section 80C. Enter your income and existing 80C investments (including EPF) to see how much room remains and the tax impact of filling the gap. It recommends the most efficient 80C instruments based on your risk profile and investment horizon.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

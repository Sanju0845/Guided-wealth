import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp, Briefcase, TrendingUp, Sliders, DollarSign, ShieldAlert } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

export default function FreelancerIncomeTaxCalculator() {
  // Input States
  const [annualFreelanceIncome, setAnnualFreelanceIncome] = useState<number>(1000000);
  const [totalBusinessExpenses, setTotalBusinessExpenses] = useState<number>(300000);

  const [retirementContributions80C, setRetirementContributions80C] = useState<number>(150000);
  const [professionalDevelopment, setProfessionalDevelopment] = useState<number>(50000);

  // Advanced Settings
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [bookDepreciation, setBookDepreciation] = useState<number>(20000);
  const [otherDeductions80D, setOtherDeductions80D] = useState<number>(50000);
  const [taxRegime, setTaxRegime] = useState<string>('presumptive'); // 'presumptive' (44ADA) or 'regular'

  // Computed Outputs
  const [taxableIncome, setTaxableIncome] = useState<number>(0);
  const [taxPayable, setTaxPayable] = useState<number>(0);
  const [effectiveTaxRate, setEffectiveTaxRate] = useState<number>(0);
  const [takeHomePay, setTakeHomePay] = useState<number>(0);
  const [taxSavings, setTaxSavings] = useState<number>(0);

  useEffect(() => {
    let netInc = 0;

    if (taxRegime === 'presumptive') {
      // Section 44ADA: 50% of gross receipts is treated as taxable profit
      const presumptiveProfit = annualFreelanceIncome * 0.50;
      netInc = Math.max(0, presumptiveProfit - retirementContributions80C - otherDeductions80D);
    } else {
      // Regular tax computation
      const netProfit = annualFreelanceIncome - totalBusinessExpenses - bookDepreciation - professionalDevelopment;
      netInc = Math.max(0, netProfit - retirementContributions80C - otherDeductions80D);
    }

    // Income tax calculation (Slab rate with Cess 4%)
    let tax = 0;
    if (netInc > 1200000) {
      tax = 125000 + (netInc - 1200000) * 0.20;
    } else if (netInc > 700000) {
      tax = 25000 + (netInc - 700000) * 0.15;
    } else if (netInc > 300000) {
      tax = (netInc - 300000) * 0.05;
    }

    // Section 87A rebate for net income under 7 Lakhs (or 12 Lakhs new regime)
    if (netInc <= 700000) {
      tax = 0;
    }

    const cess = tax * 0.04;
    const finalTax = Math.round(tax + cess);

    const takeHome = annualFreelanceIncome - totalBusinessExpenses - finalTax;
    const effRate = annualFreelanceIncome > 0 ? (finalTax / annualFreelanceIncome) * 100 : 0;

    // Baseline tax without deductions
    const baselineTax = Math.round(annualFreelanceIncome * 0.15);
    const savings = Math.max(0, baselineTax - finalTax);

    setTaxableIncome(Math.round(netInc));
    setTaxPayable(finalTax);
    setEffectiveTaxRate(effRate);
    setTakeHomePay(Math.round(takeHome));
    setTaxSavings(savings);
  }, [
    annualFreelanceIncome,
    totalBusinessExpenses,
    retirementContributions80C,
    professionalDevelopment,
    bookDepreciation,
    otherDeductions80D,
    taxRegime,
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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Freelancer Income Tax Calculator</h1>
        <p className="text-slate-600 text-base">
          Optimize your freelance income and minimize tax liability under Sec 44ADA or regular regime
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Grid */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Inputs Column */}
          <div className="flex-1 space-y-6">
            {/* Income Details Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-600" /> Income Details
              </h2>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-700">Annual Freelance Income</label>
                  <CurrencyInput
                    value={annualFreelanceIncome}
                    onValueChange={(val) => setAnnualFreelanceIncome(val)}
                  />
                </div>
                <input
                  type="range"
                  min="10000"
                  max="5000000"
                  step="50000"
                  value={annualFreelanceIncome}
                  onChange={(e) => setAnnualFreelanceIncome(Number(e.target.value))}

                  style={getSliderStyle(annualFreelanceIncome, "10000", "10000000")}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                  <span>₹10,000</span>
                  <span>₹50 Lakhs</span>
                </div>
              </div>
            </div>

            {/* Business Expenses Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" /> Business Expenses
              </h2>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-700">Total Business Expenses</label>
                  <CurrencyInput
                    value={totalBusinessExpenses}
                    onValueChange={(val) => setTotalBusinessExpenses(val)}
                  />
                </div>
                <input
                  type="range"
                  min="0"
                  max="2000000"
                  step="25000"
                  value={totalBusinessExpenses}
                  onChange={(e) => setTotalBusinessExpenses(Number(e.target.value))}

                  style={getSliderStyle(totalBusinessExpenses, "0", "5000000")}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                  <span>₹0</span>
                  <span>₹20 Lakhs</span>
                </div>
              </div>
            </div>

            {/* Tax Deductions Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" /> Tax Deductions
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Retirement Contributions (80C)</label>
                    <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-300">
                      {formatCurrency(retirementContributions80C)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="150000"
                    step="5000"
                    value={retirementContributions80C}
                    onChange={(e) => setRetirementContributions80C(Number(e.target.value))}

                    style={getSliderStyle(retirementContributions80C, "0", "150000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Professional Development</label>
                    <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-300">
                      {formatCurrency(professionalDevelopment)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    step="5000"
                    value={professionalDevelopment}
                    onChange={(e) => setProfessionalDevelopment(Number(e.target.value))}

                    style={getSliderStyle(professionalDevelopment, "0", "200000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>
              </div>
            </div>

            {/* Advanced Settings Accordion */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full p-6 flex justify-between items-center font-bold text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <span className="flex items-center gap-2 text-base">
                  <Sliders className="w-5 h-5 text-blue-600" /> Advanced Settings (Depreciation & Tax Scheme)
                </span>
                {showAdvanced ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
              </button>

              {showAdvanced && (
                <div className="p-6 pt-0 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Book Depreciation</label>
                    <input
                      type="number"
                      step="5000"
                      min="0"
                      value={bookDepreciation}
                      onChange={(e) => setBookDepreciation(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tax Regime Choice</label>
                    <select
                      value={taxRegime}
                      onChange={(e) => setTaxRegime(e.target.value)}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="presumptive">Sec 44ADA Presumptive Scheme (50% Taxable)</option>
                      <option value="regular">Regular Accounting (Actual Expenses)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Summary Card */}
          <div className="w-full lg:w-[380px]">
            <div className="bg-[#1e2a4f] rounded-2xl shadow-xl p-6 md:p-8 text-white sticky top-28 border border-slate-600/50">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-bold tracking-tight">Tax Liability</h2>
                <button className="text-slate-400 hover:text-white transition-colors p-1" title="Share">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-8 bg-slate-800/80 p-5 rounded-2xl border border-slate-600">
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">
                  {formatCurrency(taxPayable)}
                </div>
                <div className="text-slate-300 text-xs font-medium uppercase tracking-wider">Tax Payable</div>
              </div>

              <div className="space-y-4 border-t border-slate-600/60 pt-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Taxable Income</span>
                  <span className="font-semibold text-white">{formatCurrency(taxableIncome)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Effective Tax Rate</span>
                  <span className="font-semibold text-emerald-400">{effectiveTaxRate.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Take Home Pay</span>
                  <span className="font-semibold text-white">{formatCurrency(takeHomePay)}</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-3 border-t border-slate-600/40">
                  <span className="text-slate-300">Tax Savings</span>
                  <span className="font-semibold text-emerald-400">{formatCurrency(taxSavings)}</span>
                </div>
              </div>

              <button className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2">
                Start Saving <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Informational SEO & FAQs Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-slate-200">
          <div className="md:col-span-2 space-y-8 text-slate-700 text-sm md:text-base leading-relaxed">
            <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Freelancer Taxation</h2>
              <p className="text-slate-600 mb-4">
                Freelance taxation is a complex area of financial management that requires careful understanding of income reporting, deductions, and tax obligations for self-employed professionals across various industries.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Key Tax Considerations</h3>
              <p className="text-slate-600 mb-4">
                Freelancers must navigate unique tax challenges, including self-employment tax, estimated tax payments, and tracking business expenses. Proper tax planning is crucial for maximizing income and minimizing tax liability.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Types of Freelance Income</h3>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 mb-4">
                <li>Professional Services Income</li>
                <li>Consulting Fees</li>
                <li>Royalties and Licensing</li>
                <li>Digital Product Sales</li>
                <li>Gig Economy Earnings</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Important Deductions</h3>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 mb-4">
                <li>Home Office Expenses</li>
                <li>Equipment and Software</li>
                <li>Professional Development</li>
                <li>Travel and Transportation</li>
                <li>Health Insurance Premiums</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Tax Compliance Strategies</h3>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 mb-6">
                <li>Maintain Detailed Records</li>
                <li>Separate Business and Personal Finances</li>
                <li>Make Quarterly Estimated Tax Payments</li>
                <li>Understand Self-Employment Tax</li>
                <li>Consult with a Tax Professional</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Using the Freelancer Tax Calculator</h3>
              <p className="text-slate-600">
                Calculate your potential tax liability by entering your freelance income, business expenses, and other relevant financial details. Gain insights into your tax obligations and potential deductions to optimize your financial planning.
              </p>
            </section>

            <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-2xl font-bold text-[#113262]">Frequently Asked Questions</h2>

              <div className="border-b border-slate-100 pb-5">
                <h3 className="font-bold text-slate-900 mb-2">How is freelancer income taxed in India?</h3>
                <p className="text-slate-600 text-base">
                  Freelancer income is taxed as "Profits and Gains from Business or Profession." You can declare income under the presumptive taxation scheme (Section 44ADA) at 50% of gross receipts if total receipts are under Rs 75 lakh (with digital transactions exceeding 95%). Otherwise, you must maintain books of accounts and file ITR-3 or ITR-4.
                </p>
              </div>

              <div className="border-b border-slate-100 pb-5">
                <h3 className="font-bold text-slate-900 mb-2">What expenses can freelancers deduct?</h3>
                <p className="text-slate-600 text-base">
                  Deductible expenses include internet and phone bills, computer and equipment depreciation, co-working space rent, software subscriptions, professional development courses, travel for client meetings, and health insurance premiums. Keep all receipts and invoices for at least 6 years.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-2">Do freelancers need to pay advance tax?</h3>
                <p className="text-slate-600 text-base">
                  Yes. If your total tax liability exceeds Rs 10,000 in a financial year, you must pay advance tax in quarterly installments: 15% by June 15, 45% by September 15, 75% by December 15, and 100% by March 15. Missing deadlines attracts interest under Sections 234B and 234C.
                </p>
              </div>
            </section>
          </div>

          {/* Right Column: SEO Card */}
          <div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-lg">Tax Planning for Freelancers</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                This calculator estimates your tax liability based on gross receipts, deductible expenses, and applicable deductions. It shows your tax under both the presumptive scheme (Section 44ADA) and regular computation, helping you choose the more beneficial option. It also calculates advance tax installments for the financial year.
              </p>

              <h4 className="font-bold text-slate-800 text-sm">Common Tax Mistakes Freelancers Make</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Not paying advance tax (attracts interest penalties), not maintaining expense records (loses legitimate deductions), mixing personal and business accounts (complicates audit trail), and not filing ITR on time (late fee of Rs 5,000-10,000). Open a separate bank account for freelance income and use accounting software from day one.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

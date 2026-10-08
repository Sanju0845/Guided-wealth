import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp, Calculator, DollarSign, Sliders, ShieldAlert, Award } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

export default function IncomeTaxCalculator() {
  // Input States
  const [annualIncome, setAnnualIncome] = useState<number>(1200000);
  const [ageGroup, setAgeGroup] = useState<string>('below_60'); // 'below_60', '60_79', '80_plus'
  const [financialYear, setFinancialYear] = useState<string>('fy_2025_26');

  // Deductions (Old Regime)
  const [showDeductions, setShowDeductions] = useState<boolean>(true);
  const [sec80C, setSec80C] = useState<number>(150000);
  const [sec80D, setSec80D] = useState<number>(25000);
  const [hraExemption, setHraExemption] = useState<number>(0);
  const [otherDeductions, setOtherDeductions] = useState<number>(0);

  // Computed Outputs
  const [oldRegimeTax, setOldRegimeTax] = useState<number>(0);
  const [newRegimeTax, setNewRegimeTax] = useState<number>(0);
  const [effectiveOldRate, setEffectiveOldRate] = useState<number>(0);
  const [effectiveNewRate, setEffectiveNewRate] = useState<number>(0);
  const [taxSavings, setTaxSavings] = useState<number>(0);
  const [betterRegime, setBetterRegime] = useState<string>('New');

  useEffect(() => {
    // --- OLD REGIME CALCULATION ---
    const oldStdDeduction = 50000;
    const totalOldDeductions = oldStdDeduction + sec80C + sec80D + hraExemption + otherDeductions;
    const taxableOld = Math.max(0, annualIncome - totalOldDeductions);

    let oldTax = 0;
    let basicExemptionOld = 250000;
    if (ageGroup === '60_79') basicExemptionOld = 300000;
    if (ageGroup === '80_plus') basicExemptionOld = 500000;

    if (taxableOld > 1000000) {
      oldTax = (taxableOld - 1000000) * 0.30 + 112500;
    } else if (taxableOld > 500000) {
      oldTax = (taxableOld - 500000) * 0.20 + 12500;
    } else if (taxableOld > basicExemptionOld) {
      oldTax = (taxableOld - basicExemptionOld) * 0.05;
    }

    // Old Regime Sec 87A rebate (up to 5 Lakh taxable income)
    if (taxableOld <= 500000) {
      oldTax = 0;
    }
    const finalOldTax = Math.round(oldTax * 1.04); // 4% Cess

    // --- NEW REGIME CALCULATION (FY 2025-26 Budget Slabs) ---
    const newStdDeduction = 75000;
    const taxableNew = Math.max(0, annualIncome - newStdDeduction);

    let newTax = 0;
    // New regime slabs FY 2025-26:
    // 0-4L: Nil, 4-8L: 5%, 8-12L: 10%, 12-16L: 15%, 16-20L: 20%, 20-24L: 25%, >24L: 30%
    if (taxableNew > 2400000) {
      newTax = (taxableNew - 2400000) * 0.30 + 300000;
    } else if (taxableNew > 2000000) {
      newTax = (taxableNew - 2000000) * 0.25 + 200000;
    } else if (taxableNew > 1600000) {
      newTax = (taxableNew - 1600000) * 0.20 + 120000;
    } else if (taxableNew > 1200000) {
      newTax = (taxableNew - 1200000) * 0.15 + 60000;
    } else if (taxableNew > 800000) {
      newTax = (taxableNew - 800000) * 0.10 + 20000;
    } else if (taxableNew > 400000) {
      newTax = (taxableNew - 400000) * 0.05;
    }

    // New Regime Sec 87A rebate (Income up to 12 Lakhs is zero tax for FY 2025-26!)
    if (taxableNew <= 1200000) {
      newTax = 0;
    }
    const finalNewTax = Math.round(newTax * 1.04); // 4% Cess

    const diff = finalOldTax - finalNewTax;
    const effOld = annualIncome > 0 ? (finalOldTax / annualIncome) * 100 : 0;
    const effNew = annualIncome > 0 ? (finalNewTax / annualIncome) * 100 : 0;

    setOldRegimeTax(finalOldTax);
    setNewRegimeTax(finalNewTax);
    setEffectiveOldRate(effOld);
    setEffectiveNewRate(effNew);
    setTaxSavings(Math.abs(diff));
    setBetterRegime(diff >= 0 ? 'New' : 'Old');
  }, [annualIncome, ageGroup, financialYear, sec80C, sec80D, hraExemption, otherDeductions]);

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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Income Tax Calculator</h1>
        <p className="text-slate-600 text-base">
          Compare your tax liability under Old and New tax regimes with side-by-side analysis
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

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-700">Annual Income</label>
                  <CurrencyInput
                    value={annualIncome}
                    onValueChange={(val) => setAnnualIncome(val)}
                  />
                </div>
                <input
                  type="range"
                  min="10000"
                  max="5000000"
                  step="50000"
                  value={annualIncome}
                  onChange={(e) => setAnnualIncome(Number(e.target.value))}

                  style={getSliderStyle(annualIncome, "10000", "10000000")}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                  <span>₹0</span>
                  <span>₹50 Lakhs</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Age Group</label>
                  <select
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none font-semibold text-slate-800 bg-white text-sm"
                  >
                    <option value="below_60">Below 60 years</option>
                    <option value="60_79">60 to 79 years (Senior Citizen)</option>
                    <option value="80_plus">80 years and above (Super Senior)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Financial Year</label>
                  <select
                    value={financialYear}
                    onChange={(e) => setFinancialYear(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none font-semibold text-slate-800 bg-white text-sm"
                  >
                    <option value="fy_2025_26">FY 2025-26 (AY 2026-27)</option>
                    <option value="fy_2024_25">FY 2024-25 (AY 2025-26)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Deductions (Old Regime) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <button
                onClick={() => setShowDeductions(!showDeductions)}
                className="w-full p-6 flex justify-between items-center font-bold text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <span className="flex items-center gap-2 text-base">
                  <Sliders className="w-5 h-5 text-blue-600" /> Deductions (Old Tax Regime)
                </span>
                {showDeductions ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
              </button>

              {showDeductions && (
                <div className="p-6 pt-0 border-t border-slate-100 space-y-6 mt-4">
                  <p className="text-xs text-slate-500">
                    * These deductions apply only to the Old Tax Regime. The New Tax Regime allows standard deduction only.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-slate-700">Section 80C</label>
                        <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-300">
                          {formatCurrency(sec80C)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="150000"
                        step="5000"
                        value={sec80C}
                        onChange={(e) => setSec80C(Number(e.target.value))}

                        style={getSliderStyle(sec80C, "0", "150000")}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-slate-700">Section 80D (Health Insurance)</label>
                        <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-300">
                          {formatCurrency(sec80D)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100000"
                        step="5000"
                        value={sec80D}
                        onChange={(e) => setSec80D(Number(e.target.value))}

                        style={getSliderStyle(sec80D, "0", "100000")}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-slate-700">HRA Exemption</label>
                        <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-300">
                          {formatCurrency(hraExemption)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="500000"
                        step="10000"
                        value={hraExemption}
                        onChange={(e) => setHraExemption(Number(e.target.value))}

                        style={getSliderStyle(hraExemption, "0", "500000")}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-slate-700">Other Deductions (80G, 80E, Sec 24)</label>
                        <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-300">
                          {formatCurrency(otherDeductions)}
                        </span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="500000"
                        step="10000"
                        value={otherDeductions}
                        onChange={(e) => setOtherDeductions(Number(e.target.value))}

                        style={getSliderStyle(otherDeductions, "0", "500000")}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Comparison Summary Card */}
          <div className="w-full lg:w-[380px]">
            <div className="bg-[#1e2a4f] rounded-2xl shadow-xl p-6 md:p-8 text-white sticky top-28 border border-slate-600/50">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-bold tracking-tight">Tax Comparison</h2>
                <button className="text-slate-400 hover:text-white transition-colors p-1" title="Share">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-8 bg-slate-800/80 p-5 rounded-2xl border border-slate-600 text-center">
                <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
                  {betterRegime} Regime saves you more
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">
                  {formatCurrency(taxSavings)}
                </div>
                <div className="text-slate-400 text-xs">Tax Savings</div>
              </div>

              <div className="space-y-4 border-t border-slate-600/60 pt-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Old Tax Regime</span>
                  <span className="font-semibold text-white">{formatCurrency(oldRegimeTax)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">New Tax Regime</span>
                  <span className="font-semibold text-emerald-400">{formatCurrency(newRegimeTax)}</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-3 border-t border-slate-600/40">
                  <span className="text-slate-300">Effective Rate (Old)</span>
                  <span className="font-semibold text-slate-200">{effectiveOldRate.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Effective Rate (New)</span>
                  <span className="font-semibold text-emerald-400">{effectiveNewRate.toFixed(2)}%</span>
                </div>
              </div>

              <button className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2">
                Get Tax Planning Advice <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Informational SEO & FAQs Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-slate-200">
          <div className="md:col-span-2 space-y-8 text-slate-700 text-sm md:text-base leading-relaxed">
            <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Income Tax Calculator - Old vs New Regime</h2>
              <p className="text-slate-600 mb-4">
                The Indian Income Tax system offers taxpayers a choice between two tax regimes - the Old Regime with various deductions and exemptions, and the New Regime with lower tax rates but fewer deductions. Understanding the differences between these regimes is essential for optimizing your tax liability.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Old Tax Regime</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600 mb-4">
                <li>Allows deductions under Section 80C (up to 1.5 Lakh), 80D, HRA, LTA, and more</li>
                <li>Tax slabs: Nil up to 2.5L, 5% for 2.5–5L, 20% for 5–10L, 30% above 10L</li>
                <li>Standard deduction of Rs 50,000 for salaried individuals</li>
                <li>Beneficial for those with high deductions (home loan, insurance, PPF, ELSS)</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">New Tax Regime (Default from FY 2023-24)</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600 mb-4">
                <li>Lower and more tax slabs with reduced rates</li>
                <li>Standard deduction of Rs 75,000 (FY 2025-26)</li>
                <li>Most deductions and exemptions not available</li>
                <li>Better for individuals with fewer investments and deductions</li>
                <li>Rebate under Section 87A available for income up to Rs 12 Lakh</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">When to Choose Old Regime</h3>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 mb-4">
                <li>You have significant deductions under 80C, 80D, and other sections</li>
                <li>You receive HRA and pay rent in a metro city</li>
                <li>You have a home loan with interest and principal payments</li>
                <li>Your total deductions exceed Rs 3-4 Lakh annually</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">When to Choose New Regime</h3>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 mb-4">
                <li>You have minimal or no tax-saving investments</li>
                <li>You do not pay rent or receive HRA</li>
                <li>You prefer simplicity in tax filing</li>
                <li>Your income is below Rs 12 Lakh (full rebate available)</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-2">Using the Income Tax Calculator</h3>
              <p className="text-slate-600">
                Enter your annual income and deductions to instantly compare your tax liability under both the Old and New tax regimes. The calculator helps you determine which regime saves you more tax, enabling informed tax planning decisions.
              </p>
            </section>

            <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-2xl font-bold text-[#113262]">Frequently Asked Questions</h2>

              <div className="border-b border-slate-100 pb-5">
                <h3 className="font-bold text-slate-900 mb-2">What are the income tax slabs for FY 2025-26?</h3>
                <p className="text-slate-600 text-base">
                  Under the new regime (default): Up to Rs 4 lakh: Nil; Rs 4-8 lakh: 5%; Rs 8-12 lakh: 10%; Rs 12-16 lakh: 15%; Rs 16-20 lakh: 20%; Rs 20-24 lakh: 25%; Above Rs 24 lakh: 30%. A standard deduction of Rs 75,000 is available. The old regime retains the previous slabs with all deductions and exemptions.
                </p>
              </div>

              <div className="border-b border-slate-100 pb-5">
                <h3 className="font-bold text-slate-900 mb-2">Which tax regime should I choose?</h3>
                <p className="text-slate-600 text-base">
                  The new regime is better if your total deductions are less than Rs 3-4 lakh. The old regime benefits those claiming significant deductions: HRA, LTA, 80C (Rs 1.5L), 80D (health insurance), NPS 80CCD(1B) (Rs 50k), home loan interest (Section 24), etc. Use this calculator to compare both regimes with your actual numbers.
                </p>
              </div>

              <div className="border-b border-slate-100 pb-5">
                <h3 className="font-bold text-slate-900 mb-2">What is the rebate under Section 87A?</h3>
                <p className="text-slate-600 text-base">
                  Under the new regime, if your total taxable income is up to Rs 12 lakh (Rs 12.75 lakh for salaried individuals after standard deduction), you pay zero tax due to the Section 87A rebate. This effectively makes income up to Rs 12 lakh tax-free under the new regime.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-2">How do I calculate tax on salary income?</h3>
                <p className="text-slate-600 text-base">
                  Start with gross salary. Subtract exempt allowances (HRA, LTA under old regime). Subtract standard deduction (Rs 75,000). Subtract Chapter VI-A deductions (80C, 80D, etc. under old regime). Apply tax slab rates to the taxable income. Add cess at 4%. Subtract TDS already deducted to arrive at tax payable or refund due.
                </p>
              </div>
            </section>
          </div>

          {/* Right Column: SEO Card */}
          <div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-lg">How This Calculator Works</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Enter your salary details, other income sources, deductions, and exemptions. The calculator computes your tax liability under both the old and new tax regimes, showing a side-by-side comparison. It factors in Section 87A rebate, surcharge, and health and education cess to give your exact payable amount.
              </p>

              <h4 className="font-bold text-slate-800 text-sm">Tax-Saving Strategies for Salaried Employees</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Maximize 80C investments (ELSS, PPF, EPF), claim 80D for health insurance (Rs 25,000 for self + Rs 50,000 for senior citizen parents), contribute to NPS for 80CCD(1B) (Rs 50,000), optimize HRA through actual rent payments, and use LTA for domestic travel. Plan before March to avoid last-minute tax-saving investments.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

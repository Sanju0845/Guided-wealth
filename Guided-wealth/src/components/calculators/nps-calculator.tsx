import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

export default function NpsCalculator() {
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(60);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(5000);
  const [currentNpsBalance, setCurrentNpsBalance] = useState<number>(200000);

  // Asset Allocation %
  const [equityPct, setEquityPct] = useState<number>(50);
  const [corporateDebtPct, setCorporateDebtPct] = useState<number>(30);
  const [govtSecuritiesPct, setGovtSecuritiesPct] = useState<number>(20);

  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const [projectedCorpus, setProjectedCorpus] = useState<number>(0);
  const [lumpSum60, setLumpSum60] = useState<number>(0);
  const [annuity40, setAnnuity40] = useState<number>(0);
  const [monthlyPension, setMonthlyPension] = useState<number>(0);
  const [annualTaxSaving, setAnnualTaxSaving] = useState<number>(0);
  const [expectedReturnRate, setExpectedReturnRate] = useState<number>(0);
  const [wealthGainRatio, setWealthGainRatio] = useState<number>(0);

  useEffect(() => {
    // Normalize total allocation
    const totalAlloc = equityPct + corporateDebtPct + govtSecuritiesPct;
    const eNorm = totalAlloc > 0 ? equityPct / totalAlloc : 0.5;
    const cNorm = totalAlloc > 0 ? corporateDebtPct / totalAlloc : 0.3;
    const gNorm = totalAlloc > 0 ? govtSecuritiesPct / totalAlloc : 0.2;

    // Weighted return: Equity ~ 12%, Corporate Debt ~ 8%, Govt Securities ~ 7%
    const weightedRate = eNorm * 12 + cNorm * 8 + gNorm * 7;
    setExpectedReturnRate(weightedRate);

    const yearsToRetire = Math.max(1, retirementAge - currentAge);
    const monthsToRetire = yearsToRetire * 12;

    const r = weightedRate / 100 / 12;

    const fvExisting = currentNpsBalance * Math.pow(1 + weightedRate / 100, yearsToRetire);
    const fvMonthly = monthlyContribution > 0 && r > 0
      ? monthlyContribution * ((Math.pow(1 + r, monthsToRetire) - 1) / r) * (1 + r)
      : monthlyContribution * monthsToRetire;

    const corpus = fvExisting + fvMonthly;
    const lumpSum = corpus * 0.6;
    const annuity = corpus * 0.4;
    const pen = (annuity * 0.06) / 12;

    const totalDeposited = currentNpsBalance + monthlyContribution * monthsToRetire;
    const ratio = totalDeposited > 0 ? corpus / totalDeposited : 1;

    // Tax saving under 80CCD(1B) up to 50k at 30% slab + 4% cess = 31.2%
    const annualDeduction = Math.min(50000, monthlyContribution * 12);
    const taxSaved = Math.round(annualDeduction * 0.312);

    setProjectedCorpus(corpus);
    setLumpSum60(lumpSum);
    setAnnuity40(annuity);
    setMonthlyPension(pen);
    setAnnualTaxSaving(taxSaved);
    setWealthGainRatio(ratio);
  }, [currentAge, retirementAge, monthlyContribution, currentNpsBalance, equityPct, corporateDebtPct, govtSecuritiesPct]);

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
      {/* Header */}
      <div className="bg-white pt-32 pb-10 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">NPS Calculator</h1>
        <p className="text-slate-600 text-base">Plan your retirement through the National Pension System</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Inputs Column */}
          <div className="flex-1 space-y-6">
            {/* Basic Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Basic Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Current Age</label>
                    <span className="text-sm font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">{currentAge} Yr</span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="60"
                    step="1"
                    value={currentAge}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setCurrentAge(val);
                      if (val >= retirementAge) setRetirementAge(val + 1);
                    }}

                    style={getSliderStyle(currentAge, "18", "60")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Retirement Age</label>
                    <span className="text-sm font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">{retirementAge} Yr</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="70"
                    step="1"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(Math.max(currentAge + 1, Number(e.target.value)))}

                    style={getSliderStyle(retirementAge, "40", "70")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>
              </div>
            </div>

            {/* Contribution Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Contribution Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Monthly Contribution</label>
                  <CurrencyInput value={monthlyContribution} onValueChange={(val) => setMonthlyContribution(Math.max(500, val))} />
                  <div>
                    <input
                      type="range"
                      min="500"
                      max="100000"
                      step="500"
                      value={monthlyContribution}
                      onChange={(e) => setMonthlyContribution(Number(e.target.value))}

                      style={getSliderStyle(monthlyContribution, "500", "100000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Current NPS Balance</label>
                  <CurrencyInput
                    value={currentNpsBalance}
                    onValueChange={(val) => setCurrentNpsBalance(val)}
                  />
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="5000000"
                      step="50000"
                      value={currentNpsBalance}
                      onChange={(e) => setCurrentNpsBalance(Number(e.target.value))}

                      style={getSliderStyle(currentNpsBalance, "0", "5000000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Asset Allocation */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Asset Allocation</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1 text-sm font-medium">
                    <span>Equity (E)</span>
                    <span className="font-semibold">{equityPct}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="75"
                    step="5"
                    value={equityPct}
                    onChange={(e) => setEquityPct(Number(e.target.value))}

                    style={getSliderStyle(equityPct, "0", "75")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1 text-sm font-medium">
                    <span>Corporate Debt (C)</span>
                    <span className="font-semibold">{corporateDebtPct}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={corporateDebtPct}
                    onChange={(e) => setCorporateDebtPct(Number(e.target.value))}

                    style={getSliderStyle(corporateDebtPct, "0", "100")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1 text-sm font-medium">
                    <span>Government Securities (G)</span>
                    <span className="font-semibold">{govtSecuritiesPct}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={govtSecuritiesPct}
                    onChange={(e) => setGovtSecuritiesPct(Number(e.target.value))}

                    style={getSliderStyle(govtSecuritiesPct, "0", "100")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full p-6 flex justify-between items-center font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <span>Advanced Settings</span>
                {showAdvanced ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
              </button>

              {showAdvanced && (
                <div className="p-6 pt-0 border-t border-slate-100 mt-4 text-xs text-slate-500">
                  NPS allows up to ₹50,000 extra tax deduction under Section 80CCD(1B) over and above Section 80C.
                </div>
              )}
            </div>
          </div>

          {/* Results Sidebar */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-[#1e2a4f] rounded-2xl shadow-xl p-6 md:p-8 text-white h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-bold tracking-tight">NPS Projection</h2>
                  <button className="text-slate-400 hover:text-white transition-colors" title="Share">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-8">
                  <div className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-1">
                    {formatCurrency(projectedCorpus)}
                  </div>
                  <div className="text-slate-300 text-sm font-medium">Projected Corpus at Retirement</div>
                </div>

                <div className="space-y-4 border-t border-slate-600/60 pt-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Lump Sum (60%)</span>
                    <span className="font-semibold text-white">{formatCurrency(lumpSum60)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Annuity Investment (40%)</span>
                    <span className="font-semibold text-white">{formatCurrency(annuity40)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Monthly Pension</span>
                    <span className="font-semibold text-emerald-400">{formatCurrency(monthlyPension)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Annual Tax Saving</span>
                    <span className="font-semibold text-emerald-400">{formatCurrency(annualTaxSaving)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Expected Returns</span>
                    <span className="font-semibold text-white">{expectedReturnRate.toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-600/40">
                    <span className="text-slate-300">Wealth Gain Ratio</span>
                    <span className="font-semibold text-emerald-400">{wealthGainRatio.toFixed(2)}x</span>
                  </div>
                </div>
              </div>

              <button className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2">
                Get Expert Advice <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Informational Section */}
        <div className="max-w-4xl space-y-12 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#113262] mb-4">What is NPS?</h2>
            <p className="text-slate-600">
              The National Pension System (NPS) is a government-sponsored retirement scheme that helps you build a secure financial future. It's a defined contribution pension system where you can invest regularly during your working years.
            </p>
          </section>

          <section className="pt-6">
            <h2 className="text-xl font-bold text-[#113262] mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">What is NPS?</h3>
                <p className="text-sm text-slate-600">NPS is a market-linked retirement savings scheme regulated by PFRDA. It invests in equities, government bonds, and corporate debt based on your chosen asset allocation.</p>
              </div>

              <div className="pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">How much tax can I save with NPS?</h3>
                <p className="text-sm text-slate-600">You can claim up to ₹1.5 Lakh under 80CCD(1) within Section 80C, plus an additional ₹50,000 under Section 80CCD(1B).</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

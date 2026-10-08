import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

export default function NpsReinvestmentInAnnuity() {
  const [currentAge, setCurrentAge] = useState<number>(35);
  const [retirementAge, setRetirementAge] = useState<number>(60);
  const [currentNpsBalance, setCurrentNpsBalance] = useState<number>(500000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(10000);
  const [annuityPct, setAnnuityPct] = useState<number>(40);
  const [annuityOption, setAnnuityOption] = useState<string>('Lifetime Pension (Subscriber)');

  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [expectedReturn, setExpectedReturn] = useState<number>(10);
  const [annuityRate, setAnnuityRate] = useState<number>(6);

  const [monthlyPension, setMonthlyPension] = useState<number>(0);
  const [npsCorpusAtRetirement, setNpsCorpusAtRetirement] = useState<number>(0);
  const [lumpSumAmount, setLumpSumAmount] = useState<number>(0);
  const [annuityInvestment, setAnnuityInvestment] = useState<number>(0);
  const [taxOnLumpSum, setTaxOnLumpSum] = useState<number>(0);
  const [netLumpSum, setNetLumpSum] = useState<number>(0);

  useEffect(() => {
    const yearsToRetire = Math.max(1, retirementAge - currentAge);
    const monthsToRetire = yearsToRetire * 12;

    const r = expectedReturn / 100 / 12;

    const fvExisting = currentNpsBalance * Math.pow(1 + expectedReturn / 100, yearsToRetire);
    const fvContrib = monthlyContribution > 0 && r > 0
      ? monthlyContribution * ((Math.pow(1 + r, monthsToRetire) - 1) / r) * (1 + r)
      : monthlyContribution * monthsToRetire;

    const totalCorpus = fvExisting + fvContrib;

    const annuityVal = totalCorpus * (annuityPct / 100);
    const lumpSumVal = totalCorpus - annuityVal;

    const monthlyPen = (annuityVal * (annuityRate / 100)) / 12;

    setNpsCorpusAtRetirement(totalCorpus);
    setAnnuityInvestment(annuityVal);
    setLumpSumAmount(lumpSumVal);
    setTaxOnLumpSum(0); // 60% lump sum is 100% tax free under current IT rules
    setNetLumpSum(lumpSumVal);
    setMonthlyPension(monthlyPen);
  }, [currentAge, retirementAge, currentNpsBalance, monthlyContribution, annuityPct, annuityOption, expectedReturn, annuityRate]);

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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">NPS Annuity Calculator</h1>
        <p className="text-slate-600 text-base">Plan your pension through NPS annuity investment</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Inputs Column */}
          <div className="flex-1 space-y-6">
            {/* Age Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Age Details</h2>
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

            {/* NPS Account Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">NPS Account Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      max="10000000"
                      step="50000"
                      value={currentNpsBalance}
                      onChange={(e) => setCurrentNpsBalance(Number(e.target.value))}

                      style={getSliderStyle(currentNpsBalance, "0", "10000000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Monthly Contribution</label>
                  <input
                    type="number"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(Math.max(0, Number(e.target.value)))}
                  />
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
              </div>
            </div>

            {/* Annuity Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Annuity Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Percentage to Invest in Annuity</label>
                    <span className="text-sm font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">{annuityPct}%</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="100"
                    step="5"
                    value={annuityPct}
                    onChange={(e) => setAnnuityPct(Number(e.target.value))}

                    style={getSliderStyle(annuityPct, "40", "100")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <span className="text-xs text-slate-400 mt-1 block">Note: Minimum 40% of NPS corpus must be invested in annuity.</span>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Annuity Option</label>
                  <select
                    value={annuityOption}
                    onChange={(e) => setAnnuityOption(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none font-semibold text-slate-800 bg-white text-sm"
                  >
                    <option value="Lifetime Pension (Subscriber)">Lifetime Pension (Subscriber)</option>
                    <option value="Joint Life Pension">Joint Life Pension</option>
                    <option value="Annuity with Return of Purchase Price">Annuity with Return of Purchase Price</option>
                  </select>
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
                <div className="p-6 pt-0 border-t border-slate-100 mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Expected Return (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={expectedReturn}
                      onChange={(e) => setExpectedReturn(Number(e.target.value))}
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Annuity Return Rate (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={annuityRate}
                      onChange={(e) => setAnnuityRate(Number(e.target.value))}
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none font-semibold text-slate-800"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Sidebar */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-[#1e2a4f] rounded-2xl shadow-xl p-6 md:p-8 text-white h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-bold tracking-tight">NPS Annuity Results</h2>
                  <button className="text-slate-400 hover:text-white transition-colors" title="Share">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-8">
                  <div className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-1">
                    {formatCurrency(monthlyPension)}
                  </div>
                  <div className="text-slate-300 text-sm font-medium">Monthly Pension</div>
                </div>

                <div className="space-y-4 border-t border-slate-600/60 pt-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">NPS Corpus at Retirement</span>
                    <span className="font-semibold text-white">{formatCurrency(npsCorpusAtRetirement)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Lump Sum Amount ({100 - annuityPct}%)</span>
                    <span className="font-semibold text-white">{formatCurrency(lumpSumAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Annuity Investment ({annuityPct}%)</span>
                    <span className="font-semibold text-emerald-400">{formatCurrency(annuityInvestment)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Tax on Lump Sum</span>
                    <span className="font-semibold text-emerald-400">{formatCurrency(taxOnLumpSum)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-600/40">
                    <span className="text-slate-300">Effective Annuity Return</span>
                    <span className="font-semibold text-white">{annuityRate.toFixed(2)}%</span>
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
            <h2 className="text-xl font-bold text-[#113262] mb-4">What is NPS Reinvestment?</h2>
            <p className="text-slate-600">
              NPS (National Pension System) reinvestment refers to the strategic allocation of your accumulated NPS corpus at retirement. Upon reaching 60 years, subscribers can withdraw up to 60% of their corpus tax-free, while the remaining minimum 40% must be used to purchase an annuity for regular pension income.
            </p>
          </section>

          <section className="pt-6">
            <h2 className="text-xl font-bold text-[#113262] mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">What is NPS reinvestment in annuity?</h3>
                <p className="text-sm text-slate-600">When you retire from NPS, at least 40% of your corpus must be used to buy an annuity from an PFRDA-approved insurance company providing a regular pension for life.</p>
              </div>

              <div className="pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">Which annuity option should I choose?</h3>
                <p className="text-sm text-slate-600">Options include life annuity (pension for life), joint life annuity (pension continues for spouse), and annuity with return of purchase price.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

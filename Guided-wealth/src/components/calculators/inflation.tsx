import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp, Flame, DollarSign, Calendar, Percent, Sliders, Info } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

export default function Inflation() {
  // Basic Inflation Details
  const [currentAmount, setCurrentAmount] = useState<number>(100000);
  const [annualInflationRate, setAnnualInflationRate] = useState<number>(6);
  const [timePeriodYears, setTimePeriodYears] = useState<number>(10);

  // Advanced Inputs
  const [showAdvanced, setShowAdvanced] = useState<boolean>(true);
  const [currentMonthlyIncome, setCurrentMonthlyIncome] = useState<number>(50000);
  const [currentMonthlyExpenses, setCurrentMonthlyExpenses] = useState<number>(40000);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Computed Outputs
  const [futureEquivalentValue, setFutureEquivalentValue] = useState<number>(0);
  const [purchasingPowerLoss, setPurchasingPowerLoss] = useState<number>(0);
  const [lossInPurchasingPowerPct, setLossInPurchasingPowerPct] = useState<number>(0);
  const [requiredFutureIncome, setRequiredFutureIncome] = useState<number>(0);
  const [futureMonthlyExpenses, setFutureMonthlyExpenses] = useState<number>(0);
  const [savingsErosionPct, setSavingsErosionPct] = useState<number>(0);
  const [realReturnRate, setRealReturnRate] = useState<number>(0);

  useEffect(() => {
    const i = annualInflationRate / 100;
    const n = Math.max(1, timePeriodYears);
    const inflationFactor = Math.pow(1 + i, n);

    const futVal = Math.round(currentAmount * inflationFactor);
    const powerLoss = futVal - currentAmount;

    // Purchasing power of current money in future terms = currentAmount / inflationFactor
    const presentPowerOfFutureMoney = currentAmount / inflationFactor;
    const lossPct = futVal > 0 ? ((futVal - currentAmount) / futVal) * 100 : 0;

    const reqIncome = Math.round(currentMonthlyIncome * inflationFactor);
    const futExpenses = Math.round(currentMonthlyExpenses * inflationFactor);

    // Real return assuming 8% nominal investment return = ((1+0.08)/(1+i) - 1)*100
    const nominalRate = 0.08;
    const realRate = ((1 + nominalRate) / (1 + i) - 1) * 100;

    setFutureEquivalentValue(futVal);
    setPurchasingPowerLoss(powerLoss);
    setLossInPurchasingPowerPct(lossPct);
    setRequiredFutureIncome(reqIncome);
    setFutureMonthlyExpenses(futExpenses);
    setSavingsErosionPct(lossPct);
    setRealReturnRate(realRate);
  }, [currentAmount, annualInflationRate, timePeriodYears, currentMonthlyIncome, currentMonthlyExpenses]);

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
      q: 'What is the current inflation rate in India?',
      a: 'India CPI inflation is approximately 4-5% as of 2024-2025, within RBI target band of 2-6%. However, actual experienced inflation varies: food inflation is 6-8%, education 10-12%, healthcare 10-14%, and housing 4-6%. Always use category-specific inflation rates for long-term planning.',
    },
    {
      q: 'How does inflation erode purchasing power?',
      a: 'At 6% annual inflation, the purchasing power of ₹1 Lakh drops to ₹55,839 in 10 years and ₹31,180 in 20 years. This means ₹1 Lakh today will buy only ₹31,200 worth of goods in 20 years. This is why investments must earn returns above inflation rate.',
    },
    {
      q: 'Which investments beat inflation in India?',
      a: 'Equity mutual funds (12-15% CAGR) and direct stocks comfortably beat inflation over 5+ years. Gold (10-11% long-term) provides an inflation hedge. PPF (7.1%) and EPF (8.25%) roughly match or slightly beat inflation. Savings accounts (2.5-3%) lose purchasing power after tax.',
    },
    {
      q: 'How do I calculate real return on investments?',
      a: 'Real Return % = [(1 + Nominal Return %) / (1 + Inflation Rate %)] - 1. For example, an 8% Fixed Deposit during 6% inflation delivers a real return of only 1.89% before tax.',
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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Inflation Calculator</h1>
        <p className="text-slate-600 text-base">
          Calculate the impact of inflation on your money, purchasing power, and future income requirements over time.
        </p>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mt-12">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Flame className="w-5 h-5 text-[#113262]" /> Basic Inflation Details
              </h2>

              {/* Current Amount */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-700">Current Amount (₹)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium">₹</span>
                    <CurrencyInput
                    value={currentAmount}
                    onValueChange={(val) => setCurrentAmount(val)}
                  />
                  </div>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="10000000"
                  step="10000"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(Number(e.target.value))}

                  style={getSliderStyle(currentAmount, "1000", "10000000")}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                />
              </div>

              {/* Inflation Rate & Time Period */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Annual Inflation Rate (% p.a.)</label>
                    <span className="font-bold text-[#113262] text-sm bg-sky-50 px-2.5 py-1 rounded-md">{annualInflationRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="0.5"
                    value={annualInflationRate}
                    onChange={(e) => setAnnualInflationRate(Number(e.target.value))}

                    style={getSliderStyle(annualInflationRate, "1", "20")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Time Period (Years)</label>
                    <span className="font-bold text-slate-900 text-sm bg-slate-100 px-2.5 py-1 rounded-md">{timePeriodYears} Years</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    step="1"
                    value={timePeriodYears}
                    onChange={(e) => setTimePeriodYears(Number(e.target.value))}

                    style={getSliderStyle(timePeriodYears, "1", "50")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
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
                    <Sliders className="w-4 h-4 text-[#113262]" /> Future Income & Expenses Projection
                  </span>
                  {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showAdvanced && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-medium text-slate-700">Current Monthly Income (₹)</label>
                        <span className="font-bold text-slate-900 text-xs">{formatCurrency(currentMonthlyIncome)}</span>
                      </div>
                      <input
                        type="range"
                        min="10000"
                        max="1000000"
                        step="5000"
                        value={currentMonthlyIncome}
                        onChange={(e) => setCurrentMonthlyIncome(Number(e.target.value))}

                        style={getSliderStyle(currentMonthlyIncome, "10000", "1000000")}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-medium text-slate-700">Current Monthly Expenses (₹)</label>
                        <span className="font-bold text-slate-900 text-xs">{formatCurrency(currentMonthlyExpenses)}</span>
                      </div>
                      <input
                        type="range"
                        min="5000"
                        max="1000000"
                        step="5000"
                        value={currentMonthlyExpenses}
                        onChange={(e) => setCurrentMonthlyExpenses(Number(e.target.value))}

                        style={getSliderStyle(currentMonthlyExpenses, "5000", "1000000")}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                      />
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
                <h3 className="text-lg font-bold">Inflation Impact</h3>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Inflation Impact Summary',
                        text: `Future Equivalent Value of ${formatCurrency(currentAmount)} in ${timePeriodYears} years at ${annualInflationRate}% inflation is ${formatCurrency(futureEquivalentValue)}.`,
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
                <div className="text-xs text-slate-400 mb-1 font-medium">Future equivalent value</div>
                <div className="text-3xl font-extrabold text-white">{formatCurrency(futureEquivalentValue)}</div>
                <div className="text-xs text-rose-400 mt-1 font-medium">
                  {lossInPurchasingPowerPct.toFixed(2)}% Purchasing Power Loss
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-3 text-sm border-t border-slate-800 pt-4">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Purchasing Power Loss</span>
                  <span className="font-semibold text-rose-400">{formatCurrency(purchasingPowerLoss)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Loss in Purchasing Power</span>
                  <span className="font-semibold text-white">{lossInPurchasingPowerPct.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Required Future Income</span>
                  <span className="font-semibold text-white">{formatCurrency(requiredFutureIncome)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Future Monthly Expenses</span>
                  <span className="font-semibold text-white">{formatCurrency(futureMonthlyExpenses)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Savings Erosion</span>
                  <span className="font-semibold text-white">{savingsErosionPct.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between items-center text-slate-300 pt-3 border-t border-slate-800">
                  <span className="font-bold text-white">Real Return Rate (at 8% nominal)</span>
                  <span className="font-bold text-[#EAB308] text-base">{realReturnRate.toFixed(2)}%</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <button
                  onClick={() => window.scrollTo({ top: 1000, behavior: 'smooth' })}
                  className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2"
                >
                  Consult Financial Advisor →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Informational SEO Content & Guide */}
        <div className="max-w-4xl space-y-12 text-slate-700 leading-relaxed mt-12">
          <h2 className="text-xl font-bold text-[#113262] mb-4">Understand Inflation's Impact on Your Money</h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6">
            Enter an amount and the number of years to see its future cost at different inflation rates. The calculator also works in reverse: enter a future expense to see its equivalent in today's rupees. Use it for retirement planning, education planning, and any long-term financial goal to set inflation-adjusted targets.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-700 border-t border-slate-100 pt-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Category-Specific Inflation</h3>
              <p className="text-slate-600 mb-2">Different expenses inflate at different rates in India:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li><strong>General CPI:</strong> 5-6% per annum</li>
                <li><strong>Education Inflation:</strong> 10-12% per annum</li>
                <li><strong>Healthcare Inflation:</strong> 10-14% per annum</li>
                <li><strong>Housing & Lifestyle:</strong> 6-8% per annum</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">How It Works</h3>
              <p className="mb-2">The calculator uses the compound inflation formula:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li><strong>Future Value:</strong> Present Amount × (1 + Inflation Rate)ⁿ</li>
                <li><strong>Purchasing Power Loss:</strong> Future Value - Present Amount</li>
                <li><strong>Real Rate of Return:</strong> ((1 + Nominal Rate) / (1 + Inflation Rate)) - 1</li>
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

import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp, BarChart2, DollarSign, Sliders, Info } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

export default function EbidtaMarginCalculator() {
  // Revenue & Direct Costs
  const [revenue, setRevenue] = useState<number>(10000000);
  const [cogs, setCogs] = useState<number>(6000000);

  // Operating Expenses
  const [operatingExpenses, setOperatingExpenses] = useState<number>(1300000);

  // EBITDA Components
  const [depreciation, setDepreciation] = useState<number>(500000);
  const [amortization, setAmortization] = useState<number>(200000);

  // Advanced Inputs
  const [showAdvanced, setShowAdvanced] = useState<boolean>(true);
  const [interestExpense, setInterestExpense] = useState<number>(300000);
  const [taxes, setTaxes] = useState<number>(400000);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Computed Outputs
  const [grossProfit, setGrossProfit] = useState<number>(0);
  const [grossProfitMarginPct, setGrossProfitMarginPct] = useState<number>(0);
  const [ebitda, setEbitda] = useState<number>(0);
  const [ebitdaMarginPct, setEbitdaMarginPct] = useState<number>(0);
  const [ebit, setEbit] = useState<number>(0);
  const [operatingMarginPct, setOperatingMarginPct] = useState<number>(0);
  const [netIncome, setNetIncome] = useState<number>(0);

  useEffect(() => {
    const R = Math.max(1, revenue);
    const gross = R - cogs;
    const grossMargin = (gross / R) * 100;

    const calcEbitda = gross - operatingExpenses;
    const ebitdaMargin = (calcEbitda / R) * 100;

    const calcEbit = calcEbitda - (depreciation + amortization);
    const opMargin = (calcEbit / R) * 100;

    const netInc = calcEbit - interestExpense - taxes;

    setGrossProfit(gross);
    setGrossProfitMarginPct(grossMargin);
    setEbitda(calcEbitda);
    setEbitdaMarginPct(ebitdaMargin);
    setEbit(calcEbit);
    setOperatingMarginPct(opMargin);
    setNetIncome(netInc);
  }, [revenue, cogs, operatingExpenses, depreciation, amortization, interestExpense, taxes]);

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
      q: 'What is EBITDA?',
      a: 'EBITDA stands for Earnings Before Interest, Taxes, Depreciation, and Amortization. It measures a company core operational profitability by stripping out financing decisions (interest), tax regimes, and non-cash accounting expenses (depreciation & amortization). EBITDA Margin % = (EBITDA / Total Revenue) x 100.',
    },
    {
      q: 'What is a good EBITDA margin in India?',
      a: 'A good EBITDA margin varies by industry: IT Services (20-30%), Pharma (20-28%), FMCG (18-25%), Auto (10-15%), Retail (8-12%). Higher EBITDA margins reflect strong pricing power and operational efficiency.',
    },
    {
      q: 'Why do investors focus on EBITDA?',
      a: 'EBITDA allows apple-to-apple comparison across companies with different capital structures, tax jurisdictions, and depreciation policies. It approximates operational cash flow before capital expenditures.',
    },
    {
      q: 'What is the difference between EBITDA and Net Profit?',
      a: 'EBITDA measures operating cash profitability before debt servicing, taxes, and asset depreciation. Net Profit (Net Income) is the final bottom-line earnings left for shareholders after all expenses, interest, depreciation, and taxes are deducted.',
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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">EBITDA Margin Calculator</h1>
        <p className="text-slate-600 text-base">
          Calculate and analyze your company's EBITDA, operating margin, gross margin, and net profit.
        </p>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mt-12">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-[#113262]" /> Revenue & Direct Costs
              </h2>

              {/* Revenue & COGS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Revenue (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium">₹</span>
                      <input
                        type="number"
                        value={revenue}
                        onChange={(e) => setRevenue(Math.max(0, Number(e.target.value)))}
                      />
                    </div>
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="100000000"
                    step="500000"
                    value={revenue}
                    onChange={(e) => setRevenue(Number(e.target.value))}

                    style={getSliderStyle(revenue, "100000", "100000000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Cost of Goods Sold (COGS) (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium">₹</span>
                      <input
                        type="number"
                        value={cogs}
                        onChange={(e) => setCogs(Math.max(0, Number(e.target.value)))}
                      />
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100000000"
                    step="500000"
                    value={cogs}
                    onChange={(e) => setCogs(Number(e.target.value))}

                    style={getSliderStyle(cogs, "0", "100000000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-6 pt-4 border-t border-slate-100">
                Operating Expenses
              </h2>

              {/* Operating Expenses */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-700">Operating Expenses (OPEX) (₹)</label>
                  <div className="relative">
                    <CurrencyInput
                    value={operatingExpenses}
                    onValueChange={(val) => setOperatingExpenses(val)}
                  />
                  </div>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50000000"
                  step="250000"
                  value={operatingExpenses}
                  onChange={(e) => setOperatingExpenses(Number(e.target.value))}

                  style={getSliderStyle(operatingExpenses, "0", "50000000")}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                />
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-6 pt-4 border-t border-slate-100">
                EBITDA Components
              </h2>

              {/* Depreciation & Amortization */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Depreciation (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium">₹</span>
                      <input
                        type="number"
                        value={depreciation}
                        onChange={(e) => setDepreciation(Math.max(0, Number(e.target.value)))}
                      />
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10000000"
                    step="50000"
                    value={depreciation}
                    onChange={(e) => setDepreciation(Number(e.target.value))}

                    style={getSliderStyle(depreciation, "0", "10000000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Amortization (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium">₹</span>
                      <input
                        type="number"
                        value={amortization}
                        onChange={(e) => setAmortization(Math.max(0, Number(e.target.value)))}
                      />
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10000000"
                    step="50000"
                    value={amortization}
                    onChange={(e) => setAmortization(Number(e.target.value))}

                    style={getSliderStyle(amortization, "0", "10000000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
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
                    <Sliders className="w-4 h-4 text-[#113262]" /> Additional Financial Details (Interest & Taxes)
                  </span>
                  {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showAdvanced && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-medium text-slate-700">Interest Expense (₹)</label>
                        <span className="font-bold text-slate-900 text-xs">{formatCurrency(interestExpense)}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10000000"
                        step="50000"
                        value={interestExpense}
                        onChange={(e) => setInterestExpense(Number(e.target.value))}

                        style={getSliderStyle(interestExpense, "0", "10000000")}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-medium text-slate-700">Taxes (₹)</label>
                        <span className="font-bold text-slate-900 text-xs">{formatCurrency(taxes)}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="10000000"
                        step="50000"
                        value={taxes}
                        onChange={(e) => setTaxes(Number(e.target.value))}

                        style={getSliderStyle(taxes, "0", "10000000")}
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
                <h3 className="text-lg font-bold">EBITDA Analysis</h3>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'EBITDA Analysis Summary',
                        text: `EBITDA: ${formatCurrency(ebitda)} (EBITDA Margin: ${ebitdaMarginPct.toFixed(2)}%) for revenue of ${formatCurrency(revenue)}.`,
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
                <div className="text-xs text-slate-400 mb-1 font-medium">EBITDA</div>
                <div className="text-3xl font-extrabold text-white">{formatCurrency(ebitda)}</div>
                <div className="text-xs text-emerald-400 mt-1 font-medium">
                  {ebitdaMarginPct.toFixed(2)}% EBITDA Margin
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-3.5 text-sm border-t border-slate-800 pt-4">
                <div className="flex justify-between items-center text-slate-300">
                  <span>EBITDA Margin</span>
                  <span className="font-semibold text-emerald-400">{ebitdaMarginPct.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Gross Profit</span>
                  <span className="font-semibold text-white">{formatCurrency(grossProfit)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Gross Profit Margin</span>
                  <span className="font-semibold text-white">{grossProfitMarginPct.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Operating Income (EBIT)</span>
                  <span className="font-semibold text-white">{formatCurrency(ebit)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Operating Margin</span>
                  <span className="font-semibold text-white">{operatingMarginPct.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between items-center text-slate-300 pt-3 border-t border-slate-800">
                  <span className="font-bold text-white">Net Income</span>
                  <span className="font-bold text-[#EAB308] text-base">{formatCurrency(netIncome)}</span>
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
          <h2 className="text-xl font-bold text-[#113262] mb-4">Analyse Operating Profitability</h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6">
            Enter revenue, operating expenses, or directly input EBITDA. The calculator computes the EBITDA margin and compares it against sector benchmarks. It helps investors evaluate a company's operational efficiency and track margin trends over time.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-700 border-t border-slate-100 pt-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Key Components</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li><strong>Revenue:</strong> Total business turnover.</li>
                <li><strong>COGS:</strong> Direct production & material costs.</li>
                <li><strong>OPEX:</strong> Operating expenses excluding D&A.</li>
                <li><strong>Depreciation & Amortization:</strong> Non-cash asset write-offs.</li>
                <li><strong>Net Income:</strong> Final post-tax profit.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">How It Works</h3>
              <p className="mb-2">The calculator uses standard corporate finance formulas:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li><strong>Gross Profit:</strong> Revenue - COGS</li>
                <li><strong>EBITDA:</strong> Gross Profit - OPEX</li>
                <li><strong>EBITDA Margin:</strong> (EBITDA / Revenue) × 100</li>
                <li><strong>EBIT:</strong> EBITDA - (Depreciation + Amortization)</li>
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

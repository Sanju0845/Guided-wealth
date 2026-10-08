import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

export default function DividendYieldCalculator() {
  const [stockPrice, setStockPrice] = useState<number>(100);
  const [annualDividend, setAnnualDividend] = useState<number>(5);
  const [numberOfShares, setNumberOfShares] = useState<number>(100);
  const [growthRate, setGrowthRate] = useState<number>(5);
  const [years, setYears] = useState<number>(5);

  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const [dividendYield, setDividendYield] = useState<number>(0);
  const [totalInvestment, setTotalInvestment] = useState<number>(0);
  const [annualDividendIncome, setAnnualDividendIncome] = useState<number>(0);
  const [projectedTotalDividend, setProjectedTotalDividend] = useState<number>(0);
  const [finalValue, setFinalValue] = useState<number>(0);

  useEffect(() => {
    if (stockPrice <= 0 || numberOfShares <= 0) {
      setDividendYield(0);
      setTotalInvestment(0);
      setAnnualDividendIncome(0);
      setProjectedTotalDividend(0);
      setFinalValue(0);
      return;
    }

    const yieldPct = (annualDividend / stockPrice) * 100;
    const totInv = stockPrice * numberOfShares;
    const initialAnnualIncome = annualDividend * numberOfShares;

    let cumulativeDividends = 0;
    let currentAnnualDiv = initialAnnualIncome;

    for (let i = 1; i <= years; i++) {
      cumulativeDividends += currentAnnualDiv;
      currentAnnualDiv *= (1 + growthRate / 100);
    }

    setDividendYield(yieldPct);
    setTotalInvestment(totInv);
    setAnnualDividendIncome(initialAnnualIncome);
    setProjectedTotalDividend(cumulativeDividends);
    setFinalValue(totInv);
  }, [stockPrice, annualDividend, numberOfShares, growthRate, years]);

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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Dividend Yield Calculator</h1>
        <p className="text-slate-600 text-base">Estimate dividend yields with this calculator.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Calculator Layout */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Left Column: Inputs */}
          <div className="flex-1 space-y-6">
            {/* Stock Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Stock Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Stock Price (₹)</label>
                  <CurrencyInput
                    value={stockPrice}
                    onValueChange={(val) => setStockPrice(val)}
                  />
                  <div>
                    <input
                      type="range"
                      min="1"
                      max="10000"
                      step="10"
                      value={stockPrice}
                      onChange={(e) => setStockPrice(Number(e.target.value))}

                      style={getSliderStyle(stockPrice, "1", "10000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>₹1</span>
                      <span>₹10,000</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Annual Dividend (₹)</label>
                  <input
                    type="number"
                    value={annualDividend}
                    onChange={(e) => setAnnualDividend(Math.max(0, Number(e.target.value)))}
                  />
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="1000"
                      step="1"
                      value={annualDividend}
                      onChange={(e) => setAnnualDividend(Number(e.target.value))}

                      style={getSliderStyle(annualDividend, "0", "1000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>₹0</span>
                      <span>₹1,000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Investment Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Investment Details</h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Number of Shares</label>
                <input
                  type="number"
                  value={numberOfShares}
                  onChange={(e) => setNumberOfShares(Math.max(1, Number(e.target.value)))}
                />
                <div>
                  <input
                    type="range"
                    min="1"
                    max="10000"
                    step="10"
                    value={numberOfShares}
                    onChange={(e) => setNumberOfShares(Number(e.target.value))}

                    style={getSliderStyle(numberOfShares, "1", "10000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>1</span>
                    <span>10,000</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Growth Projections */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Growth Projections</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Dividend Growth Rate (%)</label>
                  <input
                    type="number"
                    value={growthRate}
                    onChange={(e) => setGrowthRate(Number(e.target.value))}
                  />
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="25"
                      step="0.5"
                      value={growthRate}
                      onChange={(e) => setGrowthRate(Number(e.target.value))}

                      style={getSliderStyle(growthRate, "0", "25")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>0%</span>
                      <span>25%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Years to Project</label>
                    <span className="text-sm font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">{years} Yr</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}

                    style={getSliderStyle(years, "1", "30")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>1 year</span>
                    <span>30 years</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full p-6 flex justify-between items-center font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <span>Additional Settings</span>
                {showAdvanced ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
              </button>

              {showAdvanced && (
                <div className="p-6 pt-0 border-t border-slate-100 mt-4 text-xs text-slate-500">
                  Calculations assume dividends paid annually with optional growth rate applied year-on-year.
                </div>
              )}
            </div>
          </div>

          {/* Results Sidebar */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-[#1e2a4f] rounded-2xl shadow-xl p-6 md:p-8 text-white h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-bold tracking-tight">Dividend Summary</h2>
                  <button className="text-slate-400 hover:text-white transition-colors" title="Share">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-8">
                  <div className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-1">
                    {dividendYield.toFixed(2)}%
                  </div>
                  <div className="text-slate-300 text-sm font-medium">Dividend Yield</div>
                </div>

                <div className="space-y-4 border-t border-slate-600/60 pt-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Total Investment</span>
                    <span className="font-semibold text-white">{formatCurrency(totalInvestment)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Annual Dividend Income</span>
                    <span className="font-semibold text-emerald-400">{formatCurrency(annualDividendIncome)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Projected Total Dividends</span>
                    <span className="font-semibold text-emerald-400">{formatCurrency(projectedTotalDividend)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-600/40">
                    <span className="text-slate-300">Final Investment Value</span>
                    <span className="font-semibold text-white">{formatCurrency(finalValue)}</span>
                  </div>
                </div>
              </div>

              <button className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2">
                Start Investing <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Informational Section */}
        <div className="max-w-4xl space-y-12 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#113262] mb-4">Understanding Dividend Yield</h2>
            <p className="text-slate-600">
              Dividend Yield is a crucial financial metric that helps investors assess the potential income generation from their stock investments. It represents the annual dividend income as a percentage of a stock's current market price.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">How Dividend Yield Works</h3>
            <p className="text-sm text-slate-600">
              Think of dividend yield as a measure of the cash return you can expect from a stock. By dividing the annual dividends per share by the current stock price, investors can quickly understand the potential income relative to the stock's value.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">Why Analyze Dividend Yield?</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Assess potential income from stock investments.</li>
              <li>Compare income potential across different stocks.</li>
              <li>Understand a company's financial health and cash payout capacity.</li>
              <li>Identify potential long-term investment opportunities with regular passive income.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[#113262] mb-4">Using Dividend Yield in Stock Analysis</h3>
            <p className="text-slate-600">
              Dividend yield is a key metric for income-focused investors. Compare it across companies in the same sector for meaningful comparisons. High-yield sectors in India include coal (Coal India), oil and gas (ONGC, IOC), utilities (Power Grid, NTPC), and IT (Infosys, TCS). Remember that dividends are taxed at your slab rate.
            </p>
          </section>

          <section className="pt-6">
            <h2 className="text-xl font-bold text-[#113262] mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">What is dividend yield?</h3>
                <p className="text-sm text-slate-600">Dividend yield is the annual dividend per share divided by the current share price, expressed as a percentage. A stock paying ₹10 annual dividend at a price of ₹200 has a 5% dividend yield.</p>
              </div>

              <div className="pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">What is a good dividend yield in India?</h3>
                <p className="text-sm text-slate-600">For Indian large-cap stocks, dividend yields of 2–4% are considered healthy. Yields above 5% may indicate either a generous dividend policy or a falling stock price. Always check if high dividends are sustainable from company earnings.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

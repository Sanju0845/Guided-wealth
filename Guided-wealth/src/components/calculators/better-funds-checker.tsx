import React, { useState, useEffect } from 'react';
import { CurrencyInput } from '../ui/CurrencyInput';
import { Share2, ChevronDown, ChevronUp } from 'lucide-react';

export default function BetterFundsChecker() {
  const [fundType, setFundType] = useState<'Equity' | 'Debt' | 'Hybrid'>('Equity');
  const [investmentAmount, setInvestmentAmount] = useState<number>(100000);
  const [years, setYears] = useState<number>(5);
  const [expenseRatio, setExpenseRatio] = useState<number>(1.5);
  const [expectedReturn, setExpectedReturn] = useState<number>(12);
  const [aumCrores, setAumCrores] = useState<number>(1000);

  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const [fundScore, setFundScore] = useState<number>(95);
  const [totalInvestment, setTotalInvestment] = useState<number>(0);
  const [netReturns, setNetReturns] = useState<number>(0);
  const [expenseCostImpact, setExpenseCostImpact] = useState<number>(0);
  const [fundSizeRating, setFundSizeRating] = useState<string>('Medium');

  useEffect(() => {
    if (investmentAmount <= 0 || years <= 0) {
      setFundScore(0);
      setTotalInvestment(0);
      setNetReturns(0);
      setExpenseCostImpact(0);
      setFundSizeRating('Unknown');
      return;
    }

    const netRate = Math.max(0, expectedReturn - expenseRatio);
    const grossVal = investmentAmount * Math.pow(1 + expectedReturn / 100, years);
    const netVal = investmentAmount * Math.pow(1 + netRate / 100, years);
    const costImpact = Math.max(0, grossVal - netVal);

    // Fund size rating
    let sizeRating = 'Medium';
    if (aumCrores < 500) sizeRating = 'Small';
    else if (aumCrores > 5000) sizeRating = 'Large';
    setFundSizeRating(sizeRating);

    // Score out of 100
    // Lower expense ratio increases score, reasonable returns boost score, stable AUM helps
    let score = 100 - expenseRatio * 15 + (expectedReturn - 8) * 2;
    if (aumCrores < 200) score -= 10;
    score = Math.min(99, Math.max(40, Math.round(score)));

    setFundScore(score);
    setTotalInvestment(investmentAmount);
    setNetReturns(netVal);
    setExpenseCostImpact(costImpact);
  }, [fundType, investmentAmount, years, expenseRatio, expectedReturn, aumCrores]);

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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Better Funds Checker</h1>
        <p className="text-slate-600 text-base">Check impact of getting stuck in bad investments with Better Funds Calculator</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Section */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Inputs Column */}
          <div className="flex-1 space-y-6">
            {/* Fund Type */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Fund Type</h2>
              <div className="grid grid-cols-3 gap-3">
                {(['Equity', 'Debt', 'Hybrid'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFundType(type)}
                    className={`py-3 px-4 rounded-xl border text-center font-semibold text-sm transition-all ${fundType === type
                        ? 'bg-[#1e2a4f] text-white border-[#113262] shadow-sm'
                        : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                      }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Investment Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Investment Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Investment Amount</label>
                  <input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(Math.max(0, Number(e.target.value)))}
                  />
                  <div>
                    <input
                      type="range"
                      min="1000"
                      max="10000000"
                      step="10000"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(Number(e.target.value))}

                      style={getSliderStyle(investmentAmount, "1000", "10000000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>₹1,000</span>
                      <span>₹1 Cr</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Investment Period (Years)</label>
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

            {/* Fund Metrics */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Fund Metrics</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Expense Ratio (%)</label>
                    <CurrencyInput
                    value={expenseRatio}
                    onValueChange={(val) => setExpenseRatio(val)}
                  />
                    <div>
                      <input
                        type="range"
                        min="0.1"
                        max="2.5"
                        step="0.05"
                        value={expenseRatio}
                        onChange={(e) => setExpenseRatio(Number(e.target.value))}

                        style={getSliderStyle(expenseRatio, "0.1", "2.5")}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                      />
                      <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                        <span>0.1%</span>
                        <span>2.5%</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Expected Return Rate (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={expectedReturn}
                      onChange={(e) => setExpectedReturn(Number(e.target.value))}
                    />
                    <div>
                      <input
                        type="range"
                        min="4"
                        max="20"
                        step="0.5"
                        value={expectedReturn}
                        onChange={(e) => setExpectedReturn(Number(e.target.value))}

                        style={getSliderStyle(expectedReturn, "4", "20")}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                      />
                      <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                        <span>4%</span>
                        <span>20%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Average AUM (₹ Crores)</label>
                  <input
                    type="number"
                    value={aumCrores}
                    onChange={(e) => setAumCrores(Math.max(10, Number(e.target.value)))}
                  />
                  <div>
                    <input
                      type="range"
                      min="100"
                      max="40000"
                      step="500"
                      value={aumCrores}
                      onChange={(e) => setAumCrores(Number(e.target.value))}

                      style={getSliderStyle(aumCrores, "100", "40000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>₹100 Cr</span>
                      <span>₹40,000 Cr</span>
                    </div>
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
                  Expense Cost Impact calculates the total return lost over your investment horizon due to higher expense ratios compared to direct plans.
                </div>
              )}
            </div>
          </div>

          {/* Results Sidebar */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-[#1e2a4f] rounded-2xl shadow-xl p-6 md:p-8 text-white h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-bold tracking-tight">Fund Analysis</h2>
                  <button className="text-slate-400 hover:text-white transition-colors" title="Share">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-8">
                  <div className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-1">
                    {fundScore}
                  </div>
                  <div className="text-slate-300 text-sm font-medium">Fund Score (out of 100)</div>
                </div>

                <div className="space-y-4 border-t border-slate-600/60 pt-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Total Investment</span>
                    <span className="font-semibold text-white">{formatCurrency(totalInvestment)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Net Returns</span>
                    <span className="font-semibold text-emerald-400">{formatCurrency(netReturns)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Expense Cost Impact</span>
                    <span className="font-semibold text-rose-400">{formatCurrency(expenseCostImpact)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-600/40">
                    <span className="text-slate-300">Fund Size Rating</span>
                    <span className="font-semibold text-white">{fundSizeRating}</span>
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
            <h2 className="text-xl font-bold text-[#113262] mb-4">Understanding Mutual Fund Selection</h2>
            <p className="text-slate-600">
              Selecting the right mutual funds is crucial for achieving your financial goals. The Better Funds Checker is a sophisticated tool designed to help investors navigate the complex world of mutual fund investments by providing comprehensive, data-driven insights into fund performance and suitability.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">How Fund Selection Works</h3>
            <p className="text-sm text-slate-600">
              Mutual fund selection involves analyzing multiple parameters such as historical returns, risk metrics, expense ratios, fund manager performance, and alignment with your investment objectives.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">Why Use a Fund Checker?</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Objective fund performance analysis.</li>
              <li>Comprehensive risk and cost assessment.</li>
              <li>Compare funds across different categories.</li>
              <li>Quantify the long-term compounding impact of high expense ratios.</li>
            </ul>
          </section>

          <section className="pt-6">
            <h2 className="text-xl font-bold text-[#113262] mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">What are the typical brokerage & expense charges in India?</h3>
                <p className="text-sm text-slate-600">Direct mutual funds typically charge 0.1% to 1.0% in annual expense ratio, while regular plans charge 0.5% to 2.25%. Direct plans save substantial compounding cost over 10-20 years.</p>
              </div>

              <div className="pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">How do charges affect my trading & investment returns?</h3>
                <p className="text-sm text-slate-600">Even a 1% difference in expense ratio can eat away 15% to 20% of your total terminal wealth over a 20-year investment horizon due to lost compounding benefits.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

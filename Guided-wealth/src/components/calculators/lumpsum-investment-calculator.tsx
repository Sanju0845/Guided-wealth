import React, { useState, useEffect } from 'react';
import { CurrencyInput } from '../ui/CurrencyInput';
import { Share2, ChevronDown } from 'lucide-react';

export default function LumpsumInvestmentCalculator() {
  const [investment, setInvestment] = useState<number>(100000);
  const [rate, setRate] = useState<number>(12);
  const [years, setYears] = useState<number>(5);
  const [inflationRate, setInflationRate] = useState<number>(6);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  
  const [maturityAmount, setMaturityAmount] = useState<number>(0);
  const [inflationAdjusted, setInflationAdjusted] = useState<number>(0);

  useEffect(() => {
    if (investment > 0 && rate > 0 && years > 0) {
      const amount = investment * Math.pow(1 + rate / 100, years);
      setMaturityAmount(amount);
      
      const adj = amount / Math.pow(1 + inflationRate / 100, years);
      setInflationAdjusted(adj);
    } else {
      setMaturityAmount(0);
      setInflationAdjusted(0);
    }
  }, [investment, rate, years, inflationRate]);

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
      <div className="bg-white pt-32 pb-10 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Lumpsum Calculator</h1>
        <p className="text-slate-600 text-base">Calculate returns on your one-time investment</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          <div className="flex-1 space-y-6">
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Investment Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Investment Amount</label>
                  <CurrencyInput
                    value={investment}
                    onValueChange={(val) => setInvestment(val)}
                  />
                  <div>
                    <input
                      type="range"
                      min="5000"
                      max="10000000"
                      step="5000"
                      value={investment}
                      onChange={(e) => setInvestment(Number(e.target.value))}
                    
                      style={getSliderStyle(investment, "5000", "10000000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>₹5K</span>
                      <span>₹1Cr</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Expected Returns (%)</label>
                  <input
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                  />
                  <div>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      step="0.1"
                      value={rate}
                      onChange={(e) => setRate(Number(e.target.value))}
                    
                      style={getSliderStyle(rate, "1", "30")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>1%</span>
                      <span>30%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Investment Horizon</h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Years</label>
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                />
                <div>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    step="1"
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                  
                      style={getSliderStyle(years, "1", "40")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>1 Year</span>
                    <span>40 Years</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <button 
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full p-6 flex justify-between items-center text-left hover:bg-slate-50 transition-colors"
              >
                <h2 className="text-lg font-bold text-slate-900">Advanced Settings</h2>
                <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
              </button>
              
              {showAdvanced && (
                <div className="p-6 pt-0 border-t border-slate-100">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Expected Inflation Rate (%)</label>
                  <input
                    type="number"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(Number(e.target.value))}
                    className="w-full md:w-1/2 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                  />
                </div>
              )}
            </div>

          </div>

          <div className="w-full lg:w-[400px]">
            <div className="bg-[#1e2a4f] rounded-2xl shadow-lg p-5 text-white h-full flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">Projection</h2>
                <button className="text-slate-300 hover:text-white transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center mb-10">
                <div className="text-4xl font-bold mb-1">{formatCurrency(maturityAmount)}</div>
                <div className="text-slate-300 text-sm">Maturity Value</div>
              </div>

              <div className="flex-1">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-600">
                    <span className="text-slate-300 text-sm">Inflation Adjusted</span>
                    <span className="font-semibold">{formatCurrency(inflationAdjusted)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-600">
                    <span className="text-slate-300 text-sm">Total Invested</span>
                    <span className="font-semibold">{formatCurrency(investment)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">Investment Period</span>
                    <span className="font-semibold">{years} Years</span>
                  </div>
                </div>
              </div>

              <button className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2">
                Invest Now <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl space-y-12 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#113262] mb-4">What is Lumpsum Investment?</h2>
            <p className="text-sm mb-6">
              A lumpsum investment involves investing a significant amount of money in one go, rather than through regular installments. This investment approach is ideal for individuals with surplus funds, allowing them to potentially benefit from compounding growth over time. Lumpsum investments are common in mutual funds, stocks, and other market-linked instruments.
            </p>

            <h3 className="text-lg font-bold text-[#113262] mb-4">Investment Options</h3>
            <p className="text-sm mb-6">
              Lumpsum investments can be made in various financial instruments including equity mutual funds, debt funds, hybrid funds, and direct stocks. Minimum investments typically start from ₹5,000 for mutual funds, while stock market investments require larger amounts. Investors can choose between growth and dividend options in mutual funds.
            </p>

            <h3 className="text-lg font-bold text-[#113262] mb-4">Investment Horizon</h3>
            <p className="text-sm mb-6">
              Lumpsum investments are most effective for long-term goals (5+ years) due to market volatility. However, debt funds and fixed-income instruments can be suitable for shorter durations (1-3 years). Unlike SIPs, the entire amount is subject to market timing risk.
            </p>

            <h3 className="text-lg font-bold text-[#113262] mb-4">How to start investing?</h3>
            <p className="text-sm mb-2">To make a lumpsum investment:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm mb-6">
              <li>Complete KYC documentation</li>
              <li>Choose investment instrument</li>
              <li>Transfer funds from bank account</li>
              <li>Monitor investment performance</li>
            </ul>

            <h3 className="text-lg font-bold text-[#113262] mb-4">Why choose Lumpsum?</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm mb-6">
              <li>Potential for higher returns through market timing</li>
              <li>Benefit from full compounding from day one</li>
              <li>Simplified portfolio management</li>
              <li>Ideal for windfall gains (bonuses, inheritance)</li>
              <li>No commitment to regular investments</li>
            </ul>

            <h3 className="text-lg font-bold text-[#113262] mb-4">How are returns calculated?</h3>
            <p className="text-sm mb-2">
              Lumpsum returns are calculated using the Compound Annual Growth Rate (CAGR) formula:
            </p>
            <p className="font-mono text-sm bg-slate-100 p-2 rounded mb-2 inline-block">Maturity Value = Principal × (1 + Annual Return Rate)^Years</p>
            <p className="text-sm mb-6">
              This calculation assumes reinvestment of gains and accounts for compounding effects over time.
            </p>

            <h3 className="text-lg font-bold text-[#113262] mb-4">Using the Guided Wealthy Lumpsum Calculator</h3>
            <p className="text-sm mb-6">
              Input your investment amount, expected annual returns, and investment duration. The calculator will project the potential maturity value, show wealth gained, and provide inflation-adjusted returns. Use it to compare different instruments and make informed investment decisions.
            </p>
          </section>

          <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-slate-200 mt-8">
            <section>
              <h2 className="text-xl font-bold text-[#113262] mb-4">Making the Most of Lump Sum Investments</h2>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <p className="text-sm text-slate-700">
                  A lump sum investment benefits from immediate full-corpus compounding, unlike SIP where each installment compounds from its own start date. During market corrections, lump sum investing can deliver significantly higher returns than SIP over the same period. However, it carries timing risk, which SIP mitigates through rupee-cost averaging.
                </p>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-[#113262] mb-8">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-6">
                  <h3 className="font-semibold text-slate-900 mb-2">When should I invest a lump sum vs SIP?</h3>
                  <p className="text-sm text-slate-600">Lump sum investing works well when you have a large amount available (bonus, inheritance, redemption proceeds) and market valuations are reasonable. SIP is better for regular monthly investments from salary. If in doubt, invest 50% as lump sum and spread the rest over 6-12 months via STP.</p>
                </div>
                
                <div className="pb-6">
                  <h3 className="font-semibold text-slate-900 mb-2">How do I calculate lump sum returns?</h3>
                  <p className="text-sm text-slate-600">Enter your investment amount, expected annual return rate, and investment duration. The calculator uses the compound interest formula: Future Value = Principal x (1 + Rate) ^ Years. It shows your projected corpus and total gains.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

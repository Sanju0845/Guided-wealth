import React, { useState, useEffect } from 'react';
import { CurrencyInput } from '../ui/CurrencyInput';
import { Share2, ChevronDown } from 'lucide-react';

export default function FutureValueCalculator() {
  const [investment, setInvestment] = useState<number>(100000);
  const [rate, setRate] = useState<number>(8);
  const [years, setYears] = useState<number>(10);
  const [compounding, setCompounding] = useState<'Annually' | 'Semi-Annually' | 'Quarterly' | 'Monthly'>('Annually');
  const [inflationRate, setInflationRate] = useState<number>(6);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  
  const [futureValue, setFutureValue] = useState<number>(0);
  const [wealthGained, setWealthGained] = useState<number>(0);
  const [inflationAdjusted, setInflationAdjusted] = useState<number>(0);

  useEffect(() => {
    if (investment > 0 && rate > 0 && years > 0) {
      let n = 1;
      if (compounding === 'Semi-Annually') n = 2;
      else if (compounding === 'Quarterly') n = 4;
      else if (compounding === 'Monthly') n = 12;

      const r = rate / 100;
      const fv = investment * Math.pow(1 + r / n, n * years);
      
      setFutureValue(fv);
      setWealthGained(fv - investment);
      setInflationAdjusted(fv / Math.pow(1 + inflationRate / 100, years));
    } else {
      setFutureValue(0);
      setWealthGained(0);
      setInflationAdjusted(0);
    }
  }, [investment, rate, years, compounding, inflationRate]);

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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Future Value Estimator</h1>
        <p className="text-slate-600 text-base">Achieve Financial Goals with Future Value Calculator</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          <div className="flex-1 space-y-6">
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Investment Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Initial Investment</label>
                  <CurrencyInput
                    value={investment}
                    onValueChange={(val) => setInvestment(val)}
                  />
                  <div>
                    <input
                      type="range"
                      min="1000"
                      max="10000000"
                      step="1000"
                      value={investment}
                      onChange={(e) => setInvestment(Number(e.target.value))}
                    
                      style={getSliderStyle(investment, "1000", "10000000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>₹1K</span>
                      <span>₹1Cr</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Annual Return (%)</label>
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
              <h2 className="text-xl font-bold text-[#113262] mb-4">Time Horizon</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Compounding</label>
                  <select
                    value={compounding}
                    onChange={(e) => setCompounding(e.target.value as any)}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all bg-white"
                  >
                    <option value="Annually">Annually</option>
                    <option value="Semi-Annually">Semi-Annually</option>
                    <option value="Quarterly">Quarterly</option>
                    <option value="Monthly">Monthly</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <button 
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full p-6 flex justify-between items-center text-left hover:bg-slate-50 transition-colors"
              >
                <h2 className="text-lg font-bold text-slate-900">Inflation Adjustment</h2>
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
                  <p className="text-sm text-slate-500 mt-2">
                    Inflation adjusted future value: <strong>{formatCurrency(inflationAdjusted)}</strong>
                  </p>
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
                <div className="text-4xl font-bold mb-1">{formatCurrency(futureValue)}</div>
                <div className="text-slate-300 text-sm">Future Value</div>
              </div>

              <div className="flex-1">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-600">
                    <span className="text-slate-300 text-sm">Total Invested</span>
                    <span className="font-semibold">{formatCurrency(investment)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-600">
                    <span className="text-slate-300 text-sm">Wealth Gained</span>
                    <span className="font-semibold">{formatCurrency(wealthGained)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">Compounding</span>
                    <span className="font-semibold">{compounding}</span>
                  </div>
                </div>
              </div>

              <button className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2">
                Plan Investments <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl space-y-12 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#113262] mb-4">What is Future Value?</h2>
            <p className="text-sm mb-6">
              Future Value (FV) is the projected value of a current investment at a specified date in the future, considering compound interest. This calculation helps investors understand how their money can grow over time, accounting for factors like rate of return and investment duration. It's essential for setting realistic financial goals and retirement planning.
            </p>

            <h3 className="text-lg font-bold text-[#113262] mb-4">Key Components</h3>
            <p className="text-sm mb-6">
              Future Value calculations consider three main elements: initial principal amount, annual interest rate, and investment period. The formula also factors in compounding frequency - how often interest is added to the principal. Common compounding intervals include annual, quarterly, monthly, and daily.
            </p>

            <h3 className="text-lg font-bold text-[#113262] mb-4">Compounding Effects</h3>
            <p className="text-sm mb-6">
              Compound interest accelerates growth by earning interest on both the initial principal and accumulated interest. For example, ₹1 lakh invested at 8% annually grows to ₹2.16 lakh in 10 years. With monthly compounding, it becomes ₹2.22 lakh - demonstrating how frequent compounding enhances returns.
            </p>

            <h3 className="text-lg font-bold text-[#113262] mb-4">How to calculate manually?</h3>
            <p className="text-sm mb-2">Use the Future Value formula:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm mb-6">
              <li><span className="font-mono">FV = P × (1 + r/n)^(n×t)</span></li>
              <li>P = Principal amount</li>
              <li>r = Annual interest rate (decimal)</li>
              <li>n = Compounding periods per year</li>
              <li>t = Investment period in years</li>
            </ul>

            <h3 className="text-lg font-bold text-[#113262] mb-4">Why calculate Future Value?</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm mb-6">
              <li>Plan long-term financial goals effectively</li>
              <li>Compare different investment options</li>
              <li>Understand compounding benefits</li>
              <li>Adjust for inflation's impact</li>
              <li>Make informed asset allocation decisions</li>
            </ul>

            <h3 className="text-lg font-bold text-[#113262] mb-4">Factors Affecting Future Value</h3>
            <p className="text-sm mb-6">
              Three key variables influence FV calculations: principal amount (higher investments grow more), interest rate (higher returns accelerate growth), and time horizon (longer durations leverage compounding). Even small increases in rate or duration create significant differences over time.
            </p>

            <h3 className="text-lg font-bold text-[#113262] mb-4">Using the Guided Wealthy FV Calculator</h3>
            <p className="text-sm mb-6">
              Input your initial investment, expected annual return, investment duration, and compounding frequency. The calculator will project your corpus growth, show wealth accumulation timelines, and help compare different compounding scenarios. Use it to set realistic savings targets and retirement goals.
            </p>
          </section>

          <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-slate-200 mt-8">
            <section>
              <h2 className="text-xl font-bold text-[#113262] mb-4">Planning with Future Value</h2>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <p className="text-sm text-slate-700">
                  Future value calculations are essential for goal-based financial planning. Whether you are saving for a house, your child's education, or retirement, knowing the future value of your current savings and planned investments helps you set realistic targets and adjust your savings rate accordingly.
                </p>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-[#113262] mb-8">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-6">
                  <h3 className="font-semibold text-slate-900 mb-2">What is future value?</h3>
                  <p className="text-sm text-slate-600">Future value is what a current sum of money will be worth at a specific date in the future, assuming a certain rate of return. It accounts for the time value of money and the power of compounding.</p>
                </div>
                
                <div className="pb-6">
                  <h3 className="font-semibold text-slate-900 mb-2">How do I calculate future value of a SIP?</h3>
                  <p className="text-sm text-slate-600">For SIP future value, each monthly installment compounds separately. The formula accounts for the different compounding periods of each installment. Use this calculator to see how regular investments grow over time.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

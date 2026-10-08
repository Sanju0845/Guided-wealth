import React, { useState, useEffect } from 'react';
import { CurrencyInput } from '../ui/CurrencyInput';
import { Share2 } from 'lucide-react';

export default function SipDelayCost() {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(25000);
  const [rate, setRate] = useState<number>(12);
  const [years, setYears] = useState<number>(10);
  const [delayMonths, setDelayMonths] = useState<number>(10);
  
  const [withoutDelay, setWithoutDelay] = useState<number>(0);
  const [withDelay, setWithDelay] = useState<number>(0);
  const [costOfDelay, setCostOfDelay] = useState<number>(0);
  const [requiredSip, setRequiredSip] = useState<number>(0);

  useEffect(() => {
    if (monthlyInvestment > 0 && rate > 0 && years > 0) {
      const n = years * 12;
      const r = rate / 100 / 12;
      
      // Maturity without delay
      const w = monthlyInvestment * (Math.pow(1 + r, n) - 1) / r * (1 + r);
      
      // Maturity with delay
      let wd = 0;
      let req = 0;
      if (n > delayMonths) {
        wd = monthlyInvestment * (Math.pow(1 + r, n - delayMonths) - 1) / r * (1 + r);
        req = w / ((Math.pow(1 + r, n - delayMonths) - 1) / r * (1 + r)) * monthlyInvestment;
      }
      
      setWithoutDelay(w);
      setWithDelay(wd);
      setCostOfDelay(Math.max(0, w - wd));
      setRequiredSip(req);
    } else {
      setWithoutDelay(0);
      setWithDelay(0);
      setCostOfDelay(0);
      setRequiredSip(0);
    }
  }, [monthlyInvestment, rate, years, delayMonths]);

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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">SIP Delay Calculator</h1>
        <p className="text-slate-600 text-base">Calculate impact of delaying your SIP investments</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          <div className="flex-1 space-y-6">
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Investment Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Monthly SIP Amount</label>
                  <CurrencyInput
                    value={monthlyInvestment}
                    onValueChange={(val) => setMonthlyInvestment(val)}
                  />
                  <div>
                    <input
                      type="range"
                      min="500"
                      max="100000"
                      step="500"
                      value={monthlyInvestment}
                      onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                    
                      style={getSliderStyle(monthlyInvestment, "500", "100000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>₹500</span>
                      <span>₹1L</span>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <h2 className="text-xl font-bold text-[#113262] mb-4">SIP Period</h2>
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

              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
                <h2 className="text-xl font-bold text-[#113262] mb-4">Delay Period</h2>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Months</label>
                  <input
                    type="number"
                    value={delayMonths}
                    onChange={(e) => setDelayMonths(Number(e.target.value))}
                  />
                  <div>
                    <input
                      type="range"
                      min="1"
                      max="120"
                      step="1"
                      value={delayMonths}
                      onChange={(e) => setDelayMonths(Number(e.target.value))}
                    
                      style={getSliderStyle(delayMonths, "1", "120")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>1 Month</span>
                      <span>120 Months</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 text-blue-800 text-sm p-4 rounded-xl">
              Note: Calculations assume monthly compounding. Delay period reduces effective investment tenure.
            </div>

          </div>

          <div className="w-full lg:w-[400px]">
            <div className="bg-[#1e2a4f] rounded-2xl shadow-lg p-5 text-white h-full flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">Delay Impact</h2>
                <button className="text-slate-300 hover:text-white transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center mb-10">
                <div className="text-4xl font-bold mb-1">{formatCurrency(costOfDelay)}</div>
                <div className="text-slate-300 text-sm">Cost of Delay</div>
              </div>

              <div className="flex-1">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-600">
                    <span className="text-slate-300 text-sm">Without Delay</span>
                    <span className="font-semibold">{formatCurrency(withoutDelay)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-600">
                    <span className="text-slate-300 text-sm">With Delay</span>
                    <span className="font-semibold">{formatCurrency(withDelay)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">Required SIP</span>
                    <span className="font-semibold">{formatCurrency(requiredSip)}</span>
                  </div>
                </div>
              </div>

              <button className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2">
                Start SIP Immediately <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl space-y-12 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#113262] mb-4">Understanding SIP Delay and Investment Timing</h2>
            
            <h3 className="text-lg font-bold text-[#113262] mb-4">What is SIP Delay Cost?</h3>
            <p className="text-sm mb-6">
              SIP delay cost represents the potential earnings lost when you postpone your investment. Each day of delay means missing out on potential market growth and compound returns. The longer you wait, the more significant the opportunity cost becomes.
            </p>

            <h3 className="text-lg font-bold text-[#113262] mb-4">The Power of Early Investment</h3>
            <p className="text-sm mb-3">Starting your investment journey early provides multiple strategic advantages:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm mb-6">
              <li>Maximize compound interest potential</li>
              <li>Smooth out market volatility through consistent investments</li>
              <li>Build long-term wealth through disciplined saving</li>
              <li>Create a robust financial safety net</li>
            </ul>

            <h3 className="text-lg font-bold text-[#113262] mb-4">Compounding: Your Financial Superpower</h3>
            <p className="text-sm mb-6">
              Compounding transforms small, consistent investments into substantial wealth. By reinvesting returns, you create a multiplicative effect where your money works continuously, generating returns not just on your principal, but on previously earned returns.
            </p>

            <h3 className="text-lg font-bold text-[#113262] mb-4">Strategic Investment Approach</h3>
            <p className="text-sm mb-3">The ideal investment strategy involves:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm mb-6">
              <li>Starting as early as possible</li>
              <li>Investing consistently</li>
              <li>Adapting investments with changing financial circumstances</li>
              <li>Maintaining a long-term perspective</li>
            </ul>
          </section>

          <section className="bg-slate-50 p-8 rounded-3xl mt-8">
            <h3 className="text-lg font-bold text-[#113262] mb-4">The True Cost of Procrastination</h3>
            <p className="text-sm">
              This calculator shows exactly how much wealth you lose by delaying your SIP by 1, 3, 5, or 10 years. The results are often surprising. A 5-year delay can cost you 40-50% of your potential corpus. Time in the market, not timing the market, is the primary driver of wealth creation.
            </p>
          </section>

          <section className="pt-6 border-t border-slate-200 mt-8">
            <h2 className="text-xl font-bold text-[#113262] mb-8">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">How much does delaying SIP cost?</h3>
                <p className="text-sm text-slate-600">Every year of delay roughly doubles the monthly SIP needed for the same retirement corpus. Starting a Rs 10,000 SIP at age 25 for a Rs 3 crore goal is equivalent to starting a Rs 20,000 SIP at age 30 or Rs 45,000 at age 35. The cost of delay compounds dramatically.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Is it too late to start SIP at 40?</h3>
                <p className="text-sm text-slate-600">No. Starting at 40 means you have 20 years until 60. A Rs 25,000 monthly SIP at 12% returns grows to approximately Rs 2.5 crore in 20 years. The key is starting now rather than waiting for the "perfect" time.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { CurrencyInput } from '../ui/CurrencyInput';
import { Share2, ChevronDown } from 'lucide-react';

export default function SipGrowthCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(25000);
  const [rate, setRate] = useState<number>(12);
  const [years, setYears] = useState<number>(10);
  const [showModifications, setShowModifications] = useState<boolean>(false);
  
  const [futureValue, setFutureValue] = useState<number>(0);
  const [totalInvested, setTotalInvested] = useState<number>(0);
  const [growthMultiple, setGrowthMultiple] = useState<number>(0);

  useEffect(() => {
    if (monthlyInvestment > 0 && rate > 0 && years > 0) {
      const n = years * 12;
      const r = rate / 100 / 12;
      
      const fv = monthlyInvestment * (Math.pow(1 + r, n) - 1) / r * (1 + r);
      const invested = monthlyInvestment * n;
      
      setFutureValue(fv);
      setTotalInvested(invested);
      setGrowthMultiple(invested > 0 ? fv / invested : 0);
    } else {
      setFutureValue(0);
      setTotalInvested(0);
      setGrowthMultiple(0);
    }
  }, [monthlyInvestment, rate, years]);

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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">SIP Growth Calculator</h1>
        <p className="text-slate-600 text-base">Project your SIP investment growth</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          <div className="flex-1 space-y-6">
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Investment Parameters</h2>
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

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Investment Duration</h2>
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
                onClick={() => setShowModifications(!showModifications)}
                className="w-full p-6 flex justify-between items-center text-left hover:bg-slate-50 transition-colors"
              >
                <h2 className="text-lg font-bold text-slate-900">Additional Modifications</h2>
                <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${showModifications ? 'rotate-180' : ''}`} />
              </button>
              
              {showModifications && (
                <div className="p-6 pt-0 border-t border-slate-100">
                  <p className="text-sm text-slate-600">Consider adjusting parameters like annual step-up or inflation impact to see more advanced growth projections.</p>
                </div>
              )}
            </div>

          </div>

          <div className="w-full lg:w-[400px]">
            <div className="bg-[#1e2a4f] rounded-2xl shadow-lg p-5 text-white h-full flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">Growth Projection</h2>
                <button className="text-slate-300 hover:text-white transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center mb-10">
                <div className="text-4xl font-bold mb-1">{growthMultiple.toFixed(2)}x</div>
                <div className="text-slate-300 text-sm">Growth Multiple</div>
              </div>

              <div className="flex-1">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-600">
                    <span className="text-slate-300 text-sm">Total Invested</span>
                    <span className="font-semibold">{formatCurrency(totalInvested)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-600">
                    <span className="text-slate-300 text-sm">Future Value</span>
                    <span className="font-semibold">{formatCurrency(futureValue)}</span>
                  </div>
                </div>
              </div>

              <button className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2">
                Start SIP Now <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl space-y-12 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#113262] mb-4">Understanding SIP Growth</h2>
            <p className="text-sm mb-6">
              SIP (Systematic Investment Plan) growth represents how your savings can grow over a period assuming a fixed average return on your total investments. SIP growth depends on several critical factors such as market conditions, the company's growth, and investment duration.
            </p>

            <h3 className="text-lg font-bold text-[#113262] mb-4">Why Should You Opt for SIP for Growth?</h3>
            <ul className="list-disc pl-5 space-y-2 text-sm mb-6">
              <li><span className="font-semibold text-slate-900">Rupee-Cost Averaging:</span> When you invest in SIP, you automatically buy units at different prices. This helps lower the average price per unit you pay for your investment.</li>
              <li><span className="font-semibold text-slate-900">Convenience and Discipline:</span> SIPs allow you to invest small sums of money at regular intervals, helping maintain financial discipline.</li>
              <li><span className="font-semibold text-slate-900">Flexibility:</span> You can start or stop SIPs at any time based on your financial requirements.</li>
              <li><span className="font-semibold text-slate-900">Tax Benefits:</span> Some SIP investments offer tax benefits under Section 80C of the Income Tax Act, 1961.</li>
              <li><span className="font-semibold text-slate-900">Growth Potential:</span> Long-term SIP investments can provide substantial returns through compounding.</li>
            </ul>

            <h3 className="text-lg font-bold text-[#113262] mb-4">Factors Influencing SIP Growth</h3>
            <p className="text-sm mb-2">Key factors that impact SIP investment growth include:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm mb-6">
              <li>Investment amount</li>
              <li>Investment frequency</li>
              <li>Length of investment period</li>
              <li>Type of investment fund</li>
              <li>Current and future market conditions</li>
            </ul>

            <h3 className="text-lg font-bold text-[#113262] mb-4">Selecting the Right SIP Investment Plan</h3>
            <p className="text-sm mb-2">When choosing an SIP plan, consider:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm mb-6">
              <li>Your investment time horizon</li>
              <li>Monthly affordable investment amount</li>
              <li>Specific investment goals</li>
              <li>Alignment with retirement or long-term financial planning</li>
            </ul>
            
            <div className="bg-slate-50 border-l-4 border-blue-600 p-4 text-sm italic">
              Always research different SIP options and consult a financial advisor to find the most suitable investment plan for your specific needs.
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-slate-200 mt-8">
            <section>
              <h2 className="text-xl font-bold text-[#113262] mb-4">Why Step-Up SIP Accelerates Wealth Creation</h2>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <p className="text-sm text-slate-700">
                  Most investors' incomes grow 8-12% annually, but their SIP amounts stay flat. A step-up SIP automatically increases your investment each year, keeping your savings rate aligned with your earning capacity. Even a modest 5% annual step-up dramatically improves the final corpus compared to a flat SIP.
                </p>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-[#113262] mb-8">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-6">
                  <h3 className="font-semibold text-slate-900 mb-2">What is a step-up SIP?</h3>
                  <p className="text-sm text-slate-600">A step-up SIP (also called top-up SIP) increases your SIP amount annually by a fixed percentage. If you start with Rs 10,000/month and step up by 10% annually, your SIP becomes Rs 11,000 in year 2, Rs 12,100 in year 3, and so on. This aligns your investments with your rising income.</p>
                </div>
                
                <div className="pb-6">
                  <h3 className="font-semibold text-slate-900 mb-2">How much more wealth does step-up SIP create?</h3>
                  <p className="text-sm text-slate-600">A Rs 10,000 monthly SIP with 10% annual step-up at 12% returns creates approximately Rs 1.2 crore more than a flat Rs 10,000 SIP over 20 years. The step-up accounts for salary growth and significantly accelerates wealth creation through the power of increasing contributions.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

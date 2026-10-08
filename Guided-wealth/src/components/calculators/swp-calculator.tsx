import React, { useState, useEffect } from 'react';
import { CurrencyInput } from '../ui/CurrencyInput';
import { Share2, ChevronDown } from 'lucide-react';

export default function SwpCalculator() {
  const [principal, setPrincipal] = useState<number>(1000000);
  const [withdrawal, setWithdrawal] = useState<number>(10000);
  const [rate, setRate] = useState<number>(8);
  const [years, setYears] = useState<number>(10);
  const [inflationRate, setInflationRate] = useState<number>(6);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  
  const [totalWithdrawn, setTotalWithdrawn] = useState<number>(0);
  const [endCorpus, setEndCorpus] = useState<number>(0);
  const [inflationAdjusted, setInflationAdjusted] = useState<number>(0);

  useEffect(() => {
    if (principal > 0 && withdrawal >= 0 && rate >= 0 && years > 0) {
      const r = rate / 100 / 12;
      const n = years * 12;
      
      let endValue = 0;
      if (r === 0) {
        endValue = principal - (withdrawal * n);
      } else {
        endValue = principal * Math.pow(1 + r, n) - withdrawal * (Math.pow(1 + r, n) - 1) / r;
      }
      
      // If corpus depletes before tenure
      if (endValue < 0) {
        endValue = 0;
      }
      
      const totalW = withdrawal * n;
      
      setTotalWithdrawn(totalW);
      setEndCorpus(endValue);
      setInflationAdjusted(endValue / Math.pow(1 + inflationRate / 100, years));
    } else {
      setTotalWithdrawn(0);
      setEndCorpus(0);
      setInflationAdjusted(0);
    }
  }, [principal, withdrawal, rate, years, inflationRate]);

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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">SWP Calculator</h1>
        <p className="text-slate-600 text-base">Systematic Withdrawal Plan Calculator</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          <div className="flex-1 space-y-6">
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Investment Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Principal Amount</label>
                  <CurrencyInput
                    value={principal}
                    onValueChange={(val) => setPrincipal(val)}
                  />
                  <div>
                    <input
                      type="range"
                      min="10000"
                      max="10000000"
                      step="10000"
                      value={principal}
                      onChange={(e) => setPrincipal(Number(e.target.value))}
                    
                      style={getSliderStyle(principal, "10000", "10000000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>₹10K</span>
                      <span>₹1Cr</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Monthly Withdrawal</label>
                  <input
                    type="number"
                    value={withdrawal}
                    onChange={(e) => setWithdrawal(Number(e.target.value))}
                  />
                  <div>
                    <input
                      type="range"
                      min="1000"
                      max="100000"
                      step="1000"
                      value={withdrawal}
                      onChange={(e) => setWithdrawal(Number(e.target.value))}
                    
                      style={getSliderStyle(withdrawal, "1000", "100000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>₹1K</span>
                      <span>₹1L</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Returns & Duration</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      min="0"
                      max="30"
                      step="0.1"
                      value={rate}
                      onChange={(e) => setRate(Number(e.target.value))}
                    
                      style={getSliderStyle(rate, "0", "30")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>0%</span>
                      <span>30%</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Withdrawal Period (Years)</label>
                  <input
                    type="number"
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                  />
                  <div>
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
                      <span>1 Year</span>
                      <span>30 Years</span>
                    </div>
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
                <div className="text-4xl font-bold mb-1">{formatCurrency(totalWithdrawn)}</div>
                <div className="text-slate-300 text-sm">Total Withdrawn</div>
              </div>

              <div className="flex-1">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-600">
                    <span className="text-slate-300 text-sm">Corpus End Value</span>
                    <span className="font-semibold">{formatCurrency(endCorpus)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-600">
                    <span className="text-slate-300 text-sm">Total Months</span>
                    <span className="font-semibold">{years * 12}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">Inflation Adjusted</span>
                    <span className="font-semibold">{formatCurrency(inflationAdjusted)}</span>
                  </div>
                </div>
              </div>

              <button className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2">
                Start SWP Now <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl space-y-12 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#113262] mb-4">What is SWP?</h2>
            <p className="text-sm mb-6">
              Systematic Withdrawal Plan (SWP) allows investors to withdraw a fixed amount from their investments at regular intervals. This strategy is ideal for generating regular income from mutual fund investments while keeping the remaining corpus invested. SWP helps in managing cash flow needs during retirement or for periodic expenses.
            </p>

            <h3 className="text-lg font-bold text-[#113262] mb-4">Withdrawal Options</h3>
            <p className="text-sm mb-6">
              SWP offers flexible withdrawal frequencies - monthly, quarterly, or annually. Minimum withdrawal amounts typically start from ₹1,000 for most mutual funds. Investors can choose between withdrawing only gains (growth SWP) or a mix of principal and gains, depending on their income needs.
            </p>

            <h3 className="text-lg font-bold text-[#113262] mb-4">Investment Horizon</h3>
            <p className="text-sm mb-6">
              SWP is effective for both short-term (1-3 years) and long-term (10+ years) income needs. The duration depends on the corpus size and withdrawal amount. Equity funds are preferred for long-term SWPs to combat inflation, while debt funds suit short-term needs with stable returns.
            </p>

            <h3 className="text-lg font-bold text-[#113262] mb-4">How to start SWP?</h3>
            <p className="text-sm mb-2">To set up a Systematic Withdrawal Plan:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm mb-6">
              <li>Hold units in growth option of mutual fund</li>
              <li>Submit SWP request to fund house</li>
              <li>Choose withdrawal amount and frequency</li>
              <li>Specify bank account for credits</li>
            </ul>

            <h3 className="text-lg font-bold text-[#113262] mb-4">Why choose SWP?</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm mb-6">
              <li>Regular income without redeeming entire investment</li>
              <li>Potential for capital appreciation on remaining corpus</li>
              <li>Tax-efficient withdrawals compared to fixed deposits</li>
              <li>Flexibility to modify withdrawal amounts</li>
              <li>Automated process with minimal paperwork</li>
            </ul>

            <h3 className="text-lg font-bold text-[#113262] mb-4">How are withdrawals calculated?</h3>
            <p className="text-sm mb-2">
              SWP calculations use the annuity formula considering:
            </p>
            <p className="font-mono text-sm bg-slate-100 p-2 rounded mb-2 inline-block">Monthly Withdrawal = [P × r × (1 + r)^n] / [(1 + r)^n - 1]</p>
            <p className="text-sm mb-6">
              Where P = Principal, r = monthly return rate, n = number of months. This ensures corpus lasts for desired period.
            </p>

            <h3 className="text-lg font-bold text-[#113262] mb-4">Using the Guided Wealthy SWP Calculator</h3>
            <p className="text-sm mb-6">
              Input your investment corpus, desired monthly income, expected returns, and duration. The calculator will show withdrawal sustainability, remaining balance over time, and help balance between income needs and corpus preservation. Use it to plan retirement income or education funding.
            </p>
          </section>

          <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-slate-200 mt-8">
            <section>
              <h2 className="text-xl font-bold text-[#113262] mb-4">How Does the SWP Calculator Work?</h2>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <p className="text-sm text-slate-700">
                  Enter your investment corpus, desired monthly withdrawal, expected fund return rate, and duration. The calculator projects your remaining balance over time, total amount withdrawn, and whether your corpus will sustain the planned withdrawals. It accounts for compounding on the remaining balance between withdrawals.
                </p>
              </div>

              <h2 className="text-xl font-bold text-[#113262] mb-4">Who Should Use SWP?</h2>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <p className="text-sm text-slate-700">
                  SWP is ideal for retirees seeking monthly income, individuals planning sabbaticals, parents funding periodic education expenses, or anyone who needs regular cash flows from a lump sum investment. It is particularly effective when combined with the bucket strategy, where 2-3 years of withdrawals are kept in debt funds while the rest grows in equity.
                </p>
              </div>

              <h2 className="text-xl font-bold text-[#113262] mb-4">SWP vs Dividends vs FD Interest</h2>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <p className="text-sm text-slate-700">
                  SWP offers predictable monthly amounts (you choose the figure), tax efficiency (only gains taxed), and capital appreciation. Dividend payouts are unpredictable and fully taxable at slab rate. FD interest is guaranteed but also fully taxable and does not beat inflation over the long term. For most investors, SWP is the optimal choice for regular income.
                </p>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-[#113262] mb-8">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-6">
                  <h3 className="font-semibold text-slate-900 mb-2">What is a Systematic Withdrawal Plan (SWP)?</h3>
                  <p className="text-sm text-slate-600">SWP allows you to withdraw a fixed amount from your mutual fund investment at regular intervals (monthly, quarterly). The remaining corpus stays invested and continues to grow. It is the most tax-efficient way to generate regular income from mutual funds in India.</p>
                </div>
                
                <div className="border-b border-slate-200 pb-6">
                  <h3 className="font-semibold text-slate-900 mb-2">How much corpus do I need for Rs 50,000 monthly SWP?</h3>
                  <p className="text-sm text-slate-600">At a 5% annual withdrawal rate from an equity fund earning 10-12% returns, you need approximately Rs 1-1.2 crore. At 4% withdrawal (more conservative), you need Rs 1.5 crore. Use the calculator above to model your exact numbers.</p>
                </div>

                <div className="border-b border-slate-200 pb-6">
                  <h3 className="font-semibold text-slate-900 mb-2">Is SWP better than FD interest for monthly income?</h3>
                  <p className="text-sm text-slate-600">SWP from equity mutual funds is generally more tax-efficient than FD interest. Only the capital gains portion of each SWP withdrawal is taxed (at 12.5% LTCG above Rs 1.25 lakh/year), while FD interest is fully taxable at your slab rate. SWP also offers inflation-beating growth on the remaining corpus.</p>
                </div>

                <div className="pb-6">
                  <h3 className="font-semibold text-slate-900 mb-2">What is the ideal SWP withdrawal rate?</h3>
                  <p className="text-sm text-slate-600">Financial planners recommend withdrawing 3-5% of your corpus annually. At 4%, a well-diversified equity portfolio can sustain withdrawals for 25-30 years while preserving the principal. Withdrawing more than 6% annually risks depleting your corpus in a market downturn.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

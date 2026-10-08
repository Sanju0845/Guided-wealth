import React, { useState, useEffect } from 'react';
import { CurrencyInput } from '../ui/CurrencyInput';
import { Share2, ChevronDown } from 'lucide-react';

export default function CustomGoalTracker() {
  const [goalAmount, setGoalAmount] = useState<number>(10000000);
  const [years, setYears] = useState<number>(3);
  const [currentSavings, setCurrentSavings] = useState<number>(0);
  const [rate, setRate] = useState<number>(12);
  const [inflationRate, setInflationRate] = useState<number>(6);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  
  const [futureGoalValue, setFutureGoalValue] = useState<number>(0);
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(0);
  const [yearlyInvestment, setYearlyInvestment] = useState<number>(0);
  const [oneTimeInvestment, setOneTimeInvestment] = useState<number>(0);

  useEffect(() => {
    if (goalAmount > 0 && years > 0 && rate > 0) {
      // Future Goal Value adjusted for inflation
      const fv = goalAmount * Math.pow(1 + inflationRate / 100, years);
      setFutureGoalValue(fv);

      // Value of current savings at the end of the term
      const savingsFv = currentSavings * Math.pow(1 + rate / 100, years);
      
      // Shortfall to be met by fresh investments
      const shortfall = Math.max(0, fv - savingsFv);

      if (shortfall > 0) {
        // One Time Investment
        const oneTime = shortfall / Math.pow(1 + rate / 100, years);
        setOneTimeInvestment(oneTime);

        // Yearly Investment (Annuity Due)
        const rYearly = rate / 100;
        const yearly = shortfall * rYearly / ((Math.pow(1 + rYearly, years) - 1) * (1 + rYearly));
        setYearlyInvestment(yearly);

        // Monthly Investment (Annuity Due)
        const rMonthly = rate / 100 / 12;
        const months = years * 12;
        const monthly = shortfall * rMonthly / ((Math.pow(1 + rMonthly, months) - 1) * (1 + rMonthly));
        setMonthlyInvestment(monthly);
      } else {
        setOneTimeInvestment(0);
        setYearlyInvestment(0);
        setMonthlyInvestment(0);
      }
    } else {
      setFutureGoalValue(0);
      setMonthlyInvestment(0);
      setYearlyInvestment(0);
      setOneTimeInvestment(0);
    }
  }, [goalAmount, years, currentSavings, rate, inflationRate]);

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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Custom Goal Tracker</h1>
        <p className="text-slate-600 text-base">Achieve Any Financial Goals with Custom Goal Calculator</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          <div className="flex-1 space-y-6">
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Goal Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Goal Amount</label>
                  <CurrencyInput
                    value={goalAmount}
                    onValueChange={(val) => setGoalAmount(val)}
                  />
                  <div>
                    <input
                      type="range"
                      min="10000"
                      max="100000000"
                      step="10000"
                      value={goalAmount}
                      onChange={(e) => setGoalAmount(Number(e.target.value))}
                    
                      style={getSliderStyle(goalAmount, "10000", "100000000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>₹10K</span>
                      <span>₹10Cr</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Years to Achieve</label>
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
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Investment Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Current Savings</label>
                  <CurrencyInput
                    value={currentSavings}
                    onValueChange={(val) => setCurrentSavings(val)}
                  />
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="10000000"
                      step="5000"
                      value={currentSavings}
                      onChange={(e) => setCurrentSavings(Number(e.target.value))}
                    
                      style={getSliderStyle(currentSavings, "0", "10000000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>₹0</span>
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

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <button 
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full p-6 flex justify-between items-center text-left hover:bg-slate-50 transition-colors"
              >
                <h2 className="text-lg font-bold text-slate-900">Additional Settings</h2>
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
                <h2 className="text-lg font-semibold">Goal Summary</h2>
                <button className="text-slate-300 hover:text-white transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center mb-10">
                <div className="text-4xl font-bold mb-1">{formatCurrency(futureGoalValue)}</div>
                <div className="text-slate-300 text-sm">Future Goal Value</div>
              </div>

              <div className="flex-1">
                <div className="space-y-4">
                  <div className="pb-3 border-b border-slate-600">
                    <span className="text-slate-300 text-sm font-semibold">Investment Required</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-600">
                    <span className="text-slate-300 text-sm">Monthly Investment</span>
                    <span className="font-semibold">{formatCurrency(monthlyInvestment)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-600">
                    <span className="text-slate-300 text-sm">Yearly Investment</span>
                    <span className="font-semibold">{formatCurrency(yearlyInvestment)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">One Time Investment</span>
                    <span className="font-semibold">{formatCurrency(oneTimeInvestment)}</span>
                  </div>
                </div>
              </div>

              <button className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2">
                Start Planning <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl space-y-12 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#113262] mb-4">Life Goals and Financial Planning</h2>
            <p className="text-sm mb-4">
              Life presents countless opportunities for personal growth and achievement. From purchasing your dream home to starting a business venture, or funding higher education - each individual's aspirations shape their unique financial journey. Whether it's building a retirement nest egg or creating a legacy for future generations, proper financial planning turns these dreams into attainable goals.
            </p>
            <p className="text-sm mb-6">
              Modern lifestyles often require substantial financial backing. Some may aspire to own luxury vehicles or high-end gadgets, while others might focus on building a diverse investment portfolio or establishing a charitable foundation. The key lies in identifying these personal objectives and creating a structured approach to achieve them.
            </p>

            <h3 className="text-lg font-bold text-[#113262] mb-4">Investment as a Path to Goal Achievement</h3>
            <p className="text-sm mb-4">
              Strategic investing serves as a powerful tool for reaching life's milestones. Short-term goals, such as creating an emergency fund or saving for a dream vacation, require different investment approaches than long-term objectives like property acquisition or retirement planning. Regular investment not only helps accumulate wealth but also provides protection against inflation and market volatility.
            </p>
            <p className="text-sm mb-6">
              The power of compound returns, combined with disciplined investing, can transform modest monthly contributions into substantial wealth over time. Tax-efficient investment strategies further enhance returns, while diversification helps manage risk across different market conditions.
            </p>

            <h3 className="text-lg font-bold text-[#113262] mb-4">Understanding Our Custom Goals Calculator</h3>
            <p className="text-sm mb-4">
              Our calculator employs advanced financial algorithms to provide personalized investment insights. It factors in critical variables such as time horizon, inflation impact, and expected investment returns to determine optimal investment strategies. The tool considers both lump-sum and systematic investment approaches, allowing for flexibility in financial planning.
            </p>
            <p className="text-sm mb-6">
              By accounting for existing savings and their potential growth, the calculator offers a comprehensive view of your financial journey. It helps visualize how different investment amounts and frequencies can impact your goal achievement timeline.
            </p>

            <h3 className="text-lg font-bold text-[#113262] mb-4">Maximizing the Calculator's Potential</h3>
            <p className="text-sm mb-4">
              To get the most accurate results, start by defining your goal amount based on current market values. Consider factors like inflation and realistic investment returns based on your risk tolerance and market conditions. The calculator allows you to experiment with different scenarios, helping you understand how adjusting variables affects your investment requirements.
            </p>
            <p className="text-sm mb-6">
              For those with existing savings, the tool factors in both current corpus and its potential growth, providing a more precise estimate of additional investments needed. This feature helps create a more tailored and achievable financial roadmap.
            </p>

            <h3 className="text-lg font-bold text-[#113262] mb-4">Benefits of Goal-Based Financial Planning</h3>
            <p className="text-sm mb-4">
              Goal-based planning transforms abstract financial targets into concrete, achievable objectives. Our calculator helps break down long-term goals into manageable monthly or annual investment commitments, making the journey less daunting and more structured.
            </p>
            <p className="text-sm mb-6">
              Regular monitoring and adjustment of your investment strategy ensure you stay on track. The calculator serves as a dynamic tool, allowing you to modify your approach as circumstances change or as you get closer to your goals. This flexibility, combined with disciplined investing, significantly increases your chances of financial success.
            </p>
          </section>

          <div className="pt-8 border-t border-slate-200 mt-8 space-y-12">
            <section>
              <h2 className="text-xl font-bold text-[#113262] mb-4">Goal-Based Investing</h2>
              <p className="text-sm text-slate-700">
                Every investment should be tied to a specific goal with a defined timeline and target amount. This calculator helps you work backwards from your goal to determine how much you need to invest monthly. Whether it is buying a car in 2 years, a house down payment in 5 years, or your child's education in 15 years, goal-based planning ensures your money is working towards something concrete.
              </p>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-[#113262] mb-8">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">How do I plan for multiple financial goals?</h3>
                  <p className="text-sm text-slate-600">List each goal with its target amount and timeline. Use this calculator for each goal separately. Short-term goals (1-3 years) should be funded through debt instruments; medium-term (3-7 years) through balanced funds; and long-term (7+ years) through equity. Never mix goal timelines in the same investment.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

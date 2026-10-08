import React, { useState, useEffect, ChangeEvent } from 'react';
import { CurrencyInput } from '../ui/CurrencyInput';
import { Share2 } from 'lucide-react';

export default function CompoundInterestTool() {
  const [principal, setPrincipal] = useState<number>(100000);
  const [rate, setRate] = useState<number>(8);
  const [years, setYears] = useState<number>(10);
  const [frequency, setFrequency] = useState<number>(1); // 1 = Annually
  
  const [maturityAmount, setMaturityAmount] = useState<number>(0);
  const [interestEarned, setInterestEarned] = useState<number>(0);

  useEffect(() => {
    if (principal > 0 && rate > 0 && years > 0) {
      // A = P(1 + r/n)^(nt)
      const r = rate / 100;
      const n = frequency;
      const t = years;
      
      const amount = principal * Math.pow(1 + r / n, n * t);
      const interest = amount - principal;
      
      setMaturityAmount(amount);
      setInterestEarned(interest);
    } else {
      setMaturityAmount(0);
      setInterestEarned(0);
    }
  }, [principal, rate, years, frequency]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getFrequencyText = (freq: number) => {
    switch (freq) {
      case 1: return "Annually";
      case 2: return "Semi-Annually";
      case 4: return "Quarterly";
      case 12: return "Monthly";
      default: return "Annually";
    }
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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Compound Interest Calculator</h1>
        <p className="text-slate-600 text-base">Calculate how your investments grow over time</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Calculator Section */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Left Column: Inputs */}
          <div className="flex-1 space-y-6">
            {/* Investment Details */}
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
                      max="100000000"
                      step="10000"
                      value={principal}
                      onChange={(e) => setPrincipal(Number(e.target.value))}
                    
                      style={getSliderStyle(principal, "10000", "100000000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>₹1L</span>
                      <span>₹10Cr</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Interest Rate (%)</label>
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
                      <span>5%</span>
                      <span>20%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Time Period */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Time Period</h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Investment Period (Years)</label>
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                />
                <div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    step="1"
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                  
                      style={getSliderStyle(years, "1", "50")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>5 years</span>
                    <span>25 years</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Compounding Frequency */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Compounding Frequency</h2>
              <div>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(Number(e.target.value))}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all bg-white"
                >
                  <option value={1}>Compounded Annually</option>
                  <option value={2}>Compounded Semi-Annually</option>
                  <option value={4}>Compounded Quarterly</option>
                  <option value={12}>Compounded Monthly</option>
                </select>
              </div>
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-[#1e2a4f] rounded-2xl shadow-lg p-5 text-white h-full flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">Results</h2>
                <button className="text-slate-300 hover:text-white transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-8">
                <div className="text-4xl font-bold mb-1">{formatCurrency(maturityAmount)}</div>
                <div className="text-slate-300 text-sm">Maturity Amount</div>
              </div>

              <div className="flex-1">
                <div className="text-sm font-medium text-slate-300 mb-4 border-b border-slate-600 pb-2">Investment Breakdown</div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">Principal Amount</span>
                    <span className="font-semibold">{formatCurrency(principal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">Interest Earned</span>
                    <span className="font-semibold">{formatCurrency(interestEarned)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">Compounding</span>
                    <span className="font-semibold">{getFrequencyText(frequency)}</span>
                  </div>
                </div>
              </div>

              <button className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2">
                Start Investing <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Informational Content Section */}
        <div className="max-w-4xl space-y-12 text-slate-700 leading-relaxed">
          
          <section>
            <h2 className="text-xl font-bold text-[#113262] mb-4">Understanding Compound Interest</h2>
            <p>
              Compound interest is a fundamental concept in wealth building where you earn returns not only on your initial investment but also on the accumulated interest over time. This powerful financial mechanism accelerates wealth growth by reinvesting earnings, creating a snowball effect that can significantly boost your investment returns over the long term.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#113262] mb-4">The Power of Compound Interest</h2>
            <p className="mb-6">
              Consider this example: If you invest ₹10,000 with an annual interest rate of 10%, after the first year you'll earn ₹1,000, bringing your total to ₹11,000. In the second year, you'll earn interest on ₹11,000, not just your initial ₹10,000. This means you'll earn ₹1,100 in interest, bringing your total to ₹12,100. This compounding effect continues to accelerate your wealth growth over time.
            </p>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <h3 className="font-semibold text-slate-900 mb-4">Key Components:</h3>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>Principal Amount - Your initial investment</li>
                <li>Interest Rate - Annual percentage return on investment</li>
                <li>Time Period - Duration of investment</li>
                <li>Compounding Frequency - How often interest is calculated (annually, monthly, etc.)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#113262] mb-4">Compound Interest Formula</h2>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <p className="mb-4 text-sm">The formula used to calculate compound interest is:</p>
              <div className="bg-white p-4 rounded-lg font-mono text-sm border border-slate-200 mb-4">
                A = P(1 + r/n)^(nt)
              </div>
              <p className="mb-2 text-sm font-semibold">Where:</p>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>A = Final amount</li>
                <li>P = Principal (initial investment)</li>
                <li>r = Annual interest rate (in decimal form)</li>
                <li>n = Number of times interest is compounded per year</li>
                <li>t = Time period in years</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#113262] mb-4">Benefits of Using Our Calculator</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <h3 className="font-semibold text-slate-900 mb-4">Practical Benefits</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>Accurate calculation of future investment value</li>
                  <li>Compare different investment scenarios</li>
                  <li>Understand the impact of different compounding frequencies</li>
                  <li>Plan your long-term financial goals effectively</li>
                </ul>
              </div>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <h3 className="font-semibold text-slate-900 mb-4">Strategic Advantages</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>Make informed investment decisions</li>
                  <li>Visualize the power of long-term investing</li>
                  <li>Optimize your investment strategy</li>
                  <li>Track progress towards financial goals</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#113262] mb-4">How to Use the Calculator</h2>
            <ol className="list-decimal pl-5 space-y-3 text-sm">
              <li>Enter your principal amount (initial investment)</li>
              <li>Specify the interest rate you expect to earn</li>
              <li>Choose your investment time period</li>
              <li>Select how often you want interest to be compounded</li>
              <li>The calculator will instantly show you:
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  <li>Total amount after the investment period</li>
                  <li>Total interest earned</li>
                  <li>Detailed breakdown of year-by-year growth</li>
                </ul>
              </li>
            </ol>
          </section>

          <section className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mt-12">
            <h3 className="text-lg font-bold text-[#113262] mb-4">The Power of Compounding</h3>
            <p className="text-sm">
              Compounding is the single most powerful force in investing. Rs 1 lakh invested at 12% CAGR grows to Rs 9.6 lakh in 20 years and Rs 30 lakh in 30 years. The key is time. The earlier you start investing, the more compounding works in your favour. Even a 5-year head start can result in lakhs of additional wealth at retirement.
            </p>
          </section>

          <section className="pt-8">
            <h2 className="text-xl font-bold text-[#113262] mb-8">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">What is compound interest?</h3>
                <p className="text-sm text-slate-600">Compound interest is interest calculated on both the initial principal and the accumulated interest from previous periods. It is often called "interest on interest" and is the primary mechanism through which investments grow over time. Albert Einstein reportedly called it the eighth wonder of the world.</p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">How does compounding frequency affect returns?</h3>
                <p className="text-sm text-slate-600">More frequent compounding results in higher effective returns. Annual compounding at 10% on Rs 1 lakh gives Rs 1,10,000 after one year. Monthly compounding at the same rate gives Rs 1,10,471. The difference grows significantly over longer periods.</p>
              </div>
              
              <div className="pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">What is the Rule of 72?</h3>
                <p className="text-sm text-slate-600">The Rule of 72 is a quick way to estimate how long it takes to double your money. Divide 72 by the annual return rate. At 12% returns, your money doubles in approximately 6 years (72/12). At 8%, it takes about 9 years.</p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

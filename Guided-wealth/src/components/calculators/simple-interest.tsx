import React, { useState, useEffect } from 'react';
import { CurrencyInput } from '../ui/CurrencyInput';
import { Share2 } from 'lucide-react';

export default function SimpleInterest() {
  const [principal, setPrincipal] = useState<number>(100000);
  const [rate, setRate] = useState<number>(8);
  const [years, setYears] = useState<number>(10);
  
  const [maturityAmount, setMaturityAmount] = useState<number>(0);
  const [interestAccrued, setInterestAccrued] = useState<number>(0);

  useEffect(() => {
    if (principal > 0 && rate > 0 && years > 0) {
      const interest = principal * (rate / 100) * years;
      const total = principal + interest;
      
      setInterestAccrued(interest);
      setMaturityAmount(total);
    } else {
      setInterestAccrued(0);
      setMaturityAmount(0);
    }
  }, [principal, rate, years]);

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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Simple Interest Calculator</h1>
        <p className="text-slate-600 text-base">Calculate basic interest earnings</p>
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
                      max="20"
                      step="0.1"
                      value={rate}
                      onChange={(e) => setRate(Number(e.target.value))}
                    
                      style={getSliderStyle(rate, "1", "20")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>1%</span>
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
                <label className="block text-sm font-medium text-slate-700 mb-2">Investment Duration (Years)</label>
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

            <div className="bg-blue-50 text-blue-800 text-sm p-4 rounded-xl">
              Note: Simple interest is calculated on the original principal amount for the entire duration.
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
                <div className="text-slate-300 text-sm">Total Maturity Value</div>
              </div>

              <div className="flex-1">
                <div className="text-sm font-medium text-slate-300 mb-4 border-b border-slate-600 pb-2">Breakdown</div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">Principal Amount</span>
                    <span className="font-semibold">{formatCurrency(principal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">Interest Accrued</span>
                    <span className="font-semibold">{formatCurrency(interestAccrued)}</span>
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

        {/* Informational Content Section */}
        <div className="max-w-4xl space-y-12 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#113262] mb-4">Understanding Simple Interest</h2>
            <p className="mb-4">
              Simple interest represents the most basic form of interest calculation in lending and borrowing. Unlike compound interest, simple interest is calculated solely on the initial principal amount, making it easier to understand and predict. This straightforward approach is commonly used in short-term financial arrangements, including personal loans and certain types of consumer financing.
            </p>
            
            <h3 className="text-xl font-bold text-[#113262] mt-6 mb-3">How Simple Interest Works</h3>
            <p>
              When you borrow or lend money with simple interest, the interest payment remains constant throughout the loan term. For instance, if you borrow ₹10,000 at 5% simple interest annually, you'll pay ₹500 in interest each year, regardless of any previous interest payments. This consistency makes it an attractive option for both borrowers and lenders who prefer predictable payment structures.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#113262] mb-4">Simple Interest Formula Explained</h2>
            <p className="mb-4">
              The calculation of simple interest follows a straightforward formula:
            </p>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <p className="mb-4 font-semibold text-lg">Interest = P × R × T</p>
              <p className="text-slate-600 mb-2">Where:</p>
              <ul className="list-none space-y-1 text-slate-600">
                <li><span className="font-semibold text-slate-800">P</span> = Principal (initial amount)</li>
                <li><span className="font-semibold text-slate-800">R</span> = Interest rate per year (in decimal form)</li>
                <li><span className="font-semibold text-slate-800">T</span> = Time period (in years)</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#113262] mb-4">Practical Example</h2>
            <p className="mb-4">
              Let's consider a practical scenario: If you invest ₹50,000 at 6% simple interest for 2 years, here's how it works:
            </p>
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <ul className="list-disc pl-5 space-y-2 text-sm font-medium">
                <li>Principal (P) = ₹50,000</li>
                <li>Rate (R) = 6% = 0.06</li>
                <li>Time (T) = 2 years</li>
                <li>Interest = 50,000 × 0.06 × 2 = ₹6,000</li>
                <li>Total Amount = ₹56,000</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#113262] mb-4">Advantages of Our Simple Interest Calculator</h2>
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <ul className="list-disc pl-5 space-y-3 text-sm">
                <li>Instant and accurate calculations</li>
                <li>Easy comparison of different interest scenarios</li>
                <li>Clear breakdown of principal and interest amounts</li>
                <li>Helps in making informed borrowing decisions</li>
                <li>Perfect for planning short-term investments</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#113262] mb-4">Using Our Calculator</h2>
            <p className="mb-4">
              Our simple interest calculator streamlines your financial planning process. Simply input your principal amount, interest rate, and time period above. The calculator instantly shows you both the interest amount and the total sum you'll receive at maturity. This helps you make well-informed decisions about your investments or loans.
            </p>
          </section>

          <div className="grid md:grid-cols-2 gap-8 pt-8">
            <section>
              <h2 className="text-xl font-bold text-[#113262] mb-4">Simple Interest vs Compound Interest</h2>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <p className="text-sm text-slate-700">
                  Simple interest is calculated only on the principal, while compound interest is calculated on the principal plus accumulated interest. For short-term calculations (under 1 year), the difference is small. Over longer periods, compound interest generates significantly higher returns.
                </p>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-[#113262] mb-8">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-6">
                  <h3 className="font-semibold text-slate-900 mb-2">What is simple interest?</h3>
                  <p className="text-sm text-slate-600">Simple interest is calculated only on the original principal amount. The formula is: Interest = Principal × Rate × Time. Unlike compound interest, simple interest does not account for interest earned on previously accumulated interest.</p>
                </div>
                
                <div className="pb-6">
                  <h3 className="font-semibold text-slate-900 mb-2">Where is simple interest used?</h3>
                  <p className="text-sm text-slate-600">Simple interest is used in short-term loans, some personal loans, car loans, and non-cumulative fixed deposits where interest is paid out periodically rather than reinvested.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

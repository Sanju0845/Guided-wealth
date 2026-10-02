import React, { useState, useEffect, ChangeEvent } from 'react';
import { CurrencyInput } from '../ui/CurrencyInput';
import { Share2 } from 'lucide-react';

export default function PpfPlanner() {
  const [annualInvestment, setAnnualInvestment] = useState<number>(86500);
  const [rate, setRate] = useState<number>(6); // Default 6% to match screenshot
  const [years, setYears] = useState<number>(15);
  
  const [maturityAmount, setMaturityAmount] = useState<number>(0);
  const [totalInvestment, setTotalInvestment] = useState<number>(0);
  const [interestEarned, setInterestEarned] = useState<number>(0);

  useEffect(() => {
    if (annualInvestment > 0 && rate > 0 && years > 0) {
      // PPF Formula: A = P * [((1 + r)^t - 1) / r] * (1 + r)
      const r = rate / 100;
      const t = years;
      
      const amount = annualInvestment * ((Math.pow(1 + r, t) - 1) / r) * (1 + r);
      const totalInv = annualInvestment * t;
      const interest = amount - totalInv;
      
      setMaturityAmount(amount);
      setTotalInvestment(totalInv);
      setInterestEarned(interest);
    } else {
      setMaturityAmount(0);
      setTotalInvestment(0);
      setInterestEarned(0);
    }
  }, [annualInvestment, rate, years]);

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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">PPF Calculator</h1>
        <p className="text-slate-600 text-base">Calculate your Public Provident Fund returns</p>
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
                  <label className="block text-sm font-medium text-slate-700 mb-2">Annual Investment</label>
                  <CurrencyInput
                    value={annualInvestment}
                    onValueChange={(val) => setAnnualInvestment(val)}
                  />
                  <div>
                    <input
                      type="range"
                      min="500"
                      max="150000"
                      step="500"
                      value={annualInvestment}
                      onChange={(e) => setAnnualInvestment(Number(e.target.value))}
                    
                      style={getSliderStyle(annualInvestment, "500", "150000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>₹500</span>
                      <span>₹1.5L</span>
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
                      max="15"
                      step="0.1"
                      value={rate}
                      onChange={(e) => setRate(Number(e.target.value))}
                    
                      style={getSliderStyle(rate, "1", "15")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>1%</span>
                      <span>15%</span>
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
                    min="15"
                    max="50"
                    step="1"
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                  
                      style={getSliderStyle(years, "15", "50")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>15 years</span>
                    <span>50 years</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              Note: The current PPF interest rate is 7.1% per annum, compounded annually. The minimum investment period is 15 years.
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-[#1e2a4f] rounded-2xl shadow-lg p-5 text-white h-full flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">PPF Returns</h2>
                <button className="text-slate-300 hover:text-white transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-8">
                <div className="text-4xl font-bold mb-1">{formatCurrency(maturityAmount)}</div>
                <div className="text-slate-300 text-sm">Maturity Value</div>
              </div>

              <div className="flex-1">
                <div className="text-sm font-medium text-slate-300 mb-4 border-b border-slate-600 pb-2">Investment Breakdown</div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">Total Investment</span>
                    <span className="font-semibold">{formatCurrency(totalInvestment)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">Interest Earned</span>
                    <span className="font-semibold">{formatCurrency(interestEarned)}</span>
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
            <h2 className="text-xl font-bold text-[#113262] mb-4">What is PPF (Public Provident Fund)?</h2>
            <p>
              A Public Provident Fund (PPF) account is a savings account that offers Indian residents a tax-free and flexible way to save money. Not only contributions made to a PPF account are tax-deductible, but under Section 80C of the Income Tax Act, 1961, the earnings on the account are also tax-free. The account can be used to save for retirement, children's education, or other expenses.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 mb-2">Contribution Limit</h3>
            <p>
              Contributions to a PPF account must be made in multiples of ₹500 and can be as low as ₹500 per year. The maximum contribution that can be made in a year is ₹1,50,000. The minimum amount that must be maintained in the account is ₹500.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 mb-2">Tenure</h3>
            <p>
              The maturity period for a PPF account is 15 years, but the account can be extended for another five years after the maturity date. Partial withdrawals from a PPF account are allowed, but only after the account has been active for at least five years.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 mb-2">How to open a PPF account?</h3>
            <p className="mb-2">Want to open a PPF account? Get the following documents ready:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Identity proof</li>
              <li>Address proof</li>
              <li>Photograph</li>
              <li>Application form</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 mb-2">Why opt for PPF?</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Safe and secure investment in government securities</li>
              <li>High returns (around 8% annualized return in recent years)</li>
              <li>Tax-deductible investment up to ₹1.5 lakhs per year</li>
              <li>Flexible withdrawal options</li>
              <li>Easy account transferability between banks</li>
            </ul>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 mb-2">How is PPF calculated?</h3>
            <p>
              PPF interest is calculated using the formula: Interest = Principal × Rate × Time / 100. The interest is calculated yearly and credited at the end of each financial year. For example, a deposit of ₹1 lakh at 7% interest would earn ₹7,000 in interest after one year.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-slate-900 mb-2">How to use our PPF calculator?</h3>
            <p>
              Simply enter your investment amount, interest rate, and investment duration in our calculator above. The calculator will show you the maturity value and help you plan your PPF investments effectively. It's a useful tool for estimating returns and making informed investment decisions.
            </p>
          </section>

          <section>
            <h3 className="font-bold text-[#113262] mb-2">Why PPF Remains Relevant</h3>
            <p className="mb-6">
              Despite offering lower returns than equity, PPF remains a cornerstone of Indian financial planning due to its EEE tax status, sovereign guarantee, and zero market risk. For conservative investors or as the debt component of a portfolio, PPF provides certainty that few other instruments can match.
            </p>

            <h3 className="font-bold text-[#113262] mb-2">Maximising PPF Returns</h3>
            <p>
              Invest before the 5th of April each year to earn interest for 12 full months. If investing monthly, deposit before the 5th of each month. Consider extending the PPF account in 5-year blocks after maturity if you do not need the funds, as the tax-free compounding continues.
            </p>
          </section>

          <section className="pt-8">
            <h2 className="text-xl font-bold text-[#113262] mb-8">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">What is the current PPF interest rate?</h3>
                <p className="text-sm text-slate-600">The PPF interest rate for Q1 FY 2025-26 is 7.1% per annum, compounded annually. The rate is reviewed quarterly by the Government of India but has remained at 7.1% since October 2020.</p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">What is the PPF lock-in period?</h3>
                <p className="text-sm text-slate-600">PPF has a 15-year lock-in from the date of account opening. Partial withdrawal is allowed from the 7th financial year onwards (up to 50% of the balance at the end of the 4th year). The account can be extended in blocks of 5 years after maturity.</p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">Is PPF completely tax-free?</h3>
                <p className="text-sm text-slate-600">Yes. PPF enjoys EEE (Exempt-Exempt-Exempt) tax status. The investment qualifies for Section 80C deduction (up to Rs 1.5 lakh), the interest earned is tax-free, and the maturity amount is entirely tax-free. This makes PPF one of the most tax-efficient instruments in India.</p>
              </div>

              <div className="border-b border-slate-200 pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">What is the maximum PPF investment per year?</h3>
                <p className="text-sm text-slate-600">The maximum annual contribution to PPF is Rs 1.5 lakh. The minimum is Rs 500. You can invest in a lump sum or in up to 12 instalments per year. Deposits must be made before the 5th of each month to earn interest for that month.</p>
              </div>
              
              <div className="pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">Can NRIs open a PPF account?</h3>
                <p className="text-sm text-slate-600">NRIs cannot open new PPF accounts. However, PPF accounts opened before becoming an NRI can be continued until maturity (15 years) but cannot be extended. The interest rate for NRI-held PPF accounts may be revised to the Post Office savings rate.</p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

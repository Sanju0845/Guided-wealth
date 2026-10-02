import React, { useState, useEffect } from 'react';
import { CurrencyInput } from '../ui/CurrencyInput';
import { Share2 } from 'lucide-react';

export default function RecurringDepositPlanner() {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(100000);
  const [rate, setRate] = useState<number>(8);
  const [months, setMonths] = useState<number>(18);
  
  const [maturityAmount, setMaturityAmount] = useState<number>(0);
  const [totalInvestment, setTotalInvestment] = useState<number>(0);
  const [interestEarned, setInterestEarned] = useState<number>(0);

  useEffect(() => {
    if (monthlyInvestment > 0 && rate > 0 && months > 0) {
      let amount = 0;
      for (let i = 0; i < months; i++) {
        amount += monthlyInvestment * Math.pow(1 + (rate / 100) / 4, (months - i) / 3);
      }
      
      const invested = monthlyInvestment * months;
      const interest = amount - invested;
      
      setMaturityAmount(amount);
      setTotalInvestment(invested);
      setInterestEarned(interest);
    } else {
      setMaturityAmount(0);
      setTotalInvestment(0);
      setInterestEarned(0);
    }
  }, [monthlyInvestment, rate, months]);

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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">RD Calculator</h1>
        <p className="text-slate-600 text-base">Calculate your Recurring Deposit returns</p>
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
                  <label className="block text-sm font-medium text-slate-700 mb-2">Monthly Investment</label>
                  <CurrencyInput
                    value={monthlyInvestment}
                    onValueChange={(val) => setMonthlyInvestment(val)}
                  />
                  <div>
                    <input
                      type="range"
                      min="500"
                      max="1000000"
                      step="500"
                      value={monthlyInvestment}
                      onChange={(e) => setMonthlyInvestment(Number(e.target.value))}
                    
                      style={getSliderStyle(monthlyInvestment, "500", "1000000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>₹500</span>
                      <span>₹10L</span>
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
                <label className="block text-sm font-medium text-slate-700 mb-2">Investment Period (Months)</label>
                <input
                  type="number"
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                />
                <div>
                  <input
                    type="range"
                    min="6"
                    max="120"
                    step="1"
                    value={months}
                    onChange={(e) => setMonths(Number(e.target.value))}
                  
                      style={getSliderStyle(months, "6", "120")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>6 months</span>
                    <span>120 months</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 text-blue-800 text-sm p-4 rounded-xl">
              Note: RD interest is compounded quarterly. Minimum investment period is 6 months.
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-[#1e2a4f] rounded-2xl shadow-lg p-5 text-white h-full flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">RD Returns</h2>
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
                    <span className="text-slate-300 text-sm">Total investment</span>
                    <span className="font-semibold">{formatCurrency(totalInvestment)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">Interest Earned</span>
                    <span className="font-semibold">{formatCurrency(interestEarned)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">Investment Period</span>
                    <span className="font-semibold">{months} Months</span>
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
            <h2 className="text-xl font-bold text-[#113262] mb-4">Understanding Recurring Deposits</h2>
            <p className="mb-4">
              A recurring deposit is a flexible savings instrument that allows you to build your wealth systematically. It's designed for individuals who prefer to save regularly, typically on a monthly basis, while earning competitive interest rates. This investment option is particularly beneficial for salaried professionals and regular income earners who want to cultivate a disciplined savings habit.
            </p>
            <p>
              RD is a popular savings instrument offered by banks and post offices in India. It combines the discipline of monthly savings with the safety of fixed deposits. Current RD rates range from 6-7.5% depending on the bank and tenure. Post office RD rates are set by the government and currently stand at approximately 6.7%.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#113262] mb-4">Understanding RD Interest Calculation</h2>
            <p className="mb-4">
              The interest earned on your recurring deposit is determined through a systematic calculation process. Banks employ quarterly compounding, which means your returns are reinvested every three months, potentially increasing your wealth over time. The final amount you receive depends on three key factors:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Your monthly deposit amount</li>
              <li>The duration of your investment</li>
              <li>The interest rate offered by your bank</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#113262] mb-4">RD Maturity Amount Formula</h2>
            <p className="mb-4">
              The maturity amount for your recurring deposit is calculated using this formula:
            </p>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <p className="mb-4 font-semibold text-lg">A = P × [(1 + R/400)^N - 1] / [1 - (1 + R/400)^(-1/3)]</p>
              <p className="text-slate-600 mb-2">Where:</p>
              <ul className="list-none space-y-1 text-slate-600">
                <li><span className="font-semibold text-slate-800">A</span> = Final maturity amount</li>
                <li><span className="font-semibold text-slate-800">P</span> = Your monthly installment</li>
                <li><span className="font-semibold text-slate-800">N</span> = Total number of quarters</li>
                <li><span className="font-semibold text-slate-800">R</span> = Annual interest rate</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#113262] mb-4">Benefits of Using Our RD Calculator</h2>
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <ul className="list-disc pl-5 space-y-3 text-sm">
                <li>Quick and precise calculations without manual effort</li>
                <li>Accurate prediction of your maturity amount</li>
                <li>Efficient financial planning with instant results</li>
                <li>Error-free calculations for better decision making</li>
                <li>Easy comparison between different RD options</li>
                <li>Better understanding of how your savings will grow</li>
              </ul>
            </div>
          </section>

          <section className="pt-8">
            <h2 className="text-xl font-bold text-[#113262] mb-8">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">What is a Recurring Deposit?</h3>
                <p className="text-sm text-slate-600">A Recurring Deposit (RD) is a savings scheme where you deposit a fixed amount monthly for a chosen tenure. Interest is compounded quarterly at a rate close to FD rates. RD is ideal for disciplined savings without market risk.</p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">How is RD interest calculated?</h3>
                <p className="text-sm text-slate-600">RD interest is compounded quarterly using the compound interest formula. Each monthly deposit earns interest for the remaining tenure. The effective return depends on the deposit amount, tenure, and interest rate.</p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">Is RD better than SIP?</h3>
                <p className="text-sm text-slate-600">RD offers guaranteed returns with zero risk, while SIP in mutual funds offers higher return potential with market risk. For short-term goals (1-3 years) where capital safety is priority, RD is suitable. For long-term goals (5+ years), SIP typically delivers better inflation-adjusted returns.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

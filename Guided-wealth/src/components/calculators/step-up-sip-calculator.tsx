import React, { useState, useEffect } from 'react';
import { Share2 } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

export default function StepUpSipCalculator() {
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(10000);
  const [stepUp, setStepUp] = useState<number>(10);
  const [rate, setRate] = useState<number>(12);
  const [years, setYears] = useState<number>(10);
  
  const [maturityAmount, setMaturityAmount] = useState<number>(0);
  const [totalInvestment, setTotalInvestment] = useState<number>(0);
  const [interestEarned, setInterestEarned] = useState<number>(0);

  useEffect(() => {
    if (monthlyInvestment > 0 && rate > 0 && years > 0) {
      let currentSip = monthlyInvestment;
      let invested = 0;
      let maturity = 0;
      const monthlyRate = rate / 100 / 12;

      for (let y = 1; y <= years; y++) {
        for (let m = 1; m <= 12; m++) {
          invested += currentSip;
          maturity = (maturity + currentSip) * (1 + monthlyRate);
        }
        currentSip += currentSip * (stepUp / 100);
      }
      
      setMaturityAmount(maturity);
      setTotalInvestment(invested);
      setInterestEarned(maturity - invested);
    } else {
      setMaturityAmount(0);
      setTotalInvestment(0);
      setInterestEarned(0);
    }
  }, [monthlyInvestment, stepUp, rate, years]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Donut chart calculations
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const returnsPercentage = maturityAmount > 0 ? (interestEarned / maturityAmount) : 0;
  const strokeDasharray = `${returnsPercentage * circumference} ${circumference}`;
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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Step Up SIP Calculator</h1>
        <p className="text-slate-600 text-base">Calculate returns when you increase your SIP every year</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
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
                  <label className="block text-sm font-medium text-slate-700 mb-2">Annual Step Up (%)</label>
                  <input
                    type="number"
                    value={stepUp}
                    onChange={(e) => setStepUp(Number(e.target.value))}
                  />
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      step="1"
                      value={stepUp}
                      onChange={(e) => setStepUp(Number(e.target.value))}
                    
                      style={getSliderStyle(stepUp, "0", "50")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>0%</span>
                      <span>50%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Returns & Duration */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Returns & Duration</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Expected Return Rate (p.a.)</label>
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
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Time Period (Years)</label>
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

          </div>

          {/* Right Column: Results */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-[#1e2a4f] rounded-2xl shadow-lg p-5 text-white h-full flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">Step Up SIP Returns</h2>
                <button className="text-slate-300 hover:text-white transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center mb-8">
                <div className="text-4xl font-bold mb-1">{formatCurrency(maturityAmount)}</div>
                <div className="text-slate-300 text-sm">Maturity Value</div>
              </div>

              {/* Donut Chart */}
              <div className="flex justify-center mb-10 relative">
                <svg width="120" height="120" viewBox="0 0 100 100" className="transform -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="transparent"
                    stroke="#d97706"
                    strokeWidth="14"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="transparent"
                    stroke="#3b82f6"
                    strokeWidth="14"
                    strokeDasharray={strokeDasharray}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
              </div>

              <div className="flex-1">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-600">
                    <span className="text-slate-300 text-sm">Invested Amount</span>
                    <span className="font-semibold">{formatCurrency(totalInvestment)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-600">
                    <span className="text-slate-300 text-sm">Est. Returns</span>
                    <span className="font-semibold">{formatCurrency(interestEarned)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">Investment Period</span>
                    <span className="font-semibold">{years} Years</span>
                  </div>
                </div>
              </div>

              <button className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2">
                Start Step Up SIP <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Informational Content Section */}
        <div className="max-w-4xl space-y-12 text-slate-700 leading-relaxed">
          <section>
            <h3 className="font-semibold text-slate-900 mb-2">How the Step Up SIP Calculator Works</h3>
            <p className="text-sm mb-4">
              Enter your starting monthly investment, the annual step-up percentage, expected rate of return, and investment duration. The calculator increases your monthly installment by the step-up percentage at the start of every year, compounds returns monthly on the running balance, and shows your total invested amount, estimated returns, and maturity value at the end of the tenure.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">Why Step Up Your SIP?</h3>
            <p className="text-sm mb-4">
              Most salaried investors get annual increments, but a flat SIP does not grow with income, so its impact on your total savings rate quietly shrinks over time. Stepping up your SIP by even 10% a year keeps your investment aligned with your earning capacity and can significantly increase your final corpus compared to a flat SIP of the same starting amount, without ever feeling like a bigger commitment than your last raise.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">Step Up SIP vs Regular SIP</h3>
            <p className="text-sm mb-4">
              For the same starting amount and tenure, a step-up SIP invests more money overall (since installments rise every year) and therefore usually builds a larger corpus than a flat SIP. The trade-off is a variable monthly commitment that rises annually — plan your step-up rate around realistic income growth so it stays comfortable throughout the investment horizon.
            </p>
          </section>

          <section className="pt-6 border-t border-slate-200">
            <h2 className="text-xl font-bold text-[#113262] mb-8">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">What is a Step Up SIP?</h3>
                <p className="text-sm text-slate-600">A Step Up SIP (also called a top-up SIP) automatically increases your monthly SIP installment by a fixed percentage every year, typically in line with your expected salary growth. This lets your investment keep pace with rising income instead of staying flat for the entire tenure.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-slate-900 mb-2">How is a Step Up SIP different from a regular SIP?</h3>
                <p className="text-sm text-slate-600">A regular SIP invests the same fixed amount every month for the entire duration. A Step Up SIP starts with a lower amount but increases it annually by a percentage you choose, resulting in a larger total investment and typically a bigger corpus at maturity, without straining your monthly budget in the early years.</p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">What is a good annual step-up percentage?</h3>
                <p className="text-sm text-slate-600">Most investors set the step-up rate between 5% and 15%, roughly matching their expected annual salary hike. A 10% step-up is a common starting point — it meaningfully accelerates corpus growth without requiring aggressive increases to your monthly outgo.</p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Does a Step Up SIP guarantee higher returns?</h3>
                <p className="text-sm text-slate-600">No. A Step Up SIP increases the amount invested, not the rate of return. Returns still depend on market performance of the underlying mutual fund. However, because you invest more in later years when your corpus is already large, compounding works on a bigger base, generally leading to higher absolute returns than a flat SIP of the same starting amount.</p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-2">Can I change or stop the step-up later?</h3>
                <p className="text-sm text-slate-600">Yes. Most mutual fund houses let you modify or cancel a step-up (top-up) SIP mandate at any time with a few days notice, similar to a regular SIP. You are not locked into the step-up percentage for the full tenure.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

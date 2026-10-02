import React, { useState, useEffect } from 'react';
import { CurrencyInput } from '../ui/CurrencyInput';
import { Share2, ChevronDown, ChevronUp, Target, Calendar, TrendingUp, DollarSign, Sliders, CheckCircle2 } from 'lucide-react';

export default function FirstCroreGoal() {
  // Input States
  const [targetAmount, setTargetAmount] = useState<number>(10000000);
  const [yearsToAchieve, setYearsToAchieve] = useState<number>(3);
  const [currentSavings, setCurrentSavings] = useState<number>(0);
  const [expectedReturns, setExpectedReturns] = useState<number>(12);

  // Additional Settings
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [inflationRate, setInflationRate] = useState<number>(6);
  const [annualStepUpPercent, setAnnualStepUpPercent] = useState<number>(10);

  // Computed Outputs
  const [futureTargetAmount, setFutureTargetAmount] = useState<number>(0);
  const [fvCurrentSavings, setFvCurrentSavings] = useState<number>(0);
  const [netRequiredTarget, setNetRequiredTarget] = useState<number>(0);
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(0);
  const [yearlyInvestment, setYearlyInvestment] = useState<number>(0);
  const [oneTimeInvestment, setOneTimeInvestment] = useState<number>(0);

  useEffect(() => {
    // Inflation adjusted target
    const fvTarget = Math.round(targetAmount * Math.pow(1 + inflationRate / 100, yearsToAchieve));

    // Future value of current savings
    const fvSavings = Math.round(currentSavings * Math.pow(1 + expectedReturns / 100, yearsToAchieve));

    // Net required corpus
    const netReq = Math.max(0, fvTarget - fvSavings);

    // Monthly SIP required formula
    const r = expectedReturns / 12 / 100;
    const n = yearsToAchieve * 12;
    let sip = 0;
    if (r > 0 && n > 0 && netReq > 0) {
      sip = Math.round((netReq * r) / ((1 + r) * (Math.pow(1 + r, n) - 1)));
    }

    const yearly = sip * 12;
    const lump = Math.round(netReq / Math.pow(1 + expectedReturns / 100, yearsToAchieve));

    setFutureTargetAmount(fvTarget);
    setFvCurrentSavings(fvSavings);
    setNetRequiredTarget(netReq);
    setMonthlyInvestment(sip);
    setYearlyInvestment(yearly);
    setOneTimeInvestment(lump);
  }, [
    targetAmount,
    yearsToAchieve,
    currentSavings,
    expectedReturns,
    inflationRate,
    annualStepUpPercent,
  ]);

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
      {/* Header Banner */}
      <div className="bg-white pt-32 pb-10 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">First Crore Calculator</h1>
        <p className="text-slate-600 text-base">
          Become a Crorepati with First Crore Goal Calculator
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Grid */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Inputs Column */}
          <div className="flex-1 space-y-6">
            {/* Goal Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-600" /> Goal Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Target Amount</label>
                    <CurrencyInput
                    value={targetAmount}
                    onValueChange={(val) => setTargetAmount(val)}
                  />
                  </div>
                  <input
                    type="range"
                    min="1000000"
                    max="100000000"
                    step="500000"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(Number(e.target.value))}

                    style={getSliderStyle(targetAmount, "1000000", "100000000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>₹10 Lakhs</span>
                    <span>₹10 Cr</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Years to Achieve</label>
                    <span className="text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-300">
                      {yearsToAchieve} Yrs
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={yearsToAchieve}
                    onChange={(e) => setYearsToAchieve(Number(e.target.value))}

                    style={getSliderStyle(yearsToAchieve, "1", "30")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>1 year</span>
                    <span>30 years</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Investment Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" /> Investment Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Current Savings</label>
                    <CurrencyInput
                    value={currentSavings}
                    onValueChange={(val) => setCurrentSavings(val)}
                  />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5000000"
                    step="50000"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(Number(e.target.value))}

                    style={getSliderStyle(currentSavings, "0", "5000000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>₹0</span>
                    <span>₹50 Lakhs</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Expected Returns (%)</label>
                    <span className="text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-300">
                      {expectedReturns}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="4"
                    max="20"
                    step="0.5"
                    value={expectedReturns}
                    onChange={(e) => setExpectedReturns(Number(e.target.value))}

                    style={getSliderStyle(expectedReturns, "4", "20")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>4%</span>
                    <span>20%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Settings Accordion */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full p-6 flex justify-between items-center font-bold text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <span className="flex items-center gap-2 text-base">
                  <Sliders className="w-5 h-5 text-blue-600" /> Additional Settings (Inflation & Step-Up)
                </span>
                {showAdvanced ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
              </button>

              {showAdvanced && (
                <div className="p-6 pt-0 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Inflation Rate (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="12"
                      value={inflationRate}
                      onChange={(e) => setInflationRate(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Annual Step-up Increment (%)</label>
                    <CurrencyInput
                    value={annualStepUpPercent}
                    onValueChange={(val) => setAnnualStepUpPercent(val)}
                  />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Summary Card */}
          <div className="w-full lg:w-[380px]">
            <div className="bg-[#1e2a4f] rounded-2xl shadow-xl p-6 md:p-8 text-white sticky top-28 border border-slate-600/50">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-bold tracking-tight">First Crore Summary</h2>
                <button className="text-slate-400 hover:text-white transition-colors p-1" title="Share">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-8 bg-slate-800/80 p-5 rounded-2xl border border-slate-600">
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">
                  {formatCurrency(futureTargetAmount)}
                </div>
                <div className="text-slate-300 text-xs font-medium uppercase tracking-wider">Inflation Adjusted Target</div>
              </div>

              <div className="space-y-4 border-t border-slate-600/60 pt-6">
                <div className="flex justify-between items-center text-sm font-semibold text-amber-400">
                  <span>Investment Options</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Monthly Investment</span>
                  <span className="font-semibold text-emerald-400">{formatCurrency(monthlyInvestment)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Yearly Investment</span>
                  <span className="font-semibold text-white">{formatCurrency(yearlyInvestment)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">One Time Investment</span>
                  <span className="font-semibold text-white">{formatCurrency(oneTimeInvestment)}</span>
                </div>
              </div>

              <button className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2">
                Start Planning <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Informational SEO & FAQs Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-slate-200">
          <div className="md:col-span-2 space-y-8 text-slate-700 text-sm md:text-base leading-relaxed">
            <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Building Your Path to One Crore</h2>
              <p className="text-slate-600 mb-4">
                Achieving your first crore is a significant milestone that requires strategic planning and disciplined execution. While the journey demands dedication, it's an attainable goal with the right approach to saving and investing. Starting early, particularly in your twenties, provides a substantial advantage due to the power of compound growth over time.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Strategic Investment Approaches</h3>
              <p className="text-slate-600 mb-4">
                Success in reaching one crore depends on creating a balanced portfolio of investments aligned with your risk tolerance. High-yielding assets can accelerate your journey, but it's crucial to understand that higher returns often come with increased risk. A diversified approach across different asset classes can help manage these risks while maintaining growth potential.
              </p>
              <p className="text-slate-600 mb-6">
                Your investment strategy should evolve with your life stage, financial goals, and changing market conditions. Regular monitoring and rebalancing of your portfolio ensures you stay on track while managing risk appropriately.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Maximizing Your First Crore</h3>
              <p className="text-slate-600 mb-2">Once you achieve your first crore, several strategic options become available:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600 mb-6">
                <li><strong>Business Expansion:</strong> Invest in starting or scaling a business venture to generate additional income streams</li>
                <li><strong>Real Estate Investment:</strong> Consider property investments for both appreciation and rental income potential</li>
                <li><strong>Portfolio Diversification:</strong> Create a balanced mix of equity, debt, and alternative investments</li>
                <li><strong>Professional Wealth Management:</strong> Engage with financial experts for optimized portfolio management</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Investment Pathways</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600 mb-6">
                <li><strong>Equity Markets:</strong> Long-term investment in stocks and mutual funds for potential high returns</li>
                <li><strong>Real Estate:</strong> Strategic property investments in growing markets</li>
                <li><strong>Business Ventures:</strong> Entrepreneurial initiatives with scalable potential</li>
                <li><strong>Systematic Investment Plans (SIPs):</strong> Regular, disciplined investing in market instruments</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Benefits of Our Calculator</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>Providing clear visibility of your required monthly savings</li>
                <li>Accounting for inflation impact on your target amount</li>
                <li>Helping adjust investment strategies based on time horizons</li>
                <li>Enabling scenario planning with different return assumptions</li>
                <li>Tracking progress towards your financial milestone</li>
              </ul>
            </section>

            <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-2xl font-bold text-[#113262]">Frequently Asked Questions</h2>

              <div className="border-b border-slate-100 pb-5">
                <h3 className="font-bold text-slate-900 mb-2">How long does it take to save Rs 1 crore?</h3>
                <p className="text-slate-600 text-base">
                  With a Rs 20,000 monthly SIP at 12% returns, it takes approximately 15 years. At Rs 30,000/month, about 12 years. At Rs 50,000/month, roughly 9 years. The first Rs 25 lakh takes the longest; the last Rs 25 lakh comes the fastest due to compounding. Starting early makes a dramatic difference.
                </p>
              </div>

              <div className="border-b border-slate-100 pb-5">
                <h3 className="font-bold text-slate-900 mb-2">What is the best strategy to reach Rs 1 crore?</h3>
                <p className="text-slate-600 text-base">
                  Start with whatever SIP you can afford (even Rs 5,000) and increase it by 10% annually as your income grows. Invest in diversified equity mutual funds for 10+ year goals. Stay invested through market downturns. The combination of consistent SIPs, annual step-ups, and equity compounding is the most reliable path to Rs 1 crore.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-2">How does the second crore come faster than the first?</h3>
                <p className="text-slate-600 text-base">
                  The power of compounding means your existing corpus generates increasingly large returns. If it took 15 years to reach Rs 1 crore at 12% returns with Rs 20,000 SIP, the second crore takes only about 5 more years. Your Rs 1 crore corpus generates Rs 12 lakh annually in returns alone.
                </p>
              </div>
            </section>
          </div>

          {/* Right Column: SEO Card */}
          <div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-lg">Your Path to Rs 1 Crore</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Enter your current savings, monthly SIP amount, expected returns, and annual step-up percentage. The calculator shows when you will reach Rs 1 crore and subsequent milestones (Rs 2 crore, Rs 5 crore). It visualizes the compounding effect and shows how each milestone comes progressively faster.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

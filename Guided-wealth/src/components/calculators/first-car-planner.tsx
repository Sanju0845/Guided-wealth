import React, { useState, useEffect } from 'react';
import { CurrencyInput } from '../ui/CurrencyInput';
import { Share2, ChevronDown, ChevronUp, Car, Calendar, DollarSign, TrendingUp, Sliders } from 'lucide-react';

export default function FirstCarPlanner() {
  // Input States
  const [carCost, setCarCost] = useState<number>(1000000);
  const [yearsToBuy, setYearsToBuy] = useState<number>(1);
  const [currentSavings, setCurrentSavings] = useState<number>(0);
  const [expectedReturns, setExpectedReturns] = useState<number>(12);

  // Additional Settings
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [inflationRate, setInflationRate] = useState<number>(6);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(50);
  const [autoLoanInterest, setAutoLoanInterest] = useState<number>(8.5);
  const [autoLoanTenureYears, setAutoLoanTenureYears] = useState<number>(5);

  // Computed Outputs
  const [futureCarCost, setFutureCarCost] = useState<number>(0);
  const [fvCurrentSavings, setFvCurrentSavings] = useState<number>(0);
  const [netRequiredFund, setNetRequiredFund] = useState<number>(0);
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(0);
  const [yearlyInvestment, setYearlyInvestment] = useState<number>(0);
  const [oneTimeInvestment, setOneTimeInvestment] = useState<number>(0);

  const [downPaymentAmount, setDownPaymentAmount] = useState<number>(0);
  const [loanAmount, setLoanAmount] = useState<number>(0);
  const [loanEmi, setLoanEmi] = useState<number>(0);

  useEffect(() => {
    // Inflation adjusted future car price
    const fvPrice = Math.round(carCost * Math.pow(1 + inflationRate / 100, yearsToBuy));

    // Future value of current savings
    const fvSavings = Math.round(currentSavings * Math.pow(1 + expectedReturns / 100, yearsToBuy));

    // Net required fund for full purchase or target down payment
    const netReq = Math.max(0, fvPrice - fvSavings);

    // Monthly SIP required calculation
    const r = expectedReturns / 12 / 100;
    const n = yearsToBuy * 12;
    let sip = 0;
    if (r > 0 && n > 0 && netReq > 0) {
      sip = Math.round((netReq * r) / ((1 + r) * (Math.pow(1 + r, n) - 1)));
    }

    const yearly = sip * 12;
    const lump = Math.round(netReq / Math.pow(1 + expectedReturns / 100, yearsToBuy));

    // Loan calculations
    const dpAmt = Math.round(fvPrice * (downPaymentPercent / 100));
    const lAmt = fvPrice - dpAmt;
    const lr = autoLoanInterest / 12 / 100;
    const ln = autoLoanTenureYears * 12;
    let emi = 0;
    if (lr > 0 && ln > 0 && lAmt > 0) {
      emi = Math.round((lAmt * lr * Math.pow(1 + lr, ln)) / (Math.pow(1 + lr, ln) - 1));
    }

    setFutureCarCost(fvPrice);
    setFvCurrentSavings(fvSavings);
    setNetRequiredFund(netReq);
    setMonthlyInvestment(sip);
    setYearlyInvestment(yearly);
    setOneTimeInvestment(lump);

    setDownPaymentAmount(dpAmt);
    setLoanAmount(lAmt);
    setLoanEmi(emi);
  }, [
    carCost,
    yearsToBuy,
    currentSavings,
    expectedReturns,
    inflationRate,
    downPaymentPercent,
    autoLoanInterest,
    autoLoanTenureYears,
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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">First Car Planner</h1>
        <p className="text-slate-600 text-base">
          Get moving with First Car Calculator and estimate savings vs auto loan options
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Grid */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Inputs Column */}
          <div className="flex-1 space-y-6">
            {/* Car Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Car className="w-5 h-5 text-blue-600" /> Car Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Car Cost (On-road Price)</label>
                    <CurrencyInput
                    value={carCost}
                    onValueChange={(val) => setCarCost(val)}
                  />
                  </div>
                  <input
                    type="range"
                    min="200000"
                    max="5000000"
                    step="25000"
                    value={carCost}
                    onChange={(e) => setCarCost(Number(e.target.value))}

                    style={getSliderStyle(carCost, "200000", "5000000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>₹2 Lakhs</span>
                    <span>₹50 Lakhs</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Years to Buy</label>
                    <span className="text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-300">
                      {yearsToBuy} Yrs
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={yearsToBuy}
                    onChange={(e) => setYearsToBuy(Number(e.target.value))}

                    style={getSliderStyle(yearsToBuy, "1", "10")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>1 year</span>
                    <span>10 years</span>
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
                    max="2000000"
                    step="25000"
                    value={currentSavings}
                    onChange={(e) => setCurrentSavings(Number(e.target.value))}

                    style={getSliderStyle(currentSavings, "0", "2000000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>₹0</span>
                    <span>₹20 Lakhs</span>
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
                  <Sliders className="w-5 h-5 text-blue-600" /> Additional Settings (Down Payment & Auto Loan)
                </span>
                {showAdvanced ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
              </button>

              {showAdvanced && (
                <div className="p-6 pt-0 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Down Payment Target (%)</label>
                    <input
                      type="number"
                      step="5"
                      min="10"
                      max="100"
                      value={downPaymentPercent}
                      onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Auto Loan Interest Rate (%)</label>
                    <CurrencyInput
                    value={autoLoanInterest}
                    onValueChange={(val) => setAutoLoanInterest(val)}
                  />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Auto Loan Tenure (Years)</label>
                    <CurrencyInput
                    value={autoLoanTenureYears}
                    onValueChange={(val) => setAutoLoanTenureYears(val)}
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
                <h2 className="text-xl font-bold tracking-tight">Car Fund Summary</h2>
                <button className="text-slate-400 hover:text-white transition-colors p-1" title="Share">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-8 bg-slate-800/80 p-5 rounded-2xl border border-slate-600">
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">
                  {formatCurrency(futureCarCost)}
                </div>
                <div className="text-slate-300 text-xs font-medium uppercase tracking-wider">Required Car Fund</div>
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
                {downPaymentPercent < 100 && (
                  <div className="flex justify-between items-center text-sm pt-3 border-t border-slate-600/40">
                    <span className="text-slate-300">Est. Loan EMI ({autoLoanTenureYears}y)</span>
                    <span className="font-semibold text-rose-400">{formatCurrency(loanEmi)}</span>
                  </div>
                )}
              </div>

              <button className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2">
                Start Car Planning <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Informational SEO & FAQs Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-slate-200">
          <div className="md:col-span-2 space-y-8 text-slate-700 text-sm md:text-base leading-relaxed">
            <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Planning Your First Car Purchase</h2>
              <p className="text-slate-600 mb-4">
                Owning a car transforms daily life in meaningful ways. Beyond being a mode of transportation, it provides independence, convenience, and flexibility in managing your daily schedule. Whether it's commuting to work, handling daily tasks, or exploring new destinations, a personal vehicle enhances your mobility and lifestyle quality.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Essential Financial Planning Steps</h3>
              <p className="text-slate-600 mb-4">
                The journey to car ownership begins with understanding your financial capacity. Start by evaluating your complete budget, including not just the purchase price but also ongoing expenses. Consider insurance premiums, fuel costs, regular maintenance, and potential repairs when determining your budget ceiling. This comprehensive approach ensures a sustainable financial commitment.
              </p>
              <p className="text-slate-600 mb-6">
                Explore various financing options available in the market. Research different loan providers, compare interest rates, and understand the terms and conditions thoroughly before making a decision.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Key Considerations for First-Time Buyers</h3>
              <ul className="list-disc pl-5 space-y-2 text-slate-600 mb-6">
                <li><strong>Financial Assessment:</strong> Evaluate your monthly budget capacity and determine a comfortable down payment amount</li>
                <li><strong>Usage Pattern:</strong> Define your primary vehicle requirements - whether it's for daily commuting, family use, or occasional travel</li>
                <li><strong>Financial Strategy:</strong> Review and compare different payment options, from full payment to structured loan plans</li>
                <li><strong>Long-term Costs:</strong> Factor in recurring expenses and maintenance requirements for sustainable ownership</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Understanding Our Calculator</h3>
              <p className="text-slate-600 mb-4">
                Our First Car Calculator is designed to help you plan your investment strategy effectively. By analyzing factors such as investment duration, monthly contribution capacity, and expected returns, it provides a clear roadmap to achieve your car ownership goal.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Calculator Benefits</h3>
              <p className="text-slate-600">
                This tool empowers you with practical insights for your car purchase journey. It helps you understand the required investment amount, estimates the timeline based on market returns, and enables you to adjust your savings strategy accordingly. With this information, you can make well-informed decisions about your car purchase timeline and investment approach.
              </p>
            </section>

            <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-2xl font-bold text-[#113262]">Frequently Asked Questions</h2>

              <div className="border-b border-slate-100 pb-5">
                <h3 className="font-bold text-slate-900 mb-2">How much should I save for my first car?</h3>
                <p className="text-slate-600 text-base">
                  Plan for at least 30-40% of the car's on-road price as a down payment to reduce the loan burden. For a Rs 8 lakh car, save Rs 2.4-3.2 lakh. Also budget for insurance (Rs 15,000-40,000 annually), registration, and accessories. Avoid zero down payment schemes as they mean higher EMIs and more interest.
                </p>
              </div>

              <div className="border-b border-slate-100 pb-5">
                <h3 className="font-bold text-slate-900 mb-2">Is it better to buy a car on loan or save and pay cash?</h3>
                <p className="text-slate-600 text-base">
                  Paying cash avoids 8.5-12% loan interest, but waiting too long means missing the utility of the car. A middle approach: save for 1-2 years to build a 40-50% down payment, then take a short-tenure loan (3 years) for the rest. This keeps the total interest cost manageable.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-2">What is the total cost of car ownership?</h3>
                <p className="text-slate-600 text-base">
                  Beyond the purchase price, budget for loan EMI and interest, insurance (Rs 15,000-40,000/year), fuel (Rs 5,000-15,000/month), servicing and maintenance (Rs 10,000-20,000/year), parking, tolls, and depreciation. A car loses 15-20% of its value in the first year and 40-50% in 5 years.
                </p>
              </div>
            </section>
          </div>

          {/* Right Column: SEO Card */}
          <div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-lg">Planning Your First Car Purchase</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Enter the car's on-road price, your target down payment percentage, and when you plan to buy. The calculator shows the monthly savings needed for the down payment and the EMI for the remaining amount. It also estimates the total cost of ownership over 5 years including insurance, fuel, and maintenance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

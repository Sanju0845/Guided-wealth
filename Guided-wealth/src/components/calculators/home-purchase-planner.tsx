import React, { useState, useEffect } from 'react';
import { CurrencyInput } from '../ui/CurrencyInput';
import { Share2, ChevronDown, ChevronUp, Home, Calendar, TrendingUp, Sliders, FileText } from 'lucide-react';

export default function HomePurchasePlanner() {
  // Input States
  const [targetAmount, setTargetAmount] = useState<number>(10000000);
  const [yearsToBuy, setYearsToBuy] = useState<number>(3);
  const [currentSavings, setCurrentSavings] = useState<number>(0);
  const [expectedReturns, setExpectedReturns] = useState<number>(12);

  // Additional Settings
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [inflationRate, setInflationRate] = useState<number>(6);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [homeLoanInterest, setHomeLoanInterest] = useState<number>(8.5);
  const [homeLoanTenureYears, setHomeLoanTenureYears] = useState<number>(20);

  // Computed Outputs
  const [futureHomePrice, setFutureHomePrice] = useState<number>(0);
  const [fvCurrentSavings, setFvCurrentSavings] = useState<number>(0);
  const [requiredHomeFund, setRequiredHomeFund] = useState<number>(0);
  const [netRequiredFund, setNetRequiredFund] = useState<number>(0);
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(0);
  const [yearlyInvestment, setYearlyInvestment] = useState<number>(0);
  const [oneTimeInvestment, setOneTimeInvestment] = useState<number>(0);
  const [loanEmi, setLoanEmi] = useState<number>(0);

  useEffect(() => {
    // Inflation adjusted future home price
    const fvPrice = Math.round(targetAmount * Math.pow(1 + inflationRate / 100, yearsToBuy));

    // Future value of current savings
    const fvSavings = Math.round(currentSavings * Math.pow(1 + expectedReturns / 100, yearsToBuy));

    // Required down payment + registration fund
    const reqFund = Math.round(fvPrice * (downPaymentPercent / 100));
    const netReq = Math.max(0, reqFund - fvSavings);

    // Monthly SIP required calculation for down payment
    const r = expectedReturns / 12 / 100;
    const n = yearsToBuy * 12;
    let sip = 0;
    if (r > 0 && n > 0 && netReq > 0) {
      sip = Math.round((netReq * r) / ((1 + r) * (Math.pow(1 + r, n) - 1)));
    }

    const yearly = sip * 12;
    const lump = Math.round(netReq / Math.pow(1 + expectedReturns / 100, yearsToBuy));

    // Home Loan EMI on remaining amount
    const loanAmt = fvPrice - reqFund;
    const lr = homeLoanInterest / 12 / 100;
    const ln = homeLoanTenureYears * 12;
    let emi = 0;
    if (lr > 0 && ln > 0 && loanAmt > 0) {
      emi = Math.round((loanAmt * lr * Math.pow(1 + lr, ln)) / (Math.pow(1 + lr, ln) - 1));
    }

    setFutureHomePrice(fvPrice);
    setFvCurrentSavings(fvSavings);
    setRequiredHomeFund(reqFund);
    setNetRequiredFund(netReq);
    setMonthlyInvestment(sip);
    setYearlyInvestment(yearly);
    setOneTimeInvestment(lump);
    setLoanEmi(emi);
  }, [
    targetAmount,
    yearsToBuy,
    currentSavings,
    expectedReturns,
    inflationRate,
    downPaymentPercent,
    homeLoanInterest,
    homeLoanTenureYears,
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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">First Home Planner</h1>
        <p className="text-slate-600 text-base">
          Secure your dream home with Home Goal Calculator
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Grid */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Inputs Column */}
          <div className="flex-1 space-y-6">
            {/* Home Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Home className="w-5 h-5 text-blue-600" /> Home Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Target Amount (Home Price)</label>
                    <CurrencyInput
                    value={targetAmount}
                    onValueChange={(val) => setTargetAmount(val)}
                  />
                  </div>
                  <input
                    type="range"
                    min="1000000"
                    max="50000000"
                    step="500000"
                    value={targetAmount}
                    onChange={(e) => setTargetAmount(Number(e.target.value))}

                    style={getSliderStyle(targetAmount, "1000000", "50000000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>₹10 Lakhs</span>
                    <span>₹5 Cr</span>
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
                    max="20"
                    step="1"
                    value={yearsToBuy}
                    onChange={(e) => setYearsToBuy(Number(e.target.value))}

                    style={getSliderStyle(yearsToBuy, "1", "20")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>1 year</span>
                    <span>20 years</span>
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
                  <Sliders className="w-5 h-5 text-blue-600" /> Additional Settings (Down Payment & Home Loan)
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
                      max="50"
                      value={downPaymentPercent}
                      onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Home Loan Interest Rate (%)</label>
                    <CurrencyInput
                    value={homeLoanInterest}
                    onValueChange={(val) => setHomeLoanInterest(val)}
                  />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Home Loan Tenure (Years)</label>
                    <CurrencyInput
                    value={homeLoanTenureYears}
                    onValueChange={(val) => setHomeLoanTenureYears(val)}
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
                <h2 className="text-xl font-bold tracking-tight">Home Fund Summary</h2>
                <button className="text-slate-400 hover:text-white transition-colors p-1" title="Share">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-8 bg-slate-800/80 p-5 rounded-2xl border border-slate-600">
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">
                  {formatCurrency(futureHomePrice)}
                </div>
                <div className="text-slate-300 text-xs font-medium uppercase tracking-wider">Required Home Fund</div>
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
                <div className="flex justify-between items-center text-sm pt-3 border-t border-slate-600/40">
                  <span className="text-slate-300">Est. Home Loan EMI</span>
                  <span className="font-semibold text-rose-400">{formatCurrency(loanEmi)}</span>
                </div>
              </div>

              <button className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2">
                Start Home Planning <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Informational SEO & FAQs Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-slate-200">
          <div className="md:col-span-2 space-y-8 text-slate-700 text-sm md:text-base leading-relaxed">
            <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Planning Your Dream Home Journey</h2>
              <p className="text-slate-600 mb-4">
                Owning a home is more than just a financial decision - it's about creating a space for your future. Smart planning and systematic saving can turn this dream into reality. Understanding your needs, financial capacity, and market conditions is crucial for making informed decisions.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Essential Planning Steps</h3>
              <div className="space-y-3 text-slate-600 mb-6">
                <div>
                  <h4 className="font-bold text-slate-800">Budget Assessment</h4>
                  <p className="text-sm">Begin by evaluating your financial capacity, including current income, expenses, and potential for future earnings. Consider factors like location preferences, property type, and additional costs such as maintenance and taxes.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Family Requirements</h4>
                  <p className="text-sm">Your home should accommodate both current and future needs. Consider aspects like number of bedrooms, proximity to schools or workplace, and community facilities that align with your lifestyle.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800">Investment Planning</h4>
                  <p className="text-sm">Create a robust investment strategy using a mix of financial instruments. Regular investments in mutual funds, fixed deposits, and other vehicles can help accumulate the required corpus systematically.</p>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Documentation Checklist</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-600 mb-6 text-sm">
                <div>
                  <h4 className="font-bold text-slate-800 mb-1">Personal Documents</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Valid ID proof (Aadhaar/Passport)</li>
                    <li>PAN Card</li>
                    <li>Income proof (Salary slips, Form 16)</li>
                    <li>Bank statements (6 months)</li>
                    <li>Address proof</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 mb-1">Property Documents</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Property ownership documents</li>
                    <li>NOC from housing society</li>
                    <li>Building approval plan</li>
                    <li>Property tax receipts</li>
                    <li>Occupancy certificate</li>
                  </ul>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Calculator Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-600 text-sm">
                <div>
                  <h4 className="font-bold text-slate-800 mb-1">How It Works</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Comprehensive financial modeling</li>
                    <li>Factors in property value appreciation</li>
                    <li>Consistent inflation impact</li>
                    <li>Accounts for investment returns</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 mb-1">Key Benefits</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Clear monthly saving targets</li>
                    <li>Multiple investment options</li>
                    <li>Real-time goal tracking</li>
                    <li>Inflation-adjusted projections</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-2xl font-bold text-[#113262]">Frequently Asked Questions</h2>

              <div className="border-b border-slate-100 pb-5">
                <h3 className="font-bold text-slate-900 mb-2">How much should I save for a house down payment?</h3>
                <p className="text-slate-600 text-base">
                  Banks require 10-25% down payment for home loans. For a Rs 80 lakh property, you need Rs 8-20 lakh as down payment plus Rs 5-8 lakh for registration, stamp duty, and interior work. Aim for 20% down payment to get better loan terms and keep EMIs manageable.
                </p>
              </div>

              <div className="border-b border-slate-100 pb-5">
                <h3 className="font-bold text-slate-900 mb-2">When should I start saving for a home?</h3>
                <p className="text-slate-600 text-base">
                  Start at least 3-5 years before you plan to buy. For a Rs 15 lakh down payment in 5 years, you need approximately Rs 20,000-22,000 per month in a balanced or debt fund (safer than pure equity for a 5-year goal). Starting earlier allows you to invest in equity for better returns.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-2">Should I rent or buy a house in India?</h3>
                <p className="text-slate-600 text-base">
                  Compare the rental yield (annual rent / property price) with your investment returns. If rental yield is 2-3% (common in Indian metros) and you can earn 10-12% on investments, renting and investing the difference often builds more wealth. Buying makes sense when rental yields exceed 4% or if you plan to stay 10+ years.
                </p>
              </div>
            </section>
          </div>

          {/* Right Column: SEO Card */}
          <div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-lg">Planning Your Home Purchase</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Enter the property price, target down payment percentage, planned purchase date, and current savings. The calculator shows the monthly SIP needed for the down payment and estimates total purchase costs including stamp duty, registration, and interiors. It also shows the post-purchase EMI based on your likely home loan terms.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

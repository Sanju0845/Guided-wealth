import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp, Plane, Calendar, TrendingUp, DollarSign, Sliders, Globe } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

export default function VacationGoalPlanner() {
  // Input States
  const [travelCost, setTravelCost] = useState<number>(1000000);
  const [yearsToTravel, setYearsToTravel] = useState<number>(3);
  const [currentSavings, setCurrentSavings] = useState<number>(0);
  const [expectedReturns, setExpectedReturns] = useState<number>(12);

  // Additional Settings
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [travelInflationRate, setTravelInflationRate] = useState<number>(6);

  // Computed Outputs
  const [futureTravelCost, setFutureTravelCost] = useState<number>(0);
  const [fvCurrentSavings, setFvCurrentSavings] = useState<number>(0);
  const [netRequiredCorpus, setNetRequiredCorpus] = useState<number>(0);
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(0);
  const [yearlyInvestment, setYearlyInvestment] = useState<number>(0);
  const [oneTimeInvestment, setOneTimeInvestment] = useState<number>(0);

  useEffect(() => {
    // Inflation adjusted future travel cost
    const fvCost = Math.round(travelCost * Math.pow(1 + travelInflationRate / 100, yearsToTravel));

    // Future value of current savings
    const fvSavings = Math.round(currentSavings * Math.pow(1 + expectedReturns / 100, yearsToTravel));

    // Net required corpus
    const netReq = Math.max(0, fvCost - fvSavings);

    // Monthly SIP required calculation
    const r = expectedReturns / 12 / 100;
    const n = yearsToTravel * 12;
    let sip = 0;
    if (r > 0 && n > 0 && netReq > 0) {
      sip = Math.round((netReq * r) / ((1 + r) * (Math.pow(1 + r, n) - 1)));
    }

    const yearly = sip * 12;
    const lump = Math.round(netReq / Math.pow(1 + expectedReturns / 100, yearsToTravel));

    setFutureTravelCost(fvCost);
    setFvCurrentSavings(fvSavings);
    setNetRequiredCorpus(netReq);
    setMonthlyInvestment(sip);
    setYearlyInvestment(yearly);
    setOneTimeInvestment(lump);
  }, [
    travelCost,
    yearsToTravel,
    currentSavings,
    expectedReturns,
    travelInflationRate,
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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Vacation Goal Planner</h1>
        <p className="text-slate-600 text-base">
          Become a Jetsetter with Overseas Vacation Goal Calculator
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Grid */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Inputs Column */}
          <div className="flex-1 space-y-6">
            {/* Vacation Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Plane className="w-5 h-5 text-blue-600" /> Vacation Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Travel Cost (Today)</label>
                    <CurrencyInput
                    value={travelCost}
                    onValueChange={(val) => setTravelCost(val)}
                  />
                  </div>
                  <input
                    type="range"
                    min="50000"
                    max="5000000"
                    step="25000"
                    value={travelCost}
                    onChange={(e) => setTravelCost(Number(e.target.value))}

                    style={getSliderStyle(travelCost, "50000", "5000000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>₹50,000</span>
                    <span>₹50 Lakhs</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Years to Travel</label>
                    <span className="text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-300">
                      {yearsToTravel} Yrs
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={yearsToTravel}
                    onChange={(e) => setYearsToTravel(Number(e.target.value))}

                    style={getSliderStyle(yearsToTravel, "1", "10")}
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
                  <Sliders className="w-5 h-5 text-blue-600" /> Additional Settings (Inflation Rate)
                </span>
                {showAdvanced ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
              </button>

              {showAdvanced && (
                <div className="p-6 pt-0 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Travel Inflation Rate (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="12"
                      value={travelInflationRate}
                      onChange={(e) => setTravelInflationRate(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-600"
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
                <h2 className="text-xl font-bold tracking-tight">Vacation Fund Summary</h2>
                <button className="text-slate-400 hover:text-white transition-colors p-1" title="Share">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-8 bg-slate-800/80 p-5 rounded-2xl border border-slate-600">
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">
                  {formatCurrency(futureTravelCost)}
                </div>
                <div className="text-slate-300 text-xs font-medium uppercase tracking-wider">Required Vacation Fund</div>
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
              <h2 className="text-xl font-bold text-[#113262] mb-4">Planning Your Overseas Adventure</h2>
              <p className="text-slate-600 mb-4">
                Discover the essentials of planning and financing your dream international vacation.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Essential Steps for Planning Your Overseas Trip</h3>
              <p className="text-slate-600 mb-4">
                Planning an international vacation requires careful consideration of several key factors. Begin by selecting your desired destination and creating a comprehensive itinerary that aligns with your interests and travel style. Research local customs, weather patterns, and peak tourist seasons to determine the optimal time for your visit. Consider practical aspects such as accommodation preferences, transportation options, and must-see attractions. This early planning phase helps establish a realistic budget and timeline for your journey. Remember to account for pre-trip preparations, including passport renewal if needed, visa applications, and health requirements like vaccinations. Early planning allows you to take advantage of better travel deals and ensures a smoother travel experience.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Travel Documentation Essentials</h3>
              <p className="text-slate-600 mb-4">
                International travel requires specific documentation that varies by destination. Key requirements typically include: • A valid passport with sufficient validity beyond your planned return date • Necessary visas or travel permits for your destination • Travel insurance documentation • International driving permit (if planning to drive) • Vaccination certificates or health records • Copies of important documents stored separately. Check your destination country's specific entry requirements well in advance, as processing times for certain documents can take several weeks.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Strategic Investment for Travel Goals</h3>
              <p className="text-slate-600 mb-4">
                Smart investment strategies can transform your travel dreams into reality. A well-planned investment approach offers several advantages: • Protection against inflation's impact on travel costs • Potential for higher returns compared to traditional savings • Flexibility to adjust your investment timeline • Opportunity to build a dedicated travel fund By starting early and investing regularly, you can build a substantial travel fund while potentially earning returns that outpace inflation.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Investment Options for Travel Planning</h3>
              <p className="text-slate-600 mb-4">
                Consider these investment approaches to fund your overseas vacation: 1. Regular Investment Plans – Set up automatic monthly investments • Choose from various mutual fund options • Build discipline in saving for your goal 2. Short-Term Investment Solutions – Liquid funds for easy access to money • Low-risk options for near-term travel plans • Flexible withdrawal options 3. Balanced Investment Strategies – Mix of equity and debt investments • Potential for higher returns with managed risk • Suitable for longer-term travel planning 4. Goal-Based Investment Plans – Customized to your travel timeline • Regular monitoring and rebalancing • Aligned with your risk tolerance
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Understanding Our Vacation Calculator</h3>
              <p className="text-slate-600 mb-4">
                Our Overseas Vacation Calculator helps you plan financially for your dream trip by: • Calculating required savings based on your travel timeline • Factoring in inflation's impact on future travel costs • Considering your current savings and investment returns • Providing monthly, yearly, and one-time investment options The calculator uses advanced financial formulas to account for compound interest, inflation adjustments, and your investment horizon, helping you create a realistic savings plan.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Benefits of Financial Planning for Travel</h3>
              <p className="text-slate-600">
                Using our calculator for travel planning offers numerous advantages: • Creates a clear financial roadmap to your travel goal • Helps avoid last-minute financial stress • Enables better budgeting and expense tracking • Provides realistic investment targets • Adjusts for changing market conditions • Allows for flexible planning based on your timeline By planning ahead financially, you can focus on enjoying your trip rather than worrying about expenses.
              </p>
            </section>

            <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-2xl font-bold text-[#113262]">Frequently Asked Questions</h2>

              <div className="border-b border-slate-100 pb-5">
                <h3 className="font-bold text-slate-900 mb-2">How much does an overseas vacation cost from India?</h3>
                <p className="text-slate-600 text-base">
                  Southeast Asia: Rs 50,000-1.5 lakh per person (5-7 days). Europe: Rs 1.5-4 lakh per person (10-14 days). USA/Australia: Rs 2-5 lakh per person (10-14 days). Costs include flights, hotels, visa, meals, sightseeing, and shopping. Early booking and off-season travel can reduce costs by 20-30%.
                </p>
              </div>

              <div className="border-b border-slate-100 pb-5">
                <h3 className="font-bold text-slate-900 mb-2">How far in advance should I save for a foreign trip?</h3>
                <p className="text-slate-600 text-base">
                  Start saving 6-12 months in advance. For a Rs 3 lakh trip in 12 months, you need to set aside Rs 25,000 per month in a liquid or ultra-short-term debt fund. For longer planning horizons (18-36 months), a balanced fund SIP works well. Avoid forex volatility by buying some foreign currency 2-3 months before travel.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-2">How should I manage foreign exchange for travel?</h3>
                <p className="text-slate-600 text-base">
                  Use a combination: forex card (best rate, safe, accepted globally), some cash in local currency for tips and small vendors, and a debit/credit card with low forex markup (1.5-3.5%) as backup. Buy forex in tranches over 2-3 months to average out exchange rate fluctuations.
                </p>
              </div>
            </section>
          </div>

          {/* Right Column: SEO Card */}
          <div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-lg">Plan Your Dream Vacation</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Select your destination, travel dates, number of travellers, and accommodation preference. The calculator estimates the total trip cost including flights, hotels, visa, meals, and sightseeing. It then shows the monthly savings needed to fund the trip and suggests the best time to start booking for maximum savings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

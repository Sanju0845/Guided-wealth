import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp, Heart, Calendar, DollarSign, TrendingUp, Sliders } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

export default function DreamWeddingFund() {
  // Input States
  const [weddingCostToday, setWeddingCostToday] = useState<number>(500000);
  const [yearsToWedding, setYearsToWedding] = useState<number>(3);
  const [currentSavings, setCurrentSavings] = useState<number>(0);
  const [expectedReturns, setExpectedReturns] = useState<number>(12);

  // Additional Settings
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [inflationRate, setInflationRate] = useState<number>(6);
  const [stepUpIncrementPercent, setStepUpIncrementPercent] = useState<number>(10);

  // Computed Outputs
  const [futureWeddingCost, setFutureWeddingCost] = useState<number>(0);
  const [fvCurrentSavings, setFvCurrentSavings] = useState<number>(0);
  const [netRequiredCorpus, setNetRequiredCorpus] = useState<number>(0);
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(0);
  const [yearlyInvestment, setYearlyInvestment] = useState<number>(0);
  const [oneTimeInvestment, setOneTimeInvestment] = useState<number>(0);

  useEffect(() => {
    // Inflation adjusted future wedding cost
    const fvCost = Math.round(weddingCostToday * Math.pow(1 + inflationRate / 100, yearsToWedding));

    // Future value of current savings
    const fvSavings = Math.round(currentSavings * Math.pow(1 + expectedReturns / 100, yearsToWedding));

    // Net required corpus to save
    const netReq = Math.max(0, fvCost - fvSavings);

    // Monthly SIP required calculation
    const r = expectedReturns / 12 / 100;
    const n = yearsToWedding * 12;
    let sip = 0;
    if (r > 0 && n > 0 && netReq > 0) {
      sip = Math.round((netReq * r) / ((1 + r) * (Math.pow(1 + r, n) - 1)));
    }

    const yearly = sip * 12;
    const lump = Math.round(netReq / Math.pow(1 + expectedReturns / 100, yearsToWedding));

    setFutureWeddingCost(fvCost);
    setFvCurrentSavings(fvSavings);
    setNetRequiredCorpus(netReq);
    setMonthlyInvestment(sip);
    setYearlyInvestment(yearly);
    setOneTimeInvestment(lump);
  }, [
    weddingCostToday,
    yearsToWedding,
    currentSavings,
    expectedReturns,
    inflationRate,
    stepUpIncrementPercent,
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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Dream Wedding Fund</h1>
        <p className="text-slate-600 text-base">
          Plan a memorable wedding with Dream Wedding Fund Calculator
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Grid */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Inputs Column */}
          <div className="flex-1 space-y-6">
            {/* Wedding Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Heart className="w-5 h-5 text-rose-500" /> Wedding Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Wedding Cost (Today)</label>
                    <CurrencyInput
                    value={weddingCostToday}
                    onValueChange={(val) => setWeddingCostToday(val)}
                  />
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="10000000"
                    step="50000"
                    value={weddingCostToday}
                    onChange={(e) => setWeddingCostToday(Number(e.target.value))}

                    style={getSliderStyle(weddingCostToday, "100000", "10000000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>₹1 Lakh</span>
                    <span>₹1 Cr</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Years to Wedding</label>
                    <span className="text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-300">
                      {yearsToWedding} Yrs
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="1"
                    value={yearsToWedding}
                    onChange={(e) => setYearsToWedding(Number(e.target.value))}

                    style={getSliderStyle(yearsToWedding, "1", "15")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>1 year</span>
                    <span>15 years</span>
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
                    step="25000"
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
                  <Sliders className="w-5 h-5 text-blue-600" /> Additional Settings (Inflation & Step-up)
                </span>
                {showAdvanced ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
              </button>

              {showAdvanced && (
                <div className="p-6 pt-0 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Expected Wedding Inflation Rate (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="0"
                      max="15"
                      value={inflationRate}
                      onChange={(e) => setInflationRate(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Annual Step-up Increment (%)</label>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      max="25"
                      value={stepUpIncrementPercent}
                      onChange={(e) => setStepUpIncrementPercent(Number(e.target.value))}
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
                <h2 className="text-xl font-bold tracking-tight">Wedding Fund Summary</h2>
                <button className="text-slate-400 hover:text-white transition-colors p-1" title="Share">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-8 bg-slate-800/80 p-5 rounded-2xl border border-slate-600">
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">
                  {formatCurrency(futureWeddingCost)}
                </div>
                <div className="text-slate-300 text-xs font-medium uppercase tracking-wider">Required Wedding Fund</div>
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
                <div className="flex justify-between items-center text-sm pt-3 border-t border-slate-600/40">
                  <span className="text-slate-300">One Time Investment</span>
                  <span className="font-semibold text-white">{formatCurrency(oneTimeInvestment)}</span>
                </div>
              </div>

              <button className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2">
                Start Wedding Planning <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Informational SEO & FAQs Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-slate-200">
          <div className="md:col-span-2 space-y-8 text-slate-700 text-sm md:text-base leading-relaxed">
            <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Understanding Wedding Investment Planning</h2>
              <p className="text-slate-600 mb-4">
                Creating a wedding investment strategy helps transform your dream celebration into reality. By developing a structured financial approach, you can ensure your special day unfolds exactly as envisioned while maintaining financial prudence.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Benefits of Early Wedding Investment</h3>
              <p className="text-slate-600 mb-4">
                Starting your wedding investment journey early provides numerous advantages. It offers greater flexibility in choosing venues, vendors, and experiences while reducing financial stress. Whether you're planning an intimate gathering or a grand celebration, proper financial preparation ensures you can create lasting memories without compromise.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Strategic Wedding Planning Steps</h3>
              <p className="text-slate-600 mb-2">
                Begin by establishing clear financial objectives and creating a detailed budget that aligns with your vision. Consider key factors such as guest count, venue preferences, and whether you're dreaming of a destination or local celebration.
              </p>

              <p className="font-medium text-slate-800 mb-2">Important considerations include:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600 mb-4">
                <li>Determining your ideal wedding style and location</li>
                <li>Setting a realistic guest count and venue capacity</li>
                <li>Planning for both essential and discretionary expenses</li>
                <li>Creating a systematic investment schedule</li>
              </ul>

              <p className="text-slate-600">
                Regular monitoring and adjustment of your investment strategy ensures you stay on track to achieve your wedding goals while maintaining financial stability.
              </p>
            </section>

            <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-2xl font-bold text-[#113262]">Frequently Asked Questions</h2>

              <div className="border-b border-slate-100 pb-5">
                <h3 className="font-bold text-slate-900 mb-2">How do I budget for my own wedding?</h3>
                <p className="text-slate-600 text-base">
                  List all wedding expenses: venue (20-30% of budget), catering and food (15-25%), jewellery and clothing (15-20%), photography and decor (10-15%), entertainment and music (5-10%), and miscellaneous (10%). Always keep a 10-15% contingency buffer. Start saving via SIPs at least 2-3 years before the planned date.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-2">Should I take a loan for my wedding?</h3>
                <p className="text-slate-600 text-base">
                  Avoid wedding loans if possible. Start an SIP 2-3 years before the wedding to build a corpus. If you must borrow, use a gold loan (lower interest at 10-12%) rather than a personal loan (14-20%). Keep borrowed amounts to under 30% of the total wedding cost.
                </p>
              </div>
            </section>
          </div>

          {/* Right Column: SEO Card */}
          <div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-lg">Plan Your Wedding Finances</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Enter your target wedding budget, planned wedding date, and current savings. The calculator shows the monthly SIP needed to bridge the gap and breaks down the budget across major expense categories. It helps you set realistic targets and track your savings progress toward the big day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

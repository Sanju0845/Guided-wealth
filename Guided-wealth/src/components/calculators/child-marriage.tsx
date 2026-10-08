import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp, Target, TrendingUp, ShieldCheck, DollarSign } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

export default function ChildMarriage() {
  const [weddingCostToday, setWeddingCostToday] = useState<number>(1000000);
  const [yearsToWedding, setYearsToWedding] = useState<number>(5);
  const [expectedReturns, setExpectedReturns] = useState<number>(12);
  const [expectedInflation, setExpectedInflation] = useState<number>(6);

  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const [requiredCorpus, setRequiredCorpus] = useState<number>(0);
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(0);
  const [yearlyInvestment, setYearlyInvestment] = useState<number>(0);
  const [oneTimeInvestment, setOneTimeInvestment] = useState<number>(0);

  useEffect(() => {
    if (weddingCostToday <= 0 || yearsToWedding <= 0) {
      setRequiredCorpus(0);
      setMonthlyInvestment(0);
      setYearlyInvestment(0);
      setOneTimeInvestment(0);
      return;
    }

    // Future cost of wedding with inflation
    const fvCost = weddingCostToday * Math.pow(1 + expectedInflation / 100, yearsToWedding);

    // One time investment required today
    const lumpsum = fvCost / Math.pow(1 + expectedReturns / 100, yearsToWedding);

    // Monthly SIP required
    const r = expectedReturns / 100 / 12;
    const months = yearsToWedding * 12;
    let monthlySip = 0;
    if (r > 0) {
      monthlySip = fvCost / (((Math.pow(1 + r, months) - 1) / r) * (1 + r));
    } else {
      monthlySip = fvCost / months;
    }

    setRequiredCorpus(fvCost);
    setOneTimeInvestment(lumpsum);
    setMonthlyInvestment(monthlySip);
    setYearlyInvestment(monthlySip * 12);
  }, [weddingCostToday, yearsToWedding, expectedReturns, expectedInflation]);

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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Child Marriage Calculator</h1>
        <p className="text-slate-600 text-base">Plan your investments for your child's wedding expenses</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Inputs Column */}
          <div className="flex-1 space-y-6">
            {/* Wedding Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Wedding Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Wedding Cost (Today)</label>
                  <CurrencyInput
                    value={weddingCostToday}
                    onValueChange={(val) => setWeddingCostToday(val)}
                  />
                  <div>
                    <input
                      type="range"
                      min="100000"
                      max="10000000"
                      step="100000"
                      value={weddingCostToday}
                      onChange={(e) => setWeddingCostToday(Number(e.target.value))}

                      style={getSliderStyle(weddingCostToday, "100000", "10000000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>₹1 Lakh</span>
                      <span>₹1 Crore</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Years to Wedding</label>
                    <span className="text-sm font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">{yearsToWedding} Yr</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={yearsToWedding}
                    onChange={(e) => setYearsToWedding(Number(e.target.value))}

                    style={getSliderStyle(yearsToWedding, "1", "30")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>1 year</span>
                    <span>30 years</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Assumptions */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Financial Assumptions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Expected Returns (%)</label>
                    <span className="text-sm font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">{expectedReturns}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="0.5"
                    value={expectedReturns}
                    onChange={(e) => setExpectedReturns(Number(e.target.value))}

                    style={getSliderStyle(expectedReturns, "0", "20")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Expected Inflation (%)</label>
                    <span className="text-sm font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">{expectedInflation}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="0.5"
                    value={expectedInflation}
                    onChange={(e) => setExpectedInflation(Number(e.target.value))}

                    style={getSliderStyle(expectedInflation, "0", "20")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>
              </div>
            </div>

            {/* Advanced Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full p-6 flex justify-between items-center font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <span>Advanced Settings</span>
                {showAdvanced ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
              </button>

              {showAdvanced && (
                <div className="p-6 pt-0 border-t border-slate-100 mt-4 text-xs text-slate-500">
                  Wedding inflation in India (venue, jewellery, catering) historically runs between 8% to 10% per year.
                </div>
              )}
            </div>
          </div>

          {/* Results Sidebar */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-[#1e2a4f] rounded-2xl shadow-xl p-6 md:p-8 text-white h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-bold tracking-tight">Your Child's Wedding</h2>
                  <button className="text-slate-400 hover:text-white transition-colors" title="Share">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-8">
                  <div className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-1">
                    {formatCurrency(requiredCorpus)}
                  </div>
                  <div className="text-slate-300 text-sm font-medium">Required Amount (inflation adjusted)</div>
                </div>

                <div className="space-y-4 border-t border-slate-600/60 pt-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Monthly Investment</span>
                    <span className="font-semibold text-emerald-400">{formatCurrency(monthlyInvestment)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Yearly Investment</span>
                    <span className="font-semibold text-white">{formatCurrency(yearlyInvestment)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-600/40">
                    <span className="text-slate-300">One Time Investment</span>
                    <span className="font-semibold text-white">{formatCurrency(oneTimeInvestment)}</span>
                  </div>
                </div>
              </div>

              <button className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2">
                Get Started <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="my-12">
          <h2 className="text-2xl font-bold text-[#113262] text-center mb-8">Strategic Planning for Your Child's Wedding</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-[#113262] mb-2">Financial Assessment</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Begin with a comprehensive financial assessment to determine your target savings goal. Consider factors like venue, guest count, and celebration style.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-[#113262] mb-2">Investment Strategy</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Choose appropriate investment vehicles for your wedding fund. Options include dedicated savings accounts or equity SIPs for long timelines.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-[#113262] mb-2">Strategic Planning</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Develop a structured monthly savings plan. Analyze current expenses to identify areas where you can optimize spending toward your goal.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="my-12">
          <h2 className="text-xl font-bold text-[#113262] mb-4">Benefits of Wedding Planning Calculator</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
              <div className="text-blue-600 flex justify-center mb-2"><Target className="w-6 h-6" /></div>
              <div className="text-xs font-semibold text-slate-800">Accurate projection of future wedding costs</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
              <div className="text-amber-500 flex justify-center mb-2"><DollarSign className="w-6 h-6" /></div>
              <div className="text-xs font-semibold text-slate-800">Customized savings strategies based on timeline</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
              <div className="text-emerald-500 flex justify-center mb-2"><TrendingUp className="w-6 h-6" /></div>
              <div className="text-xs font-semibold text-slate-800">Inflation-adjusted calculations</div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-slate-200 text-center">
              <div className="text-rose-500 flex justify-center mb-2"><ShieldCheck className="w-6 h-6" /></div>
              <div className="text-xs font-semibold text-slate-800">Clear monthly investment targets</div>
            </div>
          </div>
        </div>

        {/* Informational Section */}
        <div className="max-w-4xl space-y-12 text-slate-700 leading-relaxed">
          <section className="pt-6">
            <h2 className="text-xl font-bold text-[#113262] mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">How much does a wedding cost in India?</h3>
                <p className="text-sm text-slate-600">Indian weddings cost ₹5-15 Lakh for modest celebrations, ₹15-50 Lakh for mid-range weddings, and ₹50 Lakh to several crores for lavish affairs. Wedding inflation is approximately 8-10% annually.</p>
              </div>

              <div className="pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">How early should I start saving for my child's wedding?</h3>
                <p className="text-sm text-slate-600">Start when your child is young. If your child is 5 and you plan for a wedding at age 25, you have 20 years. To accumulate ₹50 Lakh in 20 years at 12% returns, you need approximately ₹5,500 per month.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

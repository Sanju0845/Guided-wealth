import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

export default function ChildEducation() {
  const [currentEducationCost, setCurrentEducationCost] = useState<number>(1000000);
  const [yearsToEducation, setYearsToEducation] = useState<number>(5);
  const [currentSavings, setCurrentSavings] = useState<number>(0);
  const [expectedReturns, setExpectedReturns] = useState<number>(12);
  const [educationInflation, setEducationInflation] = useState<number>(10);

  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const [totalEducationFundRequired, setTotalEducationFundRequired] = useState<number>(0);
  const [monthlyInvestment, setMonthlyInvestment] = useState<number>(0);
  const [lumpsumInvestment, setLumpsumInvestment] = useState<number>(0);

  useEffect(() => {
    if (currentEducationCost <= 0 || yearsToEducation <= 0) {
      setTotalEducationFundRequired(0);
      setMonthlyInvestment(0);
      setLumpsumInvestment(0);
      return;
    }

    // Future cost of education with education inflation
    const fvCost = currentEducationCost * Math.pow(1 + educationInflation / 100, yearsToEducation);

    // Future value of current savings
    const fvSavings = currentSavings * Math.pow(1 + expectedReturns / 100, yearsToEducation);

    const netFundRequired = Math.max(0, fvCost - fvSavings);

    // One-time lumpsum needed today
    const lumpsum = netFundRequired / Math.pow(1 + expectedReturns / 100, yearsToEducation);

    // Monthly SIP needed
    const r = expectedReturns / 100 / 12;
    const months = yearsToEducation * 12;
    let monthlySip = 0;
    if (r > 0) {
      monthlySip = netFundRequired / (((Math.pow(1 + r, months) - 1) / r) * (1 + r));
    } else {
      monthlySip = netFundRequired / months;
    }

    setTotalEducationFundRequired(fvCost);
    setLumpsumInvestment(lumpsum);
    setMonthlyInvestment(monthlySip);
  }, [currentEducationCost, yearsToEducation, currentSavings, expectedReturns, educationInflation]);

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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Child Education Planner</h1>
        <p className="text-slate-600 text-base">Fund Your Studies with Child Education Calculator</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Inputs Column */}
          <div className="flex-1 space-y-6">
            {/* Basic Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Basic Details</h2>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Current Education Cost</label>
                    <CurrencyInput
                    value={currentEducationCost}
                    onValueChange={(val) => setCurrentEducationCost(val)}
                  />
                    <div>
                      <input
                        type="range"
                        min="100000"
                        max="10000000"
                        step="100000"
                        value={currentEducationCost}
                        onChange={(e) => setCurrentEducationCost(Number(e.target.value))}

                        style={getSliderStyle(currentEducationCost, "100000", "10000000")}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-sm font-medium text-slate-700">Years to Education</label>
                      <span className="text-sm font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">{yearsToEducation} Yr</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="25"
                      step="1"
                      value={yearsToEducation}
                      onChange={(e) => setYearsToEducation(Number(e.target.value))}

                      style={getSliderStyle(yearsToEducation, "1", "25")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Current Savings</label>
                  <CurrencyInput
                    value={currentSavings}
                    onValueChange={(val) => setCurrentSavings(val)}
                  />
                  <div>
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
                  </div>
                </div>
              </div>
            </div>

            {/* Investment Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Investment Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Expected Returns (%)</label>
                    <span className="text-sm font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">{expectedReturns}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="0.5"
                    value={expectedReturns}
                    onChange={(e) => setExpectedReturns(Number(e.target.value))}

                    style={getSliderStyle(expectedReturns, "1", "20")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Education Inflation (%)</label>
                    <span className="text-sm font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">{educationInflation}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="0.5"
                    value={educationInflation}
                    onChange={(e) => setEducationInflation(Number(e.target.value))}

                    style={getSliderStyle(educationInflation, "1", "20")}
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
                  Education inflation in India typically runs at 10-12% annually, higher than general CPI inflation.
                </div>
              )}
            </div>
          </div>

          {/* Results Sidebar */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-[#1e2a4f] rounded-2xl shadow-xl p-6 md:p-8 text-white h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-bold tracking-tight">Education Fund Summary</h2>
                  <button className="text-slate-400 hover:text-white transition-colors" title="Share">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-8">
                  <div className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-1">
                    {formatCurrency(totalEducationFundRequired)}
                  </div>
                  <div className="text-slate-300 text-sm font-medium">Total Education Fund Required</div>
                </div>

                <div className="space-y-4 border-t border-slate-600/60 pt-6">
                  <div className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Investment Options</div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Monthly Investment</span>
                    <span className="font-semibold text-emerald-400">{formatCurrency(monthlyInvestment)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Lump Sum Investment</span>
                    <span className="font-semibold text-white">{formatCurrency(lumpsumInvestment)}</span>
                  </div>
                </div>
              </div>

              <button className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2">
                Start Education Planning <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Informational Section */}
        <div className="max-w-4xl space-y-12 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#113262] mb-4">Understanding Child Education Planning</h2>
            <p className="text-slate-600">
              Planning for your child's education is one of the most important financial decisions you'll make. A well-structured education plan ensures your child has access to quality education without compromising on their dreams or your financial stability.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">Key Benefits of Education Planning:</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Ensures financial readiness for your child's education.</li>
              <li>Helps manage rising education costs through early planning.</li>
              <li>Provides flexibility in choosing the best educational opportunities.</li>
              <li>Protects educational goals from financial uncertainties.</li>
            </ul>
          </section>

          <section className="pt-6">
            <h2 className="text-xl font-bold text-[#113262] mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">How much does child education cost in India?</h3>
                <p className="text-sm text-slate-600">School education (K-12) costs ₹1-5 Lakh per year at good private schools. Undergraduate engineering or medical costs ₹5-25 Lakh for 4-5 years. MBA at top B-schools costs ₹20-30 Lakh. Overseas education costs ₹30-80 Lakh including living expenses. Education inflation in India runs at 10-12% annually.</p>
              </div>

              <div className="pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">When should I start saving for my child's education?</h3>
                <p className="text-sm text-slate-600">Start immediately after the child is born. With 15 years of compounding, you need to invest much less monthly than if you start at age 10.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

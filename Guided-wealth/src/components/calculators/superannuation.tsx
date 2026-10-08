import React, { useState, useEffect } from 'react';
import { CurrencyInput } from '../ui/CurrencyInput';
import { Share2, ChevronDown, ChevronUp } from 'lucide-react';

interface ChartPoint {
  age: number;
  balance: number;
}

export default function Superannuation() {
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(60);
  const [currentBalance, setCurrentBalance] = useState<number>(500000);
  const [annualSalary, setAnnualSalary] = useState<number>(800000);
  const [employerContribPct, setEmployerContribPct] = useState<number>(10);
  const [personalContribPct, setPersonalContribPct] = useState<number>(5);

  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [expectedReturnRate, setExpectedReturnRate] = useState<number>(10);
  const [salaryGrowthRate, setSalaryGrowthRate] = useState<number>(5);

  const [projectedBalance, setProjectedBalance] = useState<number>(0);
  const [yearlyContribution, setYearlyContribution] = useState<number>(0);
  const [totalContributions, setTotalContributions] = useState<number>(0);
  const [investmentReturns, setInvestmentReturns] = useState<number>(0);
  const [progressionPoints, setProgressionPoints] = useState<ChartPoint[]>([]);

  useEffect(() => {
    if (retirementAge <= currentAge || annualSalary <= 0) {
      setProjectedBalance(0);
      setYearlyContribution(0);
      setTotalContributions(0);
      setInvestmentReturns(0);
      setProgressionPoints([]);
      return;
    }

    const years = retirementAge - currentAge;
    const totalContribPct = employerContribPct + personalContribPct;
    const initialYearlyContrib = annualSalary * (totalContribPct / 100);

    let balance = currentBalance;
    let accumulatedContribs = 0;
    let currentSalary = annualSalary;
    const points: ChartPoint[] = [{ age: currentAge, balance: currentBalance }];

    for (let y = 1; y <= years; y++) {
      const yearContrib = currentSalary * (totalContribPct / 100);
      accumulatedContribs += yearContrib;
      balance = (balance + yearContrib) * (1 + expectedReturnRate / 100);

      currentSalary *= (1 + salaryGrowthRate / 100);
      points.push({ age: currentAge + y, balance });
    }

    const returnsEarned = Math.max(0, balance - currentBalance - accumulatedContribs);

    setProjectedBalance(balance);
    setYearlyContribution(initialYearlyContrib);
    setTotalContributions(accumulatedContribs + currentBalance);
    setInvestmentReturns(returnsEarned);
    setProgressionPoints(points);
  }, [currentAge, retirementAge, currentBalance, annualSalary, employerContribPct, personalContribPct, expectedReturnRate, salaryGrowthRate]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // SVG Chart Calculation
  const maxBalance = progressionPoints.length > 0 ? Math.max(...progressionPoints.map(p => p.balance)) : 1;
  const svgWidth = 500;
  const svgHeight = 150;
  const chartPath = progressionPoints.map((p, idx) => {
    const x = (idx / Math.max(1, progressionPoints.length - 1)) * svgWidth;
    const y = svgHeight - (p.balance / maxBalance) * (svgHeight - 20) - 10;
    return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
  }).join(' ');
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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Superannuation Calculator</h1>
        <p className="text-slate-600 text-base">Plan your retirement with our superannuation calculator</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Inputs Column */}
          <div className="flex-1 space-y-6">
            {/* Age Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Age Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Current Age</label>
                    <span className="text-sm font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">{currentAge} Yr</span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="60"
                    step="1"
                    value={currentAge}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setCurrentAge(val);
                      if (val >= retirementAge) setRetirementAge(val + 1);
                    }}

                    style={getSliderStyle(currentAge, "18", "60")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>18 years</span>
                    <span>75 years</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Retirement Age</label>
                    <span className="text-sm font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">{retirementAge} Yr</span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="75"
                    step="1"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(Math.max(currentAge + 1, Number(e.target.value)))}

                    style={getSliderStyle(retirementAge, "40", "75")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>40 years</span>
                    <span>75 years</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Financial Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Financial Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Current Balance</label>
                  <CurrencyInput
                    value={currentBalance}
                    onValueChange={(val) => setCurrentBalance(val)}
                  />
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="10000000"
                      step="50000"
                      value={currentBalance}
                      onChange={(e) => setCurrentBalance(Number(e.target.value))}

                      style={getSliderStyle(currentBalance, "0", "10000000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Annual Salary</label>
                  <CurrencyInput
                    value={annualSalary}
                    onValueChange={(val) => setAnnualSalary(val)}
                  />
                  <div>
                    <input
                      type="range"
                      min="100000"
                      max="10000000"
                      step="50000"
                      value={annualSalary}
                      onChange={(e) => setAnnualSalary(Number(e.target.value))}

                      style={getSliderStyle(annualSalary, "100000", "10000000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contribution Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Contribution Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Employer Contribution (%)</label>
                    <span className="text-sm font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">{employerContribPct}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    step="1"
                    value={employerContribPct}
                    onChange={(e) => setEmployerContribPct(Number(e.target.value))}

                    style={getSliderStyle(employerContribPct, "0", "30")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>0%</span>
                    <span>30%</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Personal Contribution (%)</label>
                    <span className="text-sm font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">{personalContribPct}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    step="1"
                    value={personalContribPct}
                    onChange={(e) => setPersonalContribPct(Number(e.target.value))}

                    style={getSliderStyle(personalContribPct, "0", "30")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>0%</span>
                    <span>30%</span>
                  </div>
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
                <div className="p-6 pt-0 border-t border-slate-100 mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Expected Return Rate (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={expectedReturnRate}
                      onChange={(e) => setExpectedReturnRate(Number(e.target.value))}
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Annual Salary Growth (%)</label>
                    <CurrencyInput
                    value={salaryGrowthRate}
                    onValueChange={(val) => setSalaryGrowthRate(val)}
                  />
                  </div>
                </div>
              )}
            </div>

            {/* Balance Progression Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h3 className="font-semibold text-slate-900 mb-2">Balance Progression Over Time</h3>
              <div className="w-full h-40 bg-slate-50 rounded-xl p-4 flex items-center justify-center">
                {progressionPoints.length > 1 ? (
                  <svg className="w-full h-full" viewBox={`0 0 ${svgWidth} ${svgHeight}`}>
                    <path
                      d={chartPath}
                      fill="none"
                      stroke="#1e3a8a"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <div className="text-xs text-slate-400">Progression curve will render here</div>
                )}
              </div>
            </div>
          </div>

          {/* Results Sidebar */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-[#1e2a4f] rounded-2xl shadow-xl p-6 md:p-8 text-white h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-bold tracking-tight">Retirement Projection</h2>
                  <button className="text-slate-400 hover:text-white transition-colors" title="Share">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-8">
                  <div className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-1">
                    {formatCurrency(projectedBalance)}
                  </div>
                  <div className="text-slate-300 text-sm font-medium">Projected balance at retirement</div>
                </div>

                <div className="space-y-4 border-t border-slate-600/60 pt-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Yearly Contribution</span>
                    <span className="font-semibold text-white">{formatCurrency(yearlyContribution)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Total Contributions</span>
                    <span className="font-semibold text-white">{formatCurrency(totalContributions)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-600/40">
                    <span className="text-slate-300">Investment Returns</span>
                    <span className="font-semibold text-emerald-400">{formatCurrency(investmentReturns)}</span>
                  </div>
                </div>
              </div>

              <button className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2">
                Speak to a Specialist <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Informational Section */}
        <div className="max-w-4xl space-y-12 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#113262] mb-4">Understanding Superannuation and Retirement Planning</h2>
            <p className="text-slate-600">
              Superannuation, also known as retirement savings, is a long-term investment strategy designed to provide financial security during retirement. It's a systematic approach to building wealth through regular contributions, investment returns, and compound growth over your working years.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">Key Components of Superannuation</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong className="text-slate-800">Employer Contributions:</strong> Contributions from your employer forming the foundation of your retirement fund.</li>
              <li><strong className="text-slate-800">Personal Contributions:</strong> Voluntary contributions to boost your retirement savings.</li>
              <li><strong className="text-slate-800">Investment Returns:</strong> Long-term compound growth on accumulated contributions.</li>
            </ul>
          </section>

          <section className="pt-6">
            <h2 className="text-xl font-bold text-[#113262] mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">What is a superannuation fund?</h3>
                <p className="text-sm text-slate-600">A superannuation fund is an employer-sponsored retirement benefit where the company contributes a percentage of the employee's salary to a pension fund. At retirement, the employee can withdraw up to one-third as a tax-free lump sum and use the remaining two-thirds to purchase an annuity.</p>
              </div>

              <div className="border-b border-slate-200 pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">How is superannuation taxed?</h3>
                <p className="text-sm text-slate-600">Employer contributions up to ₹7.5 Lakh per year (combined across PF, NPS, and superannuation) are tax-exempt. The one-third lump sum at retirement is tax-free.</p>
              </div>

              <div className="pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">Is superannuation better than NPS?</h3>
                <p className="text-sm text-slate-600">Superannuation is employer-managed with limited investment choice. NPS offers more flexibility, lower fund management charges, and an additional ₹50,000 tax deduction under 80CCD(1B).</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

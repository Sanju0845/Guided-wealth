import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

export default function SavingsGoalCalculator() {
  const [goalType, setGoalType] = useState<'Retirement' | 'Education' | 'Home'>('Retirement');
  const [targetAmount, setTargetAmount] = useState<number>(5000000);
  const [timeFrameYears, setTimeFrameYears] = useState<number>(10);
  const [initialAmount, setInitialAmount] = useState<number>(100000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(25000);
  const [expectedReturnRate, setExpectedReturnRate] = useState<number>(12);

  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const [projectedAmount, setProjectedAmount] = useState<number>(0);
  const [totalContributions, setTotalContributions] = useState<number>(0);
  const [interestEarned, setInterestEarned] = useState<number>(0);
  const [requiredMonthlySaving, setRequiredMonthlySaving] = useState<number>(0);
  const [projectedShortfall, setProjectedShortfall] = useState<number>(0);

  useEffect(() => {
    if (targetAmount <= 0 || timeFrameYears <= 0) {
      setProjectedAmount(0);
      setTotalContributions(0);
      setInterestEarned(0);
      setRequiredMonthlySaving(0);
      setProjectedShortfall(0);
      return;
    }

    const r = expectedReturnRate / 100 / 12;
    const months = timeFrameYears * 12;

    // Initial corpus growth
    const fvInitial = initialAmount * Math.pow(1 + r, months);

    // Monthly SIP growth
    const fvMonthly = monthlyContribution > 0 && r > 0
      ? monthlyContribution * ((Math.pow(1 + r, months) - 1) / r) * (1 + r)
      : monthlyContribution * months;

    const totalProj = fvInitial + fvMonthly;
    const totContrib = initialAmount + monthlyContribution * months;
    const totInterest = Math.max(0, totalProj - totContrib);

    // Required Monthly Saving to reach targetAmount
    const remainingTarget = Math.max(0, targetAmount - fvInitial);
    let reqMonthly = 0;
    if (r > 0) {
      reqMonthly = remainingTarget / (((Math.pow(1 + r, months) - 1) / r) * (1 + r));
    } else {
      reqMonthly = remainingTarget / months;
    }

    const shortfall = Math.max(0, targetAmount - totalProj);

    setProjectedAmount(totalProj);
    setTotalContributions(totContrib);
    setInterestEarned(totInterest);
    setRequiredMonthlySaving(Math.round(reqMonthly));
    setProjectedShortfall(shortfall);
  }, [goalType, targetAmount, timeFrameYears, initialAmount, monthlyContribution, expectedReturnRate]);

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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Savings Goal Calculator</h1>
        <p className="text-slate-600 text-base">Estimate savings with this calculator.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Inputs Column */}
          <div className="flex-1 space-y-6">
            {/* Goal Type */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Goal Type</h2>
              <div className="grid grid-cols-3 gap-3">
                {(['Retirement', 'Education', 'Home'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setGoalType(type)}
                    className={`py-3 px-4 rounded-xl border text-center font-semibold text-sm transition-all ${goalType === type
                        ? 'bg-[#1e2a4f] text-white border-[#113262] shadow-sm'
                        : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                      }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Goal Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Goal Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Target Amount</label>
                  <CurrencyInput
                    value={targetAmount}
                    onValueChange={(val) => setTargetAmount(val)}
                  />
                  <div>
                    <input
                      type="range"
                      min="100000"
                      max="50000000"
                      step="100000"
                      value={targetAmount}
                      onChange={(e) => setTargetAmount(Number(e.target.value))}

                      style={getSliderStyle(targetAmount, "100000", "50000000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>₹1 Lakh</span>
                      <span>₹5 Crore</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Time Frame (Years)</label>
                    <span className="text-sm font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">{timeFrameYears} Yr</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={timeFrameYears}
                    onChange={(e) => setTimeFrameYears(Number(e.target.value))}

                    style={getSliderStyle(timeFrameYears, "1", "30")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>1 year</span>
                    <span>30 years</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Current Savings */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Current Savings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Initial Amount</label>
                  <CurrencyInput
                    value={initialAmount}
                    onValueChange={(val) => setInitialAmount(val)}
                  />
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="5000000"
                      step="50000"
                      value={initialAmount}
                      onChange={(e) => setInitialAmount(Number(e.target.value))}

                      style={getSliderStyle(initialAmount, "0", "5000000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>₹0</span>
                      <span>₹50 Lakh</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Monthly Contribution</label>
                  <input
                    type="number"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(Math.max(0, Number(e.target.value)))}
                  />
                  <div>
                    <input
                      type="range"
                      min="1000"
                      max="100000"
                      step="1000"
                      value={monthlyContribution}
                      onChange={(e) => setMonthlyContribution(Number(e.target.value))}

                      style={getSliderStyle(monthlyContribution, "1000", "100000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>₹1,000</span>
                      <span>₹1 Lakh</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full p-6 flex justify-between items-center font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <span>Additional Settings</span>
                {showAdvanced ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
              </button>

              {showAdvanced && (
                <div className="p-6 pt-0 border-t border-slate-100 mt-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Expected Return Rate (%)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={expectedReturnRate}
                    onChange={(e) => setExpectedReturnRate(Number(e.target.value))}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none font-semibold text-slate-800"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Results Sidebar */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-[#1e2a4f] rounded-2xl shadow-xl p-6 md:p-8 text-white h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-bold tracking-tight">Savings Plan</h2>
                  <button className="text-slate-400 hover:text-white transition-colors" title="Share">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-8">
                  <div className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-1">
                    {formatCurrency(projectedAmount)}
                  </div>
                  <div className="text-slate-300 text-sm font-medium">Projected Amount</div>
                </div>

                <div className="space-y-4 border-t border-slate-600/60 pt-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Target Amount</span>
                    <span className="font-semibold text-white">{formatCurrency(targetAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Total Contributions</span>
                    <span className="font-semibold text-white">{formatCurrency(totalContributions)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Interest Earned</span>
                    <span className="font-semibold text-emerald-400">{formatCurrency(interestEarned)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Required Monthly Saving</span>
                    <span className="font-semibold text-amber-400">{formatCurrency(requiredMonthlySaving)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Projected Shortfall</span>
                    <span className={`font-semibold ${projectedShortfall > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {formatCurrency(projectedShortfall)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-600/40">
                    <span className="text-slate-300">Required Corpus</span>
                    <span className="font-semibold text-white">{formatCurrency(targetAmount)}</span>
                  </div>
                </div>
              </div>

              <button className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2">
                Start Saving <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Informational Section */}
        <div className="max-w-4xl space-y-12 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#113262] mb-4">Understanding Savings Goals</h2>
            <p className="text-slate-600">
              Achieving financial success starts with setting clear, actionable savings goals. The Savings Goal Calculator is a strategic tool designed to help you transform your financial aspirations into concrete, achievable plans by providing personalized insights and realistic savings strategies.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">How Savings Goal Planning Works</h3>
            <p className="text-sm text-slate-600">
              Effective savings goal planning involves understanding your financial objectives, current savings, potential investment returns, and creating a structured approach to bridge the gap between your current financial state and your desired future.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">Why Use a Savings Goal Calculator?</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Create a clear path to financial objectives.</li>
              <li>Understand required monthly savings and timeline.</li>
              <li>Explore different saving and investment scenarios.</li>
              <li>Track progress towards major financial goals.</li>
            </ul>
          </section>

          <section className="pt-6">
            <h2 className="text-xl font-bold text-[#113262] mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">How do I set a realistic savings goal?</h3>
                <p className="text-sm text-slate-600">Define the goal amount, timeline, and purpose. Work backwards to calculate the monthly savings needed. The 50-30-20 rule suggests saving at least 20% of income.</p>
              </div>

              <div className="pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">What is the best way to save money in India?</h3>
                <p className="text-sm text-slate-600">Automate savings via SIPs and recurring deposits on salary day. Use equity SIPs for 7+ year goals, hybrid funds for 3-5 years, and liquid funds or FDs for short-term goals under 3 years.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

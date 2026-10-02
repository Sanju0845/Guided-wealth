import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

export default function EmergencyFundCalculator() {
  const [monthsCoverage, setMonthsCoverage] = useState<number>(6);
  const [takeHomeIncome, setTakeHomeIncome] = useState<number>(50000);
  const [housing, setHousing] = useState<number>(15000);
  const [utilities, setUtilities] = useState<number>(5000);
  const [food, setFood] = useState<number>(8000);
  const [transportation, setTransportation] = useState<number>(4000);
  const [currentEmergencyFund, setCurrentEmergencyFund] = useState<number>(100000);
  const [monthlySavings, setMonthlySavings] = useState<number>(10000);

  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const [targetEmergencyFund, setTargetEmergencyFund] = useState<number>(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(0);
  const [currentShortfall, setCurrentShortfall] = useState<number>(0);
  const [monthsToGoal, setMonthsToGoal] = useState<number>(0);

  useEffect(() => {
    const totalExp = housing + utilities + food + transportation;
    const targetFund = totalExp * monthsCoverage;
    const shortfall = Math.max(0, targetFund - currentEmergencyFund);
    const mToGoal = monthlySavings > 0 ? shortfall / monthlySavings : 0;

    setMonthlyExpenses(totalExp);
    setTargetEmergencyFund(targetFund);
    setCurrentShortfall(shortfall);
    setMonthsToGoal(Number(mToGoal.toFixed(1)));
  }, [monthsCoverage, takeHomeIncome, housing, utilities, food, transportation, currentEmergencyFund, monthlySavings]);

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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Emergency Fund Calculator</h1>
        <p className="text-slate-600 text-base">Determine emergency savings with this calculator.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Inputs */}
          <div className="flex-1 space-y-6">
            {/* Coverage Period */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Coverage Period</h2>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-700">Months of Coverage</label>
                  <span className="text-sm font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">{monthsCoverage} Months</span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="24"
                  step="1"
                  value={monthsCoverage}
                  onChange={(e) => setMonthsCoverage(Number(e.target.value))}

                  style={getSliderStyle(monthsCoverage, "3", "24")}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                  <span>3 months</span>
                  <span>24 months</span>
                </div>
              </div>
            </div>

            {/* Monthly Income */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Monthly Income</h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Take-Home Income</label>
                <CurrencyInput
                    value={takeHomeIncome}
                    onValueChange={(val) => setTakeHomeIncome(val)}
                  />
                <div>
                  <input
                    type="range"
                    min="20000"
                    max="500000"
                    step="5000"
                    value={takeHomeIncome}
                    onChange={(e) => setTakeHomeIncome(Number(e.target.value))}

                    style={getSliderStyle(takeHomeIncome, "20000", "500000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>₹20,000</span>
                    <span>₹5 Lakh</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Monthly Expenses */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Monthly Expenses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Housing (Rent/EMI)</label>
                  <input
                    type="number"
                    value={housing}
                    onChange={(e) => setHousing(Math.max(0, Number(e.target.value)))}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Utilities (Bills, Internet)</label>
                  <input
                    type="number"
                    value={utilities}
                    onChange={(e) => setUtilities(Math.max(0, Number(e.target.value)))}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Food & Groceries</label>
                  <input
                    type="number"
                    value={food}
                    onChange={(e) => setFood(Math.max(0, Number(e.target.value)))}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Transportation / Fuel</label>
                  <input
                    type="number"
                    value={transportation}
                    onChange={(e) => setTransportation(Math.max(0, Number(e.target.value)))}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none font-semibold text-slate-800"
                  />
                </div>
              </div>
            </div>

            {/* Current Savings */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Current Savings</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Current Emergency Fund</label>
                  <CurrencyInput
                    value={currentEmergencyFund}
                    onValueChange={(val) => setCurrentEmergencyFund(val)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Monthly Savings</label>
                  <input
                    type="number"
                    value={monthlySavings}
                    onChange={(e) => setMonthlySavings(Math.max(0, Number(e.target.value)))}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none font-semibold text-slate-800"
                  />
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
                <div className="p-6 pt-0 border-t border-slate-100 mt-4 text-xs text-slate-500">
                  Keep 1 month of expenses in high-yield savings, and remaining 2-5 months in liquid mutual funds or sweep-in FDs.
                </div>
              )}
            </div>
          </div>

          {/* Results Sidebar */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-[#1e2a4f] rounded-2xl shadow-xl p-6 md:p-8 text-white h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-bold tracking-tight">Emergency Fund Plan</h2>
                  <button className="text-slate-400 hover:text-white transition-colors" title="Share">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-8">
                  <div className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-1">
                    {formatCurrency(targetEmergencyFund)}
                  </div>
                  <div className="text-slate-300 text-sm font-medium">Target Emergency Fund</div>
                </div>

                <div className="space-y-4 border-t border-slate-600/60 pt-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Monthly Expenses</span>
                    <span className="font-semibold text-white">{formatCurrency(monthlyExpenses)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Current Savings</span>
                    <span className="font-semibold text-white">{formatCurrency(currentEmergencyFund)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Current Shortfall</span>
                    <span className={`font-semibold ${currentShortfall > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {formatCurrency(currentShortfall)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-600/40">
                    <span className="text-slate-300">Months to Goal</span>
                    <span className="font-semibold text-white">{monthsToGoal} Months</span>
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
            <h2 className="text-xl font-bold text-[#113262] mb-4">Understanding Emergency Funds</h2>
            <p className="text-slate-600">
              An emergency fund is a critical financial safety net designed to provide financial security during unexpected life events. The Emergency Fund Calculator helps you strategically build and maintain a robust financial cushion to protect against unforeseen circumstances.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">How Emergency Funds Work</h3>
            <p className="text-sm text-slate-600">
              Emergency funds act as a financial buffer, typically covering 3-6 months of living expenses. They provide peace of mind and financial stability during job loss, medical emergencies, unexpected repairs, or sudden financial challenges.
            </p>
          </section>

          <section className="pt-6">
            <h2 className="text-xl font-bold text-[#113262] mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">How much emergency fund do I need?</h3>
                <p className="text-sm text-slate-600">The standard recommendation is 3-6 months of essential monthly expenses. Salaried employees with stable jobs need 3-6 months; freelancers or single-income families should aim for 6-12 months.</p>
              </div>

              <div className="pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">Where should I keep my emergency fund?</h3>
                <p className="text-sm text-slate-600">Keep 1 month of expenses in a savings account for instant access, 2-3 months in liquid mutual funds (redeemable in 1 business day), and the remaining in sweep-in FDs. Never invest emergency funds in equity.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

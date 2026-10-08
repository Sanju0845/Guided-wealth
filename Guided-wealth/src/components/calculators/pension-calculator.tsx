import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

export default function PensionCalculator() {
  const [currentAge, setCurrentAge] = useState<number>(30);
  const [retirementAge, setRetirementAge] = useState<number>(60);
  const [currentMonthlySalary, setCurrentMonthlySalary] = useState<number>(80000);
  const [currentPensionCorpus, setCurrentPensionCorpus] = useState<number>(1500000);
  const [monthlyContribution, setMonthlyContribution] = useState<number>(10000);
  const [lifeExpectancy, setLifeExpectancy] = useState<number>(85);

  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [expectedReturnRate, setExpectedReturnRate] = useState<number>(10);
  const [annuityRate, setAnnuityRate] = useState<number>(6);

  const [monthlyPension, setMonthlyPension] = useState<number>(0);
  const [projectedCorpus, setProjectedCorpus] = useState<number>(0);
  const [yearsFinanced, setYearsFinanced] = useState<number>(0);
  const [incomeReplacementPct, setIncomeReplacementPct] = useState<number>(0);
  const [investmentReturns, setInvestmentReturns] = useState<number>(0);
  const [corpusShortfall, setCorpusShortfall] = useState<number>(0);

  useEffect(() => {
    const yearsToRetire = Math.max(1, retirementAge - currentAge);
    const yrsFinanced = Math.max(1, lifeExpectancy - retirementAge);
    const monthsToRetire = yearsToRetire * 12;

    const r = expectedReturnRate / 100 / 12;

    // FV of existing corpus
    const fvExistingCorpus = currentPensionCorpus * Math.pow(1 + expectedReturnRate / 100, yearsToRetire);

    // FV of monthly contributions
    const fvMonthlyContrib = monthlyContribution > 0 && r > 0
      ? monthlyContribution * ((Math.pow(1 + r, monthsToRetire) - 1) / r) * (1 + r)
      : monthlyContribution * monthsToRetire;

    const totalCorpusAtRetirement = fvExistingCorpus + fvMonthlyContrib;
    const totalDeposited = currentPensionCorpus + monthlyContribution * monthsToRetire;
    const returnsEarned = Math.max(0, totalCorpusAtRetirement - totalDeposited);

    // 60% of corpus to buy annuity
    const annuityCorpus = totalCorpusAtRetirement * 0.6;
    const monthlyPen = (annuityCorpus * (annuityRate / 100)) / 12;

    // Inflated salary at retirement (at 6% salary growth)
    const salaryAtRetirement = currentMonthlySalary * Math.pow(1 + 0.06, yearsToRetire);
    const replacementRatio = salaryAtRetirement > 0 ? (monthlyPen / salaryAtRetirement) * 100 : 0;

    // Target corpus needed for 70% income replacement
    const targetMonthlyPen = salaryAtRetirement * 0.7;
    const targetAnnuityCorpus = (targetMonthlyPen * 12) / (annuityRate / 100);
    const targetTotalCorpus = targetAnnuityCorpus / 0.6;
    const shortfall = Math.max(0, targetTotalCorpus - totalCorpusAtRetirement);

    setProjectedCorpus(totalCorpusAtRetirement);
    setMonthlyPension(monthlyPen);
    setYearsFinanced(yrsFinanced);
    setIncomeReplacementPct(replacementRatio);
    setInvestmentReturns(returnsEarned);
    setCorpusShortfall(shortfall);
  }, [currentAge, retirementAge, currentMonthlySalary, currentPensionCorpus, monthlyContribution, lifeExpectancy, expectedReturnRate, annuityRate]);

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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Pension Calculator</h1>
        <p className="text-slate-600 text-base">Plan your retirement income with our pension calculator</p>
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
                    <span>60 years</span>
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
                  <label className="block text-sm font-medium text-slate-700 mb-2">Current Monthly Salary</label>
                  <input
                    type="number"
                    value={currentMonthlySalary}
                    onChange={(e) => setCurrentMonthlySalary(Math.max(0, Number(e.target.value)))}
                  />
                  <div>
                    <input
                      type="range"
                      min="10000"
                      max="1000000"
                      step="5000"
                      value={currentMonthlySalary}
                      onChange={(e) => setCurrentMonthlySalary(Number(e.target.value))}

                      style={getSliderStyle(currentMonthlySalary, "10000", "1000000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Current Pension Corpus</label>
                  <CurrencyInput
                    value={currentPensionCorpus}
                    onValueChange={(val) => setCurrentPensionCorpus(val)}
                  />
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="50000000"
                      step="100000"
                      value={currentPensionCorpus}
                      onChange={(e) => setCurrentPensionCorpus(Number(e.target.value))}

                      style={getSliderStyle(currentPensionCorpus, "0", "50000000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Contribution & Lifespan */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Contribution & Lifespan</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      min="500"
                      max="100000"
                      step="500"
                      value={monthlyContribution}
                      onChange={(e) => setMonthlyContribution(Number(e.target.value))}

                      style={getSliderStyle(monthlyContribution, "500", "100000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Life Expectancy</label>
                    <span className="text-sm font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">{lifeExpectancy} Yr</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="100"
                    step="1"
                    value={lifeExpectancy}
                    onChange={(e) => setLifeExpectancy(Math.max(retirementAge + 1, Number(e.target.value)))}

                    style={getSliderStyle(lifeExpectancy, "60", "100")}
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
                    <label className="block text-sm font-medium text-slate-700 mb-2">Annuity Return Rate (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={annuityRate}
                      onChange={(e) => setAnnuityRate(Number(e.target.value))}
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none font-semibold text-slate-800"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Results Sidebar */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-[#1e2a4f] rounded-2xl shadow-xl p-6 md:p-8 text-white h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-bold tracking-tight">Pension Projections</h2>
                  <button className="text-slate-400 hover:text-white transition-colors" title="Share">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-8">
                  <div className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-1">
                    {formatCurrency(monthlyPension)}
                  </div>
                  <div className="text-slate-300 text-sm font-medium">Monthly Pension at Retirement</div>
                </div>

                <div className="space-y-4 border-t border-slate-600/60 pt-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Projected Corpus</span>
                    <span className="font-semibold text-white">{formatCurrency(projectedCorpus)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Years Financed</span>
                    <span className="font-semibold text-white">{yearsFinanced} years</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Income Replacement</span>
                    <span className="font-semibold text-emerald-400">{incomeReplacementPct.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Investment Returns</span>
                    <span className="font-semibold text-emerald-400">{formatCurrency(investmentReturns)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-600/40">
                    <span className="text-slate-300">Corpus Shortfall</span>
                    <span className="font-semibold text-rose-400">{formatCurrency(corpusShortfall)}</span>
                  </div>
                </div>
              </div>

              <button className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2">
                Get Expert Advice <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Informational Section */}
        <div className="max-w-4xl space-y-12 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#113262] mb-4">What is Pension?</h2>
            <p className="text-slate-600">
              Pension is a regular payment made to a person who has retired from service, typically based on their years of service and final salary. It serves as a steady source of income during retirement years, ensuring financial security.
            </p>
          </section>

          <section className="pt-6">
            <h2 className="text-xl font-bold text-[#113262] mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">How is pension calculated in India?</h3>
                <p className="text-sm text-slate-600">For government employees under Old Pension Scheme, pension is 50% of last drawn basic pay + DA. Under NPS (New Pension Scheme), pension depends on the corpus accumulated and annuity rate at retirement.</p>
              </div>

              <div className="pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">What is EPS (Employees Pension Scheme)?</h3>
                <p className="text-sm text-slate-600">EPS is part of the EPF structure where employers contribute 8.33% of basic salary up to ₹15,000. After 10 years of service, employees are eligible for a pension starting at age 58.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

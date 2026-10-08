import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp, Briefcase, TrendingUp, Award, Clock, Sliders, Zap } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

interface TrajectoryYear {
  year: number;
  age: number;
  salary: number;
  totalIncome: number;
  event?: string;
}

export default function CareerGrowthPlanner() {
  // Input States
  const [currentAnnualSalary, setCurrentAnnualSalary] = useState<number>(600000);
  const [industry, setIndustry] = useState<string>('Technology');

  const [currentAge, setCurrentAge] = useState<number>(25);
  const [retirementAge, setRetirementAge] = useState<number>(60);

  const [annualGrowthRate, setAnnualGrowthRate] = useState<number>(8);
  const [promotionFrequency, setPromotionFrequency] = useState<number>(3);
  const [promotionSalaryBoost, setPromotionSalaryBoost] = useState<number>(20);
  const [annualBonusPercent, setAnnualBonusPercent] = useState<number>(10);

  // Advanced States
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [jobSwitchFrequency, setJobSwitchFrequency] = useState<number>(4);
  const [jobSwitchBoost, setJobSwitchBoost] = useState<number>(30);
  const [skillUpgradeBoost, setSkillUpgradeBoost] = useState<number>(15);

  // Output States
  const [peakAnnualSalary, setPeakAnnualSalary] = useState<number>(0);
  const [lifetimeEarnings, setLifetimeEarnings] = useState<number>(0);
  const [averageAnnualSalary, setAverageAnnualSalary] = useState<number>(0);
  const [averageAnnualGrowth, setAverageAnnualGrowth] = useState<number>(0);
  const [numberOfPromotions, setNumberOfPromotions] = useState<number>(0);
  const [jobChangeImpact, setJobChangeImpact] = useState<number>(0);
  const [skillUpgradeImpactAmount, setSkillUpgradeImpactAmount] = useState<number>(0);
  const [trajectorySchedule, setTrajectorySchedule] = useState<TrajectoryYear[]>([]);

  useEffect(() => {
    const workingYears = Math.max(1, retirementAge - currentAge);

    // Simulate trajectory with switches and promotions
    let currentSal = currentAnnualSalary;
    let totalLifetime = 0;
    let peakSal = currentAnnualSalary;
    let numPromotions = 0;
    const schedule: TrajectoryYear[] = [];

    // Also simulate baseline without job switches to compute jobChangeImpact
    let baselineSal = currentAnnualSalary;
    let baselineLifetime = 0;

    for (let yr = 1; yr <= workingYears; yr++) {
      const age = currentAge + yr;
      let events: string[] = [];

      // Annual raise
      currentSal = currentSal * (1 + annualGrowthRate / 100);
      baselineSal = baselineSal * (1 + annualGrowthRate / 100);

      // Promotion check
      if (yr % promotionFrequency === 0) {
        currentSal = currentSal * (1 + promotionSalaryBoost / 100);
        baselineSal = baselineSal * (1 + promotionSalaryBoost / 100);
        numPromotions++;
        events.push('Promotion');
      }

      // Job switch check
      if (yr % jobSwitchFrequency === 0) {
        currentSal = currentSal * (1 + jobSwitchBoost / 100);
        events.push('Job Switch');
      }

      const totalYearIncome = currentSal * (1 + annualBonusPercent / 100);
      const baselineYearIncome = baselineSal * (1 + annualBonusPercent / 100);

      totalLifetime += totalYearIncome;
      baselineLifetime += baselineYearIncome;

      if (totalYearIncome > peakSal) {
        peakSal = totalYearIncome;
      }

      if (yr === 1 || yr === workingYears || yr % 5 === 0 || events.length > 0) {
        schedule.push({
          year: yr,
          age,
          salary: Math.round(currentSal),
          totalIncome: Math.round(totalYearIncome),
          event: events.join(' + ') || 'Regular Growth',
        });
      }
    }

    const avgSal = totalLifetime / workingYears;
    const cagr = ((Math.pow(currentSal / currentAnnualSalary, 1 / workingYears) - 1) * 100);
    const switchImpact = Math.max(0, totalLifetime - baselineLifetime);
    const skillImpact = Math.round(totalLifetime * (skillUpgradeBoost / 100));

    setPeakAnnualSalary(Math.round(peakSal));
    setLifetimeEarnings(Math.round(totalLifetime));
    setAverageAnnualSalary(Math.round(avgSal));
    setAverageAnnualGrowth(cagr);
    setNumberOfPromotions(numPromotions);
    setJobChangeImpact(Math.round(switchImpact));
    setSkillUpgradeImpactAmount(skillImpact);
    setTrajectorySchedule(schedule.slice(0, 10)); // Top 10 sample points
  }, [
    currentAnnualSalary,
    currentAge,
    retirementAge,
    annualGrowthRate,
    promotionFrequency,
    promotionSalaryBoost,
    annualBonusPercent,
    jobSwitchFrequency,
    jobSwitchBoost,
    skillUpgradeBoost,
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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Career Growth Planner</h1>
        <p className="text-slate-600 text-base">
          Plan your career trajectory, promotion boosts, job switches, and lifetime earnings
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Grid */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Inputs Column */}
          <div className="flex-1 space-y-6">
            {/* Current Status */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" /> Current Status
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Current Annual Salary</label>
                    <CurrencyInput
                    value={currentAnnualSalary}
                    onValueChange={(val) => setCurrentAnnualSalary(val)}
                  />
                  </div>
                  <input
                    type="range"
                    min="100000"
                    max="10000000"
                    step="50000"
                    value={currentAnnualSalary}
                    onChange={(e) => setCurrentAnnualSalary(Number(e.target.value))}

                    style={getSliderStyle(currentAnnualSalary, "100000", "10000000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>₹1 Lakh</span>
                    <span>₹1 Cr</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Industry</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none font-semibold text-slate-800 bg-white text-sm"
                  >
                    <option value="Technology">Technology & Software</option>
                    <option value="Finance">Banking & Finance</option>
                    <option value="Consulting">Consulting & Strategy</option>
                    <option value="Healthcare">Healthcare & Pharma</option>
                    <option value="Manufacturing">Manufacturing & Engineering</option>
                    <option value="Retail">E-Commerce & Retail</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Age Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" /> Age Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Current Age</label>
                    <span className="text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-300">
                      {currentAge} Yrs
                    </span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="60"
                    step="1"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(Number(e.target.value))}

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
                    <span className="text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-300">
                      {retirementAge} Yrs
                    </span>
                  </div>
                  <input
                    type="range"
                    min="40"
                    max="75"
                    step="1"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(Number(e.target.value))}

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

            {/* Growth Parameters */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" /> Growth Parameters
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Annual Growth Rate (%)</label>
                    <span className="text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-300">
                      {annualGrowthRate}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    step="1"
                    value={annualGrowthRate}
                    onChange={(e) => setAnnualGrowthRate(Number(e.target.value))}

                    style={getSliderStyle(annualGrowthRate, "0", "25")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>0%</span>
                    <span>25%</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Promotion Frequency (years)</label>
                    <span className="text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-300">
                      {promotionFrequency} Yrs
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={promotionFrequency}
                    onChange={(e) => setPromotionFrequency(Number(e.target.value))}

                    style={getSliderStyle(promotionFrequency, "1", "10")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>1 year</span>
                    <span>10 years</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Promotion Salary Boost (%)</label>
                    <span className="text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-300">
                      {promotionSalaryBoost}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    step="1"
                    value={promotionSalaryBoost}
                    onChange={(e) => setPromotionSalaryBoost(Number(e.target.value))}

                    style={getSliderStyle(promotionSalaryBoost, "5", "50")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>5%</span>
                    <span>50%</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Annual Bonus (% of salary)</label>
                    <span className="text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-300">
                      {annualBonusPercent}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="1"
                    value={annualBonusPercent}
                    onChange={(e) => setAnnualBonusPercent(Number(e.target.value))}

                    style={getSliderStyle(annualBonusPercent, "0", "50")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>0%</span>
                    <span>50%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Settings Accordion */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full p-6 flex justify-between items-center font-bold text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <span className="flex items-center gap-2 text-base">
                  <Sliders className="w-5 h-5 text-blue-600" /> Advanced Settings (Job Switches & Upskilling)
                </span>
                {showAdvanced ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
              </button>

              {showAdvanced && (
                <div className="p-6 pt-0 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Job Switch Frequency</label>
                    <select
                      value={jobSwitchFrequency}
                      onChange={(e) => setJobSwitchFrequency(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value={2}>Every 2 Years</option>
                      <option value={3}>Every 3 Years</option>
                      <option value={4}>Every 4 Years</option>
                      <option value={5}>Every 5 Years</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Job Switch Salary Jump (%)</label>
                    <input
                      type="number"
                      min="10"
                      max="100"
                      value={jobSwitchBoost}
                      onChange={(e) => setJobSwitchBoost(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Trajectory Breakdown Schedule */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 overflow-x-auto">
              <h2 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" /> Career Trajectory Preview
              </h2>
              <p className="text-xs text-slate-500 mb-4">Milestones across your working years</p>

              <table className="w-full text-left text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-600 font-semibold bg-slate-50">
                    <th className="py-3 px-3">Age</th>
                    <th className="py-3 px-3">Base Salary</th>
                    <th className="py-3 px-3">Total Income (w/ Bonus)</th>
                    <th className="py-3 px-3">Milestone Event</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {trajectorySchedule.map((row) => (
                    <tr key={row.year} className="hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-3 font-semibold text-slate-900">{row.age} yrs</td>
                      <td className="py-3 px-3">{formatCurrency(row.salary)}</td>
                      <td className="py-3 px-3 text-emerald-600 font-bold">{formatCurrency(row.totalIncome)}</td>
                      <td className="py-3 px-3">
                        <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-md font-semibold border border-blue-100">
                          {row.event}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Sticky Projection Summary Card */}
          <div className="w-full lg:w-[380px]">
            <div className="bg-[#1e2a4f] rounded-2xl shadow-xl p-6 md:p-8 text-white sticky top-28 border border-slate-600/50">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-bold tracking-tight">Career Projection</h2>
                <button className="text-slate-400 hover:text-white transition-colors p-1" title="Share">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-8 bg-slate-800/80 p-5 rounded-2xl border border-slate-600">
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">
                  {formatCurrency(peakAnnualSalary)}
                </div>
                <div className="text-slate-300 text-xs font-medium uppercase tracking-wider">Peak Annual Salary</div>
              </div>

              <div className="space-y-4 border-t border-slate-600/60 pt-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Lifetime Earnings</span>
                  <span className="font-semibold text-white">{formatCurrency(lifetimeEarnings)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Average Annual Salary</span>
                  <span className="font-semibold text-white">{formatCurrency(averageAnnualSalary)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Average Annual Growth</span>
                  <span className="font-semibold text-emerald-400">{averageAnnualGrowth.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-3 border-t border-slate-600/40">
                  <span className="text-slate-300">Number of Promotions</span>
                  <span className="font-semibold text-white">{numberOfPromotions}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Job Change Impact</span>
                  <span className="font-semibold text-emerald-400">{formatCurrency(jobChangeImpact)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Skill Upgrade Impact</span>
                  <span className="font-semibold text-amber-400">{formatCurrency(skillUpgradeImpactAmount)}</span>
                </div>
              </div>

              <button className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2">
                Start Investing Now <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Informational SEO & FAQs Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-slate-200">
          <div className="md:col-span-2 space-y-8 text-slate-700 text-sm md:text-base leading-relaxed">
            <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-[#113262] mb-4">What is Career Growth?</h2>
              <p className="text-slate-600 mb-4">
                Career growth encompasses salary progression, skill acquisition, promotions, and strategic career switches over your professional life. Aligning your career progression with disciplined long-term wealth creation allows you to achieve financial independence much faster.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Key Features</h3>
              <p className="text-slate-600 mb-4">
                NPS contributions are invested across equity (up to 75%), corporate bonds, government securities, and alternative investments based on your chosen allocation. The scheme offers tax benefits, low management costs, and the option to switch investment patterns as per your risk appetite.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Benefits of NPS & Career Acceleration</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>Additional tax deduction up to Rs 50,000 under Sec 80CCD(1B)</li>
                <li>Market-linked returns with professional fund management</li>
                <li>Choice of pension fund managers and investment options</li>
                <li>Systematic investment for long-term wealth creation</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-2">Using the Career Growth Planner</h3>
              <p className="text-slate-600">
                Use our calculator to estimate your career trajectory by entering your current salary, expected annual increments, and retirement horizon. Understand how different asset allocations and contribution amounts can impact your final pension wealth.
              </p>
            </section>

            <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-2xl font-bold text-[#113262]">Frequently Asked Questions</h2>

              <div className="border-b border-slate-100 pb-5">
                <h3 className="font-bold text-slate-900 mb-2">How much will my salary grow over my career?</h3>
                <p className="text-slate-600 text-base">
                  Average salary growth in India is 8-12% per year for the first 10 years, tapering to 5-8% in mid-career and 3-5% in senior roles. High performers in tech, finance, and consulting can see 15-25% annual jumps. Career switches and MBA degrees can provide 30-50% jumps. The calculator projects your salary trajectory over 20-30 years.
                </p>
              </div>

              <div className="border-b border-slate-100 pb-5">
                <h3 className="font-bold text-slate-900 mb-2">How does career growth affect financial planning?</h3>
                <p className="text-slate-600 text-base">
                  Higher future income enables higher savings rates, larger SIPs, and faster goal achievement. However, lifestyle inflation often absorbs salary increases. The key is to invest at least 50% of every salary increment rather than increasing spending proportionally. A step-up SIP aligned with salary growth significantly accelerates wealth creation.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-2">When should I expect salary plateau?</h3>
                <p className="text-slate-600 text-base">
                  Most careers hit a growth plateau in the 40s-50s unless you move into senior leadership or entrepreneurship. Plan your finances assuming salary growth slows down after 15-20 years of experience. Front-load aggressive saving in your high-growth years (25-40) to build a substantial base that compounds even if income growth slows.
                </p>
              </div>
            </section>
          </div>

          {/* Right Column: SEO Card */}
          <div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-lg">Map Your Career Trajectory</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Enter your current salary, expected annual increment, planned career switches, and retirement age. The calculator projects your salary over your entire career, accounting for growth rates that change with seniority. It also models how aligning SIP step-ups with salary growth can dramatically impact your retirement corpus.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

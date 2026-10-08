import React, { useState, useEffect } from 'react';
import { CurrencyInput } from '../ui/CurrencyInput';
import { Share2, ChevronDown, ChevronUp, Info } from 'lucide-react';

export default function EpfCalculator() {
  const [currentAge, setCurrentAge] = useState<number>(25);
  const [retirementAge, setRetirementAge] = useState<number>(58);
  const [basicSalary, setBasicSalary] = useState<number>(50000);
  const [employeeContribPct, setEmployeeContribPct] = useState<number>(12);
  const [annualIncrement, setAnnualIncrement] = useState<number>(5);
  const [interestRate, setInterestRate] = useState<number>(8.25);

  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const [maturityValue, setMaturityValue] = useState<number>(0);
  const [totalContribution, setTotalContribution] = useState<number>(0);
  const [employeeTotal, setEmployeeTotal] = useState<number>(0);
  const [employerTotal, setEmployerTotal] = useState<number>(0);
  const [interestEarned, setInterestEarned] = useState<number>(0);

  useEffect(() => {
    if (retirementAge <= currentAge || basicSalary <= 0) {
      setMaturityValue(0);
      setTotalContribution(0);
      setEmployeeTotal(0);
      setEmployerTotal(0);
      setInterestEarned(0);
      return;
    }

    const years = retirementAge - currentAge;
    const monthlyRate = interestRate / 100 / 12;

    let balance = 0;
    let accumulatedEmpContrib = 0;
    let accumulatedEmprContrib = 0;
    let currentMonthlySalary = basicSalary;

    for (let y = 0; y < years; y++) {
      const empMonthly = currentMonthlySalary * (employeeContribPct / 100);
      // Employer EPF contribution: 3.67% of basic salary (or 12% minus EPS max 1250)
      const epsMonthly = Math.min(currentMonthlySalary * 0.0833, 1250);
      const emprMonthly = Math.max(0, (currentMonthlySalary * 0.12) - epsMonthly);

      const totalMonthlyContrib = empMonthly + emprMonthly;

      for (let m = 0; m < 12; m++) {
        balance += totalMonthlyContrib;
        const monthlyInterest = balance * monthlyRate;
        balance += monthlyInterest;

        accumulatedEmpContrib += empMonthly;
        accumulatedEmprContrib += emprMonthly;
      }

      // Annual salary increment
      currentMonthlySalary *= (1 + annualIncrement / 100);
    }

    const totContrib = accumulatedEmpContrib + accumulatedEmprContrib;
    const totInterest = Math.max(0, balance - totContrib);

    setMaturityValue(balance);
    setEmployeeTotal(accumulatedEmpContrib);
    setEmployerTotal(accumulatedEmprContrib);
    setTotalContribution(totContrib);
    setInterestEarned(totInterest);
  }, [currentAge, retirementAge, basicSalary, employeeContribPct, annualIncrement, interestRate]);

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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">EPF Retirement Planner</h1>
        <p className="text-slate-600 text-base">Calculate Your Employee Provident Fund Maturity</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Calculator Layout */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Left Column - Inputs */}
          <div className="flex-1 space-y-6">
            {/* Basic Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Basic Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Current Age</label>
                    <span className="text-sm font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">{currentAge}</span>
                  </div>
                  <input
                    type="range"
                    min="18"
                    max="58"
                    step="1"
                    value={currentAge}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setCurrentAge(val);
                      if (val >= retirementAge) setRetirementAge(val + 1);
                    }}

                    style={getSliderStyle(currentAge, "18", "58")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>18</span>
                    <span>58</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Retirement Age</label>
                    <span className="text-sm font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">{retirementAge}</span>
                  </div>
                  <input
                    type="range"
                    min="35"
                    max="65"
                    step="1"
                    value={retirementAge}
                    onChange={(e) => setRetirementAge(Math.max(currentAge + 1, Number(e.target.value)))}

                    style={getSliderStyle(retirementAge, "35", "65")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>35</span>
                    <span>65</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Salary & Contributions Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Salary & Contributions</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Basic Salary (Monthly)</label>
                  <div className="relative">
                    <CurrencyInput
                    value={basicSalary}
                    onValueChange={(val) => setBasicSalary(val)}
                  />
                  </div>
                  <div>
                    <input
                      type="range"
                      min="10000"
                      max="500000"
                      step="5000"
                      value={basicSalary}
                      onChange={(e) => setBasicSalary(Number(e.target.value))}

                      style={getSliderStyle(basicSalary, "10000", "500000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>₹10,000</span>
                      <span>₹5,00,000</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Employee Contribution (%)</label>
                    <span className="text-sm font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">{employeeContribPct}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="12"
                    step="1"
                    value={employeeContribPct}
                    onChange={(e) => setEmployeeContribPct(Number(e.target.value))}

                    style={getSliderStyle(employeeContribPct, "10", "12")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>10%</span>
                    <span>12%</span>
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
                <div className="p-6 pt-0 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Expected Annual Salary Increase (%)</label>
                    <CurrencyInput
                    value={annualIncrement}
                    onValueChange={(val) => setAnnualIncrement(val)}
                  />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">EPF Interest Rate (%)</label>
                    <input
                      type="number"
                      step="0.05"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none font-semibold text-slate-800"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Results Sidebar */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-[#1e2a4f] rounded-2xl shadow-xl p-6 md:p-8 text-white h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-bold tracking-tight">EPF Projection</h2>
                  <button className="text-slate-400 hover:text-white transition-colors" title="Share">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-8">
                  <div className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-1">
                    {formatCurrency(maturityValue)}
                  </div>
                  <div className="text-slate-300 text-sm font-medium">Maturity Value at Age {retirementAge}</div>
                </div>

                <div className="space-y-4 border-t border-slate-600/60 pt-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Total Contributions</span>
                    <span className="font-semibold text-white">{formatCurrency(totalContribution)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pl-3 border-l-2 border-blue-500">
                    <span className="text-slate-400">Employee Contribution</span>
                    <span className="font-medium text-slate-200">{formatCurrency(employeeTotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pl-3 border-l-2 border-emerald-500">
                    <span className="text-slate-400">Employer Contribution</span>
                    <span className="font-medium text-slate-200">{formatCurrency(employerTotal)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-600/40">
                    <span className="text-slate-300">Interest Earned</span>
                    <span className="font-semibold text-emerald-400">{formatCurrency(interestEarned)}</span>
                  </div>
                </div>
              </div>

              <button className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2">
                Start Investing <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Informational Section */}
        <div className="max-w-4xl space-y-12 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#113262] mb-4">What is EPF?</h2>
            <p className="text-slate-600">
              The Employee Provident Fund (EPF) is a government-backed retirement savings scheme designed for salaried employees in India, managed by the Employees' Provident Fund Organisation (EPFO). Both employee and employer contribute 12% of the basic salary each month, accumulated with compounding interest to build a strong financial safety net post-retirement.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">Key Features</h3>
            <p className="text-sm text-slate-600">
              EPF offers guaranteed returns with sovereign backing and tax benefits under Section 80C. The current interest rate is 8.25% (FY 2024–25). The accumulated corpus becomes available at retirement (age 58), with partial withdrawals allowed for life events like home purchase, marriage, or medical emergencies.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">Contribution Breakdown</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong className="text-slate-800">Employee Contribution:</strong> 12% of (Basic Salary + DA).</li>
              <li><strong className="text-slate-800">Employer Contribution:</strong> 3.67% to EPF + 8.33% to EPS (capped at ₹1,250/month).</li>
              <li><strong className="text-slate-800">Voluntary Contribution (VPF):</strong> Employees can contribute up to 100% of basic salary via VPF at the same interest rate.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">How to Maximize EPF?</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Maintain continuous contributions without unnecessary premature withdrawals.</li>
              <li>Opt for Voluntary Provident Fund (VPF) to increase monthly tax-free savings.</li>
              <li>Transfer EPF balance seamlessly when switching jobs instead of withdrawing.</li>
              <li>Regularly review EPF passbook online via the UAN portal.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">Tax Implications</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Employee contributions qualify for Section 80C deduction up to ₹1.5 Lakh.</li>
              <li>Interest earned on EPF contribution up to ₹2.5 Lakh per year is completely tax-free.</li>
              <li>Withdrawals after 5 years of continuous service are 100% tax-free.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[#113262] mb-4">Understanding Your EPF</h3>
            <p className="text-slate-600 mb-4">
              EPF is one of the highest risk-free fixed income instruments in India. Comparing EPF with NPS and PPF:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <div className="font-bold text-[#113262] mb-1">EPF</div>
                <div className="text-slate-600">8.25% fixed return, guaranteed by Govt, EEE status after 5 yrs service.</div>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <div className="font-bold text-[#113262] mb-1">PPF</div>
                <div className="text-slate-600">7.1% fixed return, 15-year lock-in, max ₹1.5L annual deposit limit.</div>
              </div>
              <div className="p-4 bg-white rounded-xl border border-slate-200">
                <div className="font-bold text-[#113262] mb-1">NPS</div>
                <div className="text-slate-600">Market-linked returns (10-12%), additional ₹50,000 tax benefit under 80CCD(1B).</div>
              </div>
            </div>
          </section>

          <section className="pt-6">
            <h2 className="text-xl font-bold text-[#113262] mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">What is the current EPF interest rate?</h3>
                <p className="text-sm text-slate-600">The current EPF interest rate is 8.25% per annum for FY 2024-25, as declared by the EPFO and approved by the Ministry of Finance.</p>
              </div>

              <div className="border-b border-slate-200 pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">How is EPF interest calculated?</h3>
                <p className="text-sm text-slate-600">Interest is calculated monthly on the running balance of the EPF account but credited to the employee account annually at the end of the financial year.</p>
              </div>

              <div className="border-b border-slate-200 pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">Is EPF interest taxable?</h3>
                <p className="text-sm text-slate-600">Interest earned on annual employee EPF contributions up to ₹2.5 Lakh is tax-free. Interest on contributions exceeding ₹2.5 Lakh per year is taxable as per the employee's income tax slab.</p>
              </div>

              <div className="pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">Can I withdraw my EPF before retirement?</h3>
                <p className="text-sm text-slate-600">Partial withdrawals are permitted for specific events like medical emergency, higher education, marriage, or constructing/buying a house after completing requisite minimum service years.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

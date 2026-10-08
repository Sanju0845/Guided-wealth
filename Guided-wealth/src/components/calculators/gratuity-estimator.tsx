import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

export default function GratuityEstimator() {
  const [currentMonthlySalary, setCurrentMonthlySalary] = useState<number>(50000);
  const [yearsOfServiceCurrent, setYearsOfServiceCurrent] = useState<number>(5);
  const [expectedSalaryAtExit, setExpectedSalaryAtExit] = useState<number>(80000);
  const [expectedTotalYears, setExpectedTotalYears] = useState<number>(10);

  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const [expectedRealGratuity, setExpectedRealGratuity] = useState<number>(0);
  const [currentGratuity, setCurrentGratuity] = useState<number>(0);
  const [growthInGratuity, setGrowthInGratuity] = useState<number>(0);

  useEffect(() => {
    if (currentMonthlySalary <= 0 || yearsOfServiceCurrent < 0) {
      setCurrentGratuity(0);
      setExpectedRealGratuity(0);
      setGrowthInGratuity(0);
      return;
    }

    // Formula: (15 / 26) * Last Drawn Monthly Salary * Years of Service
    const currGrat = Math.round((15 / 26) * currentMonthlySalary * yearsOfServiceCurrent);
    const totalGrat = Math.round((15 / 26) * expectedSalaryAtExit * Math.max(yearsOfServiceCurrent, expectedTotalYears));
    const growth = Math.max(0, totalGrat - currGrat);

    setCurrentGratuity(currGrat);
    setExpectedRealGratuity(totalGrat);
    setGrowthInGratuity(growth);
  }, [currentMonthlySalary, yearsOfServiceCurrent, expectedSalaryAtExit, expectedTotalYears]);

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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Gratuity Estimator</h1>
        <p className="text-slate-600 text-base">Calculate your gratuity benefits as per Indian labor laws</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Inputs Column */}
          <div className="flex-1 space-y-6">
            {/* Current Employment Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Current Employment Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Current Monthly Salary (Basic + DA)</label>
                  <input
                    type="number"
                    value={currentMonthlySalary}
                    onChange={(e) => setCurrentMonthlySalary(Math.max(0, Number(e.target.value)))}
                  />
                  <div>
                    <input
                      type="range"
                      min="100"
                      max="1000000"
                      step="5000"
                      value={currentMonthlySalary}
                      onChange={(e) => setCurrentMonthlySalary(Number(e.target.value))}

                      style={getSliderStyle(currentMonthlySalary, "100", "1000000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Years of Service (Current)</label>
                    <span className="text-sm font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">{yearsOfServiceCurrent} Yr</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    step="1"
                    value={yearsOfServiceCurrent}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setYearsOfServiceCurrent(val);
                      if (val > expectedTotalYears) setExpectedTotalYears(val);
                    }}

                    style={getSliderStyle(yearsOfServiceCurrent, "0", "40")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>
              </div>
            </div>

            {/* Future Projections */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Future Projections</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Expected Monthly Salary at Exit</label>
                  <CurrencyInput
                    value={expectedSalaryAtExit}
                    onValueChange={(val) => setExpectedSalaryAtExit(val)}
                  />
                  <div>
                    <input
                      type="range"
                      min="100"
                      max="1000000"
                      step="5000"
                      value={expectedSalaryAtExit}
                      onChange={(e) => setExpectedSalaryAtExit(Number(e.target.value))}

                      style={getSliderStyle(expectedSalaryAtExit, "100", "1000000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Expected Total Years of Service</label>
                    <span className="text-sm font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">{expectedTotalYears} Yr</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    step="1"
                    value={expectedTotalYears}
                    onChange={(e) => setExpectedTotalYears(Math.max(yearsOfServiceCurrent, Number(e.target.value)))}

                    style={getSliderStyle(expectedTotalYears, "1", "40")}
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
                  Under the Payment of Gratuity Act 1972, gratuity up to ₹20 Lakh is 100% tax-exempt for non-government employees.
                </div>
              )}
            </div>
          </div>

          {/* Results Sidebar */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-[#1e2a4f] rounded-2xl shadow-xl p-6 md:p-8 text-white h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-bold tracking-tight">Gratuity Estimates</h2>
                  <button className="text-slate-400 hover:text-white transition-colors" title="Share">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-8">
                  <div className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-1">
                    {formatCurrency(expectedRealGratuity)}
                  </div>
                  <div className="text-slate-300 text-sm font-medium">Expected Real Gratuity</div>
                </div>

                <div className="space-y-4 border-t border-slate-600/60 pt-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Current Gratuity</span>
                    <span className="font-semibold text-white">{formatCurrency(currentGratuity)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-600/40">
                    <span className="text-slate-300">Growth in Gratuity</span>
                    <span className="font-semibold text-emerald-400">{formatCurrency(growthInGratuity)}</span>
                  </div>
                </div>
              </div>

              <button className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2">
                Start Planning <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Informational Section */}
        <div className="max-w-4xl space-y-12 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#113262] mb-4">What is Gratuity?</h2>
            <p className="text-slate-600">
              Gratuity is a financial benefit given to employees upon leaving a company after 5 or more continuous years of service. It acts as a reward for long-term loyalty and service.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">Key Components</h3>
            <p className="text-slate-600 font-mono text-sm bg-slate-100 p-3 rounded-lg border border-slate-200">
              Gratuity = (Last drawn basic salary + DA) × (15 / 26) × Years of service
            </p>
          </section>

          <section className="pt-6">
            <h2 className="text-xl font-bold text-[#113262] mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">How is gratuity calculated in India?</h3>
                <p className="text-sm text-slate-600">Gratuity = (Last drawn basic salary + DA) × 15 × (Years of service) / 26. For example: if basic salary is ₹50,000 and service is 10 years, Gratuity = 50,000 × 15 × 10 / 26 = ₹2,88,462.</p>
              </div>

              <div className="pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">Who is eligible for gratuity?</h3>
                <p className="text-sm text-slate-600">Any employee who completes at least 5 years of continuous service with an employer is eligible under the Payment of Gratuity Act, 1972.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

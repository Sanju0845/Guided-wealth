import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp, Calculator, Building2, TrendingUp, Info } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

export default function DaCalculator() {
  // Input States
  const [basicPay, setBasicPay] = useState<number>(50000);
  const [employeeType, setEmployeeType] = useState<string>('central'); // central, state, psu
  const [cityClass, setCityClass] = useState<string>('X'); // X, Y, Z
  const [currentDaRate, setCurrentDaRate] = useState<number>(53);
  const [previousDaRate, setPreviousDaRate] = useState<number>(50);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Computed Outputs
  const [currentDaAmount, setCurrentDaAmount] = useState<number>(0);
  const [previousDaAmount, setPreviousDaAmount] = useState<number>(0);
  const [daIncreaseAmount, setDaIncreaseAmount] = useState<number>(0);
  const [basicPlusDa, setBasicPlusDa] = useState<number>(0);
  const [hraRate, setHraRate] = useState<number>(30);
  const [monthlyHra, setMonthlyHra] = useState<number>(0);
  const [revisedGross, setRevisedGross] = useState<number>(0);
  const [annualDaImpact, setAnnualDaImpact] = useState<number>(0);

  useEffect(() => {
    // Under 7th CPC, when DA crosses 50%:
    // X cities (Delhi, Mumbai, Kolkata, Chennai, Bengaluru, Hyderabad, Ahmedabad, Pune): 30%
    // Y cities (Tier 2 cities): 20%
    // Z cities (Other cities): 10%
    let calculatedHraRate = 30;
    if (cityClass === 'X') {
      calculatedHraRate = currentDaRate >= 50 ? 30 : 27;
    } else if (cityClass === 'Y') {
      calculatedHraRate = currentDaRate >= 50 ? 20 : 18;
    } else {
      calculatedHraRate = currentDaRate >= 50 ? 10 : 9;
    }
    setHraRate(calculatedHraRate);

    const currDa = Math.round(basicPay * (currentDaRate / 100));
    const prevDa = Math.round(basicPay * (previousDaRate / 100));
    const daInc = currDa - prevDa;
    const basicDa = basicPay + currDa;
    const hra = Math.round(basicPay * (calculatedHraRate / 100));
    const gross = basicDa + hra;
    const annualImpact = daInc * 12;

    setCurrentDaAmount(currDa);
    setPreviousDaAmount(prevDa);
    setDaIncreaseAmount(daInc);
    setBasicPlusDa(basicDa);
    setMonthlyHra(hra);
    setRevisedGross(gross);
    setAnnualDaImpact(annualImpact);
  }, [basicPay, employeeType, cityClass, currentDaRate, previousDaRate]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'What is Dearness Allowance (DA)?',
      a: 'Dearness Allowance (DA) is a cost-of-living adjustment allowance paid to government employees and pensioners to offset the impact of inflation. DA is calculated as a percentage of basic pay and is revised twice a year (January and July) based on the All India Consumer Price Index (AICPI). As of 2024, DA for central government employees is 53%.',
    },
    {
      q: 'How is DA calculated under 7th Pay Commission?',
      a: 'For central government employees, 7th CPC DA % = ((Average of AICPI for last 12 months - 261.42) / 261.42) * 100. Monthly DA Amount = Basic Pay × (Current DA Rate / 100).',
    },
    {
      q: 'Does DA affect House Rent Allowance (HRA)?',
      a: 'Yes, as per 7th CPC guidelines, when the DA rate crosses 50%, HRA rates are revised upwards to 30% of basic pay for X class cities, 20% for Y class cities, and 10% for Z class cities.',
    },
    {
      q: 'Does DA affect retirement benefits like Gratuity and Pension?',
      a: 'Yes, DA is added to basic pay for calculating gratuity, pension (under Old Pension Scheme), commuted pension, and leave encashment. When DA increases, these retirement benefits also increase proportionally.',
    },
  ];
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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Dearness Allowance (DA) Calculator</h1>
        <p className="text-slate-600 text-base">
          Calculate your DA, HRA, and revised salary based on current DA rates under 7th Pay Commission guidelines.
        </p>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form Controls & Details */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mt-12">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-[#113262]" /> Employee Details
              </h2>

              {/* Basic Pay Monthly */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-700">Basic Pay (Monthly)</label>
                  <div className="relative">
                    <CurrencyInput
                    value={basicPay}
                    onValueChange={(val) => setBasicPay(val)}
                  />
                  </div>
                </div>
                <input
                  type="range"
                  min="10000"
                  max="250000"
                  step="1000"
                  value={basicPay}
                  onChange={(e) => setBasicPay(Number(e.target.value))}

                  style={getSliderStyle(basicPay, "10000", "250000")}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>₹10,000</span>
                  <span>₹2,50,000</span>
                </div>
              </div>

              {/* Dropdowns row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Employee Type</label>
                  <select
                    value={employeeType}
                    onChange={(e) => setEmployeeType(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-[#113262] outline-none text-sm font-medium"
                  >
                    <option value="central">Central Government</option>
                    <option value="state">State Government</option>
                    <option value="psu">PSU / Autonomous</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">City Classification</label>
                  <select
                    value={cityClass}
                    onChange={(e) => setCityClass(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-[#113262] outline-none text-sm font-medium"
                  >
                    <option value="X">X (Delhi, Mumbai, Chennai, Kolkata, etc. - 30%)</option>
                    <option value="Y">Y (Tier-2 Cities - 20%)</option>
                    <option value="Z">Z (Other Cities - 10%)</option>
                  </select>
                </div>
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#113262]" /> DA Rates
              </h2>

              {/* Sliders for Current and Previous DA Rate */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Current DA Rate (%)</label>
                    <span className="font-bold text-slate-900 text-sm bg-slate-100 px-2.5 py-1 rounded-md">{currentDaRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={currentDaRate}
                    onChange={(e) => setCurrentDaRate(Number(e.target.value))}

                    style={getSliderStyle(currentDaRate, "0", "100")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Previous DA Rate (%)</label>
                    <span className="font-bold text-slate-900 text-sm bg-slate-100 px-2.5 py-1 rounded-md">{previousDaRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={previousDaRate}
                    onChange={(e) => setPreviousDaRate(Number(e.target.value))}

                    style={getSliderStyle(previousDaRate, "0", "100")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* HRA Details (7th CPC) */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mt-12">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center justify-between">
                <span>HRA Details (7th CPC)</span>
                <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  {cityClass} Class: {hraRate}% of Basic Pay
                </span>
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                As per 7th Pay Commission norms, when DA crosses 50%, HRA rates stand revised to <strong>30%</strong> for X class cities (Delhi, Mumbai, Kolkata, Chennai, etc.), <strong>20%</strong> for Y class cities, and <strong>10%</strong> for Z class cities (revised from earlier 24%, 16%, 8%).
              </p>
            </div>
          </div>

          {/* Right Column: Dark Navy Sticky Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="bg-[#1e2a4f] text-white rounded-2xl p-6 shadow-xl border border-slate-800">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold">DA Calculation</h3>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Dearness Allowance (DA) Calculation',
                        text: `My monthly DA is ${formatCurrency(currentDaAmount)} and Revised Gross Salary is ${formatCurrency(revisedGross)}.`,
                        url: window.location.href,
                      }).catch(() => { });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }
                  }}
                  className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                  title="Share"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Highlight Hero Output */}
              <div className="mb-6 p-4 rounded-xl bg-slate-800/80 border border-slate-600/50">
                <div className="text-xs text-slate-400 mb-1 font-medium">Current DA Amount (Monthly)</div>
                <div className="text-3xl font-extrabold text-white">{formatCurrency(currentDaAmount)}</div>
                <div className="text-xs text-emerald-400 mt-1 font-medium flex items-center gap-1">
                  <span>+ {formatCurrency(daIncreaseAmount)} monthly increase</span>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-3.5 text-sm border-t border-slate-800 pt-4">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Previous DA Amount</span>
                  <span className="font-semibold text-white">{formatCurrency(previousDaAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>DA Increase</span>
                  <span className="font-semibold text-emerald-400">+ {formatCurrency(daIncreaseAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Basic + DA</span>
                  <span className="font-semibold text-white">{formatCurrency(basicPlusDa)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Monthly HRA ({cityClass} city)</span>
                  <span className="font-semibold text-white">{formatCurrency(monthlyHra)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300 pt-3 border-t border-slate-800">
                  <span className="font-bold text-white">Revised Gross Salary</span>
                  <span className="font-bold text-[#EAB308] text-lg">{formatCurrency(revisedGross)}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <div className="flex justify-between items-center text-xs text-slate-400 mb-4">
                  <span>Annual Additional Gain:</span>
                  <span className="font-semibold text-emerald-400 text-sm">{formatCurrency(annualDaImpact)}</span>
                </div>
                <button
                  onClick={() => window.scrollTo({ top: 1000, behavior: 'smooth' })}
                  className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2"
                >
                  Plan Your Finances →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Informational SEO Content & Guide */}
        <div className="max-w-4xl space-y-12 text-slate-700 leading-relaxed mt-12">
          <h2 className="text-xl font-bold text-[#113262] mb-4">How This Calculator Works</h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6">
            Enter your basic pay and current DA percentage. The calculator computes your DA amount, total salary including DA, and projects how DA increases affect your annual income. It is ideal for government employees and pensioners to plan their finances around biannual DA revisions.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-700 border-t border-slate-100 pt-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Key Components</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li><strong>Basic Pay:</strong> Base monthly salary without allowances.</li>
                <li><strong>Current DA Rate (%):</strong> Applicable DA rate (e.g., 53%).</li>
                <li><strong>Previous DA Rate (%):</strong> Previous rate for comparing increment.</li>
                <li><strong>Employee Type:</strong> Central Govt / State Govt / PSU.</li>
                <li><strong>City Classification:</strong> X, Y, or Z class for HRA computation.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">How It Works</h3>
              <p className="mb-2">The calculator uses the following formulas:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li><strong>DA Amount:</strong> Basic Pay × DA Rate / 100</li>
                <li><strong>HRA (X cities):</strong> 27% or 30% of Basic (when DA &gt; 50%)</li>
                <li><strong>HRA (Y cities):</strong> 18% or 20% of Basic (when DA &gt; 50%)</li>
                <li><strong>HRA (Z cities):</strong> 9% or 10% of Basic (when DA &gt; 50%)</li>
                <li><strong>Revised Gross:</strong> Basic + DA + HRA</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mt-12">
          <h2 className="text-xl font-bold text-[#113262] mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex justify-between items-center p-4 text-left font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-5 h-5 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="p-4 pt-0 text-sm text-slate-600 border-t border-slate-100 bg-slate-50/50 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

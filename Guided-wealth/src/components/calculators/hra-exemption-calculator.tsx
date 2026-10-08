import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp, Home, DollarSign, MapPin, Sliders, FileText } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

export default function HraExemptionCalculator() {
  // Input States
  const [basicSalary, setBasicSalary] = useState<number>(50000);
  const [hraReceived, setHraReceived] = useState<number>(20000);
  const [dearnessAllowance, setDearnessAllowance] = useState<number>(0);
  const [rentPaid, setRentPaid] = useState<number>(25000);
  const [cityType, setCityType] = useState<string>('metro'); // 'metro' (50%) or 'non-metro' (40%)
  const [payFrequency, setPayFrequency] = useState<string>('monthly'); // 'monthly' or 'annual'

  // Advanced Settings
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Computed Outputs
  const [rule1ActualHra, setRule1ActualHra] = useState<number>(0);
  const [rule2RentMinus10, setRule2RentMinus10] = useState<number>(0);
  const [rule3CityPercent, setRule3CityPercent] = useState<number>(0);
  const [monthlyExemption, setMonthlyExemption] = useState<number>(0);
  const [yearlyExemption, setYearlyExemption] = useState<number>(0);
  const [monthlyTaxableHra, setMonthlyTaxableHra] = useState<number>(0);
  const [yearlyTaxableHra, setYearlyTaxableHra] = useState<number>(0);

  useEffect(() => {
    // Standardize to monthly numbers for calculations
    const mult = payFrequency === 'annual' ? 1 / 12 : 1;
    const monthlyBasic = basicSalary * mult;
    const monthlyHra = hraReceived * mult;
    const monthlyDa = dearnessAllowance * mult;
    const monthlyRent = rentPaid * mult;

    const salaryBase = monthlyBasic + monthlyDa;

    // Rule 1: Actual HRA Received
    const r1 = monthlyHra;

    // Rule 2: Rent Paid minus 10% of Basic+DA
    const r2 = Math.max(0, monthlyRent - 0.10 * salaryBase);

    // Rule 3: 50% of Basic for Metro, 40% for Non-Metro
    const cityPct = cityType === 'metro' ? 0.50 : 0.40;
    const r3 = salaryBase * cityPct;

    // Lowest of 3 rules is exempt
    const exemptMonthly = Math.round(Math.min(r1, r2, r3));
    const taxableMonthly = Math.max(0, Math.round(monthlyHra - exemptMonthly));

    setRule1ActualHra(Math.round(r1));
    setRule2RentMinus10(Math.round(r2));
    setRule3CityPercent(Math.round(r3));

    setMonthlyExemption(exemptMonthly);
    setYearlyExemption(exemptMonthly * 12);
    setMonthlyTaxableHra(taxableMonthly);
    setYearlyTaxableHra(taxableMonthly * 12);
  }, [basicSalary, hraReceived, dearnessAllowance, rentPaid, cityType, payFrequency]);

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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">HRA Exemption Calculator</h1>
        <p className="text-slate-600 text-base">
          Calculate your House Rent Allowance tax exemption and taxable HRA
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Grid */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Inputs Column */}
          <div className="flex-1 space-y-6">
            {/* Salary Details Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-600" /> Salary Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Basic Salary ({payFrequency === 'monthly' ? 'p.m.' : 'p.a.'})</label>
                    <CurrencyInput
                    value={basicSalary}
                    onValueChange={(val) => setBasicSalary(val)}
                  />
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="500000"
                    step="5000"
                    value={basicSalary}
                    onChange={(e) => setBasicSalary(Number(e.target.value))}

                    style={getSliderStyle(basicSalary, "10000", "1000000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>₹10,000</span>
                    <span>₹5 Lakhs</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">HRA Received ({payFrequency === 'monthly' ? 'p.m.' : 'p.a.'})</label>
                    <input
                      type="number"
                      min="0"
                      max="500000"
                      step="2000"
                      value={hraReceived}
                      onChange={(e) => setHraReceived(Math.max(0, Number(e.target.value)))}
                    />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="200000"
                    step="2000"
                    value={hraReceived}
                    onChange={(e) => setHraReceived(Number(e.target.value))}

                    style={getSliderStyle(hraReceived, "0", "500000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>₹0</span>
                    <span>₹2 Lakhs</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Rent Details Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Home className="w-5 h-5 text-blue-600" /> Rent Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Rent Paid ({payFrequency === 'monthly' ? 'p.m.' : 'p.a.'})</label>
                    <CurrencyInput
                    value={rentPaid}
                    onValueChange={(val) => setRentPaid(val)}
                  />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="300000"
                    step="2000"
                    value={rentPaid}
                    onChange={(e) => setRentPaid(Number(e.target.value))}

                    style={getSliderStyle(rentPaid, "0", "500000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>₹0</span>
                    <span>₹3 Lakhs</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">City Type</label>
                  <div className="space-y-2 mt-1">
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-800 cursor-pointer">
                      <input
                        type="radio"
                        name="cityType"
                        value="metro"
                        checked={cityType === 'metro'}
                        onChange={() => setCityType('metro')}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-600"
                      />
                      <span>Metro (Delhi, Mumbai, Kolkata, Chennai)</span>
                    </label>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-800 cursor-pointer">
                      <input
                        type="radio"
                        name="cityType"
                        value="non-metro"
                        checked={cityType === 'non-metro'}
                        onChange={() => setCityType('non-metro')}
                        className="w-4 h-4 text-blue-600 focus:ring-blue-600"
                      />
                      <span>Non-Metro (Other cities)</span>
                    </label>
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
                  <Sliders className="w-5 h-5 text-blue-600" /> Advanced Settings (Pay Frequency & DA)
                </span>
                {showAdvanced ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
              </button>

              {showAdvanced && (
                <div className="p-6 pt-0 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Pay Frequency</label>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 cursor-pointer">
                        <input
                          type="radio"
                          name="payFrequency"
                          value="monthly"
                          checked={payFrequency === 'monthly'}
                          onChange={() => setPayFrequency('monthly')}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-600"
                        />
                        <span>Monthly (Amounts per month)</span>
                      </label>
                      <label className="flex items-center gap-2 text-sm font-semibold text-slate-800 cursor-pointer">
                        <input
                          type="radio"
                          name="payFrequency"
                          value="annual"
                          checked={payFrequency === 'annual'}
                          onChange={() => setPayFrequency('annual')}
                          className="w-4 h-4 text-blue-600 focus:ring-blue-600"
                        />
                        <span>Annual (Amounts per year)</span>
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Dearness Allowance (DA)</label>
                    <input
                      type="number"
                      step="1000"
                      min="0"
                      value={dearnessAllowance}
                      onChange={(e) => setDearnessAllowance(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Summary Card */}
          <div className="w-full lg:w-[380px]">
            <div className="bg-[#1e2a4f] rounded-2xl shadow-xl p-6 md:p-8 text-white sticky top-28 border border-slate-600/50">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-bold tracking-tight">HRA Exemption</h2>
                <button className="text-slate-400 hover:text-white transition-colors p-1" title="Share">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-8 bg-slate-800/80 p-5 rounded-2xl border border-slate-600">
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">
                  {formatCurrency(monthlyExemption)}
                </div>
                <div className="text-slate-300 text-xs font-medium uppercase tracking-wider">Monthly HRA Exemption</div>
              </div>

              <div className="space-y-4 border-t border-slate-600/60 pt-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Yearly Exemption</span>
                  <span className="font-semibold text-emerald-400">{formatCurrency(yearlyExemption)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Taxable HRA</span>
                  <span className="font-semibold text-white">{formatCurrency(monthlyTaxableHra)}/mo</span>
                </div>
                <div className="pt-3 border-t border-slate-600/40 space-y-2">
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider block">Calculation Method</span>
                  <div className="flex justify-between items-center text-xs text-slate-300">
                    <span>1. Actual HRA</span>
                    <span>{formatCurrency(rule1ActualHra)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-300">
                    <span>2. Rent - 10% of Basic</span>
                    <span>{formatCurrency(rule2RentMinus10)}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-slate-300">
                    <span>3. {cityType === 'metro' ? '50%' : '40%'} of Basic</span>
                    <span>{formatCurrency(rule3CityPercent)}</span>
                  </div>
                  <span className="text-[11px] text-slate-400 block pt-1 italic">
                    Exemption is the lowest of above 3 calculations
                  </span>
                </div>
              </div>

              <button className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2">
                Plan Tax Saving <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Informational SEO & FAQs Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-slate-200">
          <div className="md:col-span-2 space-y-8 text-slate-700 text-sm md:text-base leading-relaxed">
            <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-[#113262] mb-4">House Rent Allowance (HRA) Tax Exemption</h2>
              <p className="text-slate-600 mb-4">
                House Rent Allowance (HRA) is a crucial component of salary structure that provides tax benefits to salaried individuals who pay rent for their accommodation. Understanding HRA can help employees optimize their tax liability and reduce overall tax burden.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">HRA Calculation Components</h3>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 mb-4">
                <li>Actual HRA Received</li>
                <li>Rent Paid</li>
                <li>Basic Salary</li>
                <li>Dearness Allowance</li>
                <li>City of Residence</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Eligibility Criteria</h3>
              <p className="text-slate-600 mb-4">
                To claim HRA exemption, an individual must be a salaried employee receiving HRA as part of their salary and paying rent for their accommodation. The exemption is subject to specific conditions and calculations.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">HRA Exemption Calculation</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600 mb-6">
                <li>Minimum of Actual HRA Received</li>
                <li>50% of Basic Salary (Metro Cities)</li>
                <li>40% of Basic Salary (Non-Metro Cities)</li>
                <li>Actual Rent Paid Minus 10% of Basic Salary</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Documentation Requirements</h3>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 mb-6">
                <li>Rent Receipts</li>
                <li>Rental Agreement</li>
                <li>PAN of Landlord (if rent exceeds ₹1 Lakh annually)</li>
                <li>Salary Slip</li>
                <li>Form 12BB</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Tax Planning Strategies</h3>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 mb-4">
                <li>Maintain Proper Rent Documentation</li>
                <li>Understand Exemption Limits</li>
                <li>Consider Rental Property Location</li>
                <li>Optimize Salary Structure</li>
                <li>Consult Tax Professionals</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-2">Using the HRA Calculator</h3>
              <p className="text-slate-600">
                Calculate your potential HRA tax exemption by entering details such as basic salary, HRA received, rent paid, and city of residence. Gain insights into your tax savings and optimize your tax planning strategy.
              </p>
            </section>

            <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-2xl font-bold text-[#113262]">Frequently Asked Questions</h2>

              <div className="border-b border-slate-100 pb-5">
                <h3 className="font-bold text-slate-900 mb-2">How is HRA exemption calculated?</h3>
                <p className="text-slate-600 text-base">
                  HRA exemption is the minimum of: (1) Actual HRA received, (2) 50% of basic salary + DA for metro cities (40% for non-metros), or (3) Actual rent paid minus 10% of basic salary + DA. The lowest of these three amounts is exempt from income tax.
                </p>
              </div>

              <div className="border-b border-slate-100 pb-5">
                <h3 className="font-bold text-slate-900 mb-2">Can I claim HRA if I have a home loan?</h3>
                <p className="text-slate-600 text-base">
                  Yes. You can claim both HRA exemption and home loan tax benefits (Section 24 and 80C) simultaneously, provided the rented house and the owned house are in different cities. If in the same city, the Income Tax Department may question it, though there is no specific prohibition in the law.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-2">What documents do I need for HRA exemption?</h3>
                <p className="text-slate-600 text-base">
                  Rent receipts (monthly or quarterly), rental agreement, and landlord's PAN if annual rent exceeds Rs 1 lakh. If your landlord is an NRI, you must deduct TDS at 30% on the rent. Self-declaration is sufficient for rent up to Rs 1 lakh per year.
                </p>
              </div>
            </section>
          </div>

          {/* Right Column: SEO Card */}
          <div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-lg">Maximising Your HRA Benefit</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                This calculator computes your HRA exemption under all three rules and shows which one applies. Enter your basic salary, DA, HRA received, actual rent paid, and city type (metro/non-metro). The calculator shows the exempt amount and the taxable portion of HRA that will be added to your income.
              </p>

              <h4 className="font-bold text-slate-800 text-sm">HRA for Self-Employed</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Self-employed individuals who do not receive HRA can claim deduction under Section 80GG for rent paid, up to Rs 5,000 per month or 25% of total income, whichever is lower. This benefit is available only if you, your spouse, or minor children do not own residential property in the city of residence.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { CurrencyInput } from '../ui/CurrencyInput';
import { Share2, ChevronDown, ChevronUp, Home, DollarSign, TrendingUp, Sliders, Building } from 'lucide-react';

export default function RentalYieldCalculator() {
  // Input States
  const [propertyValue, setPropertyValue] = useState<number>(5000000);
  const [monthlyRent, setMonthlyRent] = useState<number>(25000);
  const [occupancyRate, setOccupancyRate] = useState<number>(95);

  const [maintenanceCost, setMaintenanceCost] = useState<number>(10000);
  const [propertyTax, setPropertyTax] = useState<number>(15000);

  // Advanced Settings
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [annualAppreciation, setAnnualAppreciation] = useState<number>(5);
  const [loanAmount, setLoanAmount] = useState<number>(0);

  // Computed Outputs
  const [grossRentalYield, setGrossRentalYield] = useState<number>(0);
  const [netRentalYield, setNetRentalYield] = useState<number>(0);
  const [annualRentalIncome, setAnnualRentalIncome] = useState<number>(0);
  const [annualExpenses, setAnnualExpenses] = useState<number>(0);
  const [netRentalIncome, setNetRentalIncome] = useState<number>(0);
  const [estAnnualAppreciation, setEstAnnualAppreciation] = useState<number>(0);
  const [totalReturnPercent, setTotalReturnPercent] = useState<number>(0);

  useEffect(() => {
    // Gross Annual Rent (assuming 100% occupancy)
    const rawAnnualRent = monthlyRent * 12;
    // Effective Annual Rental Income (factoring in occupancy rate)
    const effectiveRent = Math.round(rawAnnualRent * (occupancyRate / 100));

    const totalExp = maintenanceCost + propertyTax;
    const netIncome = Math.max(0, effectiveRent - totalExp);

    const grossYield = propertyValue > 0 ? (rawAnnualRent / propertyValue) * 100 : 0;
    const netYield = propertyValue > 0 ? (netIncome / propertyValue) * 100 : 0;

    const appreciationAmt = Math.round(propertyValue * (annualAppreciation / 100));
    const totalReturn = netYield + annualAppreciation;

    setGrossRentalYield(grossYield);
    setNetRentalYield(netYield);
    setAnnualRentalIncome(effectiveRent);
    setAnnualExpenses(totalExp);
    setNetRentalIncome(netIncome);
    setEstAnnualAppreciation(appreciationAmt);
    setTotalReturnPercent(totalReturn);
  }, [
    propertyValue,
    monthlyRent,
    occupancyRate,
    maintenanceCost,
    propertyTax,
    annualAppreciation,
    loanAmount,
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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Rental Yield Calculator</h1>
        <p className="text-slate-600 text-base">
          Analyze the profitability of your rental property investment
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Grid */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Inputs Column */}
          <div className="flex-1 space-y-6">
            {/* Property Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Home className="w-5 h-5 text-blue-600" /> Property Details
              </h2>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-700">Property Value</label>
                  <CurrencyInput
                    value={propertyValue}
                    onValueChange={(val) => setPropertyValue(val)}
                  />
                </div>
                <input
                  type="range"
                  min="500000"
                  max="50000000"
                  step="250000"
                  value={propertyValue}
                  onChange={(e) => setPropertyValue(Number(e.target.value))}

                  style={getSliderStyle(propertyValue, "500000", "100000000")}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                  <span>₹5 Lakhs</span>
                  <span>₹5 Cr</span>
                </div>
              </div>
            </div>

            {/* Rental Income Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-600" /> Rental Income
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Monthly Rent</label>
                    <input
                      type="number"
                      min="1000"
                      max="500000"
                      step="1000"
                      value={monthlyRent}
                      onChange={(e) => setMonthlyRent(Math.max(0, Number(e.target.value)))}
                    />
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="200000"
                    step="1000"
                    value={monthlyRent}
                    onChange={(e) => setMonthlyRent(Number(e.target.value))}

                    style={getSliderStyle(monthlyRent, "1000", "500000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>₹1,000</span>
                    <span>₹2 Lakhs</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Occupancy Rate (%)</label>
                    <span className="text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-300">
                      {occupancyRate}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={occupancyRate}
                    onChange={(e) => setOccupancyRate(Number(e.target.value))}

                    style={getSliderStyle(occupancyRate, "0", "100")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>0%</span>
                    <span>100%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Annual Expenses Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600" /> Annual Expenses
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Maintenance Cost</label>
                    <CurrencyInput
                    value={maintenanceCost}
                    onValueChange={(val) => setMaintenanceCost(val)}
                  />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="2500"
                    value={maintenanceCost}
                    onChange={(e) => setMaintenanceCost(Number(e.target.value))}

                    style={getSliderStyle(maintenanceCost, "0", "200000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Property Tax</label>
                    <CurrencyInput
                    value={propertyTax}
                    onValueChange={(val) => setPropertyTax(val)}
                  />
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="2500"
                    value={propertyTax}
                    onChange={(e) => setPropertyTax(Number(e.target.value))}

                    style={getSliderStyle(propertyTax, "0", "200000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
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
                  <Sliders className="w-5 h-5 text-blue-600" /> Advanced Settings (Capital Appreciation & Loan)
                </span>
                {showAdvanced ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
              </button>

              {showAdvanced && (
                <div className="p-6 pt-0 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Annual Appreciation (%)</label>
                    <CurrencyInput
                    value={annualAppreciation}
                    onValueChange={(val) => setAnnualAppreciation(val)}
                  />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Loan Amount (if financed)</label>
                    <CurrencyInput
                    value={loanAmount}
                    onValueChange={(val) => setLoanAmount(val)}
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
                <h2 className="text-xl font-bold tracking-tight">Rental Yield Analysis</h2>
                <button className="text-slate-400 hover:text-white transition-colors p-1" title="Share">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-8 bg-slate-800/80 p-5 rounded-2xl border border-slate-600">
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">
                  {netRentalYield.toFixed(2)}%
                </div>
                <div className="text-slate-300 text-xs font-medium uppercase tracking-wider">Net Rental Yield</div>
              </div>

              <div className="space-y-4 border-t border-slate-600/60 pt-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Gross Rental Yield</span>
                  <span className="font-semibold text-white">{grossRentalYield.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Annual Rental Income</span>
                  <span className="font-semibold text-white">{formatCurrency(annualRentalIncome)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Annual Expenses</span>
                  <span className="font-semibold text-rose-400">{formatCurrency(annualExpenses)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Net Rental Income</span>
                  <span className="font-semibold text-emerald-400">{formatCurrency(netRentalIncome)}</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-3 border-t border-slate-600/40">
                  <span className="text-slate-300">Est. Annual Appreciation</span>
                  <span className="font-semibold text-white">{formatCurrency(estAnnualAppreciation)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Total Return (Yield + Appreciation)</span>
                  <span className="font-semibold text-emerald-400">{totalReturnPercent.toFixed(2)}%</span>
                </div>
              </div>

              <button className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2">
                Plan Your Finances <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Informational SEO & FAQs Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-slate-200">
          <div className="md:col-span-2 space-y-8 text-slate-700 text-sm md:text-base leading-relaxed">
            <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Rental Yield Calculator</h2>
              <p className="text-slate-600 mb-4">
                The Rental Yield Calculator helps property investors and landlords determine the potential return on investment for rental properties. It calculates the annual rental yield based on property value and rental income, providing valuable insights for investment decisions.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Key Components</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600 mb-6">
                <li>Property Value</li>
                <li>Monthly Rent</li>
                <li>Annual Yield</li>
                <li>Gross Rental Yield</li>
                <li>Net Rental Yield</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">How It Works</h3>
              <p className="text-slate-600 mb-2">The calculator uses the following formulas to determine rental yield:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600 mb-6">
                <li><strong>Gross Rental Yield</strong> = (Annual Rent / Property Value) × 100%</li>
                <li><strong>Net Rental Yield</strong> = ((Annual Rent - Expenses) / Property Value) × 100%</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Benefits</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600 mb-6">
                <li>Evaluate investment potential</li>
                <li>Compare property investments</li>
                <li>Assess rental market conditions</li>
                <li>Plan property investments</li>
                <li>Make informed investment decisions</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Using the Calculator</h3>
              <p className="text-slate-600">
                Enter your property value and monthly rent to calculate the gross rental yield. For a more accurate net yield, include estimated expenses such as maintenance, property taxes, and insurance. The calculator will provide you with valuable insights to help you make informed investment decisions.
              </p>
            </section>

            <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-2xl font-bold text-[#113262]">Frequently Asked Questions</h2>

              <div className="border-b border-slate-100 pb-5">
                <h3 className="font-bold text-slate-900 mb-2">How is rental yield calculated?</h3>
                <p className="text-slate-600 text-base">
                  Gross rental yield = (Annual rent / Property purchase price) x 100. Net rental yield deducts maintenance, property tax, insurance, vacancy periods, and repairs from the annual rent before dividing by the total investment (purchase price + registration + interiors). Net yield is typically 1-2% lower than gross yield.
                </p>
              </div>

              <div className="border-b border-slate-100 pb-5">
                <h3 className="font-bold text-slate-900 mb-2">What is a good rental yield in India?</h3>
                <p className="text-slate-600 text-base">
                  Gross rental yields in Indian metros range from 2-4%. Mumbai and Delhi have the lowest (2-3%) due to high property prices. Tier-2 cities like Pune, Hyderabad, and Ahmedabad offer slightly better yields (3-4.5%). Commercial properties offer higher yields (6-9%) but require larger investment. Globally, a yield above 6% is considered reasonable.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-2">Is rental income from property a good investment?</h3>
                <p className="text-slate-600 text-base">
                  In Indian metros, property rental yields (2-4%) are lower than risk-free alternatives like FDs (7%) or SGBs (gold appreciation + 2.5%). Property investment makes sense when you factor in capital appreciation (5-8% annually in growing areas), tax benefits on home loans, and the leveraging effect of mortgage financing.
                </p>
              </div>
            </section>
          </div>

          {/* Right Column: SEO Card */}
          <div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-lg">Evaluating Property as an Investment</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Enter the property purchase price, total investment (including registration, stamp duty, and interiors), expected monthly rent, and annual expenses. The calculator computes both gross and net rental yield and compares the property's total return (yield + capital appreciation) against alternative investments like equity and debt mutual funds.
              </p>

              <h4 className="font-bold text-slate-800 text-sm">Maximising Rental Income</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Location near IT parks, metro stations, and educational institutions commands higher rent. Furnished apartments yield 20-30% more rent than unfurnished ones. Short-term rentals (via platforms) can boost yield in tourist areas. Regular maintenance and responsive landlord behavior reduce vacancy periods.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

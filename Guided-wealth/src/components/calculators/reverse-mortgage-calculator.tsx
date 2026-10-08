import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

export default function ReverseMortgageCalculator() {
  const [propertyValue, setPropertyValue] = useState<number>(10000000);
  const [primaryAge, setPrimaryAge] = useState<number>(65);
  const [includeCoBorrower, setIncludeCoBorrower] = useState<boolean>(true);
  const [coBorrowerAge, setCoBorrowerAge] = useState<number>(60);
  const [loanTermYears, setLoanTermYears] = useState<number>(15);
  const [disbursementOption, setDisbursementOption] = useState<string>('Monthly Payments');

  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [interestRate, setInterestRate] = useState<number>(9.5);

  const [monthlyPayment, setMonthlyPayment] = useState<number>(0);
  const [maxLoanAmount, setMaxLoanAmount] = useState<number>(0);
  const [netProceeds, setNetProceeds] = useState<number>(0);
  const [totalDisbursements, setTotalDisbursements] = useState<number>(0);
  const [finalLoanBalance, setFinalLoanBalance] = useState<number>(0);
  const [estimatedEquityRemaining, setEstimatedEquityRemaining] = useState<number>(0);
  const [incomeGapCovered, setIncomeGapCovered] = useState<number>(71.4);

  useEffect(() => {
    if (propertyValue <= 0 || loanTermYears <= 0) {
      setMonthlyPayment(0);
      setMaxLoanAmount(0);
      setNetProceeds(0);
      setTotalDisbursements(0);
      setFinalLoanBalance(0);
      setEstimatedEquityRemaining(0);
      return;
    }

    // 60% LTV capped at 1 Crore
    const ltvMax = Math.min(10000000, propertyValue * 0.6);
    const netProc = ltvMax * 0.95; // 5% costs/fees

    const r = interestRate / 100 / 12;
    const months = loanTermYears * 12;

    // Monthly payout formula
    const monthlyPayout = (ltvMax * r) / (Math.pow(1 + r, months) - 1);
    const totDisbursed = monthlyPayout * months;

    // Accumulated loan balance at end of term
    const finalBal = monthlyPayout * ((Math.pow(1 + r, months) - 1) / r);

    // Inflated property value (5% annual real estate appreciation)
    const futurePropVal = propertyValue * Math.pow(1 + 0.05, loanTermYears);
    const equityRem = Math.max(0, futurePropVal - finalBal);

    setMaxLoanAmount(ltvMax);
    setNetProceeds(netProc);
    setMonthlyPayment(monthlyPayout);
    setTotalDisbursements(totDisbursed);
    setFinalLoanBalance(finalBal);
    setEstimatedEquityRemaining(equityRem);
  }, [propertyValue, primaryAge, includeCoBorrower, coBorrowerAge, loanTermYears, disbursementOption, interestRate]);

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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Reverse Mortgage Calculator</h1>
        <p className="text-slate-600 text-base">Estimate your reverse mortgage benefits for retirement</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Inputs Column */}
          <div className="flex-1 space-y-6">
            {/* Property Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Property Details</h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Property Value</label>
                <CurrencyInput
                    value={propertyValue}
                    onValueChange={(val) => setPropertyValue(val)}
                  />
                <div>
                  <input
                    type="range"
                    min="1000000"
                    max="100000000"
                    step="500000"
                    value={propertyValue}
                    onChange={(e) => setPropertyValue(Number(e.target.value))}

                    style={getSliderStyle(propertyValue, "1000000", "100000000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>₹10 Lakh</span>
                    <span>₹10 Crore</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Borrower Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Borrower Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Primary Borrower Age</label>
                    <span className="text-sm font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">{primaryAge} Yr</span>
                  </div>
                  <input
                    type="range"
                    min="60"
                    max="90"
                    step="1"
                    value={primaryAge}
                    onChange={(e) => setPrimaryAge(Number(e.target.value))}

                    style={getSliderStyle(primaryAge, "60", "90")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeCoBorrower}
                      onChange={(e) => setIncludeCoBorrower(e.target.checked)}
                    />
                    Include Co-Borrower/Spouse
                  </label>
                  {includeCoBorrower && (
                    <div>
                      <div>
                        <span>Co-Borrower Age</span>
                        <span>{coBorrowerAge} Yr</span>
                      </div>
                      <input
                        type="range"
                        min="60"
                        max="90"
                        step="1"
                        value={coBorrowerAge}
                        onChange={(e) => setCoBorrowerAge(Number(e.target.value))}

                        style={getSliderStyle(coBorrowerAge, "60", "90")}
                        className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Loan Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Loan Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Loan Term (Years)</label>
                    <span className="text-sm font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">{loanTermYears} Yr</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="20"
                    step="1"
                    value={loanTermYears}
                    onChange={(e) => setLoanTermYears(Number(e.target.value))}

                    style={getSliderStyle(loanTermYears, "5", "20")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Disbursement Option</label>
                  <select
                    value={disbursementOption}
                    onChange={(e) => setDisbursementOption(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none font-semibold text-slate-800 bg-white"
                  >
                    <option value="Monthly Payments">Monthly Payments</option>
                    <option value="Lump Sum">Lump Sum</option>
                    <option value="Line of Credit">Line of Credit</option>
                  </select>
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
                <div className="p-6 pt-0 border-t border-slate-100 mt-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Interest Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}
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
                  <h2 className="text-xl font-bold tracking-tight">Reverse Mortgage Estimate</h2>
                  <button className="text-slate-400 hover:text-white transition-colors" title="Share">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-8">
                  <div className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-1">
                    {formatCurrency(monthlyPayment)}/month
                  </div>
                  <div className="text-slate-300 text-sm font-medium">Monthly Payment</div>
                </div>

                <div className="space-y-4 border-t border-slate-600/60 pt-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Maximum Loan Amount</span>
                    <span className="font-semibold text-white">{formatCurrency(maxLoanAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Net Proceeds After Costs</span>
                    <span className="font-semibold text-white">{formatCurrency(netProceeds)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Total Disbursements</span>
                    <span className="font-semibold text-white">{formatCurrency(totalDisbursements)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Final Loan Balance</span>
                    <span className="font-semibold text-rose-400">{formatCurrency(finalLoanBalance)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Estimated Equity Remaining</span>
                    <span className="font-semibold text-emerald-400">{formatCurrency(estimatedEquityRemaining)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-600/40">
                    <span className="text-slate-300">Income Gap Covered</span>
                    <span className="font-semibold text-emerald-400">{incomeGapCovered}%</span>
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
            <h2 className="text-xl font-bold text-[#113262] mb-4">What is Reverse Mortgage?</h2>
            <p className="text-slate-600">
              A reverse mortgage is a financial product that allows homeowners aged 60 or older to borrow money against the value of their home. Unlike a traditional mortgage, no monthly payments are required, and the loan is repaid when the borrower moves, sells the home, or passes away.
            </p>
          </section>

          <section className="pt-6">
            <h2 className="text-xl font-bold text-[#113262] mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">What is a reverse mortgage in India?</h3>
                <p className="text-sm text-slate-600">A reverse mortgage allows senior citizens (60+) to borrow against their self-owned residential property while continuing to live in it. The bank pays you a monthly amount, lump sum, or combination.</p>
              </div>

              <div className="pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">Is reverse mortgage income taxable?</h3>
                <p className="text-sm text-slate-600">Monthly payments received through reverse mortgage are treated as a loan and are NOT taxable as income. The property continues to be in the borrower's name.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

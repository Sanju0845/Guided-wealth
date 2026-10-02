import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

export default function DebtRepaymentCalculator() {
  const [strategy, setStrategy] = useState<'Avalanche' | 'Snowball'>('Avalanche');
  const [totalDebt, setTotalDebt] = useState<number>(500000);
  const [interestRate, setInterestRate] = useState<number>(24);
  const [monthlyPayment, setMonthlyPayment] = useState<number>(25000);
  const [minimumPayment, setMinimumPayment] = useState<number>(15000);

  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const [timeToFreedomMonths, setTimeToFreedomMonths] = useState<number>(0);
  const [totalInterestPaid, setTotalInterestPaid] = useState<number>(0);
  const [firstMonthInterest, setFirstMonthInterest] = useState<number>(0);
  const [extraMonthlySavings, setExtraMonthlySavings] = useState<number>(0);
  const [debtFreeDateStr, setDebtFreeDateStr] = useState<string>('');

  useEffect(() => {
    if (totalDebt <= 0 || monthlyPayment <= 0) {
      setTimeToFreedomMonths(0);
      setTotalInterestPaid(0);
      setFirstMonthInterest(0);
      setExtraMonthlySavings(0);
      setDebtFreeDateStr('');
      return;
    }

    const r = interestRate / 100 / 12;
    const initialInterest = totalDebt * r;
    const extra = Math.max(0, monthlyPayment - minimumPayment);

    if (monthlyPayment <= initialInterest) {
      // Payment lower than interest, infinite loop
      setTimeToFreedomMonths(999);
      setTotalInterestPaid(9999999);
      setFirstMonthInterest(initialInterest);
      setExtraMonthlySavings(extra);
      setDebtFreeDateStr('Never (Payment too low)');
      return;
    }

    let balance = totalDebt;
    let months = 0;
    let accumulatedInterest = 0;

    while (balance > 0 && months < 600) {
      months++;
      const interest = balance * r;
      accumulatedInterest += interest;
      const principal = monthlyPayment - interest;
      balance = Math.max(0, balance - principal);
    }

    const targetDate = new Date();
    targetDate.setMonth(targetDate.getMonth() + months);
    const dateStr = targetDate.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

    setTimeToFreedomMonths(months);
    setTotalInterestPaid(accumulatedInterest);
    setFirstMonthInterest(initialInterest);
    setExtraMonthlySavings(extra);
    setDebtFreeDateStr(dateStr);
  }, [strategy, totalDebt, interestRate, monthlyPayment, minimumPayment]);

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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Debt Repayment Calculator</h1>
        <p className="text-slate-600 text-base">Plan debt repayments with this calculator.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Inputs Column */}
          <div className="flex-1 space-y-6">
            {/* Payment Strategy */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Payment Strategy</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setStrategy('Avalanche')}
                  className={`py-3 px-4 rounded-xl border text-center font-semibold text-sm transition-all ${strategy === 'Avalanche'
                      ? 'bg-[#1e2a4f] text-white border-[#113262] shadow-sm'
                      : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  Debt Avalanche
                  <span className="block text-xs font-normal opacity-80 mt-0.5">Pay highest interest first</span>
                </button>
                <button
                  onClick={() => setStrategy('Snowball')}
                  className={`py-3 px-4 rounded-xl border text-center font-semibold text-sm transition-all ${strategy === 'Snowball'
                      ? 'bg-[#1e2a4f] text-white border-[#113262] shadow-sm'
                      : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  Debt Snowball
                  <span className="block text-xs font-normal opacity-80 mt-0.5">Pay smallest balance first</span>
                </button>
              </div>
            </div>

            {/* Current Debt Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Current Debt Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Total Debt Amount</label>
                  <input
                    type="number"
                    value={totalDebt}
                    onChange={(e) => setTotalDebt(Math.max(0, Number(e.target.value)))}
                  />
                  <div>
                    <input
                      type="range"
                      min="10000"
                      max="5000000"
                      step="10000"
                      value={totalDebt}
                      onChange={(e) => setTotalDebt(Number(e.target.value))}

                      style={getSliderStyle(totalDebt, "10000", "5000000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>₹10,000</span>
                      <span>₹50 Lakh</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Average Interest Rate (%)</label>
                    <span className="text-sm font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">{interestRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="36"
                    step="0.5"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}

                    style={getSliderStyle(interestRate, "5", "36")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>5%</span>
                    <span>36%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Payment Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Monthly Payment</label>
                  <input
                    type="number"
                    value={monthlyPayment}
                    onChange={(e) => setMonthlyPayment(Math.max(1000, Number(e.target.value)))}
                  />
                  <div>
                    <input
                      type="range"
                      min="4000"
                      max="100000"
                      step="1000"
                      value={monthlyPayment}
                      onChange={(e) => setMonthlyPayment(Number(e.target.value))}

                      style={getSliderStyle(monthlyPayment, "4000", "100000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>₹4,000</span>
                      <span>₹1 Lakh</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Minimum Payment</label>
                  <CurrencyInput
                    value={minimumPayment}
                    onValueChange={(val) => setMinimumPayment(val)}
                  />
                  <div>
                    <input
                      type="range"
                      min="1000"
                      max="50000"
                      step="500"
                      value={minimumPayment}
                      onChange={(e) => setMinimumPayment(Number(e.target.value))}

                      style={getSliderStyle(minimumPayment, "1000", "50000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>₹1,000</span>
                      <span>₹50,000</span>
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
                <div className="p-6 pt-0 border-t border-slate-100 mt-4 text-xs text-slate-500">
                  Paying extra above the minimum payment significantly reduces total interest paid and shortens the payoff period.
                </div>
              )}
            </div>
          </div>

          {/* Results Sidebar */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-[#1e2a4f] rounded-2xl shadow-xl p-6 md:p-8 text-white h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-bold tracking-tight">Debt Freedom Plan</h2>
                  <button className="text-slate-400 hover:text-white transition-colors" title="Share">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-8">
                  <div className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-1">
                    {timeToFreedomMonths < 900 ? `${timeToFreedomMonths} months` : 'N/A'}
                  </div>
                  <div className="text-slate-300 text-sm font-medium">Time to Debt Freedom</div>
                </div>

                <div className="space-y-4 border-t border-slate-600/60 pt-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Total Debt</span>
                    <span className="font-semibold text-white">{formatCurrency(totalDebt)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Total Interest</span>
                    <span className="font-semibold text-rose-400">{formatCurrency(totalInterestPaid)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Monthly Interest</span>
                    <span className="font-semibold text-rose-400">{formatCurrency(firstMonthInterest)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Extra Monthly Savings</span>
                    <span className="font-semibold text-emerald-400">{formatCurrency(extraMonthlySavings)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-600/40">
                    <span className="text-slate-300">Debt Free Date</span>
                    <span className="font-semibold text-white">{debtFreeDateStr}</span>
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
            <h2 className="text-xl font-bold text-[#113262] mb-4">Understanding Debt Repayment</h2>
            <p className="text-slate-600">
              Debt can be a significant financial burden that impacts your long-term financial health. The Debt Repayment Calculator is a strategic tool designed to help you develop a clear, personalized plan to systematically reduce and eliminate your outstanding debts.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">How Debt Repayment Works</h3>
            <p className="text-sm text-slate-600">
              Effective debt repayment involves understanding your total debt, interest rates, and creating a structured payment strategy. Different approaches like the snowball or avalanche methods can help you prioritize and systematically reduce your debt burden.
            </p>
          </section>

          <section className="pt-6">
            <h2 className="text-xl font-bold text-[#113262] mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">What is the best strategy to reduce debt?</h3>
                <p className="text-sm text-slate-600">Two proven approaches are the Avalanche method (pay highest-interest debt first, mathematically optimal) and Snowball method (pay smallest balance first for psychological wins).</p>
              </div>

              <div className="pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">Should I use savings to pay off debt?</h3>
                <p className="text-sm text-slate-600">If your debt interest rate exceeds your savings/investment return, use extra savings to pay off debt (e.g. credit card debt at 36-42%). Always maintain at least a 3-month emergency fund first.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

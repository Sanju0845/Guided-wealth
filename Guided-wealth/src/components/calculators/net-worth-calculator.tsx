import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

export default function NetWorthCalculator() {
  // Assets
  const [cashBank, setCashBank] = useState<number>(100000);
  const [equity, setEquity] = useState<number>(200000);
  const [mutualFunds, setMutualFunds] = useState<number>(300000);
  const [fixedDeposits, setFixedDeposits] = useState<number>(500000);
  const [propertyValue, setPropertyValue] = useState<number>(5000000);
  const [goldJewelry, setGoldJewelry] = useState<number>(1000000);

  // Liabilities
  const [homeLoan, setHomeLoan] = useState<number>(2000000);
  const [carLoan, setCarLoan] = useState<number>(500000);
  const [personalLoan, setPersonalLoan] = useState<number>(100000);
  const [creditCardDebt, setCreditCardDebt] = useState<number>(50000);
  const [otherLoans, setOtherLoans] = useState<number>(0);

  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Results
  const [totalAssets, setTotalAssets] = useState<number>(0);
  const [totalLiabilities, setTotalLiabilities] = useState<number>(0);
  const [netWorth, setNetWorth] = useState<number>(0);
  const [debtToAssetRatio, setDebtToAssetRatio] = useState<number>(0);
  const [liquidPct, setLiquidPct] = useState<number>(0);
  const [investmentPct, setInvestmentPct] = useState<number>(0);
  const [physicalPct, setPhysicalPct] = useState<number>(0);

  useEffect(() => {
    const assetsSum = cashBank + equity + mutualFunds + fixedDeposits + propertyValue + goldJewelry;
    const liabilitiesSum = homeLoan + carLoan + personalLoan + creditCardDebt + otherLoans;
    const nw = assetsSum - liabilitiesSum;
    const debtRatio = assetsSum > 0 ? (liabilitiesSum / assetsSum) * 100 : 0;

    const liquid = cashBank + fixedDeposits;
    const inv = equity + mutualFunds;
    const physical = propertyValue + goldJewelry;

    const lPct = assetsSum > 0 ? (liquid / assetsSum) * 100 : 0;
    const iPct = assetsSum > 0 ? (inv / assetsSum) * 100 : 0;
    const pPct = assetsSum > 0 ? (physical / assetsSum) * 100 : 0;

    setTotalAssets(assetsSum);
    setTotalLiabilities(liabilitiesSum);
    setNetWorth(nw);
    setDebtToAssetRatio(debtRatio);
    setLiquidPct(lPct);
    setInvestmentPct(iPct);
    setPhysicalPct(pPct);
  }, [cashBank, equity, mutualFunds, fixedDeposits, propertyValue, goldJewelry, homeLoan, carLoan, personalLoan, creditCardDebt, otherLoans]);

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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Net Worth Calculator</h1>
        <p className="text-slate-600 text-base">Assess financial health with this calculator.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Section */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Inputs Column */}
          <div className="flex-1 space-y-6">
            {/* Assets Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Assets</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Cash & Bank Balance</label>
                  <CurrencyInput
                    value={cashBank}
                    onValueChange={(val) => setCashBank(val)}
                  />
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="10000000"
                      step="10000"
                      value={cashBank}
                      onChange={(e) => setCashBank(Number(e.target.value))}

                      style={getSliderStyle(cashBank, "0", "10000000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Equity Holdings</label>
                  <input
                    type="number"
                    value={equity}
                    onChange={(e) => setEquity(Math.max(0, Number(e.target.value)))}
                  />
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="10000000"
                      step="10000"
                      value={equity}
                      onChange={(e) => setEquity(Number(e.target.value))}

                      style={getSliderStyle(equity, "0", "10000000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Mutual Funds</label>
                  <CurrencyInput
                    value={mutualFunds}
                    onValueChange={(val) => setMutualFunds(val)}
                  />
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="10000000"
                      step="10000"
                      value={mutualFunds}
                      onChange={(e) => setMutualFunds(Number(e.target.value))}

                      style={getSliderStyle(mutualFunds, "0", "10000000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Fixed Deposits</label>
                  <input
                    type="number"
                    value={fixedDeposits}
                    onChange={(e) => setFixedDeposits(Math.max(0, Number(e.target.value)))}
                  />
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="10000000"
                      step="10000"
                      value={fixedDeposits}
                      onChange={(e) => setFixedDeposits(Number(e.target.value))}

                      style={getSliderStyle(fixedDeposits, "0", "10000000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Property Value</label>
                  <CurrencyInput
                    value={propertyValue}
                    onValueChange={(val) => setPropertyValue(val)}
                  />
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="50000000"
                      step="100000"
                      value={propertyValue}
                      onChange={(e) => setPropertyValue(Number(e.target.value))}

                      style={getSliderStyle(propertyValue, "0", "50000000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Gold & Jewelry</label>
                  <input
                    type="number"
                    value={goldJewelry}
                    onChange={(e) => setGoldJewelry(Math.max(0, Number(e.target.value)))}
                  />
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="10000000"
                      step="10000"
                      value={goldJewelry}
                      onChange={(e) => setGoldJewelry(Number(e.target.value))}

                      style={getSliderStyle(goldJewelry, "0", "10000000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Liabilities Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Liabilities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Home Loan</label>
                  <CurrencyInput
                    value={homeLoan}
                    onValueChange={(val) => setHomeLoan(val)}
                  />
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="30000000"
                      step="50000"
                      value={homeLoan}
                      onChange={(e) => setHomeLoan(Number(e.target.value))}

                      style={getSliderStyle(homeLoan, "0", "30000000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Car Loan</label>
                  <CurrencyInput
                    value={carLoan}
                    onValueChange={(val) => setCarLoan(val)}
                  />
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="5000000"
                      step="10000"
                      value={carLoan}
                      onChange={(e) => setCarLoan(Number(e.target.value))}

                      style={getSliderStyle(carLoan, "0", "5000000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Personal Loan</label>
                  <CurrencyInput
                    value={personalLoan}
                    onValueChange={(val) => setPersonalLoan(val)}
                  />
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="2000000"
                      step="10000"
                      value={personalLoan}
                      onChange={(e) => setPersonalLoan(Number(e.target.value))}

                      style={getSliderStyle(personalLoan, "0", "2000000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Credit Card Debt</label>
                  <input
                    type="number"
                    value={creditCardDebt}
                    onChange={(e) => setCreditCardDebt(Math.max(0, Number(e.target.value)))}
                  />
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="1000000"
                      step="5000"
                      value={creditCardDebt}
                      onChange={(e) => setCreditCardDebt(Number(e.target.value))}

                      style={getSliderStyle(creditCardDebt, "0", "1000000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Other Loans</label>
                  <CurrencyInput
                    value={otherLoans}
                    onValueChange={(val) => setOtherLoans(val)}
                  />
                  <div>
                    <input
                      type="range"
                      min="0"
                      max="2000000"
                      step="10000"
                      value={otherLoans}
                      onChange={(e) => setOtherLoans(Number(e.target.value))}

                      style={getSliderStyle(otherLoans, "0", "2000000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
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
                  Calculates liquid assets (cash, FDs), investment assets (equity, MFs), and physical assets (real estate, gold).
                </div>
              )}
            </div>
          </div>

          {/* Results Sidebar */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-[#1e2a4f] rounded-2xl shadow-xl p-6 md:p-8 text-white h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-bold tracking-tight">Net Worth Summary</h2>
                  <button className="text-slate-400 hover:text-white transition-colors" title="Share">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-8">
                  <div className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-1">
                    {formatCurrency(netWorth)}
                  </div>
                  <div className="text-slate-300 text-sm font-medium">Total Net Worth</div>
                </div>

                <div className="space-y-4 border-t border-slate-600/60 pt-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Total Assets</span>
                    <span className="font-semibold text-white">{formatCurrency(totalAssets)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Total Liabilities</span>
                    <span className="font-semibold text-rose-400">{formatCurrency(totalLiabilities)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Debt-to-Asset Ratio</span>
                    <span className="font-semibold text-white">{debtToAssetRatio.toFixed(1)}%</span>
                  </div>

                  <div className="pt-2 border-t border-slate-600/40">
                    <div className="text-xs font-semibold text-slate-300 mb-2">Asset Allocation</div>
                    <div className="space-y-1.5 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Liquid Assets</span>
                        <span className="font-medium text-slate-200">{liquidPct.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Investment Assets</span>
                        <span className="font-medium text-slate-200">{investmentPct.toFixed(1)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Physical Assets</span>
                        <span className="font-medium text-slate-200">{physicalPct.toFixed(1)}%</span>
                      </div>
                    </div>
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
            <h2 className="text-xl font-bold text-[#113262] mb-4">Understanding Net Worth</h2>
            <p className="text-slate-600">
              Net worth is a powerful financial metric that provides a comprehensive snapshot of your overall financial health. The Net Worth Calculator helps you accurately assess your financial standing by calculating the difference between your total assets and liabilities.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">How Net Worth Calculation Works</h3>
            <p className="text-sm text-slate-600">
              Net worth is calculated by summing all your assets (such as savings, investments, real estate) and subtracting your total liabilities (like home loans, car loans, credit card debt). A positive net worth indicates financial strength.
            </p>
          </section>

          <section className="pt-6">
            <h2 className="text-xl font-bold text-[#113262] mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">How do I calculate my net worth?</h3>
                <p className="text-sm text-slate-600">Net worth = Total assets minus Total liabilities. Assets include bank balances, FDs, mutual funds, stocks, EPF/PPF, property, and gold. Liabilities include home loans, car loans, personal loans, and credit card debts.</p>
              </div>

              <div className="pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">What is a good net worth by age in India?</h3>
                <p className="text-sm text-slate-600">A rough benchmark: by age 30, net worth should be 1x annual income; by 40, it should be 3-5x; by 50, 8-12x; and by 60 (retirement), 20-25x annual living expenses.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

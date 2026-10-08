import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

export default function GoldInvestmentCalculator() {
  const [investmentType, setInvestmentType] = useState<'lumpsum' | 'sip'>('lumpsum');
  const [investmentAmount, setInvestmentAmount] = useState<number>(50000);
  const [goldPrice, setGoldPrice] = useState<number>(10000);
  const [expectedReturn, setExpectedReturn] = useState<number>(8);
  const [years, setYears] = useState<number>(5);

  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const [futureValue, setFutureValue] = useState<number>(0);
  const [totalInvestment, setTotalInvestment] = useState<number>(0);
  const [estimatedReturns, setEstimatedReturns] = useState<number>(0);
  const [goldWeight, setGoldWeight] = useState<number>(0);

  useEffect(() => {
    if (goldPrice <= 0 || investmentAmount <= 0 || years <= 0) {
      setFutureValue(0);
      setTotalInvestment(0);
      setEstimatedReturns(0);
      setGoldWeight(0);
      return;
    }

    if (investmentType === 'lumpsum') {
      const weight = investmentAmount / goldPrice;
      const fv = investmentAmount * Math.pow(1 + expectedReturn / 100, years);
      const estRet = fv - investmentAmount;

      setTotalInvestment(investmentAmount);
      setGoldWeight(weight);
      setFutureValue(fv);
      setEstimatedReturns(estRet);
    } else {
      const monthlyAmount = investmentAmount;
      const totalMonths = years * 12;
      const totInv = monthlyAmount * totalMonths;
      const weight = totInv / goldPrice;

      const r = expectedReturn / 100 / 12;
      const fv = monthlyAmount * ((Math.pow(1 + r, totalMonths) - 1) / r) * (1 + r);
      const estRet = fv - totInv;

      setTotalInvestment(totInv);
      setGoldWeight(weight);
      setFutureValue(fv);
      setEstimatedReturns(estRet);
    }
  }, [investmentType, investmentAmount, goldPrice, expectedReturn, years]);

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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Gold Investment Calculator</h1>
        <p className="text-slate-600 text-base">Calculate gold returns with this calculator.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Inputs */}
          <div className="flex-1 space-y-6">
            {/* Investment Type */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Investment Type</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setInvestmentType('lumpsum')}
                  className={`py-3 px-4 rounded-xl border text-center font-semibold text-sm transition-all ${investmentType === 'lumpsum'
                      ? 'bg-[#1e2a4f] text-white border-[#113262] shadow-sm'
                      : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  One-Time Investment
                </button>
                <button
                  onClick={() => setInvestmentType('sip')}
                  className={`py-3 px-4 rounded-xl border text-center font-semibold text-sm transition-all ${investmentType === 'sip'
                      ? 'bg-[#1e2a4f] text-white border-[#113262] shadow-sm'
                      : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200'
                    }`}
                >
                  Monthly Investment
                </button>
              </div>
            </div>

            {/* Investment Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Investment Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {investmentType === 'lumpsum' ? 'Investment Amount' : 'Monthly Amount'}
                  </label>
                  <input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(Math.max(0, Number(e.target.value)))}
                  />
                  <div>
                    <input
                      type="range"
                      min="1000"
                      max="1000000"
                      step="1000"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(Number(e.target.value))}

                      style={getSliderStyle(investmentAmount, "1000", "1000000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>₹1,000</span>
                      <span>₹10,00,000</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Gold Price (per gram)</label>
                  <CurrencyInput
                    value={goldPrice}
                    onValueChange={(val) => setGoldPrice(val)}
                  />
                  <div>
                    <input
                      type="range"
                      min="1000"
                      max="20000"
                      step="100"
                      value={goldPrice}
                      onChange={(e) => setGoldPrice(Number(e.target.value))}

                      style={getSliderStyle(goldPrice, "1000", "20000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>₹1,000</span>
                      <span>₹20,000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Growth Assumptions */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Growth Assumptions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Expected Return (%)</label>
                  <input
                    type="number"
                    value={expectedReturn}
                    onChange={(e) => setExpectedReturn(Number(e.target.value))}
                  />
                  <div>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      step="0.5"
                      value={expectedReturn}
                      onChange={(e) => setExpectedReturn(Number(e.target.value))}

                      style={getSliderStyle(expectedReturn, "1", "20")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>1%</span>
                      <span>20%</span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Investment Period (Years)</label>
                    <span className="text-sm font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">{years} Yr</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}

                    style={getSliderStyle(years, "1", "30")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>1 year</span>
                    <span>30 years</span>
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
                  Gold returns assume compounding capital appreciation. Sovereign Gold Bonds (SGBs) add an extra 2.5% annual coupon interest.
                </div>
              )}
            </div>
          </div>

          {/* Results Sidebar */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-[#1e2a4f] rounded-2xl shadow-xl p-6 md:p-8 text-white h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-bold tracking-tight">Investment Summary</h2>
                  <button className="text-slate-400 hover:text-white transition-colors" title="Share">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-8">
                  <div className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-1">
                    {formatCurrency(futureValue)}
                  </div>
                  <div className="text-slate-300 text-sm font-medium">Future Value</div>
                </div>

                <div className="space-y-4 border-t border-slate-600/60 pt-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Total Investment</span>
                    <span className="font-semibold text-white">{formatCurrency(totalInvestment)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Estimated Returns</span>
                    <span className="font-semibold text-emerald-400">{formatCurrency(estimatedReturns)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Gold Weight</span>
                    <span className="font-semibold text-amber-400">{goldWeight.toFixed(2)} grams</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-600/40">
                    <span className="text-slate-300">Gold Purity</span>
                    <span className="font-semibold text-white">24K</span>
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
            <h2 className="text-xl font-bold text-[#113262] mb-4">Understanding Gold Investment</h2>
            <p className="text-slate-600">
              Gold investment is a time-honored strategy for wealth preservation and diversification. As a tangible asset with intrinsic value, gold has been a reliable store of wealth across cultures and economic cycles, offering investors a hedge against inflation and market volatility.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">How Gold Investment Works</h3>
            <p className="text-sm text-slate-600">
              Investing in gold can take multiple forms, including physical gold (coins, bars, jewellery), Gold ETFs, Sovereign Gold Bonds (SGBs), and gold mutual funds.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">Why Invest in Gold?</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Portfolio diversification.</li>
              <li>Protection against economic uncertainty.</li>
              <li>Hedge against inflation.</li>
              <li>Potential for long-term capital appreciation.</li>
              <li>Globally recognized store of value.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[#113262] mb-4">Gold Investment Options Compared</h3>
            <p className="text-slate-600">
              Sovereign Gold Bonds offer the best risk-adjusted returns due to the 2.5% annual coupon interest and zero LTCG tax on maturity. Gold ETFs suit investors who want liquidity on stock exchanges. Physical gold carries making charges and storage risks.
            </p>
          </section>

          <section className="pt-6">
            <h2 className="text-xl font-bold text-[#113262] mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">How do I calculate returns on gold investment in India?</h3>
                <p className="text-sm text-slate-600">Enter your investment amount, period, and expected annual gold price appreciation (historically 8-10% in INR terms). The calculator projects future value and returns.</p>
              </div>

              <div className="border-b border-slate-200 pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">Which is better: SGB, Gold ETF, or physical gold?</h3>
                <p className="text-sm text-slate-600">Sovereign Gold Bonds (SGBs) are optimal for long-term investors due to 2.5% annual interest and tax-free maturity after 8 years.</p>
              </div>

              <div className="pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">What percentage of my portfolio should be in gold?</h3>
                <p className="text-sm text-slate-600">Financial planners typically recommend 5-15% of your portfolio in gold as a crisis hedge and stabilizing asset during equity market pullbacks.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

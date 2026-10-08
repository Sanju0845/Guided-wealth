import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

export default function StockReturnCalculator() {
  const [investmentType, setInvestmentType] = useState<'lumpsum' | 'sip'>('lumpsum');
  const [investmentAmount, setInvestmentAmount] = useState<number>(100000);
  const [buyPrice, setBuyPrice] = useState<number>(100);
  const [currentPrice, setCurrentPrice] = useState<number>(150);
  const [dividendYield, setDividendYield] = useState<number>(2);
  const [years, setYears] = useState<number>(3);
  const [inflationRate, setInflationRate] = useState<number>(6);

  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const [totalValue, setTotalValue] = useState<number>(0);
  const [totalInvestment, setTotalInvestment] = useState<number>(0);
  const [totalUnits, setTotalUnits] = useState<number>(0);
  const [totalDividends, setTotalDividends] = useState<number>(0);
  const [absoluteReturn, setAbsoluteReturn] = useState<number>(0);
  const [cagr, setCagr] = useState<number>(0);
  const [realReturn, setRealReturn] = useState<number>(0);

  useEffect(() => {
    if (buyPrice <= 0 || currentPrice < 0 || years <= 0) {
      setTotalValue(0);
      setTotalInvestment(0);
      setTotalUnits(0);
      setTotalDividends(0);
      setAbsoluteReturn(0);
      setCagr(0);
      setRealReturn(0);
      return;
    }

    if (investmentType === 'lumpsum') {
      const units = investmentAmount / buyPrice;
      const capitalValue = units * currentPrice;
      // Dividend calculated annually on initial or average price
      const annualDividendPerUnit = buyPrice * (dividendYield / 100);
      const divEarned = units * annualDividendPerUnit * years;
      const finalValue = capitalValue + divEarned;

      const absReturn = ((finalValue - investmentAmount) / investmentAmount) * 100;
      const cagrVal = (Math.pow(Math.max(0.00001, finalValue / investmentAmount), 1 / years) - 1) * 100;
      const realVal = ((1 + cagrVal / 100) / (1 + inflationRate / 100) - 1) * 100;

      setTotalInvestment(investmentAmount);
      setTotalUnits(units);
      setTotalDividends(divEarned);
      setTotalValue(finalValue);
      setAbsoluteReturn(absReturn);
      setCagr(cagrVal);
      setRealReturn(realVal);
    } else {
      // SIP calculation
      const monthlyAmount = investmentAmount;
      const totalMonths = years * 12;
      const totInv = monthlyAmount * totalMonths;

      // Price appreciation rate over period
      const priceGrowthFactor = currentPrice / buyPrice;
      const monthlyGrowthRate = Math.pow(priceGrowthFactor, 1 / totalMonths) - 1;

      let accumulatedUnits = 0;
      let totalDivs = 0;

      for (let m = 1; m <= totalMonths; m++) {
        const priceAtMonth = buyPrice * Math.pow(1 + monthlyGrowthRate, m - 1);
        const unitsPurchased = monthlyAmount / priceAtMonth;
        accumulatedUnits += unitsPurchased;

        // Pro-rated dividend
        const monthsHeld = totalMonths - m + 1;
        const yearsHeld = monthsHeld / 12;
        totalDivs += unitsPurchased * (priceAtMonth * (dividendYield / 100)) * yearsHeld;
      }

      const capitalValue = accumulatedUnits * currentPrice;
      const finalValue = capitalValue + totalDivs;

      const absReturn = ((finalValue - totInv) / totInv) * 100;
      const cagrVal = (Math.pow(Math.max(0.00001, finalValue / totInv), 1 / years) - 1) * 100;
      const realVal = ((1 + cagrVal / 100) / (1 + inflationRate / 100) - 1) * 100;

      setTotalInvestment(totInv);
      setTotalUnits(accumulatedUnits);
      setTotalDividends(totalDivs);
      setTotalValue(finalValue);
      setAbsoluteReturn(absReturn);
      setCagr(cagrVal);
      setRealReturn(realVal);
    }
  }, [investmentType, investmentAmount, buyPrice, currentPrice, dividendYield, years, inflationRate]);

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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Stock Return Calculator</h1>
        <p className="text-slate-600 text-base">Calculate Your Stock Investment Returns</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Section */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Left Column: Inputs */}
          <div className="flex-1 space-y-6">
            {/* Investment Type */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Investment Type</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setInvestmentType('lumpsum')}
                  className={`py-3 px-4 rounded-xl border text-center font-semibold text-sm transition-all ${investmentType === 'lumpsum'
                      ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  Lumpsum
                  <span className="block text-xs font-normal text-slate-500 mt-0.5">One-time investment</span>
                </button>
                <button
                  onClick={() => setInvestmentType('sip')}
                  className={`py-3 px-4 rounded-xl border text-center font-semibold text-sm transition-all ${investmentType === 'sip'
                      ? 'bg-blue-50 border-blue-600 text-blue-700 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                >
                  SIP
                  <span className="block text-xs font-normal text-slate-500 mt-0.5">Monthly investment</span>
                </button>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  {investmentType === 'lumpsum' ? 'Investment Amount' : 'Monthly SIP Amount'}
                </label>
                <div className="relative mb-3">
                  <span className="absolute left-3.5 top-3 text-slate-400 font-medium">₹</span>
                  <input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(Math.max(0, Number(e.target.value)))}
                  />
                </div>
                <input
                  type="range"
                  min="500"
                  max="1000000"
                  step="500"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(Number(e.target.value))}

                  style={getSliderStyle(investmentAmount, "500", "1000000")}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                  <span>₹500</span>
                  <span>₹10,00,000</span>
                </div>
              </div>
            </div>

            {/* Stock Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Stock Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Buy Price (₹)</label>
                  <CurrencyInput
                    value={buyPrice}
                    onValueChange={(val) => setBuyPrice(val)}
                  />
                </div>
                <div>
                  <label>Current / Sale Price (₹)</label>
                  <CurrencyInput
                    value={currentPrice}
                    onValueChange={(val) => setCurrentPrice(val)}
                  />
                </div>
                <div>
                  <label>Dividend Yield (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={dividendYield}
                    onChange={(e) => setDividendYield(Math.max(0, Number(e.target.value)))}
                  />
                </div>
                <div>
                  <div>
                    <label>Investment Period (Years)</label>
                    <span>{years} Yr</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}

                    style={getSliderStyle(buyPrice, "1", "30")}
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
                <div className="p-6 pt-0 border-t border-slate-100 mt-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Expected Inflation Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(Number(e.target.value))}
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
                  <h2 className="text-xl font-bold tracking-tight">Return Summary</h2>
                  <button className="text-slate-400 hover:text-white transition-colors" title="Share">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-8">
                  <div className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-1">
                    {formatCurrency(totalValue)}
                  </div>
                  <div className="text-slate-300 text-sm font-medium">Total Value (including dividend)</div>
                </div>

                <div className="space-y-3 border-t border-slate-600/60 pt-6 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Total Investment</span>
                    <span className="font-semibold text-white">{formatCurrency(totalInvestment)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Total Units</span>
                    <span className="font-semibold text-white">{totalUnits.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Total Dividends</span>
                    <span className="font-semibold text-emerald-400">{formatCurrency(totalDividends)}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-slate-600/40">
                    <span className="text-slate-300">Absolute Return</span>
                    <span className={`font-semibold ${absoluteReturn >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {absoluteReturn.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">XIRR / CAGR</span>
                    <span className={`font-semibold ${cagr >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {cagr.toFixed(2)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300">Real Return (Inflation Adj)</span>
                    <span className={`font-semibold ${realReturn >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {realReturn.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              <button className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2">
                Portfolio Review <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Informational Content */}
        <div className="max-w-4xl space-y-12 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#113262] mb-4">What is Stock Return?</h2>
            <p className="text-slate-600">
              Stock return refers to the total gain or loss generated from investing in stocks over a specific period. It includes capital appreciation (or losses) from changes in stock price and cash dividends received.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">Key Features</h3>
            <p className="text-sm text-slate-600">
              Stock returns can be calculated for different time periods like daily, monthly, or annually. They are influenced by market conditions, company performance, sector growth, and economic indicators.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">Types of Stock Returns</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong className="text-slate-800">Absolute Return:</strong> Total percentage return on investment regardless of holding period.</li>
              <li><strong className="text-slate-800">Annualized Return / CAGR:</strong> The geometric mean growth rate per year over the holding period.</li>
              <li><strong className="text-slate-800">Total Return:</strong> Combined value of capital appreciation plus dividend payouts.</li>
              <li><strong className="text-slate-800">Real Return:</strong> Inflation-adjusted return showing actual purchasing power growth.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">Tax Implications</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong className="text-slate-800">Short-Term Capital Gains (STCG):</strong> Equity held ≤ 12 months taxed at 20%.</li>
              <li><strong className="text-slate-800">Long-Term Capital Gains (LTCG):</strong> Equity held &gt; 12 months taxed at 12.5% on gains above ₹1.25 Lakh.</li>
              <li><strong className="text-slate-800">Dividends:</strong> Taxed at investor's applicable income tax slab rates.</li>
            </ul>
          </section>

          <section className="pt-6">
            <h2 className="text-xl font-bold text-[#113262] mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">How do I calculate stock returns accurately?</h3>
                <p className="text-sm text-slate-600">Enter the purchase price, sale/current price, holding period, and dividends earned. For multi-year holdings, CAGR or XIRR provides the truest annual return metric.</p>
              </div>

              <div className="pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">Why is dividend yield important in total return?</h3>
                <p className="text-sm text-slate-600">Dividends provide steady cash income that compounds over time. Excluding dividends underestimates your true total stock return significantly over multi-year periods.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

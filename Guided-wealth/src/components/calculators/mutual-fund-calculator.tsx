import React, { useState, useEffect } from 'react';
import { CurrencyInput } from '../ui/CurrencyInput';
import { Share2, ChevronDown } from 'lucide-react';

export default function MutualFundCalculator() {
  const [calcType, setCalcType] = useState<'sip' | 'lumpsum'>('sip');
  const [investment, setInvestment] = useState<number>(5000);
  const [rate, setRate] = useState<number>(12);
  const [years, setYears] = useState<number>(10);
  const [inflationRate, setInflationRate] = useState<number>(6);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  
  const [maturityAmount, setMaturityAmount] = useState<number>(0);
  const [inflationAdjusted, setInflationAdjusted] = useState<number>(0);
  const [totalInvested, setTotalInvested] = useState<number>(0);

  useEffect(() => {
    if (investment > 0 && rate > 0 && years > 0) {
      let amount = 0;
      let invested = 0;
      
      if (calcType === 'sip') {
        const monthlyRate = rate / 100 / 12;
        const months = years * 12;
        amount = investment * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate * (1 + monthlyRate);
        invested = investment * months;
      } else {
        amount = investment * Math.pow(1 + rate / 100, years);
        invested = investment;
      }
      
      setMaturityAmount(amount);
      setTotalInvested(invested);
      
      const adj = amount / Math.pow(1 + inflationRate / 100, years);
      setInflationAdjusted(adj);
    } else {
      setMaturityAmount(0);
      setTotalInvested(0);
      setInflationAdjusted(0);
    }
  }, [investment, rate, years, calcType, inflationRate]);

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
      <div className="bg-white pt-32 pb-10 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Mutual Fund Tracker</h1>
        <p className="text-slate-600 text-base">Achieve Financial Goals with Mutual Fund Calculator</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          <div className="flex-1 space-y-6">
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Investment Type</h2>
              <div className="flex bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setCalcType('sip')}
                  className={`flex-1 py-3 text-sm font-semibold rounded-md transition-all ${
                    calcType === 'sip' 
                      ? 'bg-[#1e2a4f] text-white shadow-md' 
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  SIP Calculator
                </button>
                <button
                  onClick={() => setCalcType('lumpsum')}
                  className={`flex-1 py-3 text-sm font-semibold rounded-md transition-all ${
                    calcType === 'lumpsum' 
                      ? 'bg-[#1e2a4f] text-white shadow-md' 
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  Lumpsum Calculator
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Investment Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {calcType === 'sip' ? 'Monthly SIP' : 'Total Investment'}
                  </label>
                  <CurrencyInput
                    value={investment}
                    onValueChange={(val) => setInvestment(val)}
                  />
                  <div>
                    <input
                      type="range"
                      min={calcType === 'sip' ? "500" : "5000"}
                      max={calcType === 'sip' ? "100000" : "10000000"}
                      step={calcType === 'sip' ? "500" : "1000"}
                      value={investment}
                      onChange={(e) => setInvestment(Number(e.target.value))}
                    
                      style={getSliderStyle(investment, calcType === 'sip' ? "500" : "5000", calcType === 'sip' ? "100000" : "10000000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>{calcType === 'sip' ? '₹500' : '₹5K'}</span>
                      <span>{calcType === 'sip' ? '₹1L' : '₹1Cr'}</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Expected Returns (%)</label>
                  <input
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                  />
                  <div>
                    <input
                      type="range"
                      min="1"
                      max="30"
                      step="0.1"
                      value={rate}
                      onChange={(e) => setRate(Number(e.target.value))}
                    
                      style={getSliderStyle(rate, "1", "30")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>1%</span>
                      <span>30%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Investment Horizon</h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Years</label>
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                />
                <div>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    step="1"
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                  
                      style={getSliderStyle(years, "1", "40")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>1 Year</span>
                    <span>40 Years</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <button 
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full p-6 flex justify-between items-center text-left hover:bg-slate-50 transition-colors"
              >
                <h2 className="text-lg font-bold text-slate-900">Advanced Settings</h2>
                <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
              </button>
              
              {showAdvanced && (
                <div className="p-6 pt-0 border-t border-slate-100">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Expected Inflation Rate (%)</label>
                  <input
                    type="number"
                    value={inflationRate}
                    onChange={(e) => setInflationRate(Number(e.target.value))}
                    className="w-full md:w-1/2 p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all"
                  />
                </div>
              )}
            </div>

          </div>

          <div className="w-full lg:w-[400px]">
            <div className="bg-[#1e2a4f] rounded-2xl shadow-lg p-5 text-white h-full flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">Projection</h2>
                <button className="text-slate-300 hover:text-white transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center mb-10">
                <div className="text-4xl font-bold mb-1">{formatCurrency(maturityAmount)}</div>
                <div className="text-slate-300 text-sm">Maturity Value</div>
              </div>

              <div className="flex-1">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-600">
                    <span className="text-slate-300 text-sm">Inflation Adjusted</span>
                    <span className="font-semibold">{formatCurrency(inflationAdjusted)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-600">
                    <span className="text-slate-300 text-sm">Total Invested</span>
                    <span className="font-semibold">{formatCurrency(totalInvested)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">Investment Period</span>
                    <span className="font-semibold">{years} Years</span>
                  </div>
                </div>
              </div>

              <button className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2">
                Start {calcType === 'sip' ? 'SIP' : 'Lumpsum'} Now <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl space-y-12 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#113262] mb-4">What are Mutual Funds?</h2>
            <p className="text-sm mb-6">
              Mutual Funds are investment vehicles that pool money from multiple investors to invest in diversified portfolios of stocks, bonds, or other securities. They offer professional management, liquidity, and the benefit of diversification. Investments in Mutual Funds qualify for tax benefits under Section 80C of the Income Tax Act, 1961, and long-term capital gains have favorable tax treatment.
            </p>

            <h3 className="text-lg font-bold text-[#113262] mb-4">Investment Options</h3>
            <p className="text-sm mb-6">
              Mutual Funds offer various investment plans including Systematic Investment Plans (SIPs) and Lumpsum investments. SIPs allow regular investments starting from ₹500 per month, while Lumpsum investments typically start from ₹5,000. Investors can choose between equity, debt, hybrid, or sector-specific funds based on their risk appetite.
            </p>

            <h3 className="text-lg font-bold text-[#113262] mb-4">Investment Horizon</h3>
            <p className="text-sm mb-6">
              Equity Mutual Funds are ideal for long-term goals (5+ years), while debt funds suit short to medium-term objectives. Most funds have no lock-in period except ELSS (Tax-saving) funds which have a 3-year lock-in. Systematic Withdrawal Plans (SWPs) allow periodic redemptions after investment maturity.
            </p>

            <h3 className="text-lg font-bold text-[#113262] mb-4">How to start investing?</h3>
            <p className="text-sm mb-2">To begin your Mutual Fund journey, you'll need:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm mb-6">
              <li>PAN Card</li>
              <li>KYC documents</li>
              <li>Bank account details</li>
              <li>Investment plan selection</li>
            </ul>

            <h3 className="text-lg font-bold text-[#113262] mb-4">Why invest in Mutual Funds?</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm mb-6">
              <li>Professional fund management by experts</li>
              <li>Diversification across assets and sectors</li>
              <li>Flexible investment amounts and frequencies</li>
              <li>Transparent NAV-based pricing</li>
              <li>Options for different risk profiles</li>
            </ul>

            <h3 className="text-lg font-bold text-[#113262] mb-4">How are returns calculated?</h3>
            <p className="text-sm mb-6">
              Mutual Fund returns are calculated using Compounded Annual Growth Rate (CAGR). For SIPs, returns are calculated using XIRR to account for multiple investments at different times. Returns depend on market performance and are subject to capital market risks.
            </p>

            <h3 className="text-lg font-bold text-[#113262] mb-4">Using the Guided Wealthy MF Calculator</h3>
            <p className="text-sm mb-6">
              Input your investment amount, expected return rate, and investment duration. Our calculator will project potential returns for both SIP and Lumpsum investments. This tool helps compare scenarios, understand compounding benefits, and make informed investment decisions aligned with your financial goals.
            </p>
          </section>

          <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-slate-200 mt-8">
            <section>
              <h2 className="text-xl font-bold text-[#113262] mb-4">Calculating Your Mutual Fund Performance</h2>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <p className="text-sm text-slate-700">
                  This calculator helps you compute the absolute returns, annualized returns (CAGR), and projected future value of your mutual fund investments. Whether you invested via lump sum or SIP, enter your investment details to see how your money has grown and project future wealth.
                </p>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-[#113262] mb-8">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-6">
                  <h3 className="font-semibold text-slate-900 mb-2">How do I calculate mutual fund returns?</h3>
                  <p className="text-sm text-slate-600">Mutual fund returns can be calculated using CAGR for lump sum investments or XIRR for SIP investments. Enter your investment amount, current value, and holding period. For SIPs, each installment has a different holding period, so XIRR gives the most accurate annualized return.</p>
                </div>
                
                <div className="border-b border-slate-200 pb-6">
                  <h3 className="font-semibold text-slate-900 mb-2">What is the difference between direct and regular mutual funds?</h3>
                  <p className="text-sm text-slate-600">Direct plans have lower expense ratios (0.5-1% less) because they bypass distributors. Over 10-20 years, this difference can result in 15-25% more wealth. Always invest in direct plans unless you specifically need advisor services.</p>
                </div>

                <div className="pb-6">
                  <h3 className="font-semibold text-slate-900 mb-2">How are mutual fund returns taxed?</h3>
                  <p className="text-sm text-slate-600">Equity funds: STCG (under 1 year) at 20%, LTCG (over 1 year) at 12.5% above Rs 1.25 lakh. Debt funds: all gains taxed at your slab rate regardless of holding period. Hybrid funds follow equity taxation if equity allocation exceeds 65%.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { CurrencyInput } from '../ui/CurrencyInput';
import { Share2, ChevronDown } from 'lucide-react';

export default function Sip() {
  const [calcType, setCalcType] = useState<'sip' | 'lumpsum'>('sip');
  const [investment, setInvestment] = useState<number>(5000);
  const [rate, setRate] = useState<number>(12);
  const [years, setYears] = useState<number>(5);
  const [showStepUp, setShowStepUp] = useState<boolean>(false);
  
  const [maturityAmount, setMaturityAmount] = useState<number>(0);
  const [totalInvestment, setTotalInvestment] = useState<number>(0);
  const [interestEarned, setInterestEarned] = useState<number>(0);

  useEffect(() => {
    if (investment > 0 && rate > 0 && years > 0) {
      if (calcType === 'sip') {
        const monthlyRate = rate / 100 / 12;
        const months = years * 12;
        // SIP Maturity formula
        const amount = investment * (Math.pow(1 + monthlyRate, months) - 1) / monthlyRate * (1 + monthlyRate);
        const invested = investment * months;
        
        setMaturityAmount(amount);
        setTotalInvestment(invested);
        setInterestEarned(amount - invested);
      } else {
        // Lumpsum Maturity formula
        const amount = investment * Math.pow(1 + rate / 100, years);
        const invested = investment;
        
        setMaturityAmount(amount);
        setTotalInvestment(invested);
        setInterestEarned(amount - invested);
      }
    } else {
      setMaturityAmount(0);
      setTotalInvestment(0);
      setInterestEarned(0);
    }
  }, [investment, rate, years, calcType]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Donut chart calculations
  const radius = 35;
  const circumference = 2 * Math.PI * radius;
  const returnsPercentage = maturityAmount > 0 ? (interestEarned / maturityAmount) : 0;
  const strokeDasharray = `${returnsPercentage * circumference} ${circumference}`;
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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">SIP Calculator</h1>
        <p className="text-slate-600 text-base">Calculate your Systematic Investment Plan returns</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Calculator Section */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Left Column: Inputs */}
          <div className="flex-1 space-y-6">
            
            {/* Calculation Type Toggle */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Calculation Type</h2>
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

            {/* Investment Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Investment Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    {calcType === 'sip' ? 'Monthly Investment' : 'Total Investment'}
                  </label>
                  <CurrencyInput
                    value={investment}
                    onValueChange={(val) => setInvestment(val)}
                  />
                  <div>
                    <input
                      type="range"
                      min={calcType === 'sip' ? "500" : "10000"}
                      max={calcType === 'sip' ? "100000" : "10000000"}
                      step={calcType === 'sip' ? "500" : "10000"}
                      value={investment}
                      onChange={(e) => setInvestment(Number(e.target.value))}
                    
                      style={getSliderStyle(investment, calcType === 'sip' ? "500" : "10000", calcType === 'sip' ? "100000" : "10000000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>{calcType === 'sip' ? '₹500' : '₹10K'}</span>
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

            {/* Time Period */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Time Period</h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Investment Duration (Years)</label>
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

            {/* Step Up Options */}
            {calcType === 'sip' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <button 
                  onClick={() => setShowStepUp(!showStepUp)}
                  className="w-full p-6 flex justify-between items-center text-left hover:bg-slate-50 transition-colors"
                >
                  <h2 className="text-lg font-bold text-slate-900">Step Up Options</h2>
                  <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${showStepUp ? 'rotate-180' : ''}`} />
                </button>
                
                {showStepUp && (
                  <div className="p-6 pt-0 border-t border-slate-100">
                    <p className="text-sm text-slate-600">Step up SIP helps you increase your investment amount periodically to match your income growth.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Results */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-[#1e2a4f] rounded-2xl shadow-lg p-5 text-white h-full flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">{calcType === 'sip' ? 'SIP Returns' : 'Lumpsum Returns'}</h2>
                <button className="text-slate-300 hover:text-white transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center mb-8">
                <div className="text-4xl font-bold mb-1">{formatCurrency(maturityAmount)}</div>
                <div className="text-slate-300 text-sm">Maturity Value</div>
              </div>

              {/* Donut Chart */}
              <div className="flex justify-center mb-10 relative">
                <svg width="120" height="120" viewBox="0 0 100 100" className="transform -rotate-90">
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="transparent"
                    stroke="#d97706" // Yellow for Invested
                    strokeWidth="14"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r={radius}
                    fill="transparent"
                    stroke="#3b82f6" // Blue for Returns
                    strokeWidth="14"
                    strokeDasharray={strokeDasharray}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
              </div>

              <div className="flex-1">
                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-slate-600">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#d97706]"></div>
                      <span className="text-slate-300 text-sm">Invested Amount</span>
                    </div>
                    <span className="font-semibold">{formatCurrency(totalInvestment)}</span>
                  </div>
                  <div className="flex justify-between items-center pb-3 border-b border-slate-600">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-[#3b82f6]"></div>
                      <span className="text-slate-300 text-sm">Estimated Returns</span>
                    </div>
                    <span className="font-semibold">{formatCurrency(interestEarned)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm pl-5">Investment Period</span>
                    <span className="font-semibold">{years} Years</span>
                  </div>
                </div>
              </div>

              <button className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2">
                Start {calcType === 'sip' ? 'SIP' : 'Lumpsum'} Investment <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Informational Content Section */}
        <div className="max-w-4xl space-y-12 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#113262] mb-4">Understanding Systematic Investment Plans (SIPs)</h2>
            <p className="text-sm">
              A Systematic Investment Plan (SIP) is a smart, disciplined approach to wealth creation that allows investors to build their financial future incrementally. Unlike traditional lump-sum investments, SIPs enable you to invest small, consistent amounts at regular intervals, typically monthly.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">How SIPs Work</h3>
            <p className="text-sm">
              Imagine planting a financial seed and nurturing it gradually. With a SIP, you commit to investing a fixed amount into mutual funds or other investment vehicles. This approach helps you leverage the power of rupee-cost averaging, where market fluctuations work in your favor by allowing you to buy more units when prices are low.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">Why Choose SIP?</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Flexibility to start with small investments</li>
              <li>Reduces impact of market volatility</li>
              <li>Promotes financial discipline</li>
              <li>Potential for long-term wealth accumulation</li>
              <li>Convenient and automated investment process</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">Understanding the SIP Calculator</h3>
            <p className="text-sm">
              Our SIP calculator is a powerful tool designed to help you visualize your financial journey. By inputting your investment amount, duration, and expected returns, you can forecast potential wealth creation and make informed investment decisions tailored to your financial goals.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

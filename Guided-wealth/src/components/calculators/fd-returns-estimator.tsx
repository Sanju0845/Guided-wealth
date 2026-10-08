import React, { useState, useEffect, ChangeEvent } from 'react';
import { CurrencyInput } from '../ui/CurrencyInput';
import { Share2, ChevronDown } from 'lucide-react';

export default function FdReturnsEstimator() {
  const [principal, setPrincipal] = useState<number>(100000);
  const [rate, setRate] = useState<number>(8);
  const [years, setYears] = useState<number>(6);
  const [frequency, setFrequency] = useState<number>(1); // 1 = Annually
  const [showSettings, setShowSettings] = useState<boolean>(false);
  
  const [maturityAmount, setMaturityAmount] = useState<number>(0);
  const [interestEarned, setInterestEarned] = useState<number>(0);

  useEffect(() => {
    if (principal > 0 && rate > 0 && years > 0) {
      // A = P(1 + r/n)^(nt)
      const r = rate / 100;
      const n = frequency;
      const t = years;
      
      const amount = principal * Math.pow(1 + r / n, n * t);
      const interest = amount - principal;
      
      setMaturityAmount(amount);
      setInterestEarned(interest);
    } else {
      setMaturityAmount(0);
      setInterestEarned(0);
    }
  }, [principal, rate, years, frequency]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const getFrequencyText = (freq: number) => {
    switch (freq) {
      case 1: return "Annually";
      case 2: return "Semi-Annually";
      case 4: return "Quarterly";
      case 12: return "Monthly";
      default: return "Annually";
    }
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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">FD Calculator</h1>
        <p className="text-slate-600 text-base">Calculate your Fixed Deposit returns</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {/* Calculator Section */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Left Column: Inputs */}
          <div className="flex-1 space-y-6">
            {/* Investment Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Investment Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Principal Amount</label>
                  <CurrencyInput
                    value={principal}
                    onValueChange={(val) => setPrincipal(val)}
                  />
                  <div>
                    <input
                      type="range"
                      min="10000"
                      max="100000000"
                      step="10000"
                      value={principal}
                      onChange={(e) => setPrincipal(Number(e.target.value))}
                    
                      style={getSliderStyle(principal, "10000", "100000000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>₹1L</span>
                      <span>₹10Cr</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Interest Rate (%)</label>
                  <input
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                  />
                  <div>
                    <input
                      type="range"
                      min="1"
                      max="20"
                      step="0.1"
                      value={rate}
                      onChange={(e) => setRate(Number(e.target.value))}
                    
                      style={getSliderStyle(rate, "1", "20")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>1%</span>
                      <span>20%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Time Period */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Time Period</h2>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Investment Period (Years)</label>
                <input
                  type="number"
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                />
                <div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                  
                      style={getSliderStyle(years, "1", "10")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>1 year</span>
                    <span>10 years</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Settings */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="w-full p-6 flex justify-between items-center text-left hover:bg-slate-50 transition-colors"
              >
                <h2 className="text-lg font-bold text-slate-900">Additional Settings</h2>
                <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${showSettings ? 'rotate-180' : ''}`} />
              </button>
              
              {showSettings && (
                <div className="p-6 pt-0 border-t border-slate-100">
                  <label className="block text-sm font-medium text-slate-700 mb-2">Compounding Frequency</label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(Number(e.target.value))}
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all bg-white"
                  >
                    <option value={1}>Annually</option>
                    <option value={2}>Semi-Annually</option>
                    <option value={4}>Quarterly</option>
                    <option value={12}>Monthly</option>
                  </select>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Results */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-[#1e2a4f] rounded-2xl shadow-lg p-5 text-white h-full flex flex-col">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-lg font-semibold">FD Returns</h2>
                <button className="text-slate-300 hover:text-white transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-8">
                <div className="text-4xl font-bold mb-1">{formatCurrency(maturityAmount)}</div>
                <div className="text-slate-300 text-sm">Maturity Amount</div>
              </div>

              <div className="flex-1">
                <div className="text-sm font-medium text-slate-300 mb-4 border-b border-slate-600 pb-2">Investment Breakdown</div>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">Principal Amount</span>
                    <span className="font-semibold">{formatCurrency(principal)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">Interest Earned</span>
                    <span className="font-semibold">{formatCurrency(interestEarned)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-300 text-sm">Compounding</span>
                    <span className="font-semibold">{getFrequencyText(frequency)}</span>
                  </div>
                </div>
              </div>

              <button className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2">
                Start Investing <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Informational Content Section */}
        <div className="max-w-4xl space-y-12 text-slate-700 leading-relaxed">
          
          <section>
            <h2 className="text-xl font-bold text-[#113262] mb-4">Understanding Fixed Deposits</h2>
            <p className="mb-4">
              A Fixed Deposit (FD) represents a secure investment avenue where investors can place their funds with banks or NBFCs for predetermined periods, typically ranging from one week to a decade. This investment vehicle offers guaranteed returns through interest rates that generally outperform standard savings accounts, typically falling between 5% and 7.5% annually.
            </p>
            <p>
              A Fixed Deposit is a financial instrument where you deposit a lump sum with a bank or NBFC for a fixed tenure at a predetermined interest rate. FDs are among the safest investment options in India, backed by DICGC insurance up to Rs 5 lakh. They suit conservative investors seeking guaranteed returns with zero market risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#113262] mb-4">Key Advantages of Fixed Deposits</h2>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <ul className="list-disc pl-5 space-y-3 text-sm">
                <li>Secure investment option ideal for conservative investors</li>
                <li>Competitive interest rates surpassing regular savings accounts</li>
                <li>Quarterly interest compounding with maturity payout flexibility</li>
                <li>Built-in savings discipline through fixed tenure commitments</li>
                <li>Tax benefits available under Section 80C of Income Tax Act</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#113262] mb-4">Starting Your Fixed Deposit Journey</h2>
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <ol className="list-decimal pl-5 space-y-3 text-sm">
                <li>Select a trusted bank or NBFC as your investment partner</li>
                <li>Complete the account opening process with required documentation</li>
                <li>Choose your preferred deposit amount and tenure</li>
                <li>Receive your Fixed Deposit Receipt (FDR) with investment details</li>
                <li>Monitor your investment and plan for maturity options</li>
              </ol>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#113262] mb-4">Fixed Deposit Varieties</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-4">Standard & Tax-Saving FDs</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>Regular FDs with fixed returns and tenure</li>
                  <li>Tax-saving options with Section 80C benefits</li>
                  <li>Flexible interest payout options</li>
                  <li>Suitable for long-term wealth building</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <h3 className="font-semibold text-slate-900 mb-4">Special Category FDs</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  <li>Senior Citizen FDs with higher interest rates</li>
                  <li>Flexi FDs with withdrawal flexibility</li>
                  <li>Cumulative and non-cumulative options</li>
                  <li>Corporate and NRI deposit schemes</li>
                </ul>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#113262] mb-4">Investment Considerations</h2>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
              <ul className="list-disc pl-5 space-y-3 text-sm">
                <li>Review interest rates and compare across institutions</li>
                <li>Understand premature withdrawal terms and penalties</li>
                <li>Consider tax implications on interest earned</li>
                <li>Plan your investment tenure based on financial goals</li>
                <li>Evaluate minimum deposit requirements</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#113262] mb-4">Benefits of Our FD Calculator</h2>
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <p className="text-sm mb-4">
                Our Fixed Deposit calculator empowers you to make informed investment decisions by providing precise calculations of your potential returns. Using the standard compound interest formula, it helps you:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm">
                <li>Project your maturity amount accurately</li>
                <li>Compare different investment scenarios</li>
                <li>Plan your investment tenure effectively</li>
                <li>Understand your potential returns before investing</li>
              </ul>
            </div>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[#113262] mb-4">Cumulative vs Non-Cumulative FD</h3>
            <p className="text-sm mb-6">
              Cumulative FDs reinvest the interest and pay the total amount (principal + compounded interest) at maturity. Non-cumulative FDs pay interest at regular intervals (monthly, quarterly, or annually) and are popular with retirees seeking regular income. The effective return on cumulative FDs is slightly higher due to the compounding effect.
            </p>

            <h3 className="text-lg font-bold text-[#113262] mb-4">Tax-Saving Fixed Deposits</h3>
            <p className="text-sm">
              Tax-saving FDs have a 5-year lock-in period and qualify for deduction under Section 80C up to Rs 1.5 lakh per year. However, the interest earned is still fully taxable. Compare with ELSS mutual funds, which also qualify for 80C but have only a 3-year lock-in and potential for higher returns.
            </p>
          </section>

          <section className="pt-8">
            <h2 className="text-xl font-bold text-[#113262] mb-8">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">How is FD interest calculated?</h3>
                <p className="text-sm text-slate-600">Banks calculate FD interest using the compound interest formula for cumulative FDs (interest compounded quarterly) and simple interest for non-cumulative FDs (interest paid monthly/quarterly). The effective annual yield of a cumulative FD is slightly higher than the stated rate due to quarterly compounding.</p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">What are the current FD rates in India?</h3>
                <p className="text-sm text-slate-600">As of 2025-26, major banks offer 6.5-7.5% for regular depositors and 7-8% for senior citizens on 1-3 year FDs. Small finance banks offer 8-9%. Rates vary by bank and tenure. Always compare rates across multiple banks before locking in.</p>
              </div>
              
              <div className="border-b border-slate-200 pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">Is FD interest taxable?</h3>
                <p className="text-sm text-slate-600">Yes, FD interest is fully taxable at your income tax slab rate. Banks deduct TDS at 10% if annual interest exceeds Rs 40,000 (Rs 50,000 for senior citizens). You can claim the 80TTB deduction of Rs 50,000 if you are a senior citizen.</p>
              </div>

              <div className="border-b border-slate-200 pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">What is the penalty for premature FD withdrawal?</h3>
                <p className="text-sm text-slate-600">Most banks charge a penalty of 0.5-1% on the applicable interest rate for premature withdrawal. Some banks allow partial withdrawal without penalty. Check your bank's specific terms before booking the FD.</p>
              </div>
              
              <div className="pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">Are FDs safe?</h3>
                <p className="text-sm text-slate-600">Bank FDs are insured by DICGC (Deposit Insurance and Credit Guarantee Corporation) up to Rs 5 lakh per depositor per bank. For amounts above Rs 5 lakh, choose banks with strong credit ratings. Corporate FDs offer higher rates but carry higher credit risk.</p>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}

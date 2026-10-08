import React, { useState, useEffect } from 'react';
import { CurrencyInput } from '../ui/CurrencyInput';
import { Share2, ChevronDown } from 'lucide-react';

export default function ElssCalculator() {
  const [calcType, setCalcType] = useState<'sip' | 'lumpsum'>('sip');
  const [investment, setInvestment] = useState<number>(5000);
  const [rate, setRate] = useState<number>(12);
  const [years, setYears] = useState<number>(3);
  const [showTaxSettings, setShowTaxSettings] = useState<boolean>(false);
  
  const [maturityAmount, setMaturityAmount] = useState<number>(0);
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
    } else {
      setMaturityAmount(0);
      setTotalInvested(0);
    }
  }, [investment, rate, years, calcType]);

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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">ELSS Calculator</h1>
        <p className="text-slate-600 text-base">Tax-Saving Mutual Fund Investment Calculator</p>
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
                      max={calcType === 'sip' ? "100000" : "150000"}
                      step={calcType === 'sip' ? "500" : "1000"}
                      value={investment}
                      onChange={(e) => setInvestment(Number(e.target.value))}
                    
                      style={getSliderStyle(investment, calcType === 'sip' ? "500" : "5000", calcType === 'sip' ? "100000" : "150000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>{calcType === 'sip' ? '₹500' : '₹5K'}</span>
                      <span>{calcType === 'sip' ? '₹1L' : '₹1.5L'}</span>
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
                    min="3"
                    max="15"
                    step="1"
                    value={years}
                    onChange={(e) => setYears(Number(e.target.value))}
                  
                      style={getSliderStyle(years, "3", "15")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>3 Years</span>
                    <span>15 Years</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <button 
                onClick={() => setShowTaxSettings(!showTaxSettings)}
                className="w-full p-6 flex justify-between items-center text-left hover:bg-slate-50 transition-colors"
              >
                <h2 className="text-lg font-bold text-slate-900">Tax Settings</h2>
                <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${showTaxSettings ? 'rotate-180' : ''}`} />
              </button>
              
              {showTaxSettings && (
                <div className="p-6 pt-0 border-t border-slate-100">
                  <p className="text-sm text-slate-600">You can adjust your tax bracket to see the exact tax savings under Section 80C.</p>
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
            <h2 className="text-xl font-bold text-[#113262] mb-4">What is ELSS?</h2>
            <p className="text-sm mb-6">
              Equity Linked Savings Scheme (ELSS) is a tax-saving mutual fund that offers tax benefits under Section 80C of the Income Tax Act, 1961. ELSS funds primarily invest in equity markets and come with a mandatory 3-year lock-in period, making them ideal for long-term wealth creation along with tax savings of up to ₹1.5 lakh annually.
            </p>

            <h3 className="text-lg font-bold text-[#113262] mb-4">Investment Options</h3>
            <p className="text-sm mb-6">
              ELSS offers both SIP (Systematic Investment Plan) and Lumpsum investment options. SIP investments start from ₹500 per month, while Lumpsum investments typically begin at ₹500. Investors can choose between growth and dividend options, with investments locked in for 3 years from each installment date.
            </p>

            <h3 className="text-lg font-bold text-[#113262] mb-4">Lock-in Period</h3>
            <p className="text-sm mb-6">
              ELSS has the shortest lock-in period among tax-saving instruments at 3 years. Unlike other 80C options, the lock-in is calculated per SIP installment. Partial withdrawals are allowed after 3 years, but redemption of units occurs on a First-In-First-Out (FIFO) basis.
            </p>

            <h3 className="text-lg font-bold text-[#113262] mb-4">How to start investing?</h3>
            <p className="text-sm mb-2">To invest in ELSS funds, you need:</p>
            <ul className="list-disc pl-5 space-y-1 text-sm mb-6">
              <li>Completed KYC documentation</li>
              <li>PAN Card</li>
              <li>Bank account linked with PAN</li>
              <li>Investment plan selection (SIP/Lumpsum)</li>
            </ul>

            <h3 className="text-lg font-bold text-[#113262] mb-4">Why choose ELSS?</h3>
            <ul className="list-disc pl-5 space-y-1 text-sm mb-6">
              <li>Tax savings up to ₹46,800 under Section 80C</li>
              <li>Potential for higher returns through equity exposure</li>
              <li>Shortest lock-in period among tax-saving instruments</li>
              <li>Flexibility of SIP investments</li>
              <li>Long-term wealth creation potential</li>
            </ul>

            <h3 className="text-lg font-bold text-[#113262] mb-4">How are returns calculated?</h3>
            <p className="text-sm mb-6">
              ELSS returns are calculated using Compounded Annual Growth Rate (CAGR). For SIP investments, XIRR (Extended Internal Rate of Return) is used to account for multiple investments. Returns are market-linked and subject to equity risks, with historical returns ranging between 12-15% over 5+ years.
            </p>

            <h3 className="text-lg font-bold text-[#113262] mb-4">Using the Guided Wealthy ELSS Calculator</h3>
            <p className="text-sm mb-6">
              Input your investment amount, expected returns, and investment horizon. Our calculator shows projected maturity value, tax savings under different slabs, and compares ELSS with other tax-saving options. It helps optimize tax planning while demonstrating long-term wealth creation potential.
            </p>
          </section>

          <div className="grid md:grid-cols-2 gap-8 pt-8 border-t border-slate-200 mt-8">
            <section>
              <h2 className="text-xl font-bold text-[#113262] mb-4">How This Calculator Works</h2>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <p className="text-sm text-slate-700">
                  Enter your monthly or annual ELSS investment amount, expected return rate, and investment duration. The calculator shows your projected corpus, total tax saved under Section 80C, and effective returns after accounting for tax benefits. It helps you compare ELSS with other 80C instruments like PPF, NSC, and tax-saving FDs.
                </p>
              </div>

              <h2 className="text-xl font-bold text-[#113262] mb-4">Why Choose ELSS?</h2>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <p className="text-sm text-slate-700">
                  ELSS combines tax-saving with wealth creation. It is the only 80C instrument that invests primarily in equities, offering the potential for inflation-beating returns. The 3-year lock-in also enforces discipline, preventing premature withdrawals during market volatility.
                </p>
              </div>
            </section>
            
            <section>
              <h2 className="text-xl font-bold text-[#113262] mb-8">Frequently Asked Questions</h2>
              <div className="space-y-6">
                <div className="border-b border-slate-200 pb-6">
                  <h3 className="font-semibold text-slate-900 mb-2">What is ELSS and how does it save tax?</h3>
                  <p className="text-sm text-slate-600">ELSS (Equity Linked Savings Scheme) is a type of mutual fund that qualifies for tax deduction under Section 80C of the Income Tax Act. You can claim up to Rs 1.5 lakh per year as a deduction, reducing your taxable income. ELSS has the shortest lock-in period (3 years) among all 80C instruments.</p>
                </div>
                
                <div className="border-b border-slate-200 pb-6">
                  <h3 className="font-semibold text-slate-900 mb-2">How are ELSS returns taxed?</h3>
                  <p className="text-sm text-slate-600">After the 3-year lock-in, ELSS gains are treated as Long-Term Capital Gains (LTCG). Gains up to Rs 1.25 lakh per year are tax-free. Gains above this threshold are taxed at 12.5%. This makes ELSS one of the most tax-efficient investment options.</p>
                </div>

                <div className="border-b border-slate-200 pb-6">
                  <h3 className="font-semibold text-slate-900 mb-2">Is ELSS better than PPF for tax saving?</h3>
                  <p className="text-sm text-slate-600">ELSS offers higher return potential (12-15% historical CAGR) with a shorter lock-in (3 years vs 15 years for PPF). However, PPF offers guaranteed returns (currently 7.1%) with zero risk and EEE tax status (exempt at all stages). Choose ELSS for growth and PPF for safety.</p>
                </div>

                <div className="border-b border-slate-200 pb-6">
                  <h3 className="font-semibold text-slate-900 mb-2">Can I invest in ELSS through SIP?</h3>
                  <p className="text-sm text-slate-600">Yes. You can invest in ELSS via monthly SIP. Each SIP installment has its own 3-year lock-in period from the date of investment. This is different from a lump sum where the entire amount is locked for 3 years from the investment date.</p>
                </div>

                <div className="pb-6">
                  <h3 className="font-semibold text-slate-900 mb-2">What is the minimum investment in ELSS?</h3>
                  <p className="text-sm text-slate-600">Most ELSS funds accept a minimum investment of Rs 500 per month via SIP or Rs 500 as a lump sum. There is no maximum limit for investment, but the Section 80C deduction is capped at Rs 1.5 lakh per financial year.</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

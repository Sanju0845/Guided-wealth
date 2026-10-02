import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

interface SgbYearRow {
  year: number;
  goldPricePerGram: number;
  goldValue: number;
  cumInterest: number;
  totalValue: number;
  exitAllowed: string;
}

export default function SgbCalculator() {
  const [investmentAmount, setInvestmentAmount] = useState<number>(500000);
  const [goldPricePerGram, setGoldPricePerGram] = useState<number>(6500);
  const [appreciationRate, setAppreciationRate] = useState<number>(8);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const [goldUnits, setGoldUnits] = useState<number>(0);
  const [semiAnnualInterest, setSemiAnnualInterest] = useState<number>(0);
  const [totalInterest8Yrs, setTotalInterest8Yrs] = useState<number>(0);
  const [goldValueAtMaturity, setGoldValueAtMaturity] = useState<number>(0);
  const [totalReturns, setTotalReturns] = useState<number>(0);
  const [projections, setProjections] = useState<SgbYearRow[]>([]);

  useEffect(() => {
    if (investmentAmount <= 0 || goldPricePerGram <= 0) {
      setGoldUnits(0);
      setSemiAnnualInterest(0);
      setTotalInterest8Yrs(0);
      setGoldValueAtMaturity(0);
      setTotalReturns(0);
      setProjections([]);
      return;
    }

    const units = investmentAmount / goldPricePerGram;
    const annualCoupon = investmentAmount * 0.025; // 2.5% p.a.
    const semiCoupon = annualCoupon / 2;
    const totCoupon8 = annualCoupon * 8;

    const rows: SgbYearRow[] = [];
    for (let y = 1; y <= 8; y++) {
      const priceAtY = goldPricePerGram * Math.pow(1 + appreciationRate / 100, y);
      const valAtY = units * priceAtY;
      const cumInt = annualCoupon * y;
      const totVal = valAtY + cumInt;

      rows.push({
        year: y,
        goldPricePerGram: priceAtY,
        goldValue: valAtY,
        cumInterest: cumInt,
        totalValue: totVal,
        exitAllowed: y >= 5 ? 'Yes' : 'No',
      });
    }

    const finalGoldVal = rows[7] ? rows[7].goldValue : 0;
    const finalTotVal = rows[7] ? rows[7].totalValue : 0;

    setGoldUnits(units);
    setSemiAnnualInterest(semiCoupon);
    setTotalInterest8Yrs(totCoupon8);
    setGoldValueAtMaturity(finalGoldVal);
    setTotalReturns(finalTotVal);
    setProjections(rows);
  }, [investmentAmount, goldPricePerGram, appreciationRate]);

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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">SGB Calculator</h1>
        <p className="text-slate-600 text-base">Calculate your Sovereign Gold Bond returns</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Section */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Inputs */}
          <div className="flex-1 space-y-6">
            {/* Investment Details */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Investment Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Investment Amount</label>
                  <input
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(Math.max(0, Number(e.target.value)))}
                  />
                  <div>
                    <input
                      type="range"
                      min="10000"
                      max="5000000"
                      step="10000"
                      value={investmentAmount}
                      onChange={(e) => setInvestmentAmount(Number(e.target.value))}

                      style={getSliderStyle(investmentAmount, "10000", "5000000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>₹10,000</span>
                      <span>₹50 Lakh</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Gold Price per Gram</label>
                  <CurrencyInput
                    value={goldPricePerGram}
                    onValueChange={(val) => setGoldPricePerGram(val)}
                  />
                  <div>
                    <input
                      type="range"
                      min="1000"
                      max="15000"
                      step="100"
                      value={goldPricePerGram}
                      onChange={(e) => setGoldPricePerGram(Number(e.target.value))}

                      style={getSliderStyle(goldPricePerGram, "1000", "15000")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                    <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                      <span>₹1,000</span>
                      <span>₹15,000</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gold Price Appreciation */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Gold Price Appreciation</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Expected Annual Appreciation (%)</label>
                    <span className="text-sm font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">{appreciationRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="15"
                    step="0.5"
                    value={appreciationRate}
                    onChange={(e) => setAppreciationRate(Number(e.target.value))}

                    style={getSliderStyle(appreciationRate, "0", "15")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>0%</span>
                    <span>15%</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">SGB Interest Rate</label>
                  <input
                    type="text"
                    disabled
                    value="2.5% per annum (Fixed, paid semi-annually)"
                    className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 font-medium text-sm cursor-not-allowed"
                  />
                  <span className="text-xs text-slate-400 mt-1 block">Tenure: 8 years with exit option after 5th year</span>
                </div>
              </div>
            </div>

            {/* Year-wise Projections Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 overflow-x-auto">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Year-wise Projections</h2>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 font-semibold bg-slate-50">
                    <th className="py-3 px-3">Year</th>
                    <th className="py-3 px-3">Gold Price/g</th>
                    <th className="py-3 px-3">Gold Value</th>
                    <th className="py-3 px-3">Cum. Interest</th>
                    <th className="py-3 px-3">Total Value</th>
                    <th className="py-3 px-3">Exit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {projections.map((row) => (
                    <tr key={row.year} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 text-slate-900 font-semibold">Year {row.year}</td>
                      <td className="py-3 px-3">₹{Math.round(row.goldPricePerGram).toLocaleString('en-IN')}</td>
                      <td className="py-3 px-3">{formatCurrency(row.goldValue)}</td>
                      <td className="py-3 px-3 text-emerald-600">{formatCurrency(row.cumInterest)}</td>
                      <td className="py-3 px-3 text-slate-900 font-semibold">{formatCurrency(row.totalValue)}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${row.exitAllowed === 'Yes' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'}`}>
                          {row.exitAllowed}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-slate-400 mt-4 italic">
                *Exit is available after the 5th year on interest payment dates. Capital gains are tax-free only at maturity (Year 8).
              </p>
            </div>

            {/* Tax & Bond Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full p-6 flex justify-between items-center font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <span>Tax & Bond Details</span>
                {showAdvanced ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
              </button>

              {showAdvanced && (
                <div className="p-6 pt-0 border-t border-slate-100 mt-4 text-xs text-slate-600 space-y-2">
                  <p>• 2.5% interest per annum is paid semi-annually directly to your bank account and is taxable as per your income tax slab.</p>
                  <p>• Capital gains on redemption of SGB at maturity (8 years) are 100% tax-exempt.</p>
                  <p>• If sold before maturity on stock exchanges, indexation benefit was applicable for long-term gains (held &gt; 3 yrs).</p>
                </div>
              )}
            </div>
          </div>

          {/* Results Sidebar */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-[#1e2a4f] rounded-2xl shadow-xl p-6 md:p-8 text-white h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-bold tracking-tight">SGB Returns</h2>
                  <button className="text-slate-400 hover:text-white transition-colors" title="Share">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-8">
                  <div className="text-3xl md:text-4xl font-extrabold text-white tracking-tight mb-1">
                    {goldUnits.toFixed(2)} grams
                  </div>
                  <div className="text-slate-300 text-sm font-medium">Gold Units Purchased</div>
                </div>

                <div className="space-y-4 border-t border-slate-600/60 pt-6">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Semi-annual Interest</span>
                    <span className="font-semibold text-emerald-400">{formatCurrency(semiAnnualInterest)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Total Interest (8 yrs)</span>
                    <span className="font-semibold text-emerald-400">{formatCurrency(totalInterest8Yrs)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Gold Value at Maturity</span>
                    <span className="font-semibold text-white">{formatCurrency(goldValueAtMaturity)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-300">Total Returns</span>
                    <span className="font-semibold text-white">{formatCurrency(totalReturns)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-600/40">
                    <span className="text-slate-300">Capital Gains Tax</span>
                    <span className="font-semibold text-emerald-400">Tax-Free (at maturity)</span>
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
            <h2 className="text-xl font-bold text-[#113262] mb-4">What are Sovereign Gold Bonds (SGB)?</h2>
            <p className="text-slate-600">
              Sovereign Gold Bonds (SGB) are government securities denominated in grams of gold, issued by the Reserve Bank of India on behalf of the Government of India. They offer an alternative to holding physical gold, combining the benefits of gold price appreciation with an additional fixed interest income of 2.5% per annum.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">Key Features</h3>
            <p className="text-sm text-slate-600">
              SGBs have a tenure of 8 years with an exit option after the 5th year. The bonds are issued in multiples of grams of gold with a minimum investment of 1 gram. Interest is paid semi-annually at 2.5% per annum on the initial investment value.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">Benefits of SGB</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Capital gains tax exemption on redemption at maturity (8 years).</li>
              <li>Additional interest income of 2.5% per annum paid semi-annually.</li>
              <li>No storage cost or risk of theft unlike physical gold.</li>
              <li>Can be used as collateral for bank loans.</li>
              <li>Tradable on stock exchanges for early exit.</li>
            </ul>
          </section>

          <section>
            <h3 className="text-lg font-bold text-[#113262] mb-4">Why SGBs Are the Best Way to Own Gold</h3>
            <p className="text-slate-600">
              SGBs combine gold price appreciation with a 2.5% annual coupon, zero storage costs, zero making charges, and tax-free capital gains on maturity. No other gold investment vehicle offers this combination.
            </p>
          </section>

          <section className="pt-6">
            <h2 className="text-xl font-bold text-[#113262] mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">What are Sovereign Gold Bonds?</h3>
                <p className="text-sm text-slate-600">Sovereign Gold Bonds (SGBs) are government securities denominated in grams of gold issued by RBI on behalf of the Government of India. They offer gold price appreciation plus 2.5% annual interest. SGBs have an 8-year tenure with an exit option after 5 years.</p>
              </div>

              <div className="border-b border-slate-200 pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">Are SGBs tax-free?</h3>
                <p className="text-sm text-slate-600">Capital gains on SGBs held to maturity (8 years) are completely tax-free. The 2.5% annual interest is taxable at your slab rate. If sold before maturity on the secondary market, LTCG tax of 12.5% applies on gains.</p>
              </div>

              <div className="pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">How do I buy SGBs?</h3>
                <p className="text-sm text-slate-600">SGBs are issued in tranches by RBI throughout the year. You can buy them through banks, post offices, stock exchanges (NSE/BSE), and demat accounts with a ₹50 per gram discount online.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

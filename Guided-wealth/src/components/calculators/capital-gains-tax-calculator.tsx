import React, { useState, useEffect } from 'react';
import { CurrencyInput } from '../ui/CurrencyInput';
import { Share2, ChevronDown, ChevronUp, TrendingUp, Calendar, DollarSign, Sliders, ShieldAlert } from 'lucide-react';

export default function CapitalGainsTaxCalculator() {
  // Input States
  const [assetType, setAssetType] = useState<string>('equity_shares'); // 'equity_shares' | 'equity_mf' | 'debt_funds' | 'real_estate'
  const [purchasePrice, setPurchasePrice] = useState<number>(1000000);
  const [sellingPrice, setSellingPrice] = useState<number>(1500000);
  const [holdingMonths, setHoldingMonths] = useState<number>(36);
  const [purchaseDate, setPurchaseDate] = useState<string>('2021-01-01');
  const [sellingDate, setSellingDate] = useState<string>('2024-01-01');

  // Advanced Settings
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [additionalExpenses, setAdditionalExpenses] = useState<number>(20000);
  const [incomeTaxSlab, setIncomeTaxSlab] = useState<number>(30); // for STCG / debt slab rate

  // Computed Outputs
  const [grossGain, setGrossGain] = useState<number>(0);
  const [isLongTerm, setIsLongTerm] = useState<boolean>(true);
  const [applicableTaxRate, setApplicableTaxRate] = useState<number>(0);
  const [estimatedTax, setEstimatedTax] = useState<number>(0);
  const [effectiveTaxRate, setEffectiveTaxRate] = useState<number>(0);
  const [netProceeds, setNetProceeds] = useState<number>(0);

  useEffect(() => {
    const totalCost = purchasePrice + additionalExpenses;
    const gain = sellingPrice - totalCost;

    // Determine Long Term vs Short Term threshold (India Budget Tax Rules)
    // Equity Shares & Equity MFs: > 12 months = LTCG (12.5% above 1.25L exemption), <= 12 months = STCG (20%)
    // Real Estate: > 24 months = LTCG (12.5% without indexation / 20%), <= 24 months = STCG (Slab Rate)
    // Debt Funds: Taxed at Slab Rate regardless of holding period
    let ltcg = false;
    if (assetType === 'equity_shares' || assetType === 'equity_mf') {
      ltcg = holdingMonths > 12;
    } else if (assetType === 'real_estate') {
      ltcg = holdingMonths > 24;
    } else {
      // Debt funds
      ltcg = holdingMonths > 36;
    }

    let taxRate = 0;
    let tax = 0;

    if (gain <= 0) {
      tax = 0;
      taxRate = 0;
    } else if (assetType === 'equity_shares' || assetType === 'equity_mf') {
      if (ltcg) {
        taxRate = 12.5; // LTCG 12.5%
        const taxableGain = Math.max(0, gain - 125000); // Rs 1.25 Lakh exemption
        tax = Math.round(taxableGain * 0.125);
      } else {
        taxRate = 20.0; // STCG 20%
        tax = Math.round(gain * 0.20);
      }
    } else if (assetType === 'real_estate') {
      if (ltcg) {
        taxRate = 12.5; // New regime LTCG 12.5%
        tax = Math.round(gain * 0.125);
      } else {
        taxRate = incomeTaxSlab; // Slab rate for STCG
        tax = Math.round(gain * (incomeTaxSlab / 100));
      }
    } else {
      // Debt Funds
      taxRate = incomeTaxSlab; // Slab rate
      tax = Math.round(gain * (incomeTaxSlab / 100));
    }

    const effRate = gain > 0 ? (tax / gain) * 100 : 0;
    const netProc = sellingPrice - additionalExpenses - tax;

    setGrossGain(gain);
    setIsLongTerm(ltcg);
    setApplicableTaxRate(taxRate);
    setEstimatedTax(tax);
    setEffectiveTaxRate(effRate);
    setNetProceeds(netProc);
  }, [
    assetType,
    purchasePrice,
    sellingPrice,
    holdingMonths,
    additionalExpenses,
    incomeTaxSlab,
  ]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const assetOptions = [
    { id: 'equity_shares', label: 'Equity Shares', sub: 'Listed on recognized exchange' },
    { id: 'equity_mf', label: 'Equity Mutual Funds', sub: '65% or more in equity' },
    { id: 'debt_funds', label: 'Debt Funds', sub: 'Including debt mutual funds' },
    { id: 'real_estate', label: 'Real Estate', sub: 'Property, land, buildings' },
  ];
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
      {/* Header Banner */}
      <div className="bg-white pt-32 pb-10 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Capital Gains Tax Calculator</h1>
        <p className="text-slate-600 text-base">
          Estimate the tax on your investment gains in India under current tax rules
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Grid */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Inputs Column */}
          <div className="flex-1 space-y-6">
            {/* Asset Type Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" /> Select Asset Type
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {assetOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setAssetType(opt.id)}
                    className={`p-4 rounded-xl border text-left transition-all ${assetType === opt.id
                        ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-600/20'
                        : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                  >
                    <div className="font-bold text-slate-900 text-sm">{opt.label}</div>
                    <div className="text-xs text-slate-500 mt-1">{opt.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Investment Details Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-blue-600" /> Investment Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Purchase Price</label>
                    <CurrencyInput
                    value={purchasePrice}
                    onValueChange={(val) => setPurchasePrice(val)}
                  />
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="10000000"
                    step="50000"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}

                    style={getSliderStyle(purchasePrice, "10000", "100000000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>₹10,000</span>
                    <span>₹1 Cr</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Selling Price</label>
                    <CurrencyInput
                    value={sellingPrice}
                    onValueChange={(val) => setSellingPrice(val)}
                  />
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="10000000"
                    step="50000"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(Number(e.target.value))}

                    style={getSliderStyle(sellingPrice, "10000", "100000000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>₹10,000</span>
                    <span>₹1 Cr</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Time Period Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" /> Time Period
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Purchase Date</label>
                  <input
                    type="date"
                    value={purchaseDate}
                    onChange={(e) => setPurchaseDate(e.target.value)}
                  />
                </div>

                <div>
                  <label>Selling Date</label>
                  <input
                    type="date"
                    value={sellingDate}
                    onChange={(e) => setSellingDate(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div>
                  <label>Holding Period (months)</label>
                  <span>
                    {holdingMonths} Months
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="120"
                  step="1"
                  value={holdingMonths}
                  onChange={(e) => setHoldingMonths(Number(e.target.value))}

                  style={getSliderStyle(purchaseDate, "1", "120")}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                  <span>1 month</span>
                  <span>10 years</span>
                </div>
                <div className="mt-3">
                  <span className={`inline-block px-3 py-1 rounded-md text-xs font-bold ${isLongTerm ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                    {isLongTerm ? 'Long Term Capital Gains (LTCG)' : 'Short Term Capital Gains (STCG)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Advanced Settings Accordion */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full p-6 flex justify-between items-center font-bold text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <span className="flex items-center gap-2 text-base">
                  <Sliders className="w-5 h-5 text-blue-600" /> Advanced Settings (Brokerage & Tax Slab)
                </span>
                {showAdvanced ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
              </button>

              {showAdvanced && (
                <div className="p-6 pt-0 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Transfer Expenses / Brokerage</label>
                    <CurrencyInput
                    value={additionalExpenses}
                    onValueChange={(val) => setAdditionalExpenses(val)}
                  />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Income Tax Slab Rate (%)</label>
                    <select
                      value={incomeTaxSlab}
                      onChange={(e) => setIncomeTaxSlab(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value={5}>5% Slab Rate</option>
                      <option value={20}>20% Slab Rate</option>
                      <option value={30}>30% Slab Rate</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Summary Card */}
          <div className="w-full lg:w-[380px]">
            <div className="bg-[#1e2a4f] rounded-2xl shadow-xl p-6 md:p-8 text-white sticky top-28 border border-slate-600/50">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-bold tracking-tight">Capital Gains Tax</h2>
                <button className="text-slate-400 hover:text-white transition-colors p-1" title="Share">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-8 bg-slate-800/80 p-5 rounded-2xl border border-slate-600">
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">
                  {formatCurrency(estimatedTax)}
                </div>
                <div className="text-slate-300 text-xs font-medium uppercase tracking-wider">Estimated Tax</div>
              </div>

              <div className="space-y-4 border-t border-slate-600/60 pt-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Capital Gains</span>
                  <span className="font-semibold text-white">{formatCurrency(grossGain)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Tax Rate</span>
                  <span className="font-semibold text-emerald-400">{applicableTaxRate}%</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Effective Tax Rate</span>
                  <span className="font-semibold text-white">{effectiveTaxRate.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-3 border-t border-slate-600/40">
                  <span className="text-slate-300">Net Proceeds</span>
                  <span className="font-semibold text-emerald-400">{formatCurrency(netProceeds)}</span>
                </div>
              </div>

              <button className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2">
                Consult Tax Expert <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Informational SEO & FAQs Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-slate-200">
          <div className="md:col-span-2 space-y-8 text-slate-700 text-sm md:text-base leading-relaxed">
            <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Capital Gains Taxation</h2>
              <p className="text-slate-600 mb-4">
                Capital gains tax is a crucial aspect of investment taxation, levied on the profit earned from selling capital assets such as stocks, bonds, real estate, and other investment properties. Understanding capital gains taxation is essential for effective investment strategy and tax planning.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Types of Capital Gains</h3>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 mb-4">
                <li>Short-Term Capital Gains (Held less than 1 year)</li>
                <li>Long-Term Capital Gains (Held more than 1 year)</li>
                <li>Equity Capital Gains</li>
                <li>Real Estate Capital Gains</li>
                <li>Cryptocurrency Capital Gains</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Key Taxation Principles</h3>
              <p className="text-slate-600 mb-4">
                Capital gains are taxed based on the holding period and the type of asset. Different tax rates apply to short-term and long-term gains, with long-term gains typically receiving more favorable tax treatment.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Important Considerations</h3>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 mb-4">
                <li>Cost Basis Calculation</li>
                <li>Holding Period Determination</li>
                <li>Tax Rate Variations</li>
                <li>Offsetting Capital Gains and Losses</li>
                <li>Exemptions and Deductions</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Tax Optimization Strategies</h3>
              <ul className="list-disc pl-5 space-y-1 text-slate-600 mb-6">
                <li>Tax-Loss Harvesting</li>
                <li>Long-Term Investment Holding</li>
                <li>Utilizing Tax-Advantaged Accounts</li>
                <li>Timing of Asset Sales</li>
                <li>Consulting with Tax Professionals</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Using the Capital Gains Tax Calculator</h3>
              <p className="text-slate-600">
                Calculate your potential capital gains tax liability by entering details such as purchase price, selling price, holding period, and asset type. Gain insights into your tax obligations and explore strategies to optimize your investment tax planning.
              </p>
            </section>

            <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-2xl font-bold text-[#113262]">Frequently Asked Questions</h2>

              <div className="border-b border-slate-100 pb-5">
                <h3 className="font-bold text-slate-900 mb-2">How are capital gains taxed in India?</h3>
                <p className="text-slate-600 text-base">
                  Equity (listed shares and equity mutual funds): STCG (held under 1 year) at 20%, LTCG (over 1 year) at 12.5% above Rs 1.25 lakh exemption. Debt mutual funds: all gains taxed at slab rate regardless of holding period. Real estate: STCG (under 2 years) at slab rate, LTCG (over 2 years) at 12.5%.
                </p>
              </div>

              <div className="border-b border-slate-100 pb-5">
                <h3 className="font-bold text-slate-900 mb-2">What is the Rs 1.25 lakh LTCG exemption?</h3>
                <p className="text-slate-600 text-base">
                  Long-term capital gains from listed equity shares and equity mutual funds up to Rs 1.25 lakh per financial year are completely tax-free. Gains above this threshold are taxed at 12.5%. This exemption applies per individual per year, not per transaction.
                </p>
              </div>

              <div className="border-b border-slate-100 pb-5">
                <h3 className="font-bold text-slate-900 mb-2">How can I reduce capital gains tax?</h3>
                <p className="text-slate-600 text-base">
                  Tax harvesting: book profits up to Rs 1.25 lakh annually to utilize the LTCG exemption. Set-off losses: short-term losses can offset both STCG and LTCG; long-term losses can offset only LTCG. Unabsorbed losses can be carried forward for 8 years. For real estate, invest LTCG in 54EC bonds or a new property under Section 54.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-2">How are international stock gains taxed?</h3>
                <p className="text-slate-600 text-base">
                  Gains from foreign stocks (including US stocks) are taxed as unlisted equity: STCG (held under 2 years) at slab rate, LTCG (over 2 years) at 12.5%. Foreign tax credit is available if taxes were paid in the source country, claimed via Form 67 while filing ITR.
                </p>
              </div>
            </section>
          </div>

          {/* Right Column: SEO Card */}
          <div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-lg">How This Calculator Works</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Enter the asset type, purchase price, sale price, and holding period. The calculator determines whether the gain is short-term or long-term, applies the applicable tax rate, and shows your net tax liability. For equity assets, it automatically applies the Rs 1.25 lakh LTCG exemption.
              </p>

              <h4 className="font-bold text-slate-800 text-sm">Capital Gains Tax Planning</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Smart tax planning can save significant amounts. Harvest gains up to Rs 1.25 lakh each March by selling and repurchasing equity holdings. Time your real estate sales to qualify for LTCG treatment. Use Section 54 exemptions to defer tax on property gains. Consult a tax advisor for complex multi-asset portfolios.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

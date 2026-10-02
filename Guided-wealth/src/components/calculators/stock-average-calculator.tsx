import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp, Plus, Trash2, TrendingUp, DollarSign, Info } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

interface PurchaseLot {
  id: string;
  price: number;
  shares: number;
}

export default function StockAverageCalculator() {
  // Input State: Dynamic Purchase Lots
  const [lots, setLots] = useState<PurchaseLot[]>([
    { id: '1', price: 500, shares: 100 },
    { id: '2', price: 450, shares: 150 },
  ]);

  // Current Market Price (Optional)
  const [currentMarketPrice, setCurrentMarketPrice] = useState<number>(520);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Computed Outputs
  const [totalShares, setTotalShares] = useState<number>(0);
  const [totalInvestment, setTotalInvestment] = useState<number>(0);
  const [averagePrice, setAveragePrice] = useState<number>(0);
  const [currentValue, setCurrentValue] = useState<number>(0);
  const [profitLoss, setProfitLoss] = useState<number>(0);
  const [profitLossPct, setProfitLossPct] = useState<number>(0);

  useEffect(() => {
    let totShares = 0;
    let totInvest = 0;

    lots.forEach((lot) => {
      const s = Math.max(0, lot.shares);
      const p = Math.max(0, lot.price);
      totShares += s;
      totInvest += s * p;
    });

    const avgPrice = totShares > 0 ? totInvest / totShares : 0;
    const currVal = totShares * Math.max(0, currentMarketPrice);
    const pnl = currVal - totInvest;
    const pnlPct = totInvest > 0 ? (pnl / totInvest) * 100 : 0;

    setTotalShares(totShares);
    setTotalInvestment(totInvest);
    setAveragePrice(avgPrice);
    setCurrentValue(currVal);
    setProfitLoss(pnl);
    setProfitLossPct(pnlPct);
  }, [lots, currentMarketPrice]);

  const addLot = () => {
    if (lots.length >= 10) return;
    const newId = (lots.length + 1).toString();
    setLots([...lots, { id: newId, price: 0, shares: 0 }]);
  };

  const removeLot = (index: number) => {
    if (lots.length <= 1) return;
    const updated = lots.filter((_, i) => i !== index);
    setLots(updated);
  };

  const updateLot = (index: number, field: 'price' | 'shares', value: number) => {
    const updated = [...lots];
    updated[index][field] = Math.max(0, value);
    setLots(updated);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(value);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'What is cost averaging in stocks?',
      a: 'Cost averaging involves purchasing shares of the same stock at different prices over time. This calculates a single weighted average cost per share, helping smooth out price volatility and lowering your break-even threshold.',
    },
    {
      q: 'Should I average down on a falling stock?',
      a: 'Averaging down makes sense only if the underlying business fundamentals, earnings, and balance sheet remain intact. Avoid averaging down blindly on fundamentally weak or broken companies.',
    },
    {
      q: 'How is weighted average price calculated?',
      a: 'Weighted Average Price = (Sum of [Purchase Price × Number of Shares]) / Total Shares. For example, 100 shares @ ₹500 (₹50,000) and 150 shares @ ₹450 (₹67,500) gives Total Investment ₹1,17,500 for 250 shares, yielding an average price of ₹470.',
    },
    {
      q: 'Does stock averaging reduce overall market risk?',
      a: 'Stock averaging reduces timing risk (buying at a market peak), but it does not eliminate company-specific equity risk. Position sizing and portfolio diversification remain essential.',
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      {/* Header Banner */}
      <div className="bg-white pt-32 pb-10 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Stock Average Calculator</h1>
        <p className="text-slate-600 text-base">
          Calculate the weighted average price of your stock purchases across multiple lots and dips.
        </p>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Purchase Lots */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mt-12">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#113262]" /> Purchase Lots
                </h2>
                <button
                  type="button"
                  onClick={addLot}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#113262] bg-sky-50 hover:bg-sky-100 px-3.5 py-1.5 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Lot
                </button>
              </div>

              {/* Dynamic Lot Rows */}
              <div className="space-y-4">
                {lots.map((lot, idx) => (
                  <div key={idx} className="p-4 bg-slate-50/70 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Purchase Lot {idx + 1}
                      </span>
                      {lots.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeLot(idx)}
                          className="text-rose-500 hover:text-rose-700 p-1 transition-colors"
                          title="Remove Lot"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Purchase Price (₹)
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium">₹</span>
                          <input
                            type="number"
                            value={lot.price || ''}
                            onChange={(e) => updateLot(idx, 'price', Number(e.target.value))}
                            placeholder="e.g. 500"
                            className="w-full pl-7 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-[#113262] outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-600 mb-1">
                          Number of Shares
                        </label>
                        <input
                          type="number"
                          value={lot.shares || ''}
                          onChange={(e) => updateLot(idx, 'shares', Number(e.target.value))}
                          placeholder="e.g. 100"
                          className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 focus:ring-2 focus:ring-[#113262] outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Current Market Price Optional */}
              <div className="mt-8 pt-6 border-t border-slate-100">
                <h3 className="text-sm font-bold text-slate-900 mb-3">Current Market Price (Optional)</h3>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Current Market Price per Share (₹)
                  </label>
                  <div className="relative">
                    <CurrencyInput
                    value={currentMarketPrice}
                    onValueChange={(val) => setCurrentMarketPrice(val)}
                  />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dark Navy Sticky Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="bg-[#1e2a4f] text-white rounded-2xl p-6 shadow-xl border border-slate-800">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold">Stock Average</h3>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Stock Average Calculation',
                        text: `Average Stock Cost: ${formatCurrency(averagePrice)} per share across ${totalShares} shares (Total Investment: ${formatCurrency(totalInvestment)}).`,
                        url: window.location.href,
                      }).catch(() => { });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }
                  }}
                  className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                  title="Share"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Highlight Hero Output */}
              <div className="mb-6 p-4 rounded-xl bg-slate-800/80 border border-slate-600/50">
                <div className="text-xs text-slate-400 mb-1 font-medium">Average Cost Per Share</div>
                <div className="text-3xl font-extrabold text-white">{formatCurrency(averagePrice)}</div>
                <div className="text-xs text-slate-400 mt-1">
                  Across {totalShares} total shares
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-3.5 text-sm border-t border-slate-800 pt-4">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Total Shares</span>
                  <span className="font-semibold text-white">{totalShares}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Total Investment</span>
                  <span className="font-semibold text-white">{formatCurrency(totalInvestment)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Current Value</span>
                  <span className="font-semibold text-white">{formatCurrency(currentValue)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Profit / Loss</span>
                  <span className={`font-semibold ${profitLoss >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {profitLoss >= 0 ? '+' : ''}{formatCurrency(profitLoss)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-300 pt-3 border-t border-slate-800">
                  <span className="font-bold text-white">P&L %</span>
                  <span className={`font-bold text-lg ${profitLossPct >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {profitLossPct >= 0 ? '+' : ''}{profitLossPct.toFixed(2)}%
                  </span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <button
                  onClick={() => window.scrollTo({ top: 1000, behavior: 'smooth' })}
                  className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2"
                >
                  Invest now →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Informational SEO Content & Guide */}
        <div className="max-w-4xl space-y-12 text-slate-700 leading-relaxed mt-12">
          <h2 className="text-xl font-bold text-[#113262] mb-4">Track Your Average Cost</h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6">
            Enter each purchase transaction (price, quantity) for a stock. The calculator computes your weighted average cost, total investment, and current gain/loss based on the market price. It is especially useful for tracking positions built over multiple purchases at different price levels.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-700 border-t border-slate-100 pt-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Key Components</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li><strong>Purchase Price per Share:</strong> Cost per share for each lot.</li>
                <li><strong>Number of Shares per Lot:</strong> Quantity purchased per transaction.</li>
                <li><strong>Weighted Average Price:</strong> Total investment divided by total shares.</li>
                <li><strong>Total Investment:</strong> Sum of all purchase costs.</li>
                <li><strong>Profit/Loss Analysis:</strong> Unrealized returns at market price.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">How It Works</h3>
              <p className="mb-2">The calculator uses a weighted average formula:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li><strong>Average Price:</strong> Sum(Price × Quantity) / Sum(Quantity)</li>
                <li><strong>Total Investment:</strong> Sum of all (Price × Quantity)</li>
                <li><strong>Profit/Loss:</strong> (Current Price - Average Price) × Total Shares</li>
                <li><strong>P&L Percentage:</strong> (Profit / Total Investment) × 100</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mt-12">
          <h2 className="text-xl font-bold text-[#113262] mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full flex justify-between items-center p-4 text-left font-semibold text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? (
                    <ChevronUp className="w-5 h-5 text-slate-500 shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500 shrink-0" />
                  )}
                </button>
                {openFaq === idx && (
                  <div className="p-4 pt-0 text-sm text-slate-600 border-t border-slate-100 bg-slate-50/50 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

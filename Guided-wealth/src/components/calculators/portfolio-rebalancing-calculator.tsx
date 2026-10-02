import React, { useState, useEffect } from 'react';
import { CurrencyInput } from '../ui/CurrencyInput';
import { Share2, ChevronDown, ChevronUp, Plus, Trash2, AlertCircle } from 'lucide-react';

interface AssetClass {
  id: string;
  name: string;
  currentValue: number;
  targetPct: number;
}

export default function PortfolioRebalancingCalculator() {
  const [totalPortfolioValue, setTotalPortfolioValue] = useState<number>(1000000);
  const [thresholdPct, setThresholdPct] = useState<number>(5);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  const [assets, setAssets] = useState<AssetClass[]>([
    { id: '1', name: 'Equity', currentValue: 650000, targetPct: 60 },
    { id: '2', name: 'Debt', currentValue: 250000, targetPct: 30 },
    { id: '3', name: 'Gold', currentValue: 100000, targetPct: 10 },
  ]);

  // Recalculate total portfolio value whenever asset values change
  const currentTotalValue = assets.reduce((sum, item) => sum + item.currentValue, 0);

  const handlePortfolioValueChange = (newVal: number) => {
    setTotalPortfolioValue(newVal);
    if (currentTotalValue > 0) {
      const ratio = newVal / currentTotalValue;
      setAssets((prev) =>
        prev.map((asset) => ({
          ...asset,
          currentValue: Math.round(asset.currentValue * ratio),
        }))
      );
    }
  };

  const handleAssetValueChange = (id: string, val: number) => {
    setAssets((prev) =>
      prev.map((asset) => (asset.id === id ? { ...asset, currentValue: Math.max(0, val) } : asset))
    );
  };

  const handleAssetTargetChange = (id: string, pct: number) => {
    setAssets((prev) =>
      prev.map((asset) => (asset.id === id ? { ...asset, targetPct: Math.max(0, Math.min(100, pct)) } : asset))
    );
  };

  const handleAssetNameChange = (id: string, name: string) => {
    setAssets((prev) =>
      prev.map((asset) => (asset.id === id ? { ...asset, name } : asset))
    );
  };

  const handleAddAsset = () => {
    const newId = String(Date.now());
    setAssets((prev) => [
      ...prev,
      { id: newId, name: `Asset ${prev.length + 1}`, currentValue: 0, targetPct: 0 },
    ]);
  };

  const handleRemoveAsset = (id: string) => {
    if (assets.length <= 1) return;
    setAssets((prev) => prev.filter((asset) => asset.id !== id));
  };

  const totalTargetPct = assets.reduce((sum, item) => sum + item.targetPct, 0);

  // Check if rebalancing is needed
  let rebalanceNeeded = false;
  const rebalancingResults = assets.map((asset) => {
    const currentPct = currentTotalValue > 0 ? (asset.currentValue / currentTotalValue) * 100 : 0;
    const targetValue = (currentTotalValue * asset.targetPct) / 100;
    const diffValue = targetValue - asset.currentValue;
    const devPct = Math.abs(currentPct - asset.targetPct);

    if (devPct >= thresholdPct) {
      rebalanceNeeded = true;
    }

    let action: 'buy' | 'sell' | 'hold' = 'hold';
    if (diffValue > 100) action = 'buy';
    else if (diffValue < -100) action = 'sell';

    return {
      ...asset,
      currentPct,
      targetValue,
      diffValue,
      action,
    };
  });

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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Portfolio Rebalancing Calculator</h1>
        <p className="text-slate-600 text-base">Optimize Your Investment Allocation</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Section */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Inputs Column */}
          <div className="flex-1 space-y-6">
            {/* Total Portfolio Value */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Total Portfolio Value</h2>
              <div className="relative mb-3">
                <CurrencyInput
                    value={currentTotalValue}
                    onValueChange={(val) => handlePortfolioValueChange(val)}
                  />
              </div>
              <input
                type="range"
                min="100000"
                max="50000000"
                step="100000"
                value={currentTotalValue}
                onChange={(e) => handlePortfolioValueChange(Number(e.target.value))}

                style={getSliderStyle(currentTotalValue, "100000", "50000000")}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
              />
              <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                <span>₹1 Lakh</span>
                <span>₹5 Crore</span>
              </div>
            </div>

            {/* Current Allocation */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-bold text-slate-900">Current Allocation</h2>
                <button
                  onClick={handleAddAsset}
                  className="flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Add Asset
                </button>
              </div>

              <div className="space-y-4">
                {assets.map((asset) => {
                  const currentPct = currentTotalValue > 0 ? ((asset.currentValue / currentTotalValue) * 100).toFixed(1) : '0';
                  return (
                    <div key={asset.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <input
                        type="text"
                        value={asset.name}
                        onChange={(e) => handleAssetNameChange(asset.id, e.target.value)}
                        placeholder="Asset Name"
                      />
                      <div>
                        <span>₹</span>
                        <input
                          type="number"
                          value={asset.currentValue}
                          onChange={(e) => handleAssetValueChange(asset.id, Number(e.target.value))}
                        />
                      </div>
                      <div>
                        {currentPct}%
                      </div>
                      <button
                        onClick={() => handleRemoveAsset(asset.id)}
                        disabled={assets.length <= 1}
                      >
                        <Trash2 />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Target Allocation */}
            <div>
              <div>
                <h2>Target Allocation</h2>
                <span className={`text-sm font-bold px-2.5 py-1 rounded-md ${Math.abs(totalTargetPct - 100) < 0.1 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                  Total: {totalTargetPct}%
                </span>
              </div>

              {Math.abs(totalTargetPct - 100) >= 0.1 && (
                <div>
                  <AlertCircle />
                  Target allocations should sum up to 100% for accurate rebalancing.
                </div>
              )}

              <div>
                {assets.map((asset) => (
                  <div key={asset.id}>
                    <div>
                      <span>{asset.name}</span>
                      <span>{asset.targetPct}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={asset.targetPct}
                      onChange={(e) => handleAssetTargetChange(asset.id, Number(e.target.value))}

                      style={getSliderStyle(asset.name, "0", "100")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                  </div>
                ))}
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
                  <label className="block text-sm font-medium text-slate-700 mb-2">Rebalancing Threshold (%)</label>
                  <input
                    type="number"
                    value={thresholdPct}
                    onChange={(e) => setThresholdPct(Math.max(1, Number(e.target.value)))}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none font-semibold text-slate-800"
                  />
                  <span className="text-xs text-slate-500 mt-1 block">Trigger rebalancing recommendation when deviation exceeds this percentage.</span>
                </div>
              )}
            </div>
          </div>

          {/* Results Sidebar */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-[#1e2a4f] rounded-2xl shadow-xl p-6 md:p-8 text-white h-full flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-xl font-bold tracking-tight">Rebalancing Summary</h2>
                  <button className="text-slate-400 hover:text-white transition-colors" title="Share">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>

                <div className="mb-8">
                  <div className={`text-xl font-bold px-3 py-1.5 rounded-lg inline-block ${rebalanceNeeded ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                    {rebalanceNeeded ? 'Rebalancing Needed' : 'Portfolio Balanced'}
                  </div>
                  <div className="text-slate-300 text-xs mt-2">
                    {rebalanceNeeded ? `Deviation exceeds ${thresholdPct}% threshold` : `Within ${thresholdPct}% target threshold`}
                  </div>
                </div>

                <div className="space-y-4 border-t border-slate-600/60 pt-6">
                  {rebalancingResults.map((res) => (
                    <div key={res.id} className="border-b border-slate-600/40 pb-3 last:border-0">
                      <div className="flex justify-between items-center text-sm mb-1">
                        <span className="text-white font-medium">{res.name}</span>
                        <span className="text-xs text-slate-400">{res.currentPct.toFixed(1)}% &rarr; {res.targetPct}%</span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-slate-300">Action:</span>
                        {res.action === 'buy' && (
                          <span className="font-semibold text-emerald-400">Buy {formatCurrency(Math.abs(res.diffValue))}</span>
                        )}
                        {res.action === 'sell' && (
                          <span className="font-semibold text-amber-400">Sell {formatCurrency(Math.abs(res.diffValue))}</span>
                        )}
                        {res.action === 'hold' && (
                          <span className="font-medium text-slate-400">No Action</span>
                        )}
                      </div>
                    </div>
                  ))}
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
            <h2 className="text-xl font-bold text-[#113262] mb-4">What is Portfolio Rebalancing?</h2>
            <p className="text-slate-600">
              Portfolio rebalancing is the process of realigning the weightings of a portfolio of assets. It involves periodically buying or selling assets in your portfolio to maintain your desired level of asset allocation and risk tolerance.
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">Key Features</h3>
            <p className="text-sm text-slate-600">
              Rebalancing helps maintain the intended risk level of your portfolio. It can be done on a regular schedule (e.g. quarterly or annually) or based on specific thresholds (e.g., when an asset class deviates by a specified percentage like 5%).
            </p>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">Rebalancing Strategies</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong className="text-slate-800">Time-based rebalancing:</strong> Adjusting the portfolio at regular calendar intervals.</li>
              <li><strong className="text-slate-800">Threshold-based rebalancing:</strong> Rebalancing when asset allocation deviates from target by a set percentage.</li>
              <li><strong className="text-slate-800">Tactical rebalancing:</strong> Making adjustments based on market conditions and economic forecasts.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">How to Maximize Portfolio Performance?</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Regularly reviewing your investment goals and risk tolerance.</li>
              <li>Staying informed about market trends without panic-selling during market dips.</li>
              <li>Utilizing new cash inflows to buy underweighted assets instead of selling overweighted ones to minimize taxes.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold text-slate-900 mb-2">Tax Implications</h3>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Gains realized from rebalancing sales may be subject to short-term or long-term capital gains tax.</li>
              <li>Long-term equity capital gains above ₹1.25 Lakh per financial year are taxed at 12.5%.</li>
              <li>Consider tax-efficient approaches (e.g., rebalancing inside tax-advantaged accounts or using fresh SIPs).</li>
            </ul>
          </section>

          <section className="pt-6">
            <h2 className="text-xl font-bold text-[#113262] mb-8">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">How often should I rebalance my portfolio?</h3>
                <p className="text-sm text-slate-600">Most financial advisors recommend rebalancing once a year or whenever an asset class deviates by more than 5% to 10% from its target allocation.</p>
              </div>

              <div className="pb-6">
                <h3 className="font-semibold text-slate-900 mb-2">Can I rebalance without selling assets?</h3>
                <p className="text-sm text-slate-600">Yes! You can rebalance by directing new monthly investments, SIPs, or dividends into underweighted asset classes until your target allocation is restored.</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp, ArrowRightLeft, TrendingUp, Percent, Sliders, Info } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

export default function MovingFromPoorFundsToBetterFunds() {
  // Current Investment Inputs
  const [currentInvestmentAmount, setCurrentInvestmentAmount] = useState<number>(1000000);
  const [currentFundReturnRate, setCurrentFundReturnRate] = useState<number>(8);

  // New Fund Inputs
  const [betterFundReturnRate, setBetterFundReturnRate] = useState<number>(12);
  const [investmentPeriodYears, setInvestmentPeriodYears] = useState<number>(10);

  // Switch Costs Inputs
  const [exitLoadPct, setExitLoadPct] = useState<number>(1);
  const [otherSwitchCosts, setOtherSwitchCosts] = useState<number>(5000);

  // Advanced Inputs
  const [showAdvanced, setShowAdvanced] = useState<boolean>(true);
  const [taxRatePct, setTaxRatePct] = useState<number>(10);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Computed Outputs
  const [currentFundFutureValue, setCurrentFundFutureValue] = useState<number>(0);
  const [exitLoadCost, setExitLoadCost] = useState<number>(0);
  const [taxOnGains, setTaxOnGains] = useState<number>(0);
  const [netReinvested, setNetReinvested] = useState<number>(0);
  const [betterFundFutureValue, setBetterFundFutureValue] = useState<number>(0);
  const [totalSwitchBenefit, setTotalSwitchBenefit] = useState<number>(0);
  const [percentageBenefitPct, setPercentageBenefitPct] = useState<number>(0);
  const [breakevenYears, setBreakevenYears] = useState<number>(0);

  useEffect(() => {
    const P = Math.max(0, currentInvestmentAmount);
    const rOld = currentFundReturnRate / 100;
    const rNew = betterFundReturnRate / 100;
    const n = Math.max(1, investmentPeriodYears);

    // Current fund future value without switching
    const oldFutVal = Math.round(P * Math.pow(1 + rOld, n));

    // Switch costs
    const exitCost = Math.round(P * (exitLoadPct / 100));
    // Assume gain portion is ~80% of investment for tax estimate
    const taxCost = Math.round(P * 0.8 * (taxRatePct / 100));
    const totalCosts = exitCost + taxCost + otherSwitchCosts;

    const netAmount = Math.max(0, P - totalCosts);

    // Better fund future value after deducting switch costs
    const newFutVal = Math.round(netAmount * Math.pow(1 + rNew, n));

    const totalBenefit = newFutVal - oldFutVal;
    const pctBenefit = oldFutVal > 0 ? (totalBenefit / oldFutVal) * 100 : 0;

    // Estimate break-even period in years
    let bYears = 0;
    if (rNew > rOld && totalCosts > 0) {
      // Find year where netAmount * (1+rNew)^t > P * (1+rOld)^t
      for (let t = 1; t <= 30; t++) {
        const valNewAtT = netAmount * Math.pow(1 + rNew, t);
        const valOldAtT = P * Math.pow(1 + rOld, t);
        if (valNewAtT >= valOldAtT) {
          bYears = t;
          break;
        }
      }
    }

    setCurrentFundFutureValue(oldFutVal);
    setExitLoadCost(exitCost);
    setTaxOnGains(taxCost);
    setNetReinvested(netAmount);
    setBetterFundFutureValue(newFutVal);
    setTotalSwitchBenefit(totalBenefit);
    setPercentageBenefitPct(pctBenefit);
    setBreakevenYears(bYears);
  }, [
    currentInvestmentAmount,
    currentFundReturnRate,
    betterFundReturnRate,
    investmentPeriodYears,
    exitLoadPct,
    otherSwitchCosts,
    taxRatePct,
  ]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'When should I switch mutual funds?',
      a: 'Consider switching if your fund has consistently underperformed its benchmark index and category peers for 2-3 consecutive years, the fund manager/strategy has changed, or the expense ratio is uncompetitive. Short-term underperformance (6-12 months) is normal and not a reason to panic switch.',
    },
    {
      q: 'What are the tax implications of switching mutual funds?',
      a: 'Switching from one mutual fund scheme to another is treated as a redemption and fresh purchase. Equity funds: STCG (held < 1 yr) is taxed at 20%, LTCG (held > 1 yr) above ₹1.25 Lakh is taxed at 12.5%. Debt funds: Taxed at your slab rate. Factor in the exit load and tax cost before executing a switch.',
    },
    {
      q: 'How do I identify an underperforming fund?',
      a: 'Compare your fund 3-year and 5-year rolling returns against its category benchmark (e.g. Nifty 50 TRI) and top 5 peer funds. Check consistency of returns rather than point-to-point trailing returns. A fund consistently in the bottom quartile of its category for 3+ years is a candidate for replacement.',
    },
    {
      q: 'Is it better to switch via SIP or lump sum?',
      a: 'If switching within equity funds of similar market-cap exposure, a lump sum switch (reinvesting immediately) keeps you invested in the market without missing upside. If switching from debt/liquid to equity, use an STP (Systematic Transfer Plan) over 6-12 months.',
    },
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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Fund Switch Calculator</h1>
        <p className="text-slate-600 text-base">
          Evaluate the net wealth benefit of moving from underperforming funds to better performing funds after exit load & taxes.
        </p>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6 ">
            <div className="bg-white p-8 rounded-xl border border-slate-100 mt-12">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <ArrowRightLeft className="w-5 h-5 text-[#113262]" /> Current Investment Details
              </h2>

              {/* Current Amount & Current Return */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Current Investment Amount (₹)</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-medium">₹</span>
                      <input
                        type="number"
                        value={currentInvestmentAmount}
                        onChange={(e) => setCurrentInvestmentAmount(Math.max(0, Number(e.target.value)))}
                      />
                    </div>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="10000000"
                    step="10000"
                    value={currentInvestmentAmount}
                    onChange={(e) => setCurrentInvestmentAmount(Number(e.target.value))}

                    style={getSliderStyle(currentInvestmentAmount, "10000", "10000000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Current Fund Expected Return (% p.a.)</label>
                    <span className="font-bold text-slate-900 text-sm bg-slate-100 px-2.5 py-1 rounded-md">{currentFundReturnRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="0.5"
                    value={currentFundReturnRate}
                    onChange={(e) => setCurrentFundReturnRate(Number(e.target.value))}

                    style={getSliderStyle(currentFundReturnRate, "1", "30")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#113262]" /> New Fund Details
              </h2>

              {/* Better Return & Investment Period */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Better Fund Expected Return (% p.a.)</label>
                    <span className="font-bold text-[#113262] text-sm bg-sky-50 px-2.5 py-1 rounded-md">{betterFundReturnRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="0.5"
                    value={betterFundReturnRate}
                    onChange={(e) => setBetterFundReturnRate(Number(e.target.value))}

                    style={getSliderStyle(betterFundReturnRate, "1", "30")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Investment Period (Years)</label>
                    <span className="font-bold text-slate-900 text-sm bg-slate-100 px-2.5 py-1 rounded-md">{investmentPeriodYears} Years</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="30"
                    step="1"
                    value={investmentPeriodYears}
                    onChange={(e) => setInvestmentPeriodYears(Number(e.target.value))}

                    style={getSliderStyle(investmentPeriodYears, "1", "30")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>
              </div>

              <h2 className="text-xl font-bold text-slate-900 mb-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                <Percent className="w-5 h-5 text-[#113262]" /> Switch Costs
              </h2>

              {/* Exit Load & Other Costs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Exit Load (%)</label>
                    <span className="font-bold text-slate-900 text-sm bg-slate-100 px-2.5 py-1 rounded-md">{exitLoadPct}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.25"
                    value={exitLoadPct}
                    onChange={(e) => setExitLoadPct(Number(e.target.value))}

                    style={getSliderStyle(exitLoadPct, "0", "5")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Other Switch Costs / Expense Diff (₹)</label>
                    <div className="relative">
                      <CurrencyInput
                    value={otherSwitchCosts}
                    onValueChange={(val) => setOtherSwitchCosts(val)}
                  />
                    </div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100000"
                    step="1000"
                    value={otherSwitchCosts}
                    onChange={(e) => setOtherSwitchCosts(Number(e.target.value))}

                    style={getSliderStyle(otherSwitchCosts, "0", "100000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>
              </div>

              {/* Collapsible Advanced Settings */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center justify-between w-full text-sm font-bold text-slate-800 hover:text-[#113262] transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-[#113262]" /> Capital Gains Tax Rate
                  </span>
                  {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showAdvanced && (
                  <div className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center mb-2">
                      <label className="text-xs font-medium text-slate-700">Applicable Tax Rate on Capital Gains (%)</label>
                      <span className="font-bold text-slate-900 text-xs">{taxRatePct}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="30"
                      step="1"
                      value={taxRatePct}
                      onChange={(e) => setTaxRatePct(Number(e.target.value))}

                      style={getSliderStyle(taxRatePct, "0", "30")}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Dark Navy Sticky Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="bg-[#1e2a4f] text-white rounded-xl p-6 shadow-xl border border-slate-800">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold">Switch Benefit Analysis</h3>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Fund Switch Analysis Summary',
                        text: `Total Net Benefit from switching funds: ${formatCurrency(totalSwitchBenefit)} (${percentageBenefitPct.toFixed(2)}% extra growth).`,
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
                <div className="text-xs text-slate-400 mb-1 font-medium">Total Benefit from Switching</div>
                <div className="text-3xl font-extrabold text-white">{formatCurrency(totalSwitchBenefit)}</div>
                <div className="text-xs text-emerald-400 mt-1 font-medium">
                  {percentageBenefitPct.toFixed(2)}% extra wealth created
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-3.5 text-sm border-t border-slate-800 pt-4">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Percentage Benefit</span>
                  <span className="font-semibold text-emerald-400">{percentageBenefitPct.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Break-even Period</span>
                  <span className="font-semibold text-sky-400">{breakevenYears} years</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Current Fund Future Value</span>
                  <span className="font-semibold text-slate-400">{formatCurrency(currentFundFutureValue)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Better Fund Future Value</span>
                  <span className="font-semibold text-white">{formatCurrency(betterFundFutureValue)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Exit Load Cost</span>
                  <span className="font-semibold text-rose-400">- {formatCurrency(exitLoadCost)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Other Switch Costs</span>
                  <span className="font-semibold text-rose-400">- {formatCurrency(otherSwitchCosts)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300 pt-3 border-t border-slate-800">
                  <span className="font-bold text-white">Tax on Gains</span>
                  <span className="font-bold text-rose-400 text-base">- {formatCurrency(taxOnGains)}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <button
                  onClick={() => window.scrollTo({ top: 1000, behavior: 'smooth' })}
                  className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2"
                >
                  Consult Financial Advisor →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Informational SEO Content & Guide */}
        <div className="max-w-4xl space-y-12 text-slate-700 leading-relaxed mt-12">
          <h2 className="text-xl font-bold text-[#113262] mb-4">Evaluate Your Fund Switch Decision</h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6">
            Enter your current fund's performance, exit load, holding period, and the potential replacement fund's details. The calculator computes the tax impact of switching, break-even period for the new fund to recover switching costs, and projects the wealth difference over your remaining investment horizon.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-700 border-t border-slate-100 pt-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Key Components</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li><strong>Current Fund Value:</strong> Existing market value.</li>
                <li><strong>Current Fund Returns:</strong> Expected return % of weak fund.</li>
                <li><strong>Alternative Fund Returns:</strong> Expected return % of better fund.</li>
                <li><strong>Switching Costs:</strong> Exit load + STCG/LTCG tax.</li>
                <li><strong>Investment Horizon:</strong> Time remaining in years.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">How It Works</h3>
              <p className="mb-2">Compares net wealth trajectory:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li><strong>Net Reinvested:</strong> Current Value - Exit Load - Tax</li>
                <li><strong>New Wealth:</strong> Net Reinvested × (1 + Better Return)ⁿ</li>
                <li><strong>Switch Benefit:</strong> New Wealth - Old Wealth</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <div className="bg-white p-8 rounded-xl border border-slate-100 mt-12">
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

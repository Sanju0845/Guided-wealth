import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp, Sliders, TrendingUp, Info } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

export default function OptionValueEstimator() {
  // Inputs
  const [spotPrice, setSpotPrice] = useState<number>(18000);
  const [strikePrice, setStrikePrice] = useState<number>(18500);
  const [daysToExpiry, setDaysToExpiry] = useState<number>(30);
  const [lotSize, setLotSize] = useState<number>(50);

  const [optionType, setOptionType] = useState<string>('call'); // call, put
  const [volatility, setVolatility] = useState<number>(22); // IV %
  const [riskFreeRate, setRiskFreeRate] = useState<number>(6.5); // %

  // Advanced Inputs
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [optionStyle, setOptionStyle] = useState<string>('european'); // european, american
  const [dividendYield, setDividendYield] = useState<number>(0); // %

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Calculated Outputs
  const [theoreticalPrice, setTheoreticalPrice] = useState<number>(0);
  const [lotValue, setLotValue] = useState<number>(0);
  const [intrinsicValue, setIntrinsicValue] = useState<number>(0);
  const [timeValue, setTimeValue] = useState<number>(0);
  const [breakevenPrice, setBreakevenPrice] = useState<number>(0);

  // Option Greeks
  const [delta, setDelta] = useState<number>(0);
  const [gamma, setGamma] = useState<number>(0);
  const [theta, setTheta] = useState<number>(0);
  const [vega, setVega] = useState<number>(0);
  const [rho, setRho] = useState<number>(0);

  // Black-Scholes Helper Math Functions
  const normalCdf = (x: number): number => {
    const t = 1 / (1 + 0.2316419 * Math.abs(x));
    const d = 0.3989422804014327 * Math.exp((-x * x) / 2);
    const p =
      d *
      t *
      (0.31938153 +
        t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
    return x >= 0 ? 1 - p : p;
  };

  const normalPdf = (x: number): number => {
    return Math.exp((-x * x) / 2) / Math.sqrt(2 * Math.PI);
  };

  useEffect(() => {
    const S = Math.max(1, spotPrice);
    const K = Math.max(1, strikePrice);
    const T = Math.max(0.0001, daysToExpiry / 365);
    const r = riskFreeRate / 100;
    const v = Math.max(0.01, volatility / 100);
    const q = dividendYield / 100;

    const d1 = (Math.log(S / K) + (r - q + (v * v) / 2) * T) / (v * Math.sqrt(T));
    const d2 = d1 - v * Math.sqrt(T);

    let price = 0;
    let intrinsic = 0;
    let calcDelta = 0;
    let calcTheta = 0;
    let calcRho = 0;

    if (optionType === 'call') {
      price = S * Math.exp(-q * T) * normalCdf(d1) - K * Math.exp(-r * T) * normalCdf(d2);
      intrinsic = Math.max(0, S - K);
      calcDelta = Math.exp(-q * T) * normalCdf(d1);
      calcTheta =
        (-S * Math.exp(-q * T) * normalPdf(d1) * v) / (2 * Math.sqrt(T)) -
        r * K * Math.exp(-r * T) * normalCdf(d2) +
        q * S * Math.exp(-q * T) * normalCdf(d1);
      calcRho = (K * T * Math.exp(-r * T) * normalCdf(d2)) / 100;
    } else {
      price = K * Math.exp(-r * T) * normalCdf(-d2) - S * Math.exp(-q * T) * normalCdf(-d1);
      intrinsic = Math.max(0, K - S);
      calcDelta = Math.exp(-q * T) * (normalCdf(d1) - 1);
      calcTheta =
        (-S * Math.exp(-q * T) * normalPdf(d1) * v) / (2 * Math.sqrt(T)) +
        r * K * Math.exp(-r * T) * normalCdf(-d2) -
        q * S * Math.exp(-q * T) * normalCdf(-d1);
      calcRho = (-K * T * Math.exp(-r * T) * normalCdf(-d2)) / 100;
    }

    const timeVal = Math.max(0, price - intrinsic);
    const calcGamma = (Math.exp(-q * T) * normalPdf(d1)) / (S * v * Math.sqrt(T));
    const calcVega = (S * Math.exp(-q * T) * normalPdf(d1) * Math.sqrt(T)) / 100;
    const dailyTheta = calcTheta / 365;

    const totalLot = price * lotSize;
    const breakeven = optionType === 'call' ? K + price : K - price;

    setTheoreticalPrice(price);
    setLotValue(totalLot);
    setIntrinsicValue(intrinsic);
    setTimeValue(timeVal);
    setBreakevenPrice(breakeven);

    setDelta(calcDelta);
    setGamma(calcGamma);
    setTheta(dailyTheta);
    setVega(calcVega);
    setRho(calcRho);
  }, [
    spotPrice,
    strikePrice,
    daysToExpiry,
    lotSize,
    optionType,
    volatility,
    riskFreeRate,
    optionStyle,
    dividendYield,
  ]);

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
      q: 'How are stock options valued?',
      a: 'Option pricing uses mathematical models like Black-Scholes, which considers underlying stock price, strike price, time to expiration, volatility, risk-free rate, and dividends. The option price comprises intrinsic value (in-the-money amount) and time value.',
    },
    {
      q: 'What are the key Greeks in options trading?',
      a: 'Delta measures sensitivity to price changes of the underlying asset. Gamma measures the rate of change of Delta. Theta measures time decay per day. Vega measures sensitivity to volatility changes. Rho measures sensitivity to interest rate fluctuations.',
    },
    {
      q: 'What is implied volatility (IV)?',
      a: 'Implied Volatility (IV) represents the market expectation of future price movement. Higher IV leads to higher option premiums because of the increased probability of reaching extreme price levels.',
    },
    {
      q: 'What is the difference between European and American options?',
      a: 'European options can only be exercised on the expiration date, whereas American options can be exercised at any time up to expiration. Index options in India (Nifty, Bank Nifty) are European style.',
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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Option Value Estimation Calculator</h1>
        <p className="text-slate-600 text-base">
          Estimate theoretical option prices and option Greeks (Delta, Gamma, Theta, Vega, Rho) using Black-Scholes.
        </p>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mt-12">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#113262]" /> Contract Details
              </h2>

              {/* Spot Price & Strike Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Spot Price (₹)</label>
                    <CurrencyInput
                    value={spotPrice}
                    onValueChange={(val) => setSpotPrice(val)}
                  />
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="100000"
                    step="100"
                    value={spotPrice}
                    onChange={(e) => setSpotPrice(Number(e.target.value))}

                    style={getSliderStyle(spotPrice, "1000", "100000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Strike Price (₹)</label>
                    <CurrencyInput
                    value={strikePrice}
                    onValueChange={(val) => setStrikePrice(val)}
                  />
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="100000"
                    step="100"
                    value={strikePrice}
                    onChange={(e) => setStrikePrice(Number(e.target.value))}

                    style={getSliderStyle(strikePrice, "1000", "100000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>
              </div>

              {/* Days to Expiry & Lot Size */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Days to Expiry</label>
                    <span className="font-bold text-slate-900 text-sm bg-slate-100 px-2.5 py-1 rounded-md">{daysToExpiry} days</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="365"
                    step="1"
                    value={daysToExpiry}
                    onChange={(e) => setDaysToExpiry(Number(e.target.value))}

                    style={getSliderStyle(daysToExpiry, "1", "365")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Lot Size (Shares)</label>
                  <input
                    type="number"
                    value={lotSize}
                    onChange={(e) => setLotSize(Math.max(1, Number(e.target.value)))}
                  />
                </div>
              </div>

              {/* Option Type Selector */}
              <div>
                <label>Select Option Type</label>
                <div>
                  <button
                    type="button"
                    onClick={() => setOptionType('call')}
                    className={`p-3 rounded-xl border text-center transition-all ${optionType === 'call'
                        ? 'border-[#113262] bg-sky-50/50 text-[#113262] font-semibold ring-2 ring-[#113262]/10'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                  >
                    <div>Call Option</div>
                    <div>Right to buy underlying</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setOptionType('put')}
                    className={`p-3 rounded-xl border text-center transition-all ${optionType === 'put'
                        ? 'border-[#113262] bg-sky-50/50 text-[#113262] font-semibold ring-2 ring-[#113262]/10'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                  >
                    <div>Put Option</div>
                    <div>Right to sell underlying</div>
                  </button>
                </div>
              </div>

              {/* Market Parameters */}
              <div>
                <div>
                  <div>
                    <label>Volatility (IV %)</label>
                    <span>{volatility}%</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    step="1"
                    value={volatility}
                    onChange={(e) => setVolatility(Number(e.target.value))}

                    style={getSliderStyle(lotSize, "1", "100")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Risk-Free Rate (%)</label>
                    <span className="font-bold text-slate-900 text-sm bg-slate-100 px-2.5 py-1 rounded-md">{riskFreeRate}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    step="0.5"
                    value={riskFreeRate}
                    onChange={(e) => setRiskFreeRate(Number(e.target.value))}

                    style={getSliderStyle(riskFreeRate, "0", "20")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>
              </div>

              {/* Advanced Settings Accordion */}
              <div className="pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center justify-between w-full text-sm font-bold text-slate-800 hover:text-[#113262] transition-colors"
                >
                  <span>Advanced Parameters (Style & Dividend)</span>
                  {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showAdvanced && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Option Style</label>
                      <select
                        value={optionStyle}
                        onChange={(e) => setOptionStyle(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                      >
                        <option value="european">European (Exercise at expiry)</option>
                        <option value="american">American (Exercise anytime)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Dividend Yield (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={dividendYield}
                        onChange={(e) => setDividendYield(Number(e.target.value))}
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Dark Navy Sticky Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="bg-[#1e2a4f] text-white rounded-2xl p-6 shadow-xl border border-slate-800">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold">Option Valuation</h3>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Option Valuation Summary',
                        text: `Theoretical Option Price: ${formatCurrency(theoreticalPrice)} per share (${formatCurrency(lotValue)} per lot of ${lotSize}).`,
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
                <div className="text-xs text-slate-400 mb-1 font-medium">Theoretical Price per Share</div>
                <div className="text-3xl font-extrabold text-white">{formatCurrency(theoreticalPrice)}</div>
                <div className="text-xs text-emerald-400 mt-1 font-medium">
                  {formatCurrency(lotValue)} per lot ({lotSize} shares)
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-3 text-sm border-t border-slate-800 pt-4">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Intrinsic Value</span>
                  <span className="font-semibold text-white">{formatCurrency(intrinsicValue)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Time Value</span>
                  <span className="font-semibold text-white">{formatCurrency(timeValue)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Break-Even Price</span>
                  <span className="font-semibold text-[#EAB308]">{formatCurrency(breakevenPrice)}</span>
                </div>
              </div>

              {/* Option Greeks Grid */}
              <div className="mt-4 pt-4 border-t border-slate-800">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Option Greeks</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-600/50">
                    <span className="text-slate-400">Delta (Δ): </span>
                    <span className="font-bold text-white">{delta.toFixed(4)}</span>
                  </div>
                  <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-600/50">
                    <span className="text-slate-400">Gamma (Γ): </span>
                    <span className="font-bold text-white">{gamma.toFixed(6)}</span>
                  </div>
                  <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-600/50">
                    <span className="text-slate-400">Theta (Θ): </span>
                    <span className="font-bold text-rose-400">{theta.toFixed(2)}</span>
                  </div>
                  <div className="bg-slate-800/50 p-2 rounded-lg border border-slate-600/50">
                    <span className="text-slate-400">Vega (ν): </span>
                    <span className="font-bold text-white">{vega.toFixed(2)}</span>
                  </div>
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
          <h2 className="text-xl font-bold text-[#113262] mb-4">Price Your Options</h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6">
            Enter the underlying price, strike price, time to expiration, risk-free rate, and implied volatility. The calculator computes theoretical option prices using Black-Scholes along with all Greeks (Delta, Gamma, Theta, Vega). It helps evaluate whether an option is overpriced or underpriced relative to theoretical value.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-700 border-t border-slate-100 pt-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Key Components</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li><strong>Underlying Asset Price:</strong> Current spot price of stock/index.</li>
                <li><strong>Strike Price:</strong> Agreed execution price.</li>
                <li><strong>Time to Expiration:</strong> Days remaining until contract expiry.</li>
                <li><strong>Volatility:</strong> Expected annual price fluctuation (IV %).</li>
                <li><strong>Risk-Free Rate:</strong> Prevailing interest rate.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">How It Works</h3>
              <p className="mb-2">Uses Black-Scholes formula:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li><strong>Call Option Value:</strong> S·N(d₁) - K·e⁻ʳᵀ·N(d₂)</li>
                <li><strong>Put Option Value:</strong> K·e⁻ʳᵀ·N(-d₂) - S·N(-d₁)</li>
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

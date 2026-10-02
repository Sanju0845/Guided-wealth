import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp, Sliders, TrendingUp, DollarSign, Info } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

export default function BrokerageCostTool() {
  // Trade Inputs
  const [tradeValue, setTradeValue] = useState<number>(100000);
  const [quantity, setQuantity] = useState<number>(100);
  const [exchange, setExchange] = useState<string>('NSE'); // NSE, BSE

  // Broker Type & Segment
  const [brokerType, setBrokerType] = useState<string>('discount'); // discount, full_service, custom
  const [segment, setSegment] = useState<string>('delivery'); // delivery, intraday, futures, options
  const [customBrokerageRate, setCustomBrokerageRate] = useState<number>(0.1); // % for custom

  // Advanced Settings Accordion State
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // Custom Override Rates for Advanced Settings
  const [sttRate, setSttRate] = useState<number>(0.1);
  const [exchangeChargeRate, setExchangeChargeRate] = useState<number>(0.00325);
  const [sebiRate, setSebiRate] = useState<number>(0.0001);
  const [stampDutyRate, setStampDutyRate] = useState<number>(0.015);
  const [gstRate, setGstRate] = useState<number>(18);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Computed Charges Outputs
  const [brokerageFee, setBrokerageFee] = useState<number>(0);
  const [sttFee, setSttFee] = useState<number>(0);
  const [exchangeFee, setExchangeFee] = useState<number>(0);
  const [sebiFee, setSebiFee] = useState<number>(0);
  const [stampDutyFee, setStampDutyFee] = useState<number>(0);
  const [gstFee, setGstFee] = useState<number>(0);
  const [totalCost, setTotalCost] = useState<number>(0);
  const [breakevenPoints, setBreakevenPoints] = useState<number>(0);
  const [totalCostPct, setTotalCostPct] = useState<number>(0);

  // Sync default rates when segment or exchange changes
  useEffect(() => {
    // Standard STT rates
    if (segment === 'delivery') {
      setSttRate(0.1); // 0.1% on buy & sell
      setStampDutyRate(0.015); // 0.015% on buy
    } else if (segment === 'intraday') {
      setSttRate(0.025); // 0.025% on sell
      setStampDutyRate(0.003); // 0.003% on buy
    } else if (segment === 'futures') {
      setSttRate(0.0125); // 0.0125% on sell
      setStampDutyRate(0.002); // 0.002% on buy
    } else if (segment === 'options') {
      setSttRate(0.0625); // 0.0625% on sell premium
      setStampDutyRate(0.003); // 0.003% on buy
    }

    // Exchange transaction charge
    setExchangeChargeRate(exchange === 'NSE' ? 0.00325 : 0.00375);
    setSebiRate(0.0001);
    setGstRate(18);
  }, [segment, exchange]);

  // Main calculation effect
  useEffect(() => {
    let calcBrokerage = 0;

    if (brokerType === 'discount') {
      if (segment === 'delivery') {
        calcBrokerage = 0; // Free delivery for discount brokers
      } else if (segment === 'options') {
        calcBrokerage = 20; // Flat Rs 20 per trade/order
      } else {
        // Lower of Rs 20 or 0.03%
        calcBrokerage = Math.min(20, tradeValue * 0.0003);
      }
    } else if (brokerType === 'full_service') {
      if (segment === 'delivery') {
        calcBrokerage = tradeValue * 0.005; // 0.50%
      } else if (segment === 'intraday') {
        calcBrokerage = tradeValue * 0.0005; // 0.05%
      } else if (segment === 'futures') {
        calcBrokerage = tradeValue * 0.0003; // 0.03%
      } else {
        calcBrokerage = 100; // Flat Rs 100 for options
      }
    } else {
      // Custom rate %
      calcBrokerage = tradeValue * (customBrokerageRate / 100);
    }

    const calcStt = tradeValue * (sttRate / 100);
    const calcExchange = tradeValue * (exchangeChargeRate / 100);
    const calcSebi = tradeValue * (sebiRate / 100);
    const calcStampDuty = tradeValue * (stampDutyRate / 100);

    // GST applies on (Brokerage + Exchange Charges)
    const calcGst = (calcBrokerage + calcExchange) * (gstRate / 100);

    const grandTotal = calcBrokerage + calcStt + calcExchange + calcSebi + calcStampDuty + calcGst;
    const breakeven = quantity > 0 ? grandTotal / quantity : 0;
    const totalPct = tradeValue > 0 ? (grandTotal / tradeValue) * 100 : 0;

    setBrokerageFee(calcBrokerage);
    setSttFee(calcStt);
    setExchangeFee(calcExchange);
    setSebiFee(calcSebi);
    setStampDutyFee(calcStampDuty);
    setGstFee(calcGst);
    setTotalCost(grandTotal);
    setBreakevenPoints(breakeven);
    setTotalCostPct(totalPct);
  }, [
    tradeValue,
    quantity,
    exchange,
    brokerType,
    segment,
    customBrokerageRate,
    sttRate,
    exchangeChargeRate,
    sebiRate,
    stampDutyRate,
    gstRate,
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
      q: 'What are the total trading costs in India?',
      a: 'Total cost per trade includes brokerage (flat ₹20 or percentage rate), STT (0.1% for delivery buy/sell, 0.025% on sell for intraday), exchange transaction charges (0.00325% NSE), GST (18% on brokerage + exchange charges), SEBI turnover fee (0.0001%), and stamp duty (varies by segment 0.002%-0.015%). These add up to approximately 0.1-0.5% per trade.',
    },
    {
      q: 'How do I compare brokerage across brokers?',
      a: 'Discount brokers (Zerodha, Groww, Angel One) charge ₹20 per order or zero for delivery. Full-service brokers (ICICI Direct, HDFC Securities) charge 0.25%-0.55% per trade. For delivery/long-term investing, discount brokers are clearly cheaper. For high-frequency trading, flat-fee discount brokers offer significant savings.',
    },
    {
      q: 'What is STT and how does it affect returns?',
      a: 'Securities Transaction Tax (STT) is charged on equity transactions. For delivery trades: 0.1% on both buy and sell. For intraday: 0.025% on sell only. For F&O: 0.0125% on sell of futures, 0.0625% on sell of options premium. STT directly reduces net returns.',
    },
    {
      q: 'Are broker charges different for buy and sell orders?',
      a: 'Yes, charges like Stamp Duty apply only on buy orders, whereas Securities Transaction Tax (STT) on intraday and derivatives applies only on sell orders. Brokerage and GST apply on both buy and sell transactions.',
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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Brokerage Cost Calculator</h1>
        <p className="text-slate-600 text-base">
          Estimate the exact total transaction charges for your stock market trades across all segments and brokers.
        </p>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Input Form */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mt-12">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[#113262]" /> Trade Details
              </h2>

              {/* Trade Value Slider */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-700">Trade Value (₹)</label>
                  <div className="relative">
                    <CurrencyInput
                    value={tradeValue}
                    onValueChange={(val) => setTradeValue(val)}
                  />
                  </div>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="5000000"
                  step="5000"
                  value={tradeValue}
                  onChange={(e) => setTradeValue(Number(e.target.value))}

                  style={getSliderStyle(tradeValue, "5000", "5000000")}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>₹5,000</span>
                  <span>₹50,00,000</span>
                </div>
              </div>

              {/* Quantity and Exchange */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Quantity (Shares/Lots)</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-900 font-medium focus:ring-2 focus:ring-[#113262] outline-none text-sm"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Exchange</label>
                  <select
                    value={exchange}
                    onChange={(e) => setExchange(e.target.value)}
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-[#113262] outline-none text-sm font-medium"
                  >
                    <option value="NSE">NSE (National Stock Exchange)</option>
                    <option value="BSE">BSE (Bombay Stock Exchange)</option>
                  </select>
                </div>
              </div>

              {/* Broker Type Selection */}
              <div className="mb-6 pt-4 border-t border-slate-100">
                <label className="block text-sm font-medium text-slate-700 mb-2">Select Broker Type</label>
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setBrokerType('discount')}
                    className={`p-3 rounded-xl border text-left transition-all ${brokerType === 'discount'
                        ? 'border-[#113262] bg-sky-50/50 text-[#113262] font-semibold ring-2 ring-[#113262]/10'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                  >
                    <div className="text-sm font-bold">Discount Broker</div>
                    <div className="text-xs text-slate-500 mt-0.5">Lower fees, basic services</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBrokerType('full_service')}
                    className={`p-3 rounded-xl border text-left transition-all ${brokerType === 'full_service'
                        ? 'border-[#113262] bg-sky-50/50 text-[#113262] font-semibold ring-2 ring-[#113262]/10'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                  >
                    <div className="text-sm font-bold">Full-Service Broker</div>
                    <div className="text-xs text-slate-500 mt-0.5">Higher fees, advisor services</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setBrokerType('custom')}
                    className={`p-3 rounded-xl border text-left transition-all ${brokerType === 'custom'
                        ? 'border-[#113262] bg-sky-50/50 text-[#113262] font-semibold ring-2 ring-[#113262]/10'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                  >
                    <div className="text-sm font-bold">Custom</div>
                    <div className="text-xs text-slate-500 mt-0.5">Enter your own rate</div>
                  </button>
                </div>

                {brokerType === 'custom' && (
                  <div className="mt-4">
                    <label className="text-xs font-medium text-slate-700">Custom Brokerage Rate (%)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={customBrokerageRate}
                      onChange={(e) => setCustomBrokerageRate(Number(e.target.value))}
                      className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-sm"
                    />
                  </div>
                )}
              </div>

              {/* Segment Selector */}
              <div className="mb-6 pt-4 border-t border-slate-100">
                <label className="block text-sm font-medium text-slate-700 mb-2">Select Trading Segment</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'delivery', name: 'Equity Delivery', desc: 'T+1 settlement, lower STT' },
                    { id: 'intraday', name: 'Equity Intraday', desc: 'Same-day settlement, lower STT' },
                    { id: 'futures', name: 'Futures', desc: 'F&O segment, leverage' },
                    { id: 'options', name: 'Options', desc: 'F&O segment, limited risk' },
                  ].map((seg) => (
                    <button
                      key={seg.id}
                      type="button"
                      onClick={() => setSegment(seg.id)}
                      className={`p-3 rounded-xl border text-center transition-all ${segment === seg.id
                          ? 'border-[#113262] bg-sky-50/50 text-[#113262] font-semibold ring-2 ring-[#113262]/10'
                          : 'border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                    >
                      <div className="text-sm font-bold">{seg.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{seg.desc}</div>
                    </button>
                  ))}
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
                    <Sliders className="w-4 h-4 text-[#113262]" /> Advanced Statutory Settings
                  </span>
                  {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {showAdvanced && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">STT Rate (%)</label>
                      <input
                        type="number"
                        step="0.001"
                        value={sttRate}
                        onChange={(e) => setSttRate(Number(e.target.value))}
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Exchange Charges (%)</label>
                      <input
                        type="number"
                        step="0.00001"
                        value={exchangeChargeRate}
                        onChange={(e) => setExchangeChargeRate(Number(e.target.value))}
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">SEBI Charges (%)</label>
                      <input
                        type="number"
                        step="0.00001"
                        value={sebiRate}
                        onChange={(e) => setSebiRate(Number(e.target.value))}
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">Stamp Duty (%)</label>
                      <input
                        type="number"
                        step="0.001"
                        value={stampDutyRate}
                        onChange={(e) => setStampDutyRate(Number(e.target.value))}
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-medium mb-1">GST Rate (%)</label>
                      <input
                        type="number"
                        step="1"
                        value={gstRate}
                        onChange={(e) => setGstRate(Number(e.target.value))}
                        className="w-full p-2 bg-white border border-slate-300 rounded-lg text-slate-800"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Breakeven & Impact Metrics */}
            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 mt-12">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Breakeven Analysis</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xs text-slate-500 font-medium">Breakeven Price Movement</div>
                  <div className="text-2xl font-bold text-[#113262] mt-1">{formatCurrency(breakevenPoints)} / share</div>
                  <div className="text-xs text-slate-400 mt-1">Min stock price movement needed to cover costs</div>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="text-xs text-slate-500 font-medium">Charges as % of Trade Value</div>
                  <div className="text-2xl font-bold text-slate-900 mt-1">{totalCostPct.toFixed(3)}%</div>
                  <div className="text-xs text-slate-400 mt-1">Total transaction friction</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dark Navy Sticky Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="bg-[#1e2a4f] text-white rounded-2xl p-6 shadow-xl border border-slate-800">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold">Brokerage & Costs</h3>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Brokerage Cost Breakdown',
                        text: `Total transaction cost for trade of ${formatCurrency(tradeValue)} is ${formatCurrency(totalCost)}.`,
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
                <div className="text-xs text-slate-400 mb-1 font-medium">Total Transaction Cost</div>
                <div className="text-3xl font-extrabold text-white">{formatCurrency(totalCost)}</div>
                <div className="text-xs text-emerald-400 mt-1 font-medium">
                  {totalCostPct.toFixed(3)}% of trade value
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="space-y-3.5 text-sm border-t border-slate-800 pt-4">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Brokerage</span>
                  <span className="font-semibold text-white">{formatCurrency(brokerageFee)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>STT</span>
                  <span className="font-semibold text-white">{formatCurrency(sttFee)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Exchange Charges</span>
                  <span className="font-semibold text-white">{formatCurrency(exchangeFee)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>SEBI Fees</span>
                  <span className="font-semibold text-white">{formatCurrency(sebiFee)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Stamp Duty</span>
                  <span className="font-semibold text-white">{formatCurrency(stampDutyFee)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>GST</span>
                  <span className="font-semibold text-white">{formatCurrency(gstFee)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-300 pt-3 border-t border-slate-800">
                  <span className="font-bold text-white">Total Charges</span>
                  <span className="font-bold text-[#EAB308] text-lg">{formatCurrency(totalCost)}</span>
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
          <h2 className="text-xl font-bold text-[#113262] mb-4">Understanding Your True Trading Costs</h2>
          <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6">
            Enter your trade value, segment (equity delivery, intraday, F&O), and broker type. The calculator breaks down all charges: brokerage, STT, exchange charges, GST, stamp duty, and SEBI fee. It shows the total round-trip cost (buy + sell) and the breakeven price movement needed to cover transaction costs.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-slate-700 border-t border-slate-100 pt-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">Key Components</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li><strong>Trade Value:</strong> Total turnover of buy or sell trade.</li>
                <li><strong>Brokerage Rate:</strong> Broker fee (flat or percentage).</li>
                <li><strong>Transaction Charges:</strong> Exchange regulatory fees.</li>
                <li><strong>Stamp Duty:</strong> State government levy on purchase.</li>
                <li><strong>GST:</strong> 18% tax on brokerage + exchange charges.</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 mb-2">How It Works</h3>
              <p className="mb-2">The calculator considers various factors to determine total trading costs:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li><strong>Brokerage:</strong> Trade Value × Brokerage Rate</li>
                <li><strong>Transaction Charges:</strong> Trade Value × 0.00325% (NSE)</li>
                <li><strong>Stamp Duty:</strong> Trade Value × 0.015%</li>
                <li><strong>GST:</strong> (Brokerage + Transaction Charges) × 18%</li>
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

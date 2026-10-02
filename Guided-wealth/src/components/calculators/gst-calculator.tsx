import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp, Receipt, Building2, Percent, Sliders, CheckSquare, Square } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

export default function GstCalculator() {
  // Input States
  const [calculationType, setCalculationType] = useState<string>('add'); // 'add' (Exclusive) or 'remove' (Inclusive)
  const [gstLocation, setGstLocation] = useState<string>('intrastate'); // 'intrastate' (CGST+SGST) or 'interstate' (IGST)
  const [amount, setAmount] = useState<number>(1000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [useItemized, setUseItemized] = useState<boolean>(false);

  // Advanced Settings
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [cgstRatio, setCgstRatio] = useState<number>(50);
  const [sgstRatio, setSgstRatio] = useState<number>(50);
  const [cessRate, setCessRate] = useState<number>(0);

  // Computed Outputs
  const [taxableAmount, setTaxableAmount] = useState<number>(0);
  const [totalGst, setTotalGst] = useState<number>(0);
  const [cgstAmount, setCgstAmount] = useState<number>(0);
  const [sgstAmount, setSgstAmount] = useState<number>(0);
  const [igstAmount, setIgstAmount] = useState<number>(0);
  const [cessAmount, setCessAmount] = useState<number>(0);
  const [totalAmountIncGst, setTotalAmountIncGst] = useState<number>(0);

  useEffect(() => {
    let base = 0;
    let gst = 0;

    if (calculationType === 'add') {
      // Exclusive: Amount is Taxable Base
      base = amount;
      gst = base * (gstRate / 100);
    } else {
      // Inclusive: Amount includes GST
      base = amount / (1 + gstRate / 100);
      gst = amount - base;
    }

    const cess = base * (cessRate / 100);
    const total = base + gst + cess;

    let c = 0;
    let s = 0;
    let i = 0;

    if (gstLocation === 'intrastate') {
      c = gst * (cgstRatio / 100);
      s = gst * (sgstRatio / 100);
      i = 0;
    } else {
      c = 0;
      s = 0;
      i = gst;
    }

    setTaxableAmount(base);
    setTotalGst(gst);
    setCgstAmount(c);
    setSgstAmount(s);
    setIgstAmount(i);
    setCessAmount(cess);
    setTotalAmountIncGst(total);
  }, [calculationType, gstLocation, amount, gstRate, cgstRatio, sgstRatio, cessRate]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
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
      {/* Header Banner */}
      <div className="bg-white pt-32 pb-10 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">GST Calculator</h1>
        <p className="text-slate-600 text-base">
          Calculate GST for your invoices and purchases with CGST, SGST & IGST breakdown
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Grid */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Inputs Column */}
          <div className="flex-1 space-y-6">
            {/* Basic Details Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-blue-600" /> Basic Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Calculation Type</label>
                  <select
                    value={calculationType}
                    onChange={(e) => setCalculationType(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none font-semibold text-slate-800 bg-white text-sm"
                  >
                    <option value="add">Add GST to Amount (Exclusive)</option>
                    <option value="remove">Remove GST from Amount (Inclusive)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">GST Location</label>
                  <select
                    value={gstLocation}
                    onChange={(e) => setGstLocation(e.target.value)}
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none font-semibold text-slate-800 bg-white text-sm"
                  >
                    <option value="intrastate">Within Same State (CGST + SGST)</option>
                    <option value="interstate">Interstate / Outside State (IGST)</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <button
                  onClick={() => setUseItemized(!useItemized)}
                  className="flex items-center gap-2 text-sm text-slate-700 font-medium hover:text-blue-600 transition-colors"
                >
                  {useItemized ? (
                    <CheckSquare className="w-4 h-4 text-blue-600" />
                  ) : (
                    <Square className="w-4 h-4 text-slate-400" />
                  )}
                  <span>Use Itemized Calculation</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Amount</label>
                    <CurrencyInput
                    value={amount}
                    onValueChange={(val) => setAmount(val)}
                  />
                  </div>
                  <input
                    type="range"
                    min="100"
                    max="100000"
                    step="100"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}

                    style={getSliderStyle(amount, "100", "1000000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>₹100</span>
                    <span>₹1,00,000</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">GST Rate (%)</label>
                  <select
                    value={gstRate}
                    onChange={(e) => setGstRate(Number(e.target.value))}
                    className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none font-semibold text-slate-800 bg-white text-sm"
                  >
                    <option value={0}>0% (Exempted)</option>
                    <option value={5}>5% (Essential items & transport)</option>
                    <option value={12}>12% (Standard goods & services)</option>
                    <option value={18}>18% (Standard services & electronics)</option>
                    <option value={28}>28% (Luxury & sin goods)</option>
                  </select>
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
                  <Sliders className="w-5 h-5 text-blue-600" /> Advanced Settings (Split & Compensation Cess)
                </span>
                {showAdvanced ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
              </button>

              {showAdvanced && (
                <div className="p-6 pt-0 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">CGST Ratio (%)</label>
                    <input
                      type="number"
                      value={cgstRatio}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setCgstRatio(val);
                        setSgstRatio(100 - val);
                      }}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">SGST Ratio (%)</label>
                    <input
                      type="number"
                      value={sgstRatio}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setSgstRatio(val);
                        setCgstRatio(100 - val);
                      }}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Cess Rate (%)</label>
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={cessRate}
                      onChange={(e) => setCessRate(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Summary Card */}
          <div className="w-full lg:w-[380px]">
            <div className="bg-[#1e2a4f] rounded-2xl shadow-xl p-6 md:p-8 text-white sticky top-28 border border-slate-600/50">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-bold tracking-tight">GST Calculation</h2>
                <button className="text-slate-400 hover:text-white transition-colors p-1" title="Share">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-8 bg-slate-800/80 p-5 rounded-2xl border border-slate-600">
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">
                  {formatCurrency(totalAmountIncGst)}
                </div>
                <div className="text-slate-300 text-xs font-medium uppercase tracking-wider">Total Amount (Inc. GST)</div>
              </div>

              <div className="space-y-4 border-t border-slate-600/60 pt-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Taxable Amount</span>
                  <span className="font-semibold text-white">{formatCurrency(taxableAmount)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Total GST</span>
                  <span className="font-semibold text-emerald-400">{formatCurrency(totalGst)}</span>
                </div>
                {gstLocation === 'intrastate' ? (
                  <>
                    <div className="flex justify-between items-center text-sm pl-3 border-l-2 border-slate-600">
                      <span className="text-slate-300">CGST ({cgstRatio}%)</span>
                      <span className="font-semibold text-slate-200">{formatCurrency(cgstAmount)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm pl-3 border-l-2 border-slate-600">
                      <span className="text-slate-300">SGST ({sgstRatio}%)</span>
                      <span className="font-semibold text-slate-200">{formatCurrency(sgstAmount)}</span>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between items-center text-sm pl-3 border-l-2 border-slate-600">
                    <span className="text-slate-300">IGST (100%)</span>
                    <span className="font-semibold text-slate-200">{formatCurrency(igstAmount)}</span>
                  </div>
                )}
                {cessAmount > 0 && (
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-600/40">
                    <span className="text-slate-300">Compensation Cess</span>
                    <span className="font-semibold text-amber-400">{formatCurrency(cessAmount)}</span>
                  </div>
                )}
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
              <h2 className="text-xl font-bold text-[#113262] mb-4">What is GST?</h2>
              <p className="text-slate-600 mb-4">
                Goods and Services Tax (GST) is a comprehensive, multi-stage, destination-based tax levied on the supply of goods and services. It is a unified tax system that replaced multiple indirect taxes, simplifying the taxation process and creating a more transparent economic environment.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Key Components</h3>
              <p className="text-slate-600 mb-4">
                GST is structured with different tax rates for various goods and services, including 0%, 5%, 12%, 18%, and 28%. The tax is collected at every stage of the supply chain, with input tax credit allowing businesses to offset the GST paid on inputs against the GST collected on outputs.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Types of GST</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600 mb-6">
                <li>Central GST (CGST)</li>
                <li>State GST (SGST)</li>
                <li>Integrated GST (IGST)</li>
                <li>Union Territory GST (UTGST)</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Benefits of GST</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600 mb-6">
                <li>Simplified tax structure</li>
                <li>Reduced cascading effect of taxes</li>
                <li>Increased transparency</li>
                <li>Easier interstate trade</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Using the GST Calculator</h3>
              <p className="text-slate-600">
                Calculate GST for your transactions by entering the base amount and applicable GST rate. Understand how GST impacts your business or personal finances, and get a clear breakdown of tax calculations.
              </p>
            </section>

            <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-2xl font-bold text-[#113262]">Frequently Asked Questions</h2>

              <div className="border-b border-slate-100 pb-5">
                <h3 className="font-bold text-slate-900 mb-2">What are the GST rates in India?</h3>
                <p className="text-slate-600 text-base">
                  GST has four main rate slabs: 5% (essential items), 12% (processed foods, business-class air tickets), 18% (most services, electronics, financial services), and 28% (luxury goods, automobiles). Some items like fresh food, milk, and healthcare are tax-exempt (0%). A compensation cess applies on certain items like aerated drinks and tobacco.
                </p>
              </div>

              <div className="border-b border-slate-100 pb-5">
                <h3 className="font-bold text-slate-900 mb-2">How do I calculate GST on a product?</h3>
                <p className="text-slate-600 text-base">
                  For inclusive price GST Amount = Price x (GST Rate / (100 + GST Rate)). For exclusive price GST Amount = Price x (GST Rate / 100). For intrastate sales, GST is split equally as CGST and SGST. For interstate sales, the full amount is IGST.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-2">What is the difference between CGST, SGST, and IGST?</h3>
                <p className="text-slate-600 text-base">
                  CGST (Central GST) and SGST (State GST) apply to intrastate transactions and are split equally. IGST (Integrated GST) applies to interstate transactions and is equal to the full GST rate. For example, on an 18% intrastate sale: 9% CGST + 9% SGST. On an 18% interstate sale: 18% IGST.
                </p>
              </div>
            </section>
          </div>

          {/* Right Column: SEO Card */}
          <div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-lg">How This GST Calculator Works</h3>
              <p className="text-slate-600 text-sm leading-relaxed mb-4">
                Enter the product or service amount and select the applicable GST rate. The calculator shows the GST amount, total price, and the split between CGST/SGST or IGST based on whether the transaction is intrastate or interstate. It works for both tax-inclusive and tax-exclusive pricing.
              </p>

              <h4 className="font-bold text-slate-800 text-sm">GST Input Tax Credit</h4>
              <p className="text-slate-600 text-xs leading-relaxed">
                Businesses can claim input tax credit (ITC) on GST paid on purchases and expenses used for business purposes. ITC reduces the GST payable on sales, effectively ensuring tax is paid only on the value addition at each stage. Ensure your suppliers file their GSTR-1 on time for your ITC claims to be reflected in GSTR-2B.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

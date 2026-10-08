import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp, Receipt, DollarSign, ShieldAlert, Sliders } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

export default function TdsCalculator() {
  // Input States
  const [paymentAmount, setPaymentAmount] = useState<number>(500000);
  const [paymentTypeSection, setPaymentTypeSection] = useState<string>('194A'); // 192, 194A, 194C, 194H, 194I, 194J, 194IA
  const [isPanAvailable, setIsPanAvailable] = useState<boolean>(true);

  // Advanced Settings
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [includeSurcharge, setIncludeSurcharge] = useState<boolean>(false);

  // Computed Outputs
  const [tdsRateApplied, setTdsRateApplied] = useState<number>(10);
  const [tdsAmount, setTdsAmount] = useState<number>(0);
  const [netPaymentAfterTds, setNetPaymentAfterTds] = useState<number>(0);
  const [annualTdsMonthly, setAnnualTdsMonthly] = useState<number>(0);

  useEffect(() => {
    let baseRate = 10; // Default 10%

    // Statutory TDS Rates in India
    switch (paymentTypeSection) {
      case '192':
        baseRate = paymentAmount > 1200000 ? 15 : paymentAmount > 700000 ? 10 : 5; // Salary slab approximation
        break;
      case '194A':
        baseRate = 10; // Interest (Bank/FD/Other)
        break;
      case '194C':
        baseRate = 1; // Contractor Payments (1% individual, 2% company)
        break;
      case '194H':
        baseRate = 5; // Commission / Brokerage
        break;
      case '194I':
        baseRate = 10; // Rent on land/building (2% on plant/machinery)
        break;
      case '194J':
        baseRate = 10; // Professional / Technical fees
        break;
      case '194IA':
        baseRate = 1; // Property Transfer (1%)
        break;
      default:
        baseRate = 10;
    }

    // Higher TDS Rate if NO PAN is furnished (Section 206AA: 20% flat)
    let finalRate = isPanAvailable ? baseRate : Math.max(20, baseRate);
    if (includeSurcharge) {
      finalRate = finalRate * 1.10; // 10% Surcharge for high value payments
    }

    const calculatedTds = Math.round(paymentAmount * (finalRate / 100));
    const netPay = paymentAmount - calculatedTds;
    const annTds = calculatedTds * 12;

    setTdsRateApplied(finalRate);
    setTdsAmount(calculatedTds);
    setNetPaymentAfterTds(netPay);
    setAnnualTdsMonthly(annTds);
  }, [paymentAmount, paymentTypeSection, isPanAvailable, includeSurcharge]);

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
      {/* Header Banner */}
      <div className="bg-white pt-32 pb-10 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">TDS Calculator</h1>
        <p className="text-slate-600 text-base">
          Calculate Tax Deducted at Source (TDS) on your payments under applicable IT sections
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Grid */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Inputs Column */}
          <div className="flex-1 space-y-6">
            {/* Payment Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-blue-600" /> Payment Details
              </h2>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-700">Payment Amount</label>
                  <CurrencyInput
                    value={paymentAmount}
                    onValueChange={(val) => setPaymentAmount(val)}
                  />
                </div>
                <input
                  type="range"
                  min="1000"
                  max="5000000"
                  step="25000"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(Number(e.target.value))}

                  style={getSliderStyle(paymentAmount, "1000", "10000000")}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                  <span>₹1,000</span>
                  <span>₹50 Lakhs</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Payment Type (TDS Section)</label>
                <select
                  value={paymentTypeSection}
                  onChange={(e) => setPaymentTypeSection(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none font-semibold text-slate-800 bg-white text-sm"
                >
                  <option value="194A">Section 194A - Interest (Bank / FD / Other): 10%</option>
                  <option value="192">Section 192 - Salary: As per slab rate</option>
                  <option value="194C">Section 194C - Contractor Payments: 1% (indiv) / 2% (co)</option>
                  <option value="194H">Section 194H - Commission / Brokerage: 5%</option>
                  <option value="194I">Section 194I - Rent: 10% (Land/Building)</option>
                  <option value="194J">Section 194J - Professional / Technical Fees: 10% / 2%</option>
                  <option value="194IA">Section 194IA - Property Transfer: 1%</option>
                </select>
              </div>
            </div>

            {/* PAN Status Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-blue-600" /> PAN Status
              </h2>

              <label className="block text-sm font-medium text-slate-700 mb-3">Is PAN available?</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setIsPanAvailable(true)}
                  className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all ${isPanAvailable
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                >
                  PAN Available
                </button>
                <button
                  onClick={() => setIsPanAvailable(false)}
                  className={`py-3 px-4 rounded-xl border text-sm font-bold transition-all ${!isPanAvailable
                      ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                >
                  No PAN (20% TDS)
                </button>
              </div>
            </div>

            {/* Advanced Settings Accordion */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full p-6 flex justify-between items-center font-bold text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <span className="flex items-center gap-2 text-base">
                  <Sliders className="w-5 h-5 text-blue-600" /> Advanced Settings (Surcharge)
                </span>
                {showAdvanced ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
              </button>

              {showAdvanced && (
                <div className="p-6 pt-0 border-t border-slate-100 mt-4">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeSurcharge}
                      onChange={(e) => setIncludeSurcharge(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded focus:ring-blue-600"
                    />
                    <span>Include Surcharge (for payments above ₹50 Lakh)</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Summary Card */}
          <div className="w-full lg:w-[380px]">
            <div className="bg-[#1e2a4f] rounded-2xl shadow-xl p-6 md:p-8 text-white sticky top-28 border border-slate-600/50">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-bold tracking-tight">TDS Summary</h2>
                <button className="text-slate-400 hover:text-white transition-colors p-1" title="Share">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-8 bg-slate-800/80 p-5 rounded-2xl border border-slate-600">
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">
                  {formatCurrency(tdsAmount)}
                </div>
                <div className="text-slate-300 text-xs font-medium uppercase tracking-wider">TDS Amount</div>
              </div>

              <div className="space-y-4 border-t border-slate-600/60 pt-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Net Payment After TDS</span>
                  <span className="font-semibold text-emerald-400">{formatCurrency(netPaymentAfterTds)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">TDS Rate Applied</span>
                  <span className="font-semibold text-white">{tdsRateApplied.toFixed(2)}%</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-3 border-t border-slate-600/40">
                  <span className="text-slate-300">Annual TDS (if monthly)</span>
                  <span className="font-semibold text-white">{formatCurrency(annualTdsMonthly)}</span>
                </div>
              </div>

              <button className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2">
                Plan Your Tax <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Informational SEO & FAQs Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-slate-200">
          <div className="md:col-span-2 space-y-8 text-slate-700 text-sm md:text-base leading-relaxed">
            <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-[#113262] mb-4">TDS (Tax Deducted at Source) Calculator</h2>
              <p className="text-slate-600 mb-4">
                Tax Deducted at Source (TDS) is a mechanism introduced by the Income Tax Department to collect tax at the point of income generation. It ensures a steady flow of revenue to the government and reduces tax evasion by deducting tax before the income reaches the recipient.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">What is TDS?</h3>
              <p className="text-slate-600 mb-4">
                TDS is the amount deducted from payments such as salary, interest, commission, rent, professional fees, and other specified payments. The person making the payment (deductor) deducts tax at the applicable rate and deposits it with the government on behalf of the payee (deductee).
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Common TDS Sections and Rates</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600 mb-6">
                <li>Section 192 – Salary: As per applicable income tax slab</li>
                <li>Section 194A – Interest (other than securities): 10%</li>
                <li>Section 194C – Contractor Payments: 1% (individual/HUF), 2% (Others)</li>
                <li>Section 194H – Commission/Brokerage: 5%</li>
                <li>Section 194I – Rent: 10% (Land/Building), 2% (Plant/Machinery)</li>
                <li>Section 194J – Professional/Technical Fees: 10% / 2%</li>
                <li>Section 194IA – Property Transfer: 1%</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Important TDS Rules</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600 mb-6">
                <li>If the payee does not furnish PAN, TDS is deducted at 20% or the applicable rate, whichever is higher</li>
                <li>TDS must be deposited with the government by the 7th of the following month</li>
                <li>TDS returns must be filed quarterly</li>
                <li>TDS certificates (Form 16/16A) must be issued to the deductee</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">TDS Compliance</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600 mb-6">
                <li>Obtain TAN (Tax Deduction Account Number) before deducting TDS</li>
                <li>Deduct TDS at the correct rate and time</li>
                <li>Deposit TDS within the prescribed due dates</li>
                <li>File TDS returns on time to avoid penalties</li>
                <li>Issue TDS certificates to payees</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Using the TDS Calculator</h3>
              <p className="text-slate-600">
                Enter the payment amount and select the applicable TDS section to instantly calculate the TDS amount, net payment after deduction, and the effective TDS rate. The calculator also shows the annual TDS impact for recurring monthly payments.
              </p>
            </section>

            <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-2xl font-bold text-[#113262]">Frequently Asked Questions</h2>

              <div className="border-b border-slate-100 pb-5">
                <h3 className="font-bold text-slate-900 mb-2">What is TDS?</h3>
                <p className="text-slate-600 text-base">
                  Tax Deducted at Source (TDS) is an advance tax collection mechanism where the payer deducts tax before making a payment. TDS applies to salary, interest, rent, professional fees, commission, and other specified payments. The deducted amount is deposited with the government and credited against your total tax liability.
                </p>
              </div>

              <div className="border-b border-slate-100 pb-5">
                <h3 className="font-bold text-slate-900 mb-2">What are the common TDS rates?</h3>
                <p className="text-slate-600 text-base">
                  Salary: as per applicable slab; TD interest: 10%; Rent (property): 10% if annual rent exceeds Rs 2.4 lakh; Professional fees: 10%; Commission: 5%; Sale of property: 1% of sale value above Rs 50 lakh. If PAN is not furnished, TDS is deducted at 20%. These rates apply for FY 2025-26.
                </p>
              </div>

              <div className="border-b border-slate-100 pb-5">
                <h3 className="font-bold text-slate-900 mb-2">How do I claim TDS refund?</h3>
                <p className="text-slate-600 text-base">
                  File your income tax return by the due date. If TDS deducted exceeds your actual tax liability, the excess is refunded to your bank account linked to ITR. Refunds are typically processed within 1-4 months of filing. Verify your Form 26AS or AIS to ensure all TDS credits are reflected before filing.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-2">When is TDS not deducted?</h3>
                <p className="text-slate-600 text-base">
                  Submit Form 15G (under 60) or Form 15H (senior citizens) to your bank if your total income is below the taxable limit. This prevents TDS on FD interest. For other incomes, you can apply for a lower/nil TDS certificate from the Income Tax Department using Form 13.
                </p>
              </div>
            </section>
          </div>

          {/* Right Column: SEO Card */}
          <div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-lg">Understanding TDS Deductions</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                This calculator estimates TDS applicable on various types of payments including salary, rent, interest, professional fees, and property sale. Enter the payment type and amount to see the applicable TDS rate and deduction amount. It also shows whether Form 15G/15H can be submitted to avoid TDS.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

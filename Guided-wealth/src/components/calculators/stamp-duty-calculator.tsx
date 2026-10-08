import React, { useState, useEffect } from 'react';
import { Share2, ChevronUp, ChevronDown } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

interface StateRates {
  name: string;
  maleStampDuty: number;
  femaleStampDuty: number;
  jointStampDuty: number;
  regRate: number;
  maxRegCap?: number;
}

const STATE_RATES: Record<string, StateRates> = {
  Maharashtra: { name: 'Maharashtra', maleStampDuty: 6, femaleStampDuty: 5, jointStampDuty: 5.5, regRate: 1, maxRegCap: 30000 },
  Delhi: { name: 'Delhi', maleStampDuty: 6, femaleStampDuty: 4, jointStampDuty: 5, regRate: 1 },
  Karnataka: { name: 'Karnataka', maleStampDuty: 5, femaleStampDuty: 5, jointStampDuty: 5, regRate: 1 },
  TamilNadu: { name: 'Tamil Nadu', maleStampDuty: 7, femaleStampDuty: 7, jointStampDuty: 7, regRate: 4 },
  UttarPradesh: { name: 'Uttar Pradesh', maleStampDuty: 7, femaleStampDuty: 6, jointStampDuty: 6.5, regRate: 1 },
  Gujarat: { name: 'Gujarat', maleStampDuty: 4.9, femaleStampDuty: 3.9, jointStampDuty: 4.4, regRate: 1 },
  WestBengal: { name: 'West Bengal', maleStampDuty: 6, femaleStampDuty: 5, jointStampDuty: 5.5, regRate: 1 },
  Rajasthan: { name: 'Rajasthan', maleStampDuty: 6, femaleStampDuty: 5, jointStampDuty: 5.5, regRate: 1 },
  Haryana: { name: 'Haryana', maleStampDuty: 7, femaleStampDuty: 5, jointStampDuty: 6, regRate: 1 },
  Other: { name: 'Other States', maleStampDuty: 6, femaleStampDuty: 5, jointStampDuty: 5.5, regRate: 1 },
};

export default function StampDutyCalculator() {
  // Inputs
  const [propertyValue, setPropertyValue] = useState<number>(5000000);
  const [selectedState, setSelectedState] = useState<string>('Maharashtra');
  const [propertyType, setPropertyType] = useState<string>('residential'); // residential, commercial
  const [buyerGender, setBuyerGender] = useState<string>('male'); // male, female, joint
  const [isUnderConstruction, setIsUnderConstruction] = useState<boolean>(false);
  const [showAdditionalOptions, setShowAdditionalOptions] = useState<boolean>(true);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Computed Outputs
  const [stampDutyRate, setStampDutyRate] = useState<number>(6);
  const [stampDutyAmount, setStampDutyAmount] = useState<number>(0);
  const [registrationRate, setRegistrationRate] = useState<number>(1);
  const [registrationAmount, setRegistrationAmount] = useState<number>(0);
  const [totalGovtCharges, setTotalGovtCharges] = useState<number>(0);
  const [totalPropertyCost, setTotalPropertyCost] = useState<number>(0);
  const [chargesPctOfValue, setChargesPctOfValue] = useState<number>(0);

  useEffect(() => {
    const stateData = STATE_RATES[selectedState] || STATE_RATES['Other'];
    let sdRate = stateData.maleStampDuty;

    if (buyerGender === 'female') {
      sdRate = stateData.femaleStampDuty;
    } else if (buyerGender === 'joint') {
      sdRate = stateData.jointStampDuty;
    }

    const sdAmount = Math.round(propertyValue * (sdRate / 100));

    let regAmount = Math.round(propertyValue * (stateData.regRate / 100));
    if (stateData.maxRegCap && regAmount > stateData.maxRegCap) {
      regAmount = stateData.maxRegCap;
    }

    const totCharges = sdAmount + regAmount;
    const totCost = propertyValue + totCharges;
    const pct = propertyValue > 0 ? (totCharges / propertyValue) * 100 : 0;

    setStampDutyRate(sdRate);
    setStampDutyAmount(sdAmount);
    setRegistrationRate(stateData.regRate);
    setRegistrationAmount(regAmount);
    setTotalGovtCharges(totCharges);
    setTotalPropertyCost(totCost);
    setChargesPctOfValue(pct);
  }, [propertyValue, selectedState, propertyType, buyerGender, isUnderConstruction]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
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

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: 'What is stamp duty on property in India?',
      a: 'Stamp duty is a state government tax levied on property transactions. Rates vary by state: Maharashtra (5-6%), Karnataka (5%), Delhi (4-6%), Tamil Nadu (7%), and Uttar Pradesh (6-7%). Women buyers get a 1-2% concession in several states. Stamp duty is calculated on the agreement value or circle rate, whichever is higher.',
    },
    {
      q: 'How much are property registration charges?',
      a: 'Registration charges are typically 1% of the property value (capped at ₹30,000 in Maharashtra). Tamil Nadu charges 4% registration fee. This is over and above the stamp duty tax.',
    },
    {
      q: 'Can I save on stamp duty by registering in a woman name?',
      a: 'Yes! States like Delhi, Haryana, Uttar Pradesh, Maharashtra, Rajasthan, and Punjab offer a 1% to 2% rebate on stamp duty when property is registered solely or jointly in a woman name.',
    },
    {
      q: 'Is stamp duty tax deductible under Section 80C?',
      a: 'Yes, stamp duty and registration fees paid during property purchase are eligible for tax deduction under Section 80C up to a overall limit of ₹1.5 Lakh in the year of payment.',
    },
  ];

  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      {/* Header Banner */}
      <div className="bg-white pt-32 pb-10 text-center">
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Stamp Duty & Registration Calculator</h1>
        <p className="text-slate-600 text-base max-w-2xl mx-auto px-4">
          Estimate exact government charges, stamp duty concessions, and registration fees for your property purchase.
        </p>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Column: Inputs */}
          <div className="lg:col-span-8 space-y-6">

            {/* Property Details Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Property Details</h2>

              {/* Property Value */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Property Value</label>
                <CurrencyInput
                    value={propertyValue}
                    onValueChange={(val) => setPropertyValue(val)}
                  />
                <div className="mt-3">
                  <input
                    type="range"
                    min="100000"
                    max="100000000"
                    step="500000"
                    value={propertyValue}
                    onChange={(e) => setPropertyValue(Number(e.target.value))}
                    style={getSliderStyle(propertyValue, "100000", "100000000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-2 font-medium">
                    <span>₹10L</span>
                    <span>₹10Cr</span>
                  </div>
                </div>
              </div>

              {/* State Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">State</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
                >
                  {Object.keys(STATE_RATES).map((stKey) => (
                    <option key={stKey} value={stKey}>
                      {STATE_RATES[stKey].name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Buyer & Property Type Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <h2 className="text-xl font-bold text-slate-900 mb-6">Buyer & Property Type</h2>

              {/* Property Type Selection */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-slate-700 mb-3">Property Type</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPropertyType('residential')}
                    className={`rounded-xl p-4 text-center cursor-pointer transition-all ${propertyType === 'residential'
                      ? 'border-2 border-blue-500 bg-blue-50/40 text-slate-900 shadow-xs'
                      : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                  >
                    <div className="text-base font-bold text-slate-900">Residential</div>
                    <div className="text-xs text-slate-400 mt-1">Flat, House, Villa</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPropertyType('commercial')}
                    className={`rounded-xl p-4 text-center cursor-pointer transition-all ${propertyType === 'commercial'
                      ? 'border-2 border-blue-500 bg-blue-50/40 text-slate-900 shadow-xs'
                      : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                  >
                    <div className="text-base font-bold text-slate-900">Commercial</div>
                    <div className="text-xs text-slate-400 mt-1">Office, Shop, Warehouse</div>
                  </button>
                </div>
              </div>

              {/* Buyer Gender Selection */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">Buyer Gender</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setBuyerGender('male')}
                    className={`rounded-xl p-4 text-center cursor-pointer transition-all ${buyerGender === 'male'
                      ? 'border-2 border-blue-500 bg-blue-50/40 text-slate-900 shadow-xs'
                      : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                  >
                    <div className="text-base font-bold text-slate-900">Male</div>
                    <div className="text-xs text-slate-400 mt-1">Standard rates</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBuyerGender('female')}
                    className={`rounded-xl p-4 text-center cursor-pointer transition-all ${buyerGender === 'female'
                      ? 'border-2 border-blue-500 bg-blue-50/40 text-slate-900 shadow-xs'
                      : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                  >
                    <div className="text-base font-bold text-slate-900">Female</div>
                    <div className="text-xs text-slate-400 mt-1">Concession available</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Additional Options Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5">
              <div
                onClick={() => setShowAdditionalOptions(!showAdditionalOptions)}
                className="flex items-center justify-between cursor-pointer select-none"
              >
                <h2 className="text-xl font-bold text-slate-900">Additional Options</h2>
                {showAdditionalOptions ? (
                  <ChevronUp className="w-5 h-5 text-slate-700" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-700" />
                )}
              </div>

              {showAdditionalOptions && (
                <div className="mt-6 pt-4 border-t border-slate-100 space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer text-sm font-semibold text-slate-900">
                    <input
                      type="checkbox"
                      checked={isUnderConstruction}
                      onChange={(e) => setIsUnderConstruction(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                    <span>Under-construction property (GST may apply)</span>
                  </label>

                  {isUnderConstruction && (
                    <p className="text-xs text-slate-500 leading-relaxed pl-7">
                      Note: GST of 5% (without ITC) or 1% (affordable housing) is applicable on under-construction properties. This is charged by the builder and is separate from stamp duty.
                    </p>
                  )}

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 space-y-1.5">
                    <div className="font-semibold text-slate-900 mb-1">
                      Applicable Rates for {STATE_RATES[selectedState]?.name || 'Selected State'}:
                    </div>
                    <div>• Stamp Duty (Male): {STATE_RATES[selectedState]?.maleStampDuty || 6}%</div>
                    <div>• Stamp Duty (Female): {STATE_RATES[selectedState]?.femaleStampDuty || 5}%</div>
                    <div>• Registration: {STATE_RATES[selectedState]?.regRate || 1}%</div>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Right Column: Dark Blue Summary Card */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div className="bg-[#1e2a4f] text-white rounded-2xl p-6 shadow-xl border border-slate-800">

              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-white">Stamp Duty & Charges</h3>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Stamp Duty & Registration Charges',
                        text: `Total Government Charges: ${formatCurrency(totalGovtCharges)} for property value ${formatCurrency(propertyValue)} in ${selectedState}.`,
                        url: window.location.href,
                      }).catch(() => { });
                    } else {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    }
                  }}
                  className="p-1 text-slate-300 hover:text-white transition-colors"
                  title="Share"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              {/* Large Hero Output */}
              <div className="text-center mb-6">
                <div className="text-3xl sm:text-4xl font-extrabold text-white mb-1 tracking-tight">
                  {formatCurrency(totalGovtCharges)}
                </div>
                <div className="text-xs text-slate-300 font-medium">Total Government Charges</div>
              </div>

              {/* Breakdown Rows */}
              <div className="space-y-1 text-sm border-t border-slate-700/60 pt-4">
                <div className="flex justify-between items-center py-2.5 text-slate-200">
                  <span>Stamp Duty ({stampDutyRate}%)</span>
                  <span className="font-semibold text-white">{formatCurrency(stampDutyAmount)}</span>
                </div>

                <div className="flex justify-between items-center py-2.5 text-slate-200 border-t border-slate-700/60">
                  <span>Registration ({registrationRate}%)</span>
                  <span className="font-semibold text-white">{formatCurrency(registrationAmount)}</span>
                </div>

                <div className="flex justify-between items-center py-2.5 text-slate-200 border-t border-slate-700/60">
                  <span className="font-medium">Total Govt Charges</span>
                  <span className="font-bold text-white">{formatCurrency(totalGovtCharges)}</span>
                </div>

                <div className="flex justify-between items-center py-2.5 text-slate-200 border-t border-slate-700/60">
                  <span className="font-medium">Property + Charges</span>
                  <span className="font-bold text-white">{formatCurrency(totalPropertyCost)}</span>
                </div>

                <div className="flex justify-between items-center py-2.5 text-slate-200 border-t border-slate-700/60">
                  <span className="font-medium">Charges % of Value</span>
                  <span className="font-bold text-white">{chargesPctOfValue.toFixed(2)}%</span>
                </div>
              </div>
            </div>

            {/* Orange Action Button */}
            <button className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2">
              Start Investing Now <span aria-hidden="true">&rarr;</span>
            </button>
          </div>

        </div>

        {/* Informational Content Section */}
        <div className="max-w-4xl space-y-12 text-slate-700 leading-relaxed mt-12">
          <section>
            <h2 className="text-xl font-bold text-[#113262] mb-4">Calculate Your Property Transaction Costs</h2>
            <p className="mb-6 text-sm">
              Select your state, property type (residential, commercial), property value, and buyer profile (male, female). The calculator computes the stamp duty, registration charges, and total upfront costs based on the latest state-specific rates. It helps you budget accurately for your property purchase.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
                <h3 className="font-semibold text-slate-900 mb-2">Key Components</h3>
                <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-600">
                  <li><strong>Property Value:</strong> Agreement value or circle rate.</li>
                  <li><strong>State Stamp Duty:</strong> State-specific tax percentage.</li>
                  <li><strong>Registration Charges:</strong> Fee for title registration.</li>
                  <li><strong>Gender Concessions:</strong> Lower stamp duty for women.</li>
                  <li><strong>Total Government Fees:</strong> Stamp Duty + Registration.</li>
                </ul>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-xs">
                <h3 className="font-semibold text-slate-900 mb-2">How It Works</h3>
                <p className="text-sm mb-2 text-slate-600">Applies state-specific rates and concessions:</p>
                <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-600">
                  <li><strong>Stamp Duty:</strong> Property Value × State Stamp Duty Rate</li>
                  <li><strong>Registration Charges:</strong> Property Value × State Registration Rate</li>
                  <li><strong>Total Cost:</strong> Property Value + Stamp Duty + Registration Charges</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="pt-8">
            <h2 className="text-xl font-bold text-[#113262] mb-8">Frequently Asked Questions</h2>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
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
          </section>
        </div>

      </div>
    </div>
  );
}

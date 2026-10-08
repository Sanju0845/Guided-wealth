import React, { useState, useEffect } from 'react';
import { Share2, ChevronDown, ChevronUp, GraduationCap, DollarSign, Calendar, Briefcase, Sliders, CheckCircle2 } from 'lucide-react';
import { CurrencyInput } from '../ui/CurrencyInput';

export default function StudentLoanCalculator() {
  // Input States
  const [loanAmount, setLoanAmount] = useState<number>(500000);
  const [interestRate, setInterestRate] = useState<number>(9.5);
  const [loanTermYears, setLoanTermYears] = useState<number>(5);
  const [moratoriumYears, setMoratoriumYears] = useState<number>(2);
  const [interestDuringMoratorium, setInterestDuringMoratorium] = useState<string>('capitalize');

  // Career States
  const [expectedAnnualSalary, setExpectedAnnualSalary] = useState<number>(500000);
  const [annualSalaryGrowth, setAnnualSalaryGrowth] = useState<number>(10);

  // Advanced States
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [processingFeePercent, setProcessingFeePercent] = useState<number>(1.0);
  const [taxSlabPercent, setTaxSlabPercent] = useState<number>(20);

  // Output States
  const [monthlyEmi, setMonthlyEmi] = useState<number>(0);
  const [totalPrincipal, setTotalPrincipal] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [processingFee, setProcessingFee] = useState<number>(0);
  const [netDisbursement, setNetDisbursement] = useState<number>(0);
  const [debtToIncomeRatio, setDebtToIncomeRatio] = useState<number>(0);
  const [taxSavings80E, setTaxSavings80E] = useState<number>(0);

  useEffect(() => {
    // Moratorium Interest logic
    let morInt = 0;
    if (interestDuringMoratorium === 'capitalize' || interestDuringMoratorium === 'simple') {
      morInt = loanAmount * (interestRate / 100) * moratoriumYears;
    }

    let repaymentPrincipal = loanAmount;
    if (interestDuringMoratorium === 'capitalize') {
      repaymentPrincipal = loanAmount + morInt;
    }

    // Monthly EMI Calculation
    const r = interestRate / 12 / 100;
    const n = loanTermYears * 12;
    let emi = 0;
    if (r > 0 && n > 0) {
      emi = Math.round((repaymentPrincipal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
    } else {
      emi = Math.round(repaymentPrincipal / (n || 1));
    }

    const totalEmiPayment = emi * n;
    let totalIntPaid = totalEmiPayment - repaymentPrincipal;
    if (interestDuringMoratorium === 'simple') {
      totalIntPaid += morInt;
    }

    const totPayment = loanAmount + totalIntPaid;
    const procFee = Math.round(loanAmount * (processingFeePercent / 100));
    const netDisb = loanAmount - procFee;
    const annualRepayment = emi * 12;
    const dti = expectedAnnualSalary > 0 ? (annualRepayment / expectedAnnualSalary) * 100 : 0;

    // Tax savings under 80E (interest is 100% deductible up to 8 years)
    const taxSavings = Math.round(totalIntPaid * (taxSlabPercent / 100));

    setMonthlyEmi(emi);
    setTotalPrincipal(loanAmount);
    setTotalInterest(Math.round(totalIntPaid));
    setTotalPayment(Math.round(totPayment));
    setProcessingFee(procFee);
    setNetDisbursement(netDisb);
    setDebtToIncomeRatio(dti);
    setTaxSavings80E(taxSavings);
  }, [
    loanAmount,
    interestRate,
    loanTermYears,
    moratoriumYears,
    interestDuringMoratorium,
    expectedAnnualSalary,
    processingFeePercent,
    taxSlabPercent,
  ]);

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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Student Loan Calculator</h1>
        <p className="text-slate-600 text-base">
          Plan your education financing, moratorium interest, and repayment strategy
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Layout Grid */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Inputs Column */}
          <div className="flex-1 space-y-6">
            {/* Loan Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-blue-600" /> Loan Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Loan Amount */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Loan Amount</label>
                    <CurrencyInput
                    value={loanAmount}
                    onValueChange={(val) => setLoanAmount(val)}
                  />
                  </div>
                  <input
                    type="range"
                    min="50000"
                    max="10000000"
                    step="50000"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(Number(e.target.value))}

                    style={getSliderStyle(loanAmount, "50000", "10000000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>₹50,000</span>
                    <span>₹1 Cr</span>
                  </div>
                </div>

                {/* Interest Rate */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Interest Rate (%)</label>
                    <span className="text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-300">
                      {interestRate}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="6.0"
                    max="16.0"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(Number(e.target.value))}

                    style={getSliderStyle(interestRate, "6.0", "16.0")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>6%</span>
                    <span>16%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Term & Moratorium Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" /> Term Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Loan Term */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Loan Term (Years)</label>
                    <span className="text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-300">
                      {loanTermYears} Yrs
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="1"
                    value={loanTermYears}
                    onChange={(e) => setLoanTermYears(Number(e.target.value))}

                    style={getSliderStyle(loanTermYears, "1", "15")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>1 year</span>
                    <span>15 years</span>
                  </div>
                </div>

                {/* Moratorium Period */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Moratorium Period (Years)</label>
                    <span className="text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-300">
                      {moratoriumYears} Yrs
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="1"
                    value={moratoriumYears}
                    onChange={(e) => setMoratoriumYears(Number(e.target.value))}

                    style={getSliderStyle(moratoriumYears, "0", "5")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>0 years</span>
                    <span>5 years</span>
                  </div>
                </div>
              </div>

              {/* Interest During Moratorium Select */}
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Interest During Moratorium</label>
                <select
                  value={interestDuringMoratorium}
                  onChange={(e) => setInterestDuringMoratorium(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none font-semibold text-slate-800 bg-white text-sm"
                >
                  <option value="capitalize">Capitalize (Add accumulated interest to principal)</option>
                  <option value="simple">Simple Interest (Pay simple interest monthly during course)</option>
                  <option value="waiver">Government Subsidy / Waiver (No interest during moratorium)</option>
                </select>
              </div>
            </div>

            {/* Career Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-blue-600" /> Career Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Expected Annual Salary Post-Study</label>
                    <CurrencyInput
                    value={expectedAnnualSalary}
                    onValueChange={(val) => setExpectedAnnualSalary(val)}
                  />
                  </div>
                  <input
                    type="range"
                    min="200000"
                    max="5000000"
                    step="50000"
                    value={expectedAnnualSalary}
                    onChange={(e) => setExpectedAnnualSalary(Number(e.target.value))}

                    style={getSliderStyle(expectedAnnualSalary, "200000", "5000000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>₹2 Lakhs</span>
                    <span>₹50 Lakhs</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Annual Salary Growth (%)</label>
                    <span className="text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-300">
                      {annualSalaryGrowth}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    step="1"
                    value={annualSalaryGrowth}
                    onChange={(e) => setAnnualSalaryGrowth(Number(e.target.value))}

                    style={getSliderStyle(annualSalaryGrowth, "0", "25")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                  <div className="flex justify-between text-xs text-slate-400 mt-1.5 font-medium">
                    <span>0%</span>
                    <span>25%</span>
                  </div>
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
                  <Sliders className="w-5 h-5 text-blue-600" /> Advanced Settings
                </span>
                {showAdvanced ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
              </button>

              {showAdvanced && (
                <div className="p-6 pt-0 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Processing Fee (%)</label>
                    <input
                      type="number"
                      step="0.25"
                      min="0"
                      max="3"
                      value={processingFeePercent}
                      onChange={(e) => setProcessingFeePercent(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Tax Bracket (for Sec 80E savings)</label>
                    <select
                      value={taxSlabPercent}
                      onChange={(e) => setTaxSlabPercent(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value={5}>5% Tax Bracket</option>
                      <option value={20}>20% Tax Bracket</option>
                      <option value={30}>30% Tax Bracket</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Loan Summary Card */}
          <div className="w-full lg:w-[380px]">
            <div className="bg-[#1e2a4f] rounded-2xl shadow-xl p-6 md:p-8 text-white sticky top-28 border border-slate-600/50">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-bold tracking-tight">Loan Summary</h2>
                <button className="text-slate-400 hover:text-white transition-colors p-1" title="Share">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-8 bg-slate-800/80 p-5 rounded-2xl border border-slate-600">
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">
                  {formatCurrency(monthlyEmi)}<span className="text-sm font-normal text-slate-300">/mo</span>
                </div>
                <div className="text-slate-300 text-xs font-medium uppercase tracking-wider">Monthly EMI</div>
              </div>

              <div className="space-y-4 border-t border-slate-600/60 pt-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Total Principal</span>
                  <span className="font-semibold text-white">{formatCurrency(totalPrincipal)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Total Interest</span>
                  <span className="font-semibold text-rose-400">{formatCurrency(totalInterest)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Total Payment</span>
                  <span className="font-semibold text-white">{formatCurrency(totalPayment)}</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-3 border-t border-slate-600/40">
                  <span className="text-slate-300">Processing Fee</span>
                  <span className="font-semibold text-white">{formatCurrency(processingFee)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Net Disbursement</span>
                  <span className="font-semibold text-emerald-400">{formatCurrency(netDisbursement)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Debt to Income Ratio</span>
                  <span className={`font-semibold ${debtToIncomeRatio > 40 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {debtToIncomeRatio.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm pt-3 border-t border-slate-600/40">
                  <span className="text-slate-300">Sec 80E Tax Savings</span>
                  <span className="font-semibold text-emerald-400">{formatCurrency(taxSavings80E)}</span>
                </div>
              </div>

              <button className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2">
                Start Investing Now <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Informational SEO & FAQs Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-slate-200">
          <div className="md:col-span-2 space-y-8 text-slate-700 text-sm md:text-base leading-relaxed">
            <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-[#113262] mb-4">What is a Student Loan?</h2>
              <p className="text-slate-600 mb-4">
                A student loan is a type of financial aid designed to help students pay for higher education expenses, including tuition, books, living costs, and other educational fees. These loans provide crucial financial support to pursue academic and career goals.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Key Components</h3>
              <p className="text-slate-600 mb-4">
                Student loans typically include principal amount, interest rate, repayment term, and various repayment options. Factors like loan type (federal or private), interest rate structure, and grace periods significantly impact the overall loan burden.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Types of Student Loans</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>Federal Student Loans</li>
                <li>Private Student Loans</li>
                <li>Subsidized Loans</li>
                <li>Unsubsidized Loans</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-2">Benefits of Student Loans</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
                <li>Access to higher education without immediate cash outlay</li>
                <li>Flexible repayment options tailored to starting salaries</li>
                <li>Potential tax deductions under Section 80E (100% interest deduction)</li>
                <li>Build positive credit history for future financial needs</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-900 mt-6 mb-2">Using the Student Loan Calculator</h3>
              <p className="text-slate-600">
                Calculate your potential loan payments by entering loan amount, interest rate, and repayment term. Understand your monthly obligations and explore different scenarios to make informed financial decisions about your education financing.
              </p>
            </section>

            <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-2xl font-bold text-[#113262]">Frequently Asked Questions</h2>

              <div className="border-b border-slate-100 pb-5">
                <h3 className="font-bold text-slate-900 mb-2">How is student loan different from education loan?</h3>
                <p className="text-slate-600 text-base">
                  In India, the terms are often used interchangeably. Education loans are offered by banks under government schemes (with interest subsidies for economically weaker sections), while student loans from NBFCs may have different terms. Both fund tuition, hostel, books, and living expenses for higher education in India or abroad.
                </p>
              </div>

              <div className="border-b border-slate-100 pb-5">
                <h3 className="font-bold text-slate-900 mb-2">Can I get interest subsidy on education loan?</h3>
                <p className="text-slate-600 text-base">
                  The Central Government's Interest Subsidy Scheme covers the full interest during the moratorium period for students from economically weaker sections (family income below Rs 4.5 lakh). This applies to loans up to Rs 10 lakh for domestic courses and Rs 20 lakh for abroad. The subsidy makes education basic effectively interest-free during studies.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-2">What is the best repayment strategy for student loans?</h3>
                <p className="text-slate-600 text-base">
                  Start with interest-only payments during the moratorium if you can afford it (reduces total cost significantly). After graduation, use the snowball method: pay minimums on student loan while clearing any high-interest debt. Then accelerate student loan repayment. Claim Section 80E deduction on all interest paid.
                </p>
              </div>
            </section>
          </div>

          {/* Right Column: SEO Card */}
          <div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-lg">Plan Your Student Loan Repayment</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Enter the loan amount, interest rate, moratorium period, and repayment tenure. The calculator shows monthly EMI, total interest, and the impact of making interest payments during the moratorium. It also computes the Section 80E tax benefit and shows the effective interest rate after tax savings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

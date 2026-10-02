import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ChevronRight, ChevronLeft, TrendingUp, Calculator, CheckCircle, AlertCircle } from 'lucide-react';
import { CurrencyInput } from '../components/ui/CurrencyInput';
import axios from 'axios';

const Field = ({ label, name, type = "number", isCurrency, options, step, inputs, onChange, placeholder, required = true }: any) => {
  const defaultPlaceholder = `Enter ${label.replace(/ \(.+\)/, '').replace(/[\?]/, '')}`;
  return (
    <div>
      <label className="block text-xs font-bold uppercase tracking-widest text-primary mb-2 min-h-[32px] flex items-end">
        {label} {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {options ? (
        <select required={required} name={name} value={(inputs as any)[name]} onChange={onChange} className="form-input">
          <option value="" disabled>Select...</option>
          {options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : isCurrency ? (
        <CurrencyInput value={(inputs as any)[name] === '' ? 0 : (inputs as any)[name]} onValueChange={(val) => onChange({ target: { name, value: val, type: 'number' } } as any)} placeholder={placeholder || defaultPlaceholder} className="form-input" />
      ) : (
        <input required={required} type={type} step={step} name={name} value={(inputs as any)[name]} onChange={onChange} className="form-input" placeholder={placeholder || defaultPlaceholder} />
      )}
    </div>
  );
};

export default function RetirementAnalysisForm() {
  const { isLoggedIn, user, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isRetake = searchParams.get('retake') === 'true';
  const stepRef = React.useRef<HTMLDivElement>(null);

  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [isConfigured, setIsConfigured] = useState(false);
  const [assessmentFor, setAssessmentFor] = useState<'self' | 'other'>('self');
  const [otherName, setOtherName] = useState('');
  const [otherRelation, setOtherRelation] = useState('');

  const [inputs, setInputs] = useState<any>({
    // 1. Profile
    currentAge: '',
    gender: '',
    maritalStatus: '',
    retirementAge: '',
    lifeExpectancy: '',
    cityTier: '',
    
    // 2. Family
    spouseWorking: '',
    numChildren: '',
    childrenAvgAge: '',
    yearsToFirstChild: '',
    dependentParents: '',
    monthlySupportParents: '',
    
    // 3. Income
    monthlyIncome: '',
    spouseIncome: '',
    otherIncome: '',
    existingInvestments: '',
    
    // 3B. Expenses
    rentEmi: '',
    groceries: '',
    utilities: '',
    transport: '',
    householdHelp: '',
    phoneInternet: '',
    personalCare: '',
    entertainment: '',
    miscellaneous: '',
    lifestyleCreep: '',
    
    // 4. Assumptions
    generalInflation: '',
    educationInflation: '',
    preRetirementReturn: '',
    postRetirementReturn: '',
    
    // 5. House Goal
    buyHouse: '',
    yearsToHouse: '',
    homeSize: '',
    houseCost: '',
    downPaymentPct: '',
    homeLoanInterestRate: '',
    homeLoanTenure: '',
    
    // 6. Car Goal
    numCars: '',
    yearsToFirstCar: '',
    carSegment: '',
    carCost: '',
    carReplacementGap: '',
    
    // 7. Education
    schoolType: '',
    childAnnualSchool: '',
    yearsOfSchooling: '',
    higherEdLocation: '',
    higherEdType: '',
    higherEdCost: '',
    higherEdStartAge: '',
    
    // 8. Vacations
    domesticVacationsCount: '',
    domesticVacationCost: '',
    foreignVacationFreq: '',
    foreignVacationCost: '',
    vacationsInRetirement: '',
    
    // 9. Other Goals
    weddingCost: '',
    yearsToWedding: '',
    emergencyFundTarget: '',
    parentSupportDuration: '',
    parentsMedicalFund: '',
    yearsToBuildMedicalFund: '',
    
    // 10. Insurance
    healthInsuranceCover: '',
    healthPremiumRate: '',
    lifeInsuranceCover: '',
    lifePremiumRate: '',
    insuranceCoverageUntilAge: ''
  });

  const [incomeCheckpoints, setIncomeCheckpoints] = useState([
    { age: '30-34', growth: '', absolute: '' },
    { age: '35-39', growth: '', absolute: '' },
    { age: '40-44', growth: '', absolute: '' },
    { age: '45-49', growth: '', absolute: '' },
    { age: '50-54', growth: '', absolute: '' },
    { age: '55-59', growth: '', absolute: '' },
    { age: '60-64', growth: '', absolute: '' },
    { age: '65-69', growth: '', absolute: '' },
    { age: '70-74', growth: '', absolute: '' },
    { age: '75-79', growth: '', absolute: '' },
    { age: '80-84', growth: '', absolute: '' },
    { age: '85-89', growth: '', absolute: '' },
  ]);



  if (!isLoggedIn) {
    navigate('/');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const handleCheckpointChange = (index: number, field: string, value: string) => {
    const newCheckpoints = [...incomeCheckpoints];
    newCheckpoints[index] = { ...newCheckpoints[index], [field]: value };
    setIncomeCheckpoints(newCheckpoints);
  };

  const calculateResults = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      // Simplified Mock Calculation based on inputs
      const getNum = (val: any) => Number(val) || 0;
      
      const totalExpenses = 
        getNum(inputs.rentEmi) + getNum(inputs.groceries) + getNum(inputs.utilities) + getNum(inputs.transport) + 
        getNum(inputs.householdHelp) + getNum(inputs.phoneInternet) + getNum(inputs.personalCare) + 
        getNum(inputs.entertainment) + getNum(inputs.miscellaneous) + getNum(inputs.monthlySupportParents);

      const yearsToRetire = getNum(inputs.retirementAge) - getNum(inputs.currentAge);
      const retirementYears = getNum(inputs.lifeExpectancy) - getNum(inputs.retirementAge);
      
      const inflatedMonthlyExpense = totalExpenses * Math.pow(1 + (getNum(inputs.generalInflation) / 100), yearsToRetire);
      const annualRetirementExpense = inflatedMonthlyExpense * 12;

      const realReturn = ((1 + getNum(inputs.postRetirementReturn)/100) / (1 + getNum(inputs.generalInflation)/100)) - 1;
      const corpusRequired = annualRetirementExpense / (realReturn > 0 ? realReturn : 0.04);
      
      const corpusAtRetirement = getNum(inputs.existingInvestments) * Math.pow(1 + (getNum(inputs.preRetirementReturn) / 100), yearsToRetire);
      
      const shortfall = corpusRequired - corpusAtRetirement;
      
      const rate = getNum(inputs.preRetirementReturn) / 100 / 12;
      const months = yearsToRetire * 12;
      const requiredSip = shortfall > 0 
        ? (shortfall * rate) / (Math.pow(1 + rate, months) - 1)
        : 0;

      const results = {
        corpusRequired,
        corpusAtRetirement,
        shortfall,
        requiredSip,
        inputs,
        incomeCheckpoints
      };

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
      await axios.post(
        `${apiUrl}/retirement-analysis`,
        { inputs, incomeCheckpoints, results, assessmentFor, otherName, otherRelation },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      updateUser({ hasCompletedRetirementAnalysis: true });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit form. Please try again.');
      window.scrollTo(0, 0);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (stepRef.current) {
      const fields = stepRef.current.querySelectorAll('input[required], select[required]');
      let isValid = true;
      for (let i = 0; i < fields.length; i++) {
        const field = fields[i] as HTMLInputElement | HTMLSelectElement;
        if (!field.validity.valid) {
          field.reportValidity();
          isValid = false;
          break;
        }
      }
      if (!isValid) {
        setError('Please fill in all required fields to proceed.');
        return;
      }
    }

    setError('');
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const steps = [
    {
      title: "1. YOUR PROFILE",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          <Field inputs={inputs} onChange={handleChange} label="Current Age" name="currentAge" />
          <Field inputs={inputs} onChange={handleChange} label="Gender" name="gender" type="text" options={['Male', 'Female', 'Other']} required={false} />
          <Field inputs={inputs} onChange={handleChange} label="Marital Status" name="maritalStatus" type="text" options={['Single', 'Married', 'Divorced', 'Widowed']} required={false} />
          <Field inputs={inputs} onChange={handleChange} label="Retirement Age (planned)" name="retirementAge" />
          <Field inputs={inputs} onChange={handleChange} label="Life Expectancy" name="lifeExpectancy" />
          <Field inputs={inputs} onChange={handleChange} label="City Tier (for cost-of-living)" name="cityTier" type="text" options={['Tier 1 (Metro)', 'Tier 2', 'Tier 3']} required={false} />
        </div>
      )
    },
    {
      title: "2. FAMILY & DEPENDENTS",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          <Field inputs={inputs} onChange={handleChange} label="Spouse - Working?" name="spouseWorking" type="text" options={['Yes', 'No']} />
          <Field inputs={inputs} onChange={handleChange} label="Number of Children (planned/current)" name="numChildren" />
          <Field inputs={inputs} onChange={handleChange} label="Avg. Current Age of Children (if born)" name="childrenAvgAge" required={inputs.numChildren > 0} />
          <Field inputs={inputs} onChange={handleChange} label="Years until 1st child (if none yet)" name="yearsToFirstChild" required={false} />
          <Field inputs={inputs} onChange={handleChange} label="Dependent Parents to Support?" name="dependentParents" type="text" options={['Yes', 'No']} />
          <Field inputs={inputs} onChange={handleChange} label="Monthly Support to Parents (today's cost)" name="monthlySupportParents" isCurrency={true} required={inputs.dependentParents === 'Yes'} />
        </div>
      )
    },
    {
      title: "3. INCOME (monthly)",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          <Field inputs={inputs} onChange={handleChange} label="Your Monthly Income (take-home)" name="monthlyIncome" isCurrency={true} />
          <Field inputs={inputs} onChange={handleChange} label="Spouse's Monthly Income (if working)" name="spouseIncome" isCurrency={true} required={inputs.spouseWorking === 'Yes'} />
          <Field inputs={inputs} onChange={handleChange} label="Other Monthly Income (rental/biz/etc.)" name="otherIncome" isCurrency={true} required={false} />
          <Field inputs={inputs} onChange={handleChange} label="Existing Investments / Savings (current corpus)" name="existingInvestments" isCurrency={true} />
        </div>
      )
    },
    {
      title: "3B. MONTHLY EXPENSE BUDGET (routine, recurring)",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          <Field inputs={inputs} onChange={handleChange} label="Rent / Home Loan EMI" name="rentEmi" isCurrency={true} />
          <Field inputs={inputs} onChange={handleChange} label="Groceries & Food" name="groceries" isCurrency={true} />
          <Field inputs={inputs} onChange={handleChange} label="Utilities (electricity, water, gas)" name="utilities" isCurrency={true} />
          <Field inputs={inputs} onChange={handleChange} label="Transport & Fuel" name="transport" isCurrency={true} />
          <Field inputs={inputs} onChange={handleChange} label="Household Help (cook/maid/driver)" name="householdHelp" isCurrency={true} />
          <Field inputs={inputs} onChange={handleChange} label="Phone, Internet & Subscriptions" name="phoneInternet" isCurrency={true} />
          <Field inputs={inputs} onChange={handleChange} label="Personal Care & Health (non-insurance)" name="personalCare" isCurrency={true} />
          <Field inputs={inputs} onChange={handleChange} label="Entertainment & Dining Out" name="entertainment" isCurrency={true} />
          <Field inputs={inputs} onChange={handleChange} label="Miscellaneous / Other Monthly Expenses" name="miscellaneous" isCurrency={true} />
          <Field inputs={inputs} onChange={handleChange} label="Lifestyle Creep Rate (real growth, on top of inflation)" name="lifestyleCreep" step="0.1" required={false} />
        </div>
      )
    },
    {
      title: "3C. INCOME GROWTH CHECKPOINTS (editable every 5 years)",
      content: (
        <div className="animate-fade-in">
          <div className="overflow-x-auto border border-primary/10 rounded-xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-primary/5">
                  <th className="p-3 text-sm font-bold text-primary">Age Bracket</th>
                  <th className="p-3 text-sm font-bold text-primary">Growth Rate Override (p.a.)</th>
                  <th className="p-3 text-sm font-bold text-primary">Absolute Income Override (₹/mo)</th>
                </tr>
              </thead>
              <tbody>
                {incomeCheckpoints.map((cp, idx) => (
                  <tr key={cp.age} className="border-t border-primary/10">
                    <td className="p-3 font-semibold text-ink">{cp.age}</td>
                    <td className="p-3">
                      <input type="number" step="0.1" className="form-input py-1" value={cp.growth} onChange={(e) => handleCheckpointChange(idx, 'growth', e.target.value)} placeholder="%" />
                    </td>
                    <td className="p-3">
                      <CurrencyInput value={cp.absolute === '' ? 0 : Number(cp.absolute)} onValueChange={(val) => handleCheckpointChange(idx, 'absolute', String(val))} className="form-input py-1" placeholder="₹" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )
    },
    {
      title: "4. ASSUMPTIONS (change for scenario testing)",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          <Field inputs={inputs} onChange={handleChange} label="General Inflation Rate (p.a.)" name="generalInflation" step="0.1" />
          <Field inputs={inputs} onChange={handleChange} label="Education Inflation Rate (p.a.)" name="educationInflation" step="0.1" />
          <Field inputs={inputs} onChange={handleChange} label="Pre-Retirement Investment Return (p.a.)" name="preRetirementReturn" step="0.1" />
          <Field inputs={inputs} onChange={handleChange} label="Post-Retirement Investment Return (p.a.)" name="postRetirementReturn" step="0.1" />
        </div>
      )
    },
    {
      title: "5. HOUSE GOAL",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          <Field inputs={inputs} onChange={handleChange} label="Planning to buy a house?" name="buyHouse" type="text" options={['Yes', 'No']} />
          <Field inputs={inputs} onChange={handleChange} label="Years from now to purchase" name="yearsToHouse" required={inputs.buyHouse === 'Yes'} />
          <Field inputs={inputs} onChange={handleChange} label="Home Size / Type" name="homeSize" type="text" options={['1BHK', '2BHK', '3BHK', '4BHK', 'Villa']} required={false} />
          <Field inputs={inputs} onChange={handleChange} label="Today's Cost of this House (current price)" name="houseCost" isCurrency={true} required={inputs.buyHouse === 'Yes'} />
          <Field inputs={inputs} onChange={handleChange} label="Down Payment % (rest via home loan)" name="downPaymentPct" required={inputs.buyHouse === 'Yes'} />
          <Field inputs={inputs} onChange={handleChange} label="Home Loan Interest Rate (p.a.)" name="homeLoanInterestRate" step="0.1" required={false} />
          <Field inputs={inputs} onChange={handleChange} label="Home Loan Tenure (years)" name="homeLoanTenure" required={false} />
        </div>
      )
    },
    {
      title: "6. CAR GOAL(S)",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          <Field inputs={inputs} onChange={handleChange} label="Number of Cars Planned (lifetime)" name="numCars" required={false} />
          <Field inputs={inputs} onChange={handleChange} label="Years from now for 1st Car Purchase" name="yearsToFirstCar" />
          <Field inputs={inputs} onChange={handleChange} label="Car Segment" name="carSegment" type="text" options={['Hatchback', 'Compact SUV', 'Mid-size Sedan/SUV', 'Luxury']} required={false} />
          <Field inputs={inputs} onChange={handleChange} label="Today's Cost per Car (on-road price)" name="carCost" isCurrency={true} />
          <Field inputs={inputs} onChange={handleChange} label="Gap Between Car Replacements (years)" name="carReplacementGap" />
        </div>
      )
    },
    {
      title: "7. CHILDREN'S EDUCATION (per child)",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          <Field inputs={inputs} onChange={handleChange} label="School Type" name="schoolType" type="text" options={['Private', 'Public', 'International']} required={false} />
          <Field inputs={inputs} onChange={handleChange} label="Today's Annual School Cost" name="childAnnualSchool" isCurrency={true} required={false} />
          <Field inputs={inputs} onChange={handleChange} label="Years of Schooling (till higher sec.)" name="yearsOfSchooling" required={false} />
          <Field inputs={inputs} onChange={handleChange} label="Higher Education Location" name="higherEdLocation" type="text" options={['India', 'Abroad']} required={false} />
          <Field inputs={inputs} onChange={handleChange} label="Higher Education Type" name="higherEdType" type="text" options={['Private', 'Public']} required={false} />
          <Field inputs={inputs} onChange={handleChange} label="Today's Cost of Higher Education (total)" name="higherEdCost" isCurrency={true} required={inputs.numChildren > 0} />
          <Field inputs={inputs} onChange={handleChange} label="Child's Age at Start of Higher Education" name="higherEdStartAge" required={inputs.numChildren > 0} />
        </div>
      )
    },
    {
      title: "8. VACATIONS / LEISURE",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          <Field inputs={inputs} onChange={handleChange} label="Domestic Vacations per Year (count)" name="domesticVacationsCount" required={false} />
          <Field inputs={inputs} onChange={handleChange} label="Today's Cost per Domestic Vacation (annual)" name="domesticVacationCost" isCurrency={true} />
          <Field inputs={inputs} onChange={handleChange} label="Foreign Vacations - Frequency (every N years)" name="foreignVacationFreq" />
          <Field inputs={inputs} onChange={handleChange} label="Today's Cost per Foreign Vacation" name="foreignVacationCost" isCurrency={true} />
          <Field inputs={inputs} onChange={handleChange} label="Continue Vacations into Retirement?" name="vacationsInRetirement" type="text" options={['yes', 'reduced', 'no']} required={false} />
        </div>
      )
    },
    {
      title: "9. OTHER GOALS / BIG EXPENSES",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          <Field inputs={inputs} onChange={handleChange} label="Wedding(s) - Total Today's Cost" name="weddingCost" isCurrency={true} required={inputs.numChildren > 0} />
          <Field inputs={inputs} onChange={handleChange} label="Years from now for Wedding(s)" name="yearsToWedding" required={inputs.numChildren > 0} />
          <Field inputs={inputs} onChange={handleChange} label="Emergency Fund Target (months of expenses)" name="emergencyFundTarget" />
          <Field inputs={inputs} onChange={handleChange} label="Parent Support Duration (years, fixed window)" name="parentSupportDuration" required={false} />
          <Field inputs={inputs} onChange={handleChange} label="Parents' Medical Emergency Fund (target)" name="parentsMedicalFund" isCurrency={true} required={inputs.dependentParents === 'Yes'} />
          <Field inputs={inputs} onChange={handleChange} label="Years to Build Parents' Medical Fund" name="yearsToBuildMedicalFund" required={inputs.dependentParents === 'Yes'} />
        </div>
      )
    },
    {
      title: "10. INSURANCE & PROTECTION",
      content: (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          <Field inputs={inputs} onChange={handleChange} label="Health Insurance Cover (family floater)" name="healthInsuranceCover" isCurrency={true} />
          <Field inputs={inputs} onChange={handleChange} label="Health Premium Rate (₹ per ₹1L cover)" name="healthPremiumRate" />
          <Field inputs={inputs} onChange={handleChange} label="Life Insurance Cover (term plan)" name="lifeInsuranceCover" isCurrency={true} />
          <Field inputs={inputs} onChange={handleChange} label="Life Premium Rate (₹ per ₹1L cover)" name="lifePremiumRate" />
          <Field inputs={inputs} onChange={handleChange} label="Insurance Coverage Until Age" name="insuranceCoverageUntilAge" required={false} />
        </div>
      )
    }
  ];

  const progress = ((currentStep + 1) / steps.length) * 100;
  const isLastStep = currentStep === steps.length - 1;

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-cream/30 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-primary/10 p-8 md:p-12 animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-ink mb-3">Who is this analysis for?</h1>
            <p className="text-primary/70 text-sm">Select whether you are taking this retirement analysis for yourself or on behalf of someone else.</p>
          </div>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <button type="button" onClick={() => setAssessmentFor('self')} className={`p-4 rounded-xl border-2 font-bold transition-all ${assessmentFor === 'self' ? 'border-accent bg-accent/5 text-ink' : 'border-primary/10 text-primary/60 hover:border-accent/40'}`}>Myself</button>
              <button type="button" onClick={() => setAssessmentFor('other')} className={`p-4 rounded-xl border-2 font-bold transition-all ${assessmentFor === 'other' ? 'border-accent bg-accent/5 text-ink' : 'border-primary/10 text-primary/60 hover:border-accent/40'}`}>Someone Else</button>
            </div>
            {assessmentFor === 'other' && (
              <div className="space-y-4 animate-fade-in mt-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-primary mb-2">Their Name *</label>
                  <input type="text" value={otherName} onChange={(e) => setOtherName(e.target.value)} className="w-full p-3 bg-[#F8F9FA] border-2 border-primary/10 rounded-xl text-ink font-semibold focus:outline-none focus:border-accent" placeholder="Enter full name" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-primary mb-2">Relationship *</label>
                  <input type="text" value={otherRelation} onChange={(e) => setOtherRelation(e.target.value)} className="w-full p-3 bg-[#F8F9FA] border-2 border-primary/10 rounded-xl text-ink font-semibold focus:outline-none focus:border-accent" placeholder="e.g. Spouse, Child, Parent" />
                </div>
              </div>
            )}
            <button type="button" onClick={() => { if (assessmentFor === 'other' && (!otherName.trim() || !otherRelation.trim())) { setError('Please provide name and relation.'); return; } setError(''); setIsConfigured(true); }} className="w-full btn-primary py-4 rounded-xl font-bold uppercase tracking-wide mt-8">Start Analysis</button>
            {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
          </div>
          <style>{`@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } } .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calculator className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-ink mb-3">Complete Retirement Analysis</h1>
          <p className="text-primary/60 text-sm max-w-lg mx-auto">
            Please fill in your detailed information step by step.
          </p>
        </div>

        <form onSubmit={calculateResults} className="bg-white rounded-3xl shadow-xl border border-primary/10 overflow-hidden transition-all duration-300">
          {/* Progress Bar */}
          <div className="h-2 w-full bg-cream">
            <div 
              className="h-full bg-gradient-to-r from-primary via-accent to-accent-light transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="p-6 md:p-10">
            {/* Step Header */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent/10 px-3 py-1.5 rounded-lg">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-start gap-3 text-sm font-medium animate-fade-in">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Step Title */}
            <h2 className="text-xl md:text-2xl font-semibold text-ink leading-relaxed mb-8">
              {steps[currentStep].title}
            </h2>

            {/* Step Content */}
            <div className="mb-10 min-h-[300px]" key={currentStep} ref={stepRef}>
               {steps[currentStep].content}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-primary/5">
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-primary/60 font-bold hover:text-primary hover:bg-cream transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
                Back
              </button>
              
              {isLastStep ? (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold uppercase tracking-wide shadow-lg hover:shadow-xl active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Generate Dashboard'}
                  {!isSubmitting && <CheckCircle size={20} className="text-accent" />}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="bg-primary text-cream hover:bg-ink flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold uppercase tracking-wide shadow-md hover:shadow-lg active:scale-95 transition-all"
                >
                  Next
                  <ChevronRight size={20} className="text-accent" />
                </button>
              )}
            </div>
          </div>
        </form>

        <style>{`
          .form-input {
            width: 100%;
            padding: 0.75rem 1rem;
            background-color: #F8F9FA;
            border: 2px solid rgba(22, 51, 86, 0.1);
            border-radius: 0.75rem;
            color: #163356;
            font-weight: 600;
            transition: all 0.2s;
          }
          /* Hide spin buttons for number inputs */
          .form-input::-webkit-outer-spin-button,
          .form-input::-webkit-inner-spin-button {
            -webkit-appearance: none;
            margin: 0;
          }
          .form-input[type=number] {
            -moz-appearance: textfield;
          }
          .form-input:focus {
            outline: none;
            border-color: #D3A744;
            background-color: #fff;
            box-shadow: 0 0 0 4px rgba(211, 167, 68, 0.1);
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.4s ease-out forwards;
          }
        `}</style>
      </div>
    </div>
  );
}








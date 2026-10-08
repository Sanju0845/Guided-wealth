import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import * as Icons from 'lucide-react';
import { calculatorData } from '../constants/calculatorData';
import { ShieldCheck, X, FileText, Download } from 'lucide-react';
import axios from 'axios';
import { getRiskCategory } from '../constants/assessmentQuestions';
import { toJpeg } from 'html-to-image';
import { jsPDF } from 'jspdf';

export default function Dashboard() {
  const { user, isLoggedIn } = useAuth();
  const [retirementData, setRetirementData] = useState<any>(null);
  const [riskData, setRiskData] = useState<any>(null);
  const [assessmentHistory, setAssessmentHistory] = useState<any[]>([]);
  const [retirementHistory, setRetirementHistory] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'retirement' | 'risk' | 'tools'>('retirement');
  const [targetPerson, setTargetPerson] = useState<'self' | 'other'>('self');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRetHistory, setSelectedRetHistory] = useState<any>(null);
  const [selectedRiskHistory, setSelectedRiskHistory] = useState<any>(null);
  const retModalRef = React.useRef<HTMLDivElement>(null);
  const riskModalRef = React.useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedRetHistIndex, setSelectedRetHistIndex] = useState<number>(0);
  const [selectedRiskHistIndex, setSelectedRiskHistIndex] = useState<number>(0);
  const [isRiskResponsesExpanded, setIsRiskResponsesExpanded] = useState<boolean>(false);

  const handleExportPDF = async (modalRef: React.RefObject<HTMLDivElement>, filename: string) => {
    if (!modalRef.current) return;
    setIsExporting(true);
    try {
      const filter = (node: HTMLElement) => {
        return !(node.classList && node.classList.contains('exclude-from-pdf'));
      };
      // Wait for state updates (e.g. removing scrollbars) to render
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const dataUrl = await toJpeg(modalRef.current, { quality: 0.8, pixelRatio: 1.5, filter, backgroundColor: '#ffffff' });
      
      const width = modalRef.current.offsetWidth;
      const height = modalRef.current.offsetHeight;
      
      const pdfWidth = 210; // Standard A4 width in mm
      const pdfHeight = (height * pdfWidth) / width;
      
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: [pdfWidth, Math.max(pdfHeight, 297)] // At least A4 height
      });
      
      pdf.addImage(dataUrl, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${filename}.pdf`);
    } catch (error: any) {
      console.error("Error generating PDF", error);
      alert(`Failed to export PDF: ${error.message || error}`);
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!isLoggedIn || !user?.token) return;
      
      try {
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
        
        // Fetch retirement data
        try {
          const retRes = await axios.get(`${apiUrl}/retirement-analysis`, {
            headers: { Authorization: `Bearer ${user.token}` }
          });
          if (retRes.data && retRes.data.results) {
            setRetirementData(retRes.data.results);
          } else if (retRes.data && retRes.data.inputs) {
             // Fallback if results are at the root
             setRetirementData(retRes.data);
          }
        } catch (e) {
          console.error("No retirement data found");
        }

        // Fetch risk data
        if (user.hasCompletedRiskAssessment) {
          try {
            const riskRes = await axios.get(`${apiUrl}/assessment`, {
              headers: { Authorization: `Bearer ${user.token}` }
            });
            if (riskRes.data) {
              const { score, riskCategory } = riskRes.data;
              const { allocation } = getRiskCategory(score);
              setRiskData({ score, category: riskCategory, allocation });
            }
          } catch (e) {
            console.error("No risk data found");
          }
        }

        // Fetch history
        try {
          const [retHistRes, riskHistRes] = await Promise.all([
            axios.get(`${apiUrl}/retirement-analysis/history`, { headers: { Authorization: `Bearer ${user.token}` } }),
            axios.get(`${apiUrl}/assessment/history`, { headers: { Authorization: `Bearer ${user.token}` } })
          ]);
          if (retHistRes.data) setRetirementHistory(retHistRes.data);
          if (riskHistRes.data) setAssessmentHistory(riskHistRes.data);
        } catch (e) {
          console.error("Error fetching history");
        }
      } catch (err) {
        console.error("Error fetching dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [isLoggedIn, user]);

  useEffect(() => {
    if (!isLoading) {
      if (!retirementData && riskData) {
        setActiveTab('risk');
      } else {
        setActiveTab('retirement');
      }
    }
  }, [isLoading, retirementData, riskData]);

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-cream/30 p-8 pt-28 font-sans flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const filteredRetHist = retirementHistory.filter(h => (h.assessmentFor || 'self') === targetPerson);
  const filteredRiskHist = assessmentHistory.filter(h => (h.assessmentFor || 'self') === targetPerson);

  const safeRetIndex = selectedRetHistIndex < filteredRetHist.length ? selectedRetHistIndex : 0;
  const safeRiskIndex = selectedRiskHistIndex < filteredRiskHist.length ? selectedRiskHistIndex : 0;

  const activeRetHist = filteredRetHist[safeRetIndex];
  const currentRetData = activeRetHist ? (activeRetHist.results ? { ...activeRetHist.results, inputs: activeRetHist.inputs || activeRetHist.results.inputs } : activeRetHist) : null;

  const activeRiskHist = filteredRiskHist[safeRiskIndex];
  const currentRiskData = activeRiskHist ? (() => { const { score, riskCategory, answers } = activeRiskHist; const { allocation } = getRiskCategory(score); return { score, category: riskCategory, allocation, answers }; })() : null;

  const isRetirementValid = currentRetData && currentRetData.inputs && currentRetData.inputs.currentAge !== '' && currentRetData.inputs.currentAge > 0;
  const isRiskValid = currentRiskData && currentRiskData.score !== undefined;

  if (!isRetirementValid && !isRiskValid) {
    return (
      <div className="min-h-screen bg-cream/30 p-8 pt-28 font-sans flex items-center justify-center">
        <div className="max-w-4xl w-full animate-fade-in">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-serif font-bold text-ink mb-4">Welcome to Your Dashboard</h1>
            <p className="text-primary/70 text-lg">Please complete the assessments below to generate your personalized financial plan.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-primary/10 text-center flex flex-col h-full hover:shadow-2xl transition-shadow">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              </div>
              <h2 className="text-2xl font-bold text-ink mb-4">Retirement Analysis</h2>
              <p className="text-primary/60 mb-8 flex-grow">Plan your future and see how much you need to save to retire comfortably.</p>
              <Link to="/retirement-analysis" className="bg-primary text-cream hover:bg-ink flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold uppercase tracking-wide shadow-md hover:shadow-lg active:scale-95 transition-all w-full">
                Start Analysis
              </Link>
            </div>
            <div className="bg-white p-8 rounded-3xl shadow-xl border border-primary/10 text-center flex flex-col h-full hover:shadow-2xl transition-shadow">
              <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-10 h-10 text-accent" />
              </div>
              <h2 className="text-2xl font-bold text-ink mb-4">Risk Profile</h2>
              <p className="text-primary/60 mb-8 flex-grow">Understand your investment risk appetite and get a personalized asset allocation.</p>
              <Link to="/assessment" className="bg-primary text-cream hover:bg-ink flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold uppercase tracking-wide shadow-md hover:shadow-lg active:scale-95 transition-all w-full">
                Start Assessment
              </Link>
            </div>
          </div>
        </div>
        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.4s ease-out forwards;
          }
        `}</style>
      </div>
    );
  }

  const formatCurrency = (val: number) => {
    if (val < 0) {
      return `(₹${Math.abs(val).toLocaleString('en-IN')})`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const renderPDFHeader = (title: string, historyItem: any) => {
    const isOther = historyItem?.assessmentFor === 'other';
    const forText = isOther 
      ? `For: ${historyItem.otherName || 'N/A'} (${historyItem.otherRelation || 'Other'})` 
      : 'For: Self';
    const dateText = historyItem?.createdAt 
      ? new Date(historyItem.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
      : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

    return (
      <div className="flex items-center justify-between border-b border-primary/20 pb-6 mb-8 text-left">
        <div className="flex-shrink-0">
          <img src="/assets/logo.png" alt="Company Logo" className="h-12 object-contain" />
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-serif font-bold text-ink mb-1">{title}</h2>
          <p className="text-sm text-primary font-bold uppercase tracking-wider">{forText}</p>
          <p className="text-xs text-primary/70 mt-1">Generated: {dateText}</p>
        </div>
      </div>
    );
  };


  const renderRetirementUI = (retData: any) => {
    if (!retData || !retData.inputs) return null;
    const currentRetData = retData;
    const inputs = currentRetData.inputs;

    const corpusAtRetirement = currentRetData.corpusAtRetirement || 0;
    const corpusRequired = currentRetData.corpusRequired || 0;
    const shortfall = currentRetData.shortfall || 0;
    const isShortfall = shortfall > 0;
    const extraMonthlySip = currentRetData.requiredSip || 0;
    const existingCorpus = inputs.existingInvestments || 0;

    // --- Dynamic Calculations based on inputs ---
    // 1. Insurance Premiums
    const healthPremium = (inputs.healthInsuranceCover / 100000) * (inputs.healthPremiumRate || 0);
    const lifePremium = (inputs.lifeInsuranceCover / 100000) * (inputs.lifePremiumRate || 0);
    const annualInsurance = healthPremium + lifePremium;

    // 2. Parent Support
    const parentMedFundSip = (inputs.parentsMedicalFund || 0) / (Math.max(1, inputs.yearsToBuildMedicalFund || 8) * 12);
    const annualParentSupport = (inputs.monthlySupportParents * 12) + (parentMedFundSip * 12);

    // 3. Goal SIP Calculations
    const calculateSip = (currentCost: number, years: number, inflation: number, returnRate: number) => {
      if (!currentCost || years <= 0) return 0;
      const fv = currentCost * Math.pow(1 + inflation / 100, years);
      const monthlyRate = returnRate / 100 / 12;
      const months = years * 12;
      return monthlyRate > 0 ? (fv * monthlyRate) / (Math.pow(1 + monthlyRate, months) - 1) : fv / months;
    };

    const genInflation = inputs.generalInflation || 6;
    const edInflation = inputs.educationInflation || 9;
    const invReturn = inputs.preRetirementReturn || 11;

    const sipHouse = inputs.buyHouse === 'Yes' ? calculateSip((inputs.houseCost || 0) * ((inputs.downPaymentPct || 0) / 100), inputs.yearsToHouse || 8, genInflation, invReturn) : 0;
    const sipCar1 = calculateSip(inputs.carCost || 0, inputs.yearsToFirstCar || 4, genInflation, invReturn);
    const sipCar2 = calculateSip(inputs.carCost || 0, (inputs.yearsToFirstCar || 4) + (inputs.carReplacementGap || 10), genInflation, invReturn);
    const sipHigherEd = calculateSip(inputs.higherEdCost || 0, Math.max(1, (inputs.higherEdStartAge || 18) - (inputs.childrenAvgAge || 3)), edInflation, invReturn) * (inputs.numChildren || 1);
    const sipWedding = calculateSip(inputs.weddingCost || 0, inputs.yearsToWedding || 24, genInflation, invReturn);
    const sipVacations = (inputs.domesticVacationCost || 0) / 12 + ((inputs.foreignVacationCost || 0) / (inputs.foreignVacationFreq || 3) / 12);
    const sipEmergency = calculateSip(((inputs.monthlyIncome || 0) * (inputs.emergencyFundTarget || 6)), 3, genInflation, invReturn);
    const sipParentsMed = calculateSip(inputs.parentsMedicalFund || 0, inputs.yearsToBuildMedicalFund || 8, genInflation, invReturn);

    const sipData = [
      { name: 'House — Down Payment', value: sipHouse, color: '#4F81BD' },
      { name: 'Car #1 Purchase', value: sipCar1, color: '#C0504D' },
      { name: 'Car #2 (Replacement)', value: sipCar2, color: '#9BBB59' },
      { name: 'Higher Education (all kids, total)', value: sipHigherEd, color: '#4BACC6' },
      { name: 'Children\'s Wedding(s)', value: sipWedding, color: '#F79646' },
      { name: 'Vacations (annual, ongoing)', value: sipVacations, color: '#95B3D7' },
      { name: 'Emergency Fund (one-time build)', value: sipEmergency, color: '#C3D69B' },
      { name: 'Parents\' Medical Emergency Fund', value: sipParentsMed, color: '#B2A2C7' },
    ].filter(d => d.value > 0);

    const totalMonthlySip = sipData.reduce((acc, curr) => acc + curr.value, 0);

    // 4. Generate Corpus Data (Age = currentAge to 90)
    const corpusData = [];
    let currentCorpus = inputs.existingInvestments || 0;
    for (let age = inputs.currentAge || 18; age <= 90; age++) {
      if (age === inputs.currentAge) {
        currentCorpus = inputs.existingInvestments || 0;
      } else if (age <= (inputs.retirementAge || 60)) {
        const annualInvestment = (totalMonthlySip + extraMonthlySip) * 12;
        currentCorpus = currentCorpus * (1 + ((inputs.preRetirementReturn || 0) / 100)) + annualInvestment;
      } else {
        const annualRetirementExpense = (corpusRequired * (((inputs.postRetirementReturn || 0) - (inputs.generalInflation || 0)) / 100));
        currentCorpus = currentCorpus * (1 + ((inputs.postRetirementReturn || 0) / 100)) - annualRetirementExpense;
      }
      corpusData.push({ age, corpus: Math.round(currentCorpus) });
    }

    // 5. Generate Income vs Outflow Data
    const incomeOutflowData = [];
    let currentIncome = (inputs.monthlyIncome + (inputs.spouseIncome || 0) + (inputs.otherIncome || 0)) * 12;
    let currentExpenses = (inputs.rentEmi + inputs.groceries + inputs.utilities + inputs.transport + inputs.householdHelp + inputs.phoneInternet + inputs.personalCare + inputs.entertainment + inputs.miscellaneous + inputs.monthlySupportParents) * 12;

    for (let age = inputs.currentAge; age <= inputs.retirementAge - 1; age++) {
      incomeOutflowData.push({
        age,
        Income: Math.round(currentIncome),
        Outflow: Math.round(currentExpenses + (totalMonthlySip * 12))
      });
      currentIncome *= 1.08;
      currentExpenses *= (1 + (inputs.generalInflation / 100));
    }

    return (
      <>
        {/* YOUR PROFILE */}
        <div className="mb-4 mt-8">
          <div className="bg-[#4472c4] text-white font-bold p-1 px-2 flex justify-between items-center">
            <span>YOUR PROFILE</span>
          </div>
          <div className="flex flex-col sm:flex-row w-full border-l border-r border-b border-gray-300">
            <div className="flex-1 flex border-b sm:border-b-0 sm:border-r border-gray-300">
              <div className="flex-[2] p-1 px-2 text-[#1f3864]">Current Age</div>
              <div className="flex-1 p-1 px-2 text-center text-[#00b050] font-bold border-l border-gray-300 bg-white">{inputs.currentAge} yrs</div>
            </div>
            <div className="flex-1 flex border-b sm:border-b-0 sm:border-r border-gray-300">
              <div className="flex-[2] p-1 px-2 text-[#1f3864]">Retirement Age</div>
              <div className="flex-1 p-1 px-2 text-center text-[#00b050] font-bold border-l border-gray-300 bg-white">{inputs.retirementAge} yrs</div>
            </div>
            <div className="flex-1 flex">
              <div className="flex-[2] p-1 px-2 text-[#1f3864]">Life Expectancy</div>
              <div className="flex-1 p-1 px-2 text-center text-[#00b050] font-bold border-l border-gray-300 bg-white">{inputs.lifeExpectancy} yrs</div>
            </div>
          </div>
        </div>

        {/* KEY RESULTS */}
        <div className="mb-4 overflow-x-auto">
          <div className="bg-[#4472c4] text-white font-bold p-1 px-2">
            KEY RESULTS
          </div>
          <table className="w-full min-w-[800px] border-collapse border border-gray-300 text-[13px]">
            <tbody>
              <tr>
                <td className="border border-gray-300 p-1 px-2 text-[#1f3864] w-[20%]">Corpus at Retirement</td>
                <td className="border border-gray-300 p-1 px-2 text-center text-[#00b050] font-bold w-[13.33%]">{formatCurrency(corpusAtRetirement)}</td>
                <td className="border border-gray-300 p-1 px-2 text-[#1f3864] w-[20%]">Corpus Required at Retirement</td>
                <td className="border border-gray-300 p-1 px-2 text-center text-[#00b050] font-bold w-[13.33%]">{formatCurrency(corpusRequired)}</td>
                <td className="border border-gray-300 p-1 px-2 text-[#1f3864] w-[20%] font-bold">Surplus/(Shortfall)</td>
                <td className="border border-gray-300 p-1 px-2 text-center text-red-600 font-bold bg-[#fce4d6] w-[13.33%]">{isShortfall ? `(${formatCurrency(shortfall)})` : formatCurrency(-shortfall)}</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-1 px-2 text-[#1f3864]">Status</td>
                <td className="border border-gray-300 p-1 px-2 text-center text-red-600 font-bold bg-[#fce4d6]">
                  {isShortfall ? 'SHORTFALL - see Section 4 below' : 'SURPLUS'}
                </td>
                <td className="border border-gray-300 p-1 px-2 text-[#1f3864]">Extra Monthly SIP to Close Gap</td>
                <td className="border border-gray-300 p-1 px-2 text-center text-[#00b050] font-bold">{formatCurrency(extraMonthlySip)}</td>
                <td className="border border-gray-300 p-1 px-2 text-[#1f3864] font-bold">Money Lasts to 90?</td>
                <td className="border border-gray-300 p-1 px-2 text-center text-red-600 font-bold bg-[#fce4d6]">
                  {isShortfall ? 'NO - Shortfall (see red rows above)' : 'YES'}
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-1 px-2 text-[#1f3864] font-bold">Total Monthly SIP — All Goals (excl. school)</td>
                <td className="border border-gray-300 p-1 px-2 text-center text-[#00b050] font-bold">{formatCurrency(totalMonthlySip)}</td>
                <td className="border border-gray-300 p-1 px-2 text-[#1f3864]">Existing Corpus (today)</td>
                <td className="border border-gray-300 p-1 px-2 text-center text-[#00b050] font-bold">{formatCurrency(existingCorpus)}</td>
                <td colSpan={2} rowSpan={2} className="border border-gray-300 p-1 px-2 bg-white"></td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-1 px-2 text-[#1f3864] font-bold">Annual Insurance Premiums (today)</td>
                <td className="border border-gray-300 p-1 px-2 text-center text-[#00b050] font-bold">{formatCurrency(annualInsurance)}</td>
                <td className="border border-gray-300 p-1 px-2 text-[#1f3864] font-bold">Annual Parent Support + Med. Fund (today)</td>
                <td className="border border-gray-300 p-1 px-2 text-center text-[#00b050] font-bold">{formatCurrency(annualParentSupport)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 1. Corpus Growth */}
        <div className="mb-6 bg-white overflow-hidden shadow-sm">
          <div className="bg-[#224A8C] text-white font-bold p-1 px-2">
            CORPUS GROWTH OVER YOUR LIFETIME (Age 18–90)
          </div>
          <div className="border border-gray-300 border-t-0 p-4">
            <h3 className="text-center text-sm font-bold text-gray-500 mb-2">Year-End Corpus by Age</h3>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={corpusData} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                  <CartesianGrid stroke="#d1d5db" vertical={false} />
                  <XAxis
                    dataKey="age"
                    type="number"
                    domain={['dataMin', 90]}
                    tickCount={37}
                    tick={{ fontSize: 11, fill: '#000' }}
                    axisLine={{ stroke: '#000' }}
                    tickLine={false}
                    label={{ value: "Age", position: "bottom", offset: 0, style: { fontWeight: 'bold', fontSize: 12 } }}
                  />
                  <YAxis
                    tickFormatter={(val) => formatCurrency(val)}
                    tick={{ fontSize: 11, fill: '#000' }}
                    axisLine={false}
                    tickLine={false}
                    width={100}
                    label={{ value: "Corpus (₹)", angle: -90, position: "left", style: { fontWeight: 'bold', fontSize: 12 } }}
                  />
                  <RechartsTooltip formatter={(value: number) => formatCurrency(value)} labelFormatter={(label) => `Age: ${label}`} />
                  <Line type="monotone" dataKey="corpus" stroke="#224A8C" strokeWidth={2} dot={false} isAnimationActive={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 2. Income vs Outflow */}
        <div className="mb-6 bg-white overflow-hidden shadow-sm">
          <div className="bg-[#224A8C] text-white font-bold p-1 px-2">
            INCOME vs. TOTAL OUTFLOW (WORKING YEARS)
          </div>
          <div className="border border-gray-300 border-t-0 p-4">
            <h3 className="text-center text-sm font-bold text-gray-500 mb-2">Annual Income vs Annual Outflow (Savings-eligible years)</h3>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incomeOutflowData} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                  <CartesianGrid stroke="#d1d5db" vertical={false} />
                  <XAxis
                    dataKey="age"
                    tick={{ fontSize: 11, fill: '#000' }}
                    axisLine={{ stroke: '#000' }}
                    tickLine={false}
                    label={{ value: "Age", position: "bottom", offset: 0, style: { fontWeight: 'bold', fontSize: 12 } }}
                  />
                  <YAxis
                    tickFormatter={(val) => formatCurrency(val)}
                    tick={{ fontSize: 11, fill: '#000' }}
                    axisLine={false}
                    tickLine={false}
                    width={100}
                    label={{ value: "₹ per year", angle: -90, position: "left", style: { fontWeight: 'bold', fontSize: 12 } }}
                  />
                  <RechartsTooltip formatter={(value: number) => formatCurrency(value)} labelFormatter={(label) => `Age: ${label}`} />
                  <Legend verticalAlign="middle" align="right" layout="vertical" iconType="square" />
                  <Bar dataKey="Income" name="Annual Income (₹)" fill="#2F5597" radius={0} barSize={8} isAnimationActive={false} />
                  <Bar dataKey="Outflow" name="Total Goal Funding (₹/yr)" fill="#C00000" radius={0} barSize={8} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* 3. Monthly SIP Required By Goal */}
        <div className="mb-6 bg-white overflow-hidden shadow-sm">
          <div className="bg-[#224A8C] text-white font-bold p-1 px-2">
            MONTHLY SIP REQUIRED BY GOAL
          </div>
          <div className="border border-gray-300 border-t-0 p-4">
            <h3 className="text-center text-sm font-bold text-gray-500 mb-2">Monthly SIP by Goal (₹)</h3>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={sipData}
                    cx="40%"
                    cy="50%"
                    innerRadius={0}
                    outerRadius={140}
                    dataKey="value"
                    stroke="#fff"
                    isAnimationActive={false}
                  >
                    {sipData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip formatter={(value: number) => formatCurrency(value)} />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    iconType="square"
                    wrapperStyle={{ fontSize: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderRetirementTab = () => {
    if (!isRetirementValid) {
      return (
        <div className="text-center p-12 bg-white border border-primary/10 rounded-3xl shadow-xl max-w-lg mx-auto mt-10 animate-fade-in">
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          </div>
          <h2 className="text-3xl font-serif font-bold text-ink mb-4">No Analysis Found</h2>
          <p className="mb-8 text-primary/70">You haven't generated your retirement analysis yet. Please fill out the form to view your dashboard.</p>
          <Link to="/retirement-analysis" className="bg-primary text-cream hover:bg-ink inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-bold uppercase tracking-wide shadow-md hover:shadow-lg active:scale-95 transition-all">
            Start Analysis
          </Link>
        </div>
      );
    }

    return (
      <div className={`mt-8 animate-fade-in ${isExporting ? 'bg-white p-8 md:p-12 rounded-3xl' : ''}`} ref={retModalRef}>
        <div className="flex justify-end mb-4 exclude-from-pdf">
          <button 
             className="bg-primary text-cream hover:bg-ink px-6 py-2 rounded-xl flex items-center gap-2 text-sm disabled:opacity-50 shadow-md transition-colors"
             onClick={() => handleExportPDF(retModalRef, `Retirement_Report_${Date.now()}`)}
             disabled={isExporting}
          >
             <Download className="w-4 h-4" /> {isExporting ? 'Exporting...' : 'Export Report (PDF)'}
          </button>
        </div>
        {isExporting && renderPDFHeader('Retirement Analysis Report', activeRetHist)}
        
        {!isExporting && (
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-serif font-bold text-ink mb-3">Retirement Analysis</h1>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="inline-flex items-center justify-center bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase">
                {activeRetHist?.assessmentFor === 'other' ? `For: ${activeRetHist.otherName || 'N/A'} (${activeRetHist.otherRelation || 'Other'})` : 'For: Self'}
              </div>
              <div className="text-sm font-medium text-primary/70 flex items-center gap-1.5 bg-white border border-primary/10 px-3 py-1.5 rounded-full shadow-sm">
                <Icons.Calendar className="w-4 h-4" />
                {activeRetHist?.createdAt ? new Date(activeRetHist.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Unknown Date'}
              </div>
            </div>
          </div>
        )}

        {renderRetirementUI(currentRetData)}
        
        <div className="mt-8 pt-6 border-t border-primary/10 exclude-from-pdf text-center mb-8">
          <Link to="/retirement-analysis?retake=true" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-wide text-primary bg-primary/5 hover:bg-primary/10 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            Retake Analysis
          </Link>
        </div>
      </div>
    );
  };

  const renderRiskTab = () => {
    if (!isRiskValid) {
      return (
        <div className="text-center p-12 bg-white border border-primary/10 rounded-3xl shadow-xl max-w-lg mx-auto mt-10 animate-fade-in">
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
             <ShieldCheck className="w-10 h-10 text-accent" />
          </div>
          <h2 className="text-3xl font-serif font-bold text-ink mb-4">No Risk Profile Found</h2>
          <p className="mb-8 text-primary/70">You haven't completed your risk assessment yet.</p>
          <Link to="/assessment" className="bg-primary text-cream hover:bg-ink inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl font-bold uppercase tracking-wide shadow-md hover:shadow-lg active:scale-95 transition-all">
            Start Assessment
          </Link>
        </div>
      );
    }
    return (
      <div className="max-w-3xl mx-auto mt-10 animate-fade-in">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-primary/10 text-center w-full" ref={riskModalRef}>
          <div className="flex justify-end mb-4 exclude-from-pdf">
            <button 
               className="bg-primary text-cream hover:bg-ink px-6 py-2 rounded-xl flex items-center gap-2 text-sm disabled:opacity-50 shadow-md transition-colors"
               onClick={() => handleExportPDF(riskModalRef, `Risk_Profile_${Date.now()}`)}
               disabled={isExporting}
            >
               <Download className="w-4 h-4" /> {isExporting ? 'Exporting...' : 'Export Report (PDF)'}
            </button>
          </div>
          {isExporting && renderPDFHeader('Risk Profile Report', activeRiskHist)}
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-accent" />
          </div>
          
          {!isExporting && (
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-ink mb-3">Your Risk Profile</h1>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <div className="inline-flex items-center justify-center bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase">
                  {activeRiskHist?.assessmentFor === 'other' ? `For: ${activeRiskHist.otherName || 'N/A'} (${activeRiskHist.otherRelation || 'Other'})` : 'For: Self'}
                </div>
                <div className="text-sm font-medium text-primary/70 flex items-center gap-1.5 bg-white border border-primary/10 px-3 py-1.5 rounded-full shadow-sm">
                  <Icons.Calendar className="w-4 h-4" />
                  {activeRiskHist?.createdAt ? new Date(activeRiskHist.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' }) : 'Unknown Date'}
                </div>
              </div>
            </div>
          )}

          <p className="text-primary/70 mb-8 max-w-md mx-auto">
            Based on your answers, we've analyzed your investment risk appetite and prepared a recommended allocation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
            <div className="bg-cream/50 p-6 rounded-2xl border border-primary/5">
              <span className="text-xs uppercase tracking-widest text-primary/50 font-bold mb-1 block">Risk Category</span>
              <span className="text-2xl font-bold text-accent">{currentRiskData.category}</span>
            </div>
            <div className="bg-cream/50 p-6 rounded-2xl border border-primary/5">
              <span className="text-xs uppercase tracking-widest text-primary/50 font-bold mb-1 block">Total Score</span>
              <span className="text-2xl font-bold text-primary">{currentRiskData.score} <span className="text-sm font-normal text-primary/60">/ 50</span></span>
            </div>
          </div>

          <div className="bg-ink text-cream p-6 rounded-2xl text-left">
            <span className="text-xs uppercase tracking-widest text-cream/50 font-bold mb-3 block">Suggested Broad Asset Allocation</span>
            <div className="font-medium leading-relaxed">
              {currentRiskData.allocation?.split('|').map((part: string, idx: number) => (
                <div key={idx} className="flex items-center gap-2 mb-2 last:mb-0">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  {part.trim()}
                </div>
              ))}
            </div>
          </div>

          {currentRiskData.answers && currentRiskData.answers.length > 0 && (
            <div className="mt-10 pt-8 border-t border-primary/10 text-left">
              <div 
                className="flex items-center justify-center gap-2 mb-6 cursor-pointer group"
                onClick={() => setIsRiskResponsesExpanded(!isRiskResponsesExpanded)}
              >
                <h3 className="text-xl font-serif font-bold text-ink">Your Responses</h3>
                <div className="w-8 h-8 rounded-full bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center transition-colors exclude-from-pdf">
                  {isRiskResponsesExpanded || isExporting ? <Icons.ChevronUp className="w-5 h-5 text-primary" /> : <Icons.ChevronDown className="w-5 h-5 text-primary" />}
                </div>
              </div>

              {(isRiskResponsesExpanded || isExporting) && (
                <div className="space-y-4 animate-fade-in">
                  {currentRiskData.answers.map((ans: any, idx: number) => (
                    <div key={idx} className="bg-cream/30 p-5 rounded-2xl border border-primary/5 page-break-inside-avoid">
                      <div className="text-sm font-semibold text-ink mb-2"><span className="text-primary/50 mr-2">Q{idx + 1}.</span> {ans.questionText || ans.question}</div>
                      <div className="flex items-start gap-2">
                        <div className="mt-1 w-2 h-2 rounded-full bg-accent shrink-0" />
                        <div className="text-sm font-medium text-primary/80">{ans.selectedOption || ans.answer}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-primary/10 exclude-from-pdf">
            <Link to="/assessment?retake=true" className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-wide text-primary bg-primary/5 hover:bg-primary/10 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              Retake Assessment
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const renderToolsTab = () => {
    return (
      <div className="bg-white p-6 md:p-8 rounded-3xl shadow-xl border border-primary/10 mx-auto mt-10 animate-fade-in">
        <h2 className="text-3xl font-serif font-bold text-ink mb-6 text-center">Financial Tools</h2>
        <div className="space-y-12">
          {calculatorData.map((section, index) => (
            <div key={index}>
              <h3 className="text-xl font-semibold text-[#c08226] mb-4 border-b pb-2">{section.title}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {section.items.map((item, idx) => {
                  const IconComponent = (Icons as any)[item.icon] || Icons.Calculator;
                  return (
                    <Link
                      key={idx}
                      to={`/calculators/${item.slug}`}
                      className="bg-slate-50 rounded-xl p-4 border border-slate-100 hover:shadow-md hover:border-blue-200 transition-all group flex flex-col h-full"
                    >
                      <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-100 transition-colors">
                        <IconComponent className="w-5 h-5 text-[#113262]" />
                      </div>
                      <h4 className="text-sm font-semibold text-slate-800 mb-1 group-hover:text-[#113262] transition-colors line-clamp-2">
                        {item.name}
                      </h4>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-cream/30 p-4 pt-28 font-sans">
      <div className="max-w-[1200px] mx-auto text-[13px]">
        {/* DASHBOARD Tabs Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between bg-ink text-cream p-3 mb-6 rounded-2xl shadow-xl gap-4">
          <div className="text-xl sm:text-2xl font-serif font-bold px-3 whitespace-nowrap">DASHBOARD <span className="text-accent">—</span> Your Financial Plan</div>
          <div className="flex gap-2 p-1 bg-primary/20 rounded-xl shrink-0 overflow-x-auto w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('retirement')}
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-lg font-bold text-sm tracking-wide transition-all ${activeTab === 'retirement' ? 'bg-accent text-ink shadow-md' : 'text-cream hover:bg-white/10'}`}
            >
              Retirement Analysis
            </button>
            <button
              onClick={() => setActiveTab('risk')}
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-lg font-bold text-sm tracking-wide transition-all ${activeTab === 'risk' ? 'bg-accent text-ink shadow-md' : 'text-cream hover:bg-white/10'}`}
            >
              Risk Profile
            </button>
            <button
              onClick={() => setActiveTab('tools')}
              className={`flex-1 sm:flex-none px-5 py-2.5 rounded-lg font-bold text-sm tracking-wide transition-all ${activeTab === 'tools' ? 'bg-accent text-ink shadow-md' : 'text-cream hover:bg-white/10'}`}
            >
              Financial Tools
            </button>
          </div>
        </div>

        {activeTab === 'retirement' && filteredRetHist.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-primary mb-3 px-1">Assessment History</h3>
            <div className="overflow-x-auto pb-2 flex gap-3 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              {filteredRetHist.map((hist, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedRetHistIndex(idx)}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl font-medium text-sm transition-all flex items-center gap-2 border ${
                    safeRetIndex === idx
                      ? 'bg-primary text-white border-primary shadow-md'
                      : 'bg-white text-primary/70 border-primary/20 hover:bg-primary/5'
                  }`}
                >
                  <Icons.Calendar className="w-4 h-4" />
                  {new Date(hist.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'risk' && filteredRiskHist.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-primary mb-3 px-1">Assessment History</h3>
            <div className="overflow-x-auto pb-2 flex gap-3 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              {filteredRiskHist.map((hist, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedRiskHistIndex(idx)}
                  className={`whitespace-nowrap px-4 py-2 rounded-xl font-medium text-sm transition-all flex items-center gap-2 border ${
                    safeRiskIndex === idx
                      ? 'bg-primary text-white border-primary shadow-md'
                      : 'bg-white text-primary/70 border-primary/20 hover:bg-primary/5'
                  }`}
                >
                  <Icons.Calendar className="w-4 h-4" />
                  {new Date(hist.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'retirement' ? renderRetirementTab() : activeTab === 'risk' ? renderRiskTab() : renderToolsTab()}
        
        {/* Modals for Detailed Views */}
        {selectedRetHistory && (
          <div className="fixed inset-0 bg-ink/80 z-50 flex items-start justify-center p-4 md:p-8 overflow-y-auto animate-fade-in backdrop-blur-sm">
            <div className={`bg-white max-w-4xl w-full relative ${isExporting ? 'p-12' : 'rounded-3xl p-6 md:p-8 my-auto shadow-2xl'}`} ref={retModalRef}>
              <button 
                onClick={() => setSelectedRetHistory(null)}
                className="exclude-from-pdf absolute top-4 right-4 p-2 bg-cream rounded-full text-ink hover:bg-accent hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-serif font-bold text-ink mb-2">Historical Retirement Analysis</h2>
              <p className="text-sm text-primary/70 mb-6 font-medium">
                Conducted on: {new Date(selectedRetHistory.createdAt).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}
                {selectedRetHistory.assessmentFor === 'other' && ` | For: ${selectedRetHistory.otherName} (${selectedRetHistory.otherRelation})`}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                 <div className="bg-cream/30 p-4 rounded-xl border border-primary/10">
                   <div className="text-xs text-primary/60 font-bold uppercase mb-1">Target Corpus</div>
                   <div className="text-lg font-bold text-ink">{formatCurrency(selectedRetHistory.results?.corpusRequired || 0)}</div>
                 </div>
                 <div className="bg-cream/30 p-4 rounded-xl border border-primary/10">
                   <div className="text-xs text-primary/60 font-bold uppercase mb-1">Projected Corpus</div>
                   <div className="text-lg font-bold text-ink">{formatCurrency(selectedRetHistory.results?.corpusAtRetirement || 0)}</div>
                 </div>
                 <div className="bg-cream/30 p-4 rounded-xl border border-primary/10">
                   <div className="text-xs text-primary/60 font-bold uppercase mb-1">Shortfall</div>
                   <div className="text-lg font-bold text-red-600">{formatCurrency(selectedRetHistory.results?.shortfall || 0)}</div>
                 </div>
                 <div className="bg-cream/30 p-4 rounded-xl border border-primary/10">
                   <div className="text-xs text-primary/60 font-bold uppercase mb-1">Req. Monthly SIP</div>
                   <div className="text-lg font-bold text-accent">{formatCurrency(selectedRetHistory.results?.requiredSip || 0)}</div>
                 </div>
              </div>

              <h3 className="text-lg font-bold text-ink mb-4 border-b border-primary/10 pb-2">Inputs Snapshot</h3>
              <div className={`${isExporting ? '' : 'max-h-[40vh] overflow-y-auto'} pr-2`}>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-6 text-sm">
                   {selectedRetHistory.inputs && Object.entries(selectedRetHistory.inputs).map(([key, value]) => (
                     <div key={key} className="flex justify-between border-b border-primary/5 pb-1">
                       <span className="text-primary/70 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                       <span className="font-semibold text-ink">{String(value)}</span>
                     </div>
                   ))}
                </div>
              </div>
              
              {renderRetirementUI(selectedRetHistory.results ? { ...selectedRetHistory.results, inputs: selectedRetHistory.inputs || selectedRetHistory.results.inputs } : selectedRetHistory)}
              
              <div className="mt-8 flex justify-end gap-4 exclude-from-pdf">
                <button 
                   className="btn-primary px-6 py-2 rounded-xl flex items-center gap-2 text-sm disabled:opacity-50"
                   onClick={() => handleExportPDF(retModalRef, `Retirement_Report_${new Date(selectedRetHistory.createdAt).getTime()}`)}
                   disabled={isExporting}
                >
                   <Download className="w-4 h-4" /> {isExporting ? 'Exporting...' : 'Export Report (PDF)'}
                </button>
              </div>
            </div>
          </div>
        )}

        {selectedRiskHistory && (
          <div className="fixed inset-0 bg-ink/80 z-50 flex items-start justify-center p-4 md:p-8 overflow-y-auto animate-fade-in backdrop-blur-sm">
            <div className={`bg-white max-w-2xl w-full relative ${isExporting ? 'p-12' : 'rounded-3xl p-6 md:p-8 my-auto shadow-2xl'}`} ref={riskModalRef}>
              <button 
                onClick={() => setSelectedRiskHistory(null)}
                className="exclude-from-pdf absolute top-4 right-4 p-2 bg-cream rounded-full text-ink hover:bg-accent hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-serif font-bold text-ink mb-2">Historical Risk Profile</h2>
              <p className="text-sm text-primary/70 mb-6 font-medium">
                Conducted on: {new Date(selectedRiskHistory.createdAt).toLocaleString('en-IN', { dateStyle: 'long', timeStyle: 'short' })}
                {selectedRiskHistory.assessmentFor === 'other' && ` | For: ${selectedRiskHistory.otherName} (${selectedRiskHistory.otherRelation})`}
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-cream/30 p-6 rounded-2xl border border-primary/10 text-center">
                  <div className="text-xs font-bold uppercase text-primary/50 mb-2">Category</div>
                  <div className="text-3xl font-bold text-accent">{selectedRiskHistory.riskCategory}</div>
                </div>
                <div className="bg-cream/30 p-6 rounded-2xl border border-primary/10 text-center">
                  <div className="text-xs font-bold uppercase text-primary/50 mb-2">Total Score</div>
                  <div className="text-3xl font-bold text-primary">{selectedRiskHistory.score} <span className="text-lg font-normal text-primary/50">/ 50</span></div>
                </div>
              </div>

              <div className="bg-ink text-white p-6 rounded-2xl">
                 <div className="text-xs font-bold uppercase text-white/50 mb-3">Allocation Strategy</div>
                 <div className="space-y-2 font-medium">
                    {(() => {
                       const { allocation } = getRiskCategory(selectedRiskHistory.score);
                       return allocation.split('|').map((part: string, idx: number) => (
                         <div key={idx} className="flex items-center gap-2">
                           <div className="w-2 h-2 rounded-full bg-accent" />
                           {part.trim()}
                         </div>
                       ));
                    })()}
                 </div>
              </div>

              <div className="mt-6 flex justify-end gap-4 exclude-from-pdf">
                <button 
                   className="btn-primary px-6 py-2 rounded-xl flex items-center gap-2 text-sm disabled:opacity-50"
                   onClick={() => handleExportPDF(riskModalRef, `Risk_Profile_${new Date(selectedRiskHistory.createdAt).getTime()}`)}
                   disabled={isExporting}
                >
                   <Download className="w-4 h-4" /> {isExporting ? 'Exporting...' : 'Export Report (PDF)'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{`
        @media print {
          @page { margin: 0; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
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
  );
}




import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import * as XLSX from 'xlsx';
import { Download, Activity, Target, BarChart3, Database, Search } from 'lucide-react';

export const DataRepository: React.FC = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<'analytics' | 'assessments' | 'retirement'>('analytics');
  const [assessments, setAssessments] = useState<any[]>([]);
  const [retirementData, setRetirementData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, [token]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL;
      
      const [assessRes, retireRes] = await Promise.all([
        axios.get(`${apiUrl}/admin/assessments`, { headers: { Authorization: `Bearer ${token}` } }),
        axios.get(`${apiUrl}/admin/retirement-analysis`, { headers: { Authorization: `Bearer ${token}` } })
      ]);
      
      setAssessments(assessRes.data);
      setRetirementData(retireRes.data);
    } catch (error) {
      console.error('Error fetching repository data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportAssessments = () => {
    const allQuestionKeys = new Set<string>();
    assessments.forEach(a => {
      if (a.answers && Array.isArray(a.answers)) {
        a.answers.forEach((ans: any, idx: number) => {
          allQuestionKeys.add(`Q${idx + 1}: ${ans.questionText || 'Question'}`);
        });
      }
    });

    const dataToExport = assessments.map((a: any) => {
      const base: any = {
        'User Name': a.userId?.name || 'N/A',
        'User Email': a.userId?.email || 'N/A',
        'User Phone': a.userId?.phone || 'N/A',
        'Assessment For': a.assessmentFor === 'other' ? `${a.otherName} (${a.otherRelation})` : 'Self',
        'Risk Score': a.score,
        'Risk Category': a.riskCategory,
        'Date Submitted': new Date(a.createdAt).toLocaleString()
      };

      allQuestionKeys.forEach(q => base[q] = 'N/A');

      if (a.answers && Array.isArray(a.answers)) {
        a.answers.forEach((ans: any, idx: number) => {
          const key = `Q${idx + 1}: ${ans.questionText || 'Question'}`;
          base[key] = `${ans.selectedOption || ans.answer || 'N/A'} (Points: ${ans.points ?? 0})`;
        });
      }
      return base;
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Risk Assessments');
    XLSX.writeFile(workbook, 'Risk_Assessments_Export.xlsx');
  };

  const handleExportSingleAssessment = (a: any) => {
    const base: any = {
      'User Name': a.userId?.name || 'N/A',
      'User Email': a.userId?.email || 'N/A',
      'User Phone': a.userId?.phone || 'N/A',
      'Assessment For': a.assessmentFor === 'other' ? `${a.otherName} (${a.otherRelation})` : 'Self',
      'Risk Score': a.score,
      'Risk Category': a.riskCategory,
      'Date Submitted': new Date(a.createdAt).toLocaleString()
    };

    if (a.answers && Array.isArray(a.answers)) {
      a.answers.forEach((ans: any, idx: number) => {
        const key = `Q${idx + 1}: ${ans.questionText || 'Question'}`;
        base[key] = `${ans.selectedOption || ans.answer || 'N/A'} (Points: ${ans.points ?? 0})`;
      });
    }

    const worksheet = XLSX.utils.json_to_sheet([base]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Risk Assessment');
    XLSX.writeFile(workbook, `Risk_Assessment_${a.userId?.name || 'User'}.xlsx`);
  };

  const formatCurrency = (val: number) => {
    if (!val || isNaN(val)) return '₹0';
    return `₹${Math.round(val).toLocaleString('en-IN')}`;
  };

  const handleExportRetirement = () => {
    const allInputKeys = new Set<string>();
    retirementData.forEach(r => {
      const inputs = r.inputs || r.results?.inputs || {};
      Object.keys(inputs).forEach(key => {
        const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
        allInputKeys.add(`Input: ${formattedKey}`);
      });
    });

    const dataToExport = retirementData.map((r: any) => {
      const inputs = r.inputs || r.results?.inputs || {};
      const results = r.results || {};
      
      const base: any = {
        'User Name': r.userId?.name || 'N/A',
        'User Email': r.userId?.email || 'N/A',
        'User Phone': r.userId?.phone || 'N/A',
        'Assessment For': r.assessmentFor === 'other' ? `${r.otherName} (${r.otherRelation})` : 'Self',
        'Date Submitted': new Date(r.createdAt).toLocaleString(),
        'Corpus Required': formatCurrency(results.corpusRequired),
        'Corpus At Retirement': formatCurrency(results.corpusAtRetirement),
        'Shortfall': formatCurrency(results.shortfall),
        'Required SIP': formatCurrency(results.requiredSip),
      };

      allInputKeys.forEach(k => base[k] = 'N/A');

      Object.keys(inputs).forEach((key) => {
        const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
        const val = inputs[key];
        base[`Input: ${formattedKey}`] = typeof val === 'number' ? Math.round(val) : val;
      });
      return base;
    });

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Retirement Goals');
    XLSX.writeFile(workbook, 'Retirement_Goals_Export.xlsx');
  };

  const handleExportSingleRetirement = (r: any) => {
    const inputs = r.inputs || r.results?.inputs || {};
    const results = r.results || {};
    
    const base: any = {
      'User Name': r.userId?.name || 'N/A',
      'User Email': r.userId?.email || 'N/A',
      'User Phone': r.userId?.phone || 'N/A',
      'Assessment For': r.assessmentFor === 'other' ? `${r.otherName} (${r.otherRelation})` : 'Self',
      'Date Submitted': new Date(r.createdAt).toLocaleString(),
      'Corpus Required': formatCurrency(results.corpusRequired),
      'Corpus At Retirement': formatCurrency(results.corpusAtRetirement),
      'Shortfall': formatCurrency(results.shortfall),
      'Required SIP': formatCurrency(results.requiredSip),
    };

    Object.keys(inputs).forEach((key) => {
      const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase());
      const val = inputs[key];
      base[`Input: ${formattedKey}`] = typeof val === 'number' ? Math.round(val) : val;
    });

    const worksheet = XLSX.utils.json_to_sheet([base]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Retirement Goal');
    XLSX.writeFile(workbook, `Retirement_Goal_${r.userId?.name || 'User'}.xlsx`);
  };

  // Analytics Helpers
  const categoryCounts = assessments.reduce((acc: Record<string, number>, curr: any) => {
    acc[curr.riskCategory] = (acc[curr.riskCategory] || 0) + 1;
    return acc;
  }, {});
  
  const totalShortfall = retirementData.reduce((acc, curr) => acc + ((curr.results?.shortfall > 0 ? curr.results.shortfall : 0) || 0), 0);
  const avgShortfall = retirementData.length > 0 ? totalShortfall / retirementData.length : 0;
  
  const filterData = (data: any[]) => {
    if (!searchQuery) return data;
    const query = searchQuery.toLowerCase();
    return data.filter((item: any) => {
      const u = item.userId;
      if (!u) return false;
      return (u.name && u.name.toLowerCase().includes(query)) ||
             (u.email && u.email.toLowerCase().includes(query)) ||
             (u.phone && u.phone.includes(query));
    });
  };

  const filteredAssessments = filterData(assessments);
  const filteredRetirement = filterData(retirementData);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <Database className="w-6 h-6 text-blue-600" />
            Data Repository & Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-1 font-medium">
            View platform-wide risk profiles, retirement goals, and system analytics.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-bold text-slate-700">Total Risk Assessments</span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{assessments.length}</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-bold text-slate-700">Total Retirement Plans</span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{retirementData.length}</p>
        </div>
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-5 h-5 text-amber-600" />
            <span className="text-sm font-bold text-slate-700">Avg. Retirement Shortfall</span>
          </div>
          <p className="text-3xl font-extrabold text-slate-900">{formatCurrency(avgShortfall)}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="flex border-b border-slate-100 bg-slate-50 overflow-x-auto">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'analytics' ? 'bg-white text-blue-600 border-t-2 border-t-blue-600 border-b-2 border-b-white' : 'text-slate-500 hover:text-slate-800 border-t-2 border-t-transparent border-b-2 border-b-transparent'}`}
          >
            Analytics Dashboard
          </button>
          <button
            onClick={() => setActiveTab('assessments')}
            className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'assessments' ? 'bg-white text-blue-600 border-t-2 border-t-blue-600 border-b-2 border-b-white' : 'text-slate-500 hover:text-slate-800 border-t-2 border-t-transparent border-b-2 border-b-transparent'}`}
          >
            Risk Assessments
          </button>
          <button
            onClick={() => setActiveTab('retirement')}
            className={`px-6 py-4 text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'retirement' ? 'bg-white text-blue-600 border-t-2 border-t-blue-600 border-b-2 border-b-white' : 'text-slate-500 hover:text-slate-800 border-t-2 border-t-transparent border-b-2 border-b-transparent'}`}
          >
            Retirement Goals
          </button>
        </div>

        <div className="p-6">
          {isLoading ? (
            <div className="py-12 flex justify-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : activeTab === 'analytics' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border border-slate-100 rounded-xl p-6 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Platform Risk Distribution</h3>
                <div className="space-y-4">
                  {Object.entries(categoryCounts).map(([cat, count]: [string, any]) => (
                    <div key={cat}>
                      <div className="flex justify-between text-xs font-semibold mb-1">
                        <span className="text-slate-700">{cat}</span>
                        <span className="text-slate-500">{count} users ({Math.round((count / assessments.length) * 100)}%)</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${(count / assessments.length) * 100}%` }}></div>
                      </div>
                    </div>
                  ))}
                  {Object.keys(categoryCounts).length === 0 && (
                     <p className="text-sm text-slate-500 text-center py-4">No risk data available yet.</p>
                  )}
                </div>
              </div>
              <div className="border border-slate-100 rounded-xl p-6 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-800 mb-6">Retirement Readiness Overview</h3>
                <div className="space-y-6">
                   <div>
                     <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Users with Shortfall</p>
                     <p className="text-2xl font-bold text-rose-600">
                       {retirementData.filter(r => (r.results?.shortfall || 0) > 0).length} 
                       <span className="text-sm text-slate-500 font-medium ml-2">/ {retirementData.length} total</span>
                     </p>
                   </div>
                   <div>
                     <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Average Corpus Required</p>
                     <p className="text-2xl font-bold text-emerald-600">
                       {formatCurrency(retirementData.reduce((acc, curr) => acc + (curr.results?.corpusRequired || 0), 0) / (retirementData.length || 1))}
                     </p>
                   </div>
                   {retirementData.length === 0 && (
                     <p className="text-sm text-slate-500 py-4">No retirement data available yet.</p>
                   )}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by user name, email, or phone..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-blue-600"
                  />
                </div>
                <button
                  onClick={activeTab === 'assessments' ? handleExportAssessments : handleExportRetirement}
                  className="px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 rounded-xl text-xs font-bold shadow-sm flex items-center gap-2 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Export All to Excel
                </button>
              </div>

              <div className="overflow-x-auto border border-slate-200 rounded-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                      <th className="py-3 px-4 font-bold uppercase tracking-wider">User</th>
                      <th className="py-3 px-4 font-bold uppercase tracking-wider">Contact</th>
                      <th className="py-3 px-4 font-bold uppercase tracking-wider">Assessment For</th>
                      {activeTab === 'assessments' ? (
                        <>
                          <th className="py-3 px-4 font-bold uppercase tracking-wider">Score</th>
                          <th className="py-3 px-4 font-bold uppercase tracking-wider">Category</th>
                        </>
                      ) : (
                        <>
                          <th className="py-3 px-4 font-bold uppercase tracking-wider">Ret. Age</th>
                          <th className="py-3 px-4 font-bold uppercase tracking-wider">Required Corpus</th>
                          <th className="py-3 px-4 font-bold uppercase tracking-wider">Shortfall</th>
                        </>
                      )}
                      <th className="py-3 px-4 font-bold uppercase tracking-wider">Date</th>
                      <th className="py-3 px-4 font-bold uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {(activeTab === 'assessments' ? filteredAssessments : filteredRetirement).map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50">
                        <td className="py-3 px-4 font-semibold text-slate-800">
                          {item.userId?.name || 'Unknown'}
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {item.userId?.email}<br />
                          {item.userId?.phone}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-700">
                          {item.assessmentFor === 'other' ? `${item.otherName} (${item.otherRelation})` : 'Self'}
                        </td>
                        {activeTab === 'assessments' ? (
                          <>
                            <td className="py-3 px-4 font-bold text-blue-600">{item.score}</td>
                            <td className="py-3 px-4 font-medium">{item.riskCategory}</td>
                          </>
                        ) : (
                          <>
                            <td className="py-3 px-4">{item.inputs?.retirementAge || item.results?.inputs?.retirementAge || 'N/A'}</td>
                            <td className="py-3 px-4 font-medium text-slate-800">{formatCurrency(item.results?.corpusRequired || 0)}</td>
                            <td className="py-3 px-4 font-bold text-rose-600">{item.results?.shortfall > 0 ? formatCurrency(item.results?.shortfall) : 'Surplus'}</td>
                          </>
                        )}
                        <td className="py-3 px-4 text-slate-400">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => activeTab === 'assessments' ? handleExportSingleAssessment(item) : handleExportSingleRetirement(item)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200 inline-flex items-center gap-1"
                            title="Export this record"
                          >
                            <Download className="w-4 h-4" />
                            <span className="text-xs font-semibold">Export</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {(activeTab === 'assessments' ? filteredAssessments : filteredRetirement).length === 0 && (
                      <tr>
                        <td colSpan={8} className="py-8 text-center text-slate-400">
                          No records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

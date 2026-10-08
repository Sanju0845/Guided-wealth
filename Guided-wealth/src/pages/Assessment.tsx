import React, { useState, useEffect } from 'react';
import { useNavigate, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { assessmentQuestions, getRiskCategory } from '../constants/assessmentQuestions';
import axios from 'axios';
import { ChevronRight, ChevronLeft, ShieldCheck, CheckCircle, AlertCircle } from 'lucide-react';

export default function Assessment() {
  const { user, isLoggedIn, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const isRetake = searchParams.get('retake') === 'true';
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, { text: string, points: number }>>({});
  const [isConfigured, setIsConfigured] = useState(false);
  const [assessmentFor, setAssessmentFor] = useState<'self' | 'other'>('self');
  const [otherName, setOtherName] = useState('');
  const [otherRelation, setOtherRelation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number, category: string, allocation: string } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAssessment = async () => {
      if (user?.hasCompletedRiskAssessment && !isRetake) {
        try {
          const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
          const response = await axios.get(`${apiUrl}/assessment`, {
            headers: { Authorization: `Bearer ${user?.token}` }
          });
          if (response.data) {
            const { score, riskCategory } = response.data;
            const { allocation } = getRiskCategory(score);
            setResult({ score, category: riskCategory, allocation });
          }
        } catch (err) {
          console.error("Failed to fetch existing assessment");
        }
      }
    };
    if (isLoggedIn) {
      fetchAssessment();
    }
  }, [user?.hasCompletedRiskAssessment, user?.token, isLoggedIn, isRetake]);

  // Protect route
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  
  if (user?.hasCompletedRiskAssessment && !result && !isRetake) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6 bg-cream/30">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const currentQuestion = assessmentQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === assessmentQuestions.length - 1;
  const progress = ((currentQuestionIndex + 1) / assessmentQuestions.length) * 100;

  const handleOptionSelect = (optionText: string, points: number) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: { text: optionText, points }
    }));
  };

  const handleNext = () => {
    if (!canProceed) {
      setError('Please select an option to proceed to the next question.');
      return;
    }
    setError('');
    if (currentQuestionIndex < assessmentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');
    
    try {
      const formattedAnswers = assessmentQuestions.map(q => ({
        questionId: q.id,
        questionText: q.question,
        selectedOption: answers[q.id].text,
        points: answers[q.id].points
      }));

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
      const response = await axios.post(
        `${apiUrl}/assessment`,
        { answers: formattedAnswers, assessmentFor, otherName, otherRelation },
        { headers: { Authorization: `Bearer ${user?.token}` } }
      );

      const { score, riskCategory } = response.data;
      const { allocation } = getRiskCategory(score);
      
      setResult({ score, category: riskCategory, allocation });
      updateUser({ hasCompletedRiskAssessment: true });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit assessment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 bg-gradient-to-b from-cream to-white">
        <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-primary/10 max-w-2xl w-full text-center animate-scaleUp">
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-ink mb-4">Your Risk Profile</h1>
          <p className="text-primary/70 mb-8 max-w-md mx-auto">
            Based on your answers, we've analyzed your investment risk appetite and prepared a recommended allocation.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 text-left">
            <div className="bg-cream/50 p-6 rounded-2xl border border-primary/5">
              <span className="text-xs uppercase tracking-widest text-primary/50 font-bold mb-1 block">Risk Category</span>
              <span className="text-2xl font-bold text-accent">{result.category}</span>
            </div>
            <div className="bg-cream/50 p-6 rounded-2xl border border-primary/5">
              <span className="text-xs uppercase tracking-widest text-primary/50 font-bold mb-1 block">Total Score</span>
              <span className="text-2xl font-bold text-primary">{result.score} <span className="text-sm font-normal text-primary/60">/ 50</span></span>
            </div>
          </div>

          <div className="bg-ink text-cream p-6 rounded-2xl mb-8 text-left">
            <span className="text-xs uppercase tracking-widest text-cream/50 font-bold mb-3 block">Suggested Broad Asset Allocation</span>
            <div className="font-medium leading-relaxed">
              {result.allocation.split('|').map((part, idx) => (
                <div key={idx} className="flex items-center gap-2 mb-2 last:mb-0">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  {part.trim()}
                </div>
              ))}
            </div>
          </div>
          
          <button onClick={() => navigate('/dashboard')} className="btn-primary px-8 py-4 rounded-xl font-bold w-full md:w-auto">
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentAnswer = answers[currentQuestion.id];
  const canProceed = !!currentAnswer;

  if (!isConfigured) {
    return (
      <div className="min-h-screen bg-cream/30 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl border border-primary/10 p-8 md:p-12 animate-fade-in">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-ink mb-3">Who is this assessment for?</h1>
            <p className="text-primary/70 text-sm">Select whether you are taking this risk assessment for yourself or on behalf of someone else.</p>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => setAssessmentFor('self')}
                className={`p-4 rounded-xl border-2 font-bold transition-all ${assessmentFor === 'self' ? 'border-accent bg-accent/5 text-ink' : 'border-primary/10 text-primary/60 hover:border-accent/40'}`}
              >
                Myself
              </button>
              <button 
                onClick={() => setAssessmentFor('other')}
                className={`p-4 rounded-xl border-2 font-bold transition-all ${assessmentFor === 'other' ? 'border-accent bg-accent/5 text-ink' : 'border-primary/10 text-primary/60 hover:border-accent/40'}`}
              >
                Someone Else
              </button>
            </div>

            {assessmentFor === 'other' && (
              <div className="space-y-4 animate-fade-in mt-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-primary mb-2">Their Name *</label>
                  <input 
                    type="text" 
                    value={otherName}
                    onChange={(e) => setOtherName(e.target.value)}
                    className="w-full p-3 bg-[#F8F9FA] border-2 border-primary/10 rounded-xl text-ink font-semibold focus:outline-none focus:border-accent"
                    placeholder="Enter full name"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-primary mb-2">Relationship *</label>
                  <input 
                    type="text" 
                    value={otherRelation}
                    onChange={(e) => setOtherRelation(e.target.value)}
                    className="w-full p-3 bg-[#F8F9FA] border-2 border-primary/10 rounded-xl text-ink font-semibold focus:outline-none focus:border-accent"
                    placeholder="e.g. Spouse, Child, Parent"
                  />
                </div>
              </div>
            )}

            <button 
              onClick={() => {
                if (assessmentFor === 'other' && (!otherName.trim() || !otherRelation.trim())) {
                  setError('Please provide name and relation.');
                  return;
                }
                setError('');
                setIsConfigured(true);
              }}
              className="w-full btn-primary py-4 rounded-xl font-bold uppercase tracking-wide mt-8"
            >
              Start Assessment
            </button>
            {error && <p className="text-red-500 text-sm mt-2 text-center">{error}</p>}
          </div>
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; transform: translateY(10px); }
              to { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
          `}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header & Progress */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-serif font-bold text-ink mb-3">Wealth Risk Assessment</h1>
          <p className="text-primary/60 text-sm max-w-lg mx-auto">
            Please select the option that best reflects your current financial situation, objectives, and risk appetite.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-primary/10 overflow-hidden transition-all duration-300">
          {/* Progress Bar */}
          <div className="h-2 w-full bg-cream">
            <div 
              className="h-full bg-gradient-to-r from-primary via-accent to-accent-light transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="p-6 md:p-10">
            {/* Question Header */}
            <div className="flex items-center justify-between mb-8">
              <span className="text-xs font-bold uppercase tracking-widest text-accent bg-accent/10 px-3 py-1.5 rounded-lg">
                Question {currentQuestionIndex + 1} of {assessmentQuestions.length}
              </span>
            </div>

            {/* Question Text */}
            <h2 className="text-xl md:text-2xl font-semibold text-ink leading-relaxed mb-8">
              {currentQuestion.question}
            </h2>

            {/* Options */}
            <div className="space-y-3 mb-10">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = currentAnswer?.text === option.text;
                return (
                  <button
                    key={idx}
                    onClick={() => handleOptionSelect(option.text, option.points)}
                    className={`w-full text-left p-4 md:p-5 rounded-2xl border-2 transition-all duration-200 flex items-center justify-between group ${
                      isSelected 
                        ? 'border-accent bg-accent/5 shadow-md' 
                        : 'border-primary/10 hover:border-accent/40 hover:bg-cream/50'
                    }`}
                  >
                    <span className={`text-sm md:text-base font-medium transition-colors ${isSelected ? 'text-ink font-bold' : 'text-primary/80 group-hover:text-ink'}`}>
                      {option.text}
                    </span>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                      isSelected ? 'border-accent bg-accent' : 'border-primary/20'
                    }`}>
                      {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl flex items-start gap-3 text-sm font-medium">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-primary/5">
              <button
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0 || isSubmitting}
                className="flex items-center gap-2 px-5 py-3 rounded-xl text-primary/60 font-bold hover:text-primary hover:bg-cream transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={20} />
                Back
              </button>
              
              {isLastQuestion ? (
                <button
                  onClick={handleSubmit}
                  disabled={!canProceed || isSubmitting}
                  className="btn-primary flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl active:scale-95 transition-all"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-cream border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Assessment
                      <CheckCircle size={20} className="text-accent" />
                    </>
                  )}
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  className="bg-primary text-cream hover:bg-ink flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold uppercase tracking-wide shadow-md hover:shadow-lg active:scale-95 transition-all"
                >
                  Next
                  <ChevronRight size={20} className="text-accent" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


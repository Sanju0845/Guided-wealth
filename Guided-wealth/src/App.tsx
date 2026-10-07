import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LoginModal from './components/LoginModal';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home';
import Services from './pages/Services';
import About from './pages/About';
import Booking from './pages/Booking';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Legal from './pages/Legal';
import Resources from './pages/Resources';
import Calculators from './pages/Calculators';
import Research from './pages/Research';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import Assessment from './pages/Assessment';
import RetirementAnalysisForm from './pages/RetirementAnalysisForm';
import RiskAssessmentPopup from './components/RiskAssessmentPopup';
import EmailPrompt from '../subscriptionmails/EmailPrompt';
import SipFor1Crore from './components/research/sip-for-1-crore';
import SipForChildEducation from './components/research/sip-for-child-education';
import RetirementAt45 from './components/research/retirement-at-45';
import RetirementAt55 from './components/research/retirement-at-55';
import FireCalculatorIndia from './components/research/fire-calculator-india';
import SwpFor1LakhMonth from './components/research/swp-for-1-lakh-month';
import SwpFor50000Month from './components/research/swp-for-50000-month';
import HomeLoan20YearEmi from './components/research/home-loan-20-year-emi';
import GoldVsEquity10Year from './components/research/gold-vs-equity-10-year';
import GoldForWeddingPlanning from './components/research/gold-for-wedding-planning';
import RentalYieldMumbaiVsBangalore from './components/research/rental-yield-mumbai-vs-bangalore';
import NpsVsPpfComparison from './components/research/nps-vs-ppf-comparison';
import ElssVsPpfTaxSaving from './components/research/elss-vs-ppf-tax-saving';
import FreelancerIncomeTax2026 from './components/research/freelancer-income-tax-2026';
import EmergencyFundCalculator from './components/research/emergency-fund-calculator';

import AchieveEarlyFireRetirement from './components/calculators/achieve-early-fire-retirement';
import AgingParents from './components/calculators/aging-parents';
import ApyCalculator from './components/calculators/apy-calculator';
import BalanceTransferCalculator from './components/calculators/balance-transfer-calculator';
import BetterFundsChecker from './components/calculators/better-funds-checker';
import BonusCalculator from './components/calculators/bonus-calculator';
import BrokerageCostTool from './components/calculators/brokerage-cost-tool';
import CagrTracker from './components/calculators/cagr-tracker';
import CapitalGainsTaxCalculator from './components/calculators/capital-gains-tax-calculator';
import CarLoanEmi from './components/calculators/car-loan-emi';
import CareerGrowthPlanner from './components/calculators/career-growth-planner';
import ChildEducation from './components/calculators/child-education';
import ChildMarriage from './components/calculators/child-marriage';
import CompoundInterestTool from './components/calculators/compound-interest-tool';
import CreditCardPayoffCalculator from './components/calculators/credit-card-payoff-calculator';
import CtcToTakeHomeSalaryCalculator from './components/calculators/ctc-to-take-home-salary-calculator';
import CustomGoalTracker from './components/calculators/custom-goal-tracker';
import DaCalculator from './components/calculators/da-calculator';
import DebtRepaymentCalculator from './components/calculators/debt-repayment-calculator';
import DividendYieldCalculator from './components/calculators/dividend-yield-calculator';
import DreamWeddingFund from './components/calculators/dream-wedding-fund';
import EbidtaMarginCalculator from './components/calculators/ebidta-margin-calculator';
import EducationLoanEmi from './components/calculators/education-loan-emi';
import ElssCalculator from './components/calculators/elss-calculator';
import CalcEmergencyFundCalculator from './components/calculators/emergency-fund-calculator';
import Emi from './components/calculators/emi';
import EpfCalculator from './components/calculators/epf-calculator';
import FdReturnsEstimator from './components/calculators/fd-returns-estimator';
import FirstCarPlanner from './components/calculators/first-car-planner';
import FirstCroreGoal from './components/calculators/first-crore-goal';
import FreelancerIncomeTaxCalculator from './components/calculators/freelancer-income-tax-calculator';
import FutureValueCalculator from './components/calculators/future-value-calculator';
import GoldInvestmentCalculator from './components/calculators/gold-investment-calculator';
import GratuityEstimator from './components/calculators/gratuity-estimator';
import GstCalculator from './components/calculators/gst-calculator';
import HomeExtensionRenovation from './components/calculators/home-extension-renovation';
import HomeLoanEmi from './components/calculators/home-loan-emi';
import HomePurchasePlanner from './components/calculators/home-purchase-planner';
import HomeRenovationBudgetPlanner from './components/calculators/home-renovation-budget-planner';
import HraExemptionCalculator from './components/calculators/hra-exemption-calculator';
import IncomeTaxCalculator from './components/calculators/income-tax-calculator';
import Inflation from './components/calculators/inflation';
import IrregularCashFlow from './components/calculators/irregular-cash-flow';
import LandConstructionLoanCalculator from './components/calculators/land-construction-loan-calculator';
import LoanEligibilityCalculator from './components/calculators/loan-eligibility-calculator';
import LumpsumInvestmentCalculator from './components/calculators/lumpsum-investment-calculator';
import MarginCalculator from './components/calculators/margin-calculator';
import MarriageLoanCalculator from './components/calculators/marriage-loan-calculator';
import MovingFromPoorFundsToBetterFunds from './components/calculators/moving-from-poor-funds-to-better-funds';
import MutualFundCalculator from './components/calculators/mutual-fund-calculator';
import NetWorthCalculator from './components/calculators/net-worth-calculator';
import NpsCalculator from './components/calculators/nps-calculator';
import NpsReinvestmentInAnnuity from './components/calculators/nps-reinvestment-in-annuity';
import NscCalculator from './components/calculators/nsc-calculator';
import OptionValueEstimator from './components/calculators/option-value-estimator';
import PensionCalculator from './components/calculators/pension-calculator';
import PersonalLoanEmi from './components/calculators/personal-loan-emi';
import PortfolioRebalancingCalculator from './components/calculators/portfolio-rebalancing-calculator';
import PostRetirementExpensesCalculator from './components/calculators/post-retirement-expenses-calculator';
import PpfPlanner from './components/calculators/ppf-planner';
import RecurringDepositPlanner from './components/calculators/recurring-deposit-planner';
import RecurringVacationFund from './components/calculators/recurring-vacation-fund';
import RentalYieldCalculator from './components/calculators/rental-yield-calculator';
import RetirementPlanCalculator from './components/calculators/retirement-plan-calculator';
import ReverseMortgageCalculator from './components/calculators/reverse-mortgage-calculator';
import SavingsGoalCalculator from './components/calculators/savings-goal-calculator';
import ScssCalculator from './components/calculators/scss-calculator';
import Section80CTaxSavingCalculator from './components/calculators/section-80c-tax-saving-calculator';
import SgbCalculator from './components/calculators/sgb-calculator';
import SilverInvestmentCalculator from './components/calculators/silver-investment-calculator';
import SimpleInterest from './components/calculators/simple-interest';
import SingleAmount from './components/calculators/single-amount';
import SipDelayCost from './components/calculators/sip-delay-cost';
import SipGrowthCalculator from './components/calculators/sip-growth-calculator';
import Sip from './components/calculators/sip';
import StampDutyCalculator from './components/calculators/stamp-duty-calculator';
import StepUpSipCalculator from './components/calculators/step-up-sip-calculator';
import StockAverageCalculator from './components/calculators/stock-average-calculator';
import StockReturnCalculator from './components/calculators/stock-return-calculator';
import StudentLoanCalculator from './components/calculators/student-loan-calculator';
import SukanyaSamruddiYojana from './components/calculators/sukanya-samruddi-yojana';
import Superannuation from './components/calculators/superannuation';
import SwpCalculator from './components/calculators/swp-calculator';
import TdsCalculator from './components/calculators/tds-calculator';
import TopUpLoanCalculator from './components/calculators/top-up-loan-calculator';
import TravelBudgetCalculator from './components/calculators/travel-budget-calculator';
import VacationGoalPlanner from './components/calculators/vacation-goal-planner';
import WeddingBudgetPlanner from './components/calculators/wedding-budget-planner';
import WeightedAverageReturns from './components/calculators/weighted-average-returns';
import XirrCalculator from './components/calculators/xirr-calculator';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/research" element={<Research />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/assessment" element={<Assessment />} />
              <Route path="/retirement-analysis" element={<RetirementAnalysisForm />} />
              <Route path="/research/sip-for-1-crore" element={<SipFor1Crore />} />
              <Route path="/research/sip-for-child-education" element={<SipForChildEducation />} />
              <Route path="/research/retirement-at-45" element={<RetirementAt45 />} />
              <Route path="/research/retirement-at-55" element={<RetirementAt55 />} />
              <Route path="/research/fire-calculator-india" element={<FireCalculatorIndia />} />
              <Route path="/research/swp-for-1-lakh-month" element={<SwpFor1LakhMonth />} />
              <Route path="/research/swp-for-50000-month" element={<SwpFor50000Month />} />
              <Route path="/research/home-loan-20-year-emi" element={<HomeLoan20YearEmi />} />
              <Route path="/research/gold-vs-equity-10-year" element={<GoldVsEquity10Year />} />
              <Route path="/research/gold-for-wedding-planning" element={<GoldForWeddingPlanning />} />
              <Route path="/research/rental-yield-mumbai-vs-bangalore" element={<RentalYieldMumbaiVsBangalore />} />
              <Route path="/research/nps-vs-ppf-comparison" element={<NpsVsPpfComparison />} />
              <Route path="/research/elss-vs-ppf-tax-saving" element={<ElssVsPpfTaxSaving />} />
              <Route path="/research/freelancer-income-tax-2026" element={<FreelancerIncomeTax2026 />} />
              <Route path="/research/emergency-fund-calculator" element={<EmergencyFundCalculator />} />
              <Route path="/calculators" element={<Calculators />} />
              <Route path="/calculators/achieve-early-fire-retirement" element={<AchieveEarlyFireRetirement />} />
              <Route path="/calculators/aging-parents" element={<AgingParents />} />
              <Route path="/calculators/apy-calculator" element={<ApyCalculator />} />
              <Route path="/calculators/balance-transfer-calculator" element={<BalanceTransferCalculator />} />
              <Route path="/calculators/better-funds-checker" element={<BetterFundsChecker />} />
              <Route path="/calculators/bonus-calculator" element={<BonusCalculator />} />
              <Route path="/calculators/brokerage-cost-tool" element={<BrokerageCostTool />} />
              <Route path="/calculators/cagr-tracker" element={<CagrTracker />} />
              <Route path="/calculators/capital-gains-tax-calculator" element={<CapitalGainsTaxCalculator />} />
              <Route path="/calculators/car-loan-emi" element={<CarLoanEmi />} />
              <Route path="/calculators/career-growth-planner" element={<CareerGrowthPlanner />} />
              <Route path="/calculators/child-education" element={<ChildEducation />} />
              <Route path="/calculators/child-marriage" element={<ChildMarriage />} />
              <Route path="/calculators/compound-interest-tool" element={<CompoundInterestTool />} />
              <Route path="/calculators/credit-card-payoff-calculator" element={<CreditCardPayoffCalculator />} />
              <Route path="/calculators/ctc-to-take-home-salary-calculator" element={<CtcToTakeHomeSalaryCalculator />} />
              <Route path="/calculators/custom-goal-tracker" element={<CustomGoalTracker />} />
              <Route path="/calculators/da-calculator" element={<DaCalculator />} />
              <Route path="/calculators/debt-repayment-calculator" element={<DebtRepaymentCalculator />} />
              <Route path="/calculators/dividend-yield-calculator" element={<DividendYieldCalculator />} />
              <Route path="/calculators/dream-wedding-fund" element={<DreamWeddingFund />} />
              <Route path="/calculators/ebidta-margin-calculator" element={<EbidtaMarginCalculator />} />
              <Route path="/calculators/education-loan-emi" element={<EducationLoanEmi />} />
              <Route path="/calculators/elss-calculator" element={<ElssCalculator />} />
              <Route path="/calculators/emergency-fund-calculator" element={<CalcEmergencyFundCalculator />} />
              <Route path="/calculators/emi" element={<Emi />} />
              <Route path="/calculators/epf-calculator" element={<EpfCalculator />} />
              <Route path="/calculators/fd-returns-estimator" element={<FdReturnsEstimator />} />
              <Route path="/calculators/first-car-planner" element={<FirstCarPlanner />} />
              <Route path="/calculators/first-crore-goal" element={<FirstCroreGoal />} />
              <Route path="/calculators/freelancer-income-tax-calculator" element={<FreelancerIncomeTaxCalculator />} />
              <Route path="/calculators/future-value-calculator" element={<FutureValueCalculator />} />
              <Route path="/calculators/gold-investment-calculator" element={<GoldInvestmentCalculator />} />
              <Route path="/calculators/gratuity-estimator" element={<GratuityEstimator />} />
              <Route path="/calculators/gst-calculator" element={<GstCalculator />} />
              <Route path="/calculators/home-extension-renovation" element={<HomeExtensionRenovation />} />
              <Route path="/calculators/home-loan-emi" element={<HomeLoanEmi />} />
              <Route path="/calculators/home-purchase-planner" element={<HomePurchasePlanner />} />
              <Route path="/calculators/home-renovation-budget-planner" element={<HomeRenovationBudgetPlanner />} />
              <Route path="/calculators/hra-exemption-calculator" element={<HraExemptionCalculator />} />
              <Route path="/calculators/income-tax-calculator" element={<IncomeTaxCalculator />} />
              <Route path="/calculators/inflation" element={<Inflation />} />
              <Route path="/calculators/irregular-cash-flow" element={<IrregularCashFlow />} />
              <Route path="/calculators/land-construction-loan-calculator" element={<LandConstructionLoanCalculator />} />
              <Route path="/calculators/loan-eligibility-calculator" element={<LoanEligibilityCalculator />} />
              <Route path="/calculators/lumpsum-investment-calculator" element={<LumpsumInvestmentCalculator />} />
              <Route path="/calculators/margin-calculator" element={<MarginCalculator />} />
              <Route path="/calculators/marriage-loan-calculator" element={<MarriageLoanCalculator />} />
              <Route path="/calculators/moving-from-poor-funds-to-better-funds" element={<MovingFromPoorFundsToBetterFunds />} />
              <Route path="/calculators/mutual-fund-calculator" element={<MutualFundCalculator />} />
              <Route path="/calculators/net-worth-calculator" element={<NetWorthCalculator />} />
              <Route path="/calculators/nps-calculator" element={<NpsCalculator />} />
              <Route path="/calculators/nps-reinvestment-in-annuity" element={<NpsReinvestmentInAnnuity />} />
              <Route path="/calculators/nsc-calculator" element={<NscCalculator />} />
              <Route path="/calculators/option-value-estimator" element={<OptionValueEstimator />} />
              <Route path="/calculators/pension-calculator" element={<PensionCalculator />} />
              <Route path="/calculators/personal-loan-emi" element={<PersonalLoanEmi />} />
              <Route path="/calculators/portfolio-rebalancing-calculator" element={<PortfolioRebalancingCalculator />} />
              <Route path="/calculators/post-retirement-expenses-calculator" element={<PostRetirementExpensesCalculator />} />
              <Route path="/calculators/ppf-planner" element={<PpfPlanner />} />
              <Route path="/calculators/recurring-deposit-planner" element={<RecurringDepositPlanner />} />
              <Route path="/calculators/recurring-vacation-fund" element={<RecurringVacationFund />} />
              <Route path="/calculators/rental-yield-calculator" element={<RentalYieldCalculator />} />
              <Route path="/calculators/retirement-plan-calculator" element={<RetirementPlanCalculator />} />
              <Route path="/calculators/reverse-mortgage-calculator" element={<ReverseMortgageCalculator />} />
              <Route path="/calculators/savings-goal-calculator" element={<SavingsGoalCalculator />} />
              <Route path="/calculators/scss-calculator" element={<ScssCalculator />} />
              <Route path="/calculators/section-80c-tax-saving-calculator" element={<Section80CTaxSavingCalculator />} />
              <Route path="/calculators/sgb-calculator" element={<SgbCalculator />} />
              <Route path="/calculators/silver-investment-calculator" element={<SilverInvestmentCalculator />} />
              <Route path="/calculators/simple-interest" element={<SimpleInterest />} />
              <Route path="/calculators/single-amount" element={<SingleAmount />} />
              <Route path="/calculators/sip-delay-cost" element={<SipDelayCost />} />
              <Route path="/calculators/sip-growth-calculator" element={<SipGrowthCalculator />} />
              <Route path="/calculators/sip" element={<Sip />} />
              <Route path="/calculators/stamp-duty-calculator" element={<StampDutyCalculator />} />
              <Route path="/calculators/step-up-sip-calculator" element={<StepUpSipCalculator />} />
              <Route path="/calculators/stock-average-calculator" element={<StockAverageCalculator />} />
              <Route path="/calculators/stock-return-calculator" element={<StockReturnCalculator />} />
              <Route path="/calculators/student-loan-calculator" element={<StudentLoanCalculator />} />
              <Route path="/calculators/sukanya-samruddi-yojana" element={<SukanyaSamruddiYojana />} />
              <Route path="/calculators/superannuation" element={<Superannuation />} />
              <Route path="/calculators/swp-calculator" element={<SwpCalculator />} />
              <Route path="/calculators/tds-calculator" element={<TdsCalculator />} />
              <Route path="/calculators/top-up-loan-calculator" element={<TopUpLoanCalculator />} />
              <Route path="/calculators/travel-budget-calculator" element={<TravelBudgetCalculator />} />
              <Route path="/calculators/vacation-goal-planner" element={<VacationGoalPlanner />} />
              <Route path="/calculators/wedding-budget-planner" element={<WeddingBudgetPlanner />} />
              <Route path="/calculators/weighted-average-returns" element={<WeightedAverageReturns />} />
              <Route path="/calculators/xirr-calculator" element={<XirrCalculator />} />
              <Route path="/about" element={<About />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/legal" element={<Legal />} />
            </Routes>
          </main>
          <Footer />
          <LoginModal />
          <RiskAssessmentPopup />
          <EmailPrompt />
        </div>
      </Router>
    </AuthProvider>
  );
}

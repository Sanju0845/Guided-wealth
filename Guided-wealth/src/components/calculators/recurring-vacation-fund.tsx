import React, { useState, useEffect } from 'react';
import { CurrencyInput } from '../ui/CurrencyInput';
import { Share2, Plane, Hotel, Utensils, Compass, Sliders, ChevronDown, ChevronUp, DollarSign, Globe } from 'lucide-react';

export default function RecurringVacationFund() {
  // Input States
  const [numberOfDestinations, setNumberOfDestinations] = useState<number>(5);
  const [daysPerDestination, setDaysPerDestination] = useState<number>(4);
  const [toursPerYear, setToursPerYear] = useState<number>(1);
  const [travelClass, setTravelClass] = useState<string>('Economy');

  // Additional Settings
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [flightsCostPerDest, setFlightsCostPerDest] = useState<number>(25000);
  const [dailyAccomBudget, setDailyAccomBudget] = useState<number>(12000);
  const [dailyActivitiesBudget, setDailyActivitiesBudget] = useState<number>(8000);

  // Computed Outputs
  const [totalFlights, setTotalFlights] = useState<number>(0);
  const [totalAccommodation, setTotalAccommodation] = useState<number>(0);
  const [totalFood, setTotalFood] = useState<number>(0);
  const [totalTransport, setTotalTransport] = useState<number>(0);
  const [totalActivities, setTotalActivities] = useState<number>(0);

  const [totalCostPerTour, setTotalCostPerTour] = useState<number>(0);
  const [totalAnnualCost, setTotalAnnualCost] = useState<number>(0);
  const [requiredMonthlySavings, setRequiredMonthlySavings] = useState<number>(0);

  useEffect(() => {
    const totalDays = numberOfDestinations * daysPerDestination;
    let classMultiplier = 1.0;
    if (travelClass === 'Business') classMultiplier = 2.2;
    if (travelClass === 'First') classMultiplier = 4.0;

    const flights = Math.round(flightsCostPerDest * numberOfDestinations * classMultiplier);
    const accom = Math.round(dailyAccomBudget * totalDays);
    const food = Math.round(accom * 0.4);
    const transport = Math.round(accom * 0.25);
    const activities = Math.round(dailyActivitiesBudget * totalDays);

    const cost1Tour = flights + accom + food + transport + activities;
    const annualTotal = cost1Tour * toursPerYear;
    const monthlyReq = Math.round(annualTotal / 12);

    setTotalFlights(flights);
    setTotalAccommodation(accom);
    setTotalFood(food);
    setTotalTransport(transport);
    setTotalActivities(activities);

    setTotalCostPerTour(cost1Tour);
    setTotalAnnualCost(annualTotal);
    setRequiredMonthlySavings(monthlyReq);
  }, [
    numberOfDestinations,
    daysPerDestination,
    toursPerYear,
    travelClass,
    flightsCostPerDest,
    dailyAccomBudget,
    dailyActivitiesBudget,
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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">World Tour Calculator</h1>
        <p className="text-slate-600 text-base">
          Plan Your Global Adventures and estimate recurring travel fund requirements
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Grid */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Inputs Column */}
          <div className="flex-1 space-y-6">
            {/* Tour Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" /> Tour Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Number of Destinations</label>
                    <input
                      type="number"
                      min="1"
                      max="15"
                      value={numberOfDestinations}
                      onChange={(e) => setNumberOfDestinations(Math.max(1, Number(e.target.value)))}
                    />
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="15"
                    step="1"
                    value={numberOfDestinations}
                    onChange={(e) => setNumberOfDestinations(Number(e.target.value))}

                    style={getSliderStyle(numberOfDestinations, "1", "15")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Days per Destination</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={daysPerDestination}
                      onChange={(e) => setDaysPerDestination(Math.max(1, Number(e.target.value)))}
                    />
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="1"
                    value={daysPerDestination}
                    onChange={(e) => setDaysPerDestination(Number(e.target.value))}

                    style={getSliderStyle(daysPerDestination, "1", "20")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-slate-700">Tours per Year</label>
                  <span className="text-sm font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-lg border border-slate-300">
                    {toursPerYear}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="4"
                  step="1"
                  value={toursPerYear}
                  onChange={(e) => setToursPerYear(Number(e.target.value))}

                  style={getSliderStyle(toursPerYear, "1", "4")}
                  className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                />
              </div>
            </div>

            {/* Travel Class Selector */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Plane className="w-5 h-5 text-blue-600" /> Travel Class
              </h2>

              <div className="grid grid-cols-3 gap-3">
                {['Economy', 'Business', 'First'].map((cls) => (
                  <button
                    key={cls}
                    onClick={() => setTravelClass(cls)}
                    className={`py-3.5 px-4 rounded-xl font-bold text-sm transition-all border ${travelClass === cls
                        ? 'bg-[#1e2a4f] text-white border-[#113262] shadow-md'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Settings Accordion */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="w-full p-6 flex justify-between items-center font-bold text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <span className="flex items-center gap-2 text-base">
                  <Sliders className="w-5 h-5 text-blue-600" /> Additional Settings (Custom Daily Costs)
                </span>
                {showAdvanced ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
              </button>

              {showAdvanced && (
                <div className="p-6 pt-0 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Flights Cost per Destination</label>
                    <CurrencyInput
                    value={flightsCostPerDest}
                    onValueChange={(val) => setFlightsCostPerDest(val)}
                  />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Daily Accom Budget</label>
                    <CurrencyInput
                    value={dailyAccomBudget}
                    onValueChange={(val) => setDailyAccomBudget(val)}
                  />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Daily Activities Budget</label>
                    <CurrencyInput
                    value={dailyActivitiesBudget}
                    onValueChange={(val) => setDailyActivitiesBudget(val)}
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
                <h2 className="text-xl font-bold tracking-tight">Tour Cost Summary</h2>
                <button className="text-slate-400 hover:text-white transition-colors p-1" title="Share">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-8 bg-slate-800/80 p-5 rounded-2xl border border-slate-600">
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">
                  {formatCurrency(totalAnnualCost)}
                </div>
                <div className="text-slate-300 text-xs font-medium uppercase tracking-wider">Total Annual Cost ({toursPerYear} tour)</div>
              </div>

              <div className="space-y-4 border-t border-slate-600/60 pt-6">
                <div className="flex justify-between items-center text-sm font-semibold text-amber-400">
                  <span>Annual Cost Breakdown</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300 flex items-center gap-1.5"><Plane className="w-4 h-4 text-slate-400" /> Flights</span>
                  <span className="font-semibold text-white">{formatCurrency(totalFlights)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300 flex items-center gap-1.5"><Hotel className="w-4 h-4 text-slate-400" /> Accommodation</span>
                  <span className="font-semibold text-white">{formatCurrency(totalAccommodation)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300 flex items-center gap-1.5"><Utensils className="w-4 h-4 text-slate-400" /> Food & Dining</span>
                  <span className="font-semibold text-white">{formatCurrency(totalFood)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300 flex items-center gap-1.5"><Compass className="w-4 h-4 text-slate-400" /> Local Transport</span>
                  <span className="font-semibold text-white">{formatCurrency(totalTransport)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300 flex items-center gap-1.5"><Compass className="w-4 h-4 text-slate-400" /> Activities</span>
                  <span className="font-semibold text-white">{formatCurrency(totalActivities)}</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-3 border-t border-slate-600/40">
                  <span className="text-slate-300">Required Monthly Savings</span>
                  <span className="font-semibold text-emerald-400">{formatCurrency(requiredMonthlySavings)}</span>
                </div>
              </div>

              <button className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2">
                Start Tour Planning <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Informational SEO & FAQs Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-slate-200">
          <div className="md:col-span-2 space-y-8 text-slate-700 text-sm md:text-base leading-relaxed">
            <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Plan Your Multi-Destination World Tour</h2>
              <p className="text-slate-600 mb-4">
                Calculate and plan the financial aspects of your dream world tour with our comprehensive calculator
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Understanding Your World Tour Budget</h3>
              <p className="text-slate-600 mb-4">
                Our World Tour Calculator helps you plan your multi-destination adventure by considering five key expense categories: • Flight Costs: Choose between Economy, Business, or First Class travel • Accommodation: Set your daily accommodation budget based on your comfort preferences • Food & Dining: Automatically calculated as 40% of your accommodation budget • Local Transport: Includes taxis, public transport, and local travel arrangements • Optional Activities: Add a daily budget for tours, attractions, and entertainment The calculator helps you understand both the total trip cost and the monthly savings required to achieve your travel goal.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Customizing Your Travel Experience</h3>
              <p className="text-slate-600 mb-4">
                Tailor your world tour experience by adjusting these key parameters: • Number of Destinations: Plan visits to 2-15 different locations • Duration per Destination: Allocate 2-10 days for each location • Travel Class: Choose from Economy (budget-friendly), Business (enhanced comfort), or First Class (luxury experience) • Accommodation Level: Select daily budgets from $50-$500 to match your preferred comfort level • Activity Inclusion: Optionally add daily budgets for tours and activities • Tour Frequency: Plan for 1-4 tours per year Each choice significantly impacts your total budget and required savings, allowing you to find the perfect balance between comfort and cost.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Smart Financial Planning</h3>
              <p className="text-slate-600 mb-4">
                Make your world tour dreams achievable through strategic financial planning: • Start Early: Begin saving well in advance to spread the cost over time • Monthly Savings: Use our calculator's suggested monthly savings target • Regular Reviews: Adjust your savings plan as travel costs and preferences change • Flexible Planning: Consider different combinations of destinations and durations • Cost Management: Balance luxury elements with budget-friendly choices • Annual Planning: Schedule multiple tours per year based on your financial capacity Remember that travel costs can vary significantly based on seasons, destinations, and booking timing. It's recommended to add a 10-15% buffer to your calculated budget for unexpected expenses.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Travel Class Considerations</h3>
              <p className="text-slate-600 mb-4">
                Understanding the benefits of different travel classes helps make informed decisions: Economy Class: • Most cost-effective option for longer trips • More budget available for activities and accommodations • Ideal for maximizing the number of destinations Business Class: • Enhanced comfort for long-haul flights • Priority check-in and baggage handling • Access to airport lounges • Cost Management: Balance luxury elements with budget-friendly choices First Class: • Ultimate comfort and luxury experience • Maximum flexibility with bookings • Exclusive airport services • Perfect for special occasions or luxury tour Choose your travel class based on flight duration, route importance, and overall budget allocation.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Accommodation and Activities</h3>
              <p className="text-slate-600 mb-4">
                Your daily accommodation budget influences both comfort level and available amenities: $50-100/night • Budget hotels and hostels • Basic amenities • Shared facilities in some cases $100-250/night • Mid-range hotels • Standard amenities • Central locations • Private facilities $250-500/night • Luxury hotels and resorts • Premium locations • Full service amenities • Concierge services Activities and entertainment budgets can enhance your travel experience through: • Guided tours and excursions • Cultural experiences • Adventure activities • Local entertainment • Museum and attraction entries
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Practical Planning Tips</h3>
              <p className="text-slate-600">
                Maximize your world tour experience with these practical considerations: • Optimal Duration: 3-5 days per destination typically allows for key experiences • Destination Grouping: Plan routes that minimize long-haul flights • Seasonal Timing: Research weather patterns and peak seasons • Visa Requirements: Factor in visa costs and processing time • Health Preparations: Include travel insurance and vaccination costs • Local Transport: Research public transport options vs private transfers • Currency Exchange: Consider exchange rates in your budget planning Use the calculator's breakdown feature to understand how each component contributes to your total budget, helping you make informed decisions about where to splurge or save.
              </p>
            </section>

            <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-2xl font-bold text-[#113262]">Frequently Asked Questions</h2>

              <div className="border-b border-slate-100 pb-5">
                <h3 className="font-bold text-slate-900 mb-2">How much does a world tour cost from India?</h3>
                <p className="text-slate-600 text-base">
                  A 30-day multi-continent trip typically costs Rs 5-15 lakh per person depending on destinations and travel style. Budget travel (hostels, local transport) can bring it down to Rs 3-5 lakh. Premium travel (business class, 4-5 star hotels) can cost Rs 15-30 lakh. Around-the-world airline tickets start at Rs 2-3 lakh.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-2">How can I save for regular international travel?</h3>
                <p className="text-slate-600 text-base">
                  Set up a dedicated travel SIP of Rs 10,000-20,000 per month in a balanced fund. In 2-3 years, you accumulate Rs 3-8 lakh for a major trip. After each trip, restart the SIP for the next one. This creates a sustainable travel budget without dipping into your core investments or taking loans.
                </p>
              </div>
            </section>
          </div>

          {/* Right Column: SEO Card */}
          <div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-lg">Building a Travel Fund</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Enter your desired trip frequency (annual, biennial), estimated cost per trip, and when you want to start. The calculator computes a sustainable monthly SIP that funds one major international trip at your chosen interval. It accounts for travel cost inflation and shows how your travel corpus grows between trips.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

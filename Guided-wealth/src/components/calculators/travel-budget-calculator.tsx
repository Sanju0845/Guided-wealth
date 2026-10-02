import React, { useState, useEffect } from 'react';
import { CurrencyInput } from '../ui/CurrencyInput';
import { Share2, ChevronDown, ChevronUp, Plane, Hotel, Utensils, Compass, ShoppingBag, ShieldAlert } from 'lucide-react';

export default function TravelBudgetCalculator() {
  // Trip Details States
  const [numberOfTravelers, setNumberOfTravelers] = useState<number>(2);
  const [durationDays, setDurationDays] = useState<number>(7);
  const [destinationType, setDestinationType] = useState<string>('Domestic');

  // Accommodation & Transportation
  const [dailyAccommodationBudget, setDailyAccommodationBudget] = useState<number>(5000);
  const [transportationBudgetPerPerson, setTransportationBudgetPerPerson] = useState<number>(3000);

  // Daily Expenses
  const [dailyFoodBudget, setDailyFoodBudget] = useState<number>(1000);
  const [dailyActivitiesBudget, setDailyActivitiesBudget] = useState<number>(2000);

  // Additional Expenses
  const [showAdditional, setShowAdditional] = useState<boolean>(false);
  const [shoppingBudget, setShoppingBudget] = useState<number>(5000);
  const [visaInsurancePerPerson, setVisaInsurancePerPerson] = useState<number>(1500);
  const [contingencyBufferPercent, setContingencyBufferPercent] = useState<number>(10);

  // Computed Outputs
  const [totalAccommodation, setTotalAccommodation] = useState<number>(0);
  const [totalTransportation, setTotalTransportation] = useState<number>(0);
  const [totalFood, setTotalFood] = useState<number>(0);
  const [totalActivities, setTotalActivities] = useState<number>(0);
  const [totalAdditional, setTotalAdditional] = useState<number>(0);
  const [contingencyBufferAmount, setContingencyBufferAmount] = useState<number>(0);

  const [totalTripBudget, setTotalTripBudget] = useState<number>(0);
  const [costPerPerson, setCostPerPerson] = useState<number>(0);
  const [dailyBudgetOverall, setDailyBudgetOverall] = useState<number>(0);

  useEffect(() => {
    const rooms = Math.ceil(numberOfTravelers / 2);
    const accomCost = dailyAccommodationBudget * durationDays * rooms;
    const transCost = transportationBudgetPerPerson * numberOfTravelers;
    const foodCost = dailyFoodBudget * durationDays * numberOfTravelers;
    const actCost = dailyActivitiesBudget * durationDays * numberOfTravelers;
    const addCost = shoppingBudget + (visaInsurancePerPerson * numberOfTravelers);

    const subtotal = accomCost + transCost + foodCost + actCost + addCost;
    const buffer = Math.round(subtotal * (contingencyBufferPercent / 100));
    const total = subtotal + buffer;

    const perPerson = Math.round(total / (numberOfTravelers || 1));
    const perDay = Math.round(total / (durationDays || 1));

    setTotalAccommodation(accomCost);
    setTotalTransportation(transCost);
    setTotalFood(foodCost);
    setTotalActivities(actCost);
    setTotalAdditional(addCost);
    setContingencyBufferAmount(buffer);

    setTotalTripBudget(total);
    setCostPerPerson(perPerson);
    setDailyBudgetOverall(perDay);
  }, [
    numberOfTravelers,
    durationDays,
    dailyAccommodationBudget,
    transportationBudgetPerPerson,
    dailyFoodBudget,
    dailyActivitiesBudget,
    shoppingBudget,
    visaInsurancePerPerson,
    contingencyBufferPercent,
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
        <h1 className="text-2xl md:text-3xl font-bold text-[#113262] mb-4">Travel Budget Planner</h1>
        <p className="text-slate-600 text-base">
          Plan travel budgets with this comprehensive holiday cost calculator
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main Grid */}
        <div className="flex flex-col lg:flex-row gap-8 mb-16">
          {/* Inputs Column */}
          <div className="flex-1 space-y-6">
            {/* Trip Details */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Plane className="w-5 h-5 text-blue-600" /> Trip Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Number of Travelers</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={numberOfTravelers}
                      onChange={(e) => setNumberOfTravelers(Math.max(1, Number(e.target.value)))}
                    />
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="20"
                    step="1"
                    value={numberOfTravelers}
                    onChange={(e) => setNumberOfTravelers(Number(e.target.value))}

                    style={getSliderStyle(numberOfTravelers, "1", "20")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Duration (Days)</label>
                    <input
                      type="number"
                      min="1"
                      max="90"
                      value={durationDays}
                      onChange={(e) => setDurationDays(Math.max(1, Number(e.target.value)))}
                    />
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="90"
                    step="1"
                    value={durationDays}
                    onChange={(e) => setDurationDays(Number(e.target.value))}

                    style={getSliderStyle(durationDays, "1", "90")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Destination Type</label>
                <select
                  value={destinationType}
                  onChange={(e) => setDestinationType(e.target.value)}
                  className="w-full p-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none font-semibold text-slate-800 bg-white text-sm"
                >
                  <option value="Domestic">Domestic (Standard City/Heritage)</option>
                  <option value="Domestic Hill/Beach">Domestic (Hill Station / Beach Resort)</option>
                  <option value="International Asia">International (Southeast Asia / Dubai)</option>
                  <option value="International Europe">International (Europe / USA / UK)</option>
                </select>
              </div>
            </div>

            {/* Accommodation & Transportation */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Hotel className="w-5 h-5 text-blue-600" /> Accommodation & Transportation
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Daily Accommodation Budget</label>
                    <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-300">
                      {formatCurrency(dailyAccommodationBudget)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="500"
                    max="50000"
                    step="500"
                    value={dailyAccommodationBudget}
                    onChange={(e) => setDailyAccommodationBudget(Number(e.target.value))}

                    style={getSliderStyle(dailyAccommodationBudget, "500", "50000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Transportation Budget per Person</label>
                    <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-300">
                      {formatCurrency(transportationBudgetPerPerson)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="150000"
                    step="500"
                    value={transportationBudgetPerPerson}
                    onChange={(e) => setTransportationBudgetPerPerson(Number(e.target.value))}

                    style={getSliderStyle(transportationBudgetPerPerson, "0", "150000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>
              </div>
            </div>

            {/* Daily Expenses */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Utensils className="w-5 h-5 text-blue-600" /> Daily Expenses
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Daily Food Budget</label>
                    <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-300">
                      {formatCurrency(dailyFoodBudget)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="10000"
                    step="100"
                    value={dailyFoodBudget}
                    onChange={(e) => setDailyFoodBudget(Number(e.target.value))}

                    style={getSliderStyle(dailyFoodBudget, "200", "10000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium text-slate-700">Daily Activities Budget</label>
                    <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-300">
                      {formatCurrency(dailyActivitiesBudget)}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="20000"
                    step="100"
                    value={dailyActivitiesBudget}
                    onChange={(e) => setDailyActivitiesBudget(Number(e.target.value))}

                    style={getSliderStyle(dailyActivitiesBudget, "0", "20000")}
                    className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[#3b82f6] [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:bg-[#3b82f6] [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0"
                  />
                </div>
              </div>
            </div>

            {/* Additional Expenses Accordion */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <button
                onClick={() => setShowAdditional(!showAdditional)}
                className="w-full p-6 flex justify-between items-center font-bold text-slate-900 hover:bg-slate-50 transition-colors"
              >
                <span className="flex items-center gap-2 text-base">
                  <Compass className="w-5 h-5 text-blue-600" /> Additional Expenses (Shopping, Visa, Buffer)
                </span>
                {showAdditional ? <ChevronUp className="w-5 h-5 text-slate-500" /> : <ChevronDown className="w-5 h-5 text-slate-500" />}
              </button>

              {showAdditional && (
                <div className="p-6 pt-0 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Shopping & Souvenirs</label>
                    <CurrencyInput
                    value={shoppingBudget}
                    onValueChange={(val) => setShoppingBudget(val)}
                  />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Visa & Insurance (per person)</label>
                    <input
                      type="number"
                      step="500"
                      min="0"
                      value={visaInsurancePerPerson}
                      onChange={(e) => setVisaInsurancePerPerson(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Contingency Buffer (%)</label>
                    <select
                      value={contingencyBufferPercent}
                      onChange={(e) => setContingencyBufferPercent(Number(e.target.value))}
                      className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-blue-600"
                    >
                      <option value={5}>5% Buffer</option>
                      <option value={10}>10% Buffer (Recommended)</option>
                      <option value={15}>15% Buffer</option>
                      <option value={20}>20% Buffer</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Sticky Summary Card */}
          <div className="w-full lg:w-[380px]">
            <div className="bg-[#1e2a4f] rounded-2xl shadow-xl p-6 md:p-8 text-white sticky top-28 border border-slate-600/50">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-bold tracking-tight">Travel Budget Summary</h2>
                <button className="text-slate-400 hover:text-white transition-colors p-1" title="Share">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-8 bg-slate-800/80 p-5 rounded-2xl border border-slate-600">
                <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1">
                  {formatCurrency(totalTripBudget)}
                </div>
                <div className="text-slate-300 text-xs font-medium uppercase tracking-wider">Total Trip Budget</div>
              </div>

              <div className="space-y-4 border-t border-slate-600/60 pt-6">
                <div className="flex justify-between items-center text-sm font-semibold text-amber-400">
                  <span>Budget Breakdown</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Cost per Person</span>
                  <span className="font-semibold text-white">{formatCurrency(costPerPerson)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Daily Budget (Total)</span>
                  <span className="font-semibold text-white">{formatCurrency(dailyBudgetOverall)}</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-3 border-t border-slate-600/40">
                  <span className="text-slate-300">Accommodation</span>
                  <span className="font-semibold text-slate-200">{formatCurrency(totalAccommodation)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Transportation</span>
                  <span className="font-semibold text-slate-200">{formatCurrency(totalTransportation)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Food & Activities</span>
                  <span className="font-semibold text-slate-200">{formatCurrency(totalFood + totalActivities)}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-300">Emergency Buffer</span>
                  <span className="font-semibold text-emerald-400">{formatCurrency(contingencyBufferAmount)}</span>
                </div>
              </div>

              <button className="w-full py-2.5 px-4 bg-[#eaa33a] hover:bg-[#d4902d] text-white font-semibold rounded-xl transition-colors mt-6 flex justify-center items-center gap-2">
                Start Travel Planning <span aria-hidden="true">&rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Informational SEO & FAQs Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-slate-200">
          <div className="md:col-span-2 space-y-8 text-slate-700 text-sm md:text-base leading-relaxed">
            <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm">
              <h2 className="text-xl font-bold text-[#113262] mb-4">Understanding Travel Budget Planning</h2>
              <p className="text-slate-600 mb-4">
                Planning your travel budget is essential for a stress-free and enjoyable vacation. A well-structured travel budget ensures you can make the most of your trip without worrying about overspending or compromising on experiences.
              </p>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Key Benefits of Travel Budget Planning</h3>
              <ul className="list-disc pl-5 space-y-1.5 text-slate-600 mb-6">
                <li>Ensures financial preparedness for your dream vacation</li>
                <li>Helps manage travel expenses through proper planning</li>
                <li>Provides flexibility in choosing activities and accommodations</li>
                <li>Protects against unexpected travel costs and emergencies</li>
              </ul>

              <h3 className="text-lg font-semibold text-slate-900 mb-2">Essential Steps for Travel Budget Planning</h3>

              <div className="space-y-4 text-slate-600">
                <div>
                  <h4 className="font-bold text-slate-800">1. Destination Planning</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm mt-1">
                    <li>Research potential destinations and best times to visit</li>
                    <li>Estimate costs for flights, accommodations, and activities</li>
                    <li>Set realistic travel dates and duration</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800">2. Cost Breakdown</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm mt-1">
                    <li>Calculate transportation costs including flights and local travel</li>
                    <li>Account for accommodation expenses</li>
                    <li>Budget for food, activities, and shopping</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800">3. Saving Strategy</h4>
                  <ul className="list-disc pl-5 space-y-1 text-sm mt-1">
                    <li>Create a monthly savings plan</li>
                    <li>Start saving early to avoid financial strain</li>
                    <li>Consider travel insurance and emergency funds</li>
                  </ul>
                </div>
              </div>
            </section>

            <section className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <h2 className="text-2xl font-bold text-[#113262]">Frequently Asked Questions</h2>

              <div className="border-b border-slate-100 pb-5">
                <h3 className="font-bold text-slate-900 mb-2">How do I create a travel budget?</h3>
                <p className="text-slate-600 text-base">
                  Break down expenses: transport (40-50% of budget for international, 20-30% for domestic), accommodation (25-35%), food (15-20%), activities and sightseeing (10-15%), and shopping/miscellaneous (5-10%). Always add a 10% contingency buffer. Track actual spending against budget during the trip using a simple app.
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900 mb-2">How much should I budget for a domestic vacation?</h3>
                <p className="text-slate-600 text-base">
                  Goa/Kerala: Rs 15,000-40,000 per person (4-5 days). Rajasthan: Rs 20,000-50,000 per person (5-7 days). Himachal/Uttarakhand: Rs 10,000-30,000 per person (4-6 days). Northeast: Rs 25,000-60,000 per person (6-8 days). Costs vary significantly based on season, accommodation type, and travel mode.
                </p>
              </div>
            </section>
          </div>

          {/* Right Column: SEO Card */}
          <div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-slate-900 text-lg">Smart Travel Budgeting</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Select your destination type (domestic hill station, beach, heritage, or international), duration, and travel style (budget, mid-range, premium). The calculator provides a detailed budget breakdown across transport, stay, food, activities, and miscellaneous expenses. It also shows savings tips specific to your chosen destination.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

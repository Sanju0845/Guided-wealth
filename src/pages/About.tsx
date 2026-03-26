import React from 'react';
import { Quote, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PRICING_PLANS } from '../constants';
import { cn } from '../lib/utils';

export default function About() {
  return (
    <div className="pt-24 md:pt-32">
      {/* Hero */}
      <section className="section-padding bg-cream">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-6 md:space-y-8">
            <h1 className="text-4xl md:text-7xl font-bold text-primary uppercase leading-tight md:leading-none">
              About <br />
              <span className="text-accent">Guided Wealth</span>
            </h1>
            <div className="h-1 w-16 md:w-24 bg-accent rounded-full" />
            <div className="space-y-4 md:space-y-6 text-base md:text-lg text-ink/70 leading-relaxed">
              <p>
                Guided Wealthy was founded to help individuals and families take control of their financial future with clarity, confidence, and discipline. 
              </p>
              <p>
                We emphasize transparency, trust, and education. Instead of pushing products, we guide you to make informed decisions that align with your long-term vision. Our mission is to simplify the complex world of finance into actionable, personalized steps.
              </p>
            </div>
          </div>
          
          <div className="relative">
            <div className="curve-block shadow-2xl overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&q=80&w=1000" 
                alt="About Guided Wealth" 
                className="w-full h-auto"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 bg-primary text-cream p-4 md:p-8 hidden sm:block rounded-2xl md:rounded-3xl">
              <p className="text-2xl md:text-4xl font-serif font-bold">6+</p>
              <p className="text-[10px] md:text-xs uppercase tracking-widest opacity-70">Years of Trust</p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Section */}
      <section className="section-padding bg-cream">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2 text-center md:text-left">
            <p className="text-accent font-bold uppercase tracking-[0.3em] text-xs md:text-sm">Our Leadership</p>
            <h2 className="text-3xl md:text-5xl font-bold text-primary">Guided Wealthy</h2>
            <p className="text-ink/50 uppercase tracking-widest font-bold text-xs md:text-sm">Trusted Financial Experts</p>
          </div>

          <div className="relative py-6">
            <Quote className="absolute -top-2 -left-2 md:-top-6 md:-left-6 text-accent/20 w-10 h-10 md:w-16 md:h-16" />
            <p className="text-xl md:text-2xl font-serif italic text-primary leading-relaxed relative z-10">
              "Every individual plans his financial life as per his understanding and comfort level... what matters is personalizing / customizing the same knowledge and information to our situation."
            </p>
          </div>

          <div className="space-y-4 text-sm md:text-base text-ink/70">
            <p>
              Guided Wealthy brings over 6 years of experience in the financial sector, having navigated market cycles with discipline and consistency. Our approach centers on long-term thinking rather than chasing quick returns.
            </p>
            <p>
              We believe that financial freedom isn't about how much you earn, but how well you manage what you have. Our philosophy is built on the pillars of transparency and deep-rooted client relationships.
            </p>
          </div>
        </div>
      </section>

      {/* Philosophy */}
      <section className="section-padding bg-primary text-cream curve-block mx-6 md:mx-12 mb-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-bold uppercase tracking-widest mb-4">Our Philosophy</h2>
            <div className="h-1 w-20 bg-accent mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              "Keep financial planning simple and practical.",
              "Focus on goals, not just products.",
              "Build long-term strategies instead of short-term gains.",
              "Encourage informed and independent decision-making."
            ].map((text, idx) => (
              <div key={idx} className="space-y-4 text-center">
                <div className="w-12 h-12 bg-accent text-primary flex items-center justify-center mx-auto rounded-full font-bold">
                  {idx + 1}
                </div>
                <p className="text-lg font-serif italic opacity-80">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="section-padding bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold text-primary uppercase">Transparent Pricing</h2>
            <p className="text-ink/60 max-w-2xl mx-auto">Choose a plan that fits your current stage of wealth creation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRICING_PLANS.map((plan, idx) => (
              <div 
                key={idx}
                className={cn(
                  "p-10 flex flex-col border-2 transition-all curve-block",
                  plan.popular ? "bg-primary text-cream border-primary shadow-2xl scale-105 z-10" : "bg-cream text-primary border-primary/5 shadow-sm"
                )}
              >
                {plan.popular && (
                  <span className="bg-accent text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 self-start mb-6 rounded-full">
                    Most Popular
                  </span>
                )}
                <h3 className="text-2xl font-bold uppercase tracking-widest mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-4xl font-serif font-bold">{plan.price}</span>
                  <span className={cn("text-sm opacity-60", plan.popular ? "text-cream" : "text-ink")}>{plan.period}</span>
                </div>
                
                <ul className="space-y-4 mb-10 flex-grow">
                  {plan.features.map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3 text-sm">
                      <Check size={16} className={plan.popular ? "text-accent" : "text-primary"} />
                      <span className="opacity-80">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link 
                  to="/booking" 
                  className={cn(
                    "w-full py-4 font-bold uppercase tracking-widest text-center transition-all rounded-full",
                    plan.popular ? "bg-accent text-primary hover:bg-white" : "bg-primary text-cream hover:bg-accent hover:text-primary"
                  )}
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

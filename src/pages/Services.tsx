import React from 'react';
import { motion } from 'motion/react';
import { SERVICES, PRICING_PLANS } from '../constants';
import { Check, ArrowRight, Building2, Download } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Services() {
  const gridServices = SERVICES.slice(0, 9);
  const featuredService = SERVICES[9];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6 md:px-12 lg:px-24">
        <div className="max-w-7xl mx-auto space-y-8">
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs uppercase tracking-[0.4em] text-ink/40 font-bold"
          >
            Strategic Mastery
          </motion.p>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-bold tracking-tighter leading-[0.9] text-primary max-w-4xl"
          >
            Elevating Wealth <br /> into a Legacy.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-2xl text-ink/60 max-w-3xl font-medium leading-relaxed"
          >
            Our bespoke financial services are crafted for those who view wealth not just as a number, but as a vehicle for generational impact and personal freedom.
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-[#f9f9f9]">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <h2 className="text-4xl md:text-5xl font-bold text-primary border-b-4 border-accent pb-4">
              Our Specialized Services
            </h2>
            <p className="text-sm md:text-base italic text-ink/50 max-w-xs text-right leading-relaxed">
              "Wealth is the ability to fully experience life." — Curated strategies for every lifecycle.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridServices.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.05 }}
                viewport={{ once: true }}
                className="bg-white p-10 border border-ink/5 shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-8">
                  <span className="text-4xl grayscale group-hover:grayscale-0 transition-all duration-500">
                    {service.icon}
                  </span>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-accent bg-accent/10 px-3 py-1 rounded-full">
                    Standard Plan
                  </span>
                </div>

                <h3 className="text-xl font-bold text-primary mb-4 group-hover:text-accent transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-ink/60 leading-relaxed mb-8 flex-grow">
                  {service.description.split('.')[0]}.
                </p>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-ink/40">Key Deliverables</p>
                    <ul className="space-y-3">
                      {service.features.slice(0, 3).map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-start gap-3 text-xs text-ink/80 font-medium">
                          <div className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-ink/5 flex justify-end items-center">
                    <Link to="/booking" className="text-[10px] uppercase tracking-widest font-bold text-accent inline-flex items-center gap-2 group/link">
                      Learn More <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Service Section */}
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-primary text-cream relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 -skew-x-12 translate-x-1/2" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="w-20 h-20 bg-accent/20 rounded-3xl flex items-center justify-center text-4xl">
                {featuredService.icon}
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight">
                  {featuredService.title}
                </h2>
                <p className="text-xl text-cream/70 leading-relaxed max-w-xl">
                  {featuredService.description}
                </p>
              </div>
              <div className="space-y-4">
                <p className="text-[10px] uppercase tracking-widest font-bold text-accent">Key Deliverables</p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {featuredService.features.slice(0, 4).map((feature, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-3 text-sm text-cream/90 font-medium">
                      <Check size={16} className="text-accent mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <Link 
                to="/booking" 
                className="bg-accent text-primary px-12 py-6 rounded-full font-bold uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-2xl text-sm"
              >
                Start Planning Legacy
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-32 px-6 md:px-12 lg:px-24 bg-white text-center relative overflow-hidden">
        <div className="absolute bottom-0 right-0 opacity-5 pointer-events-none">
          <Building2 size={400} />
        </div>
        
        <div className="max-w-5xl mx-auto relative z-10 space-y-12">
          <h2 className="text-4xl md:text-7xl font-bold text-primary leading-[1.1] tracking-tighter">
            Secure Your Future with a Strategy Built for Your Legacy.
          </h2>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <Link 
              to="/booking" 
              className="bg-primary text-cream px-10 py-5 rounded-full font-bold uppercase tracking-widest text-sm hover:bg-accent hover:text-primary transition-all shadow-xl w-full md:w-auto"
            >
              Start Your Wealth Journey
            </Link>
            <button className="flex items-center gap-3 text-primary font-bold uppercase tracking-widest text-sm hover:text-accent transition-all group border-2 border-primary/10 px-10 py-5 rounded-full w-full md:w-auto justify-center">
              <Download size={20} className="group-hover:translate-y-1 transition-transform" />
              Download Firm Profile
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

// Helper for conditional classes
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}


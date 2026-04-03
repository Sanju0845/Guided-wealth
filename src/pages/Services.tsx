import React from 'react';
import { motion } from 'motion/react';
import { SERVICES, PRICING_PLANS } from '../constants';
import { Check, ArrowRight, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Services() {
  const gridServices = SERVICES;

  return (
    <div className="bg-cream">
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
      <section className="py-24 px-6 md:px-12 lg:px-24 bg-cream/50">
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
                className="bg-cream p-10 border border-ink/5 shadow-sm hover:shadow-2xl transition-all duration-500 group flex flex-col h-full rounded-xl"
              >
                <div className="flex justify-between items-start mb-8">
                  <img src={service.icon} alt={service.title} className="w-10 h-10 object-contain grayscale group-hover:grayscale-0 transition-all duration-500" />
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

      {/* Final CTA Section */}
      <section className="py-32 px-6 md:px-12 lg:px-24 bg-cream text-center relative overflow-hidden">
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


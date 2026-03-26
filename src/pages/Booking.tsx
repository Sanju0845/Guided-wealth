import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, Calendar, Clock, CheckCircle } from 'lucide-react';
import { SERVICES } from '../constants';

export default function Booking() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="pt-24 md:pt-32">
      <section className="section-padding bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Contact Info */}
            <div className="space-y-8 md:space-y-12">
              <div className="space-y-4 md:space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold text-primary uppercase leading-tight">
                  Ready to Transform <br />
                  <span className="text-accent">Your Future?</span>
                </h1>
                <p className="text-lg md:text-xl text-ink/70 leading-relaxed">
                  Take the first step towards financial clarity. Book a 20-minute free consultation with our team.
                </p>
              </div>

              <div className="space-y-6 md:space-y-8">
                <div className="flex items-start gap-4 md:gap-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary text-cream flex items-center justify-center flex-shrink-0 rounded-xl md:rounded-2xl">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs uppercase tracking-widest text-ink/40 font-bold mb-1">Email Us</p>
                    <p className="text-lg md:text-xl font-bold text-primary">nist359@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 md:gap-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary text-cream flex items-center justify-center flex-shrink-0 rounded-xl md:rounded-2xl">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs uppercase tracking-widest text-ink/40 font-bold mb-1">Call Us</p>
                    <p className="text-lg md:text-xl font-bold text-primary">+91 8655429715</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 md:gap-6">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-primary text-cream flex items-center justify-center flex-shrink-0 rounded-xl md:rounded-2xl">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs uppercase tracking-widest text-ink/40 font-bold mb-1">Location</p>
                    <p className="text-lg md:text-xl font-bold text-primary">Bld no 16, 3rd floor, AR layout, Banaswadi, Bangalore, 560043</p>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 bg-cream border-l-4 border-accent shadow-sm space-y-3 md:space-y-4 rounded-2xl md:rounded-3xl">
                <div className="flex items-center gap-3 text-primary">
                  <Calendar size={18} className="text-accent" />
                  <span className="font-bold uppercase tracking-widest text-xs md:text-sm">Flexible Scheduling</span>
                </div>
                <div className="flex items-center gap-3 text-primary">
                  <Clock size={18} className="text-accent" />
                  <span className="font-bold uppercase tracking-widest text-xs md:text-sm">20-Min Free Session</span>
                </div>
              </div>
            </div>

            {/* Booking Form */}
            <div className="bg-cream p-6 md:p-12 shadow-2xl border border-primary/5 curve-block">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-12 md:py-20">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-primary text-accent rounded-full flex items-center justify-center mb-4">
                    <CheckCircle size={40} />
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-primary uppercase">Request Received</h2>
                  <p className="text-sm md:text-base text-ink/60 max-w-xs">
                    Thank you for reaching out. We will contact you within 24 hours to confirm your session.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="text-xs md:text-sm text-primary font-bold uppercase tracking-widest border-b-2 border-accent hover:text-accent transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                  <div className="space-y-1 md:space-y-2">
                    <label className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-ink/50">Full Name</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-cream border border-primary/10 p-3 md:p-4 outline-none focus:border-accent transition-colors rounded-xl md:rounded-2xl text-sm md:text-base"
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-1 md:space-y-2">
                    <label className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-ink/50">Email Address</label>
                    <input 
                      required
                      type="email" 
                      className="w-full bg-cream border border-primary/10 p-3 md:p-4 outline-none focus:border-accent transition-colors rounded-xl md:rounded-2xl text-sm md:text-base"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div className="space-y-1 md:space-y-2">
                    <label className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-ink/50">Service Interested In</label>
                    <select className="w-full bg-cream border border-primary/10 p-3 md:p-4 outline-none focus:border-accent transition-colors appearance-none rounded-xl md:rounded-2xl text-sm md:text-base">
                      <option>Select a Service</option>
                      {SERVICES.map(s => (
                        <option key={s.id} value={s.id}>{s.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1 md:space-y-2">
                    <label className="text-[10px] md:text-xs uppercase tracking-widest font-bold text-ink/50">Your Message</label>
                    <textarea 
                      rows={4}
                      className="w-full bg-cream border border-primary/10 p-3 md:p-4 outline-none focus:border-accent transition-colors resize-none rounded-xl md:rounded-2xl text-sm md:text-base"
                      placeholder="Tell us about your financial goals..."
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-primary text-cream py-4 md:py-5 font-bold uppercase tracking-[0.2em] md:tracking-[0.3em] hover:bg-accent hover:text-primary transition-all flex items-center justify-center gap-3 rounded-full text-sm md:text-base"
                  >
                    Send Request <Send size={18} />
                  </button>
                  
                  <p className="text-[9px] md:text-[10px] text-center text-ink/40 uppercase tracking-widest">
                    By submitting, you agree to our privacy policy and terms of service.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

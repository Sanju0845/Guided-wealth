import React, { useEffect } from 'react';
import { Mail, Phone, MapPin, Calendar, Clock } from 'lucide-react';

export default function Booking() {
  useEffect(() => {
    // Load Calendly widget script
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      const existingScript = document.querySelector('script[src="https://assets.calendly.com/assets/external/widget.js"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

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

            {/* Calendly Booking Block */}
            <div className="curve-block h-[650px] md:h-[750px] overflow-hidden">
              <div 
                className="calendly-inline-widget w-full h-full"
                data-url="https://calendly.com/guidedwealthy2026/30min"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

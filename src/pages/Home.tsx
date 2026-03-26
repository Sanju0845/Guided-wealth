import React from 'react';
import { ArrowRight, CheckCircle2, TrendingUp, Users, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TESTIMONIALS, FAQS } from '../constants';

export default function Home() {
  const testimonialsDoubled = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-16 md:pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://media.istockphoto.com/id/1346853640/photo/saving-money-concept-man-hand-putting-row-and-coin-write-finance-saving-money-concept-man.jpg?s=612x612&w=0&k=20&c=1I48V9GUU0liAJ-dMA4SW-h5LoejkBTlEZJ-0b_vmXE=" 
            alt="Financial Growth" 
            className="w-full h-full object-cover opacity-20"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-cream/50 via-cream/80 to-cream" />
        </div>

        <div className="section-padding relative z-10 w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            <div className="space-y-6 md:space-y-8 text-center lg:text-left">
              <span className="inline-block bg-primary/10 text-primary px-4 py-1 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] rounded-full">
                Trusted Financial Planning
              </span>
              <div className="space-y-2">
                <h1 className="text-4xl md:text-7xl font-bold leading-tight text-primary">
                  WELCOME TO <br />
                  <span className="text-accent">GUIDED WEALTHY</span>
                </h1>
              </div>
              <p className="text-base md:text-xl text-ink/70 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Every individual plans their financial life as per their understanding. What matters is personalizing that knowledge to your unique situation.
              </p>

              <div className="grid grid-cols-2 gap-4 md:gap-8 pt-8 md:pt-12 border-t border-primary/10">
                <div>
                  <p className="text-2xl md:text-4xl font-serif font-bold text-primary">6+</p>
                  <p className="text-[10px] md:text-xs uppercase tracking-widest text-ink/50 font-bold">Years Experience</p>
                </div>
                <div>
                  <p className="text-2xl md:text-4xl font-serif font-bold text-primary">500+</p>
                  <p className="text-[10px] md:text-xs uppercase tracking-widest text-ink/50 font-bold">Clients Guided</p>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block -mt-8">
              <div className="relative z-10 curve-block shadow-2xl border-8 border-white">
                <img 
                  src="https://media.istockphoto.com/id/1346853640/photo/saving-money-concept-man-hand-putting-row-and-coin-write-finance-saving-money-concept-man.jpg?s=612x612&w=0&k=20&c=1I48V9GUU0liAJ-dMA4SW-h5LoejkBTlEZJ-0b_vmXE=" 
                  alt="Consultation" 
                  className="w-full h-auto"
                  referrerPolicy="no-referrer"
                />
              </div>
              
              <div className="absolute -bottom-10 -left-10 z-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />

              <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-center">
                <Link to="/booking" className="btn-primary flex items-center justify-center gap-2 text-sm md:text-base">
                  Start Your Journey <ArrowRight size={18} />
                </Link>
                <Link to="/services" className="btn-secondary flex items-center justify-center text-sm md:text-base">
                  Explore Services
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="section-padding bg-primary text-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter">Our Proven Process</h2>
            <div className="h-1 w-24 bg-accent mx-auto rounded-full" />
            <p className="text-cream/70 max-w-2xl mx-auto text-lg">
              A systematic approach to building and preserving your wealth over generations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Discovery', desc: 'We begin by understanding your current financial situation, goals, and risk tolerance.' },
              { step: '02', title: 'Strategy', desc: 'Our experts craft a personalized financial roadmap tailored to your unique objectives.' },
              { step: '03', title: 'Implementation', desc: 'We execute the plan with precision, ensuring every detail is optimized for growth.' },
              { step: '04', title: 'Monitoring', desc: 'Continuous review and adjustments to keep your wealth on the right track.' },
            ].map((item, idx) => (
              <div 
                key={idx}
                className="p-8 curve-block border border-white/10 bg-white/5 hover:bg-white/10 transition-all group"
              >
                <span className="text-5xl font-serif font-bold text-accent/20 group-hover:text-accent/40 transition-colors">
                  {item.step}
                </span>
                <h3 className="text-2xl font-bold mt-4 mb-4">{item.title}</h3>
                <p className="text-cream/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who We Help */}
      <section className="section-padding bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4">Who We Help</h2>
            <p className="text-ink/60 text-lg">Tailored financial guidance for every stage of life</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Young Professionals', desc: 'Building a strong foundation for long-term wealth creation.' },
              { title: 'Growing Families', desc: 'Securing your children\'s future and your own retirement.' },
              { title: 'Business Owners', desc: 'Integrating personal wealth with business success.' },
              { title: 'Pre-Retirees', desc: 'Ensuring a smooth transition to a worry-free retirement.' }
            ].map((item, idx) => (
              <div key={idx} className="p-8 bg-cream rounded-[2rem] border border-primary/5 hover:shadow-xl transition-all">
                <h3 className="text-xl font-bold text-primary mb-3">{item.title}</h3>
                <p className="text-ink/70 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Guided Wealthy */}
      <section className="section-padding bg-cream">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-primary leading-tight">Why Choose <br /><span className="text-accent">Guided Wealthy?</span></h2>
              <div className="space-y-6">
                {[
                  { title: '6+ Years of Expertise', desc: 'Deep market knowledge and proven strategies.' },
                  { title: '500+ Families Guided', desc: 'A track record of trust and successful outcomes.' },
                  { title: 'Personalized Strategy', desc: 'No cookie-cutter plans. Your goals are unique.' },
                  { title: 'Transparent & Ethical', desc: 'Honest advice with your best interests at heart.' }
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="mt-1">
                      <CheckCircle2 className="text-accent" size={24} />
                    </div>
                    <div>
                      <h4 className="font-bold text-primary text-lg">{item.title}</h4>
                      <p className="text-ink/60 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="curve-block shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&q=80&w=800" 
                  alt="Financial Trust" 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problems We Solve */}
      <section className="section-padding bg-primary text-cream">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Are You Facing These?</h2>
            <p className="text-cream/70 text-lg">We provide clarity where there is confusion</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              "I have investments but no clear direction or goal-based plan.",
              "I'm worried about my family's financial security in my absence.",
              "I find financial jargon too complex to make confident decisions.",
              "I want to retire early but don't know if my current savings are enough."
            ].map((problem, idx) => (
              <div key={idx} className="flex gap-4 p-6 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-accent font-bold text-xl">?</div>
                <p className="text-lg font-medium">{problem}</p>
              </div>
            ))}
          </div>
          <div className="mt-12 text-center px-4">
            <Link to="/booking" className="btn-secondary !border-accent !text-accent hover:!bg-accent hover:!text-primary w-full sm:w-auto inline-block">
              Let's Solve Them Together
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="section-padding text-primary text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-4xl md:text-6xl font-bold uppercase leading-tight">
            Ready to Build Your <br /> Financial Legacy?
          </h2>
          <p className="text-xl font-bold">
            Join 500+ families who have secured their future with Guided Wealthy.
          </p>
          <div className="pt-4">
            <Link to="/booking" className="bg-primary text-cream px-12 py-4 rounded-full font-bold uppercase tracking-[0.3em] hover:bg-opacity-90 transition-all inline-block">
              Secure Your Slot
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 bg-cream border-y-2 border-primary/20 overflow-hidden w-full">
        <div className="max-w-7xl mx-auto text-center mb-12 px-4">
          <h2 className="text-5xl md:text-6xl font-bold text-primary mb-6">What Our Clients Say</h2>
          <p className="text-ink/60 text-lg max-w-2xl mx-auto">Real experiences from people who secured their financial future</p>
        </div>

        <div className="relative w-full overflow-hidden">
          <div className="infinite-scroll">
            {testimonialsDoubled.map((t, idx) => (
              <div key={`${t.id}-${idx}`} className="testimonial-card">
                <div>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="initial-avatar">
                      {t.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-primary">{t.name}</p>
                      <p className="text-xs text-ink/50 uppercase tracking-widest">{t.role}</p>
                    </div>
                  </div>
                  <p className="text-ink/70 text-sm leading-relaxed text-left italic">"{t.content}"</p>
                </div>
                <div className="flex text-accent gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-lg">★</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section-padding bg-cream">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Frequently Asked Questions</h2>
            <div className="h-1 w-20 bg-accent mx-auto rounded-full" />
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, idx) => (
              <details key={idx} className="group border-b border-primary/10 pb-4">
                <summary className="flex justify-between items-center cursor-pointer list-none py-4">
                  <h3 className="text-xl font-bold text-primary group-hover:text-accent transition-colors">
                    {faq.question}
                  </h3>
                  <ChevronDown className="text-primary group-open:rotate-180 transition-transform" />
                </summary>
                <p className="text-ink/70 leading-relaxed pl-2 pb-4 whitespace-pre-line">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

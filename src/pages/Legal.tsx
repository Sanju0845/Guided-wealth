import React from 'react';
import { Scale, AlertTriangle, Copyright, FileWarning } from 'lucide-react';

export default function Legal() {
  return (
    <div className="pt-24 md:pt-32 bg-cream min-h-screen">
      {/* Hero */}
      <section className="section-padding bg-primary text-cream">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-red-500/20 px-4 py-2 rounded-full">
            <Scale size={18} className="text-red-300" />
            <span className="text-xs uppercase tracking-widest font-bold">Important Notice</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tight">
            Legal Notice
          </h1>
          <p className="text-cream/70 text-lg max-w-2xl mx-auto">
            Terms of use, copyright protection, and legal disclaimers for Guided Wealthy.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-cream">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Copyright Warning */}
          <div className="bg-red-50 border-2 border-red-200 p-8 rounded-2xl space-y-4">
            <div className="flex items-center gap-3">
              <Copyright className="text-red-600" size={28} />
              <h2 className="text-2xl font-bold text-red-700">Strict Copyright Notice</h2>
            </div>
            <div className="space-y-4 text-ink/80">
              <p className="leading-relaxed font-medium text-red-700">
                NO COPY OF THIS WEBSITE IS PERMITTED UNDER ANY CIRCUMSTANCES.
              </p>
              <p className="leading-relaxed">
                This website and all its contents, including but not limited to text, graphics, logos, icons, images, audio clips, video clips, digital downloads, data compilations, software, and source code, are the exclusive property of <strong>Guided Wealthy</strong> and are protected by Indian and international copyright laws.
              </p>
              <div className="bg-white p-6 rounded-xl border border-red-200 space-y-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="text-red-600" size={20} />
                  <span className="font-bold text-red-700">WARNING</span>
                </div>
                <p className="text-sm leading-relaxed">
                  In case any copying, reproduction, duplication, modification, distribution, or tampering of this website or its source code is found, we will take <strong>STRICT LEGAL ACTION</strong> including but not limited to civil lawsuits for damages and criminal prosecution to the fullest extent permitted by law.
                </p>
              </div>
              <p className="leading-relaxed">
                This website is <strong>SOLELY DEDICATED</strong> to Guided Wealthy business operations. <strong>NO OTHERS</strong> can have any rights to copy, edit, tamper with, or use the site or its source codes for any purpose whatsoever.
              </p>
            </div>
          </div>

          {/* Intellectual Property */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <FileWarning className="text-accent" size={24} />
              <h2 className="text-2xl font-bold text-primary">Intellectual Property Rights</h2>
            </div>
            <p className="text-ink/70 leading-relaxed">
              All content included on this site, such as text, graphics, logos, button icons, images, audio clips, digital downloads, data compilations, and software, is the property of Guided Wealthy or its content suppliers and protected by international copyright and intellectual property laws.
            </p>
            <p className="text-ink/70 leading-relaxed">
              The compilation of all content on this site is the exclusive property of Guided Wealthy and protected by international copyright laws. All software used on this site is the property of Guided Wealthy or its software suppliers and protected by international copyright laws.
            </p>
          </div>

          {/* Terms of Use */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">Terms of Use</h2>
            <p className="text-ink/70 leading-relaxed">
              By accessing this website, you agree to be bound by these Terms of Use. If you do not agree with any of these terms, you are prohibited from using or accessing this site.
            </p>
            <ul className="space-y-3 text-ink/70 ml-6">
              <li className="list-disc">You may not copy, modify, reproduce, republish, upload, post, transmit, or distribute any portion of this website without prior written consent from Guided Wealthy.</li>
              <li className="list-disc">You may not use any meta tags or any other "hidden text" utilizing Guided Wealthy's name or trademarks without our express written consent.</li>
              <li className="list-disc">Any unauthorized use terminates the permission or license granted by Guided Wealthy.</li>
              <li className="list-disc">You may not use this website for any unlawful purpose or to solicit others to perform or participate in any unlawful acts.</li>
            </ul>
          </div>

          {/* Investment Disclaimer */}
          <div className="bg-amber-50 border border-amber-200 p-8 rounded-2xl space-y-4">
            <h2 className="text-2xl font-bold text-amber-800">Investment Disclaimer</h2>
            <p className="text-ink/70 leading-relaxed">
              The information provided on this website is for general informational and educational purposes only and does not constitute financial advice, investment recommendations, or an offer to sell or a solicitation of an offer to buy any securities or financial instruments.
            </p>
            <p className="text-ink/70 leading-relaxed">
              Investments in securities markets are subject to market risks. Please read all related documents carefully before making any investment decisions. Past performance is not indicative of future returns.
            </p>
            <p className="text-ink/70 leading-relaxed">
              Registration, certifications, or past experience do not guarantee future performance or returns. All investments involve risk, and the possible loss of principal.
            </p>
          </div>

          {/* Legal Action Statement */}
          <div className="bg-primary text-cream p-8 rounded-2xl space-y-4">
            <h2 className="text-2xl font-bold uppercase tracking-wide">Legal Enforcement</h2>
            <p className="text-cream/80 leading-relaxed">
              Guided Wealthy reserves the right to take all necessary legal action to protect its intellectual property rights, including but not limited to:
            </p>
            <ul className="space-y-2 text-cream/80 ml-6">
              <li className="list-disc">Filing civil lawsuits for damages and injunctive relief</li>
              <li className="list-disc">Pursuing criminal prosecution for copyright infringement</li>
              <li className="list-disc">Seeking statutory damages under applicable copyright laws</li>
              <li className="list-disc">Reporting violations to appropriate regulatory authorities</li>
            </ul>
            <p className="text-cream/80 leading-relaxed pt-4 font-medium">
              Any person or entity found to be in violation of these terms will be prosecuted to the maximum extent possible under the law.
            </p>
          </div>

          {/* Governing Law */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">Governing Law</h2>
            <p className="text-ink/70 leading-relaxed">
              These terms and conditions are governed by and construed in accordance with the laws of India. Any disputes relating to these terms and conditions shall be subject to the exclusive jurisdiction of the courts of Bangalore, Karnataka, India.
            </p>
          </div>

          {/* Contact */}
          <div className="bg-primary/5 p-8 rounded-2xl space-y-4">
            <h2 className="text-2xl font-bold text-primary">Legal Contact</h2>
            <p className="text-ink/70 leading-relaxed">
              For any legal inquiries or to report violations, please contact:
            </p>
            <div className="space-y-2 text-ink/70">
              <p><strong>Guided Wealthy</strong></p>
              <p>Email: guidedwealthy@gmail.com</p>
              <p>Phone: +91 8655429715</p>
              <p>Address: Bld no 16, 3rd floor, AR layout, Banaswadi, Bangalore, 560043</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

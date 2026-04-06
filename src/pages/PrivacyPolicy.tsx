import React from 'react';
import { Shield, Lock, Eye, Database } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="pt-24 md:pt-32 bg-cream min-h-screen">
      {/* Hero */}
      <section className="section-padding bg-primary text-cream">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-accent/20 px-4 py-2 rounded-full">
            <Shield size={18} className="text-accent" />
            <span className="text-xs uppercase tracking-widest font-bold">Your Data Matters</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold uppercase tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-cream/70 text-lg max-w-2xl mx-auto">
            At Guided Wealthy, we are committed to protecting your personal information and maintaining your trust.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="section-padding bg-cream">
        <div className="max-w-4xl mx-auto space-y-12">
          {/* Introduction */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-primary">Introduction</h2>
            <p className="text-ink/70 leading-relaxed">
              Guided Wealthy ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
            </p>
          </div>

          {/* Information We Collect */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Database className="text-accent" size={24} />
              <h2 className="text-2xl font-bold text-primary">Information We Collect</h2>
            </div>
            <p className="text-ink/70 leading-relaxed">
              We may collect information about you in a variety of ways. The information we may collect on the Site includes:
            </p>
            <ul className="space-y-3 text-ink/70 ml-6">
              <li className="list-disc"><strong>Personal Data:</strong> Personally identifiable information, such as your name, email address, phone number, and demographic information that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site.</li>
              <li className="list-disc"><strong>Financial Data:</strong> Financial information such as your income, expenses, assets, liabilities, investment preferences, and financial goals that you provide for financial planning purposes.</li>
              <li className="list-disc"><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, browser type, operating system, access times, and the pages you have viewed.</li>
            </ul>
          </div>

          {/* Use of Information */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Eye className="text-accent" size={24} />
              <h2 className="text-2xl font-bold text-primary">Use of Your Information</h2>
            </div>
            <p className="text-ink/70 leading-relaxed">
              Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
            </p>
            <ul className="space-y-2 text-ink/70 ml-6">
              <li className="list-disc">Create and manage your account</li>
              <li className="list-disc">Provide personalized financial planning and advisory services</li>
              <li className="list-disc">Email you regarding your account or financial planning services</li>
              <li className="list-disc">Monitor and analyze usage and trends to improve your experience</li>
              <li className="list-disc">Notify you of updates to the Site and services</li>
              <li className="list-disc">Perform other business activities as needed</li>
            </ul>
          </div>

          {/* Security */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Lock className="text-accent" size={24} />
              <h2 className="text-2xl font-bold text-primary">Security of Your Information</h2>
            </div>
            <p className="text-ink/70 leading-relaxed">
              We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse.
            </p>
          </div>

          {/* Contact */}
          <div className="bg-primary/5 p-8 rounded-2xl space-y-4">
            <h2 className="text-2xl font-bold text-primary">Contact Us</h2>
            <p className="text-ink/70 leading-relaxed">
              If you have questions or comments about this Privacy Policy, please contact us at:
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

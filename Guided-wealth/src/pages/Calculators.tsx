import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Search } from 'lucide-react';
import * as Icons from 'lucide-react';

import { calculatorData } from '../constants/calculatorData';

export default function Calculators() {
    const [searchParams] = useSearchParams();
    const [searchQuery, setSearchQuery] = useState('');

    const sectionTitle = searchParams.get('title') || searchParams.get('calc') || 'All Calculators';

    useEffect(() => {
        if (sectionTitle && sectionTitle !== 'All Calculators') {
            setTimeout(() => {
                const elementId = sectionTitle.toLowerCase().replace(/\s+/g, '-');
                const element = document.getElementById(elementId);
                if (element) {
                    const yOffset = -140;
                    const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            }, 100);
        }
    }, [sectionTitle]);

    const filteredData = calculatorData.map(section => ({
        ...section,
        items: section.items.filter(item => 
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            item.desc.toLowerCase().includes(searchQuery.toLowerCase())
        )
    })).filter(section => section.items.length > 0);

    return (
        <div className="bg-slate-50 min-h-screen pt-32 md:pt-36 pb-24 px-6 md:px-12 lg:px-20 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Top Bar Navigation & Search Input */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
                    <Link
                        to="/resources"
                        className="inline-flex items-center text-[#c08226] hover:text-[#a0681a] font-medium text-sm md:text-base transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Resources
                    </Link>

                    <div className="relative w-full sm:w-80">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search calculators..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 shadow-xs transition-all placeholder:text-slate-400"
                        />
                    </div>
                </div>

                {/* Centered Main Hero Header */}
                <div className="text-center mb-14">
                    <h1 className="text-4xl md:text-5xl font-bold text-[#113262] tracking-tight relative inline-block">
                        Calculators
                        <span className="block w-24 md:w-28 h-1 bg-gradient-to-r from-transparent via-[#113262] to-transparent mx-auto mt-2 rounded-full opacity-80" />
                    </h1>
                    <p className="text-slate-500 text-base md:text-lg mt-4 max-w-xl mx-auto font-normal">
                        Try our free calculators to plan your finances and investments
                    </p>
                </div>

                {/* Sections */}
                <div className="space-y-16">
                    {filteredData.map((section, index) => (
                        <div key={index} id={section.title.toLowerCase().replace(/\s+/g, '-')}>
                            <h2 className="text-xl md:text-2xl font-semibold text-[#c08226] tracking-tight mb-6">
                                {section.title}
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {section.items.map((item, idx) => {
                                    const IconComponent = (Icons as any)[item.icon] || Icons.Calculator;
                                    return (
                                        <Link 
                                            key={idx} 
                                            to={`/calculators/${item.slug}`} 
                                            className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-100 transition-all group flex flex-col h-full"
                                        >
                                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-100 transition-colors">
                                                <IconComponent className="w-6 h-6 text-[#113262]" />
                                            </div>
                                            <h3 className="text-lg font-semibold text-slate-800 mb-2 group-hover:text-[#113262] transition-colors">
                                                {item.name}
                                            </h3>
                                            <p className="text-slate-500 text-sm leading-relaxed flex-grow">
                                                {item.desc}
                                            </p>
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                    {filteredData.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-slate-500 text-lg">No calculators found matching your search.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


import React, { useState } from 'react';
import { Sparkles, BrainCircuit, Target, CheckCircle2 } from 'lucide-react';
import { getAIInsights } from '../services/geminiService';

const AIInsights: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const handleAnalysis = async () => {
        setLoading(true);
        const text = await getAIInsights("Eleanor Vance", "Senior candidate with deep React knowledge and leadership experience in fintech.");
        setResult(text);
        setLoading(false);
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#333333] text-white p-12 rounded-2xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <BrainCircuit size={180} />
                </div>
                <div className="relative z-10 max-w-2xl">
                    <div className="flex items-center gap-2 text-gold font-bold text-xs uppercase tracking-widest mb-4">
                        <Sparkles size={16} />
                        Intelligence Engine
                    </div>
                    <h1 className="text-4xl font-bold serif mb-4">AI Candidate Insights</h1>
                    <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                        Leverage Gemini Pro to analyze complex candidate data, generate employer pitches, 
                        and calculate hyper-accurate role matching scores across your talent pool.
                    </p>
                    <div className="flex gap-4">
                        <button 
                            onClick={handleAnalysis}
                            disabled={loading}
                            className="px-8 py-3 bg-gold text-white rounded-lg font-bold hover:bg-[#B8860B] transition-all flex items-center gap-2 disabled:opacity-50"
                        >
                            {loading ? "Processing..." : "Run Analysis for Top Picks"}
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white border border-[#E8E4D9] p-8 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <Target className="gold-accent" />
                        <h2 className="text-xl font-bold serif">Matching Parameters</h2>
                    </div>
                    <div className="space-y-4">
                        {[
                            { label: "Technical Alignment", val: "High", desc: "Skills match 85% of job description requirements." },
                            { label: "Experience Seniority", val: "Exact", desc: "Candidate matches the 7+ year seniority requested." },
                            { label: "Cultural Resonance", val: "Optimal", desc: "Past company sizes align with hiring firm profile." }
                        ].map((p, i) => (
                            <div key={i} className="p-4 bg-[#F9F8F3] rounded-lg">
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">{p.label}</span>
                                    <span className="text-xs font-bold gold-accent">{p.val}</span>
                                </div>
                                <p className="text-xs text-gray-600">{p.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white border border-[#E8E4D9] p-8 rounded-xl shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                        <BrainCircuit className="gold-accent" />
                        <h2 className="text-xl font-bold serif">AI Recommendations</h2>
                    </div>
                    {loading ? (
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-100 rounded animate-pulse w-full"></div>
                            <div className="h-4 bg-gray-100 rounded animate-pulse w-5/6"></div>
                            <div className="h-4 bg-gray-100 rounded animate-pulse w-4/6"></div>
                        </div>
                    ) : result ? (
                        <div className="space-y-4">
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{result}</p>
                            <div className="flex gap-2 pt-4">
                                <button className="flex-1 py-2 bg-black text-white rounded text-xs font-bold">Copy to Email</button>
                                <button className="flex-1 py-2 border border-black rounded text-xs font-bold">Draft Offer</button>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-12 text-gray-400">
                            <BrainCircuit size={48} className="mx-auto mb-4 opacity-20" />
                            <p className="text-sm italic">Select a candidate to generate AI-driven insights.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AIInsights;

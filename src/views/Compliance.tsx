
import React from 'react';
import { ShieldAlert, CheckCircle, FileCheck, Info } from 'lucide-react';

const Compliance: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold serif tracking-tight">Compliance & Data Protection</h1>
        <p className="text-sm text-gray-500 mt-1">Regulatory standards for recruitment in Kenya</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-[#E8E4D9] p-8 rounded-xl shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <ShieldAlert className="gold-accent" />
            <h2 className="text-xl font-bold serif">Data Protection Act 2019</h2>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            As a data controller, Renew Rehoboth adheres to the Kenya Data Protection Act. Candidate information is handled with strict confidentiality.
          </p>
          <ul className="space-y-3">
            {[
              "Encryption of sensitive candidate documents",
              "Right to be forgotten implementation",
              "Strict data access audit logs",
              "Consent-based data processing"
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-2 text-xs font-medium text-gray-700">
                <CheckCircle size={14} className="text-green-600" /> {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white border border-[#E8E4D9] p-8 rounded-xl shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <FileCheck className="gold-accent" />
            <h2 className="text-xl font-bold serif">KYC & Verification</h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-[#F9F8F3] rounded-lg border border-[#E8E4D9]">
              <div className="flex items-center gap-2 mb-2">
                <Info size={14} className="gold-accent" />
                <span className="text-xs font-bold uppercase">Background Checks</span>
              </div>
              <p className="text-[11px] text-gray-500 italic">
                All candidates placed by Renew Rehoboth undergo verification of academic credentials and previous employment history via our verified vendors.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 border border-[#E8E4D9] rounded-lg">
                <p className="text-2xl font-bold serif">100%</p>
                <p className="text-[10px] uppercase font-bold text-gray-400">Verified Rate</p>
              </div>
              <div className="text-center p-4 border border-[#E8E4D9] rounded-lg">
                <p className="text-2xl font-bold serif">24h</p>
                <p className="text-[10px] uppercase font-bold text-gray-400">Audit Turnaround</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compliance;

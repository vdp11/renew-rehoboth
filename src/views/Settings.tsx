
import React, { useState } from 'react';
import { Palette, Bell, Globe, Key, Save, CheckCircle2 } from 'lucide-react';

type SettingsTab = 'branding' | 'notifications' | 'regional' | 'api';

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('branding');
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'branding':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-300">
            <section className="space-y-4">
              <h3 className="text-lg font-bold serif">Agency Branding</h3>
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block">Company Name</label>
                  <input className="w-full p-2 bg-[#F9F8F3] border border-[#E8E4D9] rounded-lg text-sm font-medium outline-none focus:border-gold" defaultValue="Renew Rehoboth" />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block">Tagline</label>
                  <input className="w-full p-2 bg-[#F9F8F3] border border-[#E8E4D9] rounded-lg text-sm font-medium outline-none focus:border-gold" defaultValue="Restore. Engage. Navigate." />
                </div>
              </div>
            </section>
            <section className="space-y-4">
              <h3 className="text-lg font-bold serif">Visual Identity</h3>
              <p className="text-xs text-gray-500">Selected theme: Premium Gold & Cream</p>
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-cream border-2 border-gold cursor-pointer flex items-center justify-center shadow-lg">
                  <div className="w-4 h-4 rounded-full bg-gold"></div>
                </div>
                <div className="w-12 h-12 rounded-full bg-slate-900 border border-[#E8E4D9] cursor-pointer hover:scale-110 transition-transform"></div>
                <div className="w-12 h-12 rounded-full bg-blue-900 border border-[#E8E4D9] cursor-pointer hover:scale-110 transition-transform"></div>
              </div>
            </section>
          </div>
        );
      case 'notifications':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-300">
            <h3 className="text-lg font-bold serif">Notification Preferences</h3>
            <div className="space-y-4">
              {[
                { title: 'New Application', desc: 'Notify recruiters when a candidate applies.' },
                { title: 'Interview Reminders', desc: 'Send alerts 2 hours before scheduled interviews.' },
                { title: 'Placement Alerts', desc: 'Notify management when a fee is generated.' }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-[#E8E4D9] rounded-xl hover:bg-[#F9F8F3] transition-colors">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{item.title}</p>
                    <p className="text-xs text-gray-500">{item.desc}</p>
                  </div>
                  <div className="w-10 h-6 bg-gold rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'regional':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-300">
            <h3 className="text-lg font-bold serif">Regional & Localization</h3>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block">Currency Display</label>
                <select className="w-full p-2 bg-[#F9F8F3] border border-[#E8E4D9] rounded-lg text-sm font-medium outline-none">
                  <option>KES - Kenyan Shilling</option>
                  <option>USD - US Dollar</option>
                  <option>GBP - British Pound</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] uppercase font-bold text-gray-400 mb-2 block">Timezone</label>
                <select className="w-full p-2 bg-[#F9F8F3] border border-[#E8E4D9] rounded-lg text-sm font-medium outline-none">
                  <option>(GMT+03:00) Nairobi</option>
                  <option>(GMT+00:00) London</option>
                  <option>(GMT-05:00) New York</option>
                </select>
              </div>
            </div>
          </div>
        );
      case 'api':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-300">
            <h3 className="text-lg font-bold serif">API & Integrations</h3>
            <div className="p-6 bg-black text-white rounded-xl space-y-4 border border-white/10">
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold text-gold uppercase tracking-widest">Public API Key</p>
                <button className="text-[10px] text-gray-400 hover:text-white underline">Regenerate</button>
              </div>
              <code className="block bg-white/5 p-3 rounded text-xs font-mono break-all opacity-80">
                rehoboth_pk_live_51Mv9WkL1yZ2A7u8qX6T4N2J9I0B5
              </code>
              <p className="text-[10px] text-gray-500">Use this key to integrate Renew Rehoboth with external job boards.</p>
            </div>
            <div className="space-y-4">
              <p className="text-xs font-bold uppercase text-gray-400">Connected Services</p>
              <div className="flex items-center gap-4 p-4 border border-[#E8E4D9] rounded-xl">
                <div className="w-10 h-10 bg-blue-50 rounded flex items-center justify-center text-blue-600 font-bold">L</div>
                <div>
                  <p className="text-sm font-bold">LinkedIn Recruiter</p>
                  <p className="text-[10px] text-green-600 font-bold uppercase">Connected</p>
                </div>
              </div>
            </div>
          </div>
        );
    }
  };

  const SidebarBtn = ({ id, icon: Icon, label }: { id: SettingsTab, icon: any, label: string }) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-bold transition-all ${activeTab === id ? 'bg-white border border-[#E8E4D9] gold-accent shadow-sm' : 'text-gray-500 hover:bg-white/50'}`}
    >
      <Icon size={18} /> {label}
    </button>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold serif tracking-tight">System Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure global parameters and agency branding</p>
        </div>
        {isSaved && (
          <div className="flex items-center gap-2 text-green-600 font-bold text-xs animate-in slide-in-from-top-4">
            <CheckCircle2 size={16} /> Changes Saved Successfully
          </div>
        )}
      </div>

      <div className="bg-white border border-[#E8E4D9] rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-4 min-h-[500px]">
          <div className="border-r border-[#E8E4D9] bg-[#F9F8F3] p-4 space-y-1">
            <SidebarBtn id="branding" icon={Palette} label="Agency Branding" />
            <SidebarBtn id="notifications" icon={Bell} label="Notifications" />
            <SidebarBtn id="regional" icon={Globe} label="Regional Formats" />
            <SidebarBtn id="api" icon={Key} label="API & Integrations" />
          </div>
          
          <div className="col-span-3 p-10 flex flex-col justify-between">
            <div>
              {renderContent()}
            </div>

            <div className="pt-8 border-t border-[#E8E4D9] flex justify-end gap-3 mt-8">
              <button className="px-6 py-2.5 text-xs font-bold text-gray-500 hover:text-black">Reset Defaults</button>
              <button 
                onClick={handleSave}
                className="px-8 py-2.5 bg-black text-white rounded-lg text-sm font-bold hover:opacity-90 flex items-center gap-2 transition-all"
              >
                <Save size={16} /> Save Configuration
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

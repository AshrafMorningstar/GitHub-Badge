import React, { useState } from 'react';
import { BADGES, GUIDES, FAQS } from './constants';
import { BadgeType, UserStats } from './types';
import BadgeCard from './components/BadgeCard';
import AiAssistant from './components/AiAssistant';
import ProfileSearch from './components/ProfileSearch';
import { Trophy, HelpCircle, BookOpen, AlertCircle, Info, Menu, X, Github } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'badges' | 'guides' | 'ai' | 'faq'>('badges');
  const [filterType, setFilterType] = useState<BadgeType | 'All'>('All');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userStats, setUserStats] = useState<UserStats | null>(null);

  const filteredBadges = filterType === 'All' 
    ? BADGES 
    : BADGES.filter(b => b.type === filterType);

  return (
    <div className="min-h-screen bg-[#0d1117] text-[#e6edf3]">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#161b22]/90 backdrop-blur-md border-b border-[#30363d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg">
                <Github size={20} />
              </div>
              <span className="font-bold text-xl tracking-tight">Badge Hunter</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-1">
              {[
                { id: 'badges', icon: Trophy, label: 'Badges' },
                { id: 'guides', icon: BookOpen, label: 'Guides' },
                { id: 'ai', icon: Trophy, label: 'AI Advisor' }, // Reusing trophy purely for layout balance or maybe Sparkles? Let's use custom text
                { id: 'faq', icon: HelpCircle, label: 'FAQ' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all text-sm font-medium ${
                    activeTab === item.id 
                      ? 'bg-[#21262d] text-blue-400' 
                      : 'text-slate-400 hover:text-white hover:bg-[#21262d]/50'
                  }`}
                >
                  <item.icon size={16} />
                  {item.label}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-slate-400 hover:text-white"
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-[#161b22] border-b border-[#30363d]">
            <div className="px-2 pt-2 pb-3 space-y-1">
               {['badges', 'guides', 'ai', 'faq'].map((tab) => (
                 <button
                    key={tab}
                    onClick={() => {
                        setActiveTab(tab as any);
                        setIsMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium capitalize ${
                        activeTab === tab ? 'bg-[#21262d] text-blue-400' : 'text-slate-400'
                    }`}
                 >
                    {tab}
                 </button>
               ))}
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Intro Hero - Only show on 'badges' tab */}
        {activeTab === 'badges' && (
          <div className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 mb-4 pb-2">
              The Complete Guide to GitHub Badges
            </h1>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
              Discover, track, and earn every achievement available on GitHub. From the common 
              <span className="text-yellow-400 mx-1">Starstruck</span> to the elusive 
              <span className="text-red-400 mx-1">YOLO</span>.
            </p>

            <ProfileSearch onUserFound={setUserStats} />
          </div>
        )}

        {/* Content Render */}
        {activeTab === 'badges' && (
          <div className="space-y-6">
            {/* Filter */}
            <div className="flex justify-center flex-wrap gap-2 mb-8">
              {['All', BadgeType.EARNABLE, BadgeType.HIGHLIGHT, BadgeType.RETIRED].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type as any)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                    filterType === type 
                      ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50' 
                      : 'bg-[#21262d] border-[#30363d] text-slate-400 hover:border-slate-500'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBadges.map(badge => (
                <BadgeCard key={badge.id} badge={badge} userStats={userStats} />
              ))}
            </div>
            
            {filteredBadges.length === 0 && (
                <div className="text-center py-20 text-slate-500">
                    <Trophy size={48} className="mx-auto mb-4 opacity-50" />
                    <p>No badges found for this category.</p>
                </div>
            )}
          </div>
        )}

        {activeTab === 'guides' && (
          <div className="max-w-3xl mx-auto space-y-8">
             <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-6 flex gap-4">
                <Info className="text-blue-400 shrink-0 mt-1" />
                <div>
                    <h3 className="text-lg font-bold text-blue-300 mb-2">Troubleshooting: Badge Not Appearing?</h3>
                    <ul className="list-disc list-inside text-slate-300 space-y-1 text-sm">
                        <li><strong>Wait 24-48 hours:</strong> Jobs run asynchronously.</li>
                        <li><strong>Public vs Private:</strong> Most require public repos.</li>
                        <li><strong>Branch:</strong> Commits must usually be on the default branch.</li>
                        <li><strong>Email:</strong> Ensure your git config email matches your GitHub account.</li>
                    </ul>
                </div>
             </div>

            {GUIDES.map(guide => (
              <div key={guide.id} className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 md:p-8">
                <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
                    <BookOpen className="text-green-400" size={24} />
                    {guide.title}
                </h2>
                <div className="space-y-4">
                  {guide.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-[#21262d] rounded-full flex items-center justify-center font-bold text-slate-400 border border-[#30363d]">
                        {idx + 1}
                      </div>
                      <p className="text-slate-300 pt-1 text-lg">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="max-w-4xl mx-auto">
             <div className="mb-6 text-center">
                <h2 className="text-3xl font-bold text-white mb-2">AI Badge Advisor</h2>
                <p className="text-slate-400">
                    Not sure how to interpret a badge description? Want a strategy to get "Galaxy Brain"? 
                    Ask our AI assistant.
                </p>
             </div>
            <AiAssistant />
          </div>
        )}

        {activeTab === 'faq' && (
          <div className="max-w-3xl mx-auto space-y-6">
             <h2 className="text-3xl font-bold text-white text-center mb-8">Frequently Asked Questions</h2>
            {FAQS.map((faq, idx) => (
              <div key={idx} className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 hover:border-slate-600 transition-colors">
                <h3 className="text-lg font-bold text-white mb-3 flex items-start gap-3">
                    <HelpCircle className="text-purple-400 shrink-0 mt-1" size={20} />
                    {faq.q}
                </h3>
                <p className="text-slate-400 leading-relaxed ml-8">
                  {faq.a}
                </p>
              </div>
            ))}

             <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-6 mt-12 text-center">
                <AlertCircle className="mx-auto text-yellow-500 mb-4" size={32} />
                <h3 className="text-lg font-bold text-white mb-2">Found an error?</h3>
                <p className="text-slate-400 mb-4">
                    This guide is maintained by the community. If you see something wrong, please check the official discussions.
                </p>
                <a href="https://github.com/orgs/community/discussions" target="_blank" rel="noreferrer" className="inline-block px-6 py-2 bg-[#21262d] hover:bg-[#30363d] text-white rounded-md border border-[#30363d] transition-colors">
                    Visit GitHub Community
                </a>
             </div>
          </div>
        )}

      </main>
    </div>
  );
};

export default App;
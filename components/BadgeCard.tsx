import React from 'react';
import { Badge, BadgeType } from '../types';

interface BadgeCardProps {
  badge: Badge;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ badge }) => {
  const isRetired = badge.type === BadgeType.RETIRED;

  return (
    <div className={`
      relative p-6 rounded-xl border transition-all duration-300 hover:scale-[1.02]
      ${isRetired 
        ? 'bg-slate-900/50 border-slate-800 opacity-75 grayscale-[0.5]' 
        : 'bg-[#161b22] border-[#30363d] hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-900/20'}
    `}>
      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl filter drop-shadow-md">{badge.icon}</div>
        <span className={`
          text-xs px-2 py-1 rounded-full font-medium border
          ${badge.type === BadgeType.EARNABLE ? 'bg-green-900/30 text-green-400 border-green-800' : ''}
          ${badge.type === BadgeType.HIGHLIGHT ? 'bg-purple-900/30 text-purple-400 border-purple-800' : ''}
          ${badge.type === BadgeType.RETIRED ? 'bg-slate-800 text-slate-400 border-slate-700' : ''}
        `}>
          {badge.type}
        </span>
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2">{badge.name}</h3>
      <p className="text-slate-400 text-sm mb-4 leading-relaxed">{badge.description}</p>
      
      <div className="space-y-3">
        <div className="bg-[#0d1117] p-3 rounded-md border border-[#30363d]">
          <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold block mb-1">How to earn</span>
          <p className="text-sm text-gray-300">{badge.howToEarn}</p>
        </div>

        {badge.tiers && (
           <div className="bg-[#0d1117] p-3 rounded-md border border-[#30363d]">
            <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold block mb-1">Tiers</span>
            <div className="flex flex-wrap gap-2">
              {badge.tiers.map((tier, idx) => (
                <span key={idx} className="text-xs bg-slate-800 text-slate-300 px-2 py-1 rounded border border-slate-700">
                  {tier}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BadgeCard;
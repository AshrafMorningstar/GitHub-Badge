import React from 'react';
import { Badge, BadgeType, UserStats } from '../types';
import { Lock, CheckCircle2 } from 'lucide-react';

interface BadgeCardProps {
  badge: Badge;
  userStats?: UserStats | null;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ badge, userStats }) => {
  const isRetired = badge.type === BadgeType.RETIRED;

  // Progress Logic
  let progress: { current: number; next: number; label: string; tierName: string } | null = null;
  
  if (userStats) {
    if (badge.id === 'starstruck') {
      const tiers = [16, 128, 512, 4096];
      const tierNames = ['Base', 'Bronze', 'Silver', 'Gold'];
      const val = userStats.totalStars;
      
      let nextTierIdx = tiers.findIndex(t => val < t);
      if (nextTierIdx === -1) nextTierIdx = 3; // Maxed out (or Gold+)
      
      // If val is greater than max tier, we are at max
      const isMax = val >= tiers[3];
      const nextVal = isMax ? tiers[3] : tiers[nextTierIdx];
      const tierName = isMax ? 'Gold' : (nextTierIdx === 0 ? 'None' : tierNames[nextTierIdx - 1]);

      progress = {
        current: val,
        next: nextVal,
        label: `${val} / ${nextVal} Stars`,
        tierName
      };
    } else if (badge.id === 'pull-shark') {
      const tiers = [2, 16, 128, 1024];
      const tierNames = ['Base', 'Bronze', 'Silver', 'Gold'];
      const val = userStats.mergedPRs;
      
      let nextTierIdx = tiers.findIndex(t => val < t);
      if (nextTierIdx === -1) nextTierIdx = 3;
      
      const isMax = val >= tiers[3];
      const nextVal = isMax ? tiers[3] : tiers[nextTierIdx];
      const tierName = isMax ? 'Gold' : (nextTierIdx === 0 ? 'None' : tierNames[nextTierIdx - 1]);

      progress = {
        current: val,
        next: nextVal,
        label: `${val} / ${nextVal} PRs`,
        tierName
      };
    }
  }

  const percent = progress 
    ? Math.min(100, Math.max(0, (progress.current / progress.next) * 100)) 
    : 0;
  
  const isUnlocked = progress ? progress.current >= (badge.id === 'starstruck' ? 16 : 2) : false; // hardcoded base tiers for check

  return (
    <div className={`
      relative p-6 rounded-xl border transition-all duration-300 flex flex-col h-full
      ${isRetired 
        ? 'bg-slate-900/50 border-slate-800 opacity-75 grayscale-[0.5]' 
        : 'bg-[#161b22] border-[#30363d] hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-900/20'}
    `}>
      <div className="flex items-start justify-between mb-4">
        <div className="text-4xl filter drop-shadow-md">{badge.icon}</div>
        <div className="flex flex-col items-end gap-2">
           <span className={`
            text-xs px-2 py-1 rounded-full font-medium border
            ${badge.type === BadgeType.EARNABLE ? 'bg-green-900/30 text-green-400 border-green-800' : ''}
            ${badge.type === BadgeType.HIGHLIGHT ? 'bg-purple-900/30 text-purple-400 border-purple-800' : ''}
            ${badge.type === BadgeType.RETIRED ? 'bg-slate-800 text-slate-400 border-slate-700' : ''}
          `}>
            {badge.type}
          </span>
          {userStats && progress && (
             isUnlocked ? (
                <span className="flex items-center gap-1 text-[10px] font-bold text-green-400 uppercase tracking-wider">
                    <CheckCircle2 size={12} /> Owned ({progress.tierName})
                </span>
             ) : (
                <span className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <Lock size={12} /> Locked
                </span>
             )
          )}
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-white mb-2">{badge.name}</h3>
      <p className="text-slate-400 text-sm mb-4 leading-relaxed flex-grow">{badge.description}</p>
      
      {userStats && progress && (
        <div className="mb-4 pt-4 border-t border-[#30363d]">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400">Next Tier: {progress.tierName === 'Gold' ? 'Maxed' : 'Progress'}</span>
            <span className="text-white font-mono">{progress.label}</span>
          </div>
          <div className="h-2 w-full bg-[#0d1117] rounded-full overflow-hidden border border-[#30363d]">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-green-400 transition-all duration-1000 ease-out"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}

      <div className="space-y-3 mt-auto">
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
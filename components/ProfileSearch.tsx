import React, { useState } from 'react';
import { Search, Github, Loader2, AlertCircle } from 'lucide-react';
import { fetchGitHubStats } from '../services/githubService';
import { UserStats } from '../types';

interface ProfileSearchProps {
  onUserFound: (stats: UserStats | null) => void;
}

const ProfileSearch: React.FC<ProfileSearchProps> = ({ onUserFound }) => {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStats, setCurrentStats] = useState<UserStats | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    setError('');
    
    try {
      const stats = await fetchGitHubStats(username);
      setCurrentStats(stats);
      onUserFound(stats);
      if (!stats) {
          setError("User not found or API limit reached.");
      }
    } catch (err) {
      setError("Failed to fetch user data. Check spelling or try again later.");
      onUserFound(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <form onSubmit={handleSearch} className="relative flex gap-2 mb-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Github className="h-5 w-5 text-slate-500" />
          </div>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter GitHub username to check progress..."
            className="block w-full pl-10 pr-3 py-3 border border-[#30363d] rounded-lg leading-5 bg-[#0d1117] text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {isLoading ? <Loader2 className="animate-spin h-5 w-5" /> : <Search className="h-5 w-5" />}
          <span className="ml-2 hidden sm:inline">Check Progress</span>
        </button>
      </form>

      {error && (
        <div className="flex items-center gap-2 text-red-400 bg-red-900/20 p-3 rounded-lg border border-red-900/50 mb-4">
          <AlertCircle size={16} />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {currentStats && (
        <div className="bg-[#161b22] border border-[#30363d] rounded-xl p-4 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-300">
          <img 
            src={currentStats.avatarUrl} 
            alt={currentStats.username} 
            className="w-16 h-16 rounded-full border-2 border-[#30363d]"
          />
          <div>
            <h3 className="font-bold text-lg text-white">
              {currentStats.username}
            </h3>
            <div className="flex gap-4 text-sm text-slate-400 mt-1">
              <span className="flex items-center gap-1">
                <span className="text-yellow-500">⭐</span> 
                {currentStats.totalStars} Stars
              </span>
              <span className="flex items-center gap-1">
                <span className="text-blue-400">🦈</span> 
                {currentStats.mergedPRs} Merged PRs
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSearch;
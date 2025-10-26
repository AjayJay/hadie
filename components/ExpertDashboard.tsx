import React from 'react';
import type { User } from '../types';
import Header from './Header';

interface ExpertDashboardProps {
  user: User;
  onLogout: () => void;
}

const ExpertDashboard: React.FC<ExpertDashboardProps> = ({ user, onLogout }) => {
  const userInitial = user.name.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-slate-50 font-sans antialiased">
      <Header title="Handie for Experts" user={user} onLogout={onLogout} />
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8 md:flex">
                <div className="md:flex-shrink-0">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-sky-100 to-sky-200 flex items-center justify-center">
                        <span className="text-4xl font-bold text-sky-600">{userInitial}</span>
                    </div>
                </div>
                <div className="mt-4 md:mt-0 md:ml-6">
                    <div className="uppercase tracking-wide text-sm text-sky-500 font-semibold">Expert Profile</div>
                    <h1 className="block mt-1 text-2xl leading-tight font-bold text-black">{user.name}</h1>
                    <p className="mt-2 text-slate-500">{user.email}</p>
                </div>
            </div>
        </div>
        
        <div className="mt-8">
            <h3 className="text-xl font-bold text-slate-800 mb-4">Your Dashboard</h3>
            <div className="bg-white p-6 rounded-xl shadow-md">
                <p className="text-slate-600">Welcome to your dashboard. Future updates will include your schedule, earnings, and customer ratings.</p>
                <div className="mt-6 text-center text-slate-500 border-t border-slate-200 pt-6">
                    <p>Your assigned jobs will appear here.</p>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default ExpertDashboard;
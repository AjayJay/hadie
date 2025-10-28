import React, { useState } from 'react';
import { HandIcon } from './Icon';
import AuthModal from './AuthModal';

const LandingPage: React.FC = () => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  const openAuthModal = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <HandIcon className="w-8 h-8 text-sky-500" />
                <span className="text-2xl font-bold text-slate-800">Handie</span>
              </div>

              {/* Auth Buttons */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => openAuthModal('login')}
                  className="text-slate-600 hover:text-slate-800 font-medium transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-800 mb-6">
              Get help in a{' '}
              <span className="text-sky-600">handful</span> of clicks
            </h1>
            <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto">
              Connect with skilled experts for any task, big or small. From home repairs to tech support, 
              Handie makes it easy to find the help you need, when you need it.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => openAuthModal('register')}
                className="bg-sky-600 hover:bg-sky-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                Get Started Free
              </button>
              <button
                onClick={() => openAuthModal('login')}
                className="border border-slate-300 hover:border-slate-400 text-slate-700 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </main>

        {/* Features Section */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">
                Why choose Handie?
              </h2>
              <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                We make it simple to connect with the right expert for your needs
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Quick & Easy</h3>
                <p className="text-slate-600">
                  Find and connect with experts in minutes. No lengthy processes or complicated forms.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Verified Experts</h3>
                <p className="text-slate-600">
                  All our experts are verified professionals with proven track records and customer reviews.
                </p>
              </div>

              <div className="text-center p-6">
                <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-slate-800 mb-2">Fair Pricing</h3>
                <p className="text-slate-600">
                  Transparent pricing with no hidden fees. Pay only for the work you need, when you need it.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-sky-600 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to get started?
            </h2>
            <p className="text-xl text-sky-100 mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who have found the help they need through Handie.
            </p>
            <button
              onClick={() => openAuthModal('register')}
              className="bg-white hover:bg-slate-50 text-sky-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
            >
              Start Your Journey Today
            </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-800 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <HandIcon className="w-8 h-8 text-sky-400" />
                <span className="text-2xl font-bold text-white">Handie</span>
              </div>
              <p className="text-slate-400">
                © 2024 Handie. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        initialMode={authMode}
      />
    </>
  );
};

export default LandingPage;

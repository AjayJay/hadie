import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthScreen from './components/AuthScreen';
import CustomerDashboard from './components/CustomerDashboard';
import ExpertDashboard from './components/ExpertDashboard';
import { OnboardingFlow } from './components/onboarding/OnboardingFlow';

const AppContent: React.FC = () => {
  const { user, isAuthenticated, isLoading, logout } = useAuth();

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth screen if not authenticated
  if (!isAuthenticated || !user) {
    return <AuthScreen />;
  }

  // Show onboarding if user hasn't completed onboarding
  if (!user.onboardingCompleted) {
    return <OnboardingFlow onComplete={() => window.location.reload()} />;
  }

  // Show dashboard if user has completed onboarding
  return (
    <>
      {user.role === 'customer' && <CustomerDashboard user={user} onLogout={logout} />}
      {user.role === 'expert' && <ExpertDashboard user={user} onLogout={logout} />}
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;

import React, { useState, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { HandIcon } from './Icon';

const AuthScreen: React.FC = () => {
  const { login, register, isLoading } = useAuth();
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [role, setRole] = useState<'customer' | 'expert'>('customer');
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (authMode === 'login') {
        const success = await login(email, password);
        if (!success) {
          setError('Invalid email or password');
        }
      } else {
        if (!name || !phone) {
          setError('All fields are required');
          return;
        }
        
        const success = await register({ email, password, phone, role });
        if (!success) {
          setError('Registration failed. Please try again.');
        }
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    }
  };

  const renderRegisterFields = () => (
    <>
      <div className="mb-4">
        <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="name">Full Name</label>
        <input 
          type="text" 
          id="name" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          className="shadow-sm appearance-none border bg-white rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-sky-500" 
          required 
        />
      </div>
      <div className="mb-4">
        <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="phone">Phone Number</label>
        <input 
          type="tel" 
          id="phone" 
          value={phone} 
          onChange={e => setPhone(e.target.value)} 
          placeholder="+91 98765 43210"
          className="shadow-sm appearance-none border bg-white rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-sky-500" 
          required 
        />
      </div>
      <div className="mb-4">
        <label className="block text-slate-700 text-sm font-bold mb-2">I am a...</label>
        <div className="flex rounded-md shadow-sm">
          <button 
            type="button" 
            onClick={() => setRole('customer')} 
            className={`flex-1 px-4 py-2 text-sm font-medium ${role === 'customer' ? 'bg-sky-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'} rounded-l-md border border-slate-300 focus:z-10 focus:ring-2 focus:ring-sky-500 focus:border-sky-500`}
          >
            Customer
          </button>
          <button 
            type="button" 
            onClick={() => setRole('expert')} 
            className={`-ml-px flex-1 px-4 py-2 text-sm font-medium ${role === 'expert' ? 'bg-sky-600 text-white' : 'bg-white text-slate-700 hover:bg-slate-50'} rounded-r-md border border-slate-300 focus:z-10 focus:ring-2 focus:ring-sky-500 focus:border-sky-500`}
          >
            Expert
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col justify-center items-center p-4 antialiased">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-3">
                <HandIcon className="w-10 h-10 text-sky-500"/>
                <h1 className="text-5xl font-extrabold text-slate-800">Handie</h1>
            </div>
            <p className="text-slate-600 mt-3">Get help in a handful of clicks.</p>
        </div>
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="flex border-b border-slate-200">
                <button onClick={() => setAuthMode('login')} className={`flex-1 py-3 font-semibold text-center focus:outline-none transition-colors ${authMode === 'login' ? 'text-sky-600 border-b-2 border-sky-600' : 'text-slate-500 hover:text-slate-700'}`}>Login</button>
                <button onClick={() => setAuthMode('register')} className={`flex-1 py-3 font-semibold text-center focus:outline-none transition-colors ${authMode === 'register' ? 'text-sky-600 border-b-2 border-sky-600' : 'text-slate-500 hover:text-slate-700'}`}>Sign Up</button>
            </div>
            <div className="p-8">
                <form onSubmit={handleSubmit}>
                    {authMode === 'register' && renderRegisterFields()}
                    <div className="mb-4">
                        <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="email">Email Address</label>
                        <input 
                          type="email" 
                          id="email" 
                          value={email} 
                          onChange={e => setEmail(e.target.value)} 
                          className="shadow-sm appearance-none border bg-white rounded w-full py-2 px-3 text-slate-700 leading-tight focus:outline-none focus:ring-2 focus:ring-sky-500" 
                          required 
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-slate-700 text-sm font-bold mb-2" htmlFor="password">Password</label>
                        <input 
                          type="password" 
                          id="password" 
                          value={password} 
                          onChange={e => setPassword(e.target.value)} 
                          className="shadow-sm appearance-none border bg-white rounded w-full py-2 px-3 text-slate-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-sky-500" 
                          required 
                        />
                    </div>
                    
                    {error && (
                      <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                      </div>
                    )}
                    
                    <button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors"
                    >
                      {isLoading ? 'Please wait...' : (authMode === 'login' ? 'Login' : 'Create Account')}
                    </button>
                </form>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;
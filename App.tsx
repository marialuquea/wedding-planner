import React, { useState, useEffect } from 'react';
import GuestView from './components/GuestView';
import AdminDashboard from './components/AdminDashboard';
import { Task, RSVP, WeddingDetails, ViewState } from './types';
import { Lock } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Persistent State
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('wedding_tasks');
    return saved ? JSON.parse(saved) : [];
  });

  const [rsvps, setRsvps] = useState<RSVP[]>(() => {
    const saved = localStorage.getItem('wedding_rsvps');
    return saved ? JSON.parse(saved) : [];
  });

  const [details, setDetails] = useState<WeddingDetails>(() => {
    const saved = localStorage.getItem('wedding_details');
    return saved ? JSON.parse(saved) : {
      date: '2025-06-21',
      time: '16:00',
      locationName: 'The Grand Garden Estate',
      address: '123 Rose Lane, Beverly Hills, CA',
      ourStory: '',
      registryUrl: ''
    };
  });

  // Effects to save state
  useEffect(() => localStorage.setItem('wedding_tasks', JSON.stringify(tasks)), [tasks]);
  useEffect(() => localStorage.setItem('wedding_rsvps', JSON.stringify(rsvps)), [rsvps]);
  useEffect(() => localStorage.setItem('wedding_details', JSON.stringify(details)), [details]);

  const handleRSVP = (rsvp: RSVP) => {
    setRsvps(prev => [...prev, rsvp]);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPassword.toLowerCase() === 'love') {
      setView('admin-dashboard');
      setLoginError(false);
      setAdminPassword('');
    } else {
      setLoginError(true);
    }
  };

  const renderLogin = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
        <div className="text-center mb-6">
          <div className="bg-wedding-rose/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
             <Lock className="w-8 h-8 text-wedding-charcoal" />
          </div>
          <h2 className="text-2xl font-serif text-gray-800">Planner Access</h2>
          <p className="text-gray-500 text-sm">Enter the password to manage the wedding.</p>
        </div>
        <form onSubmit={handleAdminLogin} className="space-y-4">
          <input 
            type="password" 
            value={adminPassword}
            onChange={(e) => setAdminPassword(e.target.value)}
            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-wedding-rose outline-none"
            placeholder="Password (hint: love)"
            autoFocus
          />
          {loginError && <p className="text-red-500 text-sm text-center">Incorrect password.</p>}
          <button type="submit" className="w-full bg-wedding-charcoal text-white font-bold py-3 rounded-lg hover:bg-black transition">
            Enter Dashboard
          </button>
          <button type="button" onClick={() => setView('landing')} className="w-full text-gray-400 text-sm hover:text-gray-600">
            Back to Website
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="font-sans text-gray-900">
      {/* Hidden Admin Access Button on Landing */}
      {view === 'landing' && (
        <button 
          onClick={() => setView('admin-login')} 
          className="fixed bottom-4 right-4 text-gray-300 hover:text-gray-500 z-50 p-2"
          aria-label="Admin Login"
        >
          <Lock className="w-4 h-4" />
        </button>
      )}

      {view === 'admin-login' && renderLogin()}
      
      {view === 'admin-dashboard' ? (
        <AdminDashboard 
          tasks={tasks} 
          setTasks={setTasks} 
          rsvps={rsvps} 
          details={details} 
          setDetails={setDetails}
          onLogout={() => setView('landing')}
        />
      ) : (
        view !== 'admin-login' && (
          <GuestView 
            details={details} 
            onRSVP={handleRSVP} 
            view={view as 'landing' | 'rsvp' | 'details'} 
            setView={(v) => setView(v)} 
          />
        )
      )}
    </div>
  );
}

export default App;
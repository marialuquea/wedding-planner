import React, { useState, useCallback } from 'react';
import { Task, RSVP, WeddingDetails, AdminTab } from '../types';
import { generateWeddingTasks, generateVows, generateThankYouNote } from '../services/geminiService';
import { Check, Trash2, Plus, Sparkles, User, Save, RefreshCw, PenTool, ClipboardList, Users, Settings, Gift } from 'lucide-react';

interface AdminDashboardProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  rsvps: RSVP[];
  details: WeddingDetails;
  setDetails: React.Dispatch<React.SetStateAction<WeddingDetails>>;
  onLogout: () => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ tasks, setTasks, rsvps, details, setDetails, onLogout }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>(AdminTab.TASKS);
  const [isGenerating, setIsGenerating] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  
  // AI Tools State
  const [vowParams, setVowParams] = useState({ tone: 'Romantic', memories: '', partner: 'Erin' });
  const [generatedVow, setGeneratedVow] = useState('');
  const [thankYouParams, setThankYouParams] = useState({ guest: '', gift: '' });
  const [generatedNote, setGeneratedNote] = useState('');

  // Task Handlers
  const handleAddTask = () => {
    if (!newTaskTitle.trim()) return;
    const newTask: Task = {
      id: crypto.randomUUID(),
      title: newTaskTitle,
      category: 'Planning',
      isCompleted: false
    };
    setTasks(prev => [newTask, ...prev]);
    setNewTaskTitle('');
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const generateTasks = useCallback(async (timeframe: string) => {
    setIsGenerating(true);
    const newTasksData = await generateWeddingTasks(timeframe);
    const newTasks: Task[] = newTasksData.map(t => ({
      id: crypto.randomUUID(),
      title: t.title || "New Task",
      description: t.description || "",
      category: (t.category as any) || 'Planning',
      isCompleted: false
    }));
    setTasks(prev => [...newTasks, ...prev]);
    setIsGenerating(false);
  }, [setTasks]);

  // AI Content Handlers
  const handleGenerateVows = async () => {
    setIsGenerating(true);
    const result = await generateVows(vowParams.tone, vowParams.memories, vowParams.partner);
    setGeneratedVow(result);
    setIsGenerating(false);
  };
  
  const handleGenerateNote = async () => {
     setIsGenerating(true);
     const result = await generateThankYouNote(thankYouParams.guest, thankYouParams.gift);
     setGeneratedNote(result);
     setIsGenerating(false);
  };

  const renderTasks = () => (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
           <Sparkles className="text-purple-500 w-5 h-5" /> AI Assistant
        </h3>
        <div className="flex flex-wrap gap-2 mb-4">
          <p className="text-sm text-gray-500 w-full mb-2">Generate a checklist based on your timeline:</p>
          {['12 Months', '6 Months', '1 Month', '1 Week'].map((time) => (
            <button
              key={time}
              onClick={() => generateTasks(time)}
              disabled={isGenerating}
              className="px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-100 transition disabled:opacity-50"
            >
              {isGenerating ? 'Thinking...' : `${time} Out`}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex gap-2 mb-6">
          <input 
            type="text" 
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddTask()}
            placeholder="Add a new custom task..."
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-wedding-gold outline-none"
          />
          <button 
            onClick={handleAddTask}
            className="bg-wedding-charcoal text-white px-4 py-2 rounded-lg hover:bg-black transition"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2">
          {tasks.length === 0 && <p className="text-center text-gray-400 py-8">No tasks yet. Ask AI to generate some!</p>}
          {tasks.map(task => (
            <div 
              key={task.id} 
              className={`flex items-start gap-3 p-3 rounded-lg group transition-colors ${task.isCompleted ? 'bg-gray-50' : 'bg-white hover:bg-gray-50'}`}
            >
              <button 
                onClick={() => toggleTask(task.id)}
                className={`mt-1 w-5 h-5 rounded border flex items-center justify-center transition-colors ${task.isCompleted ? 'bg-green-500 border-green-500 text-white' : 'border-gray-300 text-transparent hover:border-green-500'}`}
              >
                <Check className="w-3 h-3" />
              </button>
              <div className="flex-1">
                <p className={`font-medium ${task.isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                  {task.title}
                </p>
                {task.description && <p className="text-sm text-gray-500 mt-1">{task.description}</p>}
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded mt-2 inline-block">
                  {task.category}
                </span>
              </div>
              <button 
                onClick={() => deleteTask(task.id)}
                className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRSVPS = () => {
    const totalGuests = rsvps.reduce((acc, curr) => acc + (curr.attending === 'yes' ? curr.guestsCount : 0), 0);
    const accepted = rsvps.filter(r => r.attending === 'yes').length;
    const declined = rsvps.filter(r => r.attending === 'no').length;

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-green-500">
            <p className="text-sm text-gray-500">Confirmed Guests</p>
            <p className="text-3xl font-bold text-gray-800">{totalGuests}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-blue-500">
            <p className="text-sm text-gray-500">RSVPs Received</p>
            <p className="text-3xl font-bold text-gray-800">{accepted + declined}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-l-4 border-l-gray-300">
             <p className="text-sm text-gray-500">Declined</p>
             <p className="text-3xl font-bold text-gray-800">{declined}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm font-semibold uppercase tracking-wider">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Status</th>
                <th className="p-4">Count</th>
                <th className="p-4">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rsvps.map(rsvp => (
                <tr key={rsvp.id} className="hover:bg-gray-50">
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{rsvp.name}</div>
                    <div className="text-xs text-gray-500">{rsvp.email}</div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      rsvp.attending === 'yes' ? 'bg-green-100 text-green-700' : 
                      rsvp.attending === 'no' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {rsvp.attending.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">{rsvp.attending === 'yes' ? rsvp.guestsCount : '-'}</td>
                  <td className="p-4 text-sm text-gray-500 max-w-xs truncate">
                    {rsvp.dietaryRestrictions && <span className="block text-orange-600 text-xs">Diet: {rsvp.dietaryRestrictions}</span>}
                    {rsvp.songRequest && <span className="block text-purple-600 text-xs">Song: {rsvp.songRequest}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rsvps.length === 0 && <div className="p-8 text-center text-gray-400">No RSVPs yet.</div>}
        </div>
      </div>
    );
  };

  const renderDetails = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-2xl mx-auto space-y-6">
      <h3 className="text-xl font-bold text-gray-800">Wedding Configuration</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input 
            type="date"
            value={details.date}
            onChange={(e) => setDetails({...details, date: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-wedding-gold outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
          <input 
            type="time"
            value={details.time}
            onChange={(e) => setDetails({...details, time: e.target.value})}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-wedding-gold outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Location Name</label>
        <input 
          type="text"
          value={details.locationName}
          onChange={(e) => setDetails({...details, locationName: e.target.value})}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-wedding-gold outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Full Address</label>
        <input 
          type="text"
          value={details.address}
          onChange={(e) => setDetails({...details, address: e.target.value})}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-wedding-gold outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Our Story</label>
        <textarea 
          value={details.ourStory}
          onChange={(e) => setDetails({...details, ourStory: e.target.value})}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-wedding-gold outline-none h-32"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Registry URL</label>
        <input 
          type="text"
          value={details.registryUrl}
          onChange={(e) => setDetails({...details, registryUrl: e.target.value})}
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-wedding-gold outline-none"
        />
      </div>

      <div className="pt-4 border-t flex justify-end">
        <button className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">
          <Save className="w-4 h-4" /> Changes Auto-save
        </button>
      </div>
    </div>
  );

  const renderAITools = () => (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Vow Writer */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <PenTool className="text-wedding-rose w-5 h-5" /> Vow Assistant
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase text-gray-500">Writing for</label>
            <select 
              value={vowParams.partner}
              onChange={(e) => setVowParams({...vowParams, partner: e.target.value})}
              className="w-full mt-1 p-2 border rounded bg-gray-50"
            >
              <option value="Erin">Erin</option>
              <option value="Ed">Ed</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-gray-500">Tone</label>
            <select 
              value={vowParams.tone}
              onChange={(e) => setVowParams({...vowParams, tone: e.target.value})}
              className="w-full mt-1 p-2 border rounded bg-gray-50"
            >
              <option>Romantic & Emotional</option>
              <option>Funny & Lighthearted</option>
              <option>Short & Sweet</option>
              <option>Traditional</option>
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-gray-500">Key Memories</label>
            <textarea 
              value={vowParams.memories}
              onChange={(e) => setVowParams({...vowParams, memories: e.target.value})}
              placeholder="E.g., meeting at the coffee shop, love for hiking, her smile..."
              className="w-full mt-1 p-2 border rounded bg-gray-50 h-24"
            />
          </div>
          <button 
            onClick={handleGenerateVows}
            disabled={isGenerating}
            className="w-full bg-wedding-rose text-wedding-charcoal font-bold py-2 rounded hover:bg-rose-200 transition"
          >
            {isGenerating ? 'Writing...' : 'Generate Vows'}
          </button>
          
          {generatedVow && (
            <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
              <pre className="whitespace-pre-wrap font-serif text-gray-700 text-sm">{generatedVow}</pre>
              <button 
                onClick={() => navigator.clipboard.writeText(generatedVow)}
                className="mt-2 text-xs text-blue-600 hover:underline flex items-center gap-1"
              >
                <ClipboardList className="w-3 h-3" /> Copy
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Thank You Note Writer */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Gift className="text-wedding-gold w-5 h-5" /> Thank You Helper
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold uppercase text-gray-500">Guest Name</label>
            <input 
              type="text"
              value={thankYouParams.guest}
              onChange={(e) => setThankYouParams({...thankYouParams, guest: e.target.value})}
              className="w-full mt-1 p-2 border rounded bg-gray-50"
              placeholder="Aunt May"
            />
          </div>
          <div>
            <label className="text-xs font-semibold uppercase text-gray-500">Gift Received</label>
            <input 
              type="text"
              value={thankYouParams.gift}
              onChange={(e) => setThankYouParams({...thankYouParams, gift: e.target.value})}
              className="w-full mt-1 p-2 border rounded bg-gray-50"
              placeholder="Blender"
            />
          </div>
          <button 
            onClick={handleGenerateNote}
            disabled={isGenerating}
            className="w-full bg-wedding-gold text-white font-bold py-2 rounded hover:bg-yellow-600 transition"
          >
             {isGenerating ? 'Writing...' : 'Generate Note'}
          </button>

          {generatedNote && (
            <div className="mt-4 p-4 bg-gray-50 rounded border border-gray-200">
              <p className="whitespace-pre-wrap font-serif text-gray-700 text-sm">{generatedNote}</p>
              <button 
                onClick={() => navigator.clipboard.writeText(generatedNote)}
                className="mt-2 text-xs text-blue-600 hover:underline flex items-center gap-1"
              >
                <ClipboardList className="w-3 h-3" /> Copy
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-wedding-charcoal text-gray-300 flex flex-col fixed h-full z-20">
        <div className="p-6">
           <h2 className="text-2xl font-serif text-white tracking-wide">Planner</h2>
           <p className="text-xs text-gray-500">Ed & Erin</p>
        </div>
        
        <nav className="flex-1 space-y-2 px-4">
          <button 
            onClick={() => setActiveTab(AdminTab.TASKS)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === AdminTab.TASKS ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`}
          >
            <ClipboardList className="w-5 h-5" /> Tasks
          </button>
          <button 
            onClick={() => setActiveTab(AdminTab.RSVPS)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === AdminTab.RSVPS ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`}
          >
            <Users className="w-5 h-5" /> RSVPs
          </button>
          <button 
            onClick={() => setActiveTab(AdminTab.DETAILS)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === AdminTab.DETAILS ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`}
          >
            <Settings className="w-5 h-5" /> Wedding Info
          </button>
          <button 
            onClick={() => setActiveTab(AdminTab.AI_TOOLS)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === AdminTab.AI_TOOLS ? 'bg-white/10 text-white' : 'hover:bg-white/5'}`}
          >
            <Sparkles className="w-5 h-5" /> AI Tools
          </button>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:bg-white/5 rounded-lg transition"
          >
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
           <h1 className="text-2xl font-bold text-gray-800 font-serif">
             {activeTab === AdminTab.TASKS && 'Task Checklist'}
             {activeTab === AdminTab.RSVPS && 'Guest List & RSVPs'}
             {activeTab === AdminTab.DETAILS && 'Manage Wedding Details'}
             {activeTab === AdminTab.AI_TOOLS && 'AI Planning Assistants'}
           </h1>
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-wedding-rose flex items-center justify-center text-wedding-charcoal font-bold">
               <User className="w-5 h-5" />
             </div>
             <div className="text-sm">
               <p className="font-bold text-gray-900">Ed & Erin</p>
               <p className="text-gray-500">Admin</p>
             </div>
           </div>
        </header>
        
        {activeTab === AdminTab.TASKS && renderTasks()}
        {activeTab === AdminTab.RSVPS && renderRSVPS()}
        {activeTab === AdminTab.DETAILS && renderDetails()}
        {activeTab === AdminTab.AI_TOOLS && renderAITools()}
      </main>
    </div>
  );
};

export default AdminDashboard;
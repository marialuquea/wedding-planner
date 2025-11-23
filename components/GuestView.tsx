import React, { useState } from 'react';
import { WeddingDetails, RSVP } from '../types';
import { MapPin, Calendar, Heart, Gift, Music, Utensils } from 'lucide-react';

interface GuestViewProps {
  details: WeddingDetails;
  onRSVP: (rsvp: RSVP) => void;
  view: 'landing' | 'rsvp' | 'details';
  setView: (view: 'landing' | 'rsvp' | 'details') => void;
}

const GuestView: React.FC<GuestViewProps> = ({ details, onRSVP, view, setView }) => {
  const [formData, setFormData] = useState<Partial<RSVP>>({
    name: '',
    email: '',
    attending: 'yes',
    guestsCount: 1,
    dietaryRestrictions: '',
    songRequest: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.attending) {
      onRSVP({
        ...formData,
        id: crypto.randomUUID(),
        guestsCount: Number(formData.guestsCount)
      } as RSVP);
      setSubmitted(true);
    }
  };

  const renderLanding = () => (
    <div className="min-h-screen flex flex-col relative">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://picsum.photos/1920/1080?grayscale&blur=2" 
          alt="Background" 
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-wedding-charcoal/20"></div>
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
        <h1 className="text-6xl md:text-8xl text-wedding-charcoal mb-4 drop-shadow-lg">
          Ed <span className="text-wedding-rose">&</span> Erin
        </h1>
        <p className="text-xl md:text-2xl text-gray-700 tracking-widest uppercase mb-8 font-light">
          Are getting married
        </p>
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-xl inline-flex flex-col items-center gap-2 border border-wedding-rose">
          <Calendar className="w-6 h-6 text-wedding-gold" />
          <span className="text-lg font-semibold">{new Date(details.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span className="text-gray-600">{details.time}</span>
          <div className="h-px w-full bg-gray-300 my-2"></div>
          <MapPin className="w-6 h-6 text-wedding-gold" />
          <span className="text-lg font-semibold">{details.locationName}</span>
          <span className="text-gray-600 text-sm">{details.address}</span>
        </div>
        
        <div className="mt-12 flex gap-4">
          <button 
            onClick={() => setView('rsvp')}
            className="bg-wedding-charcoal text-white px-8 py-3 rounded-full hover:bg-black transition-all duration-300 shadow-lg font-semibold tracking-wide"
          >
            RSVP Now
          </button>
          <button 
            onClick={() => setView('details')}
            className="bg-white text-wedding-charcoal px-8 py-3 rounded-full hover:bg-gray-100 transition-all duration-300 shadow-lg font-semibold tracking-wide border border-gray-200"
          >
            Wedding Details
          </button>
        </div>
      </div>
    </div>
  );

  const renderDetails = () => (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-4xl text-center text-wedding-charcoal mb-12">Our Story & Details</h2>
      
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
           <img 
            src="https://picsum.photos/600/800" 
            alt="Couple" 
            className="rounded-2xl shadow-2xl object-cover h-96 w-full"
          />
        </div>
        <div className="space-y-6">
          <h3 className="text-2xl font-serif text-wedding-gold">How We Met</h3>
          <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-wrap">
            {details.ourStory || "We haven't added our story yet, but ask us in person!"}
          </p>
          <div className="flex gap-2 items-center text-wedding-rose">
            <Heart className="fill-current w-5 h-5" />
            <Heart className="fill-current w-5 h-5" />
            <Heart className="fill-current w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8 text-center">
        <div className="p-6 bg-white rounded-xl shadow-md border-t-4 border-wedding-sage">
          <Gift className="w-10 h-10 mx-auto text-wedding-sage mb-4" />
          <h4 className="text-xl font-bold mb-2">Registry</h4>
          <p className="text-gray-500 mb-4">Your presence is present enough, but if you insist:</p>
          <a href={details.registryUrl || "#"} className="text-wedding-gold hover:underline font-semibold">
            View Registry
          </a>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-md border-t-4 border-wedding-rose">
          <Utensils className="w-10 h-10 mx-auto text-wedding-rose mb-4" />
          <h4 className="text-xl font-bold mb-2">The Menu</h4>
          <p className="text-gray-500">Dinner, dancing, and drinks will follow the ceremony.</p>
        </div>
        <div className="p-6 bg-white rounded-xl shadow-md border-t-4 border-wedding-gold">
          <MapPin className="w-10 h-10 mx-auto text-wedding-gold mb-4" />
          <h4 className="text-xl font-bold mb-2">Location</h4>
          <p className="text-gray-500">{details.locationName}</p>
          <p className="text-gray-400 text-sm">{details.address}</p>
        </div>
      </div>
      
      <div className="text-center mt-12">
        <button onClick={() => setView('landing')} className="text-gray-500 hover:text-black underline">Back to Home</button>
      </div>
    </div>
  );

  const renderRSVP = () => (
    <div className="max-w-2xl mx-auto px-4 py-12">
       <h2 className="text-4xl text-center text-wedding-charcoal mb-8">RSVP</h2>
       {submitted ? (
         <div className="bg-green-50 border border-green-200 text-green-800 p-8 rounded-xl text-center shadow-sm">
           <Heart className="w-12 h-12 mx-auto mb-4 text-green-600 fill-current" />
           <h3 className="text-2xl font-bold mb-2">Thank you!</h3>
           <p>Your response has been recorded. We can't wait to celebrate with you.</p>
           <button onClick={() => setView('landing')} className="mt-6 text-green-700 font-semibold hover:underline">Return Home</button>
         </div>
       ) : (
         <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
           <div className="space-y-6">
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
               <input 
                 required
                 type="text" 
                 value={formData.name}
                 onChange={(e) => setFormData({...formData, name: e.target.value})}
                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-rose focus:border-transparent outline-none"
                 placeholder="John Doe"
               />
             </div>
             
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
               <input 
                 required
                 type="email" 
                 value={formData.email}
                 onChange={(e) => setFormData({...formData, email: e.target.value})}
                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-wedding-rose focus:border-transparent outline-none"
                 placeholder="john@example.com"
               />
             </div>

             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Will you be attending?</label>
               <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="attending" 
                      checked={formData.attending === 'yes'}
                      onChange={() => setFormData({...formData, attending: 'yes'})}
                      className="text-wedding-rose focus:ring-wedding-rose"
                    />
                    <span>Joyfully Accept</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="attending" 
                      checked={formData.attending === 'no'}
                      onChange={() => setFormData({...formData, attending: 'no'})}
                      className="text-wedding-rose focus:ring-wedding-rose"
                    />
                    <span>Regretfully Decline</span>
                  </label>
               </div>
             </div>

             {formData.attending === 'yes' && (
               <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Number of Guests</label>
                  <select 
                    value={formData.guestsCount}
                    onChange={(e) => setFormData({...formData, guestsCount: Number(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none"
                  >
                    {[1,2,3,4,5].map(n => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dietary Restrictions</label>
                  <textarea 
                    value={formData.dietaryRestrictions}
                    onChange={(e) => setFormData({...formData, dietaryRestrictions: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg outline-none h-20 resize-none"
                    placeholder="Allergies, vegetarian, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">I promise to dance if you play...</label>
                  <div className="relative">
                    <Music className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
                    <input 
                      type="text" 
                      value={formData.songRequest}
                      onChange={(e) => setFormData({...formData, songRequest: e.target.value})}
                      className="w-full pl-10 px-4 py-2 border border-gray-300 rounded-lg outline-none"
                      placeholder="Song name / Artist"
                    />
                  </div>
                </div>
               </>
             )}

             <button 
               type="submit" 
               className="w-full bg-wedding-gold text-white font-bold py-3 rounded-lg hover:bg-yellow-600 transition-colors shadow-md"
             >
               Submit RSVP
             </button>
             <div className="text-center mt-4">
                <button type="button" onClick={() => setView('landing')} className="text-sm text-gray-500 hover:text-black">Cancel</button>
             </div>
           </div>
         </form>
       )}
    </div>
  );

  if (view === 'details') return renderDetails();
  if (view === 'rsvp') return renderRSVP();
  return renderLanding();
};

export default GuestView;
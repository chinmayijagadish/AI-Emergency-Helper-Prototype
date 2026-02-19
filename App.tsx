
import React, { useState, useRef, useEffect } from 'react';
import { Search, Phone, Send, AlertCircle, Loader2, X } from 'lucide-react';
import { getFirstAidGuidance } from './services/geminiService';
import { AppState } from './types';
import ResponseCard from './components/ResponseCard';

const App: React.FC = () => {
  const [query, setQuery] = useState('');
  const [state, setState] = useState<AppState>({
    loading: false,
    error: null,
    response: null,
  });
  const [showCallAlert, setShowCallAlert] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleGetHelp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setState({ ...state, loading: true, error: null });
    
    try {
      const guidance = await getFirstAidGuidance(query);
      setState({
        loading: false,
        error: null,
        response: guidance,
      });
    } catch (err: any) {
      setState({
        loading: false,
        error: err.message,
        response: null,
      });
    }
  };

  const handleCallEmergency = () => {
    setShowCallAlert(true);
  };

  useEffect(() => {
    if (state.response && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [state.response]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30 px-4 py-4 md:px-8">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-black text-red-600 flex items-center gap-2">
            AI Emergency Helper 🚨
          </h1>
          <button 
            onClick={handleCallEmergency}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-full font-bold text-sm hover:bg-red-700 transition-colors shadow-lg shadow-red-200"
          >
            <Phone className="w-4 h-4" />
            <span className="hidden sm:inline">Call Emergency</span>
            <span className="sm:hidden">Call</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Input Section */}
        <section className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-gray-200/50 mb-8 border border-white">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">How can I help you?</h2>
            <p className="text-gray-500">Describe the situation as clearly as possible for instant first aid guidance.</p>
          </div>

          <form onSubmit={handleGetHelp} className="relative">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., person fainted suddenly, child choking on candy, severe burn from hot water..."
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-4 min-h-[120px] focus:outline-none focus:border-red-400 focus:ring-4 focus:ring-red-50 transition-all text-gray-700 placeholder-gray-400"
              disabled={state.loading}
            />
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <button
                type="submit"
                disabled={state.loading || !query.trim()}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-bold transition-all ${
                  state.loading || !query.trim()
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-900 text-white hover:bg-black shadow-lg hover:shadow-gray-300'
                }`}
              >
                {state.loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Analyzing Situation...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Get Help
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Loading/Error/Results Area */}
        <div ref={resultRef}>
          {state.error && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-6 mb-8 flex items-start gap-4 text-red-800">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <div>
                <p className="font-bold mb-1">Error Encountered</p>
                <p>{state.error}</p>
              </div>
            </div>
          )}

          {state.loading && !state.response && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 relative">
                <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
                <div className="absolute inset-0 rounded-full border-4 border-red-100 border-t-red-600 animate-spin"></div>
              </div>
              <p className="text-gray-500 font-medium">Consulting emergency protocols...</p>
              <p className="text-gray-400 text-sm mt-2">Always prioritize contacting 911 or local services.</p>
            </div>
          )}

          {state.response && (
            <ResponseCard data={state.response} />
          )}

          {!state.loading && !state.response && !state.error && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 opacity-60">
              {[
                "Person fainted",
                "Severe bleeding",
                "Choking victim",
                "Electric shock",
                "Burns",
                "Breathing problems"
              ].map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setQuery(suggestion);
                    // Trigger manual search would require a small refactor to handleGetHelp
                  }}
                  className="bg-white border border-gray-100 p-4 rounded-xl text-left hover:border-red-200 hover:bg-red-50 transition-colors text-gray-600 text-sm"
                >
                  <span className="font-bold text-red-500 mr-2">Quick:</span>
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Emergency Call Alert Dialog */}
      {showCallAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center">
                <Phone className="w-6 h-6" />
              </div>
              <button 
                onClick={() => setShowCallAlert(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <h3 className="text-xl font-black text-gray-900 mb-2">EMERGENCY SERVICES</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Please contact your local emergency number (e.g., 911, 999, 112) immediately for professional medical assistance.
            </p>
            <button
              onClick={() => setShowCallAlert(false)}
              className="w-full bg-red-600 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-colors"
            >
              OK, I Understand
            </button>
          </div>
        </div>
      )}

      {/* Footer Disclaimer for the whole app */}
      <footer className="mt-12 text-center text-xs text-gray-400 max-w-lg mx-auto px-4 py-8">
        This application provides first-aid information and is not a substitute for professional medical advice, diagnosis, or treatment. In life-threatening situations, always contact emergency services immediately.
      </footer>
    </div>
  );
};

export default App;

import React, { useState } from 'react';
import { Scale, Users, PieChart, MessageSquare } from 'lucide-react';
import KanbanColumn from './components/KanbanColumn';
import ClientProfile from './components/ClientProfile';
import PipelineView from './components/PipelineView';
import LeadForm from './components/LeadForm';
import WhatsAppConfig from './components/WhatsAppConfig';
import { initialClients, currentUser } from './data';
import { Client, Column, Lead, PipelineStage } from './types';

function App() {
  // ... resto do código existente ...

  const [isWhatsAppConfigOpen, setIsWhatsAppConfigOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="h-6 w-6 text-indigo-600" />
              <h1 className="text-xl font-semibold text-gray-900">Legal CRM</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsWhatsAppConfigOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                <MessageSquare size={16} />
                <span>Config. WhatsApp</span>
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => setView('cases')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    view === 'cases'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Casos
                </button>
                <button
                  onClick={() => setView('pipeline')}
                  className={`px-4 py-2 rounded-md transition-colors ${
                    view === 'pipeline'
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Pipeline
                </button>
              </div>
              <button
                onClick={() => setIsLeadFormOpen(true)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                {view === 'cases' ? 'Novo Cliente' : 'Novo Lead'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ... resto do código existente ... */}

      <WhatsAppConfig
        isOpen={isWhatsAppConfigOpen}
        onClose={() => setIsWhatsAppConfigOpen(false)}
      />
    </div>
  );
}

export default App;
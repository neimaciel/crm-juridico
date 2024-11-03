import React from 'react';
import { Client } from '../types';
import { Calendar } from 'lucide-react';

interface Props {
  client: Client;
  onClick: (client: Client) => void;
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-red-100 text-red-800',
};

export default function ClientCard({ client, onClick }: Props) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('clientId', client.id);
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-md p-4 mb-3 cursor-pointer hover:shadow-lg transition-shadow"
      draggable
      onDragStart={handleDragStart}
      onClick={() => onClick(client)}
    >
      <div className="flex items-center gap-3 mb-3">
        <img
          src={client.avatar}
          alt={client.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h3 className="font-semibold text-gray-800">{client.name}</h3>
          <p className="text-sm text-gray-500">{client.caseNumber}</p>
        </div>
      </div>
      
      <div className="flex gap-2 mb-3">
        <span className={`text-xs px-2 py-1 rounded-full ${priorityColors[client.priority]}`}>
          {client.priority.toUpperCase()}
        </span>
        <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800">
          {client.caseType}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-3">{client.description}</p>

      <div className="border-t pt-3">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          {client.nextHearing && (
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{new Date(client.nextHearing).toLocaleDateString()}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
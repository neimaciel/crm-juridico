import React from 'react';
import { Column, Client } from '../types';
import ClientCard from './ClientCard';

interface Props {
  column: Column;
  onDrop: (clientId: string, newStatus: Client['status']) => void;
  onClientClick: (client: Client) => void;
}

export default function KanbanColumn({ column, onDrop, onClientClick }: Props) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const clientId = e.dataTransfer.getData('clientId');
    onDrop(clientId, column.id as Client['status']);
  };

  return (
    <div 
      className="w-80 flex-shrink-0"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="bg-gray-100 rounded-lg p-4 min-h-[200px]">
        <h2 className="font-semibold text-gray-700 mb-4 flex items-center justify-between">
          {column.title}
          <span className="bg-gray-200 text-gray-600 text-sm px-2 py-1 rounded">
            {column.cases.length}
          </span>
        </h2>
        <div className="space-y-3">
          {column.cases.map((client) => (
            <ClientCard 
              key={client.id} 
              client={client} 
              onClick={onClientClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
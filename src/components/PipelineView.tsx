import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Lead, PipelineStage } from '../types';
import { MoreVertical, DollarSign, Calendar, Mail } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Props {
  stages: PipelineStage[];
  onLeadMove: (leadId: string, sourceStage: string, destinationStage: string) => void;
  onLeadClick: (lead: Lead) => void;
}

export default function PipelineView({ stages, onLeadMove, onLeadClick }: Props) {
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceStageId = result.source.droppableId;
    const destinationStageId = result.destination.droppableId;
    const leadId = result.draggableId;

    if (sourceStageId !== destinationStageId) {
      onLeadMove(leadId, sourceStageId, destinationStageId);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 min-h-[calc(100vh-12rem)]">
        {stages.map((stage) => (
          <div key={stage.id} className="w-80 flex-shrink-0">
            <div 
              className="rounded-t-lg p-3"
              style={{ backgroundColor: stage.color + '20' }}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold" style={{ color: stage.color }}>
                  {stage.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    {stage.leads.length} leads
                  </span>
                  <span className="text-sm font-medium" style={{ color: stage.color }}>
                    {stage.probability}%
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {formatCurrency(stage.leads.reduce((sum, lead) => sum + lead.value, 0))}
              </div>
            </div>

            <Droppable droppableId={stage.id}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-gray-50 rounded-b-lg p-2 min-h-[200px]"
                >
                  {stage.leads.map((lead, index) => (
                    <Draggable key={lead.id} draggableId={lead.id} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="bg-white rounded-lg shadow-sm p-3 mb-2 cursor-pointer hover:shadow-md transition-shadow"
                          onClick={() => onLeadClick(lead)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{lead.name}</h4>
                            <button className="text-gray-400 hover:text-gray-600">
                              <MoreVertical size={16} />
                            </button>
                          </div>
                          
                          {lead.company && (
                            <p className="text-sm text-gray-600 mb-2">
                              {lead.company}
                            </p>
                          )}

                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <DollarSign size={14} />
                              <span>{formatCurrency(lead.value)}</span>
                            </div>
                            {lead.nextFollowUp && (
                              <div className="flex items-center gap-1">
                                <Calendar size={14} />
                                <span>
                                  {format(new Date(lead.nextFollowUp), "dd/MM", { locale: ptBR })}
                                </span>
                              </div>
                            )}
                          </div>

                          {lead.tags.length > 0 && (
                            <div className="flex gap-1 mt-2">
                              {lead.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 rounded-full text-xs bg-gray-100 text-gray-600"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}
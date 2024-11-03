import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Client, Message, Note } from '../types';
import { Phone, Mail, MapPin, MessageSquare, Calendar, Upload, FileText, Edit, Plus, ListTodo, Paperclip, Send, Clock } from 'lucide-react';
import { initialMessages, currentUser } from '../data';
import TaskManager from './TaskManager';

interface Props {
  client: Client;
  isOpen: boolean;
  onClose: () => void;
}

export default function ClientProfile({ client, isOpen, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<'messages' | 'notes' | 'documents' | 'tasks'>('messages');
  const [newNote, setNewNote] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [isTaskManagerOpen, setIsTaskManagerOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages.filter(m => m.clientId === client.id));
  const hasDocumentAccess = currentUser.permissions.includes('view_documents');

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      clientId: client.id,
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: 'whatsapp',
      sender: 'lawyer',
      status: 'sent'
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;

    const note: Note = {
      id: Date.now().toString(),
      content: newNote,
      createdAt: new Date().toISOString(),
      createdBy: currentUser,
      visibility: 'team',
      tags: []
    };

    client.notes.unshift(note);
    setNewNote('');
  };

  return (
    <>
      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex h-full">
              {/* Left sidebar with client info */}
              <div className="w-1/3 bg-gray-50 p-6 border-r overflow-y-auto">
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={client.avatar}
                    alt={client.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{client.name}</h2>
                    <p className="text-sm text-gray-500">{client.caseNumber}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={16} />
                    <span>{client.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={16} />
                    <span>{client.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={16} />
                    <span>{client.address}</span>
                  </div>
                  {client.nextHearing && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar size={16} />
                      <span>Próxima Audiência: {format(new Date(client.nextHearing), "dd/MM/yyyy", { locale: ptBR })}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <h3 className="font-medium text-gray-900 mb-2">Equipe Responsável</h3>
                  <div className="flex -space-x-2">
                    {client.assignedTeam.map((member) => (
                      <img
                        key={member.id}
                        src={member.avatar}
                        alt={member.name}
                        className="w-8 h-8 rounded-full border-2 border-white"
                        title={member.name}
                      />
                    ))}
                    <button className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200">
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="font-medium text-gray-900 mb-2">Partes Relacionadas</h3>
                  {client.relatedParties.map((party) => (
                    <div key={party.id} className="bg-white rounded-lg p-3 mb-2">
                      <div className="font-medium text-gray-900">{party.name}</div>
                      <div className="text-sm text-gray-500">{party.type}</div>
                      {party.representation && (
                        <div className="text-sm text-gray-600 mt-1">
                          {party.representation.lawyer} - {party.representation.lawFirm}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <button
                    onClick={() => setIsTaskManagerOpen(true)}
                    className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <ListTodo size={16} />
                    <span>Gerenciar Tarefas</span>
                  </button>
                </div>
              </div>

              {/* Main content area */}
              <div className="flex-1 flex flex-col h-full">
                {/* Tabs */}
                <div className="flex border-b">
                  <button
                    onClick={() => setActiveTab('messages')}
                    className={`px-4 py-3 text-sm font-medium ${
                      activeTab === 'messages'
                        ? 'border-b-2 border-indigo-600 text-indigo-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Mensagens
                  </button>
                  <button
                    onClick={() => setActiveTab('notes')}
                    className={`px-4 py-3 text-sm font-medium ${
                      activeTab === 'notes'
                        ? 'border-b-2 border-indigo-600 text-indigo-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Anotações
                  </button>
                  <button
                    onClick={() => setActiveTab('documents')}
                    className={`px-4 py-3 text-sm font-medium ${
                      activeTab === 'documents'
                        ? 'border-b-2 border-indigo-600 text-indigo-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Documentos
                  </button>
                </div>

                {/* Tab content */}
                <div className="flex-1 overflow-y-auto p-4">
                  {activeTab === 'messages' && (
                    <div className="flex flex-col h-full">
                      <div className="flex-1 overflow-y-auto mb-4">
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`mb-4 flex ${
                              message.sender === 'lawyer' ? 'justify-end' : 'justify-start'
                            }`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                message.sender === 'lawyer'
                                  ? 'bg-indigo-600 text-white'
                                  : 'bg-gray-100 text-gray-900'
                              }`}
                            >
                              <p>{message.content}</p>
                              <div
                                className={`text-xs mt-1 ${
                                  message.sender === 'lawyer' ? 'text-indigo-200' : 'text-gray-500'
                                }`}
                              >
                                {format(new Date(message.timestamp), "HH:mm", { locale: ptBR })}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t pt-4">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Digite sua mensagem..."
                            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          />
                          <button
                            onClick={handleSendMessage}
                            className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700"
                          >
                            <Send size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'notes' && (
                    <div>
                      <div className="mb-4">
                        <textarea
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          placeholder="Adicionar uma nova anotação..."
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          rows={3}
                        />
                        <div className="flex justify-end mt-2">
                          <button
                            onClick={handleAddNote}
                            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                          >
                            Adicionar Nota
                          </button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {client.notes.map((note) => (
                          <div key={note.id} className="bg-gray-50 rounded-lg p-4">
                            <p className="text-gray-900 mb-2">{note.content}</p>
                            <div className="flex items-center justify-between text-sm text-gray-500">
                              <div className="flex items-center gap-2">
                                <img
                                  src={note.createdBy.avatar}
                                  alt={note.createdBy.name}
                                  className="w-6 h-6 rounded-full"
                                />
                                <span>{note.createdBy.name}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock size={14} />
                                <span>
                                  {format(new Date(note.createdAt), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'documents' && hasDocumentAccess && (
                    <div>
                      <div className="mb-4">
                        <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                          <Upload size={16} />
                          <span>Upload de Documento</span>
                        </button>
                      </div>

                      <div className="space-y-2">
                        {client.documents.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between bg-white p-3 rounded-lg border"
                          >
                            <div className="flex items-center gap-3">
                              <FileText size={20} className="text-gray-400" />
                              <div>
                                <div className="font-medium text-gray-900">{doc.name}</div>
                                <div className="text-sm text-gray-500">
                                  {format(new Date(doc.uploadedAt), "dd/MM/yyyy", { locale: ptBR })}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="text-gray-400 hover:text-gray-600">
                                <Edit size={16} />
                              </button>
                              <a
                                href={doc.url}
                                className="text-indigo-600 hover:text-indigo-700"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                Download
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {isTaskManagerOpen && (
        <TaskManager
          client={client}
          isOpen={isTaskManagerOpen}
          onClose={() => setIsTaskManagerOpen(false)}
        />
      )}
    </>
  );
}
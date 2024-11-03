import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { EmailTemplate } from '../types';
import { X, Variable, Plus } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (template: EmailTemplate) => void;
}

export default function EmailBuilder({ isOpen, onClose, onSave }: Props) {
  const [template, setTemplate] = useState<Partial<EmailTemplate>>({
    name: '',
    subject: '',
    content: '',
    variables: [],
    category: 'custom',
  });

  const [newVariable, setNewVariable] = useState('');

  const handleAddVariable = () => {
    if (newVariable.trim() && !template.variables?.includes(newVariable.trim())) {
      setTemplate({
        ...template,
        variables: [...(template.variables || []), newVariable.trim()],
      });
      setNewVariable('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...template,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as EmailTemplate);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
          <div className="flex items-center justify-between p-6 border-b">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              Novo Template de Email
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Template
                </label>
                <input
                  type="text"
                  required
                  value={template.name}
                  onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ex: Email de Boas-vindas"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoria
                </label>
                <select
                  value={template.category}
                  onChange={(e) => setTemplate({ ...template, category: e.target.value as any })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="follow_up">Follow-up</option>
                  <option value="proposal">Proposta</option>
                  <option value="welcome">Boas-vindas</option>
                  <option value="custom">Personalizado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assunto
                </label>
                <input
                  type="text"
                  required
                  value={template.subject}
                  onChange={(e) => setTemplate({ ...template, subject: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Assunto do email"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Conteúdo
                </label>
                <textarea
                  required
                  value={template.content}
                  onChange={(e) => setTemplate({ ...template, content: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={10}
                  placeholder="Conteúdo do email..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Variáveis
                </label>
                <div className="flex gap-2 mb-2">
                  {template.variables?.map((variable) => (
                    <span
                      key={variable}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm bg-indigo-100 text-indigo-700"
                    >
                      {variable}
                      <button
                        type="button"
                        onClick={() => {
                          setTemplate({
                            ...template,
                            variables: template.variables?.filter(v => v !== variable),
                          });
                        }}
                        className="text-indigo-400 hover:text-indigo-600"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newVariable}
                    onChange={(e) => setNewVariable(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddVariable()}
                    placeholder="Nova variável..."
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddVariable}
                    className="flex items-center justify-center w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 hover:bg-indigo-200"
                  >
                    <Plus size={20} />
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Use {{variavel}} no conteúdo para inserir variáveis dinâmicas
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Salvar Template
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
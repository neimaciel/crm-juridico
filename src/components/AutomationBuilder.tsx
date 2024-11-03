import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { AutomationRule, Lead } from '../types';
import { Play, Pause, Plus, X, Settings, Mail, Bell, UserPlus } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (rule: AutomationRule) => void;
}

export default function AutomationBuilder({ isOpen, onClose, onSave }: Props) {
  const [rule, setRule] = useState<Partial<AutomationRule>>({
    name: '',
    trigger: {
      type: 'lead_status_change',
      conditions: [],
    },
    actions: [],
    isActive: true,
  });

  const triggerTypes = [
    { id: 'lead_status_change', label: 'Mudança de Status do Lead' },
    { id: 'task_completed', label: 'Tarefa Concluída' },
    { id: 'email_opened', label: 'Email Aberto' },
    { id: 'form_submitted', label: 'Formulário Enviado' },
  ];

  const actionTypes = [
    { id: 'create_task', label: 'Criar Tarefa', icon: Plus },
    { id: 'send_email', label: 'Enviar Email', icon: Mail },
    { id: 'update_lead', label: 'Atualizar Lead', icon: Settings },
    { id: 'notify_user', label: 'Notificar Usuário', icon: Bell },
  ];

  const handleAddCondition = () => {
    setRule(prev => ({
      ...prev,
      trigger: {
        ...prev.trigger!,
        conditions: [
          ...(prev.trigger?.conditions || []),
          { field: '', operator: 'equals', value: '' },
        ],
      },
    }));
  };

  const handleAddAction = (type: string) => {
    setRule(prev => ({
      ...prev,
      actions: [
        ...(prev.actions || []),
        { type, params: {} },
      ],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(rule as AutomationRule);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
          <div className="flex items-center justify-between p-6 border-b">
            <Dialog.Title className="text-lg font-semibold text-gray-900">
              Nova Automação
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
                  Nome da Automação
                </label>
                <input
                  type="text"
                  required
                  value={rule.name}
                  onChange={(e) => setRule({ ...rule, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Ex: Enviar email de boas-vindas"
                />
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Gatilho</h3>
                <select
                  value={rule.trigger?.type}
                  onChange={(e) => setRule({
                    ...rule,
                    trigger: { ...rule.trigger!, type: e.target.value as any },
                  })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {triggerTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.label}
                    </option>
                  ))}
                </select>

                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm font-medium text-gray-700">Condições</h4>
                    <button
                      type="button"
                      onClick={handleAddCondition}
                      className="text-sm text-indigo-600 hover:text-indigo-700"
                    >
                      Adicionar Condição
                    </button>
                  </div>
                  {rule.trigger?.conditions.map((condition, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={condition.field}
                        onChange={(e) => {
                          const newConditions = [...rule.trigger!.conditions];
                          newConditions[index].field = e.target.value;
                          setRule({
                            ...rule,
                            trigger: { ...rule.trigger!, conditions: newConditions },
                          });
                        }}
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Campo"
                      />
                      <select
                        value={condition.operator}
                        onChange={(e) => {
                          const newConditions = [...rule.trigger!.conditions];
                          newConditions[index].operator = e.target.value as any;
                          setRule({
                            ...rule,
                            trigger: { ...rule.trigger!, conditions: newConditions },
                          });
                        }}
                        className="w-40 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      >
                        <option value="equals">Igual a</option>
                        <option value="not_equals">Diferente de</option>
                        <option value="contains">Contém</option>
                        <option value="greater_than">Maior que</option>
                        <option value="less_than">Menor que</option>
                      </select>
                      <input
                        type="text"
                        value={condition.value}
                        onChange={(e) => {
                          const newConditions = [...rule.trigger!.conditions];
                          newConditions[index].value = e.target.value;
                          setRule({
                            ...rule,
                            trigger: { ...rule.trigger!, conditions: newConditions },
                          });
                        }}
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        placeholder="Valor"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newConditions = rule.trigger!.conditions.filter((_, i) => i !== index);
                          setRule({
                            ...rule,
                            trigger: { ...rule.trigger!, conditions: newConditions },
                          });
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Ações</h3>
                <div className="grid grid-cols-2 gap-2">
                  {actionTypes.map(action => (
                    <button
                      key={action.id}
                      type="button"
                      onClick={() => handleAddAction(action.id)}
                      className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                    >
                      <action.icon size={20} className="text-gray-500" />
                      <span>{action.label}</span>
                    </button>
                  ))}
                </div>

                <div className="mt-4 space-y-4">
                  {rule.actions?.map((action, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-4 relative"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          const newActions = rule.actions!.filter((_, i) => i !== index);
                          setRule({ ...rule, actions: newActions });
                        }}
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                      >
                        <X size={16} />
                      </button>

                      <h4 className="font-medium text-gray-900 mb-2">
                        {actionTypes.find(a => a.id === action.type)?.label}
                      </h4>

                      {action.type === 'send_email' && (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={action.params.subject || ''}
                            onChange={(e) => {
                              const newActions = [...rule.actions!];
                              newActions[index].params.subject = e.target.value;
                              setRule({ ...rule, actions: newActions });
                            }}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Assunto do email"
                          />
                          <textarea
                            value={action.params.content || ''}
                            onChange={(e) => {
                              const newActions = [...rule.actions!];
                              newActions[index].params.content = e.target.value;
                              setRule({ ...rule, actions: newActions });
                            }}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Conteúdo do email"
                            rows={3}
                          />
                        </div>
                      )}

                      {action.type === 'create_task' && (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={action.params.title || ''}
                            onChange={(e) => {
                              const newActions = [...rule.actions!];
                              newActions[index].params.title = e.target.value;
                              setRule({ ...rule, actions: newActions });
                            }}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Título da tarefa"
                          />
                          <select
                            value={action.params.priority || 'medium'}
                            onChange={(e) => {
                              const newActions = [...rule.actions!];
                              newActions[index].params.priority = e.target.value;
                              setRule({ ...rule, actions: newActions });
                            }}
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="low">Baixa</option>
                            <option value="medium">Média</option>
                            <option value="high">Alta</option>
                          </select>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
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
                Salvar Automação
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
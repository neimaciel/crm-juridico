import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Task, Client, ReminderTime } from '../types';
import { Clock, Calendar, AlertCircle, Check, X, Edit2, Trash2 } from 'lucide-react';
import { currentUser } from '../data';

interface Props {
  client: Client;
  isOpen: boolean;
  onClose: () => void;
}

export default function TaskManager({ client, isOpen, onClose }: Props) {
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium' as const,
    reminderTimes: [] as ReminderTime[]
  });

  const handleCreateTask = () => {
    const task: Task = {
      id: Date.now().toString(),
      ...newTask,
      status: 'pending',
      assignedTo: currentUser,
      createdBy: currentUser,
      createdAt: new Date().toISOString(),
      clientId: client.id
    };

    client.tasks.push(task);
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      reminderTimes: []
    });
    setIsNewTaskModalOpen(false);
  };

  const handleUpdateTask = (task: Task) => {
    const index = client.tasks.findIndex(t => t.id === task.id);
    if (index !== -1) {
      client.tasks[index] = {
        ...task,
        updatedAt: new Date().toISOString()
      };
    }
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    const index = client.tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      client.tasks.splice(index, 1);
    }
  };

  const toggleReminder = (reminder: ReminderTime) => {
    const current = new Set(newTask.reminderTimes);
    if (current.has(reminder)) {
      current.delete(reminder);
    } else {
      current.add(reminder);
    }
    setNewTask({ ...newTask, reminderTimes: Array.from(current) });
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-blue-600 bg-blue-50';
    }
  };

  const renderTaskCard = (task: Task) => (
    <div key={task.id} className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-900">{task.title}</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditingTask(task)}
            className="text-gray-500 hover:text-gray-700"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={() => handleDeleteTask(task.id)}
            className="text-gray-500 hover:text-red-600"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="text-gray-600 text-sm mb-3">{task.description}</p>
      )}

      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <Calendar size={14} className="text-gray-500" />
          <span>{format(new Date(task.dueDate), "dd/MM/yyyy", { locale: ptBR })}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={14} className="text-gray-500" />
          <span>{format(new Date(task.dueDate), "HH:mm", { locale: ptBR })}</span>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs ${getPriorityColor(task.priority)}`}>
          {task.priority.toUpperCase()}
        </span>
      </div>

      {task.reminderTimes.length > 0 && (
        <div className="mt-3 flex gap-2">
          {task.reminderTimes.map(reminder => (
            <span key={reminder} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
              {reminder === '3_days' ? '3 dias antes' : 
               reminder === '1_day' ? '1 dia antes' : 
               '3 horas antes'}
            </span>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Gerenciar Tarefas</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X size={20} />
              </button>
            </div>

            <button
              onClick={() => setIsNewTaskModalOpen(true)}
              className="w-full mb-6 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Nova Tarefa
            </button>

            <div className="space-y-4">
              {client.tasks?.map(renderTaskCard)}
            </div>
          </div>
        </Dialog.Panel>
      </div>

      {/* New Task Modal */}
      <Dialog open={isNewTaskModalOpen} onClose={() => setIsNewTaskModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Nova Tarefa</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Título
                </label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descrição
                </label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data e Hora
                </label>
                <input
                  type="datetime-local"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Prioridade
                </label>
                <select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as Task['priority'] })}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="low">Baixa</option>
                  <option value="medium">Média</option>
                  <option value="high">Alta</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Lembretes
                </label>
                <div className="flex gap-2">
                  {(['3_days', '1_day', '3_hours'] as ReminderTime[]).map((reminder) => (
                    <button
                      key={reminder}
                      onClick={() => toggleReminder(reminder)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        newTask.reminderTimes.includes(reminder)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {reminder === '3_days' ? '3 dias' :
                       reminder === '1_day' ? '1 dia' :
                       '3 horas'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsNewTaskModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateTask}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Criar Tarefa
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Edit Task Modal */}
      {editingTask && (
        <Dialog open={!!editingTask} onClose={() => setEditingTask(null)} className="relative z-50">
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <Dialog.Panel className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Editar Tarefa</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Título
                  </label>
                  <input
                    type="text"
                    value={editingTask.title}
                    onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descrição
                  </label>
                  <textarea
                    value={editingTask.description}
                    onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data e Hora
                  </label>
                  <input
                    type="datetime-local"
                    value={editingTask.dueDate}
                    onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prioridade
                  </label>
                  <select
                    value={editingTask.priority}
                    onChange={(e) => setEditingTask({ ...editingTask, priority: e.target.value as Task['priority'] })}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Lembretes
                  </label>
                  <div className="flex gap-2">
                    {(['3_days', '1_day', '3_hours'] as ReminderTime[]).map((reminder) => (
                      <button
                        key={reminder}
                        onClick={() => {
                          const current = new Set(editingTask.reminderTimes);
                          if (current.has(reminder)) {
                            current.delete(reminder);
                          } else {
                            current.add(reminder);
                          }
                          setEditingTask({
                            ...editingTask,
                            reminderTimes: Array.from(current)
                          });
                        }}
                        className={`px-3 py-1 rounded-full text-sm ${
                          editingTask.reminderTimes.includes(reminder)
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {reminder === '3_days' ? '3 dias' :
                         reminder === '1_day' ? '1 dia' :
                         '3 horas'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() => setEditingTask(null)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => handleUpdateTask(editingTask)}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  Salvar Alterações
                </button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </Dialog>
  );
}
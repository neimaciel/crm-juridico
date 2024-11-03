import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { MessageSquare, Key, Link, Save, X, TestTube, Check } from 'lucide-react';
import { setupWebhook, sendWhatsAppMessage } from '../services/whatsapp';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function WhatsAppConfig({ isOpen, onClose }: Props) {
  const [config, setConfig] = useState({
    phoneNumberId: '',
    apiToken: '',
    webhookUrl: '',
    verificationToken: ''
  });

  const [testNumber, setTestNumber] = useState('');
  const [testMessage, setTestMessage] = useState('');
  const [status, setStatus] = useState<{
    type: 'success' | 'error' | 'info' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleSave = async () => {
    try {
      // Salva as configurações no localStorage
      localStorage.setItem('whatsappConfig', JSON.stringify(config));
      
      // Configura o webhook
      if (config.webhookUrl) {
        await setupWebhook(config.webhookUrl);
      }

      setStatus({
        type: 'success',
        message: 'Configurações salvas com sucesso!'
      });

      // Atualiza as variáveis de ambiente em tempo real
      window.process = window.process || {};
      window.process.env = window.process.env || {};
      window.process.env.VITE_WHATSAPP_API_URL = `https://graph.facebook.com/v17.0/${config.phoneNumberId}`;
      window.process.env.VITE_WHATSAPP_API_TOKEN = config.apiToken;
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Erro ao salvar as configurações: ' + (error as Error).message
      });
    }
  };

  const handleTest = async () => {
    try {
      setStatus({ type: 'info', message: 'Enviando mensagem de teste...' });
      
      await sendWhatsAppMessage(testNumber, testMessage);
      
      setStatus({
        type: 'success',
        message: 'Mensagem de teste enviada com sucesso!'
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'Erro ao enviar mensagem de teste: ' + (error as Error).message
      });
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded-xl shadow-xl w-full max-w-2xl">
          <div className="flex items-center justify-between p-6 border-b">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-6 h-6 text-green-600" />
              <Dialog.Title className="text-lg font-semibold text-gray-900">
                Configuração do WhatsApp Business
              </Dialog.Title>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={20} />
            </button>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              {/* Configurações Principais */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  Configurações da API
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number ID
                    </label>
                    <input
                      type="text"
                      value={config.phoneNumberId}
                      onChange={(e) => setConfig({ ...config, phoneNumberId: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Ex: 123456789"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Encontre este ID no painel do WhatsApp Business
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Token de Acesso
                    </label>
                    <input
                      type="password"
                      value={config.apiToken}
                      onChange={(e) => setConfig({ ...config, apiToken: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Seu token de acesso do WhatsApp Business API"
                    />
                  </div>
                </div>
              </div>

              {/* Configurações do Webhook */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  Configurações do Webhook
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL do Webhook
                    </label>
                    <input
                      type="url"
                      value={config.webhookUrl}
                      onChange={(e) => setConfig({ ...config, webhookUrl: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="https://seu-dominio.com/api/webhook"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Token de Verificação
                    </label>
                    <input
                      type="text"
                      value={config.verificationToken}
                      onChange={(e) => setConfig({ ...config, verificationToken: e.target.value })}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Token para verificação do webhook"
                    />
                  </div>
                </div>
              </div>

              {/* Teste de Mensagem */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  Teste de Integração
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Número para Teste
                    </label>
                    <input
                      type="tel"
                      value={testNumber}
                      onChange={(e) => setTestNumber(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="+5511999999999"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Mensagem de Teste
                    </label>
                    <textarea
                      value={testMessage}
                      onChange={(e) => setTestMessage(e.target.value)}
                      className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      rows={2}
                      placeholder="Digite uma mensagem de teste"
                    />
                  </div>

                  <button
                    onClick={handleTest}
                    className="w-full flex items-center justify-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <TestTube size={16} />
                    <span>Enviar Mensagem de Teste</span>
                  </button>
                </div>
              </div>

              {/* Status */}
              {status.type && (
                <div
                  className={`p-4 rounded-lg ${
                    status.type === 'success' ? 'bg-green-50 text-green-700' :
                    status.type === 'error' ? 'bg-red-50 text-red-700' :
                    'bg-blue-50 text-blue-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {status.type === 'success' ? (
                      <Check size={16} />
                    ) : status.type === 'error' ? (
                      <X size={16} />
                    ) : (
                      <TestTube size={16} />
                    )}
                    <span>{status.message}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save size={16} />
                <span>Salvar Configurações</span>
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}